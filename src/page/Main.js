import React from 'react'
import LeftPanel from './left'
import RightPanels from './right'
import Canvas from './canvas'
import './main.scss'

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      canvasData: null,
      id: '',
      // selected layer index
      currentIndex: '',
      elementData: null,
      hasElementSelected: false,
      currentComponentName: '',
      siderCollapseFlag: false,
      siderCollapsePlacement: '',
      exportIds: []
    }
  }
  handleSelectFrameOrComponent = (currentId, pageId) => {
    const { data, components, onNamesChange } = this.props
    const { id } = this.state
    // console.log('current:', id, 'new:', currentId)
    if (id===currentId) return
    const currentPage = pageId ? data.document.children.find(({id}) => id===pageId) : {}
    const canvasData = (pageId ? currentPage.children : components).find(({id}) => id===currentId)
    this.setState({
      id: currentId,
      canvasData
    })
    onNamesChange && onNamesChange(canvasData.name, currentPage.name)
    this.handleDeselect()
  }
  handleSelectElement = (elementData, currentComponentName, index) => {
    this.setState({
      elementData,
      currentIndex: index,
      currentComponentName,
      hasElementSelected: true
    })
  }
  handleGetExports = (exportIds) => {
    this.setState({ exportIds })
  }
  handleDeselect = () => {
    this.setState({
      hasElementSelected: false
    })
  }
  handlePropsPanelLeave = () => {
    this.setState({
      elementData: null,
      currentIndex: ''
    })
  }
  handleSiderTransitionEnd = placement => {
    const { siderCollapseFlag } = this.state
    this.setState({
      siderCollapseFlag: !siderCollapseFlag
    })
  }
  render () {
    const {
      documentName, components, styles, exportSettings, images,
      pagedFrames, isMock, includeComponents, isLocal
    } = this.props
    const {
      id,
      canvasData,
      exportIds,
      elementData,
      currentIndex,
      currentComponentName,
      hasElementSelected,
      siderCollapseFlag
    } = this.state
    return (
      <div className="app-main">
        <LeftPanel
          useLocalImages={isMock || isLocal}
          images={images}
          pagedFrames={pagedFrames}
          components={components}
          includeComponents={includeComponents}
          onFrameOrComponentChange={this.handleSelectFrameOrComponent}
          onSiderTransitionEnd={() => this.handleSiderTransitionEnd('left')}
        />
        {
          canvasData &&
          <Canvas
            useLocalImages={isMock || isLocal}
            images={images}
            canvasData={canvasData}
            includeComponents={includeComponents}
            components={components}
            id={id}
            elementData={elementData}
            onSelect={this.handleSelectElement}
            onDeselect={this.handleDeselect}
            onGetExports={this.handleGetExports}
            siderCollapseFlag={siderCollapseFlag}
          />
        }
        <RightPanels
          useLocalImages={isMock || isLocal}
          styles={styles}
          exportSettings={exportSettings}
          documentName={documentName}
          elementData={elementData}
          currentComponentName={currentComponentName}
          currentExportIds={exportIds}
          currentIndex={currentIndex}
          hasElementSelected={hasElementSelected}
          onPropsPanelLeave={this.handlePropsPanelLeave}
          onSiderTransitionEnd={() => this.handleSiderTransitionEnd('right')}
        />
      </div>
    )
  }
}
