import React from 'react'
import Header from 'components/Header'
import LeftSider from 'components/LeftSider'
import RightSider from 'components/RightSider'
import RightProps from 'components/RightProps'
import Canvas from 'components/canvas'
import data from 'mock/file'
import 'assets/base.scss'
import './app.scss'

class App extends React.Component {
  state = {
    pageData: data.document,
    frameData: data.document.children[0].children[0],
    name: data.document.children[0].children[0].name,
    frameId: '',
    elementData: null,
    propsDissolved: true
  }
  handleSelectPage = currentFrameId => {
    const { pageData, frameId } = this.state
    if (frameId===currentFrameId) return
    const frameData = pageData.children[0].children
      .find(frame => frame.id===currentFrameId)
    this.setState({
      frameId: currentFrameId,
      frameData,
      name: frameData.name
    })
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
    const { pageData, name, frameId, frameData, elementData, propsDissolved } = this.state
    return (
      <div className="app-container">
        <Header
          name={name}
        />
        <div className="app-main">
          <LeftSider
            pageData={pageData}
            onSelect={this.handleSelectPage}
          />
          <Canvas
            frameData={frameData}
            frameId={frameId}
            onSelect={this.handleSelectElement}
            onDeselect={this.handleDeselect}
          />
          <div className="main-right">
            <RightSider hasMask={!propsDissolved}/>
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
      </div>
    )
  }
}

export default App
