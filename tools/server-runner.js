// VEYRA Resilient Production Server Runner
// Prevents Node 24 process exits from upstream external API timeouts/aborts (NOAA, GDACS, CCTV, RSS)

process.on('uncaughtException', (err) => {
  console.warn('[VEYRA SERVER UNCAUGHT]', err?.message || err);
});

process.on('unhandledRejection', (reason) => {
  console.warn('[VEYRA SERVER UNHANDLED REJECTION]', reason?.message || reason);
});

const http = require('http');
const next = require('next');

const app = next({ dev: false, dir: process.cwd() });
const handle = app.getRequestHandler();

const PORT = parseInt(process.env.PORT || '3000', 10);

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> VEYRA 2.0 Live Server ready at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('[FATAL SERVER START ERROR]', err);
  process.exit(1);
});
