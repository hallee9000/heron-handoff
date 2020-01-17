import React from 'react'
import { withGlobalSettings } from 'contexts/SettingsContext'
import { CopiableInput } from 'components/utilities'
import { formattedNumber } from 'utils/style'
import './text-items.scss'

const TextItems = ({flag, items, globalSettings}) =>
  <ul key={flag} className="text-items">
    <li className="text-item">
      <CopiableInput isQuiet label="字体" value={ items.fontFamily }/>
    </li>
    <li className="text-item">
      <CopiableInput isQuiet label="字重" value={ items.fontWeight }/>
    </li>
    <li className="text-item">
      <CopiableInput isQuiet label="字号" value={ formattedNumber(items.fontSize, globalSettings) }/>
    </li>
    <li className="text-item">
      <CopiableInput isQuiet label="对齐方式" value={ items.textAlign }/>
    </li>
    <li className="text-item">
      <CopiableInput isQuiet label="字间距" value={ formattedNumber(items.letterSpacing, globalSettings) }/>
    </li>
    <li className="text-item">
      <CopiableInput
        isQuiet
        label="行高"
        value={
          items.lineHeightUnit==='PIXELS' ?
          formattedNumber(items.lineHeight, globalSettings) :
          items.lineHeight
        }
      />
    </li>
    {
      items.textDecoration &&
      <li className="text-item">
        <CopiableInput isQuiet label="样式" value={ items.textDecoration }/>
      </li>
    }
  </ul>

export default withGlobalSettings(TextItems)
