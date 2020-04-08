import React, {Component} from 'react'
import {render} from 'react-dom'

import { Menu } from '../../src'

class Demo extends Component {
  render() {
    return <div>
      <h1>gbif-react-components Demo</h1>
      <Menu>Test buttton</Menu>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
