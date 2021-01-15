import axios from 'axios'
import { types } from '../types'

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`)

  dispatch({
    type: types.CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    },
  })

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingAddress = (formData) => async (dispatch) => {
  dispatch({
    type: types.CART_SAVE_SHIPPING_ADDRESS,
    payload: formData,
  })

  localStorage.setItem('shippingAddress', JSON.stringify(formData))
}

export const savePaymentMethod = (formData) => async (dispatch) => {
  dispatch({
    type: types.CART_SAVE_PAYMENT_METHOD,
    payload: formData,
  })

  localStorage.setItem('paymentMethod', JSON.stringify(formData))
}

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: types.CART_REMOVE_ITEM,
    payload: id,
  })

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}
