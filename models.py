import datetime
import json
from app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Server(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    hostname = db.Column(db.String(255), nullable=False)
    port = db.Column(db.Integer, default=22)
    username = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(255), nullable=True)
    ssh_key = db.Column(db.Text, nullable=True)
    use_key_auth = db.Column(db.Boolean, default=True)
    status = db.Column(db.String(20), default='unknown')
    last_check = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'hostname': self.hostname,
            'port': self.port,
            'username': self.username,
            'use_key_auth': self.use_key_auth,
            'status': self.status,
            'last_check': self.last_check.isoformat() if self.last_check else None
        }

class DockerHost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    url = db.Column(db.String(255), nullable=False)
    tls_verify = db.Column(db.Boolean, default=False)
    cert_path = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(20), default='unknown')
    last_check = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'url': self.url,
            'tls_verify': self.tls_verify,
            'status': self.status,
            'last_check': self.last_check.isoformat() if self.last_check else None
        }

class Container(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    container_id = db.Column(db.String(64), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    image = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), default='unknown')
    docker_host_id = db.Column(db.Integer, db.ForeignKey('docker_host.id'))
    docker_host = db.relationship('DockerHost', backref=db.backref('containers', lazy=True))
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'container_id': self.container_id,
            'name': self.name,
            'image': self.image,
            'status': self.status,
            'docker_host_id': self.docker_host_id,
            'docker_host_name': self.docker_host.name
        }

class Experiment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    target_type = db.Column(db.String(20), nullable=False)  # 'server' or 'container'
    target_id = db.Column(db.Integer, nullable=False)
    action = db.Column(db.String(20), nullable=False)  # 'stop', 'start', 'restart'
    schedule_type = db.Column(db.String(20), nullable=False)  # 'one_time', 'recurring'
    scheduled_time = db.Column(db.DateTime, nullable=True)
    recurring_pattern = db.Column(db.String(100), nullable=True)  # cron expression for recurring
    job_id = db.Column(db.String(100), nullable=True)  # APScheduler job ID
    active = db.Column(db.Boolean, default=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('experiments', lazy=True))
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'target_type': self.target_type,
            'target_id': self.target_id,
            'action': self.action,
            'schedule_type': self.schedule_type,
            'scheduled_time': self.scheduled_time.isoformat() if self.scheduled_time else None,
            'recurring_pattern': self.recurring_pattern,
            'active': self.active,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat()
        }

class ExperimentLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    experiment_id = db.Column(db.Integer, db.ForeignKey('experiment.id'))
    experiment = db.relationship('Experiment', backref=db.backref('logs', lazy=True))
    target_type = db.Column(db.String(20), nullable=False)
    target_id = db.Column(db.Integer, nullable=False)
    target_name = db.Column(db.String(255), nullable=False)
    action = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False)  # 'success' or 'failure'
    details = db.Column(db.Text, nullable=True)
    execution_time = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'experiment_id': self.experiment_id,
            'target_type': self.target_type,
            'target_id': self.target_id,
            'target_name': self.target_name,
            'action': self.action,
            'status': self.status,
            'details': self.details,
            'execution_time': self.execution_time.isoformat()
        }
