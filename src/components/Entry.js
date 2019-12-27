import React from 'react'
import cn from 'classnames'
import { getFile, getImages } from 'api'
import { getFileKey } from 'utils/helper'
import './entry.scss'

export default class Entry extends React.Component {
  state = {
    fileUrl: '',
    token: '',
		fileUrlMessage: '',
    tokenMessage: '',
    hasToken: false,
    isLoading: false
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
    if (this.validate()) {
      const { fileUrl } = this.state
      const fileKey = getFileKey(fileUrl)
      this.setState({
        isLoading: true
      })
      const fileData = await getFile(fileKey)
      const ids = fileData.document.children
        .map(page => page.children
          .filter(frame => frame.type==='FRAME')
          .map(frame => frame.id)
          .join()
        )
        .filter(frameIds => frameIds!=='')
        .join()
      const { images } = await getImages(fileKey, ids)
      this.onSucceed(fileData, images)
    }
  }
  onSucceed = (fileData, imagesData) => {
    const { onGotData } = this.props
    this.setState({
      isLoading: false
    })
    onGotData && onGotData(fileData, imagesData)
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
    const { fileUrl, token, fileUrlMessage, tokenMessage, hasToken, isLoading } = this.state
    return (
      <div className="app-entry">
        <div className="form entry-container">
          <div className={cn('form-item', {'has-error': fileUrlMessage})}>
            <input
              name="fileUrl"
              className="input input-lg"
              placeholder="请输入文件链接"
              value={fileUrl}
              onChange={this.handleChange}
            />
            {
              fileUrlMessage &&
              <div className="help-block">{ fileUrlMessage }</div>
            }
          </div>
          <div className={cn('form-item', {'has-error': tokenMessage, 'hide': hasToken})}>
            <input
              name="token"
              className="input input-lg"
              placeholder="请输入你的 token"
              value={token}
              onChange={this.handleChange}
            />
            {
              tokenMessage &&
              <div className="help-block">{ tokenMessage }</div>
            }
          </div>
          <button
            className="btn btn-lg btn-primary btn-block"
            onClick={this.handleSubmit}
            disabled={isLoading}
          >
            { isLoading ? '正在生成……' : '生成标注' }
          </button>
        </div>
      </div>
    )
  }
}
