import React from 'react'
import cn from 'classnames'
import { ArrowDown, Loader } from 'react-feather'
import Title from './Title'
import { getFile } from 'api'
import { getFileKey } from 'utils/helper'

export default class Basic extends React.Component {
  state = {
    fileUrl: '',
    token: '',
		fileUrlMessage: '',
    tokenMessage: '',
    errorMessage: '',
    hasToken: false,
    isLoading: false,
    editable: false,
    documentName: '',
    thumbnail: '',
    lastUpdatedDate: ''
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
    const { onFinished } = this.props
    const { fileUrl } = this.state
    const fileKey = getFileKey(fileUrl)

    if (this.validate()) {
      this.setState({ isLoading: true })
      const fileData = await getFile(fileKey)
      // const fileData = JSON.parse(localStorage.getItem('data'))
      // console.log(JSON.stringify(fileData))

      // token or file error
      const hasError = this.hasError(fileData)
      if (!hasError) {
        const documentName = fileData.name
        const thumbnail = fileData.thumbnailUrl
        const lastUpdatedDate = (new Date(fileData.lastModified)).toLocaleString()
        this.setState({
          isLoading: false,
          editable: true,
          documentName,
          thumbnail,
          lastUpdatedDate
        })
        onFinished && onFinished(fileData, fileKey)
      }
    }
  }
  hasError = fileData => {
    if (fileData.status===403 && fileData.err==='Invalid token') {
      this.handleTokenError()
      return true
    } else if (fileData.status===404) {
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
  componentDidUpdate (prevProps) {
    if (this.props.formVisible && (this.props.formVisible !== prevProps.formVisible)) {
      this.setState({
        editable: false
      })
    }
  }
  render() {
    const { formVisible, onEdit } = this.props
    const { fileUrl, token, errorMessage, fileUrlMessage, tokenMessage, hasToken, isLoading, editable, documentName, thumbnail, lastUpdatedDate } = this.state
    return (
      <div className="entry-block entry-basic">
        <Title
          step={1}
          content="获取文件"
          editable={editable}
          hasBottom={formVisible || editable}
          onEdit={onEdit}
        />
        <div className={cn('form entry-form', {'form-visible': formVisible})}>
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
          <div className="form-item form-item-right">
            <button
              className="btn btn-lg btn-primary btn-round"
              onClick={this.handleSubmit}
              disabled={isLoading}
            >
              {
                isLoading ?
                <Loader size={16} className="motion-loading"/> :
                <ArrowDown size={16}/>
              }
            </button>
          </div>
        </div>
        <div className={cn('basic-abstract', {'abstract-visible': editable})}>
          <div className="abstract-thumbnail" style={{backgroundImage: `url(${thumbnail})`}}/>
          <div>
            <h5>{ documentName }</h5>
            <p>最后更新于 {lastUpdatedDate}</p>
          </div>
        </div>
      </div>
    )
  }
}
