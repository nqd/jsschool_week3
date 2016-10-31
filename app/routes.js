/*
 * todo: when error, display the flash message
 * well, i dont know flash well, will update if have some time 
 */

let isLoggedIn = require('./middlewares/isLoggedIn')
let twitterClient = require('./middlewares/twitterClient')

module.exports = (app) => {
  let passport = app.passport

  app.get('/', (req, res) => {
    res.render('index.ejs', {message: req.flash('error')})
  })

  app.get('/timeline', isLoggedIn, twitterClient, (req, res) => {
    req.twitterClient.get('statuses/home_timeline', { count: 20 }, function(error, tweets, response) {
      let posts = tweets.map(filtedTweet)
      res.render('timeline.ejs', {message: req.flash('error'), posts: posts})
    })
  })

  app.post('/like/:id', isLoggedIn, twitterClient, (req, res) => {
    let id = req.params.id
    req.twitterClient.post('favorites/create', { id: id }, function(error, tweets, response) {
      console.log(`error ${error}`)
      res.redirect('/timeline')
    })
  })

  app.post('/unlike/:id', isLoggedIn, twitterClient, (req, res) => {
    let id = req.params.id
    req.twitterClient.post('favorites/destroy', { id: id }, function(error, tweets, response) {
      console.log(`error ${error}`)
      res.redirect('/timeline')
    })
  })

  app.get('/reply/:id', isLoggedIn, twitterClient, (req, res) => {
    let id = req.params.id
    req.twitterClient.get(`statuses/show/${id}`, (error, tweet, response) => {
      if (error) return res.redirect('/timeline')

      res.render('reply.ejs', {message: req.flash('error'), post: filtedTweet(tweet)})
    })
  })

  app.post('/reply/:id', isLoggedIn, twitterClient, (req, res) => {
    let reply = req.body.reply
    if (!reply) {
      // todo: showing error when missing the tweet
      return res.redirect('/timeline')
    }

    req.twitterClient.post('statuses/update',
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
