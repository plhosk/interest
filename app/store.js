import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { initialState, rootReducer, rootSaga } from './rootReducer'

const sagaMiddleware = createSagaMiddleware()
let storeEnhancers = applyMiddleware(sagaMiddleware)

// add the redux dev tools
if (process.env.NODE_ENV !== 'production' && window.devToolsExtension) {
  storeEnhancers = compose(storeEnhancers, window.devToolsExtension())
}

const store = createStore(rootReducer, initialState, storeEnhancers)

let sagaTask = sagaMiddleware.run(rootSaga)

// Hot Module Replacement API
// needed for hot-reloading sagas and redux store
if (module.hot) {
  module.hot.accept('./rootReducer', () => {
    store.replaceReducer(rootReducer)
    sagaTask.cancel()
    sagaTask = sagaMiddleware.run(rootSaga)
  })
}
// if (module.hot) {
//   module.hot.accept('./reducer', () => {
//     store.replaceReducer(rootReducer)
//   })
//   module.hot.accept('./saga', () => {
//     sagaTask.cancel()
//     sagaTask = sagaMiddleware.run(rootSaga)
//   })
// }

export default store
