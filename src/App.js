import React from 'react'
import Header from 'components/Header'
import LeftSider from 'components/LeftSider'
import RightSider from 'components/RightSider'
import Canvas from 'components/canvas'
import data from 'mock/file'
import 'assets/base.scss'
import 'assets/utils.scss'
import 'assets/input.scss'
import './app.scss'

class App extends React.Component {
  state = {
    pageData: data.document,
    frameData: data.document.children[0].children[0],
    name: data.document.children[0].children[0].name,
    frameId: '',
    elementData: null,
    rightVisible: false
  }
  onRightSiderMount = () => {
    this.setState({ rightVisible: true })
  }
  handleSelectPage = frameId => {
    const { pageData } = this.state
    const frameData = pageData.children[0].children
      .find(frame => frame.id===frameId)
    this.setState({
      frameId,
      frameData,
      name: frameData.name
    })
  }
  handleSelectElement = elementData => {
    this.setState({ elementData })
  }
  render () {
    const { pageData, name, frameId, frameData, elementData, rightVisible } = this.state
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
            rightVisible={rightVisible}
            frameData={frameData}
            frameId={frameId}
            onSelect={this.handleSelectElement}
          />
          {
            elementData &&
            <RightSider
              data={elementData}
              onMount={this.onRightSiderMount}
            />
          }
        </div>
      </div>
    )
  }
}

export default App
