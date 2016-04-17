import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import { adjMat2Graph } from './flow_builder/render_matrix.js'
import Box from '../components/box.js'
import * as actions from '../actions/flow_builder.js'

const mockAdj = [[1, 2], [3], [4], [4], []]
const mockGraph = adjMat2Graph(mockAdj)

class flowBuilder extends Component {
  render() {
    const { graph, openBranches } = this.props
    return (
      <div>
        <Box {...{graph, openBranches}} />
      </div>
    )
  }
  componentDidMount() {
    const { pushNode, pushSplit, pushMerge } = this.props
    pushNode(0)
    pushSplit(1)
    pushMerge(2, 3)
  }
}

const getOpenNodes = adj => adj
  .reduce((openBranches, links, i) => (
    openBranches.concat(links.length ? [] : [i])
  ), [])

const mapStateToProps = state => {
  return {
    openBranches: getOpenNodes(state.get('flow').toJS()),
    graph: adjMat2Graph(state.get('flow').toJS())
  }
}

export default connect(mapStateToProps, actions)(flowBuilder)
