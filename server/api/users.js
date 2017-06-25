import express from 'express'
import debug from 'debug'

import User from '../schemas/user'

debug('api')

const router = express.Router({ mergeParams: true })

router.param('userId', (req, res, next, userId) => {
  debug(`Received API request for user ${userId}`)
  User.findOne({ userId })
    .then((requestedUser) => {
      req.requestedUser = requestedUser
      return next() // Go to the next part ('/:userId')
    })
    .catch(err => next(err))
})

// Get user object of any user
router.route('/:userId')
  // View a user
  .get((req, res) => {
    debug(`sending user object ${req.requestedUser.userId}`)
    debug(req.requestedUser.toJson())
    res.send(req.requestedUser.toJson()) // Already fetched user, just send it
  })

  .put((req, res, next) => {
    debug(req.isAuthenticated, req.user.userId, req.body)
    if (!req.isAuthenticated() || req.user.userId !== req.body.userId) {
      return next({ status: 401, message: 'Requesting user is not authenticated' })
    }
    req.requestedUser.displayName = req.body.displayName
    req.requestedUser.city = req.body.city
    req.requestedUser.country = req.body.country
    return req.requestedUser.save()
      .then(savedUser => res.send(savedUser.toJson()))
      .catch(err => next(err))
  })

router.route('/')
  .get((req, res, next) => {
    User.find()
      .then((users) => {
        const userList = []
        users.forEach((element) => {
          userList.push(element.toJson())
        })
        debug('Sending user list: ', userList)
        res.send(userList)
      })
      .catch(err => next(err))
  })

export default router
