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
      let posts = tweets.map(obj => {
        return {
          id: obj.id_str,
          image: obj.user.profile_image_url,
          text: obj.text,
          name: obj.description,
          username: obj.username,
          liked: obj.favorited,
          network: {
            icon: 'twitter',
            name: 'Twitter',
            class: 'btn-info'
          }
        }
      })
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
}