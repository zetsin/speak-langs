import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  Typography,
  Hidden,
  Divider,
  Badge,
  Tooltip,
  Grid,
  TextField,
  Button,
} from '@material-ui/core'
import {
  Face,
  Add,
} from '@material-ui/icons'

import { Rooms } from 'stores'

const styles = theme => ({
  sider: {
    position: 'static',
    background: '#fdfdfd',
  },
  sider_temp: {
    background: '#fdfdfd',
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
    background: '#ccc'
  },

  placeholder: {
    flex: 1
  },
  center: {
    textAlign: 'center',
  },
})

class Comp extends React.Component {
  state = {
    mobileOpen: false,
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen })
  }

  handleRoomCreate = event => {
    const { dispatch } = this.props
    dispatch(Rooms.create())
  }
  handleRoomChange = id => event => {
    const { dispatch, history, match } = this.props
    const room = match.params.room
    if(id !== room) {
      if(room !== 'general' && room !== 'random') {
        dispatch(Rooms.leave(room))
      }
      dispatch(Rooms.join(id))
      history.push(id)
    }
  }

  render() {
    const { classes, match, rooms, groups } = this.props
    const { mobileOpen } = this.state
    const rid = match.params.room

    const drawer = (
      <React.Fragment>
        <Toolbar>
          <Typography variant="title" align="center" className={classes.placeholder} noWrap>
            Speak Langs
          </Typography>
        </Toolbar>
        <Divider />
        <TextField fullWidth placeholder="Search" InputProps={{
          className: classes.input
        }} inputProps={{
          className: classes.center
        }} />
        <List className={classes.list}>
          {Object.keys(rooms).sort((a, b) => rooms[a].datetime - rooms[b].datetime).map((key, index) => (
            <ListItem
              key={index}
              button
              color="primary"
              className={rid === key ? classes.selected : ''}
              onClick={this.handleRoomChange(key)}
            >
              <ListItemAvatar>
                <Avatar>G</Avatar>
              </ListItemAvatar>
              <ListItemText disableTypography primary={
                <Tooltip title={rooms[key].name || ''}>
                  <Typography variant="title" noWrap>{rooms[key].name}</Typography>
                </Tooltip>
              } secondary={
                <Tooltip title={rooms[key].name || ''}>
                  <Typography variant="caption" noWrap>{rooms[key].name}</Typography>
                </Tooltip>
              } />
              <ListItemSecondaryAction>
                <ListItemIcon>
                  <Badge badgeContent={Object.values(groups[key] || {}).filter(item => item !== null).length} color="secondary">
                    <Face />
                  </Badge>
                </ListItemIcon>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Button variant="raised" color="primary" size="small" fullWidth onClick={this.handleRoomCreate}>
          <Add />
        </Button>
      </React.Fragment>
    )

    return (
      <React.Fragment>
        <Hidden mdUp>
          <Grid item>
            <Drawer variant="temporary" open={mobileOpen} onClose={this.handleDrawerToggle} classes={{
              paper: classes.sider_temp,
            }} ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}>
              {drawer}
            </Drawer>
          </Grid>
        </Hidden>
        <Hidden smDown>
          <Grid item sm={5} md={4} lg={3}>
            <Drawer variant="permanent" open classes={{
              paper: classes.sider,
            }}>
              {drawer}
            </Drawer>
          </Grid>
        </Hidden>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(connect(state => {
  const { rooms, groups } = state
  return { rooms, groups }
})(Comp))
