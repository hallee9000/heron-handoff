import React, { createContext, useState } from 'react'
import { filterLocalizedSettings, getLocalGlobalSettings, setLocalGlobalSettings } from 'utils/helper'
import { DEFAULT_SETTINGS, LOCALIZED_SETTING_KEYS } from 'utils/const'

const GlobalContext = createContext({
  globalSettings: {...DEFAULT_SETTINGS},
  initGlobalSettings: () => {},
  changeGlobalSetting: () => {}
})

export const withGlobalContextConsumer = (Component) => 
  props =>
    <GlobalContext.Consumer>
      {
        (
          ({globalSettings, initGlobalSettings, changeGlobalSetting}) =>
            <Component
              globalSettings={globalSettings}
              initGlobalSettings={initGlobalSettings}
              changeGlobalSetting={changeGlobalSetting}
              {...props}
            />
        )
      }
    </GlobalContext.Consumer>

export const withGlobalContextProvider = (Component) => {
  return props => {
    const [globalSettings, setGlobalSettings] = useState(DEFAULT_SETTINGS)

    // 初始化设置项
    const handleInitGlobalSettings = (settings) => {
      const localSettings = getLocalGlobalSettings()
      const filteredLocalSettings = filterLocalizedSettings(localSettings || {})
      
      // 全局 context = 默认+用户设置+本地
      const combinedSettings = {...DEFAULT_SETTINGS, ...settings, ...filteredLocalSettings}
      // 如果本地没有，需要把这个存到本地
      if (!localSettings) {
        setLocalGlobalSettings(combinedSettings)
      }
      setGlobalSettings(combinedSettings)
    }

    // 更新某个设置项
    const handleChangeGlobalSetting = (key, value) => {
      let newGlobalSettings
      let shouldLocalize = false
      if (value===undefined) {
        const settings = {...key}
        // 只有一个参数，修改多个设置项
        newGlobalSettings = {...globalSettings, ...settings}
        shouldLocalize = !!Object.keys(settings)
          // eslint-disable-next-line
          .filter(key => LOCALIZED_SETTING_KEYS.includes(key))
          .length
      } else {
        newGlobalSettings = {...globalSettings, [key]: value}
        shouldLocalize = LOCALIZED_SETTING_KEYS.includes(key)
      }
      // 如果需要本地化的还要存储到本地
      if (shouldLocalize) {
        setLocalGlobalSettings(newGlobalSettings)
      }
      setGlobalSettings(newGlobalSettings)
    }

    return (
      <GlobalContext.Provider value={{
        globalSettings,
        initGlobalSettings: handleInitGlobalSettings,
        changeGlobalSetting: handleChangeGlobalSetting
      }}>
        <Component
          globalSettings={globalSettings}
          initGlobalSettings={handleInitGlobalSettings}
          changeGlobalSetting={handleChangeGlobalSetting}
          {...props}
        />
      </GlobalContext.Provider>
    )
  }
}

export default GlobalContext
