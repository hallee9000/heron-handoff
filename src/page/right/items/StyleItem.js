import React from 'react'
import cn from 'classnames'
import { getFillsStyle, getEffectsStyle, getTextIcon } from 'utils/style'
import { EFFECTS, TEXTS } from 'utils/const'
import FillPreview from './Preview'
import './style-item.scss'

const StyleItem = ({styles, styleName, styleType, isHoverable, isSelectable, ...props}) => {
  function className (type) {
    return cn(
      `style-item style-item-${type}`,
      {
        'style-item-hoverable': isHoverable,
        'style-item-selectable': isSelectable
      }
    )
  }
  switch (styleType) {
    case 'FILL':
      const { styles: fillItems } = getFillsStyle(styles)
      const isSingleFill = fillItems.length===1
      const isMixFill = fillItems.length>1
      return (
        <a className={className('fill')} {...props}>
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
      )
    case 'EFFECT':
      const { type } = getEffectsStyle(styles)
      return (
        <a className={className('effect')} {...props}>
          <div className="item-preview">
            { EFFECTS[type].icon }
          </div>
          { styleName }
        </a>
      )
    case 'TEXT':
      return (
        <a className={className('text')} {...props}>
          <div className="item-preview">
            { TEXTS[getTextIcon(styles)] }
          </div>
          { styleName }
        </a>
      )
    default:
      return ''
  }
}

export default StyleItem
