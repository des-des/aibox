const test = require('tape');

const mat2Graph = require('../../public/js/renderMatrix.js');

const nodes2Pos = graph => {
  graph.nodes = graph.nodes.map(node => [node.getX(), node.getY()]);
  return graph
}

test('Converting adjaceny matrix to graph', t => {
  'use strict'
  let actual, expected;

  actual = nodes2Pos(mat2Graph([[]]))
  expected = {
    nodes: [],
    links: []
  };
  t.deepEqual(actual, expected, 'empty matrix maps to empty graph');

  actual = nodes2Pos(mat2Graph([
    [1], []
  ]));
  expected = {
    nodes: [[0.5, 1], [0.5, 0]],
    links: [[0, 1]]
  };
  t.deepEqual(expected, actual, 'single link maps correctly');

  actual = nodes2Pos(mat2Graph([
    [1, 2], [], []
  ]));
  expected = {
    nodes: [[1/3, 1], [2/3, 1], [0.5, 0]],
    links: [[0, 1], [0, 2]]
  };
  t.deepEqual(expected, actual, 'decision node maps correctly');

  actual = nodes2Pos(mat2Graph([
    [1, 2], [3], [3], []
  ]));
  expected = {
    nodes: [[1/2, 2], [1/3, 1], [2/3, 1], [0.5, 0]],
    links: [[2, 3], [1, 3], [0, 1], [0, 2]]
  };
  t.deepEqual(expected, actual, 'decision and merge map correctly');

  actual = nodes2Pos(mat2Graph([
    [1, 2], [4], [3], [4], []
  ]));
  expected = {
    links: [ [ 3, 4 ], [ 2, 3 ], [ 1, 5 ], [ 5, 4 ], [ 0, 1 ], [ 0, 2 ] ],
    nodes: [ [ 0.5, 3 ], [ 1/3, 2 ], [ 1/3, 1 ], [ 2/3, 1 ], [ 0.5, 0 ], [ 2/3, 2 ] ]
  };
  t.deepEqual(actual, expected, 'merge correct when merging from nodes at different depths');

  t.end();
});
