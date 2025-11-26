# Resource Monitoring Tool

Lightweight Node.js app that monitors system resources and exposes a small dashboard. Includes a monitor script, a simple server, and a browser dashboard under `public/`.

**Status:** Minimal prototype — lightweight monitoring + dashboard.

**Contents:**
- `monitor.js` — resource-collection script (CPU, memory, optionally disk/network)
- `server.js` — Express server that serves the dashboard and API endpoints
- `public/` — client-side assets (dashboard JS, CSS)
- `views/` — server-side templates (EJS)

**Prerequisites**
- Node.js 16+ (or current LTS)
- npm or yarn

**Install**
Run these commands from the project root (Windows bash):

```bash
cd "d:/project/pocketschool/Resource Monitoring Tools"
npm install
```

**Run (development)**
- Start the monitor and server in separate terminals, or use a process manager.

In one terminal (monitor):
```bash
node monitor.js
```

In another terminal (server):
```bash
node server.js
```

Open the dashboard at `http://localhost:3000/` (port depends on `server.js` configuration).

**Common commands**
- Install dependencies: `npm install`
- Run server: `node server.js`
- Run monitor: `node monitor.js`

**File structure**

- `monitor.js` — collects system metrics and (optionally) pushes to server
- `server.js` — serves `views/` and `public/` assets, provides API endpoints
- `public/dashboard.js` — client-side dashboard logic
- `views/dashboard.ejs` — dashboard template
- `package.json` — dependencies and scripts

**Usage notes**
- If `monitor.js` posts metric data to the server, check the endpoint URL and port in the script.
- Adjust polling intervals in `monitor.js` to reduce CPU impact.
- On Windows, run the bash commands in Git Bash, WSL, or another bash-compatible shell.

**Troubleshooting**
- Port in use: change the port in `server.js` or stop the conflicting process.
- Missing modules: run `npm install` to ensure dependencies are present.
- Permission issues: on Windows, run the terminal as Administrator if needed for low-level metrics.

**Extending**
- Add persistence: store metrics in a small database (SQLite, InfluxDB).
- Add auth to the dashboard for production.
- Add charts with a library (Chart.js, ECharts) for richer visuals.

**License & Contact**
This repository is provided as-is. For questions, open an issue or contact the repository owner.

---

For quick verification, run the server and open the dashboard URL; check the browser console for client errors and the server terminal for runtime logs.
# Resource-Monitoring-Tool
