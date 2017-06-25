import passport from 'passport'
import passportLocal from 'passport-local'
import passportGithub2 from 'passport-github2'

import User from './schemas/user'

const LocalStrategy = passportLocal.Strategy

passport.use('login', new LocalStrategy((username, password, done) => {
  User.findOne({
    'local.username': username,
  }, (errFind, user) => {
    if (errFind) {
      return done(errFind)
    }
    if (!user) {
      return done(null, false, {
        message: 'No user has that username!',
      })
    }
    return user.validatePassword(password, (errValidate, isMatch) => {
      if (errValidate) {
        return done(errValidate)
      }
      if (isMatch) {
        return done(null, user)
      }
      return done(null, false, {
        message: 'Invalid password.',
      })
    })
  })
}))

const GitHubStrategy = passportGithub2.Strategy

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
},
(accessToken, refreshToken, profile, done) => {
  // check user table for anyone with a github ID of profile.id
  User.findOne({
    'github.id': profile.id,
  }, (errFind, user) => {
    if (errFind) {
      return done(errFind)
    }
    // No user was found... so create a new user with values from GitHub (all the profile. stuff)
    if (!user) {
      user = new User({ // eslint-disable-line no-param-reassign
        'github.username': profile.username,
        'github.id': profile.id,
      })
      return user.save((errSave) => {
        if (errSave) {
          return done(errSave)
        }
        return done(errSave, user)
      })
    }
    // found user. Return
    return done(errFind, user)
  })
}))

export default () => {
  passport.serializeUser((user, done) => {
    done(null, user._id) // eslint-disable-line no-underscore-dangle
  })
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
