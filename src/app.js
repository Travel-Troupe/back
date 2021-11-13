import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import session from 'express-session'

import IndexRoutes from './routes/index.js'
import AuthRoutes from './routes/auth.js'
import UserRoutes from './routes/user.js'
import connectDb from './utils/connection.js'
import passport, { sess }  from './config/passport.js'

const app = express()
dotenv.config()

connectDb()

app.use(passport.initialize())
app.use(passport.session())

app.use(cookieParser())
app.use(session(sess))

app.use(express.urlencoded({extended: true})) 
app.use(express.json())
app.use(cors())
// Middlewares

// Routes
app.use('/', IndexRoutes)
app.use('/', AuthRoutes)
app.use('/', UserRoutes)
export default app
