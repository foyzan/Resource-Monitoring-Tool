const NS_PER_SEC = 1e9; // Nanoseconds per second
const US_PER_SEC = 1e6; // Microseconds per second
const US_PER_MS = 1000; // Microseconds per millisecond
const BYTES_PER_MB = 1024 * 1024; 

let startCpu = process.cpuUsage();
let startHr = process.hrtime();


function getIntervalCpuUsageReport() {
    // 1. CPU USAGE CALCULATION
    const cpuDiff = process.cpuUsage(startCpu);
    const hrDiff = process.hrtime(startHr);

    // Reset the starting points for the next interval
    startCpu = process.cpuUsage();
    startHr = process.hrtime();

    const elapsedMicroseconds = (hrDiff[0] * US_PER_SEC) + (hrDiff[1] / 1000);
    const cpuUsedMicroseconds = cpuDiff.user + cpuDiff.system;
    
    const cpuPercentage = elapsedMicroseconds > 0 
        ? (cpuUsedMicroseconds / elapsedMicroseconds) * 100
        : 0;

    // 2. MEMORY USAGE CALCULATION (using process.memoryUsage())
    const memory = process.memoryUsage();
    
    // We use RSS (Resident Set Size) as the general indicator for total RAM used by the process
    const rssMB = memory.rss / BYTES_PER_MB;
    const heapUsedMB = memory.heapUsed / BYTES_PER_MB; // V8 Heap used by JavaScript objects

    // 3. UPTIME CALCULATION (using process.uptime())
    const uptimeSeconds = process.uptime();

    // Convert seconds to human-readable HH:MM:SS format
    const totalSeconds = Math.floor(uptimeSeconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const readableUptime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // 4. Create a readable timestamp
    const readableTimestamp = new Date().toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    });

    // 5. Return the comprehensive JSON-ready object
    return {
        timestamp: readableTimestamp,
        process_id: process.pid,
        metrics: {
            cpu_percentage_single_core: cpuPercentage.toFixed(2), // Percentage of a single core used in the last interval

            // Memory Metrics
            memory_rss_mb: rssMB.toFixed(2),             // Total memory (RAM) allocated to the process by the OS
            memory_heap_used_mb: heapUsedMB.toFixed(2),  // Memory used by active JavaScript objects

            // Uptime Metrics
            uptime_seconds: uptimeSeconds.toFixed(3),
            uptime_formatted: readableUptime,
        }
    };
}


// --- Main Execution ---

const intervalSeconds = 2;
console.log(`\nStarting Full System Metrics Report (every ${intervalSeconds} seconds)...`);
console.log('---');

const timer = setInterval(() => {
    // Simulate a workload (keep this small in production, or remove it entirely)
    let sum = 0;
    for (let i = 0; i < 20000000; i++) {
        sum += i;
    }

    const report = getIntervalCpuUsageReport();
    
    // Output the JSON string
    console.log(JSON.stringify(report, null, 2));
    console.log('---');
    
}, intervalSeconds * 1000);

// Optional: Stop the interval after a short time
;