import _ from 'lodash';
import passport from 'passport';
import { Strategy as OrcidStrategy } from 'passport-orcid';
import { update } from '../user/user.model.mjs';
import { authCallback } from './oauthUtils.mjs';
import { appendUser, isAuthenticated, jsonToBase64 } from './utils.mjs';
import { secretEnv } from '../../envConfig.mjs';

let scope = '/authenticate';

export function register(app) {
  // ORCID OAuth routes
  app.get('/auth/orcid/login', (req, res, next) => {
    let state = { action: 'LOGIN', target: req.headers.referer || '/' };
    let stateB64 = jsonToBase64(state);
    passport.authenticate('orcid', { scope: scope, state: stateB64 })(req, res, next);
  });

  app.get('/auth/orcid/connect', isAuthenticated, function (req, res, next) {
    let state = { action: 'CONNECT', target: req.headers.referer || '/' };
    let stateB64 = jsonToBase64(state);
    passport.authenticate('orcid', { scope: scope, state: stateB64 })(req, res, next);
  });

  app.post('/auth/orcid/disconnect', isAuthenticated, function (req, res, next) {
    _.set(req.user, 'systemSettings["auth.orcid.id"]', undefined);
    update(req.user.userName, req.user)
      .then(function () {
        res.redirect(302, req.headers.referer || '/');
      })
      .catch(function (err) {
        next(err);
      });
  });

  app.get('/auth/orcid/callback', appendUser, function (req, res, next) {
    passport.authenticate('orcid', { scope: scope }, function (err, profile, info) {
      // ORCID returns params as profile, need to extract the ORCID ID
      if (_.isObject(profile)) {
        profile.id = profile.orcid;
      }
      authCallback(req, res, next, err, profile, info, setProviderValues, 'ORCID', 'auth.orcid.id');
    })(req, res, next);
  });
}

function setProviderValues(user, profile) {
  _.set(user, 'systemSettings["auth.orcid.id"]', profile.id);
}

// Passport ORCID Strategy
passport.use(
  new OrcidStrategy(
    {
      clientID: secretEnv.ORCID_CLIENT_ID,
      clientSecret: secretEnv.ORCID_CLIENT_SECRET,
      callbackURL: `${secretEnv.DOMAIN}/auth/orcid/callback`,
      scope: '/authenticate',
    },
    async (accessToken, refreshToken, params, profile, done) => {
      // NOTE: `profile` is empty with ORCID, use `params` as profile instead
      return done(null, params, { accessToken, refreshToken, profile });
    }
  )
);
