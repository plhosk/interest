import { call, put, takeLatest, takeEvery } from 'redux-saga/effects'

// Redux reducer
const authReducer = (state = {}, action) => {
  switch (action.type) {
    case 'AUTH_USER_OBJECT_RECEIVED':
      return {
        user: action.user,
        // user: undefined,
      }
    case 'AUTH_USER_OBJECT_CLEAR':
      return {}
    default:
      return state
  }
}

/**
 * Fetch-saga pairs
 */

const authUserObjectFetch = () => (
  fetch('/api/login', {
    credentials: 'same-origin',
    method: 'GET',
  })
  .then((response) => {
    if (response.status === 200) {
      return response.json()
      .then(json => ({ response: json }))
    }
    if (response.status === 204) {
      return { response: 'empty' }
    }
    return { error: response }
  })
  .catch(error => ({ error }))
)
function* authUserObjectRequest() {
  const { response, error } = yield call(authUserObjectFetch)
  if (response === 'empty') {
    yield put({ type: 'AUTH_USER_OBJECT_EMPTY' })
  } else if (response) {
    yield put({ type: 'AUTH_USER_OBJECT_RECEIVED', user: response })
  } else {
    yield put({ type: 'AUTH_USER_OBJECT_ERROR', error })
    yield put({ type: 'ERROR_MESSAGE_SHOW', error: 'Error getting user object.' })
  }
}


const authLogoutFetch = () => (
  fetch('/api/logout', {
    credentials: 'same-origin',
    method: 'DELETE',
  })
  .then((response) => {
    if (response.status === 200) {
      return { success: true }
    }
    return { error: response }
  })
  .catch(error => ({ error }))
)
function* authLogoutRequest() {
  const { success, error } = yield call(authLogoutFetch)
  if (success) {
    yield put({ type: 'AUTH_USER_OBJECT_CLEAR' })
  } else {
    yield put({ type: 'AUTH_LOGOUT_FAILED', error })
    yield put({ type: 'ERROR_MESSAGE_SHOW', error: 'Logout failed.' })
  }
}


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
      return response.json()
      .then(json => ({ response: json }))
    }
    return { error: response }
  })
  .catch(error => ({ error }))
)
function* authLoginRequest(action) {
  const { response, error } = yield call(authLoginFetch, action.username, action.password)
  if (response) {
    yield put({ type: 'AUTH_USER_OBJECT_RECEIVED', user: response })
  } else {
    yield put({ type: 'AUTH_LOGIN_FAILED', error })
    yield put({ type: 'ERROR_MESSAGE_SHOW', error: 'Login failed. Username or password may be incorrect.' })
  }
}


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
      return { success: true }
    }
    return { error: response.message }
  })
  .catch(error => ({ error }))
)
function* authSignupRequest(action) {
  const { success, error } = yield call(authSignupFetch, action.username, action.password)
  if (success) {
    yield put({
      type: 'AUTH_LOGIN_REQUEST',
      username: action.username,
      password: action.password,
    })
  } else {
    yield put({ type: 'AUTH_SIGNUP_FAILED', error })
    yield put({ type: 'ERROR_MESSAGE_SHOW', error })
  }
}

const userProfileUpdateFetch = (userId, displayName, city, country) => (
  fetch(`/api/users/${userId}`, {
    credentials: 'same-origin',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      displayName,
      city,
      country,
    }),
  })
  .then((response) => {
    if (response.status === 200) {
      return response.json()
      .then(json => ({ response: json }))
    }
    return { error: response }
  })
  .catch(error => ({ error }))
)
function* userProfileUpdateRequest(action) {
  const { response, error } = yield call(
    userProfileUpdateFetch,
    action.userId,
    action.displayName,
    action.city,
    action.country,
  )
  if (response) {
    yield put({ type: 'AUTH_USER_OBJECT_RECEIVED', user: response })
    // Get updated userInfo as well
    yield put({ type: 'USERINFO_REQUEST' })
  } else {
    yield put({ type: 'USER_PROFILE_UPDATE_ERROR', error })
    yield put({ type: 'ERROR_MESSAGE_SHOW', error: 'Error updating user profile.' })
  }
}


/**
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
