import { combineReducers, thunkActions } from 'redux-thunk-it'

import app from './app'
import user from './user'
import rooms from './rooms'

export default combineReducers({
  app,
  user,
  rooms
})

export const App = thunkActions(app)
export const User = thunkActions(user)
export const Rooms = thunkActions(rooms)