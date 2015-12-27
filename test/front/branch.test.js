var test = require('tape');

var createBranch = require('../../public/js/branch.js');
var createAction = require('../../public/js/action.js');

test('branch creator', t => {
  t.equal(typeof createBranch, 'function', 'branchCreator exists');
  var testBranch = createBranch([3, 6]);
  t.equal(typeof testBranch, 'object', 'branchCreator returns object');
  var startPos = testBranch.getFirstPos();
  t.equal(startPos[0], 3, 'branch correctly remembers start x pos');
  t.equal(startPos[1], 6, 'branch correctly remembers start y pos');
  var testAction = createAction('test');
  var testAction2 = createAction('test2');
  testBranch.addAction(testAction);
  testBranch.addAction(testAction2);
  t.equal(testBranch.getActionAt(startPos[1]).getType(), 'test', 'testAction correctly set and retrieved');
  t.equal(testBranch.getFirstAction().getType(), 'test', 'testAction retrieved with getFirstAction');
  t.equal(testBranch.getActionAt(startPos[1]+1).getType(), 'test2', 'second testAction correctly set and retrieved');
  t.equal(testBranch.getLastAction().getType(), 'test2', 'branch gets last action');
  var lastPos = testBranch.getLastPos();
  t.equal(lastPos[0], 3, 'branch.getLastPos gives correct x for end');
  t.equal(lastPos[1], 7, 'branch.getLastPos gives correct y for end');
  t.equal(testBranch.getFirstAction().getNext().getType(), 'test2', 'first action points to second action');
  t.end();
});
