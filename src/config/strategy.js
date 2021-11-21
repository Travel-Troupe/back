import Auth0Strategy from 'passport-auth0'
import { PROD_URL } from './constant.js'
import { PORT } from './constant.js'

const isProduction = process.env.NODE_ENV === 'production'

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL || isProduction ? `${PROD_URL}/callback` : `http://localhost:${PORT}/callback`
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile)
  }
)

export default strategy
