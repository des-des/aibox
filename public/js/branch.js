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
    return [startPos[0], startPos[1]+actions.length];
  };

  var getFirstAction = function() {
    return actions[0];
  }

  return {
    getFirstPos: getFirstPos,
    addAction: addAction,
    getActionAt: getActionAt,
    getLastPos: getLastPos,
    getFirstAction: getFirstAction
  };
};
