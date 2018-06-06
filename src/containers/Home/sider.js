import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import {
  Drawer,
  Toolbar,
  List,
  Typography,
  Hidden,
  Divider,
  Grid,
  TextField,
  Button,
} from '@material-ui/core'
import {
  Add,
} from '@material-ui/icons'

import Title from 'components/Title'
import Dialog from './dialog'
import { App, Rooms } from 'stores'

const styles = theme => ({
  paper: {
    position: 'static',
  },
  paper_temp: {
    width: '80%',
    [theme.breakpoints.up('sm')]: {
      width: '70%',
    },
    [theme.breakpoints.up('md')]: {
      width: '60%',
    }
  },
  input: {
    '&:before, &:after': {
      border: 'none !important'
    },
  },
  list: {
    flex: 1,
    overflow: 'scroll',
  },
  selected: {
    background: 'rgba(0,0,0,0.2)'
  },

  placeholder: {
    flex: 1
  },
  center: {
    textAlign: 'center',
  },
})

class Comp extends React.Component {

  handleDrawerToggle = event => {
    const { dispatch, app } = this.props
    dispatch(App.update({
      sider_open: !app.sider_open
    }))
  }
  handleDialogToggle = event => {
    const { dispatch, app } = this.props
    dispatch(App.update({
      dialog_open: !app.dialog_open
    }))
  }

  handleSearchChange = event => {
    const { dispatch } = this.props
    dispatch(App.update({
      search: event.target.value
    }))
  }
  handleRoomChange = cid => event => {
    const { dispatch, history, match } = this.props
    const { rid } = match.params
    if(cid !== rid) {
      if(rid !== 'general') {
        dispatch(Rooms.leave(rid))
      }
      dispatch(Rooms.join(cid))
      history.push(cid)
    }
  }

  render() {
    const { classes, match, app, rooms, user } = this.props
    const { rid } = match.params

    console.log(rooms)

    const drawer = (
      <React.Fragment>
        <Toolbar>
          <Typography variant="title" align="center" className={classes.placeholder} noWrap>
            Speak Langs
          </Typography>
        </Toolbar>
        <Divider />
        <TextField fullWidth placeholder="Search" value={app.search} InputProps={{
          className: classes.input
        }} inputProps={{
          className: classes.center
        }} onChange={this.handleSearchChange} />
        <List className={classes.list}>
          {Object.keys(rooms).filter(key => (rooms[key].name || '').includes(app.search)).sort((a, b) => rooms[b].created - rooms[a].created).map((key, index) => (
            <Title
              id={key}
              key={index}
              room={rooms[key]}
              color="primary"
              className={rid === key ? classes.selected : ''}
              nameProps={{
                color: user.id === key ? "primary" : "default"
              }}
              onClick={this.handleRoomChange(key)}
              button
            />
          ))}
        </List>
        <Button variant="raised" color="primary" size="small" fullWidth onClick={this.handleDialogToggle}>
          Create/Update My Room<Add />
        </Button>
      </React.Fragment>
    )

    return (
      <React.Fragment>
        <Hidden smDown>
          <Grid item sm={5} md={4} lg={3}>
            <Drawer variant="permanent" open classes={{
              paper: classes.paper,
            }}>
              {drawer}
            </Drawer>
          </Grid>
        </Hidden>
        <Hidden mdUp>
          <Drawer variant="temporary" open={app.sider_open} onClose={this.handleDrawerToggle} classes={{
            paper: classes.paper_temp,
          }} ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}>
            {drawer}
          </Drawer>
        </Hidden>
        <Dialog />
      </React.Fragment>
    )
  }
  componentDidUpdate() {
    const { match } = this.props
    const { rid } = match.params
    const item = document.getElementById(rid)
    if(item) {
      item.scrollIntoViewIfNeeded()
    }
  }
}

export default withStyles(styles)(connect(state => {
  const { app, rooms, user } = state
  return { app, rooms, user }
})(Comp))
