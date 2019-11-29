import React, { Fragment, createRef } from 'react'
import { Loader } from 'react-feather'
import cn from 'classnames'
import { generateRects } from 'utils/helper'
import './canvas.scss'

class Canvas extends React.Component {
  state = {
    isLoading: false,
    imgUrl: '',
    rects: [],
    selectedRect: null,
    selected: null
  }
  constructor(props) {
    super(props);
    this.img = createRef()
  }
  generateMark = (pageIndex, frameIndex) => {
    const { pageData } = this.props
    const frameData = pageData.children[pageIndex].children[frameIndex]
    const docRect = frameData.absoluteBoundingBox
    const nodes = frameData.children
    const rate = this.img.current.width/this.img.current.naturalWidth
    const rects = generateRects(nodes, docRect, rate)
    this.setState({ rects })
  }
  onSelect = (rect, index) => {
    this.setState({ selectedRect: rect, selected: index})
  }
  componentDidMount () {
    this.generateMark(0, 0)
  }
	render () {
    const { isLoading, rects, selected, selectedRect } = this.state
		return (
        <div className="app-canvas">
          {
            isLoading &&
            <Loader className="motion-loading" size={36} color="#FFF"/>
          }
          <div className="container">
            <div className="detail-mark">
              {
                selectedRect &&
                <Fragment>
                  <div className="mark-ruler mark-ruler-top" style={{top: selectedRect.box.top}}/>
                  <div className="mark-ruler mark-ruler-bottom" style={{top: selectedRect.box.top+selectedRect.box.height-1}}/>
                  <div className="mark-ruler mark-ruler-left" style={{left: selectedRect.box.left}}/>
                  <div className="mark-ruler mark-ruler-right" style={{left: selectedRect.box.left+selectedRect.box.width-1}}/>
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
              <img src="/home.jpg" ref={this.img}/>
            </div>
          </div>
        </div>
      )
	}
}

export default Canvas
