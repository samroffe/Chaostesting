import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faHome } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => {
  return (
    <div className="container mt-5 pt-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning mb-4" size="5x" />
              <h1 className="display-4">404</h1>
              <h2 className="mb-4">Page Not Found</h2>
              <p className="lead mb-4">
                The page you are looking for does not exist or has been moved.
              </p>
              <Link to="/" className="btn btn-primary btn-lg">
                <FontAwesomeIcon icon={faHome} className="me-2" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;