import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import bodyParser from 'body-parser'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

const app = express()
dotenv.config()
connectDB()

// app.get('/', (req, res) => res.send('running'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('server is up')
})

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
const ENV = process.env.NODE_ENV || 'local'
app.listen(PORT, console.log(`running in ${ENV} on port ${PORT}`))
