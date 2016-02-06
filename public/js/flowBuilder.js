var makeId = (function createIdMaker(idStartPoint) {
  var id = idStartPoint;
  return function idMaker() {
    id += 1;
    return id;
  };
})(0);

var getDepth = function(data) {
  return data.length;
};

var create = {
  adder: function(key, toAdd) {
    var adder = function(state) {
      state[key] += toAdd;
    }
    adder.toString = function() {
      return toAdd + ' added to ' + key;
    }
    return adder;
  },
  logger: function(key) {
    var logger = function(state) {
      console.log(state[key]);
    }
    logger.toString = function() {
      return key + ' logged';
    }
    return logger;
  },
  initialiser: function(key, value) {
    var initialiser = function(state) {
      state[key] = value;
    }
    initialiser.toString = function() {
      return key + ' initialised to ' + value;
    }
    return initialiser;
  },
  stub: function() {
    var stub = function(state) {
      return ;
    }
    stub.toString = function() {
      return "";
    }
    return stub;
  },
  decide: function(key, op, value) {
    var decide = function(state) {
      switch (op) {
        case '>':
          return state[key] > value;
        case '>=':
          return state[key] >= value;
        case '<':
          return state[key] < value;
        case '<=':
          return state[key] <= value;
        case '===':
          return state[key] === value;
        default:
          console.log('fail in if statement!');
      }
    }
    decide.toString = function() {
      return 'checking ' + key + ' ' + op + ' ' + value;
    }
    return decide;
  }
}

var newFlowLogic = function() {
  var flowLogic = [];
  flowLogic.addUserAction = function(userAction) {
    var squareDepth = flowLogic.getNewSquareDepth(userAction);
    if (typeof flowLogic[squareDepth] === 'undefined') {
      flowLogic[squareDepth] = [];
    }
    flowLogic[squareDepth].push(userAction.squareData);
  };
  flowLogic.getNewSquareDepth = function(userAction) {
    return userAction.depth;
  };
  return flowLogic;
};

var flowChart = function() {
  var flowLogic = newFlowLogic();
  var getFlowLogic = function() {
    return flowLogic;
  };
  var commitUserAction = function(userAction) {
    flowLogic.addUserAction(userAction);
  };
  return {
    getFlowLogic: getFlowLogic,
    commitUserAction: commitUserAction
  };
}

var buildTestChart = function() {
  var testChart = flowChart();
  var testAction1 = {
    depth : 0,
    squareData : {
      id: makeId(),
      next: [2],
      type: 'function',
      operation: create.adder('x', 1)
    }
  };
  testChart.commitUserAction(testAction1);
  var testAction2 = {
    depth : 1,
    squareData : {
      id: makeId(),
      next: [2],
      type: 'function',
      operation: create.adder('x', 2)
    }
  };
  testChart.commitUserAction(testAction2);
  return testChart.getFlowLogic();
};


var state = {}
var execute = function(node, logicData) {
  if (node.operation.hasOwnProperty('toString')) {
    console.log(node.operation.toString());
  }
  var result = node.operation(state);
  if (!node.next) {
    return ;
  }
  execute(
    getNodeFromLogicData(node.next[result ? 1 : 0], logicData),
    logicData
  );
}

var getNodeFromLogicData = function(id, data) {
  return data.filter(function(logicLayer) {
    return logicLayer.reduce(function(found, node) {
      if (node.id === id) {
        found = true;
      }
      return found;
    }, false)
  })[0].filter(function(node) {
    return node.id === id;
  })[0];
};

// var inputDiv = document.getElementsByClassName('input')[0];
// var input = inputDiv.getElementsByTagName('input')[0];
// var button = inputDiv.getElementsByTagName('button')[0];
//
// button.addEventListener('click', function() {
//   var inputData = parseInt(input.value, 10);
//   state = {
//     x: inputData
//   };
//   execute(sampleData2[0][0], sampleData2);
// })

var width = 800;

var getNodesAndLinksFromNodeLevel = function(nodeLevel, nodeLevelDepth) {
  var nodeLevelWidth = nodeLevel.length;
  return nodeLevel.reduce(function(levelRenderData, node, nodeNumber) {
    levelRenderData.nodes.push({
      x: ((nodeNumber+1)/(nodeLevelWidth+1))*width,
      y: (nodeLevelDepth)*100 + 10,
      id: node.id,
      data: node
    });
    if (node && node.next) {
      node.next.forEach(function(link) {
        levelRenderData.links.push([node.id, link]);
      });
    }
    return levelRenderData;
  }, {
    nodes: [],
    links: []
  });
}

var createRenderData = function(logicData) {
  return logicData.reduce(function(renderData, nodeLevel, nodeLevelDepth) {
    var levelRenderData =
      getNodesAndLinksFromNodeLevel(nodeLevel, nodeLevelDepth)
    renderData.nodes = renderData.nodes.concat(levelRenderData.nodes);
    renderData.links = renderData.links.concat(levelRenderData.links);
    return renderData;
  }, {
    nodes: [],
    links: []
  });
}
