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
  faExclamationTriangle,
  faCloud,
  faCloudUploadAlt,
  faNetworkWired,
  faKey
} from '@fortawesome/free-solid-svg-icons';
import { faDocker, faAws, faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
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
    experiments: 0,
    users: 3 // Total user count
  });
  const [logs, setLogs] = useState([]);
  const [upcomingExperiments, setUpcomingExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mock infrastructure accounts data - in a real app, this would come from an API call
  const [infraAccounts, setInfraAccounts] = useState([
    { 
      id: 1, 
      name: 'AWS Production', 
      provider: 'aws', 
      region: 'us-east-1', 
      status: 'active',
      resourceCount: 23,
      lastChecked: '2025-04-09T08:10:30Z' 
    },
    { 
      id: 2, 
      name: 'AWS Development', 
      provider: 'aws', 
      region: 'us-west-2', 
      status: 'active',
      resourceCount: 17,
      lastChecked: '2025-04-08T16:45:22Z' 
    },
    { 
      id: 3, 
      name: 'Azure Primary', 
      provider: 'azure', 
      region: 'eastus', 
      status: 'active',
      resourceCount: 12,
      lastChecked: '2025-04-09T11:20:15Z' 
    }
  ]);

  // Format date to readable string
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
  
  // Get provider icon
  const getProviderIcon = (provider) => {
    switch(provider) {
      case 'aws':
        return <FontAwesomeIcon icon={faAws} />;
      case 'azure':
        return <FontAwesomeIcon icon={faMicrosoft} />;
      case 'gcp':
        return <FontAwesomeIcon icon={faGoogle} />;
      default:
        return <FontAwesomeIcon icon={faCloud} />;
    }
  };

  // Get provider badge class
  const getProviderBadgeClass = (provider) => {
    switch(provider) {
      case 'aws':
        return 'bg-warning text-dark';
      case 'azure':
        return 'bg-primary';
      case 'gcp':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

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

      {/* Infrastructure Accounts Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="m-0 fw-bold">
                <FontAwesomeIcon icon={faCloud} className="me-2" />
                Infrastructure Accounts
              </h5>
              <Link to="/settings" className="btn btn-sm btn-primary">
                <FontAwesomeIcon icon={faPlus} className="me-1" />
                Add Account
              </Link>
            </div>
            <div className="card-body">
              {/* Infrastructure metrics */}
              <div className="row mb-3">
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="card card-border-left-primary h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="rounded-circle bg-primary bg-opacity-10 p-3">
                            <FontAwesomeIcon icon={faCloud} className="fa-fw text-primary" />
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h5 className="mb-1">Total Accounts</h5>
                          <h2 className="mb-0">{infraAccounts.length}</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="card card-border-left-warning h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="rounded-circle bg-warning bg-opacity-10 p-3">
                            <FontAwesomeIcon icon={faAws} className="fa-fw text-warning" />
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h5 className="mb-1">AWS Accounts</h5>
                          <h2 className="mb-0">{infraAccounts.filter(account => account.provider === 'aws').length}</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="card card-border-left-info h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="rounded-circle bg-primary bg-opacity-10 p-3">
                            <FontAwesomeIcon icon={faMicrosoft} className="fa-fw text-primary" />
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h5 className="mb-1">Azure Accounts</h5>
                          <h2 className="mb-0">{infraAccounts.filter(account => account.provider === 'azure').length}</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="card card-border-left-success h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <Link to="/settings" className="btn btn-outline-primary">
                          <FontAwesomeIcon icon={faNetworkWired} className="me-2" />
                          Manage Accounts
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Infrastructure accounts table */}
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Provider</th>
                      <th>Region</th>
                      <th>Resources</th>
                      <th>Status</th>
                      <th>Last Checked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {infraAccounts.map(account => (
                      <tr key={account.id}>
                        <td>{account.name}</td>
                        <td>
                          <span className={`badge ${getProviderBadgeClass(account.provider)}`}>
                            {getProviderIcon(account.provider)}{' '}
                            {account.provider.toUpperCase()}
                          </span>
                        </td>
                        <td>{account.region}</td>
                        <td>
                          <span className="badge bg-secondary">
                            {account.resourceCount} resources
                          </span>
                        </td>
                        <td>
                          {account.status === 'active' ? (
                            <span className="badge bg-success">Active</span>
                          ) : (
                            <span className="badge bg-danger">Inactive</span>
                          )}
                        </td>
                        <td>{formatDate(account.lastChecked)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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