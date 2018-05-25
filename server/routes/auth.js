const url = require('url')

const express = require('express')
const router = express.Router()

const passport = require('passport')

router.get('/google', passport.authenticate('google', {
  scope: ['openid', 'profile', 'email']
}))

router.get('/google/oauth2callback', (req, res, next) => {
  if(req.header('Referer') === process.env.dev_client && req.header('Host') !== url.parse(process.env.dev_client_server).host) {
    res.redirect(url.resolve(process.env.dev_client_server, req.originalUrl))
  }
  else {
    next()
  }
}, passport.authenticate('google', {
  failureRedirect: '/xxx'
}), (req, res) => {
  if(req.header('Host') === url.parse(process.env.dev_client_server).host) {
    res.redirect(process.env.dev_client)
  }
  else {
    res.redirect('/')
  }
})

module.exports = router
