const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const StravaStrategy = require('passport-strava-oauth2').Strategy;
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');
const passport = require('passport');

// ===== JWT STRATEGY =====
const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

// ===== STRAVA STRATEGY =====
const stravaStrategy = new StravaStrategy(
  {
    clientID: config.strava.clientId,
    clientSecret: config.strava.clientSecret,
    callbackURL: config.strava.callbackUrl,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ stravaId: profile.id });
      if (!user) {
        user = await User.create({
          name: profile.displayName || profile.username,
          stravaId: profile.id,
          accessToken,
          refreshToken,
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
);

// ===== SERIALIZATION (For Strava Sessions) =====
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ===== USE STRATEGIES =====
passport.use(jwtStrategy);
passport.use(stravaStrategy);

module.exports = {
  jwtStrategy,
  stravaStrategy,
  passport,
};
