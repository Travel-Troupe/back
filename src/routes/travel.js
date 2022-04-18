import { Router } from 'express'
import * as TravelController from '../controllers/TravelController.js'
import checkJwt from '../utils/checkJwt.js'

const router = Router()

router.get(
  '/all',
  checkJwt,
  TravelController.getUsersTravel
)

router.post(
  '/add',
  checkJwt,
  TravelController.createTravel
)

export default router
