import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.executors.pool import ThreadPoolExecutor
from apscheduler.triggers.date import DateTrigger
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime
import os

logger = logging.getLogger(__name__)

class ChaosScheduler:
    """
    Scheduler for chaos experiments using APScheduler
    """
    
    def __init__(self):
        # Configure job stores and executors
        jobstores = {
            'default': SQLAlchemyJobStore(url='sqlite:///chaos_engineering.db')
        }
        executors = {
            'default': ThreadPoolExecutor(20)
        }
        job_defaults = {
            'coalesce': False,
            'max_instances': 3
        }
        
        # Create scheduler
        self.scheduler = BackgroundScheduler(
            jobstores=jobstores,
            executors=executors,
            job_defaults=job_defaults
        )
        
        # Start scheduler
        self.scheduler.start()
        logger.info("Chaos scheduler started")
    
    def schedule_experiment(self, experiment):
        """
        Schedule a chaos experiment
        
        Args:
            experiment: Experiment object
            
        Returns:
            str: Job ID
        """
        if not experiment.active:
            logger.info(f"Experiment {experiment.name} is inactive, not scheduling")
            return None
            
        # Import here to avoid circular imports
        from chaos_manager import ChaosManager
        chaos_manager = ChaosManager()
        
        # Remove existing job if it exists
        if experiment.job_id:
            self.remove_job(experiment.job_id)
        
        # Determine trigger type
        if experiment.schedule_type == 'one_time':
            if experiment.scheduled_time <= datetime.utcnow():
                logger.warning(f"Experiment {experiment.name} scheduled time is in the past, using current time")
                trigger = DateTrigger(run_date=datetime.utcnow())
            else:
                trigger = DateTrigger(run_date=experiment.scheduled_time)
                
        elif experiment.schedule_type == 'recurring':
            # Parse cron expression
            try:
                trigger = CronTrigger.from_crontab(experiment.recurring_pattern)
            except Exception as e:
                logger.error(f"Invalid cron expression for experiment {experiment.name}: {e}")
                # Default to hourly if invalid
                trigger = CronTrigger(hour='*')
        else:
            logger.error(f"Unknown schedule type for experiment {experiment.name}: {experiment.schedule_type}")
            return None
        
        # Add job to scheduler
        job_id = f"experiment_{experiment.id}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
        
        self.scheduler.add_job(
            chaos_manager.execute_experiment,
            trigger=trigger,
            args=[experiment],
            id=job_id,
            name=experiment.name,
            replace_existing=True
        )
        
        logger.info(f"Scheduled experiment {experiment.name} with job ID {job_id}")
        return job_id
    
    def remove_job(self, job_id):
        """
        Remove a scheduled job
        
        Args:
            job_id: ID of the job to remove
            
        Returns:
            bool: True if job was removed, False otherwise
        """
        if not job_id:
            return False
            
        try:
            self.scheduler.remove_job(job_id)
            logger.info(f"Removed job {job_id}")
            return True
        except Exception as e:
            logger.error(f"Error removing job {job_id}: {e}")
            return False
    
    def get_jobs(self):
        """
        Get all scheduled jobs
        
        Returns:
            list: List of jobs
        """
        return self.scheduler.get_jobs()
    
    def shutdown(self):
        """Shutdown the scheduler"""
        self.scheduler.shutdown()
        logger.info("Chaos scheduler shutdown")
