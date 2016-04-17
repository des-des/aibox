import { List, fromJS } from 'immutable'

import createReducer from './create_reducer.js'
import {
  PUSH_NODE,
  PUSH_SPLIT
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
  }
})

var createFlowBuilder = function(actionCB) {
  var pushMerge = function(targets) {
    var newNode = makeId();
    state[targets[0]] = [newNode];
    state[targets[1]] = [newNode];
    state[newNode] = [];
    execActionCB();
    return newNode;
  };

  var getOpenNodes = function() {
    return state.reduce((openBranches, links, i) => (
      openBranches.concat(links.length ? [] : [i])
    ), []);
  };

  var initTestState = function() {
    pushNode(getOpenNodes());
    pushSplit(getOpenNodes());
    pushNode(getOpenNodes()[0]);
    pushNode(getOpenNodes()[0]);
    pushMerge(getOpenNodes());
    execActionCB();
  };

  return {
    pushNode: pushNode,
    pushSplit: pushSplit,
    pushMerge: pushMerge,
    getOpenNodes: getOpenNodes,
    initTestState: initTestState
  }
};
