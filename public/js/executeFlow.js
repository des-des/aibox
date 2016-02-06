var executeFlow = (function() {
  var executeAction = function(state, mat, actions, i) {
    console.log('executing action', i, mat.length);
    if (i === mat.length - 1) {
      console.log('exiting');
      return actions[i](state);
    } else if (mat[i].length > 1) {
      var decision = actions[i](state);
      console.log(decision);
      return decision ?
        executeAction(state, mat, actions, mat[i][0]) :
        executeAction(state, mat, actions, mat[i][1]);
    } else {
      return executeAction(actions[i](state), mat, actions, mat[i][0]);
    }
  }
  var executeFlow = function(state, mat, actions) {
    return executeAction(state, mat, actions, 0);
  }
  return executeFlow;
}());
