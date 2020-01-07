import React from 'react'
import { getFillsStyle, getEffectsStyle } from 'utils/style'
import { EFFECTS } from 'utils/const'
import MixedFill from './MixedFill'
import './style-item.scss'

export default ({styles, styleName, styleType, ...props}) => {
  switch (styleType) {
    case 'FILL':
      const fills = getFillsStyle(styles)
      const isSingleFill = fills.length===1
      const isMixFill = fills.length>1
      return <li className="style-item style-item-fill" {...props}>
        <div
          className="item-preview"
          style={{background: isSingleFill && fills[0].css}}
        >
          {
            isMixFill && <MixedFill fillStyles={fills}/>
          }
        </div>
        { styleName }
      </li>
    case 'EFFECT':
      const effcts = getEffectsStyle(styles)
      return <li className="style-item style-item-effect" {...props}>
        <div className="item-preview">
          { EFFECTS[effcts.type].icon }
        </div>
        { styleName }
      </li>
    case 'TEXT':
      return <li className="style-item style-item-text" {...props}>
        <div className="item-preview"/>
        { styleName }
      </li>
    default:
      return ''
  }
}
