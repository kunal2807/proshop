import { types } from '../types'

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case types.USER_LOGIN_REQUEST:
      return { loading: true }
    case types.USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case types.USER_LOGIN_FAIL:
      return { loading: false, error: action.payload }
    case types.USER_LOGOUT:
      return { userInfo: null }
    default:
      return state
  }
}

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case types.USER_REGISTER_REQUEST:
      return { loading: true }
    case types.USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case types.USER_REGISTER_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case types.USER_DETAILS_REQUEST:
      return { ...state, loading: true }
    case types.USER_DETAILS_SUCCESS:
      return { loading: false, user: action.payload }
    case types.USER_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case types.USER_DETAILS_LOGOUT:
      return { loading: false, user: action.payload }
    default:
      return state
  }
}

export const userUpdateReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case types.USER_UPDATE_REQUEST:
      return { ...state, loading: true }
    case types.USER_UPDATE_SUCCESS:
      return { loading: false, success: true, userInfo: action.payload }
    case types.USER_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
