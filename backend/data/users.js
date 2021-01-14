import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'admin user',
    email: 'admin@xyz.com',
    password: bcrypt.hashSync('admin', 10),
    isAdmin: true,
  },
  {
    name: 'john doe',
    email: 'john@xyz.com',
    password: bcrypt.hashSync('john', 10),
  },
  {
    name: 'jane doe',
    email: 'jane@xyz.com',
    password: bcrypt.hashSync('jane', 10),
    isAdmin: true,
  },
]

export default users
