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
      elementData: null,
      propsDissolved: true
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
  handleSelectElement = elementData => {
    this.setState({
      elementData,
      propsDissolved: false
    })
  }
  handleDeselect = () => {
    this.setState({ propsDissolved: true })
  }
  handleDissolveEnd = () => {
    this.setState({ elementData: null })
  }
  render () {
    const { documentName, components, styles, exportSettings, images, pagedFrames, isMock, isLocal } = this.props
    const { id, canvasData, elementData, propsDissolved } = this.state
    return (
      <div className="app-main">
        <LeftSider
          useLocalImages={isMock || isLocal}
          images={images}
          pagedFrames={pagedFrames}
          components={components}
          onFrameOrComponentChange={this.handleSelectFrameOrComponent}
        />
        {
          canvasData &&
          <Canvas
            useLocalImages={isMock || isLocal}
            images={images}
            canvasData={canvasData}
            id={id}
            propsDissolved={propsDissolved}
            onSelect={this.handleSelectElement}
            onDeselect={this.handleDeselect}
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
              styles={styles}
              components={components}
              exportSettings={exportSettings}
              dissolved={propsDissolved}
              onDissolveEnd={this.handleDissolveEnd}
            />
          }
        </div>
      </div>
    )
  }
}
