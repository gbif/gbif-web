// routes/health.ts
import os from 'os';

export function register(app) {
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
    });
  });

  // More detailed system status endpoint
  app.get('/api/health/system', (req, res) => {
    res.json({
      status: 'ok',
      environment: process.env.NODE_ENV,
      nodejs: process.version,
      platform: process.platform,
      arch: process.arch,
      cpus: os.cpus().length,
    });
  });
}
