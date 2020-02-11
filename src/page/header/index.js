import React, { Fragment, createRef } from 'react'
import cn from 'classnames'
import { withTranslation } from 'react-i18next'
import { Download, Settings, HelpCircle, ChevronLeft } from 'react-feather'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import SettingsContext from 'contexts/SettingsContext'
import Overlay from './Overlay'
import GlobalSettings from './Settings'
import Exported from './Exported'
import { handleIndex, handleJs, handleIcoAndCSS, handleLogo, handleFramesAndComponents, handleExports } from 'utils/download'
import { trimFilePath } from 'utils/helper'
import './header.scss'

class Header extends React.Component {
  logo = createRef()
  state = {
    loaderWidth: 0,
    loaderMessage: '',
    isExported: false
  }
  handleDownload = async () => {
    const { data, images, exportSettings, pagedFrames, documentName, t } = this.props
    const zip = new JSZip()
    
    
    await handleIndex(zip, data, pagedFrames, () => { this.setLoader(3, t('dealing with', {name: 'index.html'})) })
    await handleJs(zip, () => { this.setLoader(8, t('dealing with', {name: 'Js'})) })
    await handleIcoAndCSS(zip, () => { this.setLoader(12, t('dealing with', {name: 'CSS'})) })
    await handleLogo(zip, this.logo.current.src, () => { this.setLoader(16, t('dealing with', {name: 'logo'})) })
    await handleFramesAndComponents(zip, images, (index, name, length) => {
      this.setLoader(18+(index+1)*Math.floor(36/length), t('generating', {name}))
    })
    await handleExports(zip, exportSettings, (index, name, length) => {
      this.setLoader(54+(index+1)*Math.floor(36/length), t('generating', {name}))
    })
    // generate zip
    this.setLoader(92, t('generating zip'))
    zip.generateAsync({type: 'blob'})
      .then(content => {
        saveAs(content, `${trimFilePath(documentName)}.zip`)
        this.setLoader(100, t('marked zip downloaded'))
        this.toggleExportedOverlay()
      })
  }
  setLoader = (loaderWidth, loaderMessage) => {
    this.setState({
      loaderWidth,
      loaderMessage
    })
  }
  hasNames = () => {
    const { pageName, frameName } = this.props
    return !!(pageName && frameName)
  }
  toggleExportedOverlay = () => {
    const { isExported } = this.state
    this.setState({
      isExported: !isExported
    })
    if (isExported) {
      this.setLoader(0, '')
    }
  }
  componentDidMount () {
    // close exported message when clicking other places
    document.addEventListener('click', e => {
      const { isExported } = this.state
      if (isExported) {
        e.preventDefault()
        this.toggleExportedOverlay()
      }
    })
  }
  render () {
    const { isLocal, isMock, documentName, pageName, frameName, isComponent, onBack, t } = this.props
    const { loaderWidth, loaderMessage, isExported } = this.state
    const logoHidden = this.hasNames() && !isLocal
    return (
      <header className="app-header">
        <span className={cn('header-back', {'hide': !logoHidden})} onClick={onBack}>
          <ChevronLeft size={24}/>
        </span>
        <a
          className={cn({'hide': logoHidden})}
          href="https://figmacn.com/handoff/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="header-logo" src={`${process.env.PUBLIC_URL}/logo.svg`} alt="logo" ref={this.logo}/>
        </a>
        <span className="header-filename">{documentName}</span>
        <span className="header-space"/>
        {
          this.hasNames() ?
          <span className="header-pagename">
            {
              loaderWidth===0 ?
              <Fragment>
                {
                  !isComponent &&
                  <Fragment>{pageName}<span> / </span></Fragment>
                }
                {frameName}
              </Fragment> :
              loaderMessage
            }
          </span> :
          <span className="header-pagename">Figma Handoff</span>
        }
        <div className="header-operates">
          {
            this.hasNames() &&
            <Overlay
              overlay={
                <SettingsContext.Consumer>
                  {({globalSettings, changeGlobalSettings}) => (
                    <GlobalSettings
                      globalSettings={globalSettings}
                      onSettingsChange={changeGlobalSettings}
                    />
                  )}
                </SettingsContext.Consumer>
              }
              overlayClassName="header-overlay header-overlay-settings"
            >
              <span title={t('settings')}>
                <Settings size={14}/>
              </span>
            </Overlay>
          }
          <a title={t('help')} href="https://github.com/leadream/figma-handoff#简介" target="_blank" rel="noopener noreferrer">
            <HelpCircle size={14}/>
          </a>
          {
            this.hasNames() && !isLocal && !isMock &&
            <Overlay
              visible={isExported}
              overlay={<Exported/>}
              align={{
                offset: [-6, -10]
              }}
              overlayClassName="header-overlay header-overlay-exported"
            >
              <span title={t('generate marked zip')} onClick={this.handleDownload}>
                <Download size={14}/>
              </span>
            </Overlay>
          }
        </div>
        <span className="header-loader" style={{width: `${loaderWidth}%`}}/>
      </header>
    )
  }
}

export default withTranslation('header')(Header)
