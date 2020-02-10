import React, { Component } from 'react'
import InputNumber from "rc-input-number"
import { PLATFORMS, WEB_MULTIPLE, IOS_DENSITY, ANDROID_DENSITY, UNITS } from 'utils/const'
import './settings.scss'

const resolutions = [ WEB_MULTIPLE, IOS_DENSITY, ANDROID_DENSITY ]

export default class Settings extends Component {
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
    const { onSettingsChange } = this.props
    const { value } = e.target
    this.setState({language: value})
    onSettingsChange('language', value)
  }
  render () {
    const { platform, resolution, unit, remBase, language } = this.state
    const baseVisible = platform===0 && (unit===3 || unit===4)
    return <div className="settings">
      <h3><span role="img" aria-label="Congratulations">⚙️</span> 设置</h3>
      <div className="form">
        <div className="form-item settings-title">标注</div>
        <div className="form-item form-item-horizontal">
          <label htmlFor="platform" className="item-label">平台</label>
          <select
            name="platform"
            className="input"
            placeholder="请选择平台"
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
            { platform===0 ? '倍数' : '像素密度' }
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
          <label htmlFor="unit" className="item-label">单位</label>
          {
            platform===0 ?
            <select
              name="unit"
              className="input"
              placeholder="请选择单位"
              value={unit}
              onChange={this.handleChange}
            >
              {
                UNITS.map((unit, index) =>
                  index>1 && <option key={index} value={index}>{ unit }{ unit==='rpx' && '（小程序）' }</option>
                )
              }
            </select>  :
            <input name="unit" className="input" readOnly value={UNITS[platform===1 ? 0 : 1]}/>
          }
        </div>
        {
          baseVisible &&
          <div className="form-item form-item-horizontal">
            <label htmlFor="rem-base" className="item-label">(R)em 基准</label>
            <InputNumber
              name="remBase"
              placeholder="请填写基准值"
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
        <div className="form-item settings-title">语言</div>
        <div className="form-item">
          <select name="language" className="input" value={language} onChange={this.changeLanguage}>
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </div>
      </div>
    </div>
  }
}
