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

router.post(
  '/newStep',
  checkJwt,
  TravelController.addTravelStep
)

router.get(
  '/getSteps',
  checkJwt,
  TravelController.getTravelSteps
)

router.delete(
  '/deleteStep/:stepId',
  checkJwt,
  TravelController.deleteTravelSteps
)

export default router
