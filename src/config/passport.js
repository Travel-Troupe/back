import passport from 'passport'
import strategy from './strategy.js'

export const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true
}

passport.use(strategy)
 
passport.serializeUser(function (user, done) {
  done(null, user)
})
  
passport.deserializeUser(function (user, done) {
  done(null, user)
})

export default passport
