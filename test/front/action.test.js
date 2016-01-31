var test = require('tape');

var createAction = require('../../public/js/action.js');

test('action creator', t => {
  t.equal(typeof createAction, 'function', 'action creator exists');
  var testAction = createAction('testAction');
  t.equal(typeof testAction, 'object', 'actionCreator returns object');
  t.equal(testAction.getType(), 'testAction', 'action correctly stores its type');
  var secondAction = createAction();
  t.equal(secondAction.getId(), 1, 'second action created has id 1');
  testAction.setNext('data!');
  t.equal(testAction.getNext(), 'data!', 'action.setNext retrievable with action.getNext');
  t.equal(typeof testAction.getRenderData(), 'string', 'getRenderData return a string')
  t.end();
});
