import io
import paramiko
import logging
import socket
import time

logger = logging.getLogger(__name__)

class SSHManager:
    """
    Manager for SSH connections to remote servers
    """
    
    def __init__(self):
        # Increase paramiko logging level to suppress verbose logs
        paramiko_logger = logging.getLogger("paramiko")
        paramiko_logger.setLevel(logging.WARNING)
    
    def get_ssh_client(self, server):
        """
        Create an SSH client for the server
        
        Args:
            server: Server object with connection details
            
        Returns:
            paramiko.SSHClient
        """
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        try:
            if server.use_key_auth and server.ssh_key:
                # Use private key authentication
                private_key = paramiko.RSAKey.from_private_key(io.StringIO(server.ssh_key))
                client.connect(
                    hostname=server.hostname,
                    port=server.port,
                    username=server.username,
                    pkey=private_key,
                    timeout=10
                )
            else:
                # Use password authentication
                client.connect(
                    hostname=server.hostname,
                    port=server.port,
                    username=server.username,
                    password=server.password,
                    timeout=10
                )
                
            return client
            
        except Exception as e:
            logger.error(f"SSH connection error to {server.hostname}: {str(e)}")
            raise
    
    def test_connection(self, server):
        """
        Test SSH connection to a server
        
        Args:
            server: Server object
            
        Returns:
            bool: True if connection successful, False otherwise
        """
        try:
            client = self.get_ssh_client(server)
            client.close()
            return True
        except Exception as e:
            logger.error(f"Failed to connect to {server.hostname}: {str(e)}")
            return False
    
    def execute_command(self, server, command):
        """
        Execute a command on a remote server
        
        Args:
            server: Server object
            command: Command to execute
            
        Returns:
            dict: {'success': bool, 'output': str, 'error': str}
        """
        try:
            client = self.get_ssh_client(server)
            stdin, stdout, stderr = client.exec_command(command)
            exit_status = stdout.channel.recv_exit_status()
            
            output = stdout.read().decode('utf-8')
            error = stderr.read().decode('utf-8')
            
            client.close()
            
            return {
                'success': exit_status == 0,
                'output': output,
                'error': error,
                'message': output if exit_status == 0 else error
            }
            
        except Exception as e:
            logger.error(f"Command execution error on {server.hostname}: {str(e)}")
            return {'success': False, 'output': '', 'error': str(e), 'message': str(e)}
    
    def shutdown_server(self, server):
        """
        Shutdown a remote server
        
        Args:
            server: Server object
            
        Returns:
            dict: {'success': bool, 'message': str}
        """
        # Use different shutdown commands based on the OS (Linux/Windows)
        # For Linux, we use 'sudo shutdown -h now'
        shutdown_command = "sudo shutdown -h now"
        
        try:
            result = self.execute_command(server, shutdown_command)
            
            # If command executed successfully, the server will be shutting down
            if result['success']:
                return {'success': True, 'message': 'Shutdown command executed successfully'}
            else:
                # Try an alternative command for non-sudo systems
                alternative_command = "shutdown -h now"
                result = self.execute_command(server, alternative_command)
                
                if result['success']:
                    return {'success': True, 'message': 'Shutdown command executed successfully'}
                else:
                    return {'success': False, 'message': f"Failed to shutdown server: {result['error']}"}
                
        except socket.error:
            # If we get a socket error, it might mean the server is actually shutting down
            # which is causing the SSH connection to drop
            return {'success': True, 'message': 'Server is shutting down (connection terminated)'}
            
        except Exception as e:
            logger.error(f"Error shutting down server {server.hostname}: {str(e)}")
            return {'success': False, 'message': str(e)}
    
    def reboot_server(self, server):
        """
        Reboot a remote server
        
        Args:
            server: Server object
            
        Returns:
            dict: {'success': bool, 'message': str}
        """
        # Use different reboot commands based on the OS (Linux/Windows)
        # For Linux, we use 'sudo reboot'
        reboot_command = "sudo reboot"
        
        try:
            result = self.execute_command(server, reboot_command)
            
            # If command executed successfully, the server will be rebooting
            if result['success']:
                return {'success': True, 'message': 'Reboot command executed successfully'}
            else:
                # Try an alternative command for non-sudo systems
                alternative_command = "reboot"
                result = self.execute_command(server, alternative_command)
                
                if result['success']:
                    return {'success': True, 'message': 'Reboot command executed successfully'}
                else:
                    return {'success': False, 'message': f"Failed to reboot server: {result['error']}"}
                
        except socket.error:
            # If we get a socket error, it might mean the server is actually rebooting
            # which is causing the SSH connection to drop
            return {'success': True, 'message': 'Server is rebooting (connection terminated)'}
            
        except Exception as e:
            logger.error(f"Error rebooting server {server.hostname}: {str(e)}")
            return {'success': False, 'message': str(e)}
    
    def check_server_status(self, server):
        """
        Check if a server is online
        
        Args:
            server: Server object
            
        Returns:
            bool: True if server is online, False otherwise
        """
        return self.test_connection(server)
