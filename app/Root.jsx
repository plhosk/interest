import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
// import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { BrowserRouter as Router } from 'react-router-dom'

import AppContent from './AppContent'

// Customize material-ui theme here
// const muiTheme = getMuiTheme({
//   ...darkBaseTheme, // Start with dark theme and customize from here
// })

const Root = () => (
  <Router>
    { /* <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}> */ }
    <MuiThemeProvider>
      <AppContent />
    </MuiThemeProvider>
  </Router>
)

export default Root
