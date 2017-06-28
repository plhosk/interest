import { combineReducers } from 'redux'
import { take, select, all } from 'redux-saga/effects'

import { errorReducer } from './error/errorDuck'
import { authReducer, authSagas } from './auth/authDuck'
import { userInfoReducer, userInfoSagas } from './userInfo/userInfoDuck'
import { imagesReducer, imagesSagas } from './images/imagesDuck'

// Define redux store
const initialState = {
  error: '',
  auth: {},
  userInfo: {
    byId: {},
    allIds: [],
  },
  images: {
    byId: {},
    allIds: [],
  },
}

const rootReducer = combineReducers({
  auth: authReducer,
  userInfo: userInfoReducer,
  error: errorReducer,
  images: imagesReducer,
})

/**
 * Initialize sagas
 */

// Log every redux action
function* logActions() {
  if (process.env.NODE_ENV === 'production') {
    return
  }
  while (true) { // eslint-disable-line no-constant-condition
    const action = yield take()
    const state = yield select()
    console.log(action.type, 'action:', action, 'state:', state) // eslint-disable-line no-console
  }
}

function* rootSaga() {
  yield all([
    // crossDependentSagas(),
    logActions(),
    authSagas(),
    userInfoSagas(),
    imagesSagas(),
  ])
}

export { initialState, rootReducer, rootSaga }
