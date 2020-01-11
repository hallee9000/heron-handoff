import React from 'react'
import { getFillsStyle, getEffectsStyle, getTextIcon } from 'utils/style'
import { EFFECTS, TEXTS } from 'utils/const'
import FillPreview from './Preview'
import './style-item.scss'

export default ({styles, styleName, styleType, ...props}) => {
  switch (styleType) {
    case 'FILL':
      const { styles: fillItems } = getFillsStyle(styles)
      const isSingleFill = fillItems.length===1
      const isMixFill = fillItems.length>1
      return <li className="style-item style-item-fill" {...props}>
        <div
          className="item-preview"
          style={{background: isSingleFill && fillItems[0].css}}
        >
          {
            isMixFill && <FillPreview type="FILL" styles={fillItems}/>
          }
        </div>
        { styleName }
      </li>
    case 'EFFECT':
      const { type } = getEffectsStyle(styles)
      return <li className="style-item style-item-effect" {...props}>
        <div className="item-preview">
          { EFFECTS[type].icon }
        </div>
        { styleName }
      </li>
    case 'TEXT':
      return <li className="style-item style-item-text" {...props}>
        <div className="item-preview">
          { TEXTS[getTextIcon(styles)] }
        </div>
        { styleName }
      </li>
    default:
      return ''
  }
}
