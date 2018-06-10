import { combineReducers, thunkActions } from 'redux-thunk-it'

import app from './app'
import user from './user'
import users from './users'
import rooms from './rooms'
import texts from './texts'
import messages from './messages'

export default combineReducers({
  app,
  user,
  users,
  rooms,
  texts,
  messages,
})

export const App = thunkActions(app)
export const User = thunkActions(user)
export const Users = thunkActions(users)
export const Rooms = thunkActions(rooms)
export const Texts = thunkActions(texts)
export const Messages = thunkActions(messages)
