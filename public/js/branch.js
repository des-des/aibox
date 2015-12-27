module.exports = function branchCreator(startPos) {

  // var startPos = startPos_;
  var actions = [];

  var getFirstPos = function() {
    return startPos;
  }

  var addAction = function(action) {
    var numActions = actions.length;
    if (numActions > 0) actions[numActions-1].setNext(action);
    actions.push(action);
  };

  var getActionAt = function(actionYPos) {
    return actions[actionYPos-startPos[1]];
  };

  var getLastPos = function() {
    var y = startPos[1] + (actions.length === 0 ? 0 : actions.length - 1);
    return [startPos[0], y];
  };

  var getFirstAction = function() {
    return actions[0];
  };

  var getLastAction = function() {
    return actions[actions.length-1];
  };

  return {
    getFirstPos: getFirstPos,
    addAction: addAction,
    getActionAt: getActionAt,
    getLastPos: getLastPos,
    getFirstAction: getFirstAction,
    getLastAction: getLastAction
  };
};
