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
        scale: 1,
        isZoomimg: false,
        originX: 0,
        originY: 0
      }
    }
    handleMove = () => {
      const canvas = this.canvas.current
      canvas.addEventListener('mousemove', e => {
        this.setState({
          isZoomimg: false
        })
      })
      canvas.addEventListener('click', e => {
        const { scale } = this.state
        const originX = e.offsetX/(scale*initialWidth)
        const originY = e.offsetY/(scale*initialHeight)
        // console.log(e.offsetX, originX)
      })
    }
    handleWheel = e => {
      const canvas = this.canvas.current
      canvas.addEventListener('wheel', (e) => {
        e.preventDefault()
        const { isZoomimg, posX, posY, scale } = this.state
        if (e.ctrlKey) {
          // startZoomimg
          if(!isZoomimg) {
            const { left, top, width, height } = canvas.getBoundingClientRect()
            this.setState({
              originX: (e.clientX - left)/width,
              originY:  (e.clientY - top)/height
            })
          }
          const { width, height } = canvas.getBoundingClientRect()
          const { originX, originY } = this.state
          const currentScale = Math.min(4, Math.max(0.25, scale - e.deltaY * 0.01))
          const currentPosX = (e.clientX - 200) - currentScale*initialWidth*originX
          const currentPosY = (e.clientY - 40) - currentScale*initialHeight*originY
          // zoom
          this.setState({
            isZoomimg: true,
            scale: currentScale,
            // 最小=容器宽-画布宽，最大=0
            posX: Math.min(0, Math.max(currentPosX, initialWidth*0.25 - width)),
            // 最小=容器高-画布高，最大=0
            posY: Math.min(0, Math.max(currentPosY, initialHeight*0.25 - height))
          })
        } else {
          // scroll
          const { scale } = this.state
          this.setState({
            isZoomimg: false,
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
      this.setState({
        posX: -initialWidth*0.375,
        posY: -initialHeight*0.375,
      })
      this.handleWheel()
      this.handleMove()
      this.handleGestureStart()
      this.handleGestureChange()
      this.handleGestureEnd()
    }
    render () {
      const { posX, posY, scale } = this.state
      // console.log(isZoomimg)
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
