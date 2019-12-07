import React, { Fragment, createRef } from 'react'
import cn from 'classnames'
import { generateRects } from 'utils/helper'
import canvasWrapper from 'components/canvasWrapper'
import './canvas.scss'

class Canvas extends React.Component {
  state = {
    isLoading: false,
    rects: [],
    selectedRect: null,
    selected: null
  }
  constructor(props) {
    super(props)
    this.img = createRef()
  }
  resetMark = () => {
    this.setState({
      selectedRect: null,
      selected: null
    })
  }
  generateMark = () => {
    const { frameData } = this.props
    const docRect = frameData.absoluteBoundingBox
    const nodes = frameData.children
    const rects = generateRects(nodes, docRect)
    this.setState({ rects })
  }
  onSelect = (rect, index) => {
    console.log(rect)
    this.setState({ selectedRect: rect, selected: index})
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
    const { rects, selected, selectedRect } = this.state
		return (
      <div className="container-mark">
        {
          selectedRect &&
          <Fragment>
            <div
              className="mark-ruler mark-ruler-top"
              style={{top: selectedRect.box.top}}
            />
            <div
              className="mark-ruler mark-ruler-bottom"
              style={{top: selectedRect.ruler.top}}
            />
            <div
              className="mark-ruler mark-ruler-left"
              style={{left: selectedRect.box.left}}
            />
            <div
              className="mark-ruler mark-ruler-right"
              style={{left: selectedRect.ruler.left}}
            />
          </Fragment>
        }
        {
          rects.map((rect, index) =>
            <div
              key={index}
              className={cn("layer", ...rect.clazz, {'selected': selected===index})}
              style={rect.box}
              title={rect.title}
              onClick={e => this.onSelect(rect, index)}
            >
              <div className="layer-sizing layer-width">{ `${rect.actualWidth}px` }</div>
              <div className="layer-sizing layer-height">{ `${rect.actualHeight}px` }</div>
            </div>
          )
        }
        <img src={`/mock/${frameId.replace(':', '-')}.jpg`} ref={this.img} alt="frame"/>
      </div>
    )
	}
}

export default canvasWrapper(Canvas)
