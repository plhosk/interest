import { call, put, takeEvery } from 'redux-saga/effects'

// Redux reducer
const imagesReducer = (state = { byId: {}, allIds: [] }, action) => {
  switch (action.type) {
    case 'IMAGES_LIST_RECEIVED': {
      // Change to normalized state shape
      // Action structure: action.images is an array of image objects
      const byId = {}
      const allIds = []
      action.images.forEach((image) => {
        byId[image.imageId] = { ...image }
        allIds.push(image.imageId)
      })
      return {
        byId,
        allIds,
      }
    }
    case 'IMAGES_SINGLE_RECEIVED': {
      // Update state with received entry
      // Action structure: action.image is a single image object
      return {
        byId: { ...state.allIds, ...action.image },
        allIds: [...state.allIds],
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
 * Images List Request
 * Get a list of all non-deleted images by all users
 */
const imagesListFetch = () => (
  fetch('/api/images', {
    method: 'GET',
  })
  .then((response) => {
    if (response.status === 200) {
      return response.json().then(json => json) // return the image object
    }
    throw response // response will be error object with message property
  })
  // catch block is in the Saga
)
function* imagesListRequest() {
  try {
    const images = yield call(imagesListFetch)
    yield put({ type: 'IMAGES_LIST_RECEIVED', images })
  } catch (e) {
    const { status, message } = e
    yield put({ type: 'IMAGES_LIST_REQUEST_FAILED', status, message })
  }
}

/**
 * Images Add Request
 * Add a new image
 */
const imagesAddFetch = (url, caption) => (
  fetch('/api/images', {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      caption,
    }),
  })
  .then((response) => {
    if (response.status === 200) {
      return response.json().then(json => json)
    }
    throw response
  })
)
function* imagesAddRequest(action) {
  try {
    const image = yield call(imagesAddFetch, action.url, action.caption)
    yield put({ type: 'IMAGES_SINGLE_RECEIVED', image })
  } catch (e) {
    const { status, message } = e
    yield put({ type: 'IMAGES_ADD_REQUEST_FAILED', status, message })
    yield put({ type: 'ERROR_MESSAGE_SHOW', message: 'There was an error adding your image.' })
  }
}

/**
 * Images Delete Request
 * Delete a single image
 */
const imagesDeleteFetch = imageId => (
  fetch(`/api/images/${imageId}`, {
    credentials: 'same-origin',
    method: 'DELETE',
  })
  .then((response) => {
    if (response.status === 200) {
      return response.json().then(json => json)
    }
    // Throw error
    throw response
  })
)
function* imagesDeleteRequest(action) {
  try {
    const image = yield call(imagesDeleteFetch, action.imageId)
    yield put({ type: 'IMAGES_SINGLE_RECEIVED', image })
  } catch (e) {
    const { status, message } = e
    yield put({ type: 'IMAGES_DELETE_REQUEST_FAILED', status, message })
  }
}

// Sagas initialization function
function* imagesSagas() {
  yield takeEvery('IMAGES_LIST_REQUEST', imagesListRequest)
  yield takeEvery('IMAGES_ADD_REQUEST', imagesAddRequest)
  yield takeEvery('IMAGES_DELETE_REQUEST', imagesDeleteRequest)
}

export { imagesReducer, imagesSagas }
