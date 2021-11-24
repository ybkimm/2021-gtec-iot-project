import React from 'react'
import { render } from 'react-dom'
import App from './App'

function main () {
  render(React.createElement(App), document.getElementById('app'))
}

document.readyState !== 'loading'
  ? main()
  : document.addEventListener('DOMContentLoaded', main)
