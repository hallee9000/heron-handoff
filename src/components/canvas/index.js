import React, { createRef } from 'react'
import cn from 'classnames'
import { toPercentage, generateRects, calculateMarkData } from 'utils/helper'
import canvasWrapper from './canvasWrapper'
import Distance from './Distance'
import Ruler from './Ruler'
import './canvas.scss'

class Canvas extends React.Component {
  state = {
    isLoading: false,
    rects: [],
    pageRect: {},
    selectedRect: null,
    selectedIndex: null,
    hoveredRect: null,
    hoveredIndex: null,
    markData: {}
  }
  constructor(props) {
    super(props)
    this.img = createRef()
  }
  resetMark = () => {
    this.setState({
      selectedRect: null,
      selectedIndex: null,
      hoveredRect: null,
      hoveredIndex: null,
      markData: {}
    })
  }
  generateMark = () => {
    const { frameData } = this.props
    const pageRect = frameData.absoluteBoundingBox
    const nodes = frameData.children
    const rects = generateRects(nodes, pageRect)
    this.setState({ rects, pageRect })
  }
  onSelect = (rect, index) => {
    const { spacePressed } =this.props
    if (spacePressed) return
    const { onSelect } = this.props
    onSelect && onSelect(rect)
    this.setState({ selectedRect: rect, selectedIndex: index})
  }
  onHover = (rect, index) => {
    const { pageRect, selectedRect } = this.state
    const markData = calculateMarkData(selectedRect, rect, pageRect)
    this.setState({
      hoveredRect: rect,
      hoveredIndex: index,
      markData
    })
  }
  onLeave = () => {
    this.setState({
      hoveredRect: null,
      hoveredIndex: null,
      markData: {}
    })
  }
  componentDidMount () {
    this.generateMark()
  }
  componentDidUpdate(prevProps) {
    if (this.props.frameId !== prevProps.frameId) {
      this.resetMark()
      this.generateMark()
    }
  }
	render () {
    const { frameId, size } = this.props
    const { rects, pageRect, selectedIndex, hoveredIndex, markData } = this.state
		return (
      <div className="container-mark" onMouseLeave={this.onLeave}>
        {
          !!selectedIndex && (selectedIndex!==hoveredIndex) &&
          <Ruler rulerData={markData.rulerData}/>
        }
        {
          rects.map((rect, index) => {
            const { top, left, width, height } = rect
            return (
              <div
                key={index}
                className={cn(
                  "layer",
                  ...rect.clazz,
                  {selected: selectedIndex===index, hovered: hoveredIndex===index}
                )}
                style={{
                  top: toPercentage(top/pageRect.height),
                  left: toPercentage(left/pageRect.width),
                  width: toPercentage(width/pageRect.width),
                  height: toPercentage(height/pageRect.height)
                }}
                onClick={() => this.onSelect(rect, index)}
                onMouseOver={() => this.onHover(rect, index)}
              >
                <div className="layer-sizing layer-width">{ `${rect.actualWidth}px` }</div>
                <div className="layer-sizing layer-height">{ `${rect.actualHeight}px` }</div>
              </div>
            )
          })
        }
        {
          selectedIndex!==hoveredIndex &&
          <Distance distanceData={markData.distanceData}/>
        }
        <img
          src={`${process.env.PUBLIC_URL}/mock/${frameId.replace(':', '-')}.jpg`}
          ref={this.img}
          alt="frame"
          style={{width: size.width, height: size.height}}
        />
      </div>
    )
	}
}

export default canvasWrapper(Canvas)
