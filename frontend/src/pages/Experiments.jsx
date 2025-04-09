import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlask, faPlus } from '@fortawesome/free-solid-svg-icons';

const Experiments = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-6">
          <FontAwesomeIcon icon={faFlask} className="me-2" /> 
          Chaos Experiments
        </h1>
        <button className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-1" />
          Create Experiment
        </button>
      </div>
      
      <div className="alert alert-info">
        <strong>Coming Soon:</strong> Chaos experiment management functionality is currently in development.
      </div>
    </div>
  );
};

export default Experiments;