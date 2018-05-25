import React from 'react'
import { connect } from 'react-redux'

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
  More,
  Face,
  Add,
  AccountCircle
} from '@material-ui/icons'

const drawerWidth = 320

const styles = theme => ({
  root: {
    position: 'relative',
    minHeight: '100vh',
    [theme.breakpoints.up('md')]: {
      marginLeft: drawerWidth
    }
  },
  header: {
    borderBottom: '1px solid #e2e2e2',
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
    padding: theme.spacing.unit * 3,
  },
  footer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    borderTop: '1px solid #e2e2e2',
  },
  paper: {
    padding: 10,
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

  handleClose = () => {
    this.setState({ anchorEl: null });
  }

  render() {
    const { classes, user } = this.props
    const { anchorEl } = this.state

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
        <List className={classes.placeholder}>
          <ListItem button>
            <ListItemAvatar>
              <Avatar>G</Avatar>
            </ListItemAvatar>
            <ListItemText disableTypography primary={
              <Tooltip title="Add">
                <Typography variant="subheading" noWrap>Sent mail, Sent mail, Sent mail, Sent mail, Sent mail, Sent mail, Sent mail,</Typography>
              </Tooltip>
            } />
            <ListItemSecondaryAction>
              <ListItemIcon>
                <Badge badgeContent={666} color="primary">
                  <Face />
                </Badge>
              </ListItemIcon>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        <Button variant="raised" color="primary" size="small" fullWidth>
          <Add />
        </Button>
      </React.Fragment>
    )

    return (
      <div className={classes.root}>
        <AppBar position="absolute" color="default" elevation={0} className={classes.header}>
          <Toolbar>
            <Hidden mdUp>
              <IconButton color="inherit" onClick={this.handleDrawerToggle}>
                <More />
              </IconButton>
            </Hidden>
            <Typography variant="title" className={classes.placeholder} noWrap>
              Responsive drawer
            </Typography>
            <Button onClick={this.handleMenu} color={user.id ? "primary" : "secondary"}>
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
              <MenuItem onClick={this.handleClose} component="a" href="">Logout</MenuItem>
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
        <main>
          <Toolbar />
          <List>
            <ListSubheader className={classes.center}>xxx</ListSubheader>
            <ListItem>
              <Grid container spacing={8} direction="row-reverse">
                <Grid item>
                  <Avatar>R</Avatar>
                </Grid>
                <Grid item>
                  <Paper elevation={0} className={classes.paper}>
                    <Typography noWrap>xxx</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </ListItem>
          </List>
          <Toolbar />
        </main>
        <footer className={classes.footer}>
          <Toolbar>
            <TextField margin="normal" rows="5" autoFocus fullWidth multiline InputProps={{
              className: classes.input
            }} />
          </Toolbar>
        </footer>
      </div>
    )
  }
}

export default withStyles(styles)(connect(state => state)(Comp))
