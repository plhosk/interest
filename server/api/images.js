import express from 'express'
import debug from 'debug'

import Image from '../schemas/image'


const router = express.Router()
const log = debug('api')

router.param('imageId', (req, res, next, imageId) => {
  log(`Received API request for user ${imageId}`)
  Image.findOne({ imageId })
    .then((requestedImage) => {
      req.requestedImage = requestedImage
      return next() // Go to the next part ('/:imageId')
    })
    .catch(err => next(err))
})

// Get user object of any user
router.route('/:imageId')
  // Get a single image
  .get((req, res) => {
    log(`sending image json ${req.requestedImage.imageId}`)
    log(req.requestedImage.toJson())
    res.send(req.requestedImage.toJson()) // Already fetched user, just send it
  })

// Delete an image
  .delete((req, res, next) => {
    log(`Attempting to delete image ${req.requestedImage.imageId}`)
    if (!req.isAuthenticated() || req.user.userId !== req.requestedImage.submitterId) {
      return next({ status: 401, message: 'User not authenticated or not owner of image' })
    }
    req.requestedImage.deleted = true
    return req.requestedImage.save()
      .then(savedImage => res.send(savedImage.toJson()))
      .catch(err => next(err))
  // })
  })

// Update an image
// Disallow updating for simplicity
  // .put((req, res, next) => {
  //   if (!req.isAuthenticated() || req.user.userId !== req.requestedImage.submitterId) {
  //     return next({ status: 401, message: 'User not authenticated or not owner of image' })
  //   }
  //   req.requestedImage.url = req.body.url
  //   req.requestedImage.caption = req.body.caption
  //   return req.requestedImage.save()
  //     .then(savedImage => res.send(savedImage.toJson()))
  //     .catch(err => next(err))
  // })

// Get all images in an array of objects
router.route('/')
  .get((req, res, next) => {
    Image.find({ deleted: false })
      .sort('-date') // Sort by newest first
      .then((images) => {
        const imageArray = []
        images.forEach((image) => {
          imageArray.push(image.toJson()) // Quick way to get the fields I want without .select()
        })
        log(`Sending ${imageArray.length} images as array of image objects`)
        res.send(imageArray)
      })
      .catch(err => next(err))
  })

export default router
