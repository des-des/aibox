import React from 'react'
import { Link } from 'react-router'

import { adjMat2Graph } from './flow_builder/render_matrix.js'

const mockAdj = [[1, 2], [], []];

console.log(adjMat2Graph(mockAdj));

const flowBuilder = () =>
  <div>
    adjacency matrix
    <h3> {JSON.stringify(mockAdj)} </h3>
    maps to graph
    <h3> {JSON.stringify(adjMat2Graph(mockAdj))} </h3>
    vvv test link vvv <br />
    >>> <Link to="/public/sim"> sim </Link>
  </div>

flowBuilder.path = 'build'

export default flowBuilder
