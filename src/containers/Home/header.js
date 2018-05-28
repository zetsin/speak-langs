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
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

const styles = theme => ({
  header: {
    borderBottom: '1px solid #e2e2e2',
    background: theme.palette.background.default,
  },
  placeholder: {
    flex: 1
  },
})

class Comp extends React.Component {
  state = {
    anchorEl: null
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose = event => {
    this.setState({ anchorEl: null });
  }

  render() {
    const { classes, match, rooms, user } = this.props
    const { anchorEl } = this.state
    const rid = match.params.room
    const room = rooms[rid] || {}

    return (
      <header className={classes.header}>
        <Toolbar>
          <Hidden mdUp>
            <IconButton color="inherit" onClick={this.handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Typography variant="title" noWrap>
            {room.name}
          </Typography>
          <Typography variant="caption" className={classes.placeholder} noWrap>
            {room.name}
          </Typography>
          <Button onClick={this.handleMenu} color={user.id ? "primary" : "secondary"}>
            {user.id ? user.displayName : "Login"}
          </Button>
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
      </header>
    )
  }
}

export default withStyles(styles)(connect(state => {
  const { rooms, user } = state
  return { rooms, user }
})(Comp))
