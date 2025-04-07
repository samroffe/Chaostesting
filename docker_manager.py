import docker
import logging
from app import db
from models import Container

logger = logging.getLogger(__name__)

class DockerManager:
    """
    Manager for Docker operations
    """
    
    def get_docker_client(self, host):
        """
        Create a Docker client for the host
        
        Args:
            host: DockerHost object
            
        Returns:
            docker.DockerClient
        """
        try:
            # Create Docker client with appropriate TLS settings
            if host.tls_verify and host.cert_path:
                client = docker.DockerClient(
                    base_url=host.url,
                    tls=True,
                    ca_cert=f"{host.cert_path}/ca.pem",
                    client_cert=(f"{host.cert_path}/cert.pem", f"{host.cert_path}/key.pem")
                )
            else:
                client = docker.DockerClient(base_url=host.url)
                
            return client
            
        except Exception as e:
            logger.error(f"Docker connection error to {host.url}: {str(e)}")
            raise
    
    def test_connection(self, host):
        """
        Test connection to Docker host
        
        Args:
            host: DockerHost object
            
        Returns:
            bool: True if connection successful, False otherwise
        """
        try:
            client = self.get_docker_client(host)
            client.ping()
            return True
        except Exception as e:
            logger.error(f"Failed to connect to Docker host {host.url}: {str(e)}")
            return False
    
    def refresh_containers(self, host):
        """
        Refresh list of containers from Docker host
        
        Args:
            host: DockerHost object
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            client = self.get_docker_client(host)
            
            # Get all containers (running and stopped)
            containers = client.containers.list(all=True)
            
            # Update host status
            host.status = 'online'
            
            # Clear existing containers for this host
            Container.query.filter_by(docker_host_id=host.id).delete()
            
            # Add containers to database
            for container in containers:
                status = container.status
                container_db = Container(
                    container_id=container.id,
                    name=container.name,
                    image=container.image.tags[0] if container.image.tags else container.image.id,
                    status=status,
                    docker_host_id=host.id
                )
                db.session.add(container_db)
                
            db.session.commit()
            return True
            
        except Exception as e:
            logger.error(f"Error refreshing containers from {host.url}: {str(e)}")
            host.status = 'offline'
            db.session.commit()
            return False
    
    def stop_container(self, container):
        """
        Stop a container
        
        Args:
            container: Container object
            
        Returns:
            dict: {'success': bool, 'message': str}
        """
        try:
            client = self.get_docker_client(container.docker_host)
            docker_container = client.containers.get(container.container_id)
            
            docker_container.stop()
            return {'success': True, 'message': f"Container {container.name} stopped"}
            
        except docker.errors.NotFound:
            return {'success': False, 'message': f"Container {container.name} not found"}
        except Exception as e:
            logger.error(f"Error stopping container {container.name}: {str(e)}")
            return {'success': False, 'message': str(e)}
    
    def start_container(self, container):
        """
        Start a container
        
        Args:
            container: Container object
            
        Returns:
            dict: {'success': bool, 'message': str}
        """
        try:
            client = self.get_docker_client(container.docker_host)
            docker_container = client.containers.get(container.container_id)
            
            docker_container.start()
            return {'success': True, 'message': f"Container {container.name} started"}
            
        except docker.errors.NotFound:
            return {'success': False, 'message': f"Container {container.name} not found"}
        except Exception as e:
            logger.error(f"Error starting container {container.name}: {str(e)}")
            return {'success': False, 'message': str(e)}
    
    def restart_container(self, container):
        """
        Restart a container
        
        Args:
            container: Container object
            
        Returns:
            dict: {'success': bool, 'message': str}
        """
        try:
            client = self.get_docker_client(container.docker_host)
            docker_container = client.containers.get(container.container_id)
            
            docker_container.restart()
            return {'success': True, 'message': f"Container {container.name} restarted"}
            
        except docker.errors.NotFound:
            return {'success': False, 'message': f"Container {container.name} not found"}
        except Exception as e:
            logger.error(f"Error restarting container {container.name}: {str(e)}")
            return {'success': False, 'message': str(e)}
