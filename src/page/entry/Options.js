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
    notIncludeComponents: true,
    offlineMode: true,
    isLoading: false,
    percentage: 0,
    buttonText: ''
  }
  setPercentage = (percentage, buttonText) => {
    this.setState({
      percentage,
      buttonText
    })
  }
  handleOptionChange = e => {
    const { name, checked } = e.target
    const { onComponentsOptionChange } = this.props
    this.setState({
      [name]: checked
    }, () => {
      const { notIncludeComponents } = this.state
      onComponentsOptionChange && onComponentsOptionChange(notIncludeComponents)
    })
  }
  handleSubmit = async e => {
    e.preventDefault()
    const { fileKey, data: fileData, pagedFrames, figmacnLogo, logo, onDownloaded, t } = this.props
    const frames = getFlattedFrames(pagedFrames, false)
    const { notIncludeComponents, offlineMode } = this.state
    const zip = offlineMode ? (new JSZip()) : null

    this.setState({ isLoading: true })
    this.setPercentage(0, t('fetching data'))

    if (zip) {
      await handleIndex(
        zip,
        { fileData, pagedFrames, notIncludeComponents },
        () => { this.setPercentage(2, t('dealing with', {name: 'index.html'})) }
      )
      await handleJs(zip, () => { this.setPercentage(6, t('dealing with', {name: 'Js'})) })
      await handleIcoAndCSS(zip, () => { this.setPercentage(12, t('dealing with', {name: 'CSS'})) })
      await handleLogo(zip, figmacnLogo.current.src, 'figmacn-logo.svg',  () => { this.setPercentage(14, t('dealing with', {name: 'figmacn-logo'})) })
      await handleLogo(zip, logo.current.src, 'logo.svg', () => { this.setPercentage(16, t('dealing with', {name: 'logo'})) })
    }
    // get components and styles
    const { components, styles, exportSettings } = walkFile(fileData)
    const imageIds = notIncludeComponents ? frames : frames.concat(components.map(({id, name}) => ({id, name})))
    // get or download frames and components
    const images = zip ?
      await this.downloadFramesAndComponentsImages(fileKey, imageIds, zip, (index, name, length) => {
        const step = Math.floor(36/length)
        this.setPercentage(20+step*(index+1), t('fetching', {name}))
      }) :
      await this.getFramesAndComponentsImages(fileKey, imageIds, () => {
        this.setPercentage(56, t('fetching', {name: '图片'}))
      })
    // get export settings
    const exportings = await this.getExportingImages(fileKey, exportSettings, zip, (index, name, length) => {
      const step = Math.floor(32/length)
      this.setPercentage(60+step*(index+1), t('fetching', {name}))
    })
    if (zip) {
      // generate zip
      const documentName = fileData.name
      this.setPercentage(98, 'generating zip')
      zip.generateAsync({type: 'blob'})
        .then(content => {
          saveAs(content, `${trimFilePath(documentName)}.zip`)
          this.setPercentage(100, 'marked zip downloaded')
          setTimeout(() => {
            onDownloaded && onDownloaded()
          }, 400)
        })
    } else {
      this.onFinished(fileData, components, styles, exportings, pagedFrames, images)
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
    const { onFinished, t } = this.props
    this.setState({
      isLoading: false
    })
    this.setPercentage(100, t('marked data generated'))
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
    const { useHighQuality, notIncludeComponents, offlineMode, isLoading, buttonText, percentage } = this.state
    return (
      <div className="entry-options">
        <Title step={3} content={t('other options')} hasBottom={formVisible}/>
        <div className={cn('form entry-form', {'form-visible': formVisible})}>
          <div className="form-item">
            <label>
              <input name="offlineMode" type="checkbox" checked={offlineMode} onChange={this.handleOptionChange}/>{t('offline mode')}
            </label>
            <div className="help-block">{t('offline mode description')}</div>
          </div>
          <div className="form-item">
            <label>
              <input name="notIncludeComponents" type="checkbox" checked={notIncludeComponents} onChange={this.handleOptionChange}/>{t('not include components')}
            </label>
            <div className="help-block">{t('not include components description')}</div>
          </div>
          <div className="form-item">
            <label>
              <input name="useHighQuality" type="checkbox" checked={useHighQuality} onChange={this.handleOptionChange}/>{t('use high quality')}
            </label>
            <div className="help-block">{t('use high quality description')}</div>
          </div>
          <div className="form-item">
            <button
              className="btn btn-lg btn-primary btn-block btn-generate"
              onClick={this.handleSubmit}
              disabled={isLoading}
            >
              <div className="entry-progress" style={{width: `${percentage}%`}}/>
              <span>{ buttonText ? buttonText : t('generate design mark') }</span>
            </button>
            <div className="help-block">
              <a href={t('slow tip link')}target="_blank" rel="noopener noreferrer">
                {t('slow tip')}
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation('entry')(Options)
