import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export default async function checkJwt(req, res, next) {
  const bearerHeader = req.headers['authorization']

  if (!bearerHeader) return res.status(400).json({ error: 'Access denied' })

  const token = bearerHeader.split(' ')[1]

  try {
    const userToken = jwt.verify(token, process.env.JWTSECRET)

    if (!userToken.id) {
      throw new Error('Invalid user')
    }

    const [user] = await User.find({ name: userToken.name })
    if(user) {
      req.user = user
    } else {
      throw new Error('User not found')
    }

    next()
  } catch (e) {
    console.error(e)
    res.status(400).json({ error: `Invalid token: ${e?.message}` })
  }
}
