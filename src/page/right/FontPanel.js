import React, { Fragment } from 'react'
import cn from 'classnames'
import { HelpCircle, Copy } from 'react-feather'
import Tooltip from 'rc-tooltip'
import TextItems from './items/TextItems'
import StyleReference from './StyleReference'
import { WithCopy } from 'components/utilities'
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
    onSwitch && onSwitch(piece.fills, index)
  }
  onDeselectPiece = e => {
    const isContentBox = Array.prototype.indexOf.call(e.target.classList, 'content-box')>-1
    if (isContentBox) {
      const { node } = this.props
      this.switchPiece({fills: node.fills, ...node.style}, null)
    }
  }
  render() {
    const { node, styles, propsSider, onShowDetail } = this.props
    const { textTable, selected, style } = this.state
    return (
      <div className="props-section props-text">
        <h5 className="section-title">
          <span className="title-name">文字样式</span>
          {
            selected===null &&
            <StyleReference
              styleItems={style}
              styles={styles}
              nodeStyles={node.styles}
              type="text"
              onShowDetail={onShowDetail}
            />
          }
        </h5>
        <div className="text-content">
          <div className="content-box" onClick={this.onDeselectPiece}>
            <WithCopy text={node.characters} className="box-copy">
              <Copy size={14}/>
            </WithCopy>
            {
              textTable.length===0 ?
              <span>{ node.characters }</span> :
              textTable.map((piece, index) =>
                <WithCopy
                  key={index}
                  text={piece.text}
                  className={cn('box-piece', {'selected': selected===index})}
                  callback={() => this.switchPiece(piece, index)}
                >
                  { piece.text }
                </WithCopy>
              )
            }
          </div>
          {
            !!textTable.length && propsSider &&
            <Tooltip
              trigger={['click']}
              overlay={
                () =>
                  <Fragment>
                    <img src={require('./multi-styles.gif')} alt="multi-styles tutorial"/>
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
