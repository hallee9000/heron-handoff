import React from 'react'
import LeftSider from 'components/left'
import RightSider from 'components/right'
import RightProps from 'components/right/RightProps'
import Canvas from 'components/canvas'
import 'assets/base.scss'
import './main.scss'

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    const { data } = props
    this.state = {
      frameData: data.document.children[0].children[0],
      frameId: '',
      elementData: null,
      propsDissolved: true
    }
  }
  handleSelectFrame = (pageIndex, currentFrameId) => {
    const { data, onNamesChange } = this.props
    const { frameId } = this.state
    if (frameId===currentFrameId) return
    const currentPage = data.document.children[pageIndex]
    const frameData = currentPage.children
      .find(frame => frame.id===currentFrameId)
    this.setState({
      frameId: currentFrameId,
      frameData
    })
    onNamesChange && onNamesChange(currentPage.name, frameData.name)
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
    const { data, styles, components, images, isMock, isLocal } = this.props
    const { frameId, frameData, elementData, propsDissolved } = this.state
    return (
      <div className="app-main">
        <LeftSider
          useLocalImages={isMock || isLocal}
          pages={data.document.children}
          images={images}
          components={components}
          onFrameChange={this.handleSelectFrame}
        />
        <Canvas
          useLocalImages={isMock || isLocal}
          images={images}
          frameData={frameData}
          frameId={frameId}
          onSelect={this.handleSelectElement}
          onDeselect={this.handleDeselect}
        />
        <div className="main-right">
          <RightSider
            styles={styles}
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
