import React from 'react'
import Header from 'components/Header'
import LeftSider from 'components/LeftSider'
import Canvas from 'components/Canvas'
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
    frameId: ''
  }
  handleSelect = (frameId) => {
    const { pageData } = this.state
    const frameData = pageData.children[0].children
      .find(frame => frame.id===frameId)
    this.setState({
      frameId,
      frameData,
      name: frameData.name
    })
  }
  componentDidMount () {
  }
  render () {
    const { pageData, name, frameId, frameData } = this.state
    return (
      <div className="app-container">
        <Header
          name={name}
        />
        <div className="app-main">
          <LeftSider
            pageData={pageData}
            onSelect={this.handleSelect}
          />
          <Canvas
            frameData={frameData}
            frameId={frameId}
          />
        </div>
      </div>
    )
  }
}

export default App
