import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Item, Card, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'
import { createOrder } from '../redux/actions/orderActions'
import { Link } from 'react-router-dom'

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const { cartItems, shippingAddress, paymentMethod } = cart
  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  const make2Decimals = (num) => Number(Math.round(num * 100) / 100).toFixed(2)

  cart.itemsPrice = make2Decimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )

  cart.shippingPrice = make2Decimals(25.0)

  cart.taxPrice = make2Decimals(Number((0.15 * cart.itemsPrice).toFixed(2)))

  cart.totalPrice = make2Decimals(
    Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)
  )

  useEffect(() => {
    if (success) history.push(`/order/${order._id}`)
  }, [history, success, order])

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.orderItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      })
    )
  }

  const renderOrderItems = () => (
    <ListGroup variant='flush'>
      {cartItems.map((item, idx) => (
        <ListGroup.Item key={idx}>
          <Row>
            <Col md={1}>
              <Image src={item.image} alt={item.name} fluid rounded />
            </Col>
            <Col>
              <Link to={`/products/${item.product}`}>{item.name}</Link>
            </Col>
            <Col md={4}>
              {item.qty} x ${item.price} = ${item.qty * item.price}
            </Col>
          </Row>
        </ListGroup.Item>
      ))}
    </ListGroup>
  )

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong> {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>payment method</h2>
              <strong>Method: </strong> {paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cartItems.length === 0 ? (
                <Message>Your Cart Is Empty</Message>
              ) : (
                renderOrderItems()
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items Price</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping Price</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax Price</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total Price</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {error && (
                <ListGroup.Item>
                  <Message variant='danger'>{error}</Message>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
