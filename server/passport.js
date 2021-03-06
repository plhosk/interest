import passport from 'passport'
import passportLocal from 'passport-local'
import passportGithub2 from 'passport-github2'
import passportTwitter from 'passport-twitter'

import User from './schemas/user'

const LocalStrategy = passportLocal.Strategy

const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
  //The maximum is exclusive and the minimum is inclusive
}

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
    'github.id': profile.id.toString(),
  }, (errFind, user) => {
    if (errFind) {
      return done(errFind)
    }
    // No user was found... so create a new user with values from GitHub (all the profile. stuff)
    if (!user) {
      user = new User({ // eslint-disable-line no-param-reassign
        'github.username': profile.username,
        'github.id': profile.id.toString(),
        displayName: profile.name,
        'local.username': `github-${profile.username}-${getRandomInt(1, 100000)}`, // to prevent duplicate usernames
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

const TwitterStrategy = passportTwitter.Strategy

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK,
}, (token, tokenSecret, profile, done) => {
  User.findOne({
    'twitter.id': profile.id.toString(),
  })
  .then((user) => {
    console.log('User to find: ', JSON.stringify(user)) // eslint-disable-line no-console
    if (!user) { // No user with the same twitter id found. Create a new user
      user = new User({  // eslint-disable-line no-param-reassign
        'twitter.id': profile.id.toString(),
        'twitter.name': profile.username,
        displayName: profile.displayName,
        'local.username': `twitter-${profile.username}-${getRandomInt(1, 100000)}`, // to prevent duplicate usernames
      })
      return user.save()
      .then(userSaved => done(null, userSaved))
    }
    // An existing user was found with this twitter ID. Continue with authentication
    return done(null, user)
  })
  .catch(err => done(err))
}))

/**
 * Configure Passport authenticated session persistence.
 * In order to restore authentication state across HTTP requests, Passport needs
 * to serialize users into and deserialize users out of the session.  In a
 * production-quality application, this would typically be as simple as
 * supplying the user ID when serializing, and querying the user record by ID
 * from the database when deserializing.
 */
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
