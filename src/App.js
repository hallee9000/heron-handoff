import React from 'react'
import Header from 'components/Header'
import LeftSider from 'components/LeftSider'
import Canvas from 'components/Canvas'
import data from 'mock/file'
import 'assets/base.scss'
import 'assets/input.scss'
import './app.scss'

class App extends React.Component {
  state = {
    pageData: data.document,
    name: data.name
  }
  componentDidMount () {
  }
  render () {
    const { pageData, name } = this.state
    return (
      <div className="app-container">
        <Header pageData={pageData}/>
        <div className="app-main">
          <LeftSider pageData={pageData}/>
          <Canvas name={name} pageData={pageData}/>
        </div>
      </div>
    )
  }
}

export default App
