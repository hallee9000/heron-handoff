import React from 'react'
import cn from 'classnames'
import { getColor, getCSSColor } from "utils/color"
import { toFixed } from 'utils/helper'
import { formatCharacters } from 'utils/text'
import './right-props.scss'

export default class RightProps extends React.Component {
  state = { hasEntered: false, textTable: [] }
  componentDidUpdate(prevProps) {
    if (this.props.dissolved && this.props.dissolved!==prevProps.dissolved) {
      this.setState({
        hasEntered: false
      })
      setTimeout(() => {
        const { onDissolveEnd } = this.props
        onDissolveEnd && onDissolveEnd()
      }, 200)
    }
  }
  componentDidMount () {
    setTimeout(() => {
      this.setState({
        hasEntered: true
      })
    }, 10)
    const { node } = this.props.data
    if (node.type==='TEXT') {
      const textTable = formatCharacters(node.characters, node.characterStyleOverrides, node.styleOverrideTable)
      this.setState({ textTable })
    }
  }
  render () {
    const { data } = this.props
    const { node } = data
    const { hasEntered, textTable } = this.state
    return (
      <div className={cn('main-right-props', {'main-right-props-entered': hasEntered})} key={data.index}>
        <div className="props-section">
          <h5>{ node.name }</h5>
        </div>
        {/* position and size */}
        <div className="props-section">
          <h5>位置和尺寸</h5>
          <ul className="section-items">
            <li>X: <input className="input" readOnly defaultValue={ toFixed(data.left) } onMouseDown={e => console.log(e.nativeEvent)}/></li>
            <li>Y: <input className="input" readOnly defaultValue={ toFixed(data.top) }/></li>
            <li>W: <input className="input" readOnly defaultValue={ toFixed(data.width) }/></li>
            <li>H: <input className="input" readOnly defaultValue={ toFixed(data.height) }/></li>
            {
              'opacity' in node &&
              <li className="item-block">不透明度: <input className="input" readOnly defaultValue={ toFixed(node.opacity) }/></li>
            }
          </ul>
        </div>
        {
          !!(node.fills && node.fills.length) &&
          <div className="props-section props-color">
            <h5>颜色</h5>
            <ul className="section-items">
              {
                node.fills.map((fill, index) =>
                  fill.type==='SOLID' &&
                  <li className="item-block" key={index}>
                    <div style={{background: getCSSColor(fill.color)}}/> { getColor(fill.color).hex() }
                  </li>
                )
              }
            </ul>
          </div>
        }
        {
          node.type==='TEXT' &&
          <div className="props-section props-text">
            <h5>文字样式</h5>
            <div className="text-content">
              {
                textTable.length===0 ?
                <pre>{node.characters}</pre> :
                textTable.map((spice, index) =>
                  <pre key={index}>{spice.text}</pre>
                )
              }
            </div>
            <ul className="section-items">
              <li className="item-block">
                字体: <input className="input" readOnly defaultValue={ node.style.fontFamily }/>
              </li>
              <li className="item-block">
                字重: <input className="input" readOnly defaultValue={ node.style.fontWeight }/>
              </li>
              <li className="item-block">
                字号: <input className="input" readOnly defaultValue={ node.style.fontSize }/>
              </li>
              <li className="item-block">
                对齐方式: <input className="input" readOnly defaultValue={ node.style.textAlignHorizontal }/>
              </li>
              <li className="item-block">
                字间距: <input className="input" readOnly defaultValue={ node.style.letterSpacing }/>
              </li>
              <li className="item-block">
                行高: <input className="input" readOnly defaultValue={ `${node.style.lineHeightPercent}%` }/>
              </li>
            </ul>
          </div>
        }
      </div>
    )
  }
}