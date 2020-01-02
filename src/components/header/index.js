import React, { Fragment, createRef } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Download, Settings } from 'react-feather'
import Overlay from './Overlay'
import { asyncForEach } from 'utils/helper'
import { getSourceCode, getBufferData } from 'api'
import './header.scss'

export default class Header extends React.Component {
  img = createRef()
  state = {
    loaderWidth: 0,
    loaderMessage: '',
    visible: false
  }
  handleDownload = async () => {
    const { data, documentName } = this.props
    const zip = new JSZip()

    // generate html
    this.setLoader(3, '离线标注：生成 index.html……')
    const indexSource = await getSourceCode(window.location.href)
    zip.file('index.html', indexSource.replace('var FILE_DATA=""', `var FILE_DATA = ${JSON.stringify(data)}`))

    // generate js
    this.setLoader(8, '离线标注：生成 js 文件……')
    const js = zip.folder("static/js")
    const scripts = document.getElementsByTagName('script')
    await asyncForEach(scripts, async script => {
      const jsSource = await getSourceCode(script.src)
      const pieces = script.src.split('/')
      js.file(pieces[pieces.length - 1], jsSource)
    })

    // generate ico and css
    this.setLoader(15, `离线标注：生成 css 文件……`)
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

    // generate logo.svg
    this.setLoader(26, `离线标注：生成 logo.svg……`)
    const logoData = await getBufferData(this.img.current.src)
    zip.file('logo.svg', logoData, {base64: true})

    // generate frame and component images
    this.setLoader(28, `离线标注：生成图片……`)
    const { images } = this.props
    const ids = Object.keys(images)
    const dataFolder = zip.folder("data")
    await asyncForEach(ids, async (id, index) => {
      const imgData = await getBufferData(`https://figma-handoff-cors.herokuapp.com/${images[id]}`)
      const imgName = id.replace(':', '-') + '.png'
      this.setLoader(28+(index+1)*Math.floor(70/ids.length), `离线标注：生成 ${imgName}……`)
      dataFolder.file(imgName, imgData, {base64: true})
    })

    // generate zip
    this.setLoader(98, '离线标注：生成压缩包……')
    zip.generateAsync({type: 'blob'})
      .then(function(content) {
        saveAs(content, `${documentName}.zip`)
      })
    this.setLoader(100, '离线标注：完成！')
    this.toggleModal()
  }
  setLoader = (percentage, message) => {
    this.setState({
      loaderWidth: percentage,
      loaderMessage: message
    })
  }
  hasNames = () => {
    const { pageName, frameName } = this.props
    return !!(pageName && frameName)
  }
  toggleModal = () => {
    const { visible } = this.state
    this.setState({
      visible: !visible
    })
    if (visible) {
      this.setLoader(0, '')
    }
  }
  render () {
    const { isLocal, documentName, pageName, frameName, isComponent } = this.props
    const { loaderWidth, loaderMessage, visible } = this.state
    return (
      <header className="app-header">
        <img className="header-logo" src={`${process.env.PUBLIC_URL}/logo.svg`} alt="logo" ref={this.img}/>
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
        {
          this.hasNames() && !isLocal &&
          <div className="header-operates">
            <span title="设置" onClick={this.toggleModal}>
              <Settings size={14}/>
            </span>
            <span title="生成离线标注" onClick={this.handleDownload}>
              <Download size={14}/>
            </span>
          </div>
        }
        <span className="header-loader" style={{width: `${loaderWidth}%`}}/>
        <Overlay visible={visible} onClose={this.toggleModal}>
          <h4><span role="img" aria-label="Congratulations">🎉</span> 离线标注导出成功！</h4>
          <p>你的离线标注已经导出成功，可以直接发送给开发，或者部署在自己的服务器中。</p>
        </Overlay>
      </header>
    )
  }
}
