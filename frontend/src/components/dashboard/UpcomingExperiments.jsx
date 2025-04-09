import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faServer, 
  faCubes, 
  faStop, 
  faPlay, 
  faSync,
  faCalendarAlt,
  faCalendarDay
} from '@fortawesome/free-solid-svg-icons';

const UpcomingExperiments = ({ experiments }) => {
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
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Convert cron expression to human-readable format (simplified)
  const formatCron = (cronExpression) => {
    if (cronExpression === '0 2 * * *') return 'Daily at 2:00 AM';
    if (cronExpression === '0 0 * * 1') return 'Weekly on Monday at 12:00 AM';
    return cronExpression; // For other expressions, we'd need a better parser
  };

  return (
    <div className="list-group">
      {experiments.map((experiment) => (
        <div 
          key={experiment.id} 
          className="list-group-item list-group-item-action experiment-item"
        >
          <div className="d-flex w-100 justify-content-between">
            <h6 className="mb-1">{experiment.name}</h6>
            <span className="badge bg-primary rounded-pill">
              {experiment.targetType === 'server' ? 'Server' : 'Container'}
            </span>
          </div>
          <p className="mb-2 small">{experiment.description}</p>
          <div className="d-flex justify-content-between align-items-center small">
            <div>
              <span className="me-2">
                <FontAwesomeIcon 
                  icon={experiment.targetType === 'server' ? faServer : faCubes} 
                  className="me-1"
                />
                <span className="text-capitalize">{experiment.targetType}</span>
              </span>
              <span className="me-2">
                {getActionIcon(experiment.action)} 
                <span className="text-capitalize">{experiment.action}</span>
              </span>
            </div>
            <div>
              <FontAwesomeIcon 
                icon={experiment.scheduleType === 'one_time' ? faCalendarAlt : faCalendarDay} 
                className="me-1"
              />
              {experiment.scheduleType === 'one_time' 
                ? formatDate(experiment.scheduledTime)
                : formatCron(experiment.recurringPattern)
              }
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingExperiments;