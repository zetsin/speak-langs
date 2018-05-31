const url = require('url')

const express = require('express')
const router = express.Router()

const passport = require('passport')

const redirect = (req, res, next) => {
  if(url.parse(req.get('referer') || '').host === process.env.dev_client_host && req.get('host') !== process.env.dev_server_host) {
    res.redirect(url.format({
      ...url.parse(req.originalUrl),
      protocol: 'http',
      host: process.env.dev_server_host,
    }).toString())
  }
  else {
    next()
  }
}

router.get('/test', (req, res) => {
  res.json(req.session)
})

router.get('/google', passport.authenticate('google', {
  scope: ['openid', 'profile', 'email']
}))
router.get('/google/oauth2callback', redirect, passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('back')
})

router.get('/baidu', passport.authenticate('baidu'))
router.get('/baidu/oauth2callback', redirect, passport.authenticate('baidu', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('back')
})

router.get('/weibo', passport.authenticate('weibo'))
router.get('/weibo/oauth2callback', redirect, passport.authenticate('weibo', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('back')
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('back')
})

module.exports = router
