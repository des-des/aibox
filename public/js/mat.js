// [
//  [0, 1],
//  [0, 0]
// ]
//
// o
// |
// o
//
// [
//  [0, 1, 0],
//  [0, 0, 1],
//  [0, 0, 0]
// ]
//
// o
// |
// o
// |
// o
//
// [
//  [0, 1, 1, 0],//1
//  [0, 0, 0, 1],//2
//  [0, 0, 0, 1],//3
//  [0, 0, 0, 0] //4
// ]
//
//  o1
//  ^
// o2 o3
//  v
//  o4
//
//  [
//   [0, 1, 0, 0],//1
//   [0, 0, 1, 0],//2
//   [0, 0, 0, 1],//3
//   [0, 0, 0, 0] //4
//  ]
//
//  o1
//  |
//  o2
//  |
//  o3
//  |
//  o4
//
//  [//1, 2, 3, 4, 5, 6
//    [0, 1, 1, 0, 0, 0],//1
//    [0, 0, 0, 1, 0, 0],//2
//    [0, 0, 0, 0, 1, 0],//3
//    [0, 0, 0, 0, 0, 1] //4
//    [0, 0, 0, 0, 0, 1] //4
//    [0, 0, 0, 0, 0, 0] //4
//  ]
//
//   o1
//   ^
// o2 o3
// |  |
// o4 o5
//   V
//   o6
//
//
//  [//1, 2, 3, 4, 5
//    [0, 1, 1, 0, 0],//1
//    [0, 0, 0, 1, 0],//2
//    [0, 0, 0, 0, 1],//3
//    [0, 0, 0, 0, 1] //4
//    [0, 0, 0, 0, 0] //4
//  ]
//
//   o1
//   ^
// o2 o3
// |  |
// o4 |
//   V
//   o5
//
//
//   [//1, 2, 3, 4, 5
//    [0, 1, 1, 0, 0],//1
//    [0, 0, 0, 0, 1],//2
//    [0, 0, 0, 1, 0],//3
//    [0, 0, 0, 0, 1] //4
//    [0, 0, 0, 0, 0] //5
//   ]
//
//   o1
//   ^
// o2 o3
// |  |
// | o4
//  V
//  o5
//
//  start a 1
//  1) y = 0, x = 0;
//  1 -> 2, 3 (2, 3)
//  2) y = 1, x = 0 (3, 2->5)
//  3) y = 1, x = 1 (3->4, 5)
//  4) y = 2, x = 1 (4->5, 5) merge -> choose bigger y, smaller x
//  5) y = 3, x = 0 END
//
//  [//1, 2, 3, 4, 5
//   [0, 1, 1, 0, 0],//1
//   [0, 0, 0, 0, 1],//2
//   [0, 0, 0, 1, 0],//3
//   [0, 0, 0, 0, 1] //4
//   [0, 0, 0, 0, 0] //5
//  ]
//
//   o1
//    ^
// o2  o3
// |   ^
// | o4 o5
// |  | |
// | o6 |
//  V   |
//  o7  |
//    V
//    o8
//
// [//1, 2, 3, 4, 5, 6, 7, 8
//   [0, 1, 1, 0, 0, 0, 0, 0],  //1
//   [0, 0, 0, 0, 0, 0, 1, 0],  //2
//   [0, 0, 0, 1, 1, 0, 0, 0],  //3
//   [0, 0, 0, 0, 0, 1, 0, 0],  //4
//   [0, 0, 0, 0, 0, 0, 0, 1],  //5
//   [0, 0, 0, 0, 0, 0, 1, 0],  //6
//   [0, 0, 0, 0, 0, 0, 0, 1],  //7
//   [0, 0, 0, 0, 0, 0, 0, 0],  //8
// ]
//
// a) set current to (1) = {x:0, y:0}
// b) create link nodes
// c) push link nodes into next
// d) sort link nodes
// e) resolve duplicates
// f) set current to first pop next
// g) if current return to b)

var getNodes = function(mat) {
  return getNextNodes(mat, createNode(0, 0, 0), []);
};

getNextNodes = function(mat, current, next) {
  if (typeof current === 'undefined') {
    return {
      links: [],
      nodes: []
    };
  } else {
    console.log('getNextNodeCalled with current.id =', current.getId());
    var newNodeIds = getNextIds(mat[current.getId()]);
    var newNodes = createNodesFromLinks(current, newNodeIds);
    var next = resolveConflicts(next.concat(newNodes));
    console.log('next now', next);
    return mergeResults(
      current,
      newNodeIds,
      getNextNodes(mat, head(next), tail(next))
    );
  }
}

var getNextIds = function(nodeLinks) {
  console.log('getNextIds called with adj =', nodeLinks);
  return nodeLinks.reduce((links, adj, nodeId) => (
    adj ? links.concat(nodeId) : links
  ), []);
};

var createNodesFromLinks = function(parent, links) {
  console.log('createNodesFromLinks called with parentId =', parent.getId(), 'links =',links);
  return links.map((linkId, offset) => createNode(
    linkId,
    parent.getX() + offset,
    parent.getY() + 1
  ));
};

var createNode = function(id, x, y) {
  return {
    getX: () => x,
    getY: () => y,
    getId: () => id
  };
};


var head = function(arr) {
  return arr[0];
};

var tail = function(arr) {
  return arr.slice(1);
}

var mergeResults = function(node, links, prevResults) {
  return {
    nodes: prevResults.nodes.concat([node.getId]),
    links: prevResults.links.concat(links.map(linkId => [node.getId, linkId]))
  };
};

var resolveConflicts = function(nextNodes) {
  var sortedNodes = nextNodes.sort((lNode, rNode) => (
    lNode.getId() > rNode.getId()
  ));
  return sortedNodes.reduce((uniqueNodes, node) => {
    if (uniqueNodes.length > 0) {
      var lastNode = uniqueNodes[uniqueNodes.length - 1];
      if (lastNode.getId() === node.getId()) {
        var mergeNode = createNode(
          lastNode.getId(),
          lastNode.getX() < node.getX() ? lastNode.getX() : node.getX(),
          lastNode.getY() > node.getY() ? lastNode.getY() : node.getY()
        );
        return uniqueNodes.slice(0, uniqueNodes.length-1).concat([mergeNode]);
      } else {
        return uniqueNodes.concat([node]);
      }
    } else {
      return uniqueNodes.concat([node]);
    }
  }, [])
}

console.log(getNodes([
  [0, 1],
  [0, 0]
]));
