import React from 'react'
import './mixed-fill.scss'

export default ({fillStyles}) =>
  <div className="mixed-fill">
    <div className="fill-bg"/>
    {
      fillStyles.map((fillStyle, index) =>
        <div key={index} style={{background: fillStyle.css, opacity: fillStyle.opacity}}/>
      )
    }
  </div>
