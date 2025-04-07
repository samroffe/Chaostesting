import logging
from ssh_manager import SSHManager
from docker_manager import DockerManager
from app import db
from models import Server, Container, ExperimentLog

logger = logging.getLogger(__name__)

class ChaosManager:
    """
    Central manager for executing chaos experiments on servers and containers
    """
    
    def __init__(self):
        self.ssh_manager = SSHManager()
        self.docker_manager = DockerManager()
    
    def execute_server_action(self, server, action):
        """
        Execute action on a server
        
        Args:
            server: Server object
            action: 'stop', 'start', or 'restart'
            
        Returns:
            dict: {'success': bool, 'message': str}
        """
        logger.info(f"Executing {action} on server {server.name} ({server.hostname})")
        
        try:
            if action == 'stop':
                result = self.ssh_manager.shutdown_server(server)
                server.status = 'offline' if result['success'] else server.status
            elif action == 'start':
                # TODO: Implement Wake-on-LAN or IPMI for starting servers
                return {'success': False, 'message': 'Server start not implemented yet. Requires Wake-on-LAN or IPMI.'}
            elif action == 'restart':
                result = self.ssh_manager.reboot_server(server)
                
            db.session.commit()
            return result
            
        except Exception as e:
            logger.error(f"Error executing {action} on server {server.name}: {str(e)}")
            return {'success': False, 'message': str(e)}
    
    def execute_container_action(self, container, action):
        """
        Execute action on a container
        
        Args:
            container: Container object
            action: 'stop', 'start', or 'restart'
            
        Returns:
            dict: {'success': bool, 'message': str}
        """
        logger.info(f"Executing {action} on container {container.name} (ID: {container.container_id})")
        
        try:
            if action == 'stop':
                result = self.docker_manager.stop_container(container)
                container.status = 'stopped' if result['success'] else container.status
            elif action == 'start':
                result = self.docker_manager.start_container(container)
                container.status = 'running' if result['success'] else container.status
            elif action == 'restart':
                result = self.docker_manager.restart_container(container)
                container.status = 'running' if result['success'] else container.status
                
            db.session.commit()
            return result
            
        except Exception as e:
            logger.error(f"Error executing {action} on container {container.name}: {str(e)}")
            return {'success': False, 'message': str(e)}
    
    def execute_experiment(self, experiment):
        """
        Execute a scheduled experiment
        
        Args:
            experiment: Experiment object
            
        Returns:
            ExperimentLog: Log of the experiment execution
        """
        logger.info(f"Executing experiment: {experiment.name}")
        
        try:
            # Determine target and action
            if experiment.target_type == 'server':
                server = Server.query.get(experiment.target_id)
                if not server:
                    return self._create_error_log(experiment, 'Server not found')
                
                target_name = server.name
                result = self.execute_server_action(server, experiment.action)
                
            elif experiment.target_type == 'container':
                container = Container.query.get(experiment.target_id)
                if not container:
                    return self._create_error_log(experiment, 'Container not found')
                
                target_name = container.name
                result = self.execute_container_action(container, experiment.action)
                
            else:
                return self._create_error_log(experiment, f'Unknown target type: {experiment.target_type}')
            
            # Create and return log
            log = ExperimentLog(
                experiment_id=experiment.id,
                target_type=experiment.target_type,
                target_id=experiment.target_id,
                target_name=target_name,
                action=experiment.action,
                status='success' if result['success'] else 'failure',
                details=result['message']
            )
            
            db.session.add(log)
            db.session.commit()
            return log
            
        except Exception as e:
            logger.error(f"Error executing experiment {experiment.name}: {str(e)}")
            return self._create_error_log(experiment, str(e))
    
    def _create_error_log(self, experiment, error_message):
        """Helper to create an error log entry"""
        log = ExperimentLog(
            experiment_id=experiment.id,
            target_type=experiment.target_type,
            target_id=experiment.target_id,
            target_name='Unknown',
            action=experiment.action,
            status='failure',
            details=error_message
        )
        
        db.session.add(log)
        db.session.commit()
        return log
