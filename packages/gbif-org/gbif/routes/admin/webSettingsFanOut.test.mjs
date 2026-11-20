import cookieParser from 'cookie-parser';
import express from 'express';
import net from 'node:net';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

// Backstage switching a setting on every gbif-web instance: two real servers, each with the admin
// routes, listed in ADMIN_GBIF_WEB_NODES. The request goes to one; it signs a token and changes
// both. (In one process the two share the settings module, so each instance is checked through its
// own endpoint's answer.)
const ADMIN = { userName: 'admin', email: 'admin@gbif.org', roles: ['REGISTRY_ADMIN'] };

vi.mock('../user/user.model.mjs', () => ({
  getByUserName: async (userName) => (userName === 'admin' ? ADMIN : undefined),
  getClientUser: (user) => user,
}));

const freePort = () =>
  new Promise((resolve) => {
    const probe = net.createServer().listen(0, () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });

let servers = [];
let ports = [];
let utils;

beforeAll(async () => {
  ports = [await freePort(), await freePort()];
  process.env.JWT_SECRET = 'test-secret';
  process.env.GRAPHQL_JWT_SECRET = 'test-graphql-secret';
  process.env.ADMIN_USERS = ADMIN.email;
  process.env.ADMIN_GBIF_WEB_NODES = ports.map((port) => `http://localhost:${port}`).join(',');
  vi.resetModules();
  utils = await import('../auth/utils.mjs');
  const { register } = await import('./endpoints.mjs');
  servers = await Promise.all(
    ports.map(
      (port) =>
        new Promise((resolve) => {
          const app = express();
          app.use(express.json());
          app.use(cookieParser());
          register(app);
          const server = app.listen(port, () => resolve(server));
        })
    )
  );
});
afterAll(async () => {
  await Promise.all(servers.map((server) => new Promise((resolve) => server.close(resolve))));
  delete process.env.ADMIN_GBIF_WEB_NODES;
});

describe('/api/admin/web-settings with several instances', () => {
  it('switches every instance and reports each', async () => {
    const cookie = `token=${utils.generateToken(ADMIN)}`;
    const response = await fetch(`http://localhost:${ports[0]}/api/admin/web-settings`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie },
      body: JSON.stringify({ settings: { clientErrorReporting: false } }),
    });
    expect(response.status).toBe(200);
    const { results } = await response.json();
    expect(results).toHaveLength(2);
    for (const result of results) {
      expect(result).toMatchObject({ ok: true, settings: { clientErrorReporting: false } });
    }

    const read = await fetch(`http://localhost:${ports[1]}/api/admin/web-settings`, {
      headers: { cookie },
    });
    expect((await read.json()).results.map((r) => r.settings)).toEqual([
      { clientErrorReporting: false },
      { clientErrorReporting: false },
    ]);
  });

  it('shows an instance that cannot be reached', async () => {
    servers[1].close();
    const cookie = `token=${utils.generateToken(ADMIN)}`;
    const { results } = await (
      await fetch(`http://localhost:${ports[0]}/api/admin/web-settings`, { headers: { cookie } })
    ).json();
    expect(results.map((r) => r.ok)).toEqual([true, false]);
  });
});
