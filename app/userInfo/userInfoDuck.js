import { call, put, takeEvery } from 'redux-saga/effects'

// Redux reducer
const userInfoReducer = (state = { byId: {}, allIds: [] }, action) => {
  switch (action.type) {
    case 'USERINFO_RECEIVED': {
      // Change to normalized state shape
      const byId = {}
      const allIds = []
      action.userInfo.forEach((user) => {
        byId[user.userId] = { ...user }
        allIds.push(user.userId)
      })
      return {
        byId,
        allIds,
      }
    }
    default:
      return state
  }
}

/* ****************************************************************************
 * Fetch-saga pairs
 */

/**
 * User Info Request
 * Get a list of all users
 */
const userInfoFetch = () => (
  fetch('/api/users', {
    method: 'GET',
  })
  .then((response) => {
    if (response.status === 200) {
      return response.json().then(json => json)
    }
    throw response
  })
)
function* userInfoRequest() {
  try {
    const userInfo = yield call(userInfoFetch)
    yield put({ type: 'USERINFO_RECEIVED', userInfo })
  } catch (e) {
    const { status, message } = e
    yield put({ type: 'USERINFO_REQUEST_ERROR', status, message })
  }
}

// Sagas initialization function
function* userInfoSagas() {
  yield takeEvery('USERINFO_REQUEST', userInfoRequest)
}

export { userInfoReducer, userInfoSagas }
