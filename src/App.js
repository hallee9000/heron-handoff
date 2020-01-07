import React from 'react'
import Entry from 'page/Entry'
import Main from 'page/Main'
import Header from 'page/header'
import { walkFile } from 'utils/helper'
import 'assets/base.scss'
import './app.scss'

class App extends React.Component {
  constructor(props) {
    super(props)
    let data = {}, components = [], styles = {}, exportSettings = {}, isLocal = false, entryVisible
    const { FILE_DATA } = window
    if (FILE_DATA) {
      // local data (offline mode)
      data = FILE_DATA
      const parsedData = walkFile(data)
      components = parsedData.components
      styles = parsedData.styles
      exportSettings = parsedData.exportSettings
      isLocal = true
      entryVisible = false
    } else {
      entryVisible = true
    }
    this.state = {
      isLocal,
      isMock: false,
      entryVisible,
      data,
      components,
      styles,
      exportSettings,
      images: {},
      names: {}
    }
  }
  handleDataGot = (fileData, components, styles, exportSettings, imagesData) => {
    this.setState({
      entryVisible: false,
      data: fileData,
      components,
      styles,
      exportSettings,
      images: imagesData,
      isMock: !imagesData
    })
  }
  getNames = (pageName, frameName, type) => {
    const { data } = this.state
    this.setState({
      names: {
        documentName: data.name,
        pageName: pageName || data.document.children[0].name,
        frameName: frameName || data.document.children[0].children[0].name,
        isComponent: type==='component'
      }
    })
  }
  render () {
    const { entryVisible, isLocal, isMock, data, components, styles, exportSettings, images, names } = this.state
    return (
      <div className="app-container">
        <Header {...names} data={data} images={images} isLocal={isLocal}/>
        {
          entryVisible ?
          <Entry
            onGotData={this.handleDataGot}
          /> :
          <Main
            isLocal={isLocal}
            isMock={isMock}
            data={data}
            components={components}
            styles={styles}
            exportSettings={exportSettings}
            images={images}
            onNamesChange={this.getNames}
          />
        }
      </div>
    )
  }
}

export default App
