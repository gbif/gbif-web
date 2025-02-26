import dotenv from 'dotenv';

import { register as registerGitHub } from './auth/github.ctrl.mjs';
import { register as registerGoogle } from './auth/google.ctrl.mjs';
import { register as registerLocal } from './auth/local.ctrl.mjs';

dotenv.config();

export function register(app) {
  registerLocal(app);
  registerGoogle(app);
  registerGitHub(app);

  // app.get('/api/user/:username', (req, res, next) => {
  //   console.log('GET /api/user/profile');
  //   getByUserName(req.params.username)
  //     .then((user) => {
  //       res.json(user);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       res.status(500).json({ message: err.message });
  //     });
  // });
}
