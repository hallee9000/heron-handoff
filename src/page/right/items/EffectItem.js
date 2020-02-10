import React, { useState } from 'react'
import cn from 'classnames'
import { ChevronDown } from 'react-feather'
import { withGlobalSettings } from 'contexts/SettingsContext'
import { CopiableInput, InputGroup } from 'components/utilities'
import { MixEffect } from 'components/icons/style'
import { formattedNumber, getEffectCSSCode } from 'utils/style'
import { EFFECTS } from 'utils/const'
import Color from './Color'
import './effect-item.scss'

const EffectItem = ({flag, style, nodeType, globalSettings}) => {
  const colorFormat = globalSettings.colorFormat || 0
  const [isExpanded, setExpanded] = useState(false)
  const { type, category, typeName, blur, x, y, dashedPorpertyName } = style
  const code = getEffectCSSCode(style, globalSettings, colorFormat)
  return <ul key={flag} className={cn('effect-item', { 'effect-item-expanded': isExpanded })}>
    <li className="effect-summary" onClick={() => setExpanded(!isExpanded)}>
      <ChevronDown
        className="summary-chevron"
        size={18}
      />
      { EFFECTS[type].icon }
      <span className="summary-name">{ typeName }</span>
      <CopiableInput
        label={<MixEffect size={12}/>}
        inputClass="summary-blur"
        value={ formattedNumber(blur, globalSettings) }
        title="模糊"
        isQuiet
        onWrapperClick={e => e.stopPropagation()}
      />
    </li>
    {
      category==='shadow' &&
      <li className="effect-extra">
        <InputGroup isQuiet>
          <CopiableInput label="X" value={ formattedNumber(x, globalSettings) } title="X"/>
          <CopiableInput label="Y" value={ formattedNumber(y, globalSettings) } title="Y"/>
          <Color color={style} colorFormat={colorFormat}/>
        </InputGroup>
      </li>
    }
    <li className="effect-code">
      <CopiableInput
        type="textarea"
        value={ `${ dashedPorpertyName || (nodeType==='TEXT' ? 'text-shadow' : 'box-shadow') }: ${code};` }/>
    </li>
  </ul>
}

export default withGlobalSettings(EffectItem)
