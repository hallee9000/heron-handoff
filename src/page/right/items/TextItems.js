import React from 'react'
import { CopiableInput } from 'components/utilities'
import './text-items.scss'

export default ({flag, items}) =>
  <ul key={flag} className="text-items" title={flag}>
    <li className="text-item">
      <CopiableInput isQuiet label="字体" defaultValue={ items.fontFamily }/>
    </li>
    <li className="text-item">
      <CopiableInput isQuiet label="字重" defaultValue={ items.fontWeight }/>
    </li>
    <li className="text-item">
      <CopiableInput isQuiet label="字号" defaultValue={ items.fontSize }/>
    </li>
    <li className="text-item">
      <CopiableInput isQuiet label="对齐方式" defaultValue={ items.textAlign }/>
    </li>
    <li className="text-item">
      <CopiableInput isQuiet label="字间距" defaultValue={ items.letterSpacing }/>
    </li>
    <li className="text-item">
      <CopiableInput isQuiet label="行高" defaultValue={ items.lineHeight }/>
    </li>
    {
      items.textDecoration &&
      <li className="text-item">
        <CopiableInput isQuiet label="样式" defaultValue={ items.textDecoration }/>
      </li>
    }
  </ul>
