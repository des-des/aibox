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
    const { graph } = this.props
    return (
      <div>
        <Box {...{graph}} />
      </div>
    )
  }
  componentDidMount() {
    const { pushNode, pushSplit } = this.props
    pushNode(0)
    pushNode(1)
    pushNode(2)
    pushSplit(3)
  }
}

flowBuilder.path = 'build'

const mapStateToProps = state => {
  return {
    graph: adjMat2Graph(state.get('flow').toJS())
  }
}

export default connect(mapStateToProps, actions)(flowBuilder)
