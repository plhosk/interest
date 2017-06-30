import express from 'express'
import debug from 'debug'
import validUrl from 'valid-url'

import Image from '../schemas/image'


const router = express.Router()
const log = debug('api')

router.param('imageId', (req, res, next, imageId) => {
  log(`Received API request for image ${imageId}`)
  Image.findOne({ imageId })
  .then((requestedImage) => {
    req.requestedImage = requestedImage
    return next() // Go to the next part ('/:imageId')
  })
  .catch(err => next(err))
})

router.route('/:imageId')
  // Get a single image
  // .get((req, res) => {
  //   log(`sending image json ${req.requestedImage.imageId}`)
  //   log(req.requestedImage.toJson())
  //   res.send(req.requestedImage.toJson()) // Already fetched, just send it
  // })

// Delete an image
  .delete((req, res, next) => {
    log(`Received API request to delete image ${req.requestedImage.imageId}`)
    if (!req.isAuthenticated() || req.user.userId !== req.requestedImage.submitterId) {
      return next({ status: 401, message: 'User not authenticated or not owner of image' })
    }
    req.requestedImage.deleted = true
    return req.requestedImage.save()
    .then(savedImage => res.send(savedImage.toJson()))
    .catch(err => next(err))
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

router.route('/')
  // Get all images in an array of objects
  .get((req, res, next) => {
    log('Received API request to send an array of all images')
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

  // Add new image
  .post((req, res, next) => {
    log('Received API request to add a new image')
    if (!req.isAuthenticated()) {
      return next({ status: 401, message: 'User not authenticated' })
    }
    if (!validUrl.isWebUri(req.body.url)) {
      next({ status: 400, message: 'Submitted URL is malformed' })
    }
    const image = new Image()
    image.submitterId = req.user.userId
    image.url = req.body.url
    image.caption = req.body.caption
    return image.save()
    .then(savedImage => res.send(savedImage.toJson()))
    .catch(err => next(err))
  })

export default router
