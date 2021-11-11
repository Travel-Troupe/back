import secured from '../lib/middleware/secured'
import { Router } from 'express'

const router = Router()*
router.get('/user', secured(), function (_, res) {
  res.status(200).json({ message: 'Logged' })
})
