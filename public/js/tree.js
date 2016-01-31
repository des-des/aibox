var createBranch = require('./branch.js');
var createAction = require('./action.js');

var createTree = function() {
  var branches = [];
  branches.push(createBranch([0, 0]));

  var addDecision = function(branch, action) {
    var branchEnd = branch.getLastPos();
    var newBranches = [
      createBranch([branchEnd[0], branchEnd[1]+1]),
      createBranch([branchEnd[0]+1, branchEnd[1]+1])
    ];
    branches = branches.concat(newBranches);
    action.setNext(newBranches);
    return newBranches;
  };

  var addMerge = function(branches) {
    var endAction, y, endY, mergeBranch;

    branches.forEach(function(branch) {
      endAction = branch.getLastAction();
      if (typeof endAction === 'undefined') {
        endAction = createAction('stub');
        branch.addAction(endAction);
      }
    });

    y = branches.reduce(function(y, branch) {
      endY = branch.getLastPos()[1];
      return endY > y ? endY : y;
    }, 0) + 1;

    mergeBranch = createBranch([branches[0].getLastPos()[0], y]);

    branches.forEach(function(branch){
      branch.getLastAction().setNext(mergeBranch);
    });

    return mergeBranch;
  };

  var getFirstBranch = function() {
    return branches[0];
  };

  var getBranches = function() {
    return branches;
  }

  var addAction = function(branch, action) {
    var actionType = action.getType();
    if (actionType === 'merge') {
      return addMerge(branch, action);
    } else if (actionType === 'decision') {
      branch.addAction(action);
      return addDecision(branch, action);
    } else {
      branch.addAction(action);
      return branch;
    }
  };

  return {
    getFirstBranch: getFirstBranch,
    addAction: addAction,
    getBranches: getBranches
  };
};

module.exports = {
  createTree: createTree
};
