import React, { Component } from 'react'
import d3 from 'd3'

export default class box extends Component {
  render() {
    return <div id = 'aibox'> </div>
  }
  componentDidUpdate() {
    const { graph, openBranches } = this.props
    draw(graph, openBranches)
  }
  componentDidMount() {
    const { graph, openBranches } = this.props
    draw(graph, openBranches)
  }
}

const width = 300

// var getTestFlow = function() {
//   state.pushNode(state.getOpenNodes());
//   state.pushSplit(state.getOpenNodes());
//   state.pushNode(state.getOpenNodes()[0]);
//   state.pushNode(state.getOpenNodes()[0]);
//   state.pushMerge(state.getOpenNodes());
//
//   console.log(executeFlow(-1, state.get(), [
//     (x) => x*2,
//     (x) => x < 0,
//     (x) => x/2,
//     (x) => x*2,
//     (x) => x*2,
//     (x) => x*2,
//     (x) => x*2
//   ]));
//
//   return state;
// }

// var drawFlow = function(graph) {
  // var svgWrapper = getSvgWrapper();
  // var flow = createFlowBuilder(function(flowGraph) {
    // draw(graph, width, svgWrapper);
  // });
  // flow.initTestState();
  // var testFlow = mat2Graph(flow.get());
  // var openNodes = flow.getOpenNodes();
  // console.log(testFlow.nodes[6]);
  // console.log('testflow2!');
  // console.log();
// }

const transform = {
  x: x => x*200,
  y: y => y*50 + 10
}

const getSvgWrapper = function() {
  return document.getElementsByClassName('aibox')[0]
}

const getNodesAndLinksFromNodeLevel = (nodeLevel, nodeLevelDepth) => {
  const nodeLevelWidth = nodeLevel.length;
  return nodeLevel.reduce((levelRenderData, node, nodeNumber) => {
    levelRenderData.nodes.push({
      x: ((nodeNumber+1)/(nodeLevelWidth+1))*width,
      y: (nodeLevelDepth)*100 + 10,
      id: node.id,
      data: node
    })
    if (node && node.next) {
      node.next.forEach(function(link) {
        levelRenderData.links.push([node.id, link])
      })
    }
    return levelRenderData;
  }, {
    nodes: [],
    links: []
  })
}

const createRenderData = logicData => {
  return logicData.reduce((renderData, nodeLevel, nodeLevelDepth) => {
    const levelRenderData =
      getNodesAndLinksFromNodeLevel(nodeLevel, nodeLevelDepth)

    renderData.nodes = renderData.nodes.concat(levelRenderData.nodes)
    renderData.links = renderData.links.concat(levelRenderData.links)
    return renderData
  }, {
    nodes: [],
    links: []
  })
}

const draw = (renderData, openBranches, width) => {
    const svgContainer = drawContainer(width)
    // var renderData = createRenderData(logicData);
    drawLinks(svgContainer, renderData)
    drawNodes(svgContainer, renderData.nodes)
    drawLabels(svgContainer, renderData.nodes)
    drawOpenBranches(svgContainer, openBranches)
}

const drawContainer = width => {
  return d3.select("#aibox").append("svg")
    .attr("width", width)
    .attr("height", 1200)
}

const drawLabels = (svgContainer, nodeData) => {
  svgContainer.selectAll('text')
    .data(nodeData)
    .enter()
    .append('text')
    .attr("x", function(d) {
      return transform.x(d.getX()) + 10;
    })
    .attr("y", function(d) { return transform.y(d.getY()); })
    .text( function (d) { return d.getType() !== 'stub' ? d.getId() : ''; })
    .attr("font-family", "Courier")
    .attr("font-size", "12px")
    .attr("fill", "white")
}
const createDiagonal = nodeData => d3.svg.diagonal()
  .source(d => ({
    "x" : transform.x(getNode(d[0], nodeData).getX()),
    "y" : transform.y(getNode(d[0], nodeData).getY())
  })).target(d => ({
    "x" : transform.x(getNode(d[1], nodeData).getX()),
    "y" : transform.y(getNode(d[1], nodeData).getY())
  })).projection(d => ([d.x, d.y]))

const drawLinks = (svgContainer, {nodes, links}) => {
  const diagonal = createDiagonal(nodes)

  svgContainer.selectAll('line')
    .data(links)
    .enter()
    .append('path')
    .attr("stroke-width", 2)
    .attr("stroke", "white")
    .attr('d', diagonal)
}

const drawNodes = (svgContainer, nodeData) => {
  svgContainer.selectAll('circle')
    .data(nodeData)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('cx', d => transform.x(d.getX()))
    .attr('cy', d => transform.y(d.getY()))
    .attr("fill", d => d.getType() !== "stub" ? "white" : "none")
}
//
const drawOpenBranches = (svgContainer, openBranches) => {
  console.log('openBranches')
  console.log(openBranches)
}

const getNode = (id, nodeData) =>
  nodeData.filter(node =>
    node.getId() === id
  )[0]
