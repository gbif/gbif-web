import dotenv from 'dotenv';

import { register as registerGitHub } from './auth/github.ctrl.mjs';
import { register as registerGoogle } from './auth/google.ctrl.mjs';
import { register as registerLocal } from './auth/local.ctrl.mjs';
import { appendUser, disableCache, removeTokenCookie } from './auth/utils.mjs';
import { getClientUser } from './user/user.model.mjs';

dotenv.config();

export function register(app) {
  registerLocal(app);
  registerGoogle(app);
  registerGitHub(app);

  app.use('/api/user', disableCache);

  app.post('/api/user/who-am-i', appendUser, (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(200).json({ message: 'UNKNOWN_USER' });
      }
      const user = getClientUser(req.user);
      res.json({ user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'UNKNOWN_USER' });
    }
  });

  app.get('/api/user/logout', (req, res) => {
    removeTokenCookie(res);
    res.send('Logged out');
  });
}
