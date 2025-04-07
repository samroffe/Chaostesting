// Charts.js for the Chaos Engineering Tool

// Load experiment history chart
function loadExperimentHistoryChart(days) {
  fetch(`/api/experiments/history/${days}`)
    .then(response => response.json())
    .then(data => {
      const ctx = document.getElementById('experimentHistoryChart').getContext('2d');
      
      // If there's an existing chart, destroy it
      if (window.experimentHistoryChart) {
        window.experimentHistoryChart.destroy();
      }
      
      // Create new chart
      window.experimentHistoryChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `Experiment Results (Last ${days} Days)`
            },
            legend: {
              position: 'top',
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            }
          },
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          }
        }
      });
    })
    .catch(error => {
      console.error('Error loading experiment history chart:', error);
      const chartContainer = document.getElementById('experimentHistoryChart').parentNode;
      chartContainer.innerHTML = '<div class="alert alert-danger">Failed to load chart data</div>';
    });
}

// Update history chart when period selector is changed
document.addEventListener('DOMContentLoaded', function() {
  const periodSelector = document.getElementById('historyPeriod');
  if (periodSelector) {
    periodSelector.addEventListener('change', function() {
      loadExperimentHistoryChart(this.value);
    });
  }
  
  // Initialize any summary charts on the dashboard
  initDashboardCharts();
});

// Initialize dashboard summary charts
function initDashboardCharts() {
  const targetTypeChart = document.getElementById('targetTypeChart');
  if (targetTypeChart) {
    drawTargetTypeChart(targetTypeChart);
  }
  
  const actionTypeChart = document.getElementById('actionTypeChart');
  if (actionTypeChart) {
    drawActionTypeChart(actionTypeChart);
  }
}

// Draw target type distribution chart
function drawTargetTypeChart(canvas) {
  // Get data from data attributes
  const serverCount = parseInt(canvas.getAttribute('data-server-count'));
  const containerCount = parseInt(canvas.getAttribute('data-container-count'));
  
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Servers', 'Containers'],
      datasets: [{
        data: [serverCount, containerCount],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Target Type Distribution'
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Draw action type distribution chart
function drawActionTypeChart(canvas) {
  // Get data from data attributes
  const stopCount = parseInt(canvas.getAttribute('data-stop-count'));
  const startCount = parseInt(canvas.getAttribute('data-start-count'));
  const restartCount = parseInt(canvas.getAttribute('data-restart-count'));
  
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Stop', 'Start', 'Restart'],
      datasets: [{
        data: [stopCount, startCount, restartCount],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Action Type Distribution'
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}
