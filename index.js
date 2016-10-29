#!/usr/bin/env babel-node

let path = require('path')
let express = require('express')
let morgan = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let session = require('express-session')
let MongoStore = require('connect-mongo')(session)
let mongoose = require('mongoose')
let requireDir = require('require-dir')
let flash = require('connect-flash')

let passport = require('passport')
let FacebookStrategy = require('passport-facebook').Strategy
let TwitterStrategy = require('passport-twitter').Strategy

let User = require('./app/models/user')

// let passportMiddleware = require('./app/middlewares/passport')

const NODE_ENV = process.env.NODE_ENV || 'development'

let app = express(),
  config = requireDir('./config', {recurse: true}),
  port = process.env.PORT || 8000

// passportMiddleware.configure(config.auth[NODE_ENV])
// app.passport = passportMiddleware.passport

// connect to the database
mongoose.connect(config.database[NODE_ENV].url)

// set up our express middleware
app.use(morgan('dev')) // log every request to the console
app.use(cookieParser('ilovethenodejs')) // read cookies (needed for auth)
app.use(bodyParser.json()) // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs') // set up ejs for templating

// required for passport
app.use(session({
  secret: 'ilovethenodejs',
  resave: true,
  saveUninitialized: true
}))

// Setup passport authentication middleware
// app.use(app.passport.initialize())
// persistent login sessions
// app.use(app.passport.session())
// Flash messages stored in session
app.use(flash())

passport.use(new FacebookStrategy({
    'clientID': '319319811769506',
    'clientSecret': 'b4d1530b8ef0bc2a44c054334deaae8e',
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
    consumerKey: 'Xs5cQV48wmf50kVNzqjwEksX0',
    consumerSecret: 'dur74p4CPDBERnC62fyWtJVz32OeptXtvqtNIPWFbX3I652cOX',
    callbackURL: 'http://socialauthenticator.com:8000/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, cb) {
    console.log('profile')
    console.log(JSON.stringify(profile));
    let user = new User({
      twitterId: {
        token: token,
        tokenSecret: tokenSecret,
        profileId: profile.id 
      }
    });
    user.save((err, user) => {
      console.log(err)
      console.log(user)
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
app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/timeline');
  }
);


// configure routes
require('./app/routes')(app)

// start server
app.listen(port, ()=> console.log(`Listening @ http://127.0.0.1:${port}`))
