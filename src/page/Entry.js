import React, { createRef } from 'react'
import cn from 'classnames'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { getMockFile, getFile, getImage, withCors, getBufferData } from 'api'
import { getFileKey, trimFilePath, walkFile, asyncForEach, getFileName, getFrames } from 'utils/helper'
import { handleIndex, handleJs, handleIcoAndCSS, handleLogo } from 'utils/download'
import './entry.scss'

export default class Entry extends React.Component {
  logo = createRef()
  state = {
    fileUrl: '',
    markType: 0,
    notDouble: false,
    token: '',
		fileUrlMessage: '',
    tokenMessage: '',
    errorMessage: '',
    hasToken: false,
    isLoading: false,
    percentage: 0,
    buttonText: '生成标注'
  }
  setPercentage = (percentage, buttonText) => {
    this.setState({
      percentage,
      buttonText
    })
  }
  handleChange = e => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }
  handleScaleOptionChange = e => {
    const { checked } = e.target
    console.log(checked)
    this.setState({
      notDouble: checked
    })
  }
  validate = () => {
    const { fileUrl, token } = this.state
    const fileKey = getFileKey(fileUrl)
    if (!fileUrl) {
      this.setState({ fileUrlMessage: '请填写文件链接' })
      return false
    } else if (!fileKey) {
      this.setState({ fileUrlMessage: '文件链接格式不对啊' })
      return false
    } else {
      this.setState({ fileUrlMessage: '' })
    }
    if (!token) {
      this.setState({ tokenMessage: '请填写 Access Token' })
      return false
    } else {
      window.localStorage.setItem('figmaToken', token)
      this.setState({ tokenMessage: '' })
    }
    return true
  }
  handleSubmit = async e => {
    e.preventDefault()
    const { onGotImagesData } = this.props
    const { fileUrl, markType } = this.state
    const zip = markType===0 ? (new JSZip()) : null
    const fileKey = getFileKey(fileUrl)
    if (this.validate()) {
      this.setState({ isLoading: true })
      this.setPercentage(0, '开始获取数据……')
      const fileData = await getFile(fileKey)
      // console.log(JSON.stringify(fileData))
      // token or file error
      const hasError = this.hasError(fileData)
      if (!hasError) {
        if (zip) {
          await handleIndex(zip, fileData, () => { this.setPercentage(2, '处理 index.html ……') })
          await handleJs(zip, () => { this.setPercentage(6, '处理 Js ……') })
          await handleIcoAndCSS(zip, () => { this.setPercentage(12, '处理 CSS ……') })
          await handleLogo(zip, this.logo.current.src, () => { this.setPercentage(16, '处理 logo ……') })
        }
        // get frames' images
        const frames = getFrames(fileData.document.children)
        // get components and styles
        const { components, styles, exportSettings } = walkFile(fileData)
        const componentMetas = components.map(({id, name}) => ({id, name}))
        const allMetas = frames.concat(componentMetas)
        onGotImagesData && onGotImagesData(allMetas)
        const images = await this.getFramesAndComponents(fileKey, allMetas, zip, (index, name, length) => {
          const step = Math.floor(36/length)
          this.setPercentage(20+step*(index+1), `开始获取  ${name} ……`)
        })
        const exportings = await this.getExportingImages(fileKey, exportSettings, zip, (index, name, length) => {
          const step = Math.floor(32/length)
          this.setPercentage(60+step*(index+1), `开始获取 ${name} ……`)
        })
        if (zip) {
          // generate zip
          const documentName = fileData.name
          this.setPercentage(98, '准备生成压缩包……')
          zip.generateAsync({type: 'blob'})
            .then(content => {
              saveAs(content, `${trimFilePath(documentName)}.zip`)
              this.setPercentage(100, '离线标注已生成！')
            })
        } else {
          this.onSucceed(fileData, components, styles, exportings, images )
        }
      }
    }
  }
  gotoDemo = async e => {
    e.preventDefault()
    const fileData = await getMockFile()
    // get components and styles
    const { components, styles, exportSettings } = walkFile(fileData)
    this.onSucceed(fileData, components, styles, exportSettings)
  }
  getFramesAndComponents = async (fileKey, allMetas, zip, whenStart) => {
    const { notDouble } = this.state
    const folder = zip ? zip.folder('data') : null
    const images = {}
    await asyncForEach(allMetas, async ({id, name}, index) => {
      whenStart && whenStart(index, name, allMetas.length)
      const { images: results } = await getImage(fileKey, id, notDouble ? 1 : 2, 'png')
      images[id] = results[id]
      if (folder) {
        const imageData = await getBufferData(withCors(results[id]))
        const imageName = trimFilePath(id) + '.png'
        folder.file(imageName, imageData, {base64: true})
      }
    })
    return images
  }
  getExportingImages = async (fileKey, exportSettings, zip, whenStart) => {
    const exportsFolder = zip ? zip.folder('data/exports') : null
    const exportings = []
    await asyncForEach(exportSettings, async (exportSetting, index) => {
      const fileFormat = exportSetting.format.toLowerCase()
      const imageName = getFileName(exportSetting, index)
      whenStart && whenStart(index, imageName, exportSettings.length)
      const { images } = await getImage(
        fileKey,
        exportSetting.id,
        exportSetting.constraint.value,
        fileFormat
      )
      const imageUrl = images[exportSetting.id]
      // image url not null
      if (imageUrl) {
        if (exportsFolder) {
          const imageData = await getBufferData(withCors(imageUrl))
          exportsFolder.file(imageName, imageData, {base64: true})
        } else {
          exportings.push({
            image: imageUrl,
            ...exportSetting
          })
        }
      }
    })
    return exportings
  }
  onSucceed = (fileData, components, styles, exportSettings, imagesData ) => {
    const { onGotData } = this.props
    this.setState({
      isLoading: false
    })
    this.setPercentage(100, '资源获取成功！')
    onGotData && onGotData(fileData, components, styles, exportSettings, imagesData)
  }
  hasError = fileData => {
    if (fileData.status===403 && fileData.err==='Invalid token') {
      this.setPercentage(0, '生成标注')
      this.handleTokenError()
      return true
    } else if (fileData.status===404) {
      this.setPercentage(0, '生成标注')
      this.setState({
        isLoading: false,
        fileUrlMessage: '该文件不存在。'
      })
      return true
    }
    return false
  }
  handleTokenError = () => {
    window.localStorage.removeItem('figmaToken')
    this.setState({
      isLoading: false,
      hasToken: false,
      token: '',
      tokenMessage: '',
      errorMessage: 'token 有误，可能已被删除，请重新创建并输入。'
    })
  }
  showTokenInput = e => {
    e.preventDefault()
    this.setState({
      hasToken: false
    })
  }
  componentDidMount () {
    const figmaToken = window.localStorage.getItem('figmaToken')
    if (figmaToken) {
      this.setState({
        hasToken: true,
        token: figmaToken
      })
    }
  }
  render() {
    const { fileUrl, token, notDouble, errorMessage, fileUrlMessage, tokenMessage, hasToken, isLoading, buttonText, percentage } = this.state
    return (
      <div className="app-entry">
        <div className="form entry-container">
          <div className="form-item entry-logo">
            <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="logo" ref={this.logo}/>
          </div>
          {
            errorMessage &&
            <div className="form-error">{ errorMessage }</div>
          }
          <div className={cn('form-item', {'has-error': fileUrlMessage})}>
            <div className="item-group">
              <input
                name="fileUrl"
                className="input input-lg"
                placeholder="请输入文件链接"
                value={fileUrl}
                onChange={this.handleChange}
                onKeyUp={e => e.keyCode===13 && this.handleSubmit(e)}
              />
              <select
                name="markType"
                defaultValue={0}
                className="input input-lg"
                onChange={this.handleChange}
              >
                <option value={0}>离线标注</option>
                <option value={1}>在线标注</option>
              </select>
            </div>
            {
              fileUrlMessage &&
              <div className="help-block">{ fileUrlMessage }</div>
            }
          </div>
          <div className={cn('form-item', {'hide': !hasToken})}>
            <div className="help-block">Access Token 已保存，点<a href="#access-token" onClick={this.showTokenInput}>这里</a>修改</div>
          </div>
          <div className={cn('form-item', {'has-error': tokenMessage, 'hide': hasToken})}>
            <input
              name="token"
              className="input input-lg"
              placeholder="请输入你的 Access Token"
              value={token}
              onChange={this.handleChange}
            />
            {
              tokenMessage ?
              <div className="help-block">{ tokenMessage }</div> :
              <div className="help-block">
                <a href="https://www.figma.com/developers/api#access-tokens" target="_blank" rel="noopener noreferrer">什么是 Access Token？</a>
              </div>
            }
          </div>
          <div className="form-item entry-option">
            <label>
              <input name="notDouble" type="checkbox" checked={notDouble} onChange={this.handleScaleOptionChange}/>下载使用 1 倍图
            </label>
            <div className="help-block">默认使用 2 倍图，使用 1 倍图可以加快生成速度。</div>
          </div>
          <button
            className="btn btn-lg btn-primary btn-block"
            onClick={this.handleSubmit}
            disabled={isLoading}
          >
            <div className="entry-progress" style={{width: `${percentage}%`}}/>
            <span>{ buttonText }</span>
          </button>
          <div className="form-item form-item-centered">
            <a onClick={this.gotoDemo} href="/">查看 Demo</a>
          </div>
        </div>
      </div>
    )
  }
}
