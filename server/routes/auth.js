const url = require('url')

const express = require('express')
const router = express.Router()

const passport = require('passport')

router.get('/google', passport.authenticate('google', {
  scope: ['openid', 'profile', 'email']
}))

router.get('/google/oauth2callback', (req, res, next) => {
  if(!process.env.NODE_ENV && req.header('Referer') === process.env.dev_client) {
    res.redirect(url.resolve(process.env.dev_client_server, req.originalUrl))
  }
  else {
    next()
  }
}, passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/')
})

module.exports = router
