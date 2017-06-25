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

/**
 * Fetch-saga pairs
 */

const userInfoFetch = () => (
  fetch('/api/users', {
    method: 'GET',
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

function* userInfoRequest() {
  const { response, error } = yield call(userInfoFetch)
  if (response) {
    yield put({ type: 'USERINFO_RECEIVED', userInfo: response })
  } else {
    yield put({ type: 'USERINFO_REQUEST_ERROR', error })
  }
}

// Sagas initialization function
function* userInfoSagas() {
  yield takeEvery('USERINFO_REQUEST', userInfoRequest)
}

export { userInfoReducer, userInfoSagas }
