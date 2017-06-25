import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import injectTapEventPlugin from 'react-tap-event-plugin'
// import { withAsyncComponents } from 'react-async-component'

import store from './store'
import Root from './Root'

injectTapEventPlugin()

delete AppContainer.prototype.unstable_handleError

const rootElement = document.getElementById('app')

function renderApp(Param) {
  const app = (
    <AppContainer>
      <Provider store={store}>
        <Param />
      </Provider>
    </AppContainer>
  )

  // withAsyncComponents(app)
  // .then(({ appWithAsyncComponents }) => {
  ReactDOM.render(
    // appWithAsyncComponents,
    app,
    rootElement,
  )
  // })
}

renderApp(Root)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept(
    './Root',
    () => renderApp(Root),
  )
}
