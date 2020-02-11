import React from 'react'
import cn from 'classnames'
import { withTranslation } from 'react-i18next'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import Title from './Title'
import { getImage, getImages, withCors, getBufferData } from 'api'
import { trimFilePath, walkFile, asyncForEach, getFileName, getFlattedFrames } from 'utils/helper'
import { handleIndex, handleJs, handleIcoAndCSS, handleLogo } from 'utils/download'

class Options extends React.Component {
  state = {
    useHighQuality: true,
    offlineMode: true,
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
  handleOptionChange = e => {
    const { name, checked } = e.target
    this.setState({
      [name]: checked
    })
  }
  handleSubmit = async e => {
    e.preventDefault()
    const { fileKey, data, pagedFrames, logo, onDownloaded } = this.props
    const frames = getFlattedFrames(pagedFrames, false)
    const { offlineMode } = this.state
    const zip = offlineMode ? (new JSZip()) : null

    this.setState({ isLoading: true })
    this.setPercentage(0, '开始获取数据……')

    if (zip) {
      await handleIndex(zip, data, pagedFrames, () => { this.setPercentage(2, '处理 index.html ……') })
      await handleJs(zip, () => { this.setPercentage(6, '处理 Js ……') })
      await handleIcoAndCSS(zip, () => { this.setPercentage(12, '处理 CSS ……') })
      await handleLogo(zip, logo.current.src, () => { this.setPercentage(16, '处理 logo ……') })
    }
    // get components and styles
    const { components, styles, exportSettings } = walkFile(data)
    const imageIds = frames.concat(components.map(({id, name}) => ({id, name})))
    // get or download frames and components
    const images = zip ?
      await this.downloadFramesAndComponentsImages(fileKey, imageIds, zip, (index, name, length) => {
        const step = Math.floor(36/length)
        this.setPercentage(20+step*(index+1), `开始获取  ${name} ……`)
      }) :
      await this.getFramesAndComponentsImages(fileKey, imageIds, () => {
        this.setPercentage(56, `开始获取图片……`)
      })
    // get export settings
    const exportings = await this.getExportingImages(fileKey, exportSettings, zip, (index, name, length) => {
      const step = Math.floor(32/length)
      this.setPercentage(60+step*(index+1), `开始获取 ${name} ……`)
    })
    if (zip) {
      // generate zip
      const documentName = data.name
      this.setPercentage(98, '准备生成压缩包……')
      zip.generateAsync({type: 'blob'})
        .then(content => {
          saveAs(content, `${trimFilePath(documentName)}.zip`)
          this.setPercentage(100, '离线标注已生成！')
          setTimeout(() => {
            onDownloaded && onDownloaded()
          }, 400)
        })
    } else {
      this.onFinished(data, components, styles, exportings, pagedFrames, images )
    }
  }
  getFramesAndComponentsImages = async (fileKey, imageIds, onStart) => {
    const { useHighQuality } = this.state
    onStart && onStart()
    const ids = imageIds.map(({id}) => id).join()
    const { images } = await getImages(fileKey, ids, useHighQuality ? 2 : 1)
    Object.keys(images)
      // eslint-disable-next-line
      .map(id => {
        const url = images[id]
        const { name } = imageIds.find(image => image.id===id)
        images[id] = { name, url }
      })
    return images
  }
  downloadFramesAndComponentsImages = async (fileKey, imageIds, zip, onStart) => {
    const { useHighQuality } = this.state
    const folder = zip ? zip.folder('data') : null
    const images = {}
    await asyncForEach(imageIds, async ({id, name}, index) => {
      onStart && onStart(index, name, imageIds.length)
      const { images: results } = await getImage(fileKey, id, useHighQuality ? 2 : 1, 'png')
      images[id] = { name, url: results[id] }
      if (folder) {
        const imageData = await getBufferData(withCors(results[id]))
        const imageName = trimFilePath(id) + '.png'
        folder.file(imageName, imageData, {base64: true})
      }
    })
    return images
  }
  getExportingImages = async (fileKey, exportSettings, zip, onStart) => {
    const exportsFolder = zip ? zip.folder('data/exports') : null
    const exportings = []
    await asyncForEach(exportSettings, async (exportSetting, index) => {
      const fileFormat = exportSetting.format.toLowerCase()
      const imageName = getFileName(exportSetting, index)
      onStart && onStart(index, imageName, exportSettings.length)
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
  onFinished = (fileData, components, styles, exportSettings, pagedFrames, imagesData ) => {
    const { onFinished } = this.props
    this.setState({
      isLoading: false
    })
    this.setPercentage(100, '资源获取成功！')
    onFinished && onFinished(fileData, components, styles, exportSettings, pagedFrames, imagesData)
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
    const { formVisible, t } = this.props
    const { useHighQuality, offlineMode, isLoading, buttonText, percentage } = this.state
    return (
      <div className="entry-options">
        <Title step={3} content={t('other options')} hasBottom={formVisible}/>
        <div className={cn('form entry-form', {'form-visible': formVisible})}>
          <div className="form-item">
            <label>
              <input name="offlineMode" type="checkbox" checked={offlineMode} onChange={this.handleOptionChange}/>生成离线标注
            </label>
            <div className="help-block">默认生成离线标注压缩包，取消勾选则生成在线标注，但关闭后需要重新生成。</div>
          </div>
          <div className="form-item">
            <label>
              <input name="useHighQuality" type="checkbox" checked={useHighQuality} onChange={this.handleOptionChange}/>使用高清图生成标注
            </label>
            <div className="help-block">默认使用高清图，不使用高清图可以加快生成速度。</div>
          </div>
          <div className="form-item">
            <button
              className="btn btn-lg btn-primary btn-block btn-generate"
              onClick={this.handleSubmit}
              disabled={isLoading}
            >
              <div className="entry-progress" style={{width: `${percentage}%`}}/>
              <span>{ buttonText }</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation('entry')(Options)
