// config/auth.js
module.exports = {
  'development': {
    'facebook': {
      'consumerKey': '319319811769506',
      'consumerSecret': 'b4d1530b8ef0bc2a44c054334deaae8e',
      'callbackUrl': 'http://socialauthenticator.com:8000/auth/facebook/callback'
    },
    'twitter': {
      'consumerKey': 'OaPwwyfXjd8WkPzPEWPlpT6Fs',
      'consumerSecret': '...',
      'callbackUrl': 'http://social-authenticator.com:8000/auth/twitter/callback'
    },
    'google': {
      'consumerKey': '446585441765-unda5mjs6307q1pqobvhiqj87m9m2kh1.apps.googleusercontent.com',
      'consumerSecret': '...',
      'callbackUrl': 'http://social-authenticator.com:8000/auth/google/callback'
    }
  }
}
