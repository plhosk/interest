import 'babel-polyfill'
import {} from 'dotenv/config'
import express from 'express'
import historyApiFallback from 'connect-history-api-fallback'
import path from 'path'
import favicon from 'serve-favicon'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import passport from 'passport'
import bluebird from 'bluebird'

import apiGithub from './api/github'
import apiSignup from './api/signup'
import apiLogin from './api/login'
import apiLogout from './api/logout'
import apiUsers from './api/users'

import hotRouter from './hot-reload'
import myPassport from './passport'

// initialize mongoose
const MongoStore = connectMongo(session)
const MONGO_URI = process.env.MONGO_URI
mongoose.connect(MONGO_URI)
mongoose.Promise = bluebird

// initialize express app and plugins
const app = express()
app.set('port', process.env.PORT || 3000)
app.use(favicon(path.join(__dirname, '/../public/favicon.ico')))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  }),
  resave: true,
  saveUninitialized: true,
}))
// define passport strategies
myPassport()
app.use(passport.initialize())
app.use(passport.session())

// handle api paths here
app.use('/api/github', apiGithub) // also handles /api/github/callback
app.use('/api/signup', apiSignup)
app.use('/api/login', apiLogin)
app.use('/api/logout', apiLogout)
app.use('/api/users', apiUsers)

// Handle 404 (incl. client-side routes) by redirecting to index.html
app.use(historyApiFallback())

// Development mode uses hot-reloading of client app. This intercepts
// requests for index.html and the js bundles
if (process.env.NODE_ENV !== 'production') {
  app.use(hotRouter)
}

// Serve static files.
// - in development mode this will serve images or other files
// if this is omitted, requests to images will return index.html (broken image)
// in production mode this also serves index.hml and JS bundles
app.use(express.static('public'))

// error handler for API requests
app.use('/api', (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Send error in json
  console.log(err) // eslint-disable-line no-console
  res.status(err.status || 500).send({ message: (typeof err === 'string' ? err : err.message) })
})

app.listen(app.get('port'), () => {
  console.log(`Server started on port ${app.get('port')}`) // eslint-disable-line no-console
})
