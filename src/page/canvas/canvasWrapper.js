import React, { createRef }  from 'react'
import Tooltip from 'rc-tooltip'
import { withTranslation } from 'react-i18next'
import { Plus, Minus, HelpCircle } from 'react-feather'
import { withGlobalContextConsumer } from 'contexts/GlobalContext'
import { throttle, isCmdOrCtrl, copySomething } from 'utils/helper'
import { px2number, toFixed, getFrameBounds } from 'utils/mark'
import './canvas-wrapper.scss'

function canvasWrapper (Canvas) {
  class CanvasWrapper extends React.Component {
    constructor (props) {
      super(props)
      this.container = createRef()
      this.canvas = createRef()
      this.state = {
        containerWidth: 0,
        containerHeight: 0,
        frameBound: {},
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
        originY: 0,
        // if show percentage in marks
        // '': not show percentage
        // 'auto': based on common parent
        // 'root': based on root frame
        percentageMode: ''
      }
    }
    initializeCanvas = (needResetSizeAndPosition) => {
      const { frameBound, width, height } = this.getOffsetSize()
      const { scale } = this.state
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
        scale: needResetSizeAndPosition ? minScale : Math.max(scale, minScale),
        minScale,
        // remember container size
        containerWidth: clientWidth,
        containerHeight: clientHeight,
        frameBound,
        initialWidth,
        initialHeight
      })
      if (needResetSizeAndPosition) {
        this.setState({
          posX: 0,
          posY: 0
        })
      }
    }
    getOffsetSize = () => {
      const { canvasData } = this.props
      const { strokes, strokeWeight, strokeTopWeight, strokeRightWeight, strokeBottomWeight, strokeLeftWeight, strokeAlign, effects, absoluteBoundingBox: pageRect } = canvasData
      const strokeWeights = strokeWeight || {
        top: strokeTopWeight,
        right: strokeRightWeight,
        bottom: strokeBottomWeight,
        left: strokeLeftWeight
      }
      const frameBound = getFrameBounds(strokes, strokeWeights, strokeAlign, effects)
      const { width, height } = pageRect
      return {
        frameBound,
        width: frameBound.left + frameBound.right + width,
        height: frameBound.top + frameBound.bottom + height
      }
    }
    limitedPosition = (pos, scale, whichOne) => {
      const { containerWidth, containerHeight, initialWidth, initialHeight } = this.state
      // min: canvas width(height) minus container width(height); max: 0
      return whichOne === 'width' ?
        Math.min(0, Math.max(containerWidth-initialWidth*scale, pos)) :
        Math.min(0, Math.max(containerHeight-initialHeight*scale, pos))
    }
    getSize = (scale, initialSize) => initialSize ? scale*initialSize : initialSize
    onStep = (increment, isDirect = false) => {
      const { containerWidth, containerHeight, initialWidth, initialHeight, scale, minScale } = this.state
      // every step changes 25%
      const currentScale = Math.max(minScale, Math.min(4, isDirect ? increment : (scale + increment*0.25)))
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
      const { onDeselect } = this.props
      window.onkeydown = e => {
        // show percentage distances and spaces
        if (isCmdOrCtrl(e)) {
          this.setState({percentageMode: 'root'})
        } else if (e.altKey) {
          this.setState({percentageMode: 'auto'})
        }
        // when (Cmd/Ctrl \) pressed, siders collapsed
        if ((e.keyCode === 220) && isCmdOrCtrl(e)) {
          e.preventDefault()
          const { globalSettings, changeGlobalSetting } = this.props
          const { leftCollapse, rightCollapse } = globalSettings
          if (leftCollapse && rightCollapse) {
            changeGlobalSetting({leftCollapse: false, rightCollapse: false})
          } else {
            changeGlobalSetting({leftCollapse: true, rightCollapse: true})
          }
        }
        // space key pressed
        if (e.keyCode === 32) {
          e.preventDefault()
          this.setState({ spacePressed: true })
        }
        // when (Cmd/Ctrl +) or (Cmd/Ctrl -) pressed
        if ((e.keyCode === 187 || e.keyCode === 189) && isCmdOrCtrl(e)) {
          e.preventDefault()
          this.onStep(e.keyCode === 187 ? 1 : -1)
        }
        // when ESC pressed
        if (e.keyCode === 27) {
          onDeselect && onDeselect()
        }
        // when Cmd/Ctrl + C pressed
        if ((e.keyCode === 67) && isCmdOrCtrl(e)) {
          const { elementData } = this.props
          if (elementData) {
            const { node } = elementData
            if (node.type==='TEXT') {
              copySomething(node.characters)()
            }
          }
        }
      }
      window.onkeyup = e => {
        // exit percentage mode
        if (isCmdOrCtrl(e)) {
          this.setState({percentageMode: 'root'})
        } else if (e.altKey) {
          this.setState({percentageMode: 'auto'})
        } else {
          this.setState({percentageMode: ''})
        }
        // space key up
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
        // support middle click
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
        const { leftCollapse } = this.props.globalSettings
        if (e.ctrlKey) {
          // startZoomimg
          this.calculateStaringOrigins(e)
          const { originX, originY } = this.state
          const currentScale = Math.min(4, Math.max(minScale, scale - e.deltaY * 0.05))
          const currentWidth = currentScale*initialWidth
          const currentHeight = currentScale*initialHeight
          const currentPosX = (e.clientX - (leftCollapse ? 0 : 240)) - currentWidth*originX
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
      // resize when sider collapse changed
      const { siderCollapseFlag } = this.props
      const { siderCollapseFlag: prevSiderCollapseFlag } = prevProps
      if (prevSiderCollapseFlag!==siderCollapseFlag) {
        this.handleResize()
      }
      if (prevProps.id !== this.props.id) {
        this.initializeCanvas(true)
      }
    }
    componentDidMount () {
      this.initializeCanvas(true)
      this.handleWheel()
      this.handleKeyboard()
      this.handleDrag()
      window.onresize = throttle(this.handleResize, 200)
    }
    componentWillUnmount () {
      window.onresize = null
      window.onkeydown = null
      window.onkeyup = null
    }
    render () {
      const { t } = this.props
      const { width, height } = this.getOffsetSize()
      const { percentageMode, initialWidth, initialHeight, frameBound, posX, posY, scale, spacePressed, isDragging } = this.state
      const style = {
        top: posY,
        left: posX,
        width: this.getSize(scale, initialWidth),
        height: this.getSize(scale, initialHeight)
      }

      return (
        <div ref={this.container} className="main-canvas">
          <div className="canvas-steper">
            <span className="steper-button steper-minus" onClick={() => this.onStep(-1)}><Minus size={14}/></span>
            <Tooltip
              trigger={['click']}
              overlayClassName="canvas-tooltip"
              overlayStyle={{width: 96}}
              placement="top"
              transitionName="rc-tooltip-slide"
              overlay={
                <ul className="tooltip-quick-zoom">
                  <li onClick={() => this.onStep(4, true)}>400%</li>
                  <li onClick={() => this.onStep(3, true)}>300%</li>
                  <li onClick={() => this.onStep(2, true)}>200%</li>
                  <li onClick={() => this.onStep(1, true)}>100%</li>
                </ul>
              }
            >
              <span className="steper-percentage">{ (scale*100).toFixed() }%</span>
            </Tooltip>
            <span className="steper-button steper-plus" onClick={() => this.onStep(1)}><Plus size={14}/></span>
          </div>
          <Tooltip
            trigger={['click']}
            overlayClassName="canvas-tooltip"
            overlayStyle={{width: 266}}
            placement="top"
            transitionName="rc-tooltip-slide"
            overlay={
              <ul className="tooltip-help">
                <li>
                  <h3><span role="img" aria-label="Tips">💡</span> {t('tips')}</h3>
                </li>
                <li>1. {t('zoom')}</li>
                <li>2. {t('drag')}</li>
                <li>3. {t('zoom step')}</li>
                <li>4. {t('percentage')}</li>
                <li>5. {t('deselect')}</li>
                <li>6. {t('hide siders')}</li>
                <li>7. {t('exports')}</li>
              </ul>
            }
          >
            <span className="canvas-help">
              <HelpCircle size={16}/>
            </span>
          </Tooltip>
          <div
            ref={this.canvas}
            className="canvas-container"
            style={{...style, cursor: (spacePressed || isDragging) ? 'grab' : 'default' }}
          >
            <Canvas
              {...this.props}
              percentageMode={percentageMode}
              spacePressed={spacePressed}
              frameBound={frameBound}
              size={{width: width*scale, height: height*scale}}
            />
          </div>
        </div>
      )
    }
  }
  return withTranslation('canvas')(withGlobalContextConsumer(CanvasWrapper))
}

export default canvasWrapper
