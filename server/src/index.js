require('app-module-path').addPath(__dirname)
const path = require('path')
const url = require('url')

const session = require('express-session')
const store = require('connect-mongodb-session')(session)
const mongodb = require('mongodb')
const compression = require('compression')
const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const debug = require('debug')('speak-langs:app')

const routes = require('./routes')
const io = require('./io')


const storeMiddleware = new store({
  uri: process.env.mongo_url,
  databaseName: process.env.mongo_db,
})
storeMiddleware.on('error', debug)

const sessionMiddleware = session({
  secret: 'keyboard cat',
  store: storeMiddleware,
  resave: true,
  saveUninitialized: true,
})

const app = express()
app.use(logger('dev'))
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(sessionMiddleware)
app.use(express.static(path.join(__dirname, '../../build')))

const passport = require('./passport')(app)
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
  mongodb.MongoClient.connect(process.env.mongo_url)
  .then(client => {
    const db = client.db(process.env.mongo_db)
    db.collection('rooms').update({
      _id: 'general',
    }, {
      _id: 'general',
      name: 'general',
      topic: 'Random topic room',
      priority: 1,
      created: Date.now() * 2
    }, {
      upsert: true
    })
    .catch(debug)

    app.set('db', db)
    io(app).use((socket, next) => sessionMiddleware(socket.request, socket.request.res, next))

  })
  .catch(debug)
})
module.exports = app
