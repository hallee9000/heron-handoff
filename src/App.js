import React from 'react'
import SettingsContext from 'contexts/SettingsContext'
import Entry from 'page/entry'
import Main from 'page/Main'
import Header from 'page/header'
import { getGlobalSettings, setGlobalSettings } from 'utils/helper'
import { DEFAULT_SETTINGS } from 'utils/const'
import 'assets/base.scss'
import './app.scss'

// 2 modes: local and online
class App extends React.Component {
  constructor(props) {
    super(props)
    // const { isModule, fileData, exportSettings, pagedFrames, settings } = props
    const { FILE_DATA, PAGED_FRAMES, SETTINGS } = window
    const mode = !!FILE_DATA ? 'local' : 'online'
    const isMock = !props.isModule
    let data = FILE_DATA || props.fileData || {},
        pagedFrames = PAGED_FRAMES || props.pagedFrames || {},
        settings = SETTINGS || props.settings || {}

    this.state = {
      mode,
      isMock,
      data,
      pagedFrames,
      components: data.components || [],
      styles: data.styles || {},
      exportSettings: data.exportSettings || props.exportSettings || [],
      includeComponents: (mode!=='local' && isMock) ? true : !!settings.includeComponents,
      // if local not show entry, if online depends on if mock
      entryVisible: mode==='local' ? false : isMock,
      names: {},
      globalSettings: this.initializeGlobalSettings(settings),
      backFromDemo: false
    }
  }
  initializeGlobalSettings = (settings) => {
    const localSettings = getGlobalSettings()
    const combinedSettings = {...DEFAULT_SETTINGS, ...settings}
    // TODO: language not recognize local
    if (!localSettings) {
      setGlobalSettings(combinedSettings)
    }
    return combinedSettings
  }
  setSettings = (name, value) => {
    setGlobalSettings(name, value, globalSettings => {
      this.setState({ globalSettings })
    })
  }
  handleDataGot = (fileData, components, styles, exportSettings, pagedFrames) => {
    this.setState({
      entryVisible: false,
      data: fileData,
      components,
      styles,
      exportSettings,
      pagedFrames
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
    const { onHeaderBack } = this.props
    if (onHeaderBack) {
      onHeaderBack()
    } else {
      this.setState({
        entryVisible: true,
        backFromDemo: true,
        names: {}
      })
    }
  }
  render () {
    const { links } = this.props
    const {
      entryVisible, mode, isMock, includeComponents, data, components, styles,
      exportSettings, pagedFrames, names, globalSettings, backFromDemo
    } = this.state
    return (
      <div className="app-container">
        <SettingsContext.Provider value={{globalSettings, changeGlobalSettings: this.setSettings}}>
          <Header
            mode={mode}
            onBack={this.handleBack}
            links={links||{}}
            {...names}
          />
        </SettingsContext.Provider>
        {
          entryVisible ?
          <SettingsContext.Provider value={{globalSettings, changeGlobalSettings: this.setSettings}}>
            <Entry
              onDataGot={this.handleDataGot}
              onComponentsOptionChange={this.handleComponentsOptionChange}
              backFromDemo={backFromDemo}
            />
          </SettingsContext.Provider> :
          <SettingsContext.Provider value={{globalSettings, changeGlobalSettings: this.setSettings}}>
            <Main
              mode={mode}
              isMock={isMock}
              includeComponents={includeComponents}
              data={data}
              components={components}
              styles={styles}
              exportSettings={exportSettings}
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
