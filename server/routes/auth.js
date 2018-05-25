const express = require('express')
const router = express.Router()

const passport = require('passport')

router.get('/google', passport.authenticate('google', {
  scope: ['openid', 'profile', 'email']
}))

router.get('/google/oauth2callback', passport.authenticate('google', {
  failureRedirect: process.env.NODE_ENV ? '/' : process.env.dev_client
}), (req, res) => {
  res.redirect(process.env.NODE_ENV ? '/' : process.env.dev_client)
})

module.exports = router
