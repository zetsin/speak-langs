const url = require('url')

const express = require('express')
const router = express.Router()

const passport = require('passport')

router.get('/google', passport.authenticate('google', {
  scope: ['openid', 'profile', 'email']
}))

router.get('/google/oauth2callback', (req, res, next) => {
  if(url.parse(req.get('referer')).host === process.env.dev_client_host && req.get('host') !== process.env.dev_client_server_host) {
    console.log(process.env.dev_client_server_host, req.originalUrl)
    console.log(url.resolve(process.env.dev_client_server_host, req.originalUrl))
    res.redirect(url.resolve(process.env.dev_client_server_host, req.originalUrl))
  }
  else {
    next()
  }
}, passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect(req.get('referer') || '/')
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect(req.get('referer') || '/')
})

module.exports = router
