import dotenv from 'dotenv';

import { register as registerGitHub } from './auth/github.ctrl.mjs';
import { register as registerGoogle } from './auth/google.ctrl.mjs';
import { register as registerLocal } from './auth/local.ctrl.mjs';

dotenv.config();

export function register(app) {
  registerLocal(app);
  registerGoogle(app);
  registerGitHub(app);
}
