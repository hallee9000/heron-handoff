import React, { createRef } from 'react'
import cn from 'classnames'
import { CopiableInput, InputGroup } from 'components/utilities'
import { getFillsStyle, getEffectsStyle } from 'utils/style'
import FillItem from './items/FillItem'
import EffectItem from './items/EffectItem'
import StyleReference from './StyleReference'
import { toFixed } from 'utils/mark'
import FontPanel from './FontPanel'
import './right-props.scss'

export default class RightProps extends React.Component {
  propsSider = createRef()
  state = {
    hasEntered: false,
    flag: 0,
    fills: this.props.data.node.fills
  }
  handleTextChange = fills => {
    const { flag } = this.state
    this.setState({
      flag: 1-flag,
      fills
    })
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
      const { flag } = this.state
      this.setState({
        flag: 1-flag, 
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
    const { data, styles } = this.props
    const { node } = data
    const { strokes, effects, styles: nodeStyles } = node
    const { hasEntered, fills, flag } = this.state
    const { styles: fillItems } = getFillsStyle(fills)
    const { styles: strokeItems } = getFillsStyle(strokes)
    const { styles: effectItems } = getEffectsStyle(effects)
    return (
      <div
        className={cn('main-right-props', {'main-right-props-entered': hasEntered})}
        key={data.index}
        ref={this.propsSider}
      >
        <div className="props-section">
          <h5 className="section-title">{ node.name }</h5>
        </div>
        {/* position and size */}
        <div className="props-section props-basic">
          <h5 className="section-title">位置和尺寸</h5>
          <div className="section-items">
            <CopiableInput isQuiet label="X" defaultValue={ toFixed(data.left) }/>
            <CopiableInput isQuiet label="Y" defaultValue={ toFixed(data.top) }/>
            <CopiableInput isQuiet label="W" defaultValue={ toFixed(data.width) }/>
            <CopiableInput isQuiet label="H" defaultValue={ toFixed(data.height) }/>
            {
              data.opacity &&
              <CopiableInput isQuiet label="不透明度" defaultValue={ toFixed(data.opacity) }/>
            }
            {
              data.cornerRadius &&
              <CopiableInput isQuiet label="圆角" defaultValue={ toFixed(data.cornerRadius) }/>
            }
          </div>
        </div>
        {/* font */}
        {
          node.type==='TEXT' &&
          <FontPanel
            node={node}
            onSwitch={this.handleTextChange}
            propsSider={this.propsSider.current}
          />
        }
        {/* fills */}
        {
          !!(fills && fills.length) &&
          <div className="props-section props-fills">
            <h5 className="section-title">
              <span className="title-name">颜色</span>
              <StyleReference
                styleItems={fillItems}
                styles={styles}
                nodeStyles={nodeStyles}
                type="fill"
              />
            </h5>
            <ul className="section-items">
              {
                fillItems.map((fillStyle, index) =>
                  <li className="item-block" key={index}>
                    <FillItem flag={flag} style={fillStyle}/>
                  </li>
                )
              }
            </ul>
          </div>
        }
        {/* strokes */}
        {
          !!(node.strokes && node.strokes.length) &&
          <div className="props-section props-strokes">
            <h5 className="section-title">
              <span className="title-name">描边</span>
              <StyleReference
                styleItems={strokeItems}
                styles={styles}
                nodeStyles={nodeStyles}
                type="stroke"
              />
            </h5>
            <ul className="section-items">
              {
                strokeItems.map((strokeStyle, index) =>
                  <li className="item-block" key={index}>
                    <FillItem flag={flag} style={strokeStyle}/>
                  </li>
                )
              }
            </ul>
            <InputGroup>
              <CopiableInput label="粗细" defaultValue={ node.strokeWeight }/>
              <CopiableInput label="位置" defaultValue={ node.strokeAlign }/>
            </InputGroup>
          </div>
        }
        {/* effects */}
        {
          !!(node.effects && node.effects.length) &&
          <div className="props-section props-effects">
            <h5 className="section-title">
              <span className="title-name">效果</span>
              <StyleReference
                styleItems={effectItems}
                styles={styles}
                nodeStyles={nodeStyles}
                type="effect"
              />
            </h5>
            <ul className="section-items">
              {
                effectItems.map((effectStyle, index) =>
                  <li className="item-block" key={index}>
                    <EffectItem flag={flag} style={effectStyle}/>
                  </li>
                )
              }
            </ul>
          </div>
        }
      </div>
    )
  }
}