import { combineReducers, thunkActions } from 'redux-thunk-it'

import app from './app'
import user from './user'

export default combineReducers({
  app,
  user,
})

export const App = thunkActions(app)
export const User = thunkActions(user)