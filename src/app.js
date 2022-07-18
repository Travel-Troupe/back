import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import IndexRoutes from './routes/index.js'
import AuthRoutes from './routes/auth.js'
import TeamRoutes from './routes/team.js'
import TravelRoutes from './routes/travel.js'
import SearchRoutes from './routes/search.js'
import connectDb from './utils/connection.js'

const app = express()
dotenv.config()

connectDb()

// Middlewares
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

// Routes
app.use('/', IndexRoutes)
app.use('/', AuthRoutes)
app.use('/team', TeamRoutes)
app.use('/travel', TravelRoutes)
app.use('/search', SearchRoutes)

export default app
