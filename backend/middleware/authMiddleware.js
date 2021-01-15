import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import expressAsyncHandler from 'express-async-handler'

export const protect = expressAsyncHandler(async (req, res, next) => {
  let token
  console.log(req)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
    // req.headers.authorization &&
    // req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      console.log('authenticating: ', token)
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized user!!!')
    }
  }

  if (!token) {
    console.log('token not found')
    res.status(401)
    throw new Error('Not Authorized User token')
  }
})
