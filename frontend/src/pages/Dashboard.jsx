import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faServer, 
  faCubes,
  faFlask, 
  faChartBar, 
  faPlus,
  faCalendarTimes,
  faSync,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { faDocker } from '@fortawesome/free-brands-svg-icons';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivityTable from '../components/dashboard/RecentActivityTable';
import UpcomingExperiments from '../components/dashboard/UpcomingExperiments';
import ActionCard from '../components/dashboard/ActionCard';
import { getStats, getLogs, getUpcomingExperiments } from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    servers: 0,
    dockerHosts: 0,
    containers: 0,
    experiments: 0
  });
  const [logs, setLogs] = useState([]);
  const [upcomingExperiments, setUpcomingExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all data in parallel
        const [statsData, logsData, experimentsData] = await Promise.all([
          getStats(),
          getLogs(),
          getUpcomingExperiments()
        ]);
        
        setStats(statsData);
        setLogs(logsData);
        setUpcomingExperiments(experimentsData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <FontAwesomeIcon icon={faSync} className="fa-spin fa-3x mb-3" />
        <p className="lead">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="row mb-4">
        <div className="col-lg-12">
          <h1 className="display-6">
            <FontAwesomeIcon icon={faTachometerAlt} className="me-2" /> 
            Chaos Engineering Dashboard
          </h1>
          <p className="lead">Monitor and control your chaos experiments across servers and containers.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <StatsCard 
            title="Servers"
            value={stats.servers}
            icon={faServer}
            color="primary"
            linkTo="/servers"
            linkText="Manage Servers"
          />
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <StatsCard 
            title="Docker Hosts"
            value={stats.dockerHosts}
            icon={faDocker}
            color="info"
            linkTo="/containers"
            linkText="Manage Hosts"
          />
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <StatsCard 
            title="Containers"
            value={stats.containers}
            icon={faCubes}
            color="warning"
            linkTo="/containers"
            linkText="View Containers"
          />
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <StatsCard 
            title="Active Experiments"
            value={stats.experiments}
            icon={faFlask}
            color="success"
            linkTo="/experiments"
            linkText="Manage Experiments"
          />
        </div>
      </div>

      <div className="row">
        {/* Recent Activity Log */}
        <div className="col-lg-7 mb-4">
          <div className="card shadow">
            <div className="card-header">
              <h5 className="m-0 fw-bold">Recent Activity</h5>
            </div>
            <div className="card-body">
              {logs.length > 0 ? (
                <>
                  <RecentActivityTable logs={logs} />
                  <div className="text-center mt-3">
                    <Link to="/reports" className="btn btn-sm btn-outline-primary">
                      View All Activity
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-3">
                  <p className="text-muted">No recent activity to display</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Upcoming Experiments */}
        <div className="col-lg-5 mb-4">
          <div className="card shadow">
            <div className="card-header">
              <h5 className="m-0 fw-bold">Upcoming Experiments</h5>
            </div>
            <div className="card-body">
              {upcomingExperiments.length > 0 ? (
                <UpcomingExperiments experiments={upcomingExperiments} />
              ) : (
                <div className="text-center py-3">
                  <FontAwesomeIcon icon={faCalendarTimes} className="fa-3x mb-3 text-muted" />
                  <p>No upcoming experiments scheduled</p>
                  <Link to="/experiments" className="btn btn-sm btn-primary">
                    <FontAwesomeIcon icon={faPlus} className="me-1" /> Create Experiment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header">
              <h5 className="m-0 fw-bold">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-lg-3 col-md-6 mb-3">
                  <ActionCard 
                    icon={faServer} 
                    title="Manage Servers" 
                    linkTo="/servers" 
                    color="primary"
                  />
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <ActionCard 
                    icon={faCubes} 
                    title="Manage Containers" 
                    linkTo="/containers" 
                    color="info"
                  />
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <ActionCard 
                    icon={faFlask} 
                    title="Create Experiment" 
                    linkTo="/experiments" 
                    color="success"
                  />
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <ActionCard 
                    icon={faChartBar} 
                    title="View Reports" 
                    linkTo="/reports" 
                    color="secondary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;