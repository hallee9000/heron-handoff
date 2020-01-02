import React from 'react'
import cn from 'classnames'
import { ChevronLeft } from 'react-feather'
import {  onInputClick } from 'utils/helper'
import { getFillsStyle } from 'utils/style'
import './style-detail.scss'

export default class StyleDetail extends React.Component {
  state = {
    maskVisible: false,
    tabIndex: 0
  }
  render () {
    const { visible, style, onBack } = this.props
    const fillStyles = style.value ? getFillsStyle(style.value).filter(fill => !!fill) : []
    console.log(style)
    return (
      <div className={cn('sider-detail', {'sider-detail-visible': visible})}>
        <div className="detail-title">
          <ChevronLeft onClick={onBack} size={36}/>
          <span>{style.name}</span>
        </div>
        {
          style.value &&
          <div className="detail-preview">
          <div className="preview-bg"/>
            {
              fillStyles.map((fillStyle, index) =>
                <div key={index} style={{background: fillStyle.css, opacity: fillStyle.opacity}}/>
              )
            }
          </div>
        }
        {
          style.value &&
          <ul className="detail-items">
            {
              fillStyles
                .map((fillStyle, index) =>
                  <li className="detail-item" key={index}>
                    <div className="item-bg"/>
                    <div className="item-preview" style={{background: fillStyle.css, opacity: fillStyle.opacity}}/>
                    <input className="input item-color" defaultValue={ fillStyle.color } readOnly onClick={onInputClick}/>
                    <input className="input item-opacity" defaultValue={ fillStyle.opacity } readOnly onClick={onInputClick}/>
                  </li>
                )
            }
          </ul>
        }
      </div>
    )
  }
}
