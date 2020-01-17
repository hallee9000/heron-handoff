import React, { useState, useEffect } from 'react'
import SettingsContext from 'contexts/SettingsContext'
import { COLOR_FORMATS } from 'utils/const'
import './color-format-select.scss'

const ColorFormatSelect = ({ globalSettings, onColorFormatChange }) => {
  const [ colorFormat, setColorFormat ] = useState(globalSettings.colorFormat || 0)
  const changeColorFormat = e => {
    const value = e.target.value - 0
    setColorFormat(value)
    onColorFormatChange && onColorFormatChange('colorFormat', value)
  }
  useEffect(() => {
    setColorFormat(globalSettings.colorFormat)
  }, [globalSettings.colorFormat])
  return <select className="input color-format-select" value={colorFormat} onChange={changeColorFormat}>
    {
      COLOR_FORMATS.map((format, index) => <option key={index} value={index}>{ format }</option>)
    }
  </select>
}

export default () =>
  <SettingsContext.Consumer>
    {({globalSettings, changeGlobalSettings}) => (
      <ColorFormatSelect
        globalSettings={globalSettings}
        onColorFormatChange={changeGlobalSettings}
      />
    )}
  </SettingsContext.Consumer>