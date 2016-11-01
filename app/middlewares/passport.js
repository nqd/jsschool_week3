let passport = require('passport')
let FacebookStrategy = require('passport-facebook').Strategy
let TwitterStrategy = require('passport-twitter').Strategy
let User = require('../models/user')

function configure(config) {
  passport.use(new FacebookStrategy({
      'clientID': process.env.FB_CLIENTID || 'default',
      'clientSecret': process.env.FB_CLIENTSECRET || 'default',
      'callbackURL': 'http://socialauthenticator.com:8000/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, cb) {
      let user = new User({
        facebookId: {
          accessToken: accessToken,
          refreshToken: refreshToken,
          profileId: profile.id 
        }
      });
      user.save((err, user) => {
        console.log(err)
        console.log(user)
        return cb();
      })
    }
  ));

  passport.use(new TwitterStrategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY || 'default',
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET || 'default',
      callbackURL: 'http://socialauthenticator.com:8000/auth/twitter/callback'
    },
    function(token, tokenSecret, profile, cb) {
      let user = new User({
        twitterId: {
          token: token,
          tokenSecret: tokenSecret,
          profileId: profile.id 
        }
      });
      user.save((err, user) => {
        return cb(err, user);
      })
    }
  ));

  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });
}

module.exports = {
  passport: passport,
  configure: configure
}