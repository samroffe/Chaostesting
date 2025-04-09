import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer, faPlus } from '@fortawesome/free-solid-svg-icons';

const Servers = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-6">
          <FontAwesomeIcon icon={faServer} className="me-2" /> 
          Server Management
        </h1>
        <button className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-1" />
          Add Server
        </button>
      </div>
      
      <div className="alert alert-info">
        <strong>Coming Soon:</strong> Server management functionality is currently in development.
      </div>
    </div>
  );
};

export default Servers;