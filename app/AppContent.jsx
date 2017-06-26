import React from 'react'
import { Route, Switch } from 'react-router-dom'
// import { createAsyncComponent } from 'react-async-component'

import TopBar from './TopBar'
import ErrorDisplay from './error/ErrorDisplay'
import Introduction from './Introduction'
import UserPassForm from './auth/UserPassForm'

const styles = {
  appContent: {
    maxWidth: 800,
    margin: '0 auto',
    paddingBottom: 30,
  },
}

const AppContent = () => (
  <div>
    <Route component={TopBar} />
    <div style={styles.appContent}>
      <Switch>
        <Route path="/login" component={UserPassForm} />
        <Route path="/signup" component={UserPassForm} />
        <Route path="/" component={Introduction} />
      </Switch>
      <Route component={ErrorDisplay} />
    </div>
  </div>
)

export default AppContent
