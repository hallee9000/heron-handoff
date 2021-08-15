import React from 'react'
import Tooltip from 'rc-tooltip'
import { Globe } from 'react-feather'
import { withTranslation } from 'react-i18next'
import { withGlobalContextConsumer } from 'contexts/GlobalContext'

const languages = {
  en: 'English',
  zh: '中文'
}

const LangSetting = ({i18n, globalSettings, changeGlobalSetting}) => {
  const { language } = globalSettings

  const changeLanguage = e => {
    const { value } = e.target
    i18n.changeLanguage(value)
    changeGlobalSetting('language', value)
  }

  return (
    <Tooltip overlay="Change Language" placement="top" align={{offset: [0, 3]}}>
      <a className="footer-language" onClick={e => e.preventDefault()} href="/">
        <select value={language} onChange={changeLanguage}>
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
        <Globe size={14}/>
        <span>{languages[language]}</span>
      </a>
    </Tooltip>
  )
}

export default withGlobalContextConsumer(withTranslation('entry')(LangSetting))
