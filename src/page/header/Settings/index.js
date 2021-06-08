import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Mark from './Mark'
import './settings.scss'

// TODO: get language from local
class Settings extends Component {
  constructor (props) {
    super(props)
    const { globalSettings } = props
    this.state ={ ...globalSettings }
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
    const { t, globalSettings, onSettingsChange } = this.props
    const { language, disableInspectExportInner, disableInspectInComponent, notShowStyleProperties } = this.state
    return <div className="settings">
      <h3><span role="img" aria-label="Congratulations">⚙️</span> {t('settings title')}</h3>
      <Mark
        globalSettings={globalSettings}
        onSettingsChange={onSettingsChange}
      />
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
              name="disableInspectExportInner"
              type="checkbox"
              checked={disableInspectExportInner}
              onChange={this.changeOtherSetting}
            />
            {t('exports inner selecting not allowed')}
          </label>
          <div className="help-block">{t('exports inner selecting not allowed tip')}</div>
        </div>
        <div className="form-item form-item-checkbox">
          <label>
            <input
              name="disableInspectInComponent"
              type="checkbox"
              checked={disableInspectInComponent}
              onChange={this.changeOtherSetting}
            />
            {t('disable inspect in component')}
          </label>
          <div className="help-block">{t('disable inspect in component tip')}</div>
        </div>
        <div className="form-item form-item-checkbox">
          <label>
            <input
              name="notShowStyleProperties"
              type="checkbox"
              checked={notShowStyleProperties}
              onChange={this.changeOtherSetting}
            />
            {t('do not show style properties')}
          </label>
          <div className="help-block">{t('do not show style properties tip')}</div>
        </div>
      </div>
    </div>
  }
}

export default withTranslation('header')(Settings)
