import React from 'react'
import LeftSider from './left'
import RightSider from './right'
import RightProps from './right/RightProps'
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
      currentComponentName: '',
      propsDissolved: true,
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
      currentComponentName,
      propsDissolved: false,
      currentIndex: index
    })
  }
  handleGetExports = (exportIds) => {
    this.setState({ exportIds })
  }
  handleDeselect = () => {
    this.setState({
      propsDissolved: true,
      currentIndex: ''
    })
  }
  handleDissolveEnd = () => {
    this.setState({ elementData: null })
  }
  render () {
    const {
      documentName, components, styles, exportSettings, images,
      pagedFrames, isMock, includeComponents, isLocal
    } = this.props
    const { id, canvasData, exportIds, elementData, currentIndex, currentComponentName, propsDissolved } = this.state
    return (
      <div className="app-main">
        <LeftSider
          useLocalImages={isMock || isLocal}
          images={images}
          pagedFrames={pagedFrames}
          components={components}
          includeComponents={includeComponents}
          onFrameOrComponentChange={this.handleSelectFrameOrComponent}
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
            propsDissolved={propsDissolved}
            onSelect={this.handleSelectElement}
            onDeselect={this.handleDeselect}
            onGetExports={this.handleGetExports}
          />
        }
        <div className="main-right">
          <RightSider
            useLocalImages={isMock || isLocal}
            styles={styles}
            exportSettings={exportSettings}
            hasMask={!propsDissolved}
            documentName={documentName}
          />
          {
            elementData &&
            <RightProps
              useLocalImages={isMock || isLocal}
              data={elementData}
              currentComponentName={currentComponentName}
              styles={styles}
              exportSettings={exportSettings}
              currentExportIds={exportIds}
              currentIndex={currentIndex}
              dissolved={propsDissolved}
              onDissolveEnd={this.handleDissolveEnd}
            />
          }
        </div>
      </div>
    )
  }
}
