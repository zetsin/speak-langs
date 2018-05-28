import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import {
  List,
  ListSubheader,
  ListItem,
  Grid,
  Avatar,
  Paper,
  Typography,
} from '@material-ui/core'

const styles = theme => ({
  subheader: {
    textAlign: 'center',
    background: theme.palette.background.default,
  },
  item: {
    maxWidth: 'calc(100% - 50px)'
  },
  paper: {
    padding: 10,
  },
  paper_bg: {
    background: '#A2E563',
  },
  text: {
    wordBreak: 'break-all'
  },
  center: {
    textAlign: 'center',
  },
})

class Comp extends React.Component {

  render() {
    const { classes, match, messages, users, user } = this.props
    const rid = match.params.room
    const timespan = 1000 * 60 * 10
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

    return (
      <main ref={el => this.main = el}>
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
                      <Grid item>
                      {speaker.photos && speaker.photos[0] && speaker.photos[0].value ? (
                        <Avatar src={speaker.photos[0].value} alt={speaker.displayName} />
                      ) : (
                        <Avatar>{speaker.displayName ? speaker.displayName.slice(0, 1) : '+_+'}</Avatar>
                      )}
                      </Grid>
                      <Grid item className={classes.item}>
                        <Paper elevation={0} className={classNames(classes.paper, {
                          [classes.paper_bg]: user.id === item.uid
                        })}>
                          {user.id !== item.uid && <Typography variant="caption" noWrap>{speaker.displayName}</Typography>}
                          <Typography className={classes.text}>{item.data}</Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </ListItem>
                )
              })}
            </React.Fragment>
          ))}
        </List>
      </main>
    )
  }

  componentDidUpdate() {
    this.main.parentElement.scrollTop = this.main.scrollHeight
  }
}

export default withStyles(styles)(connect(state => {
  const { messages, users, user } = state
  return { messages, users, user }
})(Comp))
