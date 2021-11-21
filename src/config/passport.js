import passport from 'passport'
import strategy from './strategy.js'

export const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1200000,
  },
  resave: true,
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
