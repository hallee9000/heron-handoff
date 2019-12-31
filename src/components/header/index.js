import React, { Fragment, createRef } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Download, Settings } from 'react-feather'
import { asyncForEach } from 'utils/helper'
import { getSourceCode, getBufferData } from 'api'
import './header.scss'

class Header extends React.Component {
  img = createRef()
  state = {
    loaderWidth: 0,
    loaderMessage: ''
  }
  handleDownload = async () => {
    const { data, documentName } = this.props
    const zip = new JSZip()
    this.setLoader(1, '处理 index.html')
    // generate html
    const indexSource = await getSourceCode(window.location.href)
    zip.file('index.html', indexSource.replace('var FILE_DATA=""', `var FILE_DATA = ${JSON.stringify(data)}`))

    this.setLoader(3, '处理 js 文件')
    // generate js
    const js = zip.folder("static/js")
    const scripts = document.getElementsByTagName('script')
    await asyncForEach(scripts, async script => {
      const jsSource = await getSourceCode(script.src)
      const pieces = script.src.split('/')
      js.file(pieces[pieces.length - 1], jsSource)
    })

    this.setLoader(15, `处理 css 文件`)
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

    this.setLoader(26, `处理 logo.svg`)
    // generate logo.svg
    const logoData = await getBufferData(this.img.current.src)
    zip.file('logo.svg', logoData, {base64: true})

    this.setLoader(28, `处理图片`)
    // generate frame and component images
    const { images } = this.props
    const dataFolder = zip.folder("data")
    await asyncForEach(Object.keys(images), async (id, index) => {
      const imgData = await getBufferData(`https://cors-anywhere.herokuapp.com/${images[id]}`)
      this.setLoader(28+index*3, `${id}.png 完成`)
      dataFolder.file(id.replace(':', '-') + '.png', imgData, {base64: true})
    })

    this.setLoader(98, '生成压缩包')
    // generate zip
    zip.generateAsync({type: 'blob'})
      .then(function(content) {
        saveAs(content, `${documentName}.zip`)
      })
    this.setLoader(100, `完成`)
  }
  setLoader = (percentage, message) => {
    this.setState({
      percentage,
      message
    })
  }
  hasNames = () => {
    const { pageName, frameName } = this.props
    return !!(pageName && frameName)
  }
  render () {
    const { isLocal, documentName, pageName, frameName, loaderWidth, loaderMessage } = this.props
    return (
      <header className="app-header">
        <img className="header-logo" src={`${process.env.PUBLIC_URL}/logo.svg`} alt="logo" ref={this.img}/>
        <span className="header-filename">{documentName}</span>
        <span className="header-space"/>
        {
          this.hasNames() ?
          <span className="header-pagename">
            {
              (loaderWidth===0 || loaderWidth===100) ?
              <Fragment>{pageName}<span> / </span>{frameName}</Fragment> :
              loaderMessage
            }
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
        <span className="header-loader" style={{width: `${loaderWidth}%`}}/>
      </header>
    )
  }
}

export default Header
