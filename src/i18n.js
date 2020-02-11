import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getGlobalSettings } from 'utils/helper'
import { entry, right, rightItems, utilities } from './lang'

const { language } = getGlobalSettings() || {}
// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    'entry': entry.en,
    'right': right.en,
    'right.items': rightItems.en,
    'utilities': utilities.en
  },
  zh: {
    'entry': entry.zh,
    'right': right.zh,
    'right.items': rightItems.zh,
    'utilities': utilities.zh
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
