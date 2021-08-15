import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { withGlobalContextConsumer } from 'contexts/GlobalContext'
import MarkSettings from './Mark'
import './settings.scss'

class Settings extends Component {
  changeLanguage = e => {
    const { changeGlobalSetting, i18n } = this.props
    const { value } = e.target
    i18n.changeLanguage(value)
    changeGlobalSetting('language', value)
  }
  changeOtherSetting = e => {
    const { changeGlobalSetting } = this.props
    const { checked, name } = e.target
    changeGlobalSetting(name, checked)
  }
  render () {
    const { t, globalSettings } = this.props
    return <div className="settings">
      <h3><span role="img" aria-label="Congratulations">⚙️</span> {t('settings title')}</h3>
      <MarkSettings/>
      <div className="form">
        <div className="form-item settings-title">{t('language')}</div>
        <div className="form-item">
          <select name="language" className="input" value={globalSettings.language} onChange={this.changeLanguage}>
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
              checked={globalSettings.disableInspectExportInner}
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
              checked={globalSettings.disableInspectInComponent}
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
              checked={globalSettings.notShowStyleProperties}
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

export default withGlobalContextConsumer(withTranslation('header')(Settings))
