import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ActionCard = ({ icon, title, linkTo, color = 'primary' }) => {
  return (
    <Link 
      to={linkTo} 
      className={`card bg-gradient-${color} text-white shadow h-100 cursor-pointer text-decoration-none`}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-white mb-0">{title}</h6>
          </div>
          <div>
            <FontAwesomeIcon icon={icon} size="lg" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ActionCard;