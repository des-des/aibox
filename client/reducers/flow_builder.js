import { List, fromJS } from 'immutable'

import createReducer from './create_reducer.js'
import {
  PUSH_NODE,
  PUSH_SPLIT,
  PUSH_MERGE
} from '../action_types.js'

const makeId = (id => () => id++)(1)

export default createReducer(fromJS([[]]), {
  [PUSH_NODE]: (state, { target }) => {
    const newNodeId = makeId()
    return state
      .set(newNodeId, List([]))
      .set(target, List([newNodeId]))
  },
  [PUSH_SPLIT]: (state, { target }) => {
    const newNodeId1 = makeId()
    const newNodeId2 = makeId()
    return state
      .set(target, List([newNodeId1, newNodeId2]))
      .set(newNodeId1, List([]))
      .set(newNodeId2, List([]))
  },
  [PUSH_MERGE]: (state, {target1, target2}) => {
    const newNodeId = makeId()
    return state
      .set(target1, List([newNodeId]))
      .set(target2, List([newNodeId]))
      .set(newNodeId, List([]))
  }
})
