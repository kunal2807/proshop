import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import bodyParser from 'body-parser'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const app = express()
dotenv.config()
connectDB()

// app.get('/', (req, res) => res.send('running'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('server is up')
})

app.use('/api/products', productRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
const ENV = process.env.NODE_ENV || 'local'
app.listen(PORT, console.log(`running in ${ENV} on port ${PORT}`))
