import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import {
  List,
  ListSubheader,
  ListItem,
  Grid,
  Avatar,
  Paper,
  Typography,
  IconButton,
} from '@material-ui/core'


const styles = theme => ({
  root: {
    flex: 1,
    overflow: 'scroll',
  },
  subheader: {
    background: theme.palette.background.default,
  },
  box: {
    flexBasis: 'auto',
  },
  paper: {
    padding: 10,
  },
  paper_bg: {
    background: theme.palette.primary[theme.palette.type],
  },
  pre: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  center: {
    textAlign: 'center',
  },
})

class Comp extends React.Component {

  render() {
    const { classes, match, groups, messages, users, user } = this.props
    const { rid } = match.params
    const timespan = 1000 * 60 * 10
    const conversation = Object.values(messages[rid] || {}).reduce((pre, cur) => {
      const time = parseInt(cur.created / timespan, 10)
      return {
        ...pre,
        [time]: [
          ...(pre[time] || []),
          cur,
        ]
      }
    }, {})
    const group = groups[rid] || {}

    return (
      <main className={classes.root} ref={el => this.main = el}>
        <List>
          {Object.keys(conversation).map((key, index) => (
            <React.Fragment key={index}>
              <ListSubheader className={classes.center}>
                <span className={classes.subheader}>{new Date(key * timespan).toLocaleTimeString()}</span>
              </ListSubheader>
              {conversation[key].map((item, index) => {
                const speaker = users[item.uid] || {}
                return (
                  <ListItem key={index}>
                    <Grid container spacing={8} direction={user.id === item.uid ? "row-reverse" : "row"}>
                      <IconButton>
                        {speaker.image ? (
                          <Avatar src={speaker.image} alt={speaker.displayName} />
                        ) : (
                          <Avatar>{speaker.displayName ? speaker.displayName.slice(0, 1) : '+_+'}</Avatar>
                        )}
                      </IconButton>
                      <Grid item xs={10} sm={8} className={classes.box}>
                        <Paper elevation={0} className={classnames(classes.paper, classnames, {
                          [classes.paper_bg]: user.id === item.uid
                        })}>
                          {user.id !== item.uid && <Typography variant="caption" noWrap>{speaker.displayName}</Typography>}
                          <Typography component="pre" className={classes.pre}>{item.data}</Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </ListItem>
                )
              })}
            </React.Fragment>
          ))}
          {(group[window.io.id] === undefined || group[window.io.id] === -1) && (
            <Typography align="center" color="secondary">Your are not in the room</Typography>
          )}
        </List>
      </main>
    )
  }

  componentDidUpdate() {
    this.main.scrollTop = this.main.scrollHeight
  }
}

export default withStyles(styles)(connect(state => {
  const { groups, messages, users, user } = state
  return { groups, messages, users, user }
})(Comp))
