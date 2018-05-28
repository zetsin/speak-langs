import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import {
  Toolbar,
  Hidden,
  IconButton,
  Button,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Tooltip,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

import { App } from 'stores'

const styles = theme => ({
  header: {
    background: theme.palette.background.default,
  },
  placeholder: {
    flex: 1
  },
  pointer: {
    cursor: 'pointer'
  },
})

class Comp extends React.Component {
  state = {
    anchorEl: null
  }

  handleAsiderOpen = event => {
    const { dispatch, app } = this.props
    dispatch(App.update({
      asider_open: !app.asider_open
    }))
  }

  handleSiderToggle = event => {
    const { dispatch } = this.props
    dispatch(App.update({
      sider_open: true
    }))
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose = event => {
    this.setState({ anchorEl: null });
  }

  render() {
    const { classes, match, rooms, groups, user } = this.props
    const { anchorEl } = this.state
    const rid = match.params.room
    const room = rooms[rid] || {}
    const group = groups[rid] || {}

    return (
      <header className={classes.header}>
        <Toolbar>
          <Hidden mdUp>
            <IconButton color="inherit" onClick={this.handleSiderToggle}>
              <MenuIcon />
            </IconButton>
          </Hidden>
          <ListItem disableGutters ContainerComponent="div" ContainerProps={{
            className: classes.placeholder
          }}>
            <ListItemAvatar>
              <Avatar component={Button} variant="fab">G</Avatar>
            </ListItemAvatar>
            <ListItemText disableTypography className={classes.pointer} onClick={this.handleAsiderOpen} primary={
              <Tooltip title={room.name}>
                <Typography variant="title" noWrap>{room.name ? `${room.name} (${Object.keys(group).length})` : ''}</Typography>
              </Tooltip>
            } secondary={
              <Tooltip title={room.topic}>
                <Typography variant="caption" noWrap>{room.topic}</Typography>
              </Tooltip>
            } />
          </ListItem>
          {user.id ? (
            <Avatar
              component={Button}
              variant="fab"
              src={user.photos && user.photos[0] && user.photos[0].value}
              onClick={this.handleMenu}
            />
          ) : (
            <Button color={user.id ? "primary" : "secondary"} onClick={this.handleMenu}>Login</Button>
          )}
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            getContentAnchorEl={null}
            open={!!anchorEl}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.handleClose} component="a" href={`${process.env.REACT_APP_SERVER}/auth/google`}>Google</MenuItem>
            <MenuItem onClick={this.handleClose} component="a" href={`${process.env.REACT_APP_SERVER}/auth/logout`}>Logout</MenuItem>
          </Menu>
        </Toolbar>
        <Divider />
      </header>
    )
  }
}

export default withStyles(styles)(connect(state => {
  const { app, rooms, user, groups } = state
  return { app, rooms, user, groups }
})(Comp))
