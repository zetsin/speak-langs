import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

import 'typeface-roboto'
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles'
import {
  CssBaseline,
  Snackbar,
} from '@material-ui/core'

import Home from 'containers/Home'

import { App, Rooms } from 'stores'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1FB922',
    },
    secondary: {
      main: '#F13838',
    },
    background: {
      default: '#f3f3f3'
    },
  },
})

const styles = {
  message: {
    margin: 'auto'
  }
}

class Comp extends React.Component {
  handleClose = event => {
    const { dispatch } = this.props
    dispatch(App.update({
      message: ''
    }))
  }

  render() {
    const { classes, app } = this.props

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} ContentProps={{classes}} open={!!app.message} onClose={this.handleClose} message={`${app.message}`} />
        <BrowserRouter>
          <Switch>
            <Route path="/:room" component={Home} exact />
            <Redirect to="/general" /> 
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    )
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(App.connect())
    dispatch(Rooms.join('general'))
  }
}

export default withStyles(styles)(connect(state => {
  const { app } =  state
  return { app }
})(Comp))
