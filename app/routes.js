/*
 * todo: when error, display the flash message
 * well, i dont know flash well, will update if have some time 
 */

let isLoggedIn = require('./middlewares/isLoggedIn')
let twitterClient = require('./middlewares/twitterClient')

module.exports = (app) => {
  app.get('/auth/facebook',
    app.passport.authenticate('facebook'));

  app.get('/auth/facebook/callback',
    app.passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );

  app.get('/auth/twitter',
    app.passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', 
    app.passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/timeline');
    }
  );


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

  app.get('/compose', isLoggedIn, twitterClient, (req, res) => {
    res.render('compose.ejs')
  })

  app.post('/compose', isLoggedIn, twitterClient, (req, res) => {
    let reply = req.body.reply
    if (!reply) {
      // todo: showing error when missing the tweet
      return res.redirect('/timeline')
    }
    req.twitterClient.post('statuses/update',
      { status: reply },
      (error, tweet, response) => {
        // todo: showing error when update failed
        return res.redirect('/timeline')
      }
    )
  })

  app.get('/share/:id', isLoggedIn, twitterClient, (req, res) => {
    req.twitterClient.get(`statuses/show/${req.params.id}`, (error, tweet, response) => {
      if (error) return res.redirect('/timeline')

      res.render('share.ejs', {message: req.flash('error'), post: filtedTweet(tweet)})
    })
  })

  app.post('/share/:id', isLoggedIn, twitterClient, (req, res) => {
    let share = req.body.share
    if (!share) {
      // todo: showing error when missing the tweet
      return res.redirect('/timeline')
    }

    req.twitterClient.post('statuses/retweet',
      { id: req.params.id },
      (error, tweet, response) => {
        console.log(`retweet error ${JSON.stringify(error)}`)
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
