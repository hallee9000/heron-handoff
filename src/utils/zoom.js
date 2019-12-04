import React, { createRef }  from 'react'

export default function (Canvas) {
  let gestureStartRotation = 0;
  let gestureStartScale = 0;
  let startX;
  let startY;
  let initialWidth;
  let initialHeight;
  class ZoomWrapper extends React.Component {
    constructor (props) {
      super(props)
      this.canvas = createRef()
      this.state = {
        posX: 0,
        posY: 0,
        rotation: 0,
        scale: 1
      }
    }
    handleWheel = e => {
      this.canvas.current.addEventListener('wheel', (e) => {
        const { posX, posY, scale } = this.state
        if (e.ctrlKey) {
          // zoom
          e.preventDefault();
          this.setState({
            scale: Math.min(4, Math.max(0.25, scale - e.deltaY * 0.01)), 
          })
        } else {
          // move
          this.setState({
            posX: posX - e.deltaX * 2,
            posY: posY - e.deltaY * 2
          })
        }
      });
    }
    handleGestureStart = e => {
      this.canvas.current.addEventListener("gesturestart", function (e) {
        e.preventDefault();
        const { posX, posY, rotation, scale } = this.state
        startX = e.pageX - posX;
        startY = e.pageY - posY;
        gestureStartRotation = rotation;
        gestureStartScale = scale;
      });
    }
    handleGestureChange = e => {
      this.canvas.current.addEventListener("gesturechange", function (e) {
        e.preventDefault();
        this.setState({
          rotation: gestureStartRotation + e.rotation,
          scale: gestureStartScale * e.scale,
          posX: e.pageX - startX,
          posY: e.pageY - startY
        })
      })
    }
    handleGestureEnd = e => {
      this.canvas.current.addEventListener("gestureend", function (e) {
        e.preventDefault();
      });
    }
    componentDidMount () {
      initialWidth = this.canvas.current.clientWidth
      initialHeight = this.canvas.current.clientHeight
      this.handleWheel()
      this.handleGestureStart()
      this.handleGestureChange()
      this.handleGestureEnd()
    }
    render () {
      const { posX, posY, rotation, scale } = this.state
      // console.log(initialWidth, initialHeight)
      const style = {
        width: initialWidth ? scale*initialWidth : initialWidth,
        height: initialHeight ? scale*initialHeight : initialHeight
      }
      return (
        <div className="main-canvas">
          <div ref={this.canvas} className="canvas-container" style={style}>
            <Canvas
              {...this.props}
            />
          </div>
        </div>
      )
    }
  }
  return ZoomWrapper
}
