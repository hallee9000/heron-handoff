import React, { createRef } from 'react'

export default class Usage extends React.Component {
  constructor(props) {
    super(props);
    this.container = createRef()
  }
  componentDidMount () {
    this.container.current.onwheel = function (e) {
      e.preventDefault();
    
      if (e.ctrlKey) {
        // Your zoom/scale factor
        console.log('pinch:', e.deltaX, e.deltaY)
      } else {
        // Your trackpad X and Y positions
        console.log('scroll:', e.deltaX, e.deltaY)
      }
    };
  }
  render () {
    return (
      <div style={{flex: 1}}>
        <div style={{background: '#F3F3FE', width: 200, height: 200}} ref={this.container}>
        </div>
      </div>
    )
  }
}
