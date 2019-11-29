import React from 'react'
import LeftSider from 'components/LeftSider'
import Canvas from 'components/Canvas'
import data from 'mock/file'
import 'assets/base.less'


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
        <LeftSider pageData={pageData}/>
        <Canvas name={name} pageData={pageData}/>
      </div>
    )
  }
}

export default App
