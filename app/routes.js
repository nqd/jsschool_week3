/*
 * todo: when error, display the flash message
 * well, i dont know flash well, will update if have some time 
 */

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
      let posts = tweets.map(filtedTweet)
      res.render('timeline.ejs', {message: req.flash('error'), posts: posts})
    })
  })

  app.post('/like/:id', isLoggedIn, (req, res) => {
    let id = req.params.id
    let client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: req.user.twitterId.token,
      access_token_secret: req.user.twitterId.tokenSecret
    });
    client.post('favorites/create', { id: id }, function(error, tweets, response) {
      console.log(`error ${error}`)
      res.redirect('/timeline')
    })
  })

  app.post('/unlike/:id', isLoggedIn, (req, res) => {
    let id = req.params.id
    let client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: req.user.twitterId.token,
      access_token_secret: req.user.twitterId.tokenSecret
    });
    client.post('favorites/destroy', { id: id }, function(error, tweets, response) {
      console.log(`error ${error}`)
      res.redirect('/timeline')
    })
  })

  app.get('/reply/:id', isLoggedIn, (req, res) => {
    let id = req.params.id
    let client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: req.user.twitterId.token,
      access_token_secret: req.user.twitterId.tokenSecret
    });

    client.get(`statuses/show/${id}`, (error, tweet, response) => {
      if (error) return res.redirect('/timeline')

      res.render('reply.ejs', {message: req.flash('error'), post: filtedTweet(tweet)})
    })
  })

  app.post('/reply/:id', isLoggedIn, (req, res) => {
    console.log(req.query);
    let reply = req.body.reply
    if (!reply) {
      // todo: showing error when missing the tweet
      return res.redirect('/timeline')
    }
    let client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: req.user.twitterId.token,
      access_token_secret: req.user.twitterId.tokenSecret
    })

    client.post('statuses/update',
      { in_reply_to_status_id: req.params.id, status: reply},
      (error, tweet, response) => {
        // todo: showing error when update failed
        return res.redirect('/timeline')
      }
    )
  })
}

function filtedTweet(tweet) {
  return {
    id: tweet.id_str,
    image: tweet.user.profile_image_url,
    text: tweet.text,
    name: tweet.description,
    username: tweet.username,
    liked: tweet.favorited,
    network: {
      icon: 'twitter',
      name: 'Twitter',
      class: 'btn-info'
    }
  }
}
