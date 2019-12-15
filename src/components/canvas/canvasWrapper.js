import React, { createRef }  from 'react'
import { Plus, Minus } from 'react-feather'
import { throttle, px2number } from 'utils/helper'

import './canvas-wrapper.scss'

export default function (Canvas) {
  let constainerSize
  class CanvasWrapper extends React.Component {
    constructor (props) {
      super(props)
      this.container = createRef()
      this.canvas = createRef()
      this.state = {
        initialWidth: 0,
        initialHeight: 0,
        posX: 0,
        posY: 0,
        scale: 0.25,
        isZoomimg: false,
        originX: 0,
        originY: 0
      }
    }
    initializeCanvas = () => {
      const initialWidth = this.container.current.clientWidth*4
      const initialHeight = this.container.current.clientHeight*4
      constainerSize = { width: initialWidth/4, height: initialHeight/4 }
      this.setState({initialWidth, initialHeight})
    }
    getSize = (scale, initialSize) => initialSize ? scale*initialSize : initialSize
    onStep = increment => {
      const { initialWidth, initialHeight, scale } = this.state
      const currentScale = Math.max(0.25, Math.min(4, scale + increment*0.25))
      this.setState({
        scale: currentScale,
        posX: initialWidth*(0.25 - currentScale)/2,
        posY: initialHeight*(0.25 - currentScale)/2
      })
    }
    calculateStaringOrigins = e => {
      // remember the starting origin
      const canvas = this.canvas.current
      const { isZoomimg } = this.state
      if(!isZoomimg) {
        const { left, top, width, height } = canvas.getBoundingClientRect()
        this.setState({
          originX: (e.clientX - left)/width,
          originY:  (e.clientY - top)/height
        })
      }
    }
    handleMove = () => {
      const canvas = this.canvas.current
      canvas.addEventListener('mousemove', e => {
        this.setState({
          isZoomimg: false
        })
      })
    }
    handleWheel = () => {
      const canvas = this.canvas.current
      canvas.addEventListener('wheel', (e) => {
        e.preventDefault()
        const { initialWidth, initialHeight, posX, posY, scale } = this.state
        if (e.ctrlKey) {
          // startZoomimg
          this.calculateStaringOrigins(e)
          const { originX, originY } = this.state
          const currentScale = Math.min(4, Math.max(0.25, scale - e.deltaY * 0.01))
          const currentWidth = currentScale*initialWidth
          const currentHeight = currentScale*initialHeight
          const currentPosX = (e.clientX - 200) - currentWidth*originX
          const currentPosY = (e.clientY - 40) - currentHeight*originY
          // zoom
          this.setState({
            isZoomimg: true,
            scale: currentScale,
            // 最小=容器宽-画布宽，最大=0
            posX: Math.min(0, Math.max(currentPosX, initialWidth*0.25 - currentWidth)),
            // 最小=容器高-画布高，最大=0
            posY: Math.min(0, Math.max(currentPosY, initialHeight*0.25 - currentHeight))
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
    handleResize = () => {
      const container = this.container.current
      const canvas = this.canvas.current
      const width = container.clientWidth
      const height = container.clientHeight
      if (width === constainerSize.width && height === constainerSize.height) return
      this.initializeCanvas()
      this.setState({
        posX: Math.min(0, Math.max(px2number(canvas.style.left), width - canvas.clientWidth)),
        posY: Math.min(0, Math.max(px2number(canvas.style.top), height - canvas.clientHeight))
      })
    }
    componentDidMount () {
      this.initializeCanvas()
      this.handleWheel()
      this.handleMove()
      window.onresize = throttle(this.handleResize, 200)
    }
    componentDidUpdate(prevProps) {
      if (this.props.rightVisible !== prevProps.rightVisible) {
        this.handleResize()
      }
    }
    render () {
      const { initialWidth, initialHeight, posX, posY, scale } = this.state
      const style = {
        top: posY,
        left: posX,
        width: this.getSize(scale, initialWidth),
        height: this.getSize(scale, initialHeight)
      }
      return (
        <div ref={this.container} className="main-canvas">
          <div className="canvas-steper">
            <span className="steper-minus" onClick={() => this.onStep(-1)}><Minus size={14}/></span>
            <span className="steper-percentage">{ (scale*100).toFixed() }%</span>
            <span className="steper-plus" onClick={() => this.onStep(1)}><Plus size={14}/></span>
          </div>
          <div ref={this.canvas} className="canvas-container" style={style}>
            <Canvas
              {...this.props}
            />
          </div>
        </div>
      )
    }
  }
  return CanvasWrapper
}
