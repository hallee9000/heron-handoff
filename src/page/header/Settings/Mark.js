import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import InputNumber from "rc-input-number"
import { PLATFORMS, WEB_MULTIPLE, IOS_DENSITY, ANDROID_DENSITY, UNITS, NUMBER_FORMATS } from 'utils/const'
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
      this.changeUnit(name, value)
      this.changeResolution(name, value)
    })
  }
  handleRemBaseChange = value => {
    const { onSettingsChange } = this.props
    onSettingsChange('remBase', value)
    this.setState({
      remBase: value
    })
  }
  changeResolution = (name, value) => {
    console.log(name, value)
    const { onSettingsChange } = this.props
    // 当用户选择了 (R)em 时，倍数需要切换到 1
    if (name==='unit' && (value==='3' || value==='4')) {
      onSettingsChange('resolution', 0)
      this.setState({resolution: 0})
    }
    if (name==='platform') {
      // 如果用户选了 Android，要变为第二个，否则是第一个
      onSettingsChange('resolution', value==='2' ? 1 : 0)
      this.setState({resolution: value==='2' ? 1 : 0})
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
  render () {
    const { t } = this.props
    const { platform, resolution, unit, remBase, numberFormat } = this.state
    const baseVisible = platform===0 && (unit===3 || unit===4)
    const unitMaps = [[2, 3, 4, 5], [0, 2], [1, 2]] // [Web, iOS, Android]
    return (
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
          <select
            name="unit"
            className="input"
            placeholder={t('unit placeholder')}
            value={unit}
            onChange={this.handleChange}
          >
            {
              unitMaps[platform]
              .map(index =>
                <option key={index} value={index}>{ UNITS[index] }{ UNITS[index]==='rpx' && t('miniprogram') }</option>
              )
            }
          </select>
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
        <div className="form-item settings-title">{t('format')}</div>
        <div className="form-item form-item-horizontal">
          <label htmlFor="rem-base" className="item-label">{t('number format')}</label>
          <select
            name="numberFormat"
            className="input"
            value={numberFormat}
            onChange={this.handleChange}
          >
            {
              NUMBER_FORMATS.map((numberFormat, index) =>
                <option key={index} value={index}>
                  {t(numberFormat)}
                </option>
              )
            }
          </select>
        </div>
      </div>
    )
  }
}

export default withTranslation('header')(Settings)
