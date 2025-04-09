from flask import Flask, send_from_directory, jsonify, request, redirect, send_file
import os
from flask_cors import CORS
import subprocess
import sys

# Check if we're in dev mode (React not built yet)
DEV_MODE = not os.path.exists('frontend/dist')

# Set up static folder based on mode
static_folder = 'frontend/public' if DEV_MODE else 'static/frontend'
app = Flask(__name__, static_folder=static_folder)
CORS(app)  # Enable CORS for all routes

# Mock data for API
mock_stats = {
    "servers": 5,
    "dockerHosts": 3,
    "containers": 12,
    "experiments": 8
}

mock_logs = [
    { 
        "id": 1, 
        "target_type": "server", 
        "target_name": "Web Server 1", 
        "action": "restart", 
        "status": "success", 
        "execution_time": "2025-04-07T14:23:45Z"
    },
    { 
        "id": 2, 
        "target_type": "container", 
        "target_name": "api-gateway", 
        "action": "stop", 
        "status": "success", 
        "execution_time": "2025-04-07T12:15:30Z"
    },
    { 
        "id": 3, 
        "target_type": "server", 
        "target_name": "Database Server", 
        "action": "restart", 
        "status": "failed", 
        "execution_time": "2025-04-07T10:45:12Z"
    },
    { 
        "id": 4, 
        "target_type": "container", 
        "target_name": "auth-service", 
        "action": "start", 
        "status": "success", 
        "execution_time": "2025-04-06T22:10:05Z"
    },
    { 
        "id": 5, 
        "target_type": "container", 
        "target_name": "payment-processor", 
        "action": "stop", 
        "status": "success", 
        "execution_time": "2025-04-06T18:32:41Z"
    }
]

mock_upcoming_experiments = [
    {
        "id": 1,
        "name": "Daily API Restart",
        "description": "Restart API containers to simulate recovery",
        "target_type": "container",
        "action": "restart",
        "schedule_type": "recurring",
        "recurring_pattern": "0 2 * * *"
    },
    {
        "id": 2,
        "name": "Database Failover Test",
        "description": "Test database failover by restarting primary DB server",
        "target_type": "server",
        "action": "restart",
        "schedule_type": "one_time",
        "scheduled_time": "2025-04-10T01:00:00Z" 
    },
    {
        "id": 3,
        "name": "Network Partition Test",
        "description": "Simulate network partition by stopping network containers",
        "target_type": "container",
        "action": "stop",
        "schedule_type": "one_time",
        "scheduled_time": "2025-04-08T03:30:00Z"
    }
]

# API routes for frontend
@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify(mock_stats)

@app.route('/api/logs', methods=['GET'])
def get_logs():
    return jsonify(mock_logs)

@app.route('/api/experiments/upcoming', methods=['GET'])
def get_upcoming_experiments():
    return jsonify(mock_upcoming_experiments)

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    # Simple mock authentication
    if data and data.get('username') == 'admin' and data.get('password') == 'password':
        return jsonify({
            'success': True,
            'user': {
                'id': 1,
                'username': 'admin',
                'email': 'admin@example.com',
                'isAdmin': True
            },
            'token': 'mock-jwt-token'
        })
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

# Development redirect to React dev server
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if DEV_MODE:
        # For development, we need to launch a subprocess for Vite if not running
        try:
            # First try to proxy to an existing Vite server
            vite_url = "https://5173-" + os.environ.get('REPL_SLUG', 'your-repl-name') + "." + os.environ.get('REPL_OWNER', 'your-username') + ".replit.dev"
            return redirect(vite_url + "/" + path)
        except Exception as e:
            # If that fails, tell the user to start Vite
            return f"""
            <html>
                <body style="background-color: #1c1e21; color: #f0f2f5; font-family: Arial, sans-serif; text-align: center; padding-top: 100px;">
                    <h1>Chaos Engineering Tool - Development Mode</h1>
                    <p>React development server not detected.</p>
                    <p>Please go to the 'frontend' directory and run:</p>
                    <pre style="background-color: #2c2e31; padding: 10px; border-radius: 5px; display: inline-block;">npm run dev</pre>
                    <p>Or build the app for production with:</p>
                    <pre style="background-color: #2c2e31; padding: 10px; border-radius: 5px; display: inline-block;">cd frontend && npm run build</pre>
                </body>
            </html>
            """
    else:
        # Production mode - serve the React built app
        try:
            if path and os.path.exists(os.path.join(app.static_folder, path)):
                return send_from_directory(app.static_folder, path)
            else:
                return send_from_directory(app.static_folder, 'index.html')
        except Exception as e:
            return f"""
            <html>
                <body style="background-color: #1c1e21; color: #f0f2f5; font-family: Arial, sans-serif; text-align: center; padding-top: 100px;">
                    <h1>Chaos Engineering Tool - Error</h1>
                    <p>Could not serve the requested file.</p>
                    <p>Error: {str(e)}</p>
                    <p>Please build the React app:</p>
                    <pre style="background-color: #2c2e31; padding: 10px; border-radius: 5px; display: inline-block;">cd frontend && npm run build</pre>
                </body>
            </html>
            """

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)