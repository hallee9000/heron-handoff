import React, { createRef } from 'react'
import cn from 'classnames'
import { getColor, getCSSColor } from 'utils/color'
import { toFixed } from 'utils/mark'
import FontPanel from './right/FontPanel'
import './right-props.scss'

export default class RightProps extends React.Component {
  propsSider = createRef()
  state = {
    hasEntered: false,
    fills: this.props.data.node.fills
  }
  handleTextChange = fills => {
    this.setState({ fills })
  }
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
    if (this.props.data.index!==prevProps.data.index) {
      this.setState({
        fills: this.props.data.node.fills
      })
    }
  }
  componentDidMount () {
    setTimeout(() => {
      this.setState({
        hasEntered: true
      })
    }, 10)
  }
  render () {
    const { data } = this.props
    const { node } = data
    const { hasEntered, fills } = this.state
    return (
      <div
        className={cn('main-right-props', {'main-right-props-entered': hasEntered})}
        key={data.index}
        ref={this.propsSider}
      >
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
        {/* fills */}
        {
          !!(fills && fills.length) &&
          <div className="props-section props-color">
            <h5>颜色</h5>
            <ul className="section-items">
              {
                fills.map((fill, index) =>
                  fill.type==='SOLID' &&
                  <li className="item-block" key={index}>
                    <div style={{background: getCSSColor(fill.color)}}/> { getColor(fill.color).hex() }
                  </li>
                )
              }
            </ul>
          </div>
        }
        {/* font */}
        {
          node.type==='TEXT' &&
          <FontPanel
            node={node}
            onSwitch={this.handleTextChange}
            propsSider={this.propsSider.current}
          />
        }
      </div>
    )
  }
}