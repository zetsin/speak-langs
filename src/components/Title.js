import React from 'react'
import classnames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import {
  ListItem,
  ListItemText,
  IconButton,
  Badge,
  Avatar,
  Tooltip,
  Grid,
  Typography,
} from '@material-ui/core'
import {
  Filter1,
  Filter2,
  Filter3,
  Filter4,
  Filter5,
  Filter6,
  Filter7,
  Filter8,
  Filter9,
  Filter9Plus,
} from '@material-ui/icons'

import config from 'config'

const styles = {
  root: {
    width: 'auto',
    overflow: 'hidden',
  },
  square: {
    borderRadius: 2
  },
  italic: {
    fontStyle: 'italic'
  }
}

class Comp extends React.Component {

  render() {
    const { classes, room={}, nameProps={}, className, onPlatformClick, onMembersClick, ...rest } = this.props

    const platform = config.platforms[room.platform] || config.platforms[config.platforms.length - 1]
    const link = room.link || ''
    const name = room.name || (config.languages[room.language] || config.languages[0]).name
    const level = config.levels[room.level] || config.levels[0]
    const topic = room.topic || 'Random Topic'
    const Maximum = [Filter9Plus, Filter1, Filter2, Filter3, Filter4, Filter5, Filter6, Filter7, Filter8, Filter9][room.maximum] || Filter9Plus

    return (
      <ListItem disableGutters ContainerComponent="div" className={classnames(classes.root, className)} {...rest}>
        <Tooltip title={link}>
          <IconButton onClick={onPlatformClick} className={classes.square}>
            <Avatar src={platform.icon} className={classes.square} />
          </IconButton>
        </Tooltip>
        <ListItemText disableTypography primary={
          <Grid container justify="space-between" alignItems="center" wrap="nowrap">
            <Typography variant="title" noWrap {...nameProps}>{name}</Typography>
            <Typography className={classes.italic} noWrap>{level}</Typography>
          </Grid>
        } secondary={
          <Typography variant="caption" noWrap>{topic}</Typography>
        } />
        <IconButton onClick={onMembersClick}>
          <Badge badgeContent={Object.values(room.clients || {}).filter(item => item !== -1).length} color="secondary">
            <Maximum />
          </Badge>
        </IconButton>
      </ListItem>
    )
  }
}

export default withStyles(styles)(Comp)
