import { Router } from 'express'

const router = Router()

router.get('/', (_, res) => {
  console.log('inside all')
  res.status(200).json({ message: 'Welcome to the travel troupe api' })
})

export default router
