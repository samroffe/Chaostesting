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
  faKey,
  faCog
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

      {/* Stats Cards - Gremlin Inspired */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="stats-card">
            <div className="stats-icon" style={{backgroundColor: 'rgba(13, 110, 253, 0.15)'}}>
              <FontAwesomeIcon icon={faServer} className="fa-lg" style={{color: '#0d6efd'}} />
            </div>
            <div className="stats-value" style={{color: '#0d6efd'}}>{stats.servers}</div>
            <div className="stats-label">Servers</div>
            <Link to="/servers" className="btn btn-sm btn-outline-primary mt-3 w-100">
              Manage Servers
            </Link>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="stats-card">
            <div className="stats-icon" style={{backgroundColor: 'rgba(13, 202, 240, 0.15)'}}>
              <FontAwesomeIcon icon={faDocker} className="fa-lg" style={{color: '#0dcaf0'}} />
            </div>
            <div className="stats-value" style={{color: '#0dcaf0'}}>{stats.dockerHosts}</div>
            <div className="stats-label">Docker Hosts</div>
            <Link to="/containers" className="btn btn-sm btn-outline-info mt-3 w-100">
              Manage Hosts
            </Link>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="stats-card">
            <div className="stats-icon" style={{backgroundColor: 'rgba(255, 193, 7, 0.15)'}}>
              <FontAwesomeIcon icon={faCubes} className="fa-lg" style={{color: '#ffc107'}} />
            </div>
            <div className="stats-value" style={{color: '#ffc107'}}>{stats.containers}</div>
            <div className="stats-label">Containers</div>
            <Link to="/containers" className="btn btn-sm btn-outline-warning mt-3 w-100">
              View Containers
            </Link>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-3">
          <div className="stats-card">
            <div className="stats-icon" style={{backgroundColor: 'rgba(252, 82, 35, 0.15)'}}>
              <FontAwesomeIcon icon={faFlask} className="fa-lg gremlin-primary" />
            </div>
            <div className="stats-value gremlin-primary">{stats.experiments}</div>
            <div className="stats-label">Active Experiments</div>
            <Link to="/experiments" className="btn btn-sm btn-gremlin-outline mt-3 w-100">
              Manage Experiments
            </Link>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recent Activity Log - Gremlin Style Timeline */}
        <div className="col-lg-7 mb-4">
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="m-0 fw-bold">
                <FontAwesomeIcon icon={faChartBar} className="me-2 gremlin-primary" />
                Recent Activity
              </h5>
            </div>
            <div className="card-body">
              {logs.length > 0 ? (
                <>
                  <div className="activity-timeline">
                    {logs.slice(0, 5).map((log, index) => (
                      <div key={index} className="activity-item">
                        <div className={`activity-dot ${log.status === 'success' ? 'success' : 'danger'}`}></div>
                        <div className="activity-content">
                          <div className="activity-time">{formatDate(log.execution_time)}</div>
                          <div className="activity-title">
                            {log.action.charAt(0).toUpperCase() + log.action.slice(1)} {log.target_type} - {log.target_name}
                          </div>
                          <div className="activity-description">
                            {log.status === 'success' 
                              ? `Successfully ${log.action}ed ${log.target_type} ${log.target_name}`
                              : `Failed to ${log.action} ${log.target_type} ${log.target_name}: ${log.details}`
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-3">
                    <Link to="/reports" className="btn btn-sm btn-gremlin-outline">
                      View All Activity
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div style={{color: '#41454d', fontSize: '3rem', marginBottom: '1rem'}}>
                    <FontAwesomeIcon icon={faChartBar} />
                  </div>
                  <p style={{color: '#a0a3a9'}}>No recent activity to display</p>
                  <p style={{color: '#a0a3a9', fontSize: '0.9rem'}}>
                    Activity will appear here when you run chaos experiments
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Upcoming Experiments - Gremlin Styled */}
        <div className="col-lg-5 mb-4">
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="m-0 fw-bold">
                <FontAwesomeIcon icon={faFlask} className="me-2 gremlin-primary" />
                Upcoming Experiments
              </h5>
              <Link to="/experiments" className="btn btn-sm btn-gremlin-primary">
                <FontAwesomeIcon icon={faPlus} className="me-1" />
                Create
              </Link>
            </div>
            <div className="card-body">
              {upcomingExperiments.length > 0 ? (
                <div>
                  {upcomingExperiments.map((experiment, index) => (
                    <div key={index} className="experiment-item">
                      <div className="experiment-title">{experiment.name}</div>
                      <div className="experiment-meta">
                        <FontAwesomeIcon icon={faCalendarTimes} className="me-1" />
                        {formatDate(experiment.scheduled_time)} · 
                        {experiment.target_type === 'server' ? (
                          <><FontAwesomeIcon icon={faServer} className="ms-2 me-1" /> Server</>
                        ) : (
                          <><FontAwesomeIcon icon={faCubes} className="ms-2 me-1" /> Container</>
                        )} · 
                        <span className="ms-2">
                          Action: <strong>{experiment.action}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div style={{color: '#41454d', fontSize: '3rem', marginBottom: '1rem'}}>
                    <FontAwesomeIcon icon={faCalendarTimes} />
                  </div>
                  <p style={{color: '#a0a3a9'}}>No upcoming experiments scheduled</p>
                  <Link to="/experiments" className="btn btn-gremlin-primary mt-2">
                    <FontAwesomeIcon icon={faPlus} className="me-1" /> Create Experiment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure Accounts Section - Gremlin Inspired */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="m-0 fw-bold">
                <FontAwesomeIcon icon={faCloud} className="me-2 gremlin-primary" />
                Infrastructure Accounts
              </h5>
              <Link to="/settings" className="btn btn-sm btn-gremlin-primary">
                <FontAwesomeIcon icon={faPlus} className="me-1" />
                Add Account
              </Link>
            </div>
            <div className="card-body">
              {/* Infrastructure metrics - in Gremlin-style stats cards */}
              <div className="row mb-4">
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="stats-card">
                    <div className="stats-icon" style={{backgroundColor: 'rgba(252, 82, 35, 0.15)'}}>
                      <FontAwesomeIcon icon={faCloud} className="fa-lg gremlin-primary" />
                    </div>
                    <div className="stats-value gremlin-primary">{infraAccounts.length}</div>
                    <div className="stats-label">Total Accounts</div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="stats-card">
                    <div className="stats-icon" style={{backgroundColor: 'rgba(255, 153, 0, 0.15)'}}>
                      <FontAwesomeIcon icon={faAws} className="fa-lg" style={{color: '#ff9900'}} />
                    </div>
                    <div className="stats-value" style={{color: '#ff9900'}}>
                      {infraAccounts.filter(account => account.provider === 'aws').length}
                    </div>
                    <div className="stats-label">AWS Accounts</div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="stats-card">
                    <div className="stats-icon" style={{backgroundColor: 'rgba(0, 120, 212, 0.15)'}}>
                      <FontAwesomeIcon icon={faMicrosoft} className="fa-lg" style={{color: '#0078d4'}} />
                    </div>
                    <div className="stats-value" style={{color: '#0078d4'}}>
                      {infraAccounts.filter(account => account.provider === 'azure').length}
                    </div>
                    <div className="stats-label">Azure Accounts</div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="stats-card d-flex align-items-center justify-content-center">
                    <Link to="/settings" className="btn btn-gremlin-outline">
                      <FontAwesomeIcon icon={faNetworkWired} className="me-2" />
                      Manage All Accounts
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Infrastructure accounts - Gremlin card style */}
              <h6 className="fw-bold mb-3 text-uppercase" style={{color: '#a0a3a9', letterSpacing: '1px'}}>Connected Accounts</h6>
              <div className="row">
                {infraAccounts.map(account => (
                  <div key={account.id} className="col-lg-4 col-md-6 mb-3">
                    <div className={`account-card account-card-${account.provider}`}>
                      <span className={`account-badge ${account.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                        {account.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                      <div className="account-content">
                        <div className="account-icon">
                          {getProviderIcon(account.provider)}
                        </div>
                        <h5 className="mb-1">{account.name}</h5>
                        <div style={{color: '#a0a3a9', fontSize: '0.85rem'}} className="mb-3">
                          {account.region} · {account.resourceCount} resources
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <span style={{color: '#a0a3a9', fontSize: '0.8rem'}}>
                            Last checked: {formatDate(account.lastChecked)}
                          </span>
                          <div>
                            <button className="btn btn-sm btn-gremlin-outline me-2">
                              <FontAwesomeIcon icon={faNetworkWired} />
                            </button>
                            <button className="btn btn-sm btn-gremlin-primary">
                              <FontAwesomeIcon icon={faFlask} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Action Buttons - Gremlin Inspired */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="m-0 fw-bold">
                <FontAwesomeIcon icon={faFlask} className="me-2 gremlin-primary" />
                Run Chaos Experiments
              </h5>
            </div>
            <div className="card-body">
              <h6 className="fw-bold mb-3 text-uppercase" style={{color: '#a0a3a9', letterSpacing: '1px'}}>Select a Target</h6>
              <div className="row">
                <div className="col-lg-4 col-md-6 mb-3">
                  <div className="account-card">
                    <div className="account-content">
                      <div className="account-icon">
                        <FontAwesomeIcon icon={faServer} style={{color: '#0d6efd'}} />
                      </div>
                      <h5 className="mb-2">Server Chaos</h5>
                      <p style={{color: '#a0a3a9', fontSize: '0.9rem'}} className="mb-3">
                        Test infrastructure resilience by simulating server issues
                      </p>
                      <Link to="/servers" className="btn btn-sm btn-outline-primary w-100">
                        Select Server Target
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-3">
                  <div className="account-card">
                    <div className="account-content">
                      <div className="account-icon">
                        <FontAwesomeIcon icon={faCubes} style={{color: '#0dcaf0'}} />
                      </div>
                      <h5 className="mb-2">Container Chaos</h5>
                      <p style={{color: '#a0a3a9', fontSize: '0.9rem'}} className="mb-3">
                        Test container resilience by disrupting Docker containers
                      </p>
                      <Link to="/containers" className="btn btn-sm btn-outline-info w-100">
                        Select Container Target
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-3">
                  <div className="account-card">
                    <div className="account-content">
                      <div className="account-icon">
                        <FontAwesomeIcon icon={faFlask} className="gremlin-primary" />
                      </div>
                      <h5 className="mb-2">Scheduled Chaos</h5>
                      <p style={{color: '#a0a3a9', fontSize: '0.9rem'}} className="mb-3">
                        Create scheduled experiments with recurring patterns
                      </p>
                      <Link to="/experiments" className="btn btn-sm btn-gremlin-outline w-100">
                        Create Scheduled Experiment
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <h6 className="fw-bold mb-3 mt-4 text-uppercase" style={{color: '#a0a3a9', letterSpacing: '1px'}}>Tools</h6>
              <div className="row">
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="account-card">
                    <div className="account-content">
                      <div className="d-flex align-items-center">
                        <div className="account-icon me-3" style={{width: '40px', height: '40px', marginBottom: 0}}>
                          <FontAwesomeIcon icon={faChartBar} style={{color: '#6c757d'}} />
                        </div>
                        <div>
                          <h6 className="mb-1">Experiment Reports</h6>
                          <p style={{color: '#a0a3a9', fontSize: '0.8rem'}} className="mb-0">
                            View historical data
                          </p>
                        </div>
                      </div>
                      <Link to="/reports" className="btn btn-sm btn-outline-secondary mt-3 w-100">
                        View Reports
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="account-card">
                    <div className="account-content">
                      <div className="d-flex align-items-center">
                        <div className="account-icon me-3" style={{width: '40px', height: '40px', marginBottom: 0}}>
                          <FontAwesomeIcon icon={faNetworkWired} style={{color: '#20c997'}} />
                        </div>
                        <div>
                          <h6 className="mb-1">Infrastructure</h6>
                          <p style={{color: '#a0a3a9', fontSize: '0.8rem'}} className="mb-0">
                            Manage targets
                          </p>
                        </div>
                      </div>
                      <Link to="/servers" className="btn btn-sm btn-outline-success mt-3 w-100">
                        Infrastructure Manager
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="account-card">
                    <div className="account-content">
                      <div className="d-flex align-items-center">
                        <div className="account-icon me-3" style={{width: '40px', height: '40px', marginBottom: 0}}>
                          <FontAwesomeIcon icon={faCloud} className="gremlin-primary" />
                        </div>
                        <div>
                          <h6 className="mb-1">Cloud Accounts</h6>
                          <p style={{color: '#a0a3a9', fontSize: '0.8rem'}} className="mb-0">
                            Manage connections
                          </p>
                        </div>
                      </div>
                      <Link to="/settings" className="btn btn-sm btn-gremlin-outline mt-3 w-100">
                        Account Settings
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="account-card">
                    <div className="account-content">
                      <div className="d-flex align-items-center">
                        <div className="account-icon me-3" style={{width: '40px', height: '40px', marginBottom: 0, backgroundColor: 'rgba(252, 82, 35, 0.15)'}}>
                          <FontAwesomeIcon icon={faCog} className="gremlin-primary" />
                        </div>
                        <div>
                          <h6 className="mb-1">System Settings</h6>
                          <p style={{color: '#a0a3a9', fontSize: '0.8rem'}} className="mb-0">
                            Global configuration
                          </p>
                        </div>
                      </div>
                      <Link to="/settings" className="btn btn-sm btn-gremlin-primary mt-3 w-100">
                        Open Settings
                      </Link>
                    </div>
                  </div>
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