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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core'
import {
  Face,
  Add,
} from '@material-ui/icons'

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

  handleRoomCreate = event => {
    const { dispatch, app } = this.props
    dispatch(Rooms.create())
    dispatch(App.update({
      dialog_open: !app.dialog_open
    }))
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
    const { classes, match, app, groups, rooms } = this.props
    const rid = match.params.room

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
          {Object.keys(rooms).filter(key => (rooms[key].name || '').includes(app.search)).sort((a, b) => rooms[a].datetime - rooms[b].datetime).map((key, index) => (
            <ListItem
              key={index}
              button
              color="primary"
              className={rid === key ? classes.selected : ''}
              onClick={this.handleRoomChange(key)}
            >
              <ListItemAvatar>
                <Avatar component={Button} variant="fab">G</Avatar>
              </ListItemAvatar>
              <ListItemText disableTypography primary={
                <Tooltip title={rooms[key].name || ''}>
                  <Typography variant="title" noWrap>{rooms[key].name || ''}</Typography>
                </Tooltip>
              } secondary={
                <Tooltip title={rooms[key].topic || ''}>
                  <Typography variant="caption" noWrap>{rooms[key].topic}</Typography>
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
        <Button variant="raised" color="primary" size="small" fullWidth onClick={this.handleDialogToggle}>
          Create room<Add />
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
        <Dialog open={app.dialog_open}>
          <DialogTitle>Create Room</DialogTitle>
          <DialogContent>
            <form>
              <Grid container spacing={8}>
                <Grid item xs={12}>
                  <TextField label="Topic" margin="normal" required fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel>Platfrom</InputLabel>
                    <Select value={""} onChange={this.handleChange}>
                      <MenuItem value={""}>Any Language</MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel>Limited</InputLabel>
                    <Select value={""} onChange={this.handleChange}>
                      <MenuItem value={""}>Any Language</MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select value={""} onChange={this.handleChange}>
                      <MenuItem value={""}>Any Language</MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel>Level</InputLabel>
                    <Select value={""} onChange={this.handleChange}>
                      <MenuItem value={""}>Any Language</MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogToggle} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.handleRoomCreate} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(connect(state => {
  const { app, rooms, groups } = state
  return { app, rooms, groups }
})(Comp))
