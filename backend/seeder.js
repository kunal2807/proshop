import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/db.js'
import Order from './models/orderModel.js'
import Product from './models/productModel.js'
import User from './models/userModel.js'
import products from './data/products.js'
import users from './data/users.js'

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await Product.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers[0]._id

    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser,
    }))

    await Product.insertMany(sampleProducts)

    console.log('Data Import Succesfull'.green.inverse)
    process.exit()
  } catch (error) {
    console.log(`error: ${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    console.log('Data Destroyed'.red.inverse.underline)
    process.exit()
  } catch (error) {
    console.log(`error: ${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
