import React from 'react'
import cn from 'classnames'
import { getEffectsCSSObject } from 'utils/style'
import './preview.scss'

const Preview = ({type, styles, name}) =>
  <div className={cn('preview', `preview-${type.toLowerCase()}`)}>
    <div className="preview-bg"/>
    {
      type==='FILL' ?
      styles.map((style, index) =>
        <div key={index} style={{background: style.css, opacity: style.opacity}}/>
      ) :
      (
        type==='TEXT' ?
        <div className="text-item" style={styles}>{ name }</div> :
        <div className="effect-item" style={getEffectsCSSObject(styles)}/>
      )
    }
  </div>

export default Preview
