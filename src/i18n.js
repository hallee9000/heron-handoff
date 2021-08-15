import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocalGlobalSettings } from 'utils/helper'
import { common, entry, left, right, rightItems, utilities, canvas, header } from './lang'

// 默认先从本地获取语言
const { language } = getLocalGlobalSettings() || {}
// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    'common': common.en,
    'entry': entry.en,
    'left': left.en,
    'right': right.en,
    'right.items': rightItems.en,
    'utilities': utilities.en,
    'canvas': canvas.en,
    'header': header.en
  },
  zh: {
    'common': common.zh,
    'entry': entry.zh,
    'left': left.zh,
    'right': right.zh,
    'right.items': rightItems.zh,
    'utilities': utilities.zh,
    'canvas': canvas.zh,
    'header': header.zh
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: language || 'zh',
    // debug: true,
    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })

export default i18n
