import { Router } from 'express'
import * as SearchController from '../controllers/SearchController.js'
import checkJwt from '../utils/checkJwt.js'

const router = Router()

router.post('/', checkJwt,  SearchController.getPlace)

export default router
