import React from 'react'
import cn from 'classnames'
import { getCSSEffects } from 'utils/style'
import './preview.scss'

export default ({type, styles}) =>
  <div className={cn('preview', `preview-${type.toLowerCase()}`)}>
    <div className="preview-bg"/>
    {
      type==='FILL' ?
      styles.map((style, index) =>
        <div key={index} style={{background: style.css, opacity: style.opacity}}/>
      ) :
      (
        type==='TEXT' ?
        <div className="text-item" style={styles}>测试</div> :
        <div className="effect-item" style={getCSSEffects(styles)}/>
      )
    }
  </div>
