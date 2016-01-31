var getNodes = function(mat) {
  var makeId = createIdMaker(mat.length);
  var result = getNextNodes(mat, createNode(0, '', 0), []);
  var spaces = fillSpaces(result.nodes, result.links, makeId);
  result = {
    nodes: result.nodes.concat(spaces.nodes),
    links: spaces.links
  };
  spreadX(result.nodes);

  // console.log(spaces);
  return result;
};

createIdMaker = id => () => id++;

getNextNodes = function(mat, current, next) {
  if (typeof current === 'undefined') {
    return {
      links: [],
      nodes: []
    };
  } else {
    var newNodeIds = getNextIds(mat[current.getId()]);
    var newNodes = createNodesFromLinks(current, newNodeIds);
    var next = resolveConflicts(next.concat(newNodes));
    // var links = createLinks(current, newNodes, makeId);
    return mergeResults(
      current,
      newNodes,
      getNextNodes(mat, head(next), tail(next))
    );
  }
}

var getNextIds = function(nodeLinks) {
  return nodeLinks.reduce((links, adj, nodeId) => (
    adj ? links.concat(nodeId) : links
  ), []);
};

var createNodesFromLinks = function(parent, links, type) {
  return links.map((linkId, offset) => createNode(
    linkId,
    parent.getX() + offset.toString(),
    parent.getY() + 1,
    type
  ));
};

var createNode = function(id, x_, y, type) {
  console.log(id, x_);
  var x = x_;
  return {
    getX: () => x,
    setX: (newX) => x = newX,
    getY: () => y,
    getId: () => id,
    getType: () => type
    // console.log("node: {id: " + id + " x: " + x + " y: " + y + "}");
  };
};


var head = function(arr) {
  return arr[0];
};

var tail = function(arr) {
  return arr.slice(1);
};

var fillSpaces = function(nodes, links, createId) {
  // console.log('>', i);
  // console.log(linkIds.length);
  console.log(nodes);

  return links.reduce((result, link) => {
    // console.log(link);
    var i;
    var parent;
    var childNode = getNodeById(nodes, link[1]);
    var parentNode = getNodeById(nodes, link[0]);
    var yDiff = childNode.getY() - parentNode.getY();
    if (yDiff === 1) {
      return {
        nodes: result.nodes,
        links: result.links.concat([[parentNode.getId(), childNode.getId()]])
      };
    } else {
      console.log('woah!', yDiff);
      for (i = 0; i < yDiff - 1; i++) {
        nextNode = createNodesFromLinks(parentNode, [createId()], 'stub')[0];
        result.links.push([parentNode.getId(), nextNode.getId()]);
        result.nodes.push(nextNode);
        parentNode = nextNode;
      }
      result.links.push([parentNode.getId(), childNode.getId()])
      return result;
    }
  },{
    nodes: [],
    links: []
  });
  // return targetNodes.reduce((result, targetNode, i) => {

};

var getNodeById = (nodes, id) => nodes.filter(node => node.getId() === id)[0];

var mergeResults = function(node, newNodes, prevResults) {
  return {
    nodes: prevResults.nodes.concat([node]),
    links: prevResults.links.concat(
      newNodes.map(newNode => [node.getId(), newNode.getId()])
    )
  };
  // result.links.concat([[node.getId(), targetNode.getId()]])
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
          compareX(lastNode, node) ? lastNode.getX() : node.getX(),
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

var spreadX = function(nodes) {
  var nodesInY = nodes.reduce((nodesInY, node) => {
    // console.log(node.getX());
    typeof nodesInY[node.getY()] !== 'undefined' ?
      nodesInY[node.getY()].push(node) :
      nodesInY[node.getY()]= [node]
    return nodesInY;
  }, []);
  nodesInY = nodesInY.map(level => level.sort(compareX));
  nodesInY.forEach(level => level.forEach((node, x) => {
    node.setX((x + 1) / (level.length + 1))
    console.log('>>', node.getX());
  }));
},

compareX = function(x1, x2) {
  var x1Arr = x1.getX().split('');
  var x2Arr = x2.getX().split('');
  var i = 0;
  while (i < x1Arr.length) {
    if (x1Arr[i] === '0' && x2Arr[i] === '1') return true;
    else if (x1Arr[i] === '1' && x2Arr[i] === '0') return false;
    i += 1;
  }
}

getTestFlow = () => getNodes([
  [0, 1, 1, 0, 0, 0, 0, 0], // 1 -> 2, 3
  [0, 0, 0, 1, 0, 0, 0, 0], // 2 -> 4
  [0, 0, 0, 0, 1, 1, 0, 0], // 3 -> 5, 6
  [0, 0, 0, 0, 0, 0, 0, 1], // 4 -> 8
  [0, 0, 0, 0, 0, 0, 1, 0], // 5 -> 7
  [0, 0, 0, 0, 0, 0, 1, 0], // 6 -> 7
  [0, 0, 0, 0, 0, 0, 0, 1], //
  [0, 0, 0, 0, 0, 0, 0, 0]
]);
