import React from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Download, Settings } from 'react-feather'
import './header.scss'

class Header extends React.Component {
  handleDownload = () => {
    var zip = new JSZip()
    zip.file("点开我，小宝贝.txt", "傻瓜，你还真的下载哦！\n")
    var img = zip.folder("images")
    img.file("figma.svg", btoa('<svg width="48" height="72" viewBox="0 0 48 72" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 36C24 32.8174 25.2643 29.7652 27.5147 27.5147C29.7652 25.2643 32.8174 24 36 24C39.1826 24 42.2348 25.2643 44.4853 27.5147C46.7357 29.7652 48 32.8174 48 36C48 39.1826 46.7357 42.2348 44.4853 44.4853C42.2348 46.7357 39.1826 48 36 48C32.8174 48 29.7652 46.7357 27.5147 44.4853C25.2643 42.2348 24 39.1826 24 36Z" fill="#1ABCFE"/></svg>'), {base64: true})
    zip.generateAsync({type:"blob"})
      .then(function(content) {
        // see FileSaver.js
        saveAs(content, "figma-handoff.zip")
      })
  }
  render () {
    const { name } = this.props
    return (
      <header className="app-header">
        <img className="header-logo" src="/logo.png" alt="logo"/>
        <span className="header-name">{name}</span>
        <div className="header-operates">
          <span title="设置">
            <Settings size={14}/>
          </span>
          <span title="下载">
            <Download size={14} onClick={this.handleDownload}/>
          </span>
        </div>
      </header>
    )
  }
}

export default Header
