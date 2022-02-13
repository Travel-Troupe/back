import { Router } from 'express'
import secured from '../../lib/middleware/secured.js'
import * as UserController from '../controllers/UserController.js'

const router = Router()

router.get(
  '/',
  secured,
  UserController.loggedIn
)

export default router
