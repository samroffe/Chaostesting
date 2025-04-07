import os
import json
import datetime
from flask import render_template, request, redirect, url_for, flash, jsonify, session
from flask_login import login_user, logout_user, login_required, current_user
from app import db
from models import User, Server, DockerHost, Container, Experiment, ExperimentLog
from ssh_manager import SSHManager
from docker_manager import DockerManager
from scheduler import ChaosScheduler
from chaos_manager import ChaosManager

# Initialize managers
chaos_scheduler = ChaosScheduler()
chaos_manager = ChaosManager()

def register_routes(app):
    # Authentication routes
    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if current_user.is_authenticated:
            return redirect(url_for('index'))
            
        if request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')
            
            user = User.query.filter_by(username=username).first()
            if user and user.check_password(password):
                login_user(user)
                next_page = request.args.get('next')
                return redirect(next_page or url_for('index'))
            else:
                flash('Invalid username or password', 'danger')
                
        return render_template('login.html')
    
    @app.route('/logout')
    @login_required
    def logout():
        logout_user()
        return redirect(url_for('login'))
    
    # Main routes
    @app.route('/')
    @login_required
    def index():
        # Get summary statistics
        servers_count = Server.query.count()
        docker_hosts_count = DockerHost.query.count()
        containers_count = Container.query.count()
        experiments_count = Experiment.query.count()
        
        # Get recent logs
        recent_logs = ExperimentLog.query.order_by(ExperimentLog.execution_time.desc()).limit(10).all()
        
        # Get upcoming experiments
        upcoming_experiments = Experiment.query.filter(
            Experiment.scheduled_time > datetime.datetime.utcnow(),
            Experiment.active == True
        ).order_by(Experiment.scheduled_time).limit(5).all()
        
        return render_template(
            'index.html',
            servers_count=servers_count,
            docker_hosts_count=docker_hosts_count,
            containers_count=containers_count,
            experiments_count=experiments_count,
            recent_logs=recent_logs,
            upcoming_experiments=upcoming_experiments
        )
    
    # Server management routes
    @app.route('/servers')
    @login_required
    def servers():
        servers = Server.query.all()
        return render_template('servers.html', servers=servers)
    
    @app.route('/servers/add', methods=['POST'])
    @login_required
    def add_server():
        try:
            name = request.form.get('name')
            hostname = request.form.get('hostname')
            port = int(request.form.get('port', 22))
            username = request.form.get('username')
            use_key_auth = 'use_key_auth' in request.form
            
            if use_key_auth:
                ssh_key = request.form.get('ssh_key')
                password = None
            else:
                password = request.form.get('password')
                ssh_key = None
            
            server = Server(
                name=name,
                hostname=hostname,
                port=port,
                username=username,
                password=password,
                ssh_key=ssh_key,
                use_key_auth=use_key_auth
            )
            
            # Test connection
            ssh_manager = SSHManager()
            if ssh_manager.test_connection(server):
                server.status = 'online'
                server.last_check = datetime.datetime.utcnow()
                db.session.add(server)
                db.session.commit()
                flash(f'Server "{name}" added successfully', 'success')
            else:
                flash('Failed to connect to the server', 'danger')
                
        except Exception as e:
            flash(f'Error adding server: {str(e)}', 'danger')
            
        return redirect(url_for('servers'))
    
    @app.route('/servers/<int:server_id>/delete', methods=['POST'])
    @login_required
    def delete_server(server_id):
        server = Server.query.get_or_404(server_id)
        
        # Delete related experiments
        experiments = Experiment.query.filter_by(target_type='server', target_id=server_id).all()
        for experiment in experiments:
            chaos_scheduler.remove_job(experiment.job_id)
            db.session.delete(experiment)
        
        db.session.delete(server)
        db.session.commit()
        flash(f'Server "{server.name}" deleted successfully', 'success')
        return redirect(url_for('servers'))
    
    @app.route('/servers/<int:server_id>/status', methods=['GET'])
    @login_required
    def check_server_status(server_id):
        server = Server.query.get_or_404(server_id)
        ssh_manager = SSHManager()
        
        if ssh_manager.test_connection(server):
            server.status = 'online'
        else:
            server.status = 'offline'
            
        server.last_check = datetime.datetime.utcnow()
        db.session.commit()
        
        return jsonify({'status': server.status})
    
    @app.route('/servers/<int:server_id>/action', methods=['POST'])
    @login_required
    def server_action(server_id):
        server = Server.query.get_or_404(server_id)
        action = request.form.get('action')
        
        try:
            result = chaos_manager.execute_server_action(server, action)
            if result['success']:
                flash(f'Successfully executed {action} on server "{server.name}"', 'success')
                
                # Log the action
                log = ExperimentLog(
                    experiment_id=None,
                    target_type='server',
                    target_id=server.id,
                    target_name=server.name,
                    action=action,
                    status='success',
                    details=result.get('message', '')
                )
                db.session.add(log)
                db.session.commit()
            else:
                flash(f'Failed to execute {action} on server: {result["message"]}', 'danger')
                
                # Log the failure
                log = ExperimentLog(
                    experiment_id=None,
                    target_type='server',
                    target_id=server.id,
                    target_name=server.name,
                    action=action,
                    status='failure',
                    details=result.get('message', '')
                )
                db.session.add(log)
                db.session.commit()
                
        except Exception as e:
            flash(f'Error executing action: {str(e)}', 'danger')
            
        return redirect(url_for('servers'))
    
    # Container management routes
    @app.route('/docker-hosts')
    @login_required
    def docker_hosts():
        hosts = DockerHost.query.all()
        return render_template('containers.html', docker_hosts=hosts)
    
    @app.route('/docker-hosts/add', methods=['POST'])
    @login_required
    def add_docker_host():
        try:
            name = request.form.get('name')
            url = request.form.get('url')
            tls_verify = 'tls_verify' in request.form
            cert_path = request.form.get('cert_path') if tls_verify else None
            
            host = DockerHost(
                name=name,
                url=url,
                tls_verify=tls_verify,
                cert_path=cert_path
            )
            
            # Test connection
            docker_manager = DockerManager()
            if docker_manager.test_connection(host):
                host.status = 'online'
                host.last_check = datetime.datetime.utcnow()
                db.session.add(host)
                db.session.commit()
                
                # Fetch containers
                docker_manager.refresh_containers(host)
                
                flash(f'Docker host "{name}" added successfully', 'success')
            else:
                flash('Failed to connect to the Docker host', 'danger')
                
        except Exception as e:
            flash(f'Error adding Docker host: {str(e)}', 'danger')
            
        return redirect(url_for('docker_hosts'))
    
    @app.route('/docker-hosts/<int:host_id>/delete', methods=['POST'])
    @login_required
    def delete_docker_host(host_id):
        host = DockerHost.query.get_or_404(host_id)
        
        # Delete related containers
        Container.query.filter_by(docker_host_id=host_id).delete()
        
        # Delete related experiments
        containers = Container.query.filter_by(docker_host_id=host_id).all()
        for container in containers:
            experiments = Experiment.query.filter_by(target_type='container', target_id=container.id).all()
            for experiment in experiments:
                chaos_scheduler.remove_job(experiment.job_id)
                db.session.delete(experiment)
        
        db.session.delete(host)
        db.session.commit()
        flash(f'Docker host "{host.name}" deleted successfully', 'success')
        return redirect(url_for('docker_hosts'))
    
    @app.route('/docker-hosts/<int:host_id>/refresh', methods=['POST'])
    @login_required
    def refresh_containers(host_id):
        host = DockerHost.query.get_or_404(host_id)
        
        try:
            docker_manager = DockerManager()
            if docker_manager.refresh_containers(host):
                flash(f'Containers for "{host.name}" refreshed successfully', 'success')
            else:
                flash('Failed to refresh containers', 'danger')
        except Exception as e:
            flash(f'Error refreshing containers: {str(e)}', 'danger')
            
        return redirect(url_for('docker_hosts'))
    
    @app.route('/containers/<int:container_id>/action', methods=['POST'])
    @login_required
    def container_action(container_id):
        container = Container.query.get_or_404(container_id)
        action = request.form.get('action')
        
        try:
            result = chaos_manager.execute_container_action(container, action)
            if result['success']:
                flash(f'Successfully executed {action} on container "{container.name}"', 'success')
                
                # Log the action
                log = ExperimentLog(
                    experiment_id=None,
                    target_type='container',
                    target_id=container.id,
                    target_name=container.name,
                    action=action,
                    status='success',
                    details=result.get('message', '')
                )
                db.session.add(log)
                db.session.commit()
            else:
                flash(f'Failed to execute {action} on container: {result["message"]}', 'danger')
                
                # Log the failure
                log = ExperimentLog(
                    experiment_id=None,
                    target_type='container',
                    target_id=container.id,
                    target_name=container.name,
                    action=action,
                    status='failure',
                    details=result.get('message', '')
                )
                db.session.add(log)
                db.session.commit()
                
        except Exception as e:
            flash(f'Error executing action: {str(e)}', 'danger')
            
        return redirect(url_for('docker_hosts'))
    
    # Experiment management routes
    @app.route('/experiments')
    @login_required
    def experiments():
        experiments = Experiment.query.all()
        servers = Server.query.all()
        containers = Container.query.all()
        return render_template('experiments.html', 
                               experiments=experiments, 
                               servers=servers, 
                               containers=containers)
    
    @app.route('/experiments/add', methods=['POST'])
    @login_required
    def add_experiment():
        try:
            name = request.form.get('name')
            description = request.form.get('description')
            target_type = request.form.get('target_type')
            target_id = int(request.form.get('target_id'))
            action = request.form.get('action')
            schedule_type = request.form.get('schedule_type')
            
            if schedule_type == 'one_time':
                scheduled_time = datetime.datetime.strptime(
                    request.form.get('scheduled_time'), 
                    '%Y-%m-%dT%H:%M'
                )
                recurring_pattern = None
            else:
                scheduled_time = None
                recurring_pattern = request.form.get('recurring_pattern')
            
            experiment = Experiment(
                name=name,
                description=description,
                target_type=target_type,
                target_id=target_id,
                action=action,
                schedule_type=schedule_type,
                scheduled_time=scheduled_time,
                recurring_pattern=recurring_pattern,
                active=True,
                user_id=current_user.id
            )
            
            db.session.add(experiment)
            db.session.commit()
            
            # Add to scheduler
            job_id = chaos_scheduler.schedule_experiment(experiment)
            experiment.job_id = job_id
            db.session.commit()
            
            flash(f'Experiment "{name}" added successfully', 'success')
                
        except Exception as e:
            flash(f'Error adding experiment: {str(e)}', 'danger')
            
        return redirect(url_for('experiments'))
    
    @app.route('/experiments/<int:experiment_id>/toggle', methods=['POST'])
    @login_required
    def toggle_experiment(experiment_id):
        experiment = Experiment.query.get_or_404(experiment_id)
        experiment.active = not experiment.active
        
        if experiment.active:
            # Re-schedule the experiment
            job_id = chaos_scheduler.schedule_experiment(experiment)
            experiment.job_id = job_id
            flash(f'Experiment "{experiment.name}" activated', 'success')
        else:
            # Remove from scheduler
            chaos_scheduler.remove_job(experiment.job_id)
            flash(f'Experiment "{experiment.name}" deactivated', 'success')
            
        db.session.commit()
        return redirect(url_for('experiments'))
    
    @app.route('/experiments/<int:experiment_id>/delete', methods=['POST'])
    @login_required
    def delete_experiment(experiment_id):
        experiment = Experiment.query.get_or_404(experiment_id)
        
        # Remove from scheduler
        if experiment.job_id:
            chaos_scheduler.remove_job(experiment.job_id)
        
        # Delete logs
        ExperimentLog.query.filter_by(experiment_id=experiment_id).delete()
        
        # Delete experiment
        db.session.delete(experiment)
        db.session.commit()
        
        flash(f'Experiment "{experiment.name}" deleted successfully', 'success')
        return redirect(url_for('experiments'))
    
    # Reports
    @app.route('/reports')
    @login_required
    def reports():
        # Get execution logs
        logs = ExperimentLog.query.order_by(ExperimentLog.execution_time.desc()).all()
        
        # Success rate
        total_logs = len(logs)
        successful_logs = len([log for log in logs if log.status == 'success'])
        success_rate = (successful_logs / total_logs * 100) if total_logs > 0 else 0
        
        # Get stats by target type
        server_logs = [log for log in logs if log.target_type == 'server']
        container_logs = [log for log in logs if log.target_type == 'container']
        
        # Get stats by action
        stop_logs = [log for log in logs if log.action == 'stop']
        start_logs = [log for log in logs if log.action == 'start']
        restart_logs = [log for log in logs if log.action == 'restart']
        
        return render_template(
            'reports.html',
            logs=logs,
            total_logs=total_logs,
            success_rate=success_rate,
            server_logs=server_logs,
            container_logs=container_logs,
            stop_logs=stop_logs,
            start_logs=start_logs,
            restart_logs=restart_logs
        )
    
    # Settings
    @app.route('/settings')
    @login_required
    def settings():
        # Get all users
        users = User.query.all()
        return render_template('settings.html', users=users)
    
    @app.route('/settings/add-user', methods=['POST'])
    @login_required
    def add_user():
        if not current_user.is_admin:
            flash('Only administrators can add users', 'danger')
            return redirect(url_for('settings'))
            
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        is_admin = 'is_admin' in request.form
        
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            flash(f'User with username "{username}" already exists', 'danger')
            return redirect(url_for('settings'))
            
        if User.query.filter_by(email=email).first():
            flash(f'User with email "{email}" already exists', 'danger')
            return redirect(url_for('settings'))
        
        # Create new user
        user = User(username=username, email=email, is_admin=is_admin)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        flash(f'User "{username}" added successfully', 'success')
        return redirect(url_for('settings'))
    
    @app.route('/settings/user/<int:user_id>/delete', methods=['POST'])
    @login_required
    def delete_user(user_id):
        if not current_user.is_admin:
            flash('Only administrators can delete users', 'danger')
            return redirect(url_for('settings'))
            
        # Cannot delete yourself
        if user_id == current_user.id:
            flash('You cannot delete your own account', 'danger')
            return redirect(url_for('settings'))
            
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        
        flash(f'User "{user.username}" deleted successfully', 'success')
        return redirect(url_for('settings'))
    
    # API routes for AJAX requests
    @app.route('/api/experiments/history/<int:days>')
    @login_required
    def api_experiment_history(days):
        # Get logs for the specified period
        end_date = datetime.datetime.utcnow()
        start_date = end_date - datetime.timedelta(days=days)
        
        logs = ExperimentLog.query.filter(
            ExperimentLog.execution_time >= start_date,
            ExperimentLog.execution_time <= end_date
        ).all()
        
        # Prepare data for chart
        dates = []
        success_counts = []
        failure_counts = []
        
        # Create a date range
        current_date = start_date
        while current_date <= end_date:
            date_str = current_date.strftime('%Y-%m-%d')
            dates.append(date_str)
            
            # Count successes and failures for this date
            day_logs = [log for log in logs if log.execution_time.strftime('%Y-%m-%d') == date_str]
            success_counts.append(len([log for log in day_logs if log.status == 'success']))
            failure_counts.append(len([log for log in day_logs if log.status == 'failure']))
            
            current_date += datetime.timedelta(days=1)
            
        return jsonify({
            'labels': dates,
            'datasets': [
                {
                    'label': 'Successful',
                    'data': success_counts,
                    'backgroundColor': 'rgba(40, 167, 69, 0.6)',
                    'borderColor': 'rgba(40, 167, 69, 1)',
                    'borderWidth': 1
                },
                {
                    'label': 'Failed',
                    'data': failure_counts,
                    'backgroundColor': 'rgba(220, 53, 69, 0.6)',
                    'borderColor': 'rgba(220, 53, 69, 1)',
                    'borderWidth': 1
                }
            ]
        })
    
    # First-time setup route
    @app.route('/setup', methods=['GET', 'POST'])
    def setup():
        # Check if any users exist
        if User.query.count() > 0:
            return redirect(url_for('index'))
            
        if request.method == 'POST':
            username = request.form.get('username')
            email = request.form.get('email')
            password = request.form.get('password')
            
            # Create admin user
            admin = User(username=username, email=email, is_admin=True)
            admin.set_password(password)
            db.session.add(admin)
            db.session.commit()
            
            flash('Admin user created successfully. Please log in.', 'success')
            return redirect(url_for('login'))
            
        return render_template('setup.html')
