import React from 'react'
import { Route, Switch } from 'react-router-dom'
// import { createAsyncComponent } from 'react-async-component'

import TopBar from './TopBar'
import ErrorDisplay from './error/ErrorDisplay'
import Introduction from './Introduction'
import UserPassForm from './auth/UserPassForm'
import SubmitImage from './images/SubmitImage'
import ImageBoard from './images/ImageBoard'

const styles = {
  outermostDiv: {
  },
  appContent: {
    // maxWidth: 800,
    margin: '0 auto',
    paddingBottom: 30,
    color: '#303030',
  },
}

const AppContent = () => (
  <div style={styles.outermostDiv}>
    <Route component={TopBar} />
    <div style={styles.appContent}>
      <Switch>
        <Route path="/login" component={UserPassForm} />
        <Route path="/signup" component={UserPassForm} />
        <Route path="/" component={Introduction} />
      </Switch>
      <Route component={ErrorDisplay} />
      <Route component={SubmitImage} />
      <Switch>
        <Route path="/users/:userId" component={ImageBoard} />
        <Route component={ImageBoard} />
      </Switch>
    </div>
  </div>
)

export default AppContent
