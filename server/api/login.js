/* eslint-disable no-underscore-dangle */
import express from 'express'
import passport from 'passport'
import debug from 'debug'

const log = debug('api')

const router = express.Router()

router.route('/')
  .post((req, res, next) => {
    log('Received API request for login authentication')
    passport.authenticate('login', (errAuth, user) => {
      if (errAuth) {
        return next(errAuth)
      }
      if (!user) {
        return next({ status: 401, message: 'Login failed. Username or password is incorrect' })
      }
      return req.login(user, (errLogin) => {
        if (errLogin) {
          return next(errLogin)
        }
        // login successful. send user info
        // return res.send({
        //   // id: user._id,
        //   userId: user.userId,
        //   username: user.name(),
        // })
        return res.send(user.toJson())
      })
    })(req, res, next)
  })

  // Get user object of requesting authenticated user
  .get((req, res, next) => {
    log('Received API request for info of authenticated user')
    if (req.isAuthenticated()) {
      // res.send({
      //   // id: req.user._id,
      //   userId: req.user.userId,
      //   username: req.user.name(),
      // })
      return res.send(req.user.toJson())
    }
    return next({ status: 204, message: 'Requesting user is not authenticated' })
  })

export default router
