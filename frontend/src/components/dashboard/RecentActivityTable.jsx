import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faServer, 
  faCubes, 
  faStop, 
  faPlay, 
  faSync,
  faCheckCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

const RecentActivityTable = ({ logs }) => {
  // Function to return the appropriate icon based on action type
  const getActionIcon = (action) => {
    switch(action) {
      case 'stop':
        return <FontAwesomeIcon icon={faStop} className="text-danger" />;
      case 'start':
        return <FontAwesomeIcon icon={faPlay} className="text-success" />;
      case 'restart':
        return <FontAwesomeIcon icon={faSync} className="text-warning" />;
      default:
        return null;
    }
  };

  // Function to format the date in a more readable format
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',+
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Target</th>
            <th>Action</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>
                <div className="d-flex align-items-center">
                  <span className="me-2">
                    {log.targetType === 'server' ? (
                      <FontAwesomeIcon icon={faServer} />
                    ) : (
                      <FontAwesomeIcon icon={faCubes} />
                    )}
                  </span>
                  {log.targetName}
                </div>
              </td>
              <td>
                <span className="me-1">{getActionIcon(log.action)}</span>
                <span className="text-capitalize">{log.action}</span>
              </td>
              <td>
                {log.status === 'success' ? (
                  <span className="text-success">
                    <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                    Success
                  </span>
                ) : (
                  <span className="text-danger">
                    <FontAwesomeIcon icon={faTimesCircle} className="me-1" />
                    Failed
                  </span>
                )}
              </td>
              <td>
                {formatDate(log.executionTime)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivityTable;