let isLoggedIn = require('./middlewares/isLoggedIn')

module.exports = (app) => {
  let passport = app.passport

  app.get('/', (req, res) => {
    res.render('index.ejs', {message: req.flash('error')})
  })

  app.get('/timeline', (req, res) => {
    let posts = require('../data/posts.js')
    res.render('timeline.ejs', {message: req.flash('error'), posts: posts})
  })
}