import { Router } from 'express'
import secured from '../../lib/middleware/secured.js'
import * as TeamController from '../controllers/TeamController.js'

const router = Router()

router.post(
  '/add',
  secured,
  TeamController.createTeam
)

router.post(
  '/join',
  secured,
  TeamController.joinTeam
)

router.get(
  '/me',
  secured,
  TeamController.getUsersTeam
)

export default router
