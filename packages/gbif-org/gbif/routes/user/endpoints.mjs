import { register as registerGitHub } from '../auth/github.ctrl.mjs';
import { register as registerGoogle } from '../auth/google.ctrl.mjs';
import { register as registerLocal } from '../auth/local.ctrl.mjs';
import { register as registerOrcid } from '../auth/orcid.ctrl.mjs';
import { appendUser, disableCache } from '../auth/utils.mjs';
import {
  confirmAccount,
  create,
  logout,
  resetPassword,
  updateKnownPassword,
  updatePasswordFromChallengeCode,
  updateProfile,
  whoAmI,
  mailToUser,
  showUserInRegistry,
} from './controllers.mjs';
import { getChallenge, requireProofOfWork } from './pow.mjs';

export function register(app) {
  registerLocal(app);
  registerGoogle(app);
  registerGitHub(app);
  registerOrcid(app);

  // disable caching for user-related API endpoints
  app.use('/api/user', disableCache);

  app.post('/api/user/who-am-i', appendUser, whoAmI);
  app.post('/api/user/logout', logout);
  app.post('/api/user/reset-password', resetPassword);
  app.post('/api/user/confirm', confirmAccount);
  app.post('/api/user/update-forgotten-password', updatePasswordFromChallengeCode);
  app.post('/api/user/update-known-password', updateKnownPassword);
  app.put('/api/user/update-profile', appendUser, updateProfile);
  app.put('/api/user/challenge', getChallenge);
  app.put('/api/user/create', requireProofOfWork, create);
  app.get('/api/feedback/user/mailto/:user', appendUser, mailToUser);
  app.get('/api/feedback/user/:user', appendUser, showUserInRegistry);
}
