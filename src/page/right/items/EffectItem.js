import React, { useState } from 'react'
import cn from 'classnames'
import { ChevronDown } from 'react-feather'
import { CopiableInput, InputGroup } from 'components/utilities'
import { Fill, Opacity, MixEffect } from 'components/icons/style'
import { EFFECTS } from 'utils/const'
import './effect-item.scss'

export default ({flag, style, hasCode=true}) => {
  const [isExpanded, setExpanded] = useState(false)
  const { type, category, typeName, blur, x, y, hex, alpha, css } = style
  return <ul key={flag} className={cn('effect-item', { 'effect-item-expanded': isExpanded })}>
    <li className="effect-summary">
      <ChevronDown
        className="summary-chevron"
        size={18}
        onClick={() => setExpanded(!isExpanded)}
      />
      { EFFECTS[type].icon }
      <span className="summary-name">{ typeName }</span>
      <CopiableInput label={<MixEffect size={12}/>} className="summary-blur" defaultValue={ blur } title="模糊" isQuiet/>
    </li>
    {
      category==='shadow' &&
      <li className="effect-extra">
        <InputGroup isQuiet>
          <CopiableInput label="X" defaultValue={ x } title="X"/>
          <CopiableInput label="Y" defaultValue={ y } title="Y"/>
          <CopiableInput label={<Fill size={12}/>} className="extra-color" defaultValue={ hex } title="颜色"/>
          <CopiableInput label={<Opacity size={12}/>} className="extra-opacity" defaultValue={ alpha } title="不透明度"/>
        </InputGroup>
      </li>
    }
    {
      hasCode &&
      <li className="effect-code">
        <CopiableInput type="textarea" defaultValue={ css.code }/>
      </li>
    }
  </ul>
}