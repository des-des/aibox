const mat2Graph = (() => {

  const createIdMaker = id => () => id++;

  const getNextNodes = function(mat, current, next) {
    if (typeof current === 'undefined') {
      return {
        links: [],
        nodes: []
      };
    } else {
      var newNodeIds = mat[current.getId()];
      var newNodes = createNodesFromLinks(current, newNodeIds);
      var next = resolveConflicts(next.concat(newNodes));
      return mergeResults(
        current,
        newNodes,
        getNextNodes(mat, head(next), tail(next))
      );
    }
  };

  const createNodesFromLinks = function(parent, links, type) {
    return links.map((linkId, offset) => createNode(
      linkId,
      parent.getX() + offset.toString(),
      parent.getY() + 1,
      type
    ));
  };

  const createNode = function(id, x_, y, type) {
    var x = x_;
    return {
      getX: () => x,
      setX: newX => x = newX,
      getY: () => y,
      getId: () => id,
      getType: () => type
    };
  };


  const head = function(arr) {
    return arr[0];
  };

  const tail = function(arr) {
    return arr.slice(1);
  };

  const fillSpaces = function(nodes, links, createId) {
    return links.reduce((result, link) => {
      let i;
      let parent;
      let childNode = getNodeById(nodes, link[1]);
      let parentNode = getNodeById(nodes, link[0]);
      let yDiff = childNode.getY() - parentNode.getY();
      if (yDiff === 1) {
        return {
          nodes: result.nodes,
          links: result.links.concat([[parentNode.getId(), childNode.getId()]])
        };
      } else {
        for (i = 0; i < yDiff - 1; i++) {
          let nextNode = createNodesFromLinks(parentNode, [createId()], 'stub')[0];
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
  };

  const getNodeById = (nodes, id) => nodes.filter(node => node.getId() === id)[0];

  const mergeResults = function(node, newNodes, prevResults) {
    return {
      nodes: prevResults.nodes.concat([node]),
      links: prevResults.links.concat(
        newNodes.map(newNode => [node.getId(), newNode.getId()])
      )
    };
    // result.links.concat([[node.getId(), targetNode.getId()]])
  };

  const resolveConflicts = function(nextNodes) {
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

  const spreadX = function(nodes) {
    let nodesInY = nodes.reduce((nodesInY, node) => {
      typeof nodesInY[node.getY()] !== 'undefined' ?
        nodesInY[node.getY()].push(node) :
        nodesInY[node.getY()]= [node]
      return nodesInY;
    }, []);
    nodesInY = nodesInY.map(level => level.sort(compareX));
    nodesInY.forEach(level => level.forEach((node, x) => {
      node.setX((x + 1) / (level.length + 1))
    }));
  };

  const compareX = function(x1, x2) {
    var x1Arr = x1.getX().split('');
    var x2Arr = x2.getX().split('');
    var i = 0;
    while (i < x1Arr.length) {
      if (x1Arr[i] === '0' && x2Arr[i] === '1') return true;
      else if (x1Arr[i] === '1' && x2Arr[i] === '0') return false;
      i += 1;
    }
  };



  return (adjacency) => {
    if (adjacency.length === 1 && adjacency[0].length === 0) {
      return {
        nodes: [],
        links: []
      }
    }

    const makeId = createIdMaker(adjacency.length);

    let graph = getNextNodes(adjacency, createNode(0, '', 0), []);
    const emptyNodes = fillSpaces(graph.nodes, graph.links, makeId);
    graph = {
      nodes: graph.nodes.concat(emptyNodes.nodes),
      links: emptyNodes.links
    };
    spreadX(graph.nodes); // not pure
    return graph;
  }
})();

if (module && module.exports) {
  module.exports = mat2Graph;
}
