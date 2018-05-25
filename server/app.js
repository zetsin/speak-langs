require('app-module-path').addPath(__dirname)
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const debug = require('debug')('play2talk:app')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const routes = require('routes')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../build')))

passport.use(new GoogleStrategy({
  clientID: process.env.google_clientID,
  clientSecret: process.env.google_clientSecret,
  callbackURL: process.env.google_callbackURL
}, (token, tokenSecret, profile, done) => {
  // debug(token, tokenSecret, profile)
}))
app.use(passport.initialize())
app.use(passport.session())

// routes
Object.keys(routes).forEach(key => app.use(`/${key}`, routes[key]))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json(err)
})

module.exports = app
