export default function secured() {
  return function(req, res, next) {
    if (req.user) { return next() }
    req.session.returnTo = req.originalUrl
    res.redirect('/login')
  }
}
