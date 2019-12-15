import React from 'react'
import cn from 'classnames'
import { toFixed } from 'utils/helper'
import './right-sider.scss'

export default class RightSider extends React.Component {
  componentDidMount () {
    const { onMount } = this.props
    onMount && onMount()
  }
  render () {
    const { data } = this.props
    return (
      <div className="main-right-sider" key={data.id}>
        <div className="sider-section">
          <h5>{ data.name }</h5>
          {
            data.type==='TEXT' &&
            <textarea className="input" readOnly defaultValue={ data.characters }/>
          }
        </div>
        <div className="sider-section">
          <h5>位置和尺寸</h5>
          <ul className="section-items">
            <li>X: <input className="input" readOnly defaultValue={ toFixed(data.absoluteBoundingBox.x) } onMouseDown={e => console.log(e.nativeEvent)}/></li>
            <li>Y: <input className="input" readOnly defaultValue={ toFixed(data.absoluteBoundingBox.y) }/></li>
            <li>W: <input className="input" readOnly defaultValue={ toFixed(data.absoluteBoundingBox.width) }/></li>
            <li>H: <input className="input" readOnly defaultValue={ toFixed(data.absoluteBoundingBox.height) }/></li>
            {
              data.opacity &&
              <li className="item-block">不透明度: <input className="input" readOnly defaultValue={ toFixed(data.opacity) }/></li>
            }
          </ul>
        </div>
        {
          data.type==='TEXT' &&
          <div className="sider-section">
            <h5>文字样式</h5>
            <ul className="section-items">
              <li className="item-block">
                字体: <input className="input" readOnly defaultValue={ data.style.fontFamily }/>
              </li>
              <li className="item-block">
                字重: <input className="input" readOnly defaultValue={ data.style.fontWeight }/>
              </li>
              <li className="item-block">
                字号: <input className="input" readOnly defaultValue={ data.style.fontSize }/>
              </li>
              <li className="item-block">
                对齐方式: <input className="input" readOnly defaultValue={ data.style.textAlignHorizontal }/>
              </li>
              <li className="item-block">
                字间距: <input className="input" readOnly defaultValue={ data.style.letterSpacing }/>
              </li>
              <li className="item-block">
                行高: <input className="input" readOnly defaultValue={ `${data.style.lineHeightPercent}%` }/>
              </li>
            </ul>
          </div>
        }
      </div>
    )
  }
}