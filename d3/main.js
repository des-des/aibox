var makeId = (function createIdMaker(idStartPoint) {
  var id = idStartPoint;
  return function idMaker() {
    id += 1;
    return id;
  };
})(0);

var sampleData = [
  [
    {
      id: makeId(),
      next: [2, 3],
      type: 'basic'
    }
  ],
  [
    {
      id: makeId(),
      next: [4],
      type: 'basic'
    },
    {
      id: makeId(),
      next: [4],
      type: 'basic'
    }
  ],
  [
    {
      id: makeId(),
      // next: 3,
      type: 'end'
    }
  ]
];
//
// var props = {
//   yStep: 10,
//   width: 150
// };

var getNodesAndLinksFromNodeLevel = function(nodeLevel, nodeLevelDepth) {
  var nodeLevelWidth = nodeLevel.length;
  return nodeLevel.reduce(function(levelRenderData, node, nodeNumber) {
    levelRenderData.nodes.push({
      x: nodeNumber/nodeLevelWidth,
      y: nodeLevelDepth,
      id: node.id
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

// var nodeLevelWidth = sampleData[0].length;
// var levelRenderData = sampleData[0].reduce(function(levelRenderData, node, nodeNumber) {
//   levelRenderData.nodes.push({
//     x: nodeNumber/nodeLevelWidth,
//     y: 1,
//     id: node.id
//   });
//   if (node && node.next) {
//     levelRenderData.links.push([node.id, node.next]);
//   }
//   return levelRenderData;
// }, {
//   nodes: [],
//   links: []
// });

// console.log(levelRenderData);
// console.log('-------------------');
var out = createRenderData(sampleData);
console.log('nodes: ', out.nodes);
console.log('links: ', out.links);
