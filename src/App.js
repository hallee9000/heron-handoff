import React from 'react'
import SettingsContext from 'contexts/SettingsContext'
import Entry from 'page/entry'
import Main from 'page/Main'
import Header from 'page/header'
import { walkFile, getFlattedFrames, getGlobalSettings, setGlobalSettings } from 'utils/helper'
import { DEFAULT_SETTINGS } from 'utils/const'
import 'assets/base.scss'
import './app.scss'

class App extends React.Component {
  constructor(props) {
    super(props)
    let data = {}, components = [], styles = {}, exportSettings = {}, pagedFrames = {},
      isLocal = false, includeComponents = false, entryVisible
    const { FILE_DATA, PAGED_FRAMES, INCLUDE_COMPONENTS } = window
    const frames = getFlattedFrames(PAGED_FRAMES)
    if (FILE_DATA) {
      // local data (offline mode)
      data = FILE_DATA
      const parsedData = walkFile(data, frames)
      components = parsedData.components
      styles = parsedData.styles
      exportSettings = parsedData.exportSettings
      pagedFrames = PAGED_FRAMES
      isLocal = true
      includeComponents = INCLUDE_COMPONENTS
      entryVisible = false
    } else {
      entryVisible = true
    }
    this.state = {
      isLocal,
      isMock: false,
      includeComponents,
      entryVisible,
      data,
      components,
      styles,
      exportSettings,
      images: {},
      names: {},
      pagedFrames,
      globalSettings: this.initializeGlobalSettings()
    }
  }
  initializeGlobalSettings = () => {
    const localSettings = getGlobalSettings()
    if (localSettings) {
      return localSettings
    } else {
      setGlobalSettings(DEFAULT_SETTINGS)
      return DEFAULT_SETTINGS
    }
  }
  setSettings = (name, value) => {
    setGlobalSettings(name, value, globalSettings => {
      this.setState({ globalSettings })
    })
  }
  handleDataGot = (fileData, components, styles, exportSettings, pagedFrames, imagesData) => {
    this.setState({
      entryVisible: false,
      data: fileData,
      components,
      styles,
      exportSettings,
      pagedFrames,
      images: imagesData,
      isMock: !imagesData
    })
  }
  handleComponentsOptionChange = includeComponents => {
    this.setState({ includeComponents })
  }
  getNames = (frameName, pageName) => {
    const { data } = this.state
    this.setState({
      names: {
        documentName: data.name,
        pageName: pageName || data.document.children[0].name,
        frameName: frameName || data.document.children[0].children[0].name,
        isComponent: !pageName
      }
    })
  }
  handleBack = () => {
    this.setState({
      entryVisible: true,
      names: {}
    })
  }
  render () {
    const {
      entryVisible, isLocal, isMock, includeComponents, data, components, styles,
      exportSettings, images, pagedFrames, names, globalSettings
    } = this.state
    return (
      <div className="app-container">
        <SettingsContext.Provider value={{globalSettings, changeGlobalSettings: this.setSettings}}>
          <Header
            data={data}
            images={images}
            pagedFrames={pagedFrames}
            exportSettings={exportSettings}
            isMock={isMock}
            includeComponents={includeComponents}
            isLocal={isLocal}
            onBack={this.handleBack}
            entryVisible={entryVisible}
            {...names}
          />
        </SettingsContext.Provider>
        {
          entryVisible ?
          <SettingsContext.Provider value={{globalSettings, changeGlobalSettings: this.setSettings}}>
            <Entry
              onDataGot={this.handleDataGot}
              onComponentsOptionChange={this.handleComponentsOptionChange}
            />
          </SettingsContext.Provider> :
          <SettingsContext.Provider value={{globalSettings, changeGlobalSettings: this.setSettings}}>
            <Main
              isLocal={isLocal}
              isMock={isMock}
              includeComponents={includeComponents}
              data={data}
              components={components}
              styles={styles}
              exportSettings={exportSettings}
              images={images}
              pagedFrames={pagedFrames}
              onNamesChange={this.getNames}
              {...names}
            />
          </SettingsContext.Provider>
        }
      </div>
    )
  }
}

export default App
