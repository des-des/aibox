var state = (function() {
  var state = [[]];
  var makeId = (id => () => id++)(1);
  return {
    pushNode: function(target) {
      var newNode = makeId();
      state[target] = [newNode];
      state[newNode] = [];
      return newNode;
    },
    pushSplit: function(target) {
      var newNodes = [makeId(), makeId()];
      state[target] = [newNodes[0], newNodes[1]];
      state[newNodes[0]] = [];
      state[newNodes[1]] = [];
      return newNodes;
    },
    pushMerge: function(targets) {
      var newNode = makeId();
      state[targets[0]] = [newNode];
      state[targets[1]] = [newNode];
      state[newNode] = [];
      return newNode;
    },
    getOpenNodes: function() {
      return state.reduce((openBranches, links, i) => (
        openBranches.concat(links.length ? [] : [i])
      ), []);
    },
    get: function() {
      return state;
    }
  }
}());

var getTestFlow = function() {
  state.pushNode(state.getOpenNodes());
  state.pushSplit(state.getOpenNodes());
  state.pushNode(state.getOpenNodes()[0]);
  state.pushNode(state.getOpenNodes()[0]);
  state.pushMerge(state.getOpenNodes());

  console.log(executeFlow(-1, state.get(), [
    (x) => x*2,
    (x) => x < 0,
    (x) => x/2,
    (x) => x*2,
    (x) => x*2,
    (x) => x*2,
    (x) => x*2
  ]));

  return state.get();
}
