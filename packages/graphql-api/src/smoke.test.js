import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

describe('Service Smoke Test', () => {
  let serverProcess;
  const PORT = process.env.PORT || 4000;
  const url = `http://localhost:${PORT}/graphql`;

  beforeAll(async () => {
    // Start your actual service
    serverProcess = spawn('node', ['src/index.js'], {
      env: { ...process.env, PORT, NODE_ENV: 'test' },
    });

    // Wait for server to be ready
    await setTimeout(3000); // or implement proper health check polling
  });

  afterAll(async () => {
    if (serverProcess) {
      serverProcess.kill();
      await setTimeout(1000); // graceful shutdown
    }
  });

  it('should respond to a query', async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: '{ __typename }',
      }),
    });

    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.errors).toBeUndefined();
  });
});
