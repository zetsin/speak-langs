import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
  Hidden,
  Divider,
  Badge,
  Tooltip,
  Grid,
  Paper,
  TextField,
  ListSubheader,
  Button,
  Menu,
  MenuItem
} from '@material-ui/core'
import {
  Face,
  Add,
  AccountCircle
} from '@material-ui/icons'
import MenuIcon from '@material-ui/icons/Menu'

import { Rooms, Messages, Texts } from 'stores'

const drawerWidth = 320

const styles = theme => console.log(theme) || ({
  header: {
    borderBottom: '1px solid #e2e2e2',
    [theme.breakpoints.up('md')]: {
      paddingLeft: drawerWidth
    },
  },
  sider: {
    width: '80%',
    [theme.breakpoints.up('sm')]: {
      width: '60%'
    },
    [theme.breakpoints.up('md')]: {
      width: drawerWidth
    },
    background: '#fdfdfd',
  },
  main: {
    [theme.breakpoints.up('md')]: {
      paddingLeft: drawerWidth
    },
  },
  footer: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    borderTop: '1px solid #e2e2e2',
    [theme.breakpoints.up('md')]: {
      paddingLeft: drawerWidth
    },
    background: theme.palette.background.default,
    zIndex: theme.zIndex.appBar,
  },
  list: {
    flex: 1,
    overflow: 'scroll',
  },
  selected: {
    background: '#ccc'
  },
  paper: {
    padding: 10,
  },
  paper_bg: {
    background: '#A2E563',
  },
  input: {
    '&:before, &:after': {
      border: 'none !important'
    },
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
    anchorEl: null
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen })
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose = event => {
    this.setState({ anchorEl: null });
  }

  handleRoomCreate = event => {
    const { dispatch } = this.props
    dispatch(Rooms.create())
  }
  handleRoomChange = id => event => {
    const { dispatch, history, match } = this.props
    const room = match.params.room
    if(room !== 'general' && room !== 'random') {
      console.log('out')
      dispatch(Rooms.leave(room))
    }
    dispatch(Rooms.join(id))
    history.push(id)
  }

  handleTextChange = event => {
    const { dispatch, match } = this.props
    dispatch(Texts.update({
      [match.params.room]: event.target.value
    }))
  }
  handleKeyPress = event => {
    const { dispatch, match } = this.props
    if(event.key === 'Enter') {
      dispatch(Messages.send(match.params.room, event.target.value))
      dispatch(Texts.update({
        [match.params.room]: ''
      }))
      event.preventDefault()
    }
  }

  render() {
    const { classes, match, user, users, rooms, texts, groups, messages } = this.props
    const { anchorEl } = this.state

    const timespan = 1000 * 60 * 10
    const rid = match.params.room
    const room = rooms[rid] || {}
    const conversation = Object.values(messages[rid] || {}).reduce((pre, cur) => {
      const time = parseInt(cur.datetime / timespan, 10)
      return {
        ...pre,
        [time]: [
          ...(pre[time] || []),
          cur,
        ]
      }
    }, {})
    const speak = texts[rid] || ''

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
          {Object.keys(rooms).map((key, index) => (
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
        <AppBar position="fixed" color="default" elevation={0} className={classes.header}>
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
            <Button onClick={this.handleMenu} color={user.id ? "default" : "secondary"}>
              {user.id ? user.displayName : "Login"}
              <AccountCircle />
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
              <MenuItem onClick={this.handleClose} component="a" href={`${process.env.REACT_APP_DEV_SERVER}/auth/google`}>Google</MenuItem>
              <MenuItem onClick={this.handleClose} component="a" href={`${process.env.REACT_APP_DEV_SERVER}/auth/logout`}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Hidden smDown>
          <Drawer variant="permanent" open classes={{
            paper: classes.sider,
          }}>
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden mdUp>
          <Drawer variant="temporary" open={this.state.mobileOpen} onClose={this.handleDrawerToggle} classes={{
            paper: classes.sider,
          }} ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}>
            {drawer}
          </Drawer>
        </Hidden>
        <main className={classes.main}>
          <Toolbar />
          <List>
            {Object.keys(conversation).map((key, index) => (
              <React.Fragment key={index}>
                <ListSubheader className={classes.center}>{new Date(key * timespan).toLocaleTimeString()}</ListSubheader>
                {conversation[key].map((item, index) => {
                  const speaker = users[item.uid] || {}
                  return (
                    <ListItem key={index}>
                      <Grid container spacing={8} direction={user.id === item.uid ? "row-reverse" : "row"}>
                        <Grid item>
                        {speaker.photos && speaker.photos[0] && speaker.photos[0].value ? (
                          <Avatar src={speaker.photos[0].value} />
                        ) : (
                          <Avatar>{speaker.displayName ? speaker.displayName.slice(0, 1) : '+_+'}</Avatar>
                        )}
                        </Grid>
                        <Grid item>
                          <Paper elevation={0} className={classNames(classes.paper, {
                            [classes.paper_bg]: user.id === item.uid
                          })}>
                            {user.id !== item.uid && <Typography variant="caption" noWrap>{speaker.displayName}</Typography>}
                            <Typography noWrap>{item.data}</Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </ListItem>
                  )
                })}
              </React.Fragment>
            ))}
          </List>
          <div style={{height: 135}} />
        </main>
        <footer className={classes.footer}>
          <Toolbar>
            <TextField margin="normal" rows="5" value={speak} autoFocus fullWidth multiline InputProps={{
              className: classes.input
            }} onChange={this.handleTextChange} onKeyPress={this.handleKeyPress} />
          </Toolbar>
        </footer>
      </React.Fragment>
    )
  }

  componentDidMount() {
    const { dispatch, match } = this.props
    dispatch(Rooms.join(match.params.room))
  }
}

export default withStyles(styles)(connect(state => state)(Comp))
