import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faServer, 
  faCubes, 
  faFlask, 
  faChartBar, 
  faCog, 
  faUserCircle,
  faRandom,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

const MainLayout = ({ children, user }) => {
  const location = useLocation();
  const username = user?.username || "Admin";
  const isAdmin = user?.isAdmin || false;

  return (
    <div className="main-layout">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <FontAwesomeIcon icon={faRandom} className="me-2" /> Chaos Engineer
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                  to="/"
                >
                  <FontAwesomeIcon icon={faTachometerAlt} className="me-1" /> Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/servers' ? 'active' : ''}`} 
                  to="/servers"
                >
                  <FontAwesomeIcon icon={faServer} className="me-1" /> Servers
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/containers' ? 'active' : ''}`} 
                  to="/containers"
                >
                  <FontAwesomeIcon icon={faCubes} className="me-1" /> Containers
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/experiments' ? 'active' : ''}`} 
                  to="/experiments"
                >
                  <FontAwesomeIcon icon={faFlask} className="me-1" /> Experiments
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`} 
                  to="/reports"
                >
                  <FontAwesomeIcon icon={faChartBar} className="me-1" /> Reports
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  id="navbarDropdown" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <FontAwesomeIcon icon={faUserCircle} className="me-1" /> 
                  {username}
                  {isAdmin && (
                    <span className="badge bg-danger ms-1">
                      <FontAwesomeIcon icon={faShieldAlt} className="me-1" />
                      Admin
                    </span>
                  )}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      <FontAwesomeIcon icon={faCog} className="me-1" /> Settings
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-4">
        {/* Page Content */}
        {children}
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white-50 text-center py-3 footer">
        <div className="container">
          <p className="mb-0">&copy; 2025 Chaos Engineering Tool | <a href="https://github.com" className="text-white-50">GitHub</a></p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;