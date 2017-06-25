import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { BrowserRouter as Router } from 'react-router-dom'

import AppContent from './AppContent'


const Root = () => (
  <Router>
    { /* <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}> */ }
    <MuiThemeProvider>
      <AppContent />
    </MuiThemeProvider>
  </Router>
)

export default Root
