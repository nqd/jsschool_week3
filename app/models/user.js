
let mongoose = require('mongoose')

let UserSchema = mongoose.Schema({
  local: {
    email: String,
    password: String
  },
  facebookId: {
    accessToken: String,
    refreshToken: String,
    profileId: String
  }
})

let User = mongoose.model('User', UserSchema)

module.exports = User

