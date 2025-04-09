import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCog, 
  faCloud, 
  faPlus, 
  faEdit, 
  faTrash, 
  faKey, 
  faCloudUploadAlt,
  faTimes,
  faCheck,
  faSpinner,
  faUser,
  faShieldAlt,
  faNetworkWired,
  faServer,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import { faAws, faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons';

const Settings = () => {
  // Mock cloud accounts data - in a real app, this would come from an API call
  const [infraAccounts, setInfraAccounts] = useState([
    { 
      id: 1, 
      name: 'AWS Production', 
      provider: 'aws', 
      region: 'us-east-1', 
      accessKeyId: 'AKIA*************', 
      status: 'active',
      createdAt: '2025-04-01T10:00:00Z',
      lastUsed: '2025-04-09T08:10:30Z'
    },
    { 
      id: 2, 
      name: 'AWS Development', 
      provider: 'aws', 
      region: 'us-west-2', 
      accessKeyId: 'AKIA*************', 
      status: 'active',
      createdAt: '2025-04-02T14:30:00Z',
      lastUsed: '2025-04-08T16:45:22Z'
    },
    { 
      id: 3, 
      name: 'Azure Primary', 
      provider: 'azure', 
      region: 'eastus', 
      tenantId: '72f988bf-****-****-****-************', 
      status: 'active',
      createdAt: '2025-04-03T09:15:00Z',
      lastUsed: '2025-04-09T11:20:15Z'
    }
  ]);
  
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    provider: 'aws',
    region: '',
    accessKeyId: '',
    secretAccessKey: '',
    tenantId: '',
    clientId: '',
    clientSecret: '',
    projectId: '',
    serviceAccountKey: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  // Handle input changes for the new account form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccount({
      ...newAccount,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Validate the form based on selected provider
  const validateForm = () => {
    const errors = {};
    
    if (!newAccount.name.trim()) {
      errors.name = 'Account name is required';
    }

    if (!newAccount.region.trim()) {
      errors.region = 'Region is required';
    }
    
    // AWS specific validation
    if (newAccount.provider === 'aws') {
      if (!newAccount.accessKeyId.trim()) {
        errors.accessKeyId = 'Access Key ID is required';
      }
      
      if (!newAccount.secretAccessKey) {
        errors.secretAccessKey = 'Secret Access Key is required';
      }
    }
    
    // Azure specific validation
    if (newAccount.provider === 'azure') {
      if (!newAccount.tenantId.trim()) {
        errors.tenantId = 'Tenant ID is required';
      }
      
      if (!newAccount.clientId.trim()) {
        errors.clientId = 'Client ID is required';
      }
      
      if (!newAccount.clientSecret) {
        errors.clientSecret = 'Client Secret is required';
      }
    }
    
    // GCP specific validation
    if (newAccount.provider === 'gcp') {
      if (!newAccount.projectId.trim()) {
        errors.projectId = 'Project ID is required';
      }
      
      if (!newAccount.serviceAccountKey) {
        errors.serviceAccountKey = 'Service Account Key is required';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        // Create new account with generated ID
        const newId = Math.max(...infraAccounts.map(a => a.id)) + 1;
        const accountToAdd = {
          id: newId,
          name: newAccount.name,
          provider: newAccount.provider,
          region: newAccount.region,
          accessKeyId: newAccount.provider === 'aws' ? newAccount.accessKeyId : undefined,
          tenantId: newAccount.provider === 'azure' ? newAccount.tenantId : undefined,
          projectId: newAccount.provider === 'gcp' ? newAccount.projectId : undefined,
          status: 'active',
          createdAt: new Date().toISOString(),
          lastUsed: new Date().toISOString()
        };
        
        setInfraAccounts([...infraAccounts, accountToAdd]);
        setIsSubmitting(false);
        setShowAddAccountModal(false);
        setSuccessMessage('Infrastructure account added successfully');
        
        // Reset form
        setNewAccount({
          name: '',
          provider: 'aws',
          region: '',
          accessKeyId: '',
          secretAccessKey: '',
          tenantId: '',
          clientId: '',
          clientSecret: '',
          projectId: '',
          serviceAccountKey: ''
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }, 1000);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = (accountId) => {
    // In a real app, this would be an API call
    if (confirm('Are you sure you want to delete this infrastructure account? This will remove all associated resources and experiments.')) {
      setInfraAccounts(infraAccounts.filter(account => account.id !== accountId));
      setSuccessMessage('Infrastructure account deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-6">
          <FontAwesomeIcon icon={faCog} className="me-2" /> 
          System Settings
        </h1>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <FontAwesomeIcon icon={faCheck} className="me-2" />
          {successMessage}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccessMessage('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Infrastructure Accounts Management */}
      <div className="card shadow mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="m-0 fw-bold">
            <FontAwesomeIcon icon={faCloud} className="me-2" /> 
            Infrastructure Accounts
          </h5>
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => setShowAddAccountModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="me-1" />
            Add Account
          </button>
        </div>
        <div className="card-body">
          {infraAccounts.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Provider</th>
                    <th>Region</th>
                    <th>Credentials</th>
                    <th>Status</th>
                    <th>Last Used</th>
                    <th>Actions</th>
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
                        {account.provider === 'aws' && (
                          <span className="text-muted small">
                            <FontAwesomeIcon icon={faKey} className="me-1" />
                            {account.accessKeyId}
                          </span>
                        )}
                        {account.provider === 'azure' && (
                          <span className="text-muted small">
                            <FontAwesomeIcon icon={faKey} className="me-1" />
                            Tenant: {account.tenantId}
                          </span>
                        )}
                        {account.provider === 'gcp' && (
                          <span className="text-muted small">
                            <FontAwesomeIcon icon={faKey} className="me-1" />
                            Project: {account.projectId}
                          </span>
                        )}
                      </td>
                      <td>
                        {account.status === 'active' ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-danger">Inactive</span>
                        )}
                      </td>
                      <td>{formatDate(account.lastUsed)}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteAccount(account.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              <FontAwesomeIcon icon={faCloudUploadAlt} className="me-2" />
              No infrastructure accounts found. Add an account to get started with chaos experiments.
            </div>
          )}
        </div>
      </div>
      
      {/* System Security */}
      <div className="card shadow mb-4">
        <div className="card-header">
          <h5 className="m-0 fw-bold">
            <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
            System Security
          </h5>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <strong>Coming Soon:</strong> Security configuration and IAM policy management will be available here.
          </div>
        </div>
      </div>
      
      {/* Network Configuration */}
      <div className="card shadow mb-4">
        <div className="card-header">
          <h5 className="m-0 fw-bold">
            <FontAwesomeIcon icon={faNetworkWired} className="me-2" />
            Network Configuration
          </h5>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <strong>Coming Soon:</strong> Network configuration options will be available here.
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FontAwesomeIcon icon={faPlus} className="me-1" />
                  Add New User
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddUserModal(false)}
                  disabled={isSubmitting}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.username ? 'is-invalid' : ''}`}
                      id="username"
                      name="username"
                      value={newUser.username}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                    {formErrors.username && (
                      <div className="invalid-feedback">{formErrors.username}</div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                    {formErrors.email && (
                      <div className="invalid-feedback">{formErrors.email}</div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                    {formErrors.password && (
                      <div className="invalid-feedback">{formErrors.password}</div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className={`form-control ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={newUser.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                    {formErrors.confirmPassword && (
                      <div className="invalid-feedback">{formErrors.confirmPassword}</div>
                    )}
                  </div>
                  
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isAdmin"
                      name="isAdmin"
                      checked={newUser.isAdmin}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                    <label className="form-check-label" htmlFor="isAdmin">
                      Admin User
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowAddUserModal(false)}
                    disabled={isSubmitting}
                  >
                    <FontAwesomeIcon icon={faTimes} className="me-1" />
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="me-1 fa-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCheck} className="me-1" />
                        Create User
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Infrastructure Account Modal */}
      {showAddAccountModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FontAwesomeIcon icon={faPlus} className="me-1" />
                  Add Infrastructure Account
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddAccountModal(false)}
                  disabled={isSubmitting}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Account Name</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      placeholder="e.g., Production AWS, Development Azure"
                      value={newAccount.name}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                    {formErrors.name && (
                      <div className="invalid-feedback">{formErrors.name}</div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="provider" className="form-label">Cloud Provider</label>
                    <select
                      className="form-select"
                      id="provider"
                      name="provider"
                      value={newAccount.provider}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="aws">AWS</option>
                      <option value="azure">Azure</option>
                      <option value="gcp">Google Cloud Platform</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="region" className="form-label">Region</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.region ? 'is-invalid' : ''}`}
                      id="region"
                      name="region"
                      placeholder={newAccount.provider === 'aws' ? 'e.g., us-east-1' : 
                                  newAccount.provider === 'azure' ? 'e.g., eastus' : 
                                  'e.g., us-central1'}
                      value={newAccount.region}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                    {formErrors.region && (
                      <div className="invalid-feedback">{formErrors.region}</div>
                    )}
                  </div>
                  
                  {/* AWS specific fields */}
                  {newAccount.provider === 'aws' && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="accessKeyId" className="form-label">Access Key ID</label>
                        <input
                          type="text"
                          className={`form-control ${formErrors.accessKeyId ? 'is-invalid' : ''}`}
                          id="accessKeyId"
                          name="accessKeyId"
                          placeholder="AKIA..."
                          value={newAccount.accessKeyId}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                        {formErrors.accessKeyId && (
                          <div className="invalid-feedback">{formErrors.accessKeyId}</div>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="secretAccessKey" className="form-label">Secret Access Key</label>
                        <input
                          type="password"
                          className={`form-control ${formErrors.secretAccessKey ? 'is-invalid' : ''}`}
                          id="secretAccessKey"
                          name="secretAccessKey"
                          value={newAccount.secretAccessKey}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                        {formErrors.secretAccessKey && (
                          <div className="invalid-feedback">{formErrors.secretAccessKey}</div>
                        )}
                      </div>
                    </>
                  )}
                  
                  {/* Azure specific fields */}
                  {newAccount.provider === 'azure' && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="tenantId" className="form-label">Tenant ID</label>
                        <input
                          type="text"
                          className={`form-control ${formErrors.tenantId ? 'is-invalid' : ''}`}
                          id="tenantId"
                          name="tenantId"
                          placeholder="72f988bf-..."
                          value={newAccount.tenantId}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                        {formErrors.tenantId && (
                          <div className="invalid-feedback">{formErrors.tenantId}</div>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="clientId" className="form-label">Client ID (App ID)</label>
                        <input
                          type="text"
                          className={`form-control ${formErrors.clientId ? 'is-invalid' : ''}`}
                          id="clientId"
                          name="clientId"
                          value={newAccount.clientId}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                        {formErrors.clientId && (
                          <div className="invalid-feedback">{formErrors.clientId}</div>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="clientSecret" className="form-label">Client Secret</label>
                        <input
                          type="password"
                          className={`form-control ${formErrors.clientSecret ? 'is-invalid' : ''}`}
                          id="clientSecret"
                          name="clientSecret"
                          value={newAccount.clientSecret}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                        {formErrors.clientSecret && (
                          <div className="invalid-feedback">{formErrors.clientSecret}</div>
                        )}
                      </div>
                    </>
                  )}
                  
                  {/* GCP specific fields */}
                  {newAccount.provider === 'gcp' && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="projectId" className="form-label">Project ID</label>
                        <input
                          type="text"
                          className={`form-control ${formErrors.projectId ? 'is-invalid' : ''}`}
                          id="projectId"
                          name="projectId"
                          placeholder="my-gcp-project-123"
                          value={newAccount.projectId}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                        {formErrors.projectId && (
                          <div className="invalid-feedback">{formErrors.projectId}</div>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="serviceAccountKey" className="form-label">Service Account Key (JSON)</label>
                        <textarea
                          className={`form-control ${formErrors.serviceAccountKey ? 'is-invalid' : ''}`}
                          id="serviceAccountKey"
                          name="serviceAccountKey"
                          rows="5"
                          placeholder="Paste the JSON service account key here"
                          value={newAccount.serviceAccountKey}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        ></textarea>
                        {formErrors.serviceAccountKey && (
                          <div className="invalid-feedback">{formErrors.serviceAccountKey}</div>
                        )}
                      </div>
                    </>
                  )}
                  
                  <div className="alert alert-info">
                    <FontAwesomeIcon icon={faLock} className="me-2" />
                    Your cloud credentials are securely encrypted before being stored.
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowAddAccountModal(false)}
                    disabled={isSubmitting}
                  >
                    <FontAwesomeIcon icon={faTimes} className="me-1" />
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="me-1 fa-spin" />
                        Adding Account...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCheck} className="me-1" />
                        Add Account
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal backdrops */}
      {showAddUserModal && (
        <div className="modal-backdrop fade show"></div>
      )}
      {showAddAccountModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default Settings;