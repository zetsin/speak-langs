import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import {
  withWidth,
  Toolbar,
  TextField,
  Divider,
} from '@material-ui/core'

import { Texts, Messages } from 'stores'

const styles = theme => ({
  root: {
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
      [match.params.rid]: event.target.value
    }))
  }
  handleKeyPress = event => {
    const { dispatch, match } = this.props
    if(event.key === 'Enter' && !event.shiftKey) {
      dispatch(Messages.send(match.params.rid, event.target.value))
      dispatch(Texts.update({
        [match.params.rid]: ''
      }))
      event.preventDefault()
    }
  }

  render() {
    const { classes, match, width, texts } = this.props
    const { rid } = match.params

    const rows = {
      'xl': 5,
      'lg': 4,
      'md': 3,
      'sm': 2,
      'xs': 1,
    }

    return (
      <footer className={classes.root}>
        <Divider />
        <Toolbar>
          <TextField margin="normal" rows={rows[width]} value={texts[rid] || ''} autoFocus fullWidth multiline InputProps={{
            className: classes.input
          }} onChange={this.handleTextChange} onKeyPress={this.handleKeyPress} />
        </Toolbar>
      </footer>
    )
  }
}

export default withWidth()(withStyles(styles)(connect(state => {
  const { texts } = state
  return { texts }
})(Comp)))
