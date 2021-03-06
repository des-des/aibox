import { List, fromJS } from 'immutable'

import {
  PUSH_NODE
} from '../action_types.js'

const makeId = (id => () => id++)(1)

export default (state = fromJS([[]]), action) => {
  const { type } = action
  switch (type) {
    case PUSH_NODE:
      const newNodeId = makeId()
      return state
        .set(newNodeId, List([]))
        .set(action.target, List([newNodeId]))
  }
  return state;
}

var createFlowBuilder = function(actionCB) {
  var state = [[]];

  var execActionCB = function() {
    actionCB(mat2Graph(state));
  };

  var pushSplit = function(target) {
    var newNodes = [makeId(), makeId()];
    state[target] = [newNodes[0], newNodes[1]];
    state[newNodes[0]] = [];
    state[newNodes[1]] = [];
    execActionCB();
    return newNodes;
  };

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
