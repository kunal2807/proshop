import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUserProfile } from '../redux/actions/userActions'
import Message from '../components/Message'
import Loader from '../components/Loader'

const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()
  const userDetails = useSelector((state) => state.userDetails)
  const { loading, user, error } = userDetails
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      if (!user.name) {
        dispatch(getUserDetails('profile'))
      } else {
        setName(user.name)
        setEmail(user.email)
      }
    }
  }, [history, userInfo, user, dispatch, error])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) setMessage('Passwords do not match')
    else dispatch(updateUserProfile({ id: user._id, name, email, password }))
  }

  const renderUpdateForm = () => (
    <>
      <h2>User Profile</h2>
      {message && <Message>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {success && (
        <Message variant='success'>Profile Updated Succesfully</Message>
      )}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>User Profile</Form.Label>
          <Form.Control
            type='name'
            placeholder='enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='confirmPassword'>
          <Form.Label>confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button type='submit' variant='primary'>
          Update
        </Button>
      </Form>
    </>
  )

  return (
    <Row>
      <Col md={3}>{renderUpdateForm()}</Col>
      <Col md={9}>
        <h2>My orders</h2>
      </Col>
    </Row>
  )
}

export default ProfileScreen
