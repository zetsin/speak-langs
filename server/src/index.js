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

const routes = require('./routes')
const passport = require('./passport')
const io = require('./io')

const sessionMiddleware = session({
  store: new store({
    path: '.node-persist/sessions'
  }),
  secret: 'zetsin',
  resave: true,
  saveUninitialized: true
})

const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(sessionMiddleware)
app.use(express.static(path.join(__dirname, '../../build')))


app.use(passport.initialize())
app.use(passport.session())

// routes
Object.keys(routes).forEach(key => app.use(`/${key}`, routes[key]))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'))
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
