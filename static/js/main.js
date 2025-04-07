// Main JavaScript for the Chaos Engineering Tool

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize tooltips
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  });

  // Initialize popovers
  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
  });

  // Server form toggle for SSH key authentication
  const authTypeSelector = document.getElementById('use_key_auth');
  if (authTypeSelector) {
    authTypeSelector.addEventListener('change', function() {
      toggleAuthFields();
    });
    // Initial toggle
    toggleAuthFields();
  }

  // Experiment form toggle for schedule type
  const scheduleTypeSelector = document.getElementById('schedule_type');
  if (scheduleTypeSelector) {
    scheduleTypeSelector.addEventListener('change', function() {
      toggleScheduleFields();
    });
    // Initial toggle
    toggleScheduleFields();
  }

  // Target type selector
  const targetTypeSelector = document.getElementById('target_type');
  if (targetTypeSelector) {
    targetTypeSelector.addEventListener('change', function() {
      toggleTargetFields();
    });
    // Initial toggle
    toggleTargetFields();
  }

  // Check server status
  const serverStatusButtons = document.querySelectorAll('.check-server-status');
  serverStatusButtons.forEach(button => {
    button.addEventListener('click', function() {
      const serverId = this.getAttribute('data-server-id');
      checkServerStatus(serverId);
    });
  });

  // Refresh containers
  const refreshContainersButtons = document.querySelectorAll('.refresh-containers');
  refreshContainersButtons.forEach(button => {
    button.addEventListener('click', function() {
      const hostId = this.getAttribute('data-host-id');
      refreshContainers(hostId);
    });
  });

  // Confirmation dialog for actions
  const confirmButtons = document.querySelectorAll('[data-confirm]');
  confirmButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const message = this.getAttribute('data-confirm');
      if (!confirm(message)) {
        e.preventDefault();
      }
    });
  });

  // Load charts if on reports page
  if (document.getElementById('experimentHistoryChart')) {
    loadExperimentHistoryChart(30); // Default to 30 days
  }
});

// Toggle SSH authentication fields
function toggleAuthFields() {
  const authTypeSelector = document.getElementById('use_key_auth');
  const passwordField = document.getElementById('password_field');
  const sshKeyField = document.getElementById('ssh_key_field');
  
  if (authTypeSelector.checked) {
    passwordField.style.display = 'none';
    sshKeyField.style.display = 'block';
  } else {
    passwordField.style.display = 'block';
    sshKeyField.style.display = 'none';
  }
}

// Toggle schedule fields based on schedule type
function toggleScheduleFields() {
  const scheduleType = document.getElementById('schedule_type').value;
  const oneTimeFields = document.getElementById('one_time_fields');
  const recurringFields = document.getElementById('recurring_fields');
  
  if (scheduleType === 'one_time') {
    oneTimeFields.style.display = 'block';
    recurringFields.style.display = 'none';
  } else {
    oneTimeFields.style.display = 'none';
    recurringFields.style.display = 'block';
  }
}

// Toggle target fields based on target type
function toggleTargetFields() {
  const targetType = document.getElementById('target_type').value;
  const serverTargetField = document.getElementById('server_target_field');
  const containerTargetField = document.getElementById('container_target_field');
  
  if (targetType === 'server') {
    serverTargetField.style.display = 'block';
    containerTargetField.style.display = 'none';
  } else {
    serverTargetField.style.display = 'none';
    containerTargetField.style.display = 'block';
  }
}

// Check server status via AJAX
function checkServerStatus(serverId) {
  const statusBadge = document.getElementById(`server-status-${serverId}`);
  const statusButton = document.querySelector(`[data-server-id="${serverId}"]`);
  
  // Show loading spinner
  statusButton.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>';
  
  fetch(`/servers/${serverId}/status`)
    .then(response => response.json())
    .then(data => {
      statusButton.innerHTML = 'Check Status';
      
      if (statusBadge) {
        statusBadge.textContent = data.status;
        statusBadge.className = 'badge rounded-pill ' + 
          (data.status === 'online' ? 'bg-success' : 'bg-danger');
      }
    })
    .catch(error => {
      console.error('Error checking server status:', error);
      statusButton.innerHTML = 'Check Status';
      if (statusBadge) {
        statusBadge.textContent = 'Error';
        statusBadge.className = 'badge rounded-pill bg-warning';
      }
    });
}

// Refresh containers via AJAX
function refreshContainers(hostId) {
  const refreshButton = document.querySelector(`[data-host-id="${hostId}"]`);
  
  // Show loading spinner
  refreshButton.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>';
  
  // Submit the form
  document.getElementById(`refresh-form-${hostId}`).submit();
}

// Format date for display
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString();
}
