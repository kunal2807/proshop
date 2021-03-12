import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { payPalButton } from 'react-paypal-button-v2'
import { Row, Col, ListGroup, Card, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getOrderDetails, payOrder } from '../redux/actions/orderActions'
import { Link } from 'react-router-dom'

const OrderScreen = ({ match }) => {
  const orderId = match.params.id

  const dispatch = useDispatch()
  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails
  const orderPay = useSelector((state) => state.orderPay)
  const { success: successPay, loading: loadingPay } = orderPay

  const make2Decimals = (num) => Number(Math.round(num * 100) / 100).toFixed(2)

  if (!loading) {
    order.itemsPrice = make2Decimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )

    order.shippingPrice = make2Decimals(order.shippingPrice)
    order.taxPrice = make2Decimals(order.taxPrice)
    order.totalPrice = make2Decimals(order.totalPrice)
  }

  const [sdkReady, setSdkReady] = useState(false)

  useEffect(() => {
    const addPaypalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => setSdkReady(true)
      document.body.appendChild(script)
      console.log(clientId)
    }

    // console.log(addPaypalScript())
    addPaypalScript()

    if (!order || successPay) dispatch(getOrderDetails(orderId))
    else if (!order.isPaid)
      if (!window.paypal) addPaypalScript()
      else setSdkReady(true)
  }, [dispatch, orderId, order, successPay])

  const successPaymentHandler = (paymentResult) =>
    dispatch(payOrder(paymentResult))

  const renderOrderItems = () => (
    <ListGroup variant='flush'>
      {order.orderItems.map((item, idx) => (
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

  const renderScreen = () => (
    <>
      <h1>order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                , {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}{' '}
                </Message>
              ) : (
                <Message>Order is not delivered yet</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>payment method</h2>
              <p>
                <strong>Method: </strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt} </Message>
              ) : (
                <Message>Order is not paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>You have no orders</Message>
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
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping Price</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax Price</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total Price</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <payPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )

  return loading ? (
    <Loader />
  ) : error ? (
    <Message>{error}</Message>
  ) : (
    renderScreen()
  )
}

export default OrderScreen
