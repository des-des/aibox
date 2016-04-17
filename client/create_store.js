import { combineReducers, createStore, applyMiddleware } from 'redux'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { browserHistory } from 'react-router'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'

import reducers from './reducers/'

const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  }),
  {},
  applyMiddleware(...middleware)
)

export const history = syncHistoryWithStore(browserHistory, store)

const middleware = [createLogger()]

export default store
