import React, { useState, useEffect } from 'react'
import { withGlobalContextConsumer } from 'contexts/GlobalContext'
import { COLOR_FORMATS } from 'utils/const'
import './color-format-select.scss'

const ColorFormatSelect = ({ globalSettings, changeGlobalSetting }) => {
  const [ colorFormat, setColorFormat ] = useState(globalSettings.colorFormat || 0)
  const changeColorFormat = e => {
    const value = e.target.value - 0
    setColorFormat(value)
    changeGlobalSetting && changeGlobalSetting('colorFormat', value)
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

export default withGlobalContextConsumer(ColorFormatSelect)
