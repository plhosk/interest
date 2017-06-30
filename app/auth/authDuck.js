import { call, put, takeLatest, takeEvery } from 'redux-saga/effects'

// Redux reducer
const authReducer = (state = {}, action) => {
  switch (action.type) {
    case 'AUTH_USER_OBJECT_RECEIVED':
      return { user: action.user }
    case 'AUTH_USER_OBJECT_CLEAR':
      return {}
    default:
      return state
  }
}

/* ****************************************************************************
 * Fetch-saga pairs
 */

/**
 * Auth User Object Request
 * Receive user info of currently authenticated user
 */
const authUserObjectFetch = () => (
  fetch('/api/login', {
    credentials: 'same-origin',
    method: 'GET',
  })
  .then((response) => {
    if (response.status === 200) {
      return response.json().then(json => json)
    }
    if (response.status === 204) {
      return 'empty'
    }
    // Error
    throw response
  })
)
function* authUserObjectRequest() {
  try {
    const user = yield call(authUserObjectFetch)
    if (user === 'empty') {
      yield put({ type: 'AUTH_USER_OBJECT_EMPTY' })
    } else {
      yield put({ type: 'AUTH_USER_OBJECT_RECEIVED', user })
    }
  } catch (e) {
    const { status, message } = e
    yield put({ type: 'AUTH_USER_OBJECT_REQUEST_FAILED', status, message })
  }
}

/**
 * Auth Logout Request
 */
const authLogoutFetch = () => (
  fetch('/api/logout', {
    credentials: 'same-origin',
    method: 'DELETE',
  })
  .then((response) => {
    if (response.status === 200) {
      return
    }
    throw response
  })
)
function* authLogoutRequest() {
  try {
    yield call(authLogoutFetch)
    yield put({ type: 'AUTH_USER_OBJECT_CLEAR' })
  } catch (e) {
    const { status, message } = e
    yield put({ type: 'AUTH_LOGOUT_FAILED', status, message })
    yield put({ type: 'ERROR_MESSAGE_SHOW', message: 'Logout failed.' })
  }
}

/**
 * Auth Login Request
 * Sends username and password. If success, response is user object
 */
const authLoginFetch = (username, password) => (
  fetch('/api/login', {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
  .then((response) => {
    if (response.status === 200) {
      return response.json().then(json => json)
    }
    throw response
  })
)
function* authLoginRequest(action) {
  try {
    const user = yield call(authLoginFetch, action.username, action.password)
    yield put({ type: 'AUTH_USER_OBJECT_RECEIVED', user })
  } catch (e) {
    const { status, message } = e
    yield put({ type: 'AUTH_LOGIN_FAILED', status, message })
    yield put({ type: 'ERROR_MESSAGE_SHOW', message: 'Login failed. Username or password may be incorrect.' })
  }
}

/**
 * Auth Signup Request
 * fetch sends username and password. Result is status 200
 */
const authSignupFetch = (username, password) => (
  fetch('/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
  .then((response) => {
    if (response.status === 200) {
      return
    }
    throw response
  })
)
function* authSignupRequest(action) {
  try {
    yield call(authSignupFetch, action.username, action.password)
    yield put({ type: 'USERINFO_REQUEST' }) // update userInfo upon signup
    yield put({
      type: 'AUTH_LOGIN_REQUEST',
      username: action.username,
      password: action.password,
    })
  } catch (e) {
    const { status, message } = e
    yield put({ type: 'AUTH_SIGNUP_FAILED', status, message })
    yield put({ type: 'ERROR_MESSAGE_SHOW', message: 'Signup failed. Username or password may be taken.' })
  }
}

/**
 * User Profile Update Request
 * Send user profile info. Receive updated user object
 */
const userProfileUpdateFetch = (userId, displayName) => ( // city, country,
  fetch(`/api/users/${userId}`, {
    credentials: 'same-origin',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      displayName,
      // city,
      // country,
    }),
  })
  .then((response) => {
    if (response.status === 200) {
      return response.json().then(json => json)
    }
    throw response
  })
)
function* userProfileUpdateRequest(action) {
  try {
    const user = yield call(
      userProfileUpdateFetch,
      action.userId,
      action.displayName,
      // action.city,
      // action.country,
    )
    yield put({ type: 'AUTH_USER_OBJECT_RECEIVED', user })
    // Get updated userInfo as well
    yield put({ type: 'USERINFO_REQUEST' })
  } catch (e) {
    const { status, message } = e
    yield put({ type: 'USER_PROFILE_UPDATE_ERROR', status, message })
    yield put({ type: 'ERROR_MESSAGE_SHOW', message: 'Error updating user profile.' })
  }
}

/* ****************************************************************************
 * Saga initialize function
 */
function* authSagas() {
  yield takeEvery('AUTH_USER_OBJECT_REQUEST', authUserObjectRequest)
  yield takeEvery('AUTH_LOGOUT_REQUEST', authLogoutRequest)
  yield takeLatest('AUTH_LOGIN_REQUEST', authLoginRequest)
  yield takeLatest('AUTH_SIGNUP_REQUEST', authSignupRequest)
  yield takeLatest('USER_PROFILE_UPDATE_REQUEST', userProfileUpdateRequest)
}

export { authReducer, authSagas }
