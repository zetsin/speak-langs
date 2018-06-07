import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Avatar,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core'

import { App, Rooms } from 'stores'
import config from 'config'

const styles = {
  smallAvatar: {
    width: 24,
    height: 24
  },

  placeholder: {
    flex: 1
  },
}

class Comp extends React.Component {
  state = {
    topic: 'Practice speaking language',
    platform: 0,
    maximum: 0,
    link: '',
    language: 42,
    level: 0,
  }

  handleEnter = event => {
    const { rooms, user } = this.props

    const room = Object.values(rooms).find(room => room.creator === user.id)
    if(room) {
      this.setState(room)
    }
  }

  handleFormChange = key => event => {
    const state = {
      [key]: event.target.value
    }
    this.setState(state)
  }

  handleDialogToggle = event => {
    const { dispatch, app } = this.props
    dispatch(App.update({
      dialog_open: !app.dialog_open
    }))
  }

  handleRoomCreate = event => {
    const { topic, platform, maximum, language, level } = this.state
    const { dispatch, app } = this.props
    if(topic.length) {
      dispatch(Rooms.create({ topic, platform, maximum, language, level }))
      dispatch(App.update({
        dialog_open: !app.dialog_open
      }))
    }
  }

  render() {
    const { topic, platform, maximum, link, language, level } = this.state
    const { classes, app } = this.props

    return (
      <Dialog open={!!app.dialog_open} onEnter={this.handleEnter}>
        <DialogTitle>Create Room</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <TextField label="Topic" margin="normal" value={topic} onChange={this.handleFormChange('topic')} required fullWidth />
              </Grid>
              <Grid item xs={6}>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel>Platfrom</InputLabel>
                  <Select value={platform} onChange={this.handleFormChange('platform')}>
                    {config.platforms.map((item, index) => (
                      <MenuItem key={index} value={index}>
                        <Grid container>
                          <Typography variant="subheading" className={classes.placeholder}>{item.name}</Typography>
                          <Avatar src={item.icon} className={classes.smallAvatar} />
                        </Grid>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel>Maximum</InputLabel>
                  <Select value={maximum} onChange={this.handleFormChange('maximum')}>
                    {Array.from({length: 10}).map((key, index) => (
                      <MenuItem key={index} value={index}>
                        <Typography variant="subheading">{index || 'Unlimited'}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {platform > 1 && (
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    label="Label"
                    placeholder={config.platforms[platform].placeholder}
                    value={link}
                    onChange={this.handleFormChange('link')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    fullWidth
                  />
                </Grid>
              )}
              <Grid item xs={6}>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select value={language} onChange={this.handleFormChange('language')}>
                    {config.languages.map((item, index) => (
                      <MenuItem key={index} value={index}>
                        <Typography variant="subheading">{`${item.name || ''} - ${item.nativeName || ''}`}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel>Level</InputLabel>
                  <Select value={level} onChange={this.handleFormChange('level')}>
                    {config.levels.map((item, index) => (
                      <MenuItem key={index} value={index}>
                        <Typography variant="subheading">{item}</Typography>
                      </MenuItem>
                    ))}
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
    )
  }
}

export default withStyles(styles)(connect(state => {
  const { app, rooms, user } = state
  return { app, rooms, user }
})(Comp))
