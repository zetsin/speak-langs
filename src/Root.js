import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk-it'

import stores from 'stores'

const store = createStore(
  combineReducers({
    ...stores,
  }),
  applyMiddleware(thunk),
)

class Comp extends React.Component {
  render () {
    const { component } = this.props
    const Comp = component
    return (
      <Provider store={store}>
        <Comp />
      </Provider>
    )
  }
}

export default Comp
