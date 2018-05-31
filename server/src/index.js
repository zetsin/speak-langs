require('app-module-path').addPath(__dirname)
const path = require('path')
const url = require('url')

const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const store = require('session-file-store')(session)
const logger = require('morgan')
const debug = require('debug')('speak-langs:app')
const passport = require('passport')
const baiduStrategy = require('passport-baidu').Strategy
const weiboStrategy = require('passport-weibo').Strategy
const googleStrategy = require('passport-google-oauth').OAuth2Strategy
const routes = require('./routes')
const io = require('./io')
const stores = require('./stores')

const app = express()
const sessionMiddleware = session({
  store: new store({
    path: '.node-persist/sessions'
  }),
  secret: 'zetsin',
  resave: true,
  saveUninitialized: true
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(sessionMiddleware)
app.use(express.static(path.join(__dirname, '../../build')))

passport.use(new baiduStrategy({
  clientID: 'pOkGhm4bG5D5fdnZHb9iNttX',
  clientSecret: 'dOecNbfLOY5IgRoFQEAVzZ1Y2WGrbvtl',
  callbackURL: 'http://localhost:8000/auth/baidu/oauth2callback'
}, (token, tokenSecret, profile, cb) => {
  profile.displayName = profile.username
  cb(null, profile)
}))
passport.use(new weiboStrategy({
  clientID: '3350792186',
  clientSecret: '716743af54404037d82b4bedc1d99aa3',
  callbackURL: 'http://speak-langs/auth/weibo/oauth2callback'
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
app.use(passport.initialize())
app.use(passport.session())

// routes
Object.keys(routes).forEach(key => app.use(`/${key}`, routes[key]))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'))
})

// error handler
app.use(function(err, req, res, next) {
  debug(err)
  if(err.status === 401) {
    req.logout()
    res.redirect(req.originalUrl)
  }
  else {
    res.redirect('back')
  }
})

app.on('listening', () => {
  io(app).use((socket, next) => sessionMiddleware(socket.request, socket.request.res, next))
})
module.exports = app
