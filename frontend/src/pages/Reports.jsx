import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faDownload } from '@fortawesome/free-solid-svg-icons';

const Reports = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-6">
          <FontAwesomeIcon icon={faChartBar} className="me-2" /> 
          Experiment Reports
        </h1>
        <button className="btn btn-success">
          <FontAwesomeIcon icon={faDownload} className="me-1" />
          Export Report
        </button>
      </div>
      
      <div className="alert alert-info">
        <strong>Coming Soon:</strong> Reporting functionality is currently in development.
      </div>
    </div>
  );
};

export default Reports;