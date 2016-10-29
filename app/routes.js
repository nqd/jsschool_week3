let isLoggedIn = require('./middlewares/isLoggedIn')
let Twitter = require('twitter')

module.exports = (app) => {
  let passport = app.passport

  app.get('/', (req, res) => {
    res.render('index.ejs', {message: req.flash('error')})
  })

  app.get('/timeline', isLoggedIn, (req, res) => {
    let client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: req.user.twitterId.token,
      access_token_secret: req.user.twitterId.tokenSecret
    });
    client.get('statuses/home_timeline', { count: 20 }, function(error, tweets, response) {
      let posts = require('../data/posts.js')
      res.render('timeline.ejs', {message: req.flash('error'), posts: tweets})
      // res.render('timeline.ejs', {message: req.flash('error'), posts: posts})
    })
  })
}