import app from './app.js';
import { config } from './config/index.js';

const server = app.listen(config.port, () => {
  console.log(`Mock Ad Data API running on port ${config.port}`);
  console.log(`Health check: http://localhost:${config.port}/api/v1/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
