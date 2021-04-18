import React from 'react'
import { ArrowRight } from 'react-feather'
import { getStyleById } from 'utils/style'
import StyleItem from './items/StyleItem'
import './style-reference.scss'

const StyleReference = ({styleItems, styles, nodeStyles, type, onShowStyleDetail}) => {
  const styleReference = getStyleById(styles, nodeStyles, type)
  const styleType = type==='stoke' ? 'FILL' : type.toUpperCase()
  return  styleReference &&
    <span
      className="title-reference"
      onClick={() => onShowStyleDetail && onShowStyleDetail(styleType, nodeStyles[type])}
    >
      <StyleItem
        styles={styleItems}
        styleName={styleReference.name}
        styleType={type.toUpperCase()}
        isHoverable={false}
      />
      <ArrowRight size={14}/>
    </span>
}

export default StyleReference
