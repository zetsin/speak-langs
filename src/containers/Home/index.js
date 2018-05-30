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

const styles = theme => console.log(theme) || ({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom:0,
    overflow: 'hidden'
  },
  container: {
    flex: 1,
    overflow: 'hidden'
  },
})

class Comp extends React.Component {

  render() {
    const { classes } = this.props

    return (
      <Grid container wrap="nowrap" className={classes.root}>
        <Route component={Sider} />
        <Grid container direction="column" className={classes.container}>
          <Route component={Header} />
          <Grid container className={classes.container}>
            <Grid container direction="column" className={classes.container}>
              <Grid container className={classes.container}>
                <Route component={Mainer} />
              </Grid>
              <Route component={Footer} />
            </Grid>
            <Route component={Asider} />
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(connect(state => {
  return {}
})(Comp))
