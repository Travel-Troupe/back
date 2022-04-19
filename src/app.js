import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import IndexRoutes from './routes/index.js'
import AuthRoutes from './routes/auth.js'
import TeamRoutes from './routes/team.js'
import TravelRoutes from './routes/travel.js'
import connectDb from './utils/connection.js'

const app = express()
dotenv.config()

connectDb()

app.use(cookieParser())

app.use(express.urlencoded({extended: true})) 
app.use(express.json())
app.use(cors())
// Middlewares

// Routes
app.use('/', IndexRoutes)
app.use('/', AuthRoutes)
app.use('/team', TeamRoutes)
app.use('/travel', TravelRoutes)

export default app
