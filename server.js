const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Constants and persistent state for CPU calculation
const NS_PER_SEC = 1e9;
const US_PER_SEC = 1e6;
const BYTES_PER_MB = 1024 * 1024; 

let startCpu = process.cpuUsage();
let startHr = process.hrtime();
let latestMetrics = {}; // Store the latest metrics here

// Function to collect all metrics (adapted from previous steps)
function collectMetrics() {
    // CPU USAGE CALCULATION (Since last call)
    const cpuDiff = process.cpuUsage(startCpu);
    const hrDiff = process.hrtime(startHr);
    startCpu = process.cpuUsage();
    startHr = process.hrtime();

    const elapsedMicroseconds = (hrDiff[0] * US_PER_SEC) + (hrDiff[1] / 1000);
    const cpuUsedMicroseconds = cpuDiff.user + cpuDiff.system;
    const cpuPercentage = elapsedMicroseconds > 0 
        ? (cpuUsedMicroseconds / elapsedMicroseconds) * 100
        : 0;

    // MEMORY USAGE CALCULATION
    const memory = process.memoryUsage();
    const rssMB = memory.rss / BYTES_PER_MB;
    const heapUsedMB = memory.heapUsed / BYTES_PER_MB;

    // UPTIME CALCULATION
    const uptimeSeconds = process.uptime();
    const totalSeconds = Math.floor(uptimeSeconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const readableUptime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Update the global metrics object
    latestMetrics = {
        timestamp: new Date().toLocaleString('en-US'),
        cpu_percentage: parseFloat(cpuPercentage.toFixed(2)),
        memory_rss_mb: parseFloat(rssMB.toFixed(2)),
        memory_heap_used_mb: parseFloat(heapUsedMB.toFixed(2)),
        uptime_formatted: readableUptime,
    };
}

// 📌 Collect metrics every 1 second
setInterval(collectMetrics, 1000);


// --- NEW CONFIGURATION ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory
// --- END NEW CONFIGURATION ---

// ... (existing code for setInterval(collectMetrics, 1000);) ...

// --- EXPRESS ROUTES ---

// 1. Route to render the dashboard template
app.get('/resource-info', (req, res) => {
    // Pass initial data to the template (optional, but good practice)
    res.render('dashboard', { 
        pageTitle: 'Node.js Resource Dashboard',
        metrics: latestMetrics // Pass the current snapshot
    });
});

// 2. API endpoint to fetch the JSON data (no change needed here)
app.get('/api/metrics', (req, res) => {
    res.json(latestMetrics);
});

// Serve static files (where we'll put dashboard.js)
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`View dashboard at http://localhost:${port}/resource-info`);
});