import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk-it'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import stores from 'stores'

const store = createStore(
  persistReducer({
    key: 'root',
    storage,
    whitelist: ['app', 'users', 'messages', 'texts'],
  }, combineReducers({
    ...stores,
  })),
  applyMiddleware(thunk),
)

persistStore(store)

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
