import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router'

import { withStyles } from '@material-ui/core/styles'
import {
  Grid,
} from '@material-ui/core'

import Sider from './sider'
import Header from './header'
import Mainer from './mainer'
import Footer from './footer'
import Asider from './asider'

import { Rooms } from 'stores'

const styles = theme => console.log(theme) || ({
  root: {
    width: '100vw',
    height: '100vh',
  },

  container: {
    height: '100%',
    flex: 1,
  },

  main: {
    flex: 1,
    overflow: 'scroll'
  },
})

class Comp extends React.Component {

  render() {
    const { classes } = this.props

    return (
      <Grid container className={classes.root}>
        <Route component={Sider} />
        <Grid item container direction="column" className={classes.container}>
          <Grid item>
            <Route component={Header} />
          </Grid>
          <Grid item container className={classes.container}>
            <Grid item container direction="column" className={classes.container}>
              <Grid item className={classes.main}>
                <Route component={Mainer} />
              </Grid>
              <Grid item>
                <Route component={Footer} />
              </Grid>
            </Grid>
            <Route component={Asider} />
          </Grid>
        </Grid>
      </Grid>
    )
  }

  componentDidMount() {
    const { dispatch, match } = this.props
    dispatch(Rooms.join(match.params.room))
  }
}

export default withStyles(styles)(connect(state => {
  return {}
})(Comp))
