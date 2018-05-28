import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import {
  Toolbar,
  TextField,
} from '@material-ui/core'

import { Texts, Messages } from 'stores'

const styles = theme => ({
  footer: {
    borderTop: '1px solid #e2e2e2',
    background: theme.palette.background.default,
  },
  input: {
    '&:before, &:after': {
      border: 'none !important'
    },
  },
})

class Comp extends React.Component {

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
    const { classes, match, texts } = this.props
    const rid = match.params.room

    return (
      <footer className={classes.footer}>
        <Toolbar>
          <TextField margin="normal" rows="5" value={texts[rid] || ''} autoFocus fullWidth multiline InputProps={{
            className: classes.input
          }} onChange={this.handleTextChange} onKeyPress={this.handleKeyPress} />
        </Toolbar>
      </footer>
    )
  }
}

export default withStyles(styles)(connect(state => {
  const { texts } = state
  return { texts }
})(Comp))
