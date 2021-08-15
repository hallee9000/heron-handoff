import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { withGlobalContextConsumer } from 'contexts/GlobalContext'
import InputNumber from "rc-input-number"
import { PLATFORMS, WEB_MULTIPLE, IOS_DENSITY, ANDROID_DENSITY, UNITS, NUMBER_FORMATS } from 'utils/const'
import './settings.scss'

const resolutions = [ WEB_MULTIPLE, IOS_DENSITY, ANDROID_DENSITY ]

class MarkSettings extends Component {
  handleChange = e => {
    const { name, value } = e.target
    const { changeGlobalSetting } = this.props
    const changedSettings = {
      [name]: +value
    }
    if (name!=='resolution') {
      changedSettings.resolution = this.calculateResolution(name, +value)
    }
    if (name!=='unit') {
      changedSettings.unit = this.calculateUnit(name, +value)
    }
    changeGlobalSetting(changedSettings)
  }
  calculateResolution = (name, value) => {
    const { globalSettings } = this.props
    const { resolution } = globalSettings
    // 如果用户选了 Android，要变为第二个，否则是第一个
    if (name==='platform') {
      return value===2 ? 1 : 0
    }
    // 当用户选择了 (R)em 时，倍数需要切换到 1
    if (name==='unit' && (value===3 || value===4)) {
      return 0
    }
    return resolution
  }
  calculateUnit = (name, value) => {
    const { globalSettings } = this.props
    const { unit } = globalSettings
    // 用户切换平台时需要切换单位
    if (name==='platform') {
      if (value===0) {
        return 2
      } else {
        return value - 1
      }
    }
    return unit
  }
  handleRemBaseChange = value => {
    const { changeGlobalSetting } = this.props
    changeGlobalSetting('remBase', value)
  }
  render () {
    const { globalSettings, t } = this.props
    const { platform, resolution, unit, remBase, numberFormat } = globalSettings
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

export default withTranslation('header')(withGlobalContextConsumer(MarkSettings))
