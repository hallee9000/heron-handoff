import React, { Fragment, createRef } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Download, Settings, HelpCircle } from 'react-feather'
import { handleIndex, handleJs, handleIcoAndCSS, handleLogo, handleFramesAndComponents, handleExports } from 'utils/download'
import { trimFilePath } from 'utils/helper'
import Overlay from './Overlay'
import './header.scss'

export default class Header extends React.Component {
  logo = createRef()
  state = {
    loaderWidth: 0,
    loaderMessage: '',
    downloadVisible: false,
    settingVisible: false
  }
  handleDownload = async () => {
    const { data, images, imageMetas, exportSettings, documentName } = this.props
    const zip = new JSZip()

    await handleIndex(zip, data, () => { this.setLoader(3, '开始处理 index.html ……') })
    await handleJs(zip, () => { this.setLoader(8, '开始处理 Js ……') })
    await handleIcoAndCSS(zip, () => { this.setLoader(12, '开始处理 CSS ……') })
    await handleLogo(zip, this.logo.current.src, () => { this.setLoader(16, '开始处理 logo ……') })
    await handleFramesAndComponents(zip, images, imageMetas, (index, name, length) => {
      this.setLoader(18+(index+1)*Math.floor(36/length), `开始生成 ${name}……`)
    })
    await handleExports(zip, exportSettings, (index, name, length) => {
      this.setLoader(54+(index+1)*Math.floor(36/length), `开始生成 ${name}……`)
    })
    // generate zip
    this.setLoader(92, '开始生成压缩包……')
    zip.generateAsync({type: 'blob'})
      .then(content => {
        saveAs(content, `${trimFilePath(documentName)}.zip`)
        this.setLoader(100, '离线标注文件已生成！')
        this.toggleDownloadModal()
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
  toggleSettingModal = () => {
    const { settingVisible } = this.state
    this.setState({
      settingVisible: !settingVisible
    })
  }
  toggleDownloadModal = () => {
    const { downloadVisible } = this.state
    this.setState({
      downloadVisible: !downloadVisible
    })
    if (downloadVisible) {
      this.setLoader(0, '')
    }
  }
  render () {
    const { isLocal, documentName, pageName, frameName, isComponent } = this.props
    const { loaderWidth, loaderMessage, settingVisible, downloadVisible } = this.state
    return (
      <header className="app-header">
        <img className="header-logo" src={`${process.env.PUBLIC_URL}/logo.svg`} alt="logo" ref={this.logo}/>
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
            <span title="设置" onClick={this.toggleSettingModal}>
              <Settings size={14}/>
            </span>
          }
          <a title="获取帮助" href="https://github.com/leadream/figma-handoff" target="_blank" rel="noopener noreferrer">
            <HelpCircle size={14}/>
          </a>
          {
            this.hasNames() && !isLocal &&
            <span title="生成离线标注" onClick={this.handleDownload}>
              <Download size={14}/>
            </span>
          }
        </div>
        <span className="header-loader" style={{width: `${loaderWidth}%`}}/>
        <Overlay visible={settingVisible} caretRight={46} onClose={this.toggleSettingModal}>
          <h4><span role="img" aria-label="Congratulations">⚙️</span> 设置</h4>
          <p>还没做呢，惊喜吧？</p>
          <p>还没做呢，惊喜吧？</p>
          <p>还没做呢，惊喜吧？</p>
          <p>还没做呢，惊喜吧？</p>
          <p>还没做呢，惊喜吧？</p>
          <p>还没做呢，惊喜吧？</p>
          <p>还没做呢，惊喜吧？</p>
        </Overlay>
        <Overlay visible={downloadVisible} onClose={this.toggleDownloadModal}>
          <h4><span role="img" aria-label="Congratulations">🎉</span> 离线标注导出成功！</h4>
          <p>你的离线标注已经导出成功，可以直接发送给开发，或者部署在自己的服务器中。</p>
        </Overlay>
      </header>
    )
  }
}
