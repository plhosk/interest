import express from 'express'
import passport from 'passport'

const router = express.Router()

router.route('/callback')
  .get(passport.authenticate('twitter', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/')
    })

router.route('/')
  .get(passport.authenticate('twitter'))

export default router
