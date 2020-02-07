import i18n from "i18next"
import { initReactI18next } from "react-i18next"

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      "get file": "Fetch file",
      "buy me a coffee": "buy me a coffee"
    }
  },
  zh: {
    translation: {
      "get file": "获取文件",
      "buy me a coffee": "请我喝杯咖啡"
    }
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })

  export default i18n
