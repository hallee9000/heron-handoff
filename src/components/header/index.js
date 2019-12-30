import React from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Download, Settings } from 'react-feather'
import { asyncForEach } from 'utils/helper'
import { getSourceCode, getBufferData } from 'api'
import './header.scss'

class Header extends React.Component {
  handleDownload = async () => {
    const { data, documentName } = this.props
    const zip = new JSZip()

    // generate html
    const indexSource = await getSourceCode(window.location.href)
    zip.file('index.html', indexSource.replace('var FILE_DATA = ""', `var FILE_DATA = ${JSON.stringify(data)}`))

    // generate js
    const js = zip.folder("static/js")
    const scripts = document.getElementsByTagName('script')
    await asyncForEach(scripts, async script => {
      const jsSource = await getSourceCode(script.src)
      const pieces = script.src.split('/')
      js.file(pieces[pieces.length - 1], jsSource)
    })

    // generate ico and css
    const css = zip.folder("static/css")
    const styles = document.getElementsByTagName('link')
    await asyncForEach(styles, async style => {
      if (style.rel==='icon') {
        const iconSource = await getBufferData(style.href)
        zip.file('favicon.ico', iconSource, {base64: true})
      } else if (style.rel==='stylesheet') {
        const cssSource = await getSourceCode(style.href)
        const pieces = style.href.split('/')
        css.file(pieces[pieces.length - 1], cssSource)
      }
    })

    // generate zip
    zip.generateAsync({type: 'blob'})
      .then(function(content) {
        saveAs(content, `${documentName}.zip`)
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
        <img className="header-logo" src={`${process.env.PUBLIC_URL}/logo.svg`} alt="logo"/>
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
