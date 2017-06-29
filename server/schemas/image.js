/* eslint-disable func-names */
import mongoose from 'mongoose'
import AutoIncrement from 'mongoose-sequence'

const imageSchema = mongoose.Schema({
  submitterId: Number,
  url: String,
  caption: String,
  date: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
})

imageSchema.plugin(AutoIncrement, { inc_field: 'imageId' })

// Any schema method that references "this" must not be in arrow notation

imageSchema.methods.toJson = function () {
  return {
    imageId: this.imageId,
    submitterId: this.submitterId,
    url: this.url,
    caption: this.caption,
    // imgHeight: this.imgHeight,
    date: this.date,
    deleted: this.deleted,
  }
}

export default mongoose.model('Image', imageSchema)
