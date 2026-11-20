import cookieParser from 'cookie-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// Admin endpoints for gbif-web's own runtime settings, against the real router with a stubbed user
// lookup. The settings are read at import, so the environment is set first.
const ADMIN = {
  userName: 'admin',
  email: 'admin@gbif.org',
  roles: ['REGISTRY_ADMIN'],
};
const OTHER = { userName: 'someone', email: 'someone@gbif.org', roles: [] };

vi.mock('../user/user.model.mjs', () => ({
  getByUserName: async (userName) => ({ admin: ADMIN, someone: OTHER })[userName],
  getClientUser: (user) => user,
}));

let server;
let base;
let utils;
let settings;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.GRAPHQL_JWT_SECRET = 'test-graphql-secret';
  process.env.ADMIN_USERS = ADMIN.email;
  delete process.env.ADMIN_GBIF_WEB_NODES;
  vi.resetModules();
  utils = await import('../auth/utils.mjs');
  settings = await import('../../config/runtimeSettings.mjs');
  const { register } = await import('./endpoints.mjs');
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  register(app);
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://localhost:${server.address().port}/api/admin`;
});
afterAll(() => new Promise((resolve) => server.close(resolve)));
beforeEach(() => settings.setRuntimeSettings({ clientErrorReporting: true }));

const switchOff = (token) =>
  fetch(`${base}/instance/settings`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ settings: { clientErrorReporting: false } }),
  });

describe('/api/admin/instance/settings', () => {
  it('lets another instance change the setting with an admin token', async () => {
    const response = await switchOff(utils.generateInstanceAdminToken(ADMIN));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ settings: { clientErrorReporting: false } });
    expect(settings.getRuntimeSettings().clientErrorReporting).toBe(false);
  });

  it('is invisible without a valid admin token, and changes nothing', async () => {
    const loginCookieToken = utils.generateToken(ADMIN); // valid login, but no instance audience
    const forNonAdmin = utils.generateInstanceAdminToken(OTHER);
    const expired = jwt.sign({ userName: 'admin' }, 'test-secret', {
      audience: 'gbif-web-instance-admin',
      expiresIn: -10,
    });
    const otherSecret = jwt.sign({ userName: 'admin' }, 'wrong', {
      audience: 'gbif-web-instance-admin',
    });
    for (const token of [undefined, loginCookieToken, forNonAdmin, expired, otherSecret]) {
      expect((await switchOff(token)).status).toBe(404);
    }
    expect(settings.getRuntimeSettings().clientErrorReporting).toBe(true);
  });

  it('refuses invalid settings', async () => {
    const response = await fetch(`${base}/instance/settings`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${utils.generateInstanceAdminToken(ADMIN)}`,
      },
      body: JSON.stringify({ settings: { clientErrorReporting: 'no' } }),
    });
    expect(response.status).toBe(400);
  });
});

describe('/api/admin/web-settings', () => {
  it('is invisible to visitors who are not logged in as an admin', async () => {
    const read = await fetch(`${base}/web-settings`);
    const write = await fetch(`${base}/web-settings`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ settings: { clientErrorReporting: false } }),
    });
    expect(read.status).toBe(404);
    expect(write.status).toBe(404);
    expect(settings.getRuntimeSettings().clientErrorReporting).toBe(true);
  });

  it('changes this instance when no instances are configured', async () => {
    const cookie = `token=${utils.generateToken(ADMIN)}`;
    const response = await fetch(`${base}/web-settings`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie },
      body: JSON.stringify({ settings: { clientErrorReporting: false } }),
    });
    expect(response.status).toBe(200);
    expect((await response.json()).results).toEqual([
      { node: 'this instance', url: '', ok: true, settings: { clientErrorReporting: false } },
    ]);
    expect(settings.getRuntimeSettings().clientErrorReporting).toBe(false);
  });
});
