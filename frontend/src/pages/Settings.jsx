import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUser, faPlus } from '@fortawesome/free-solid-svg-icons';

const Settings = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-6">
          <FontAwesomeIcon icon={faCog} className="me-2" /> 
          System Settings
        </h1>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="m-0 fw-bold">
            <FontAwesomeIcon icon={faUser} className="me-1" /> 
            User Management
          </h5>
          <button className="btn btn-sm btn-primary">
            <FontAwesomeIcon icon={faPlus} className="me-1" />
            Add User
          </button>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <strong>Coming Soon:</strong> User management functionality is currently in development.
          </div>
        </div>
      </div>
      
      <div className="card shadow mb-4">
        <div className="card-header">
          <h5 className="m-0 fw-bold">System Configuration</h5>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <strong>Coming Soon:</strong> System configuration options will be available here.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;