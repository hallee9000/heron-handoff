import React from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Download, Settings } from 'react-feather'
import { asyncForEach } from 'utils/helper'
import { getSourceCode } from 'api'
import './header.scss'

class Header extends React.Component {
  handleDownload = () => {
    getSourceCode(window.location.href)
      .then(indexSource => {
        const zip = new JSZip()
        zip.file('index.html', indexSource)
        const js = zip.folder("static/js")
        const scripts = document.getElementsByTagName('script')
        asyncForEach(scripts, async script => {
          await getSourceCode(script.src)
            .then(data => {
              const pieces = script.src.split('/')
              js.file(pieces[pieces.length - 1], data)
            })
        })
        .then(() => {
          zip.generateAsync({type: 'blob'})
            .then(function(content) {
              saveAs(content, "figma-handoff.zip")
            })
        })
      })
  }
  hasNames = () => {
    const { pageName, frameName } = this.props
    return !!(pageName && frameName)
  }
  render () {
    const { documentName, pageName, frameName } = this.props
    return (
      <header className="app-header">
        <img className="header-logo" src={`${process.env.PUBLIC_URL}/logo.png`} alt="logo"/>
        <span className="header-filename">{documentName}</span>
        <span className="header-space"/>
        {
          this.hasNames() ?
          <span className="header-pagename">
            {pageName}<span> / </span>{frameName}
          </span> :
          <span className="header-pagename">Figma Handoff</span>
        }
        {
          this.hasNames() &&
          <div className="header-operates">
            <span title="设置">
              <Settings size={14}/>
            </span>
            <span title="下载">
              <Download size={14} onClick={this.handleDownload}/>
            </span>
          </div>
        }
      </header>
    )
  }
}

export default Header
