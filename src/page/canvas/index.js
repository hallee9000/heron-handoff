import React from 'react'
import cn from 'classnames'
import { withGlobalSettings } from 'contexts/SettingsContext'
import { toPercentage, generateRects, calculateMarkData, findParentComponent } from 'utils/mark'
import { formattedNumber } from 'utils/style'
import { getImage } from 'utils/helper'
import canvasWrapper from './canvasWrapper'
import Distance from './Distance'
import Ruler from './Ruler'
import './canvas.scss'

class Canvas extends React.Component {
  state = {
    isLoading: false,
    rects: [],
    pageRect: {},
    componentIndex: '',
    componentId: '',
    currentComponentName: '',
    selectedRect: null,
    selectedIndex: null,
    hoveredRect: null,
    hoveredIndex: null,
    markData: {},
    frameStyle: {},
    isChanging: false
  }
  resetMark = () => {
    this.setState({
      componentIndex: '',
      componentId: '',
      currentComponentName: '',
      selectedRect: null,
      selectedIndex: null,
      hoveredRect: null,
      hoveredIndex: null,
      markData: {}
    })
  }
  generateMark = () => {
    const { canvasData, onGetExports } = this.props
    const { absoluteBoundingBox: pageRect } = canvasData
    const { rects, exportIds } = generateRects([canvasData], pageRect)
    onGetExports && onGetExports(exportIds)
    this.setState({ rects, pageRect })
  }
  getBound = () => {
    const { frameBound } =this.props
    const { pageRect } = this.state
    const { top, bottom, left, right } = frameBound
    const frameStyle = {
      top: toPercentage(top/(pageRect.height+top+bottom)),
      left: toPercentage(left/(pageRect.width+left+right)),
      height: toPercentage(pageRect.height/(pageRect.height+top+bottom)),
      width: toPercentage(pageRect.width/(pageRect.width+left+right))
    }
    this.setState({ frameStyle })
  }
  onSelect = (rect, index) => {
    const { spacePressed, onSelect, components } =this.props
    if (spacePressed) return
    const { rects } = this.state
    const { index: componentIndex, componentId } = findParentComponent(index, rect, rects)
    const currentComponent = components.find(({id}) => id===componentId)
    const currentComponentName =  rect.componentIds ? (currentComponent ? currentComponent.name : rects[componentIndex].node.name) : ''

    onSelect && onSelect(rect, currentComponentName, index)
    this.setState({
      selectedRect: rect,
      selectedIndex: index,
      componentIndex,
      componentId,
      currentComponentName
    })
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
  handleImgLoaded = () => {
    this.setState({ isChanging: false })
  }
  componentDidMount () {
    this.generateMark()
  }
  componentDidUpdate(prevProps) {
    if (this.props.propsDissolved && (this.props.propsDissolved !== prevProps.propsDissolved)) {
      this.resetMark()
    }
    const { id, useLocalImages, images } = this.props
    const imgUrl = getImage(id, useLocalImages, images)
    const prevImgUrl = getImage(prevProps.id, useLocalImages, images)
    if (this.props.id !== prevProps.id && imgUrl!==prevImgUrl) {
      this.setState({ isChanging: true })
      this.resetMark()
      this.generateMark()
    }
    if (this.props.frameBound.top !== prevProps.frameBound.top) {
      this.getBound()
    }
  }
	render () {
    const { id, size, useLocalImages, images, globalSettings } = this.props
    const { rects, pageRect, frameStyle, selectedIndex, hoveredIndex, componentIndex, currentComponentName, markData, isChanging } = this.state
		return (
      <div className="container-mark" onMouseLeave={this.onLeave}>
        <div className="mark-layers" style={frameStyle}>
          {
            selectedIndex!==null && (selectedIndex!==hoveredIndex) &&
            <Ruler rulerData={markData.rulerData}/>
          }
          {
            rects.map((rect, index) => {
              const { top, left, width, height, clazz, isComponent } = rect
              return (
                <div
                  key={index}
                  className={cn(
                    "layer",
                    ...clazz,
                    {
                      'selected': selectedIndex===index,
                      'hovered': hoveredIndex===index,
                      'current-component': componentIndex===index
                    }
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
                  {
                    isComponent && componentIndex===index &&
                    <div className="layer-component">{ currentComponentName }</div>
                  }
                  <div className="layer-sizing layer-width">{ formattedNumber(rect.actualWidth, globalSettings) }</div>
                  <div className="layer-sizing layer-height">{ formattedNumber(rect.actualHeight, globalSettings) }</div>
                </div>
              )
            })
          }
          {
            selectedIndex!==hoveredIndex &&
            <Distance distanceData={markData.distanceData} globalSettings={globalSettings}/>
          }
        </div>
        <img
          src={getImage(id, useLocalImages, images)}
          alt="frame"
          style={{
            width: size.width,
            height: size.height,
            opacity: isChanging ? 0 : 1
          }}
          onLoad={this.handleImgLoaded}
        />
      </div>
    )
	}
}

export default canvasWrapper(withGlobalSettings(Canvas))
