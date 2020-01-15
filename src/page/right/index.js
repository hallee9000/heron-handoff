import React, { Fragment } from 'react'
import cn from 'classnames'
import { Droplet, Image, DownloadCloud } from 'react-feather'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { getBufferData } from 'api'
import { asyncForEach, getFileName, isAllImageFill } from 'utils/helper'
import { STYLE_TYPES } from 'utils/const'
import StyleDetail from './StyleDetail'
import StyleItem from './items/StyleItem'
import ExportItem from './items/ExportItem'
import './right-sider.scss'

export default class RightSider extends React.Component {
  state = {
    maskVisible: false,
    tabIndex: 0,
    detailVisible: false,
    currentStyle: {},
    percentage: 0,
    progressText: ''
  }
  handleTransitionEnd = () => {
    const { hasMask } = this.props
    if (!hasMask) {
      this.setState({maskVisible: false})
    }
  }
  openDetail = style => {
    this.setState({currentStyle: style})
    this.toggleDetail()
  }
  toggleDetail = () => {
    const { detailVisible } = this.state
    this.setState({
      detailVisible: !detailVisible
    })
  }
  changeTab = index => {
    const { tabIndex } = this.state
    if (tabIndex!==index) {
      this.setState({tabIndex: index})
    }
  }
  setProgress = (percentage, progressText) => {
    this.setState({
      percentage,
      progressText
    })
  }
  handleDownloadAll = async () => {
    const { percentage } = this.state
    if (percentage!==0) return
    const { exportSettings, documentName } = this.props
    const zip = new JSZip()
    const length = exportSettings.length
    const folderName = `${documentName.replace(/\//g, '-')}-exports`
    const exportsFolder = zip.folder(folderName)
    this.setProgress(1, '开始下载图片……')

    await asyncForEach(exportSettings, async (exportSetting, index) => {
      const imgName = getFileName(exportSetting, index)
      const imgData = await getBufferData(`https://figma-handoff-cors.herokuapp.com/${exportSetting.image}`)
      this.setProgress((index+1)*Math.floor(90/length), `正在处理 ${imgName}……`)
      exportsFolder.file(imgName, imgData, {base64: true})
    })

    this.setProgress(96, '正在压缩文件……')
    zip.generateAsync({type: 'blob'})
      .then(content => {
        saveAs(content, `${folderName}.zip`)
        this.setProgress(100, '完成下载！')
        const timer = setTimeout(() => {
          this.setProgress(0, '')
          clearTimeout(timer)
        }, 800)
      })
  }
  componentDidUpdate (prevProps) {
    if (this.props.hasMask && !prevProps.hasMask) {
      this.setState({maskVisible: true})
    }
  }
  componentDidMount() {
    // const { styles } = this.props
    // this.openDetail(styles.EFFECT[4])
  }
  render () {
    const { useLocalImages, styles, exportSettings, hasMask } = this.props
    const { maskVisible, tabIndex, detailVisible, currentStyle, percentage, progressText } = this.state
    return (
      <div className={cn('main-right-sider', {'has-mask': hasMask})}>
        <div className={cn('sider-mask', {'mask-hidden': !maskVisible})} onTransitionEnd={this.handleTransitionEnd}/>
        <div className={cn('sider-styles', {'sider-styles-visible': !detailVisible})}>
          <ul className="styles-tabs">
            <li className={cn({'selected': tabIndex===0})} onClick={() => this.changeTab(0)}><Droplet size={14}/>样式</li>
            <li className={cn({'selected': tabIndex===1})} onClick={() => this.changeTab(1)}><Image size={14}/>切图</li>
          </ul>
          <ul className={cn('styles-list', {'hide': tabIndex!==0})}>
            {
              Object.keys(styles).map(key =>
                key!=='GRID' &&
                <Fragment key={key}>
                  <li className="list-title">{ STYLE_TYPES[key] }</li>
                  {
                    styles[key] &&
                    styles[key].
                      filter(style => key==='FILL' ? !isAllImageFill(style.items) : true).
                      map((style, index) =>
                        <li key={index}>
                          <StyleItem
                            styles={style.items}
                            styleName={style.name}
                            styleType={style.styleType}
                            onClick={() => this.openDetail(style)}
                          />
                        </li>
                      )
                  }
                </Fragment>
              )
            }
          </ul>
          <ul className={cn('exports-list', {'hide': tabIndex!==1})}>
            {
              !useLocalImages &&
              <li
                className={cn('exports-list-download-all', {'is-downloading': percentage})}
                onClick={this.handleDownloadAll}
              >
                <span>{ progressText || '全部下载' }</span> { !percentage && <DownloadCloud size={14}/> }
                <div className="download-all-progress" style={{width: `${percentage}%`}}/>
              </li>
            }
            {
              exportSettings
                .map((exportSetting, index) =>
                  <li key={index}>
                    <ExportItem
                      exportSetting={exportSetting}
                      useLocalImages={useLocalImages}
                      index={index}
                    />
                  </li>
                )
            }
          </ul>
        </div>
        <StyleDetail
          visible={detailVisible}
          onBack={this.toggleDetail}
          style={currentStyle}
        />
      </div>
    )
  }
}
