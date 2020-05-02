import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import InputNumber from "rc-input-number"
import { PLATFORMS, WEB_MULTIPLE, IOS_DENSITY, ANDROID_DENSITY, UNITS } from 'utils/const'
import './settings.scss'

const resolutions = [ WEB_MULTIPLE, IOS_DENSITY, ANDROID_DENSITY ]

class Settings extends Component {
  constructor (props) {
    super(props)
    const { globalSettings } = props
    this.state ={ ...globalSettings }
  }
  handleChange = e => {
    const { name, value } = e.target
    const { onSettingsChange } = this.props
    this.setState({
      [name]: value - 0
    }, () => {
      onSettingsChange(name, value - 0)
      this.changeResolution(name)
      this.changeUnit(name, value)
      this.changeResolutionWhenRemOrEm(name, value)
    })
  }
  handleRemBaseChange = value => {
    const { onSettingsChange } = this.props
    onSettingsChange('remBase', value)
    this.setState({
      remBase: value
    })
  }
  changeResolution = name => {
    const { onSettingsChange } = this.props
    if (name==='platform') {
      onSettingsChange('resolution', 0)
      this.setState({resolution: 0})
    }
  }
  changeResolutionWhenRemOrEm = (name, value) => {
    // rem selected
    if (name==='unit' && (value==='3' || value==='4')) {
      this.changeResolution('platform')
    }
  }
  changeUnit = (name, value) => {
    const { onSettingsChange } = this.props
    if (name==='platform') {
      if (value==='0') {
        this.setState({unit: 2})
        onSettingsChange('unit', 2)
      } else {
        this.setState({unit: value - 1})
        onSettingsChange('unit', value - 1)
      }
    }
  }
  changeLanguage = e => {
    const { onSettingsChange, i18n } = this.props
    const { value } = e.target
    this.setState({language: value})
    i18n.changeLanguage(value)
    onSettingsChange('language', value)
  }
  changeOtherSetting = e => {
    const { onSettingsChange } = this.props
    const { checked, name } = e.target
    this.setState({[name]: checked})
    onSettingsChange(name, checked)
  }
  render () {
    const { t } = this.props
    const { platform, resolution, unit, remBase, language, showAllExports, disableInspectExportInner } = this.state
    const baseVisible = platform===0 && (unit===3 || unit===4)
    return <div className="settings">
      <h3><span role="img" aria-label="Congratulations">⚙️</span> {t('settings title')}</h3>
      <div className="form">
        <div className="form-item settings-title">{t('settings mark')}</div>
        <div className="form-item form-item-horizontal">
          <label htmlFor="platform" className="item-label">{t('settings platform')}</label>
          <select
            name="platform"
            className="input"
            placeholder={t('platform placeholder')}
            value={platform}
            onChange={this.handleChange}
          >
            {
              PLATFORMS
                .map((platform, index) => <option key={index} value={index}>{ platform }</option>)
            }
          </select>
        </div>
        <div className="form-item form-item-horizontal">
          <label htmlFor="resolution" className="item-label">
            { platform===0 ? t('multiple') : t('pixel density') }
          </label>
          <select
            name="resolution"
            className="input"
            disabled={baseVisible}
            value={resolution}
            onChange={this.handleChange}
          >
            {
              resolutions[platform]
                .map((resolution, index) =>
                  <option key={index} value={index}>{ resolution.label }</option>
                )
            }
          </select>
        </div>
        <div className="form-item form-item-horizontal">
          <label htmlFor="unit" className="item-label">{t('unit')}</label>
          {
            platform===0 ?
            <select
              name="unit"
              className="input"
              placeholder={t('unit placeholder')}
              value={unit}
              onChange={this.handleChange}
            >
              {
                UNITS.map((unit, index) =>
                  index>1 && <option key={index} value={index}>{ unit }{ unit==='rpx' && t('miniprogram') }</option>
                )
              }
            </select>  :
            <input name="unit" className="input" readOnly value={UNITS[platform===1 ? 0 : 1]}/>
          }
        </div>
        {
          baseVisible &&
          <div className="form-item form-item-horizontal">
            <label htmlFor="rem-base" className="item-label">{t('(r)em base')}</label>
            <InputNumber
              name="remBase"
              placeholder={t('(r)em base placeholder')}
              min={1}
              max={100}
              precision={0}
              value={remBase}
              onChange={this.handleRemBaseChange}
            />
          </div>
        }
      </div>
      <div className="form">
        <div className="form-item settings-title">{t('language')}</div>
        <div className="form-item">
          <select name="language" className="input" value={language} onChange={this.changeLanguage}>
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </div>
      </div>
      <div className="form">
        <div className="form-item settings-title">其他</div>
        <div className="form-item form-item-checkbox">
          <label>
            <input
              name="showAllExports"
              type="checkbox"
              checked={showAllExports}
              onChange={this.changeOtherSetting}
            />
            {t('show all exports when selecting outer')}
          </label>
        </div>
        <div className="form-item form-item-checkbox">
          <label>
            <input
              name="disableInspectExportInner"
              type="checkbox"
              checked={disableInspectExportInner}
              onChange={this.changeOtherSetting}
            />
            {t('exports inner selecting not allowed')}
          </label>
          <div className="help-block">{t('exports inner selecting not allowed tip')}</div>
        </div>
      </div>
    </div>
  }
}

export default withTranslation('header')(Settings)
