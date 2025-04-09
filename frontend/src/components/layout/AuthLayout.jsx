import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRandom } from '@fortawesome/free-solid-svg-icons';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      {/* Simple Navbar */}
      <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container">
          <Link className="navbar-brand mx-auto" to="/">
            <FontAwesomeIcon icon={faRandom} className="me-2" /> 
            Chaos Engineering Tool
          </Link>
        </div>
      </nav>

      {/* Auth Content */}
      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            {children}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white-50 text-center py-3 footer fixed-bottom">
        <div className="container">
          <p className="mb-0">&copy; 2025 Chaos Engineering Tool | <a href="https://github.com" className="text-white-50">GitHub</a></p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;