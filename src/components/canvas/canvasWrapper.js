import React, { createRef }  from 'react'
import { Plus, Minus } from 'react-feather'
import { throttle, px2number, toFixed } from 'utils/helper'

import './canvas-wrapper.scss'

export default function (Canvas) {
  class CanvasWrapper extends React.Component {
    constructor (props) {
      super(props)
      this.container = createRef()
      this.canvas = createRef()
      this.state = {
        containerWidth: 0,
        containerHeight: 0,
        initialWidth: 0,
        initialHeight: 0,
        posX: 0,
        posY: 0,
        minScale: 1,
        scale: 1,
        isZoomimg: false,
        isDragging: false,
        spacePressed: false,
        originX: 0,
        originY: 0
      }
    }
    initializeCanvas = () => {
      const { width, height } = this.props.frameData.absoluteBoundingBox
      const { clientWidth, clientHeight } = this.container.current
      let minScale = 1
      let initialWidth, initialHeight
      if (width + 120 > clientWidth || height + 120 > clientHeight) {
        if ((width + 120)/(height + 120) > clientWidth/clientHeight) {
          minScale = toFixed((clientWidth - 120)/width)
        } else {
          minScale = toFixed((clientHeight - 120)/height)
        }
        initialWidth = toFixed(clientWidth/minScale)
        initialHeight = toFixed(clientHeight/minScale)
      } else {
        minScale = 1
        initialWidth = clientWidth
        initialHeight = clientHeight
      }
      this.setState({
        scale: minScale,
        minScale,
        // remember container size
        containerWidth: clientWidth,
        containerHeight: clientHeight,
        initialWidth,
        initialHeight
      })
    }
    limitedPosition = (pos, scale, whichOne) => {
      const { containerWidth, containerHeight, initialWidth, initialHeight } = this.state
      // min: canvas width(height) minus container width(height); max: 0
      return whichOne === 'width' ?
        Math.min(0, Math.max(containerWidth-initialWidth*scale, pos)) :
        Math.min(0, Math.max(containerHeight-initialHeight*scale, pos))
    }
    getSize = (scale, initialSize) => initialSize ? scale*initialSize : initialSize
    onStep = increment => {
      const { containerWidth, containerHeight, initialWidth, initialHeight, scale, minScale } = this.state
      // every step changes 25%
      const currentScale = Math.max(minScale, Math.min(4, scale + increment*0.25))
      this.setState({
        scale: currentScale,
        posX: (containerWidth - initialWidth*currentScale)/2,
        posY: (containerHeight - initialHeight*currentScale)/2
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
    handleKeyboard = () => {
      window.onkeydown = e => {
        // space key pressed
        if(e.keyCode === 32) {
          e.preventDefault()
          this.setState({ spacePressed: true })
        }
      }
      window.onkeyup = e => {
        // space key unpressed
        if(e.keyCode === 32) {
          e.preventDefault()
          this.setState({ spacePressed: false })
        }
      }
    }
    onContainerClick = e => {
      const { onDeselect } = this.props
      const { isDragging } = this.state
      if (!isDragging && e.target.className==='canvas-container') {
        onDeselect && onDeselect()
      }
    }
    handleDrag = () => {
      const canvas = this.canvas.current
      canvas.addEventListener('mousedown', e => {
        const { spacePressed } = this.state
        if (e.which===2 || spacePressed) {
          this.setState({ isDragging: true })
        }
      })
      canvas.addEventListener('mousemove', e => {
        const { isDragging, spacePressed } = this.state
        if (isDragging && (e.which===2 || spacePressed)) {
          const { posX, posY, scale } = this.state
          this.setState({
            posX: this.limitedPosition(posX + e.movementX, scale, 'width'),
            posY: this.limitedPosition(posY + e.movementY, scale)
          })
        }
        this.setState({
          isZoomimg: false
        })
      })
      canvas.addEventListener('mouseup', e => {
        const { spacePressed } = this.state
        this.onContainerClick(e)
        if (e.which===2 || spacePressed) {
          this.setState({ isDragging: false })
        }
      })
    }
    handleWheel = () => {
      const canvas = this.canvas.current
      canvas.addEventListener('wheel', (e) => {
        e.preventDefault()
        const { initialWidth, initialHeight, posX, posY, scale, minScale } = this.state
        if (e.ctrlKey) {
          // startZoomimg
          this.calculateStaringOrigins(e)
          const { originX, originY } = this.state
          const currentScale = Math.min(4, Math.max(minScale, scale - e.deltaY * 0.01))
          const currentWidth = currentScale*initialWidth
          const currentHeight = currentScale*initialHeight
          const currentPosX = (e.clientX - 240) - currentWidth*originX
          const currentPosY = (e.clientY - 40) - currentHeight*originY
          // zoom
          this.setState({
            isZoomimg: true,
            scale: currentScale,
            posX: this.limitedPosition(currentPosX, currentScale, 'width'),
            posY: this.limitedPosition(currentPosY, currentScale)
          })
        } else {
          // scroll
          const { scale } = this.state
          this.setState({
            isZoomimg: false,
            posX: this.limitedPosition(posX - e.deltaX, scale, 'width'),
            posY: this.limitedPosition(posY - e.deltaY, scale)
          })
        }
      });
    }
    handleResize = () => {
      const container = this.container.current
      const canvas = this.canvas.current
      const width = container.clientWidth
      const height = container.clientHeight
      const { containerWidth, containerHeight } = this.state
      if (width === containerWidth && height === containerHeight) return
      this.initializeCanvas()
      this.setState({
        posX: Math.min(0, Math.max(px2number(canvas.style.left), width - canvas.clientWidth)),
        posY: Math.min(0, Math.max(px2number(canvas.style.top), height - canvas.clientHeight))
      })
    }
    componentDidUpdate (prevProps) {
      if (prevProps.frameId !== this.props.frameId) {
        this.handleResize()
      }
    }
    componentDidMount () {
      this.initializeCanvas()
      this.handleWheel()
      this.handleKeyboard()
      this.handleDrag()
      window.onresize = throttle(this.handleResize, 200)
    }
    render () {
      const { initialWidth, initialHeight, posX, posY, scale, spacePressed, isDragging } = this.state
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
          <div
            ref={this.canvas}
            className="canvas-container"
            style={{...style, cursor: (spacePressed || isDragging) ? 'grab' : 'default' }}
          >
            <Canvas
              {...this.props}
              spacePressed={spacePressed}
            />
          </div>
        </div>
      )
    }
  }
  return CanvasWrapper
}
