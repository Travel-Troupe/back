import { Router } from 'express'
import * as TeamController from '../controllers/TeamController.js'
import checkJwt from '../utils/checkJwt.js'

const router = Router()

router.post(
  '/add',
  checkJwt,
  TeamController.createTeam
)

router.post(
  '/join',
  checkJwt,
  TeamController.joinTeam
)

router.get(
  '/all',
  checkJwt,
  TeamController.getUsersTeam
)

export default router
