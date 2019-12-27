import React from 'react'
import Entry from 'components/Entry'
import Main from 'components/Main'
import Header from 'components/Header'
import mockData from 'mock/file'
import 'assets/base.scss'
import './app.scss'

const isMock = false

class App extends React.Component {
  constructor(props) {
    super(props)
    let data, entryVisible
    if (isMock) {
      data = mockData
      entryVisible = false
    } else {
      const innerData = document.getElementById('data')
      if (innerData) {
        data = JSON.parse(innerData.innerText)
        entryVisible = false
      } else {
        entryVisible = true
      }
    }
    this.state = {
      entryVisible,
      data,
      images: {},
      names: {}
    }
  }
  handleDataGot = (fileData, imagesData) => {
    this.setState({
      entryVisible: false,
      data: fileData,
      images: imagesData
    })
  }
  getNames = (pageName, frameName) => {
    const { data } = this.state
    this.setState({
      names: {
        documentName: data.name,
        pageName: pageName || data.document.children[0].name,
        frameName: frameName || data.document.children[0].children[0].name
      }
    })
  }
  render () {
    const { entryVisible, data, images, names } = this.state
    return (
      <div className="app-container">
        <Header {...names}/>
        {
          entryVisible ?
          <Entry
            onGotData={this.handleDataGot}
          /> :
          <Main
            isMock={isMock}
            data={data}
            images={images}
            onNamesChange={this.getNames}
          />
        }
      </div>
    )
  }
}

export default App
