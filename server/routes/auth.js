const url = require('url')

const express = require('express')
const router = express.Router()

const passport = require('passport')

router.get('/google', passport.authenticate('google', {
  scope: ['openid', 'profile', 'email']
}))

router.get('/google/oauth2callback', (req, res, next) => {
  if(req.header.referrer === process.env.dev_client && req.header.host !== url.parse(process.env.dev_client_server).host) {
    res.redirect(url.resolve(process.env.dev_client_server, req.originalUrl))
  }
  else {
    next()
  }
}, passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect(req.header.referrer)
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect(req.header.referrer)
})

module.exports = router
