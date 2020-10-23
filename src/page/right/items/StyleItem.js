import React from 'react'
import cn from 'classnames'
import { getFillsStyle, getEffectsStyle, getTextIcon } from 'utils/style'
import { EFFECTS, TEXTS } from 'utils/const'
import FillPreview from './Preview'
import './style-item.scss'

export default ({styles, styleName, styleType, isHoverable=true, ...props}) => {
  switch (styleType) {
    case 'FILL':
      const { styles: fillItems } = getFillsStyle(styles)
      const isSingleFill = fillItems.length===1
      const isMixFill = fillItems.length>1
      return <a className={cn('style-item style-item-fill', {'style-item-hoverable': isHoverable})} {...props}>
        <div
          className="item-preview"
          style={{background: isSingleFill && fillItems[0].css}}
        >
          {
            isMixFill && <FillPreview type="FILL" styles={fillItems}/>
          }
        </div>
        { styleName }
      </a>
    case 'EFFECT':
      const { type } = getEffectsStyle(styles)
      console.log('type', type)
      return <a className={cn('style-item style-item-effect', {'style-item-hoverable': isHoverable})} {...props}>
        <div className="item-preview">
          { EFFECTS[type].icon }
        </div>
        { styleName }
      </a>
    case 'TEXT':
      return <a className={cn('style-item style-item-text', {'style-item-hoverable': isHoverable})} {...props}>
        <div className="item-preview">
          { TEXTS[getTextIcon(styles)] }
        </div>
        { styleName }
      </a>
    default:
      return ''
  }
}
