import Auth0Strategy from 'passport-auth0'

const strategy = new Auth0Strategy(
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

export default strategy
