import dotenv from 'dotenv';
import _ from 'lodash';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { update } from '../user/user.model.mjs';
import { authCallback } from './oauthUtils.mjs';
import { appendUser, isAuthenticated } from './utils.mjs';

dotenv.config();

export function register(app) {
  // Google OAuth routes
  app.get('/auth/google/login', (req, res, next) => {
    let state = { action: 'LOGIN', target: req.headers.referer || '/' };
    let stateB64 = btoa(JSON.stringify(state));
    passport.authenticate('google', { scope: ['profile', 'email'], state: stateB64 })(
      req,
      res,
      next
    );
  });

  app.get('/auth/google/connect', isAuthenticated, function (req, res, next) {
    let state = { action: 'CONNECT', target: req.headers.referer || '/' };
    let stateB64 = btoa(JSON.stringify(state));
    passport.authenticate('google', { scope: ['profile', 'email'], state: stateB64 })(
      req,
      res,
      next
    );
  });

  app.post('/auth/google/disconnect', isAuthenticated, function (req, res, next) {
    _.set(req.user, 'systemSettings["auth.google.id"]', undefined);
    _.set(req.user, 'systemSettings["auth.google.photo"]', undefined);
    _.set(req.user, 'systemSettings["auth.google.username"]', undefined);
    update(req.user.userName, req.user)
      .then(function () {
        res.redirect(302, req.headers.referer || '/');
      })
      .catch(function (err) {
        next(err);
      });
  });

  app.get('/auth/google/callback', appendUser, function (req, res, next) {
    passport.authenticate(
      'google',
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
          'GOOGLE',
          'auth.google.id'
        );
      }
    )(req, res, next);
  });
}

function setProviderValues(user, profile) {
  _.set(user, 'systemSettings["auth.google.id"]', profile.id);
  _.set(user, 'systemSettings["auth.google.photo"]', _.get(profile, 'photos[0].value'));
}

// Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.DOMAIN}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);
