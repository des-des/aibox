import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux-immutable';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { browserHistory } from 'react-router'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import Immutable from 'immutable'

import reducers from './reducers/'

const store = createStore(
  combineReducers({
    ...reducers,
  }),
  Immutable.Map({}),
  applyMiddleware(...middleware)
)

export const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: state => state.get('routing').toJS()
})

const middleware = [createLogger()]

export default store
