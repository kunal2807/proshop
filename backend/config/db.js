import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })

    console.log(`Mongo DB connected: ${connect.connection.host}`.cyan.underline)
  } catch (error) {
    console.error(`error: ${error.message}`.red.bold)
    process.exit(1)
  }
}

export default connectDB
