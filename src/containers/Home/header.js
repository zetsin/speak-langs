import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import {
  withWidth,
  Toolbar,
  Hidden,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@material-ui/core'
import {
  Person,
  WbIncandescent,
  Menu as MenuIcon,
  ExitToApp,
  Room,
} from '@material-ui/icons'

import Title from 'components/Title'
import { App } from 'stores'
import config from 'config'

const styles = theme => ({
  header: {
    background: theme.palette.background.default,
  },
  title: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  placeholder: {
    flex: 1
  },
  scroll: {
    overflow: 'scroll'
  },
  avatar: {
    width: 24,
    height: 24,
  },
})

class Comp extends React.Component {
  state = {
    anchorEl: null
  }

  handleSiderToggle = event => {
    const { dispatch, app } = this.props
    dispatch(App.update({
      sider_open: !app.sider_open
    }))
  }

  handleAsiderToggle = event => {
    const { dispatch, app } = this.props
    dispatch(App.update({
      asider_open: !app.asider_open
    }))
  }

  handleTypeToggle = event => {
    const { dispatch, app } = this.props
    dispatch(App.update({
      type: app.type === 'light' ? 'dark' : 'light'
    }))
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose = event => {
    this.setState({ anchorEl: null });
  }

  handlePlatformClick = event => {
    const { match, rooms } = this.props
    const { rid } = match.params
    const room = rooms[rid] || {}
    if(room.link) {
      window.open(room.link)
    }
  }

  render() {
    const { width, classes, match, rooms, user } = this.props
    const { anchorEl } = this.state
    const { rid } = match.params
    const room = rooms[rid] || {}

    const estate = Object.keys(rooms).find(rid => rooms[rid].creator === user.id)

    return (
      <header className={classes.header}>
        <Toolbar disableGutters={['xs', 'sm'].includes(width)}>
          <Hidden mdUp>
            <IconButton color="inherit" onClick={this.handleSiderToggle}>
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Title
            room={room}
            onPlatformClick={this.handlePlatformClick}
            onMembersClick={this.handleAsiderToggle}
            className={classes.title}
          />
          <div className={classes.placeholder} />
          {user.id ? (
            user.image ? (
              <Avatar component={Button} variant="fab" src={user.image} alt={user.displayName} onClick={this.handleMenu} />
            ) : (
              <Avatar component={Button} variant="fab" onClick={this.handleMenu}>{user.displayName ? user.displayName.slice(0, 1) : 'Me'}</Avatar>
            )
          ) : (
            <IconButton color="secondary" onClick={this.handleMenu}>
              <Person />
            </IconButton>
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
            {!user.id && (
              <React.Fragment>
                <MenuItem onClick={this.handleClose} component="a" href={`${config.server}/auth/google`}>
                  <ListItemIcon>
                    <Avatar src={config.icons.google} className={classes.avatar} />
                  </ListItemIcon>
                  <ListItemText primary="Login with Google" />
                </MenuItem>
                <MenuItem onClick={this.handleClose} component="a" href={`${config.server}/auth/baidu`}>
                  <ListItemIcon>
                    <Avatar src={config.icons.baidu} className={classes.avatar} />
                  </ListItemIcon>
                  <ListItemText primary="Login with Baidu" />
                </MenuItem>
                <MenuItem onClick={this.handleClose} component="a" href={`${config.server}/auth/weibo`}>
                  <ListItemIcon>
                    <Avatar src={config.icons.weibo} className={classes.avatar} />
                  </ListItemIcon>
                  <ListItemText primary="Login with Weibo" />
                </MenuItem>
              </React.Fragment>
            )}
            {!user.id && <Divider />}
            {user.id && estate && (
              <MenuItem onClick={this.handleClose} component="a" href={`/${estate}`}>
                <ListItemIcon>
                  <Room />
                </ListItemIcon>
                <ListItemText disableTypography primary={
                  <Typography variant="subheading" color="primary">My Room</Typography>
                } />
              </MenuItem>
            )}
            <MenuItem onClick={this.handleTypeToggle}>
              <ListItemIcon>
                <WbIncandescent />
              </ListItemIcon>
              <ListItemText primary="Lilght/Dark Theme" />
            </MenuItem>
            {user.id && <Divider />}
            {user.id && (
              <MenuItem onClick={this.handleClose} component="a" href={`${config.server}/auth/logout`}>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText disableTypography primary={
                  <Typography variant="subheading" color="secondary">Logout</Typography>
                } />
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
        <Divider />
      </header>
    )
  }
}

export default  withWidth()(withStyles(styles)(connect(state => {
  const { app, rooms, user } = state
  return { app, rooms, user }
})(Comp)))
