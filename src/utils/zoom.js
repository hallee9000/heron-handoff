import React, { createRef }  from 'react'

const animateStep = callback => {
  window.requestAnimationFrame(() => {
    callback && callback()
  })
}

export default function (Canvas) {
  let gestureStartRotation = 0;
  let gestureStartScale = 0;
  let startX;
  let startY;
  let initialWidth;
  let initialHeight;
  let mouseX;
  let mouseY;
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
    handleMove = () => {
      this.canvas.current.addEventListener('mousemove', e => {
        mouseX = e.clientX - 200
        mouseY = e.clientY - 40
      })
    }
    handleWheel = e => {
      this.canvas.current.addEventListener('wheel', (e) => {
        e.preventDefault();
        const { posX, posY, scale } = this.state
        if (e.ctrlKey) {
          // zoom
          this.setState({
            scale: Math.min(4, Math.max(0.25, scale - e.deltaY * 0.01)), 
          })
        } else {
          // scroll
          const { scale } = this.state
          console.log(scale, initialWidth, initialHeight)
          this.setState({
            // 最小=画布宽-容器宽，最大=0
            posX: Math.min(0, Math.max(initialWidth*(0.25-scale), posX - e.deltaX)),
            // 最小=画布高-容器高，最大=0
            posY: Math.min(0, Math.max(initialHeight*(0.25-scale), posY - e.deltaY))
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
        e.preventDefault()
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
      this.handleMove()
      this.handleGestureStart()
      this.handleGestureChange()
      this.handleGestureEnd()
    }
    render () {
      const { posX, posY, scale } = this.state
      // console.log(posX, posY)
      const style = {
        top: posY,
        left: posX,
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
