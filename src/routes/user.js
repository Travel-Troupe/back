import secured from '../lib/middleware/secured'
import { Router } from 'express'

const router = Router()*
router.get('/user', secured(), function () {
  // @TODO
})
