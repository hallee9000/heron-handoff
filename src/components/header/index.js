import React, { createRef } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Download, Settings } from 'react-feather'
import { asyncForEach, toDataURL } from 'utils/helper'
import { getSourceCode, getBufferData } from 'api'
import './header.scss'

class Header extends React.Component {
  img = createRef()
  handleDownload = async () => {
    const { data, documentName } = this.props
    const zip = new JSZip()
    console.log('开始')
    // generate html
    const indexSource = await getSourceCode(window.location.href)
    zip.file('index.html', indexSource.replace('var FILE_DATA=""', `var FILE_DATA = ${JSON.stringify(data)}`))

    console.log('html done')
    // generate js
    const js = zip.folder("static/js")
    const scripts = document.getElementsByTagName('script')
    await asyncForEach(scripts, async script => {
      const jsSource = await getSourceCode(script.src)
      const pieces = script.src.split('/')
      js.file(pieces[pieces.length - 1], jsSource)
    })

    console.log('js done')
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

    console.log('css ico done')
    // generate logo.svg
    const logoData = await toDataURL(this.img.current.src)
    zip.file('logo.svg', logoData, {base64: true})

    console.log('logo done')
    // generate frame and component images
    const dataFolder = zip.folder("data")
    const { images } = this.props
    await asyncForEach(Object.keys(images), async id => {
      const imgData = await toDataURL(images[id])
      console.log(`${id} done`)
      dataFolder.file(id.replace(':', '-') + 'png', imgData, {base64: true})
    })

    console.log('images done')
    // generate zip
    zip.generateAsync({type: 'blob'})
      .then(function(content) {
        saveAs(content, `${documentName}.zip`)
      })
    console.log('done!')
  }
  hasNames = () => {
    const { pageName, frameName } = this.props
    return !!(pageName && frameName)
  }
  render () {
    const { isLocal, documentName, pageName, frameName } = this.props
    return (
      <header className="app-header">
        <img className="header-logo" src={`${process.env.PUBLIC_URL}/logo.svg`} alt="logo" ref={this.img}/>
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
          this.hasNames() && !isLocal &&
          <div className="header-operates">
            <span title="设置">
              <Settings size={14}/>
            </span>
            <span title="下载" onClick={this.handleDownload}>
              <Download size={14}/>
            </span>
          </div>
        }
      </header>
    )
  }
}

export default Header
