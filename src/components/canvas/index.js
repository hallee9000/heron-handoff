import React, { createRef } from 'react'
import cn from 'classnames'
import { mark } from 'utils/distance'
import { generateRects, calculateMarkData } from 'utils/helper'
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
    onSelect && onSelect(rect.node)
    this.setState({ selectedRect: rect, selectedIndex: index})
  }
  onHover = (rect, index) => {
    const { pageRect, selectedRect } = this.state
    // const markData = calculateMarkData(selectedRect, rect, pageRect)
    const markData = mark(selectedRect, rect, pageRect)
    console.log(markData.distanceData)
    this.setState({
      hoveredRect: rect,
      hoveredIndex: index,
      markData
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
    const { frameId } = this.props
    const { rects, selectedIndex, hoveredRect, hoveredIndex, markData } = this.state
		return (
      <div className="container-mark">
        {
          !!selectedIndex && (selectedIndex!==hoveredIndex) &&
          <Ruler rulerData={markData.rulerData}/>
        }
        {
          rects.map((rect, index) => {
            const { top, left, width, height } = rect.box
            return (
              <div
                key={index}
                className={cn(
                  "layer",
                  ...rect.clazz,
                  {selected: selectedIndex===index, hovered: hoveredIndex===index}
                )}
                style={{top, left, width, height}}
                title={rect.title}
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
        <img src={`/mock/${frameId.replace(':', '-')}.jpg`} ref={this.img} alt="frame"/>
      </div>
    )
	}
}

export default canvasWrapper(Canvas)
