import { Router as ReactRouter, Route, IndexRoute } from 'react-router'
import React from 'react'

import { history } from './create_store'
import App from './containers/app.js'
import FlowBuilder from './containers/flow_builder.js'
import Sim from './containers/sim.js'


const Router = () => (
  <ReactRouter history = { history }>
    <Route path = { '/public' } component = { App } >
      <IndexRoute component = { FlowBuilder } />
      <Route path = { Sim.path } component = { Sim } />
    </Route>
  </ReactRouter>
)

export default Router
