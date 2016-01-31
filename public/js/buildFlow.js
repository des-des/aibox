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
    get: function() {
      return state;
    }
  }
}());

var getTestFlow = function() {
  state.pushNode(0);
  state.pushSplit(1);
  state.pushNode(2);
  state.pushSplit(3);
  state.pushMerge([4, 5]);
  state.pushNode(7)
  state.pushMerge([6, 8]);
  state.pushNode(9);
  return state.get();
}
