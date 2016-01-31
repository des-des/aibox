var width = 300;

var testDraw = function() {
  var svgWrapper = getSvgWrapper();
  var testFlow = getTestFlow();
  draw(testFlow, width, svgWrapper);
  // console.log(testFlow);
  // console.log(svgWrapper);
}

var transform = {
  x: x => x*200,
  y: y => y*50 + 10
};

var getSvgWrapper = function() {
  return document.getElementsByClassName('flow')[0];
};

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
  console.log(logicData);
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

var draw = function(renderData, width, svgContainer) {
    var svgContainer = drawContainer(width);
    // var renderData = createRenderData(logicData);
    drawLinks(svgContainer, renderData);
    drawNodes(svgContainer, renderData.nodes);
    drawLabels(svgContainer, renderData.nodes);
}

var drawContainer = function(width) {
  return d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", 1200);
    // .call(d3.behavior.zoom().on("zoom", zoom));
}

var drawLabels = function(svgContainer, nodeData) {
  svgContainer.selectAll('text')
    .data(nodeData)
    .enter()
    .append('text')
    .attr("x", function(d) {
      // console.log('in drawLabels', d.getX());
      return transform.x(d.getX());
    })
    .attr("y", function(d) { return d.getY()+5; })
    // .text( function (d) { return d.data.operation.toString(); })
    .attr("font-family", "Courier")
    .attr("font-size", "12px")
    .attr("fill", "white");
}

var drawLinks = function(svgContainer, renderData) {
  var nodeData = renderData.nodes;
  var diagonal = d3.svg.diagonal()
    .source(function(d) {
      var out = {
        "x" : transform.x(getNode(d[0], nodeData).getX()),
        "y" : transform.y(getNode(d[0], nodeData).getY())
      };
      // console.log(out);
      return out;
    })
    .target(function(d) {
      return {
        "x" : transform.x(getNode(d[1], nodeData).getX()),
        "y" : transform.y(getNode(d[1], nodeData).getY())
      };
    })
    .projection(function(d) {
      return [d.x, d.y];
    });

  svgContainer.selectAll('line')
    .data(renderData.links)
    .enter()
    .append('path')
    .attr("stroke-width", 2)
    .attr("stroke", "white")
    .attr('d', diagonal);
}

var drawNodes = function(svgContainer, nodeData) {
  svgContainer.selectAll('circle')
    .data(nodeData)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('cx', (d) => {
      return transform.x(d.getX());
    })
    .attr('cy', (d) => transform.y(d.getY()))
    .attr("fill", function(d) {
      console.log('in draw nodes', d.getType());
      return d.getType() !== "stub" ? "white" : "none";
      // return "white";
    });
}

var getNode = function(id, nodeData) {
  return nodeData.filter(function(node) {
    return node.getId() === id;
  })[0];
};

// draw(sampleData2, width);
testDraw();
