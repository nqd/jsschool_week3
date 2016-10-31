let Twitter = require('twitter')

module.exports = function twitterClient(req, res, next) {
  let client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: req.user.twitterId.token,
    access_token_secret: req.user.twitterId.tokenSecret
  });
  req.twitterClient = client
  next()
}