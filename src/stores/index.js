import { combineReducers, thunkActions } from 'redux-thunk-it'

import app from './app'

export default combineReducers({
  app,
})

export const App = thunkActions(app)