import React from 'react'
import { ArrowRight } from 'react-feather'
import { getStyleById } from 'utils/style'
import Preview from './items/Preview'
import './style-reference.scss'

export default ({styleItems, styles, nodeStyles, type}) => {
  const styleReference = getStyleById(styles, nodeStyles, type)
  return  styleReference &&
    <span className="title-reference">
      <span className="reference-preview">
        <Preview type="FILL" styles={styleItems}/>
      </span>
      <span className="reference-name">{ styleReference.name }</span>
      <ArrowRight size={14}/>
    </span>
}
