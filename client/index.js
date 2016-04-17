/* global document */

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from './create_store.js'
import Router from './router.js'

const domNode = document.getElementById('react_content_container')
// const store = createStore()

ReactDOM.render(
  <div id = 'react_content' className = 'react_content'>
    <Provider store = {store}>
      <Router/>
    </Provider>
  </div>
, domNode)
