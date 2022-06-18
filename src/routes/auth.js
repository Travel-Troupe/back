import { Router } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

const router = Router()

router.post(
  '/register',
  async (req, res) => {
    try {
      const { name, password } = req.body || {}
      
      if (!name || !password) {
        return res
          .status(400)
          .json({ error: 'Please enter a valid username and password' })
      }

      const hash = await bcrypt.hash(password, 10)

      const userExists = await User.exists({ name })
      
      if (userExists) {
        res.status(500).json({ error: 'User already exists' })
      } else {
        const user = await User.create({ name, password: hash })
        res.status(201).json(user)
      }
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: `An error occured: ${e?.message}` })
    }
  }
)

router.post(
  '/login',
  async (req, res) => {

    try {
      const { name, password } = req.body || {}
      let matchPwd
      if (!name || !password) {
        return res
          .status(400)
          .json({ error: 'Please enter a valid username and password' })
      }
  
      const [userFound] = await User.find({
        name
      }, 'id name password')

      if (userFound) {
        matchPwd = await bcrypt.compare(password, userFound.password)
      }
  
      if (!userFound || !matchPwd) {
        return res.status(400).json({ error: 'Email ou Mot de passe invalide.' })
      }
  
      const token = generateToken({
        id: userFound.id,
        name: userFound.name,
      })
  
      return res.status(200).json({ token })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: `An error occured: ${e?.message}` })
    }
  },
)

export default router
