import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router'

import { withStyles } from '@material-ui/core/styles'
import {
  Grid,
} from '@material-ui/core'

import Sider from './sider'
import Header from './header'
import Main from './main'
import Footer from './footer'

import { Rooms } from 'stores'

const styles = theme => console.log(theme) || ({
  root: {
    width: '100vw',
    height: '100vh',
  },

  item: {
    flex: 1,
    overflow: 'hidden'
  },
  container: {
    height: '100%'
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
        <Grid item className={classes.item}>
          <Grid container direction="column" className={classes.container}>
            <Grid item>
              <Route component={Header} />
            </Grid>
            <Grid item className={classes.main}>
              <Route component={Main} />
            </Grid>
            <Grid item>
              <Route component={Footer} />
            </Grid>
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
