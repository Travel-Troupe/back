import dotenv from 'dotenv'
import util from 'util'
import url from 'url'
import querystring from 'querystring'
import { Router } from 'express'

import passport from '../config/passport.js'
import { isProduction } from '../config/constant.js'

const router = Router()
dotenv.config()

router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile'
}), function (req, res) {
  res.redirect('/')
})

router.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user) {
    if (err) { return next(err) }
    if (!user) { return res.redirect('/login') }
    req.logIn(user, function (err) {
      if (err) { return next(err) }
      const returnTo = req.session.returnTo
      delete req.session.returnTo
      res.redirect(returnTo || '/user')
    })
  })(req, res, next)
})

router.get('/logout', (req, res) => {
  req.logout()

  let returnTo = req.protocol + '://' + req.hostname
  let port = req.connection.localPort
  // production is using default port
  if (port !== undefined && port !== 80 && port !== 443 && !isProduction) {
    returnTo += ':' + port
  }

  let logoutURL = new url.URL(
    util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN)
  )
  let searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  })
  logoutURL.search = searchString

  res.redirect(logoutURL)
})

export default router
