import React from 'react'
import LeftSider from './left'
import RightSider from './right'
import RightProps from './right/RightProps'
import Canvas from './canvas'
import 'assets/base.scss'
import './main.scss'

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    const { data } = props
    this.state = {
      canvasData: data.document.children[0].children[0],
      id: '',
      elementData: null,
      propsDissolved: true
    }
  }
  handleSelectFrameOrComponent = (currentId, pageIndex, type) => {
    const { data, components, onNamesChange } = this.props
    const { id } = this.state
    if (id===currentId) return
    const currentPage = data.document.children[pageIndex]
    const canvasData = (type==='frame' ? currentPage.children : components).find(item => item.id===currentId)
    this.setState({
      id: currentId,
      canvasData
    })
    onNamesChange && onNamesChange(currentPage.name, canvasData.name, type)
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
    const { data, components, styles, exportSettings, images, isMock, isLocal } = this.props
    const { id, canvasData, elementData, propsDissolved } = this.state
    return (
      <div className="app-main">
        <LeftSider
          useLocalImages={isMock || isLocal}
          pages={data.document.children}
          images={images}
          components={components}
          onFrameOrComponentChange={this.handleSelectFrameOrComponent}
        />
        <Canvas
          useLocalImages={isMock || isLocal}
          images={images}
          canvasData={canvasData}
          id={id}
          onSelect={this.handleSelectElement}
          onDeselect={this.handleDeselect}
        />
        <div className="main-right">
          <RightSider
            styles={styles}
            exportSettings={exportSettings}
            hasMask={!propsDissolved}
          />
          {
            elementData &&
            <RightProps
              data={elementData}
              dissolved={propsDissolved}
              onDissolveEnd={this.handleDissolveEnd}
            />
          }
        </div>
      </div>
    )
  }
}
