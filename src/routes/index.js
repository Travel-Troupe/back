import { Router } from 'express'

const router = Router()

router.get('/', (_, res) => {
  res.status(200).json({ message: 'Welcome to the travel troupe api' })
})

export default router
