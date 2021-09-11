import React, { Fragment } from 'react'
import cn from 'classnames'
import { withTranslation } from 'react-i18next'
import { Droplet, Image, DownloadCloud, Clock } from 'react-feather'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import Versions from './Versions'
import { StyleItem, ExportItem } from '../items'
import { getBufferData } from 'api'
import { asyncForEach, isAllImageFill, getImageUrl } from 'utils/helper'
import { STYLE_TYPES } from 'utils/const'
import './style.scss'

class RightPanel extends React.Component {
  state = {
    tabIndex: 0,
    percentage: 0,
    progressText: ''
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
    const { mode, isMock, exportSettings, documentName, t } = this.props
    const zip = new JSZip()
    const length = exportSettings.length
    const folderName = `${documentName.replace(/\//g, '-')}-exports`
    const exportsFolder = zip.folder(folderName)
    this.setProgress(1, t('downloading images'))

    await asyncForEach(exportSettings, async (exportSetting, index) => {
      const imgName = exportSetting.fileName
      const imgUrl = getImageUrl(exportSetting, mode, isMock)
      const imgData = await getBufferData(imgUrl)
      this.setProgress((index+1)*Math.floor(90/length), t('dealing with', {name: imgName}))
      exportsFolder.file(imgName, imgData, {base64: true})
    })

    this.setProgress(96, t('compressing files'))
    zip.generateAsync({type: 'blob'})
      .then(content => {
        saveAs(content, `${folderName}.zip`)
        this.setProgress(100, t('downloaded'))
        const timer = setTimeout(() => {
          this.setProgress(0, '')
          clearTimeout(timer)
        }, 800)
      })
  }
  componentDidMount() {
    // const { styles } = this.props
  }
  render () {
    const { mode, isMock, styles, exportSettings, propsPanelState, onShowDetail, versionData, t } = this.props
    const { tabIndex, percentage, progressText } = this.state
    const { protocol } = window.location
    return (
      <div className="right-panel">
        <div
          className={cn('panel-mask', `mask-${propsPanelState}`)}
        />
        <ul className="panel-tabs">
          <li className={cn({'selected': tabIndex===0})} onClick={() => this.changeTab(0)}><Droplet size={14}/>{t('tab style')}</li>
          <li className={cn({'selected': tabIndex===1})} onClick={() => this.changeTab(1)}><Image size={14}/>{t('tab slice')}</li>
          {
            versionData &&
            <li className={cn({'selected': tabIndex===2})} onClick={() => this.changeTab(2)}><Clock size={14}/>{t('tab version')}</li>
          }
        </ul>
        <ul className={cn('panel-list', {'hide': tabIndex!==0})}>
          {
            Object.keys(styles).map(key =>
              key!=='GRID' && styles[key] &&
              <Fragment key={key}>
                <li className="list-title">{ t(STYLE_TYPES[key]) }</li>
                {
                  styles[key] &&
                  styles[key]
                    .filter(style => key==='FILL' ? !isAllImageFill(style.items) : true)
                    .map((style, index) =>
                      <li key={index}>
                        <StyleItem
                          styles={style.items}
                          styleName={style.name}
                          styleType={style.styleType}
                          isSelectable
                          onClick={() => onShowDetail(style)}
                        />
                      </li>
                    )
                }
              </Fragment>
            )
          }
        </ul>
        <ul className={cn('panel-exports', {'hide': tabIndex!==1})}>
            {
              /^http/.test(protocol) && !!exportSettings.length &&
              <li
                className={cn('exports-download-all', {'is-downloading': percentage})}
                onClick={this.handleDownloadAll}
              >
                <span>{ progressText || t('download all') }</span> { !percentage && <DownloadCloud size={14}/> }
                <div className="download-all-progress" style={{width: `${percentage}%`}}/>
              </li>
            }
            {
              !!exportSettings.length ?
              exportSettings
                .map((exportSetting, index) =>
                  <li key={index}>
                    <ExportItem
                      mode={mode}
                      isMock={isMock}
                      exportSetting={exportSetting}
                      index={index}
                    />
                  </li>
                ) :
              <li className="exports-empty">{t('no exports')}</li>
            }
          </ul>
        {
          versionData &&
          <Versions visible={tabIndex!==2} versionData={versionData}/>
        }
      </div>
    )
  }
}

export default withTranslation('right')(RightPanel)
