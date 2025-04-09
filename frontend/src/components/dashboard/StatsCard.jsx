import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StatsCard = ({ title, value, icon, color, linkTo, linkText }) => {
  return (
    <div className={`card border-${color} shadow h-100 py-2`}>
      <div className="card-body">
        <div className="row no-gutters align-items-center">
          <div className="col mr-2">
            <div className={`text-xs fw-bold text-${color} text-uppercase mb-1`}>
              {title}
            </div>
            <div className="h5 mb-0 fw-bold text-gray-800">{value}</div>
          </div>
          <div className="col-auto">
            <FontAwesomeIcon icon={icon} className={`fa-2x text-gray-300 text-${color}`} />
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-top">
          <Link to={linkTo} className={`btn btn-sm btn-outline-${color} w-100`}>
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;