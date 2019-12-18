import React from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Download } from 'react-feather'
import './header.scss'

class Header extends React.Component {
  handleDownload = () => {
    var zip = new JSZip()
    zip.file("点开我，小宝贝.txt", "傻瓜，你还真的下载哦！\n")
    var img = zip.folder("images")
    img.file("figma.svg", btoa('<svg width="48" height="72" viewBox="0 0 48 72" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 36C24 32.8174 25.2643 29.7652 27.5147 27.5147C29.7652 25.2643 32.8174 24 36 24C39.1826 24 42.2348 25.2643 44.4853 27.5147C46.7357 29.7652 48 32.8174 48 36C48 39.1826 46.7357 42.2348 44.4853 44.4853C42.2348 46.7357 39.1826 48 36 48C32.8174 48 29.7652 46.7357 27.5147 44.4853C25.2643 42.2348 24 39.1826 24 36Z" fill="#1ABCFE"/><path d="M0 60C0 56.8174 1.26428 53.7652 3.51472 51.5147C5.76515 49.2643 8.8174 48 12 48H24V60C24 63.1826 22.7357 66.2348 20.4853 68.4853C18.2348 70.7357 15.1826 72 12 72C8.8174 72 5.76515 70.7357 3.51472 68.4853C1.26428 66.2348 0 63.1826 0 60H0Z" fill="#0ACF83"/><path d="M24 0V24H36C39.1826 24 42.2348 22.7357 44.4853 20.4853C46.7357 18.2348 48 15.1826 48 12C48 8.8174 46.7357 5.76515 44.4853 3.51472C42.2348 1.26428 39.1826 0 36 0L24 0Z" fill="#FF7262"/><path d="M0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76515 22.7357 8.8174 24 12 24H24V0H12C8.8174 0 5.76515 1.26428 3.51472 3.51472C1.26428 5.76515 0 8.8174 0 12H0Z" fill="#F24E1E"/><path d="M0 36C0 39.1826 1.26428 42.2348 3.51472 44.4853C5.76515 46.7357 8.8174 48 12 48H24V24H12C8.8174 24 5.76515 25.2643 3.51472 27.5147C1.26428 29.7652 0 32.8174 0 36H0Z" fill="#A259FF"/></svg>'), {base64: true})
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
        <Download size={16} onClick={this.handleDownload}/>
      </header>
    )
  }
}

export default Header
