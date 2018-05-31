const debug = require('debug')('speak-langs:passport')
const passport = require('passport')
const baiduStrategy = require('passport-baidu').Strategy
const weiboStrategy = require('passport-weibo').Strategy
const googleStrategy = require('passport-google-oauth').OAuth2Strategy

const stores = require('./stores')

passport.use(new baiduStrategy({
  clientID: process.env.baidu_clientID || 'clientID',
  clientSecret: process.env.baidu_clientSecret || 'clientSecret',
  callbackURL: process.env.baidu_callbackURL || '',
}, (token, tokenSecret, profile, cb) => {
  profile.displayName = profile.username
  cb(null, profile)
}))
passport.use(new weiboStrategy({
  clientID: process.env.weibo_clientID || 'clientID',
  clientSecret: process.env.weibo_clientSecret || 'clientSecret',
  callbackURL: process.env.weibo_callbackURL || '',
}, (token, tokenSecret, profile, cb) => {
  profile._json = JSON.parse(profile._json)
  profile.photos = [{
    value: profile._json.profile_image_url
  }]
  cb(null, profile)
}))
passport.use(new googleStrategy({
  clientID: process.env.google_clientID || 'clientID',
  clientSecret: process.env.google_clientSecret || 'clientSecret',
  callbackURL: process.env.google_callbackURL || '',
}, (token, tokenSecret, profile, cb) => {
  cb(null, profile)
}))
passport.serializeUser((user, cb) => {
  user.image = user.photos[0] ? user.photos[0].value : ''
  user._raw = ''
  stores.users.setItem(user.id, user)
  cb(null, {
    id: user.id
  })
})
passport.deserializeUser((user, cb) => {
  stores.users.getItem(user.id)
  .then(user => {
    cb(user ? null : createError(401), user)
  })
  .catch(debug)
})

module.exports = passport
