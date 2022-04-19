import jwt from 'jsonwebtoken'

export default function generateToken(user) {
  const secret = process.env.JWTSECRET

  return jwt.sign(user, secret)
}
