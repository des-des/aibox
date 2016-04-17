import React from 'react'
import { Link } from 'react-router'

import { adjMat2Graph } from './flow_builder/render_matrix.js'
import Box from '../components/box.js'

const mockAdj = [[1, 2], [3], [4], [4], []];
const mockGraph = adjMat2Graph(mockAdj);

const flowBuilder = () =>
  <div>
    adjacency matrix <h3> {JSON.stringify(mockAdj)} </h3> yields graph:
    <Box {...{graph: mockGraph}} />
  </div>

flowBuilder.path = 'build'

export default flowBuilder
