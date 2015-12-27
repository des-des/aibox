var test = require('tape');

var createTree = require('../../public/js/tree.js').createTree;
var createBranch = require('../../public/js/branch.js');
var createAction = require('../../public/js/action.js');

test('tree creator', t => {
  t.equal(typeof createTree, 'function', 'treeCreator exists');
  var tree = createTree();
  t.equal(typeof tree, 'object', 'treeCreator returns object');
  var branch = tree.getFirstBranch();
  t.equal(branch.getFirstPos()[0], 0, 'tree creates first branch');
  t.equal(tree.getBranches().length, 1, 'get branches returns array length 1');
  branch = tree.addAction(branch, createAction('firstAction'));
  t.equal(branch.getFirstPos()[0], 0, 'tree returns branch when action is added');
  t.equal(branch.getFirstAction().getType(), 'firstAction', 'action correctly added to tree');
  var decisionAction = createAction('decision');
  var decisionBranches = tree.addAction(branch, decisionAction);
  t.equal(decisionBranches.length, 2, 'added decision to branch get two new branches');
  var decisionActionTarget = branch.getLastAction().getNext();
  t.equal(decisionActionTarget.length, 2, 'decision action has length 2 target');
  var rightDecisionBranchPos = decisionActionTarget[1].getFirstPos();
  t.equal(rightDecisionBranchPos[0], 1, 'right decision branch has correct x pos');
  t.equal(rightDecisionBranchPos[1], 2, 'right decision branch has correct y pos');
  t.equal(tree.getBranches().length, 3, 'tree now has three branches');
  decisionActionTarget[1].addAction(createAction('test'));
  decisionActionTarget[1].addAction(createAction('test'));
  var mergeAction = createAction("merge");
  var mergeBranch = tree.addAction(decisionBranches, mergeAction)
  var mergeBranchDims = mergeBranch.getFirstPos().concat(mergeBranch.getLastPos())
  t.deepEqual(mergeBranchDims, [0, 4, 0, 4], 'merge branch has correct start and end position');
  t.equal(decisionBranches[0].getLastAction().getNext(), mergeBranch, 'action at end of last branch pointing at merge')
  t.end();
});

test('test tree with longer merge branch on left', t => {
  var expected, result;
  var tree = createTree();
  var branches = tree.addAction(tree.getFirstBranch(), createAction('decision'));
  var leftBranch = branches[0];
  tree.addAction(leftBranch, createAction('test'));
  tree.addAction(leftBranch, createAction('test'));
  tree.addAction(leftBranch, createAction('test'));
  var endBranch = tree.addAction(branches, createAction('merge'));
  expected = [0, 1, 0, 3];
  result = leftBranch.getFirstPos().concat(leftBranch.getLastPos());
  t.deepEqual(result, expected, 'left decision branch has correct dimensions');
  expected = [0, 4, 0, 4];
  result = endBranch.getFirstPos().concat(endBranch.getLastPos());
  t.deepEqual(result, expected, 'end branch has correct dimensions');
  t.end();
});
