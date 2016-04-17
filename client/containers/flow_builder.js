import React from 'react'
import { Link } from 'react-router'


const flowBuilder = () =>
  <div>
    <Link to="/public/sim"> sim </Link>
    this is the flow builder!
  </div>

flowBuilder.path = 'build'

export default flowBuilder
