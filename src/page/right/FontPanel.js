import React, { Fragment } from 'react'
import cn from 'classnames'
import { HelpCircle } from 'react-feather'
import Tooltip from 'rc-tooltip'
import TextItems from './items/TextItems'
import { getTextStyle } from 'utils/style'
import { getTextTable } from 'utils/text'
import './font-panel.scss'

export default class FontPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      textTable: getTextTable(props.node),
      selected: null,
      style: getTextStyle(props.node.style)
    }
  }
  switchPiece = (piece, index) => {
    this.setState({
      selected: index,
      style: getTextStyle(piece)
    })
    const { onSwitch } = this.props
    onSwitch && onSwitch(piece.fills)
  }
  render() {
    const { node, propsSider } = this.props
    const { textTable, selected, style } = this.state
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
        <div className="section-items">
          <TextItems flag={selected} items={style}/>
        </div>
      </div>
    )
  }
}
