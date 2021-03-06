import express from 'express'
import passport from 'passport'

const router = express.Router()

router.route('/callback')
  .get(passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/')
    })

router.route('/')
  .get(passport.authenticate('github'))
  // .get(passport.authenticate('github', { scope: ['user:email'] }))

export default router
