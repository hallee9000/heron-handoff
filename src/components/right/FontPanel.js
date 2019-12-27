import React, { Fragment } from 'react'
import cn from 'classnames'
import { HelpCircle } from 'react-feather'
import Tooltip from 'rc-tooltip'
import { getTextTable } from 'utils/text'
import './font-panel.scss'

const styleKeys = ['fontFamily', 'fontWeight', 'fontSize', 'textAlignHorizontal', 'letterSpacing', 'lineHeightPercent']

export default class FontPanel extends React.Component {
  constructor(props) {
    super(props)
    const { fontFamily, fontWeight, fontSize, textAlignHorizontal, letterSpacing, lineHeightPercent } = this.props.node.style
    this.state = {
      selected: null,
      fontFamily, fontWeight, fontSize, textAlignHorizontal, letterSpacing, lineHeightPercent
    }
  }
  switchPiece = (piece, index) => {
    const style = {}
    styleKeys.map(key => {
      if (piece[key]) {
        style[key] = piece[key]
      }
      return key
    })
    this.setState({
      selected: index,
      ...style
    })
    const { onSwitch } = this.props
    onSwitch && onSwitch(piece.fills)
  }
  render() {
    const { node, propsSider } = this.props
    const { selected, fontFamily, fontWeight, fontSize, textAlignHorizontal, letterSpacing, lineHeightPercent } = this.state
    const textTable = getTextTable(node)
    return (
      <div className="props-section props-text">
        <h5>文字样式</h5>
        <div className="text-content">
          <div className="content-box">
            {
              textTable.length===0 ?
              node.characters :
              textTable.map((piece, index) =>
                <span
                  key={index}
                  className={cn({'selected': selected===index})}
                  onClick={() => this.switchPiece(piece, index)}
                >{ piece.text }</span>
              )
            }
          </div>
          {
            !!textTable.length && propsSider &&
            <Tooltip
              overlay={
                () =>
                  <Fragment>
                    <img src={`${process.env.PUBLIC_URL}/tutorial/multi-styles.gif`} alt="multi-styles tutorial"/>
                    <p>这段文本里面有多种样式，点击对应文字片段来查看不同的样式属性。</p>
                  </Fragment>
              }
              overlayStyle={{width: 'calc(100% - 24px)'}}
              getTooltipContainer={() => propsSider}
              mouseLeaveDelay={0}
              align={{
                points: ['bl', 'tl'],
                offset: [0, 3]
              }}
            >
              <p className="section-helper">
                <span>多样式文本</span> <HelpCircle size={12}/>
              </p>
            </Tooltip>
          }
        </div>
        <ul className="section-items">
          <li className="item-block">
            字体: <input className="input" readOnly defaultValue={ fontFamily }/>
          </li>
          <li className="item-block">
            字重: <input className="input" readOnly defaultValue={ fontWeight }/>
          </li>
          <li className="item-block">
            字号: <input className="input" readOnly defaultValue={ fontSize }/>
          </li>
          <li className="item-block">
            对齐方式: <input className="input" readOnly defaultValue={ textAlignHorizontal }/>
          </li>
          <li className="item-block">
            字间距: <input className="input" readOnly defaultValue={ letterSpacing }/>
          </li>
          <li className="item-block">
            行高: <input className="input" readOnly defaultValue={ `${lineHeightPercent.toFixed()}%` }/>
          </li>
        </ul>
      </div>
    )
  }
}
