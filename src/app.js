import express from 'express'
import cors from 'cors'
import IndexRoutes from './routes/index.js'
import connectDb from './utils/connection.js'

const app = express()
connectDb()

app.use(express.urlencoded({extended: true})) 
app.use(express.json())
app.use(cors())
// Middlewares

// Routes
app.use('/', IndexRoutes)

export default app
