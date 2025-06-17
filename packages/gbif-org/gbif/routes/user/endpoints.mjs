import dotenv from 'dotenv';

import { register as registerGitHub } from '../auth/github.ctrl.mjs';
import { register as registerGoogle } from '../auth/google.ctrl.mjs';
import { register as registerLocal } from '../auth/local.ctrl.mjs';
import { appendUser, disableCache } from '../auth/utils.mjs';
import { confirmAccount, logout, resetPassword, updatePassword, whoAmI } from './controllers.mjs';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

export function register(app) {
  registerLocal(app);
  registerGoogle(app);
  registerGitHub(app);

  // disable caching for user-related API endpoints
  app.use('/api/user', disableCache);

  app.post('/api/user/who-am-i', appendUser, whoAmI);
  app.post('/api/user/logout', logout);
  app.post('/api/user/reset-password', resetPassword);
  app.post('/api/user/confirm', confirmAccount);
  app.post('/api/user/update-password', updatePassword);
}
