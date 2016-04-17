import { combineReducers } from 'redux-immutable'

import flowBuilder from './flow_builder.js'
import routing from './routing.js'

export default combineReducers({
  flow: flowBuilder,
  routing
});
