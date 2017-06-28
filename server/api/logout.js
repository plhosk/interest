import express from 'express'
import debug from 'debug'

const log = debug('api')

const router = express.Router()

router.route('/')
  .delete((req, res) => {
    log('Received API request for logout')
    req.logOut()
    req.session.destroy(() => {
      res.sendStatus(200)
    })
  })

export default router
