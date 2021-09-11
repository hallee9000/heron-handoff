import React from 'react'
import LeftPanel from './left'
import RightPanels from './right'
import Canvas from './canvas'
import './main.scss'

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentImageUrl: '',
      canvasData: null,
      id: '',
      // selected layer index
      currentIndex: '',
      elementData: null,
      hasElementSelected: false,
      closestComponent: null,
      siderCollapseFlag: false,
      exportIds: []
    }
  }
  handleSelectFrameOrComponent = (currentId, currentImageUrl, pageId) => {
    const { data, components, onNamesChange } = this.props
    const { id } = this.state
    if (id===currentId) return
    const currentPage = pageId ? data.document.children.find(({id}) => id===pageId) : {}
    const canvasData = (pageId ? currentPage.children : components).find(({id}) => id===currentId)
    this.setState({
      id: currentId,
      currentImageUrl,
      canvasData
    })
    onNamesChange && onNamesChange(canvasData.name, currentPage.name)
    this.handleDeselect()
  }
  handleSelectElement = (elementData, index, closestComponent) => {
    this.setState({
      elementData,
      currentIndex: index,
      closestComponent,
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
  handleSiderTransitionEnd = e => {
    if (e.propertyName==='width') {
      const { siderCollapseFlag } = this.state
      this.setState({
        siderCollapseFlag: !siderCollapseFlag
      })
    }
  }
  render () {
    const {
      documentName, components, styles, exportSettings, versionData,
      pagedFrames, mode, isMock, includeComponents
    } = this.props
    const {
      id,
      currentImageUrl,
      canvasData,
      exportIds,
      elementData,
      currentIndex,
      closestComponent,
      hasElementSelected,
      siderCollapseFlag
    } = this.state
    return (
      <div className="app-main">
        <LeftPanel
          mode={mode}
          isMock={isMock}
          pagedFrames={pagedFrames}
          components={components}
          includeComponents={includeComponents}
          onFrameOrComponentChange={this.handleSelectFrameOrComponent}
          onSiderTransitionEnd={this.handleSiderTransitionEnd}
        />
        {
          canvasData &&
          <Canvas
            currentImageUrl={currentImageUrl}
            canvasData={canvasData}
            id={id}
            elementData={elementData}
            onSelect={this.handleSelectElement}
            onDeselect={this.handleDeselect}
            onGetExports={this.handleGetExports}
            siderCollapseFlag={siderCollapseFlag}
          />
        }
        <RightPanels
          mode={mode}
          isMock={isMock}
          styles={styles}
          exportSettings={exportSettings}
          documentName={documentName}
          elementData={elementData}
          closestComponent={closestComponent}
          currentExportIds={exportIds}
          currentIndex={currentIndex}
          versionData={versionData}
          hasElementSelected={hasElementSelected}
          onPropsPanelLeave={this.handlePropsPanelLeave}
          onSiderTransitionEnd={this.handleSiderTransitionEnd}
        />
      </div>
    )
  }
}

export default Main
