import express from 'express'
import User from '../schemas/user'

const router = express.Router()

router.route('/')
  .post((req, res, next) => {
    const username = req.body.username
    const password = req.body.password
    User.findOne({
      'local.username': username,
    })
    .then((user) => {
      if (user) {
        return next({ status: 400, message: 'Signup failed. Username may already be taken' })
      }
      const newUser = new User({
        'local.username': username,
        'local.password': password,
      })
      newUser.save()
      .then(() => res.sendStatus(200))
    })
    .catch(err => next(err))
  })

export default router
