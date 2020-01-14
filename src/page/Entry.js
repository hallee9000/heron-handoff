import React from 'react'
import cn from 'classnames'
import { getMockFile, getFile, getImages, getImage } from 'api'
import { getFileKey, walkFile, asyncForEach, getFileName } from 'utils/helper'
import './entry.scss'

export default class Entry extends React.Component {
  state = {
    fileUrl: '',
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
    const { fileUrl } = this.state
    if (this.validate()) {
      const { fileUrl } = this.state
      const fileKey = getFileKey(fileUrl)
      this.setState({
        isLoading: true
      })
      this.setPercentage(0, '开始获取数据……')
      const fileData = await getFile(fileKey)
      // console.log(JSON.stringify(fileData))
      if (fileData.status===403 && fileData.err==='Invalid token') {
        this.setPercentage(0, '生成标注')
        this.onFailed()
        return
      } else if (fileData.status===404) {
        this.setPercentage(0, '生成标注')
        this.setState({
          isLoading: false,
          fileUrlMessage: '该文件不存在。'
        })
        return
      }
      // get frames' images
      const ids = fileData.document.children
        .map(page => page.children
          .filter(frame => frame.type==='FRAME')
          .map(frame => frame.id)
          .join()
        )
        .filter(frameIds => frameIds!=='')
        .join()
      // get components and styles
      const { components, styles, exportSettings } = walkFile(fileData)
      const componentIds = components.map(c => c.id).join()
      this.setPercentage(20, '开始获取图片……')
      const { images } = await getImages(fileKey, ids + (componentIds ? `,${componentIds}` : ''))
      this.setPercentage(56, '开始获取切图数据……')
      const exportings = await this.getExportingImages(fileKey, exportSettings)
      this.onSucceed(fileData, components, styles, exportings, images )
    } else if (fileUrl==='mockmock') {
      const fileData = await getMockFile()
      // get components and styles
      const { components, styles, exportSettings } = walkFile(fileData)
      this.onSucceed(fileData, components, styles, exportSettings)
    }
  }
  getExportingImages = async (fileKey, exportSettings) => {
    const exportings = []
    const step = Math.floor(30/exportSettings.length)
    let percentage = 56
    await asyncForEach(exportSettings, async (exportSetting, index) => {
      percentage += step
      const fileFormat = exportSetting.format.toLowerCase()
      this.setPercentage(percentage, `开始获取 ${getFileName(exportSetting, index)} ……`)
      const { images } = await getImage(
        fileKey,
        exportSetting.id,
        exportSetting.constraint.value,
        fileFormat
      )
      images[exportSetting.id] && exportings.push({
        image: images[exportSetting.id],
        ...exportSetting
      })
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
  onFailed = () => {
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
    const { fileUrl, token, errorMessage, fileUrlMessage, tokenMessage, hasToken, isLoading, buttonText, percentage } = this.state
    return (
      <div className="app-entry">
        <div className="form entry-container">
          <div className="form-item form-logo">
            <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="logo"/>
          </div>
          {
            errorMessage &&
            <div className="form-error">{ errorMessage }</div>
          }
          <div className={cn('form-item', {'has-error': fileUrlMessage})}>
            <input
              name="fileUrl"
              className="input input-lg"
              placeholder="请输入文件链接"
              value={fileUrl}
              onChange={this.handleChange}
              onKeyUp={e => e.keyCode===13 && this.handleSubmit(e)}
            />
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
          <button
            className="btn btn-lg btn-primary btn-block"
            onClick={this.handleSubmit}
            disabled={isLoading}
          >
            <div className="entry-progress" style={{width: `${percentage}%`}}/>
            <span>{ buttonText }</span>
          </button>
        </div>
      </div>
    )
  }
}
