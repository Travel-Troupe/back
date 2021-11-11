import express from 'express'
import cors from 'cors'
import IndexRoutes from './routes/index.js'
import AuthRoutes from './routes/auth.js'
import UserRoutes from './routes/user.js'
import connectDb from './utils/connection.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import dotenv from 'dotenv'
import passport from 'passport'
import Auth0Strategy from 'passport-auth0'

dotenv.config()

let strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:5000/callback'
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile)
  }
)

passport.use(strategy)
 
passport.serializeUser(function (user, done) {
  done(null, user)
})
  
passport.deserializeUser(function (user, done) {
  done(null, user)
})
  
const app = express()

app.use(cookieParser())

let sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true
}

app.use(session(sess))

app.use(passport.initialize())
app.use(passport.session())

connectDb()

app.use(express.urlencoded({extended: true})) 
app.use(express.json())
app.use(cors())
// Middlewares

// Routes
app.use('/', IndexRoutes)
app.use('/', AuthRoutes)
app.use('/', UserRoutes)
export default app
