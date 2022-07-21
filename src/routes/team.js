import { Router } from 'express'
import * as TeamController from '../controllers/TeamController.js'
import * as VoteController from '../controllers/VoteController.js'
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

router.post(
  '/propose',
  checkJwt,
  VoteController.addDateProposition
)

router.get(
  '/dates',
  checkJwt,
  VoteController.getProposedDates
)

router.post(
  '/vote',
  checkJwt,
  VoteController.addVote
)

router.post(
  '/dates/valid',
  checkJwt,
  VoteController.validateDate
)

export default router
