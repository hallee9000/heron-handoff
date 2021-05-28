import React from 'react'
import cn from 'classnames'
import { withGlobalSettings } from 'contexts/SettingsContext'
import { Copy } from 'react-feather'
import { WithCopy } from 'components/utilities'
import { toPercentage, generateRects, calculateMarkData } from 'utils/mark'
import canvasWrapper from './canvasWrapper'
import Distance from './Distance'
import Dimension from './Dimension'
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
    markData: {},
    isChanging: false,
    closedCommonParent: null,
    closedCommonParentPath: ''
  }
  resetMark = () => {
    this.setState({
      closestComponentIndex: undefined,
      closestComponent: null,
      selectedRect: null,
      selectedIndex: null,
      hoveredRect: null,
      hoveredIndex: null,
      markData: {},
      closedCommonParent: null,
      closedCommonParentPath: ''
    })
  }
  generateMark = () => {
    const { canvasData, onGetExports, globalSettings } = this.props
    const { absoluteBoundingBox: pageRect } = canvasData
    const { rects, exportIds } = generateRects([canvasData], pageRect, globalSettings)
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
    return frameStyle
  }
  getLayerBoundStyle = rect => {
    const { pageRect } = this.state
    const { top, left, width, height } = rect.maskedBound || rect
    return {
      top: toPercentage(top/pageRect.height),
      left: toPercentage(left/pageRect.width),
      width: toPercentage(width/pageRect.width),
      height: toPercentage(height/pageRect.height)
    }
  }
  getMaskedLayerHoveredBoundStyle = type => {
    const { pageRect, hoveredRect, selectedRect } = this.state
    const { top, left, width, height } = type==='selected' ? selectedRect : hoveredRect
    return {
      top: toPercentage(top/pageRect.height),
      left: toPercentage(left/pageRect.width),
      width: toPercentage(width/pageRect.width),
      height: toPercentage(height/pageRect.height)
    }
  }
  getActiveAndMaskedType = index => {
    const { selectedIndex, selectedRect, hoveredIndex, hoveredRect } = this.state
    if (index===selectedIndex && selectedRect.maskedBound) {
      return 'selected'
    } else if (index===hoveredIndex && hoveredRect.maskedBound) {
      return 'hovered'
    }
    return false
  }
  getClosedCommonParent = (hoveredRect, selectedRect) => {
    const { rects } = this.state
    if (!hoveredRect || !selectedRect) {
      return { closedCommonParentPath: [], closedCommonParent: null }
    }
    if (hoveredRect.index===selectedRect.index) {
      let closedCommonParent
      if (hoveredRect.index===0) {
        closedCommonParent = hoveredRect
      } else {
        const indexedPaths = [...hoveredRect.paths]
        indexedPaths.pop()
        closedCommonParent = rects.filter(({paths}) => paths.join('-')===indexedPaths.join('-'))[0]
      }
      return { closedCommonParentPath: closedCommonParent.paths, closedCommonParent }
    }
    const closedCommonParentPath = []
    const hoveredPaths = hoveredRect.paths
    const selectedPaths = selectedRect.paths
    const sortedPaths = [hoveredPaths, selectedPaths].sort((a, b) => a.length - b.length)
    const [shorterOne, longerOne] = sortedPaths
    let i = 0
    while (i < shorterOne.length) {
      if (shorterOne[i]===longerOne[i]) {
        closedCommonParentPath.push(shorterOne[i])
      } else {
        break
      }
      i++
    }
    const closedCommonParent = rects.filter(({paths}) => paths.join('-')===closedCommonParentPath.join('-'))[0]
    return { closedCommonParentPath, closedCommonParent }
  }
  isPercentageHighlight = (rect, index) => {
    const { percentageMode } = this.props
    const { closedCommonParentPath, selectedRect, hoveredRect } = this.state
    if (percentageMode==='auto') {
      return closedCommonParentPath===rect.paths.join('-')
    }
    if (percentageMode==='root') {
      return index===0 && selectedRect && hoveredRect
    }
    return false
  }
  selectMask = rect => {
    if (!rect.maskedBound) {
      return
    }
    const { rects } = this.state
    const { maskIndex } = rect.maskedBound
    this.onSelect(rects[maskIndex], maskIndex)
  }
  // get closest parent component to highlight
  getClosestComponent = (closestComponentIndex) => {
    const { rects } = this.state
    const hasIndex = closestComponentIndex!==undefined
    let closestComponent
    if (hasIndex) {
      const { node } = rects[closestComponentIndex]
      if (node.type==='COMPONENT') {
        closestComponent = { name: node.name, description: node.description }
      } else {
        closestComponent = { name: node.mainComponent.name, description: node.mainComponent.description }
      }
    } else {
      closestComponent = null
    }
    return closestComponent
  }
  onSelect = (rect, index) => {
    const { spacePressed, onSelect } =this.props
    if (spacePressed) return
    const { closestComponentIndex } = rect
    const closestComponent = this.getClosestComponent(closestComponentIndex)
    onSelect && onSelect(rect, index, closestComponent)

    const { hoveredIndex, hoveredRect } = this.state
    if (hoveredIndex===index) {
      const { closedCommonParentPath, closedCommonParent } = this.getClosedCommonParent(hoveredRect, rect)
      this.setState({ closedCommonParentPath: closedCommonParentPath.join('-'), closedCommonParent })
    }

    this.setState({
      selectedRect: rect,
      selectedIndex: index,
      closestComponentIndex,
      closestComponent
    })
  }
  onHover = (rect, index) => {
    const { pageRect, selectedRect } = this.state
    const markData = calculateMarkData(selectedRect, rect, pageRect)
    const { closedCommonParentPath, closedCommonParent } = this.getClosedCommonParent(rect, selectedRect)
    this.setState({
      hoveredRect: rect,
      hoveredIndex: index,
      markData,
      closedCommonParentPath: closedCommonParentPath.join('-'),
      closedCommonParent
    })
  }
  onLeave = () => {
    this.setState({
      hoveredRect: null,
      hoveredIndex: null,
      markData: {},
      closedCommonParentPath: '',
      closedCommonParent: null
    })
  }
  handleImgLoaded = () => {
    this.setState({ isChanging: false })
  }
  componentDidMount () {
    this.generateMark()
  }
  componentDidUpdate(prevProps) {
    const { elementData } = this.props
    // reset mark when no element selected
    if (!elementData && (elementData !== prevProps.elementData)) {
      this.resetMark()
    }
    const { id, currentImageUrl } = this.props
    if (id !== prevProps.id && currentImageUrl!==prevProps.currentImageUrl) {
      this.setState({ isChanging: true })
      this.resetMark()
      this.generateMark()
    }
  }
  render () {
    const { currentImageUrl, size, percentageMode, globalSettings, t } = this.props
    const {
      rects,
      closestComponentIndex,
      closestComponent,
      selectedIndex,
      hoveredIndex,
      markData,
      isChanging,
      pageRect,
      closedCommonParent
    } = this.state
    const { showAllExports, disableInspectInComponent } = globalSettings
    const exportsVisible = selectedIndex===0 && showAllExports
    const frameStyle = this.getBound()
    return (
      <div className="container-mark" onMouseLeave={this.onLeave}>
        <div className={cn('mark-layers', {'mark-layers-exports-visible': exportsVisible})} style={frameStyle}>
          {
            selectedIndex!==null && (selectedIndex!==hoveredIndex) &&
            <Ruler rulerData={markData.rulerData}/>
          }
          {
            rects.map((rect, index) => {
              const { clazz, isComponent } = rect
              const activeAndMaskedType = this.getActiveAndMaskedType(index)
              const style = !!activeAndMaskedType ?
                this.getMaskedLayerHoveredBoundStyle(activeAndMaskedType) :
                this.getLayerBoundStyle(rect)
              return (
                <div
                  key={index}
                  className={cn(
                    "layer",
                    ...clazz,
                    {
                      'selected': selectedIndex===index,
                      'hovered': hoveredIndex===index,
                      'closest-component': closestComponentIndex===index,
                      'component-inspect-disabled': disableInspectInComponent && isComponent,
                      'percentage-highlight': this.isPercentageHighlight(rect, index)
                    }
                  )}
                  style={style}
                  onClick={() => this.onSelect(rect, index)}
                  onDoubleClick={() => this.selectMask(rect)}
                  onMouseOver={() => this.onHover(rect, index)}
                >
                  {
                    index===0 && <div className="layer-artboard">{t('artboard')} {rect.node.name}</div>
                  }
                  {
                    isComponent && closestComponentIndex===index &&
                    <div className="layer-component">
                      <WithCopy text={closestComponent.name} className="component-copy">
                        { closestComponent.name }
                        <Copy size={12}/>
                      </WithCopy>
                    </div>
                  }
                  {
                    ['width', 'height'].map(whichSide =>
                      <Dimension
                        key={whichSide}
                        whichSide={whichSide}
                        actualSize={whichSide==='width' ? rect.actualWidth : rect.actualHeight}
                        percentageMode={percentageMode}
                        closedCommonParent={closedCommonParent}
                        pageRect={pageRect}
                      />
                    )
                  }
                </div>
              )
            })
          }
          {
            selectedIndex!==hoveredIndex &&
            <Distance
              distanceData={markData.distanceData}
              globalSettings={globalSettings}
              percentageMode={percentageMode}
              pageRect={pageRect}
              closedCommonParent={closedCommonParent}
            />
          }
        </div>
        <img
          src={currentImageUrl}
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
