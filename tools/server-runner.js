// VEYRA 2.0 — Resilient Auto-Restarting Server Supervisor
// Keeps the local server permanently alive at http://localhost:3000
const { spawn } = require('child_process');
const path = require('path');

const PORT = process.env.PORT || '3000';
let activeProcess = null;
let restartAttempts = 0;

function launch() {
  console.log(`[VEYRA SUPERVISOR] Launching production server on port ${PORT}...`);
  
  const env = {
    ...process.env,
    PORT,
    NODE_OPTIONS: '--max-old-space-size=4096 --unhandled-rejections=warn',
  };

  const nextBin = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'bin', 'next');

  activeProcess = spawn(
    process.execPath,
    ['--max-old-space-size=4096', '--unhandled-rejections=warn', nextBin, 'start', '-p', PORT],
    {
      cwd: path.join(__dirname, '..'),
      env,
      stdio: 'inherit',
    }
  );

  activeProcess.on('error', (err) => {
    console.error('[VEYRA SUPERVISOR ERROR]', err.message);
  });

  activeProcess.on('exit', (code, signal) => {
    restartAttempts++;
    console.warn(`[VEYRA SUPERVISOR] Next.js process exited (code: ${code}, signal: ${signal}). Auto-restarting attempt #${restartAttempts} in 1500ms...`);
    setTimeout(launch, 1500);
  });
}

// Clean shutdown handlers
process.on('SIGINT', () => {
  if (activeProcess) activeProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (activeProcess) activeProcess.kill('SIGTERM');
  process.exit(0);
});

launch();
