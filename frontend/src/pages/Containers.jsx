import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes, faPlus } from '@fortawesome/free-solid-svg-icons';

const Containers = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-6">
          <FontAwesomeIcon icon={faCubes} className="me-2" /> 
          Container Management
        </h1>
        <button className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-1" />
          Add Docker Host
        </button>
      </div>
      
      <div className="alert alert-info">
        <strong>Coming Soon:</strong> Container management functionality is currently in development.
      </div>
    </div>
  );
};

export default Containers;