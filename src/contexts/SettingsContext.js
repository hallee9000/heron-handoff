import React, { createContext } from 'react'
import { DEFAULT_SETTINGS } from 'utils/const'

const SettingsContext = createContext({
  globalSettings: DEFAULT_SETTINGS,
  changeGlobalSettings: () => {}
})

export const withGlobalSettings = (Component) =>
  props =>
    <SettingsContext.Consumer>
      {(({globalSettings}) => <Component globalSettings={globalSettings} {...props}/>)}
    </SettingsContext.Consumer>

export default SettingsContext
