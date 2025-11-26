// Data history arrays for time-series charts
const MAX_DATA_POINTS = 15;
let cpuData = [];
let labels = [];

// --- Chart Initialization (remains largely the same, only removed memoryRssData array) ---

// 1. CPU Chart Setup
const cpuCtx = document.getElementById('cpuChart').getContext('2d');
const cpuChart = new Chart(cpuCtx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'CPU % (Single Core)',
            data: cpuData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.3 // Smoother line
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100 
            }
        }
    }
});

// 2. Memory RSS Chart Setup - Changed to a dynamic Line Chart for better time visualization
const memoryCtx = document.getElementById('memoryRssChart').getContext('2d');
const memoryRssChart = new Chart(memoryCtx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Total RSS (MB)',
            data: [], // Will be filled dynamically
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Megabytes (MB)'
                }
            }
        }
    }
});


// --- Data Fetching and Chart Update Logic ---

function updateCharts() {
    fetch('/api/metrics')
        .then(response => response.json())
        .then(data => {
            const timeLabel = new Date().toLocaleTimeString();
            
            // 1. Update Static Displays
            document.getElementById('uptime-display').textContent = `Uptime: ${data.uptime_formatted}`;
            document.getElementById('heap-used-value').textContent = `${data.memory_heap_used_mb} MB`;

            // 2. Update Time-Series Data
            labels.push(timeLabel);
            cpuData.push(data.cpu_percentage);
            memoryRssChart.data.datasets[0].data.push(data.memory_rss_mb);

            // Limit data points to keep the chart readable
            if (labels.length > MAX_DATA_POINTS) {
                labels.shift();
                cpuData.shift();
                memoryRssChart.data.datasets[0].data.shift();
            }

            // 3. Update Charts
            cpuChart.update();
            memoryRssChart.update();
        })
        .catch(error => console.error('Error fetching metrics:', error));
}

// 📌 Start the continuous updates every 1 second
setInterval(updateCharts, 1000);