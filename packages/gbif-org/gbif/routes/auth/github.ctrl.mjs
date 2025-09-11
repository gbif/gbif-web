import _ from 'lodash';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { update } from '../user/user.model.mjs';
import { authCallback } from './oauthUtils.mjs';
import { appendUser, getReturnUrl, isAuthenticated, jsonToBase64 } from './utils.mjs';
import { secretEnv } from '../../envConfig.mjs';

export function register(app) {
  // GitHub OAuth routes
  app.get('/auth/github/login', (req, res, next) => {
    const returnUrl = getReturnUrl(req);
    const state = { action: 'LOGIN', target: returnUrl ?? '/' };
    const stateB64 = jsonToBase64(state);
    passport.authenticate('github', { scope: ['user:email'], state: stateB64 })(req, res, next);
  });

  app.get('/auth/github/connect', isAuthenticated, function (req, res, next) {
    let state = { action: 'CONNECT', target: req.headers.referer || '/' };
    let stateB64 = jsonToBase64(state);
    passport.authenticate('github', { scope: ['user:email'], state: stateB64 })(req, res, next);
  });

  app.post('/auth/github/disconnect', isAuthenticated, function (req, res, next) {
    _.set(req.user, 'systemSettings["auth.github.id"]', undefined);
    _.set(req.user, 'systemSettings["auth.github.photo"]', undefined);
    _.set(req.user, 'systemSettings["auth.github.username"]', undefined);
    update(req.user.userName, req.user)
      .then(function () {
        res.redirect(302, req.headers.referer || '/');
      })
      .catch(function (err) {
        next(err);
      });
  });

  app.get('/auth/github/callback', appendUser, function (req, res, next) {
    passport.authenticate(
      'github',
      { session: false, failureRedirect: '/login' },
      function (err, profile, info) {
        authCallback(
          req,
          res,
          next,
          err,
          profile,
          info,
          setProviderValues,
          'GITHUB',
          'auth.github.id'
        );
      }
    )(req, res, next);
  });
}

function setProviderValues(user, profile) {
  _.set(user, 'systemSettings["auth.github.id"]', profile.id);
  _.set(user, 'systemSettings["auth.github.photo"]', _.get(profile, 'photos[0].value'));
  _.set(user, 'systemSettings["auth.github.username"]', profile.username);
}

// Passport GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: secretEnv.GITHUB_CLIENT_ID,
      clientSecret: secretEnv.GITHUB_CLIENT_SECRET,
      callbackURL: `${secretEnv.DOMAIN}/auth/github/callback`,
      scope: 'user:email',
    },
    async (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);
