/* eslint-disable func-names */
import mongoose from 'mongoose'
import AutoIncrement from 'mongoose-sequence'
import bcrypt from 'bcrypt-nodejs'

const userSchema = mongoose.Schema({
  local: {
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  github: {
    username: {
      type: String,
    },
    id: {
      type: String,
    },
  },
  twitter: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  displayName: String,
  // city: String,
  // country: String,
})

userSchema.plugin(AutoIncrement, { inc_field: 'userId' })


// Any schema method that references "this" must not be in arrow notation

const SALT_FACTOR = 10

userSchema.pre('save', function (done) {
  const user = this
  if (!user.isModified('local.password')) {
    return done()
  }

  return bcrypt.genSalt(SALT_FACTOR, (errSalt, salt) => {
    if (errSalt) {
      return done(errSalt)
    }
    return bcrypt.hash(user.local.password, salt, null, (errHash, passwordHash) => {
      if (errHash) {
        return done(errHash)
      }
      user.local.password = passwordHash
      return done()
    })
  })
})

userSchema.methods.validatePassword = function (inputPassword, done) {
  bcrypt.compare(inputPassword, this.local.password, (error, isValid) => {
    done(error, isValid)
  })
}

userSchema.methods.name = function () {
  return this.displayName || this.twitter.name || this.github.username || this.local.username
}

// userSchema.methods.getId = function () {
//   return this._id
// }

userSchema.methods.toJson = function () {
  return {
    userId: this.userId,
    name: this.name(),
    // city: this.city || '',
    // country: this.country || '',
  }
}

export default mongoose.model('User', userSchema)
