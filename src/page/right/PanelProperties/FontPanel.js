import React, { Fragment } from 'react'
import { withTranslation } from 'react-i18next'
import cn from 'classnames'
import { HelpCircle, Copy } from 'react-feather'
import Tooltip from 'rc-tooltip'
import TextItems from '../items/TextItems'
import PieceWithCopy from './PieceWithCopy'
import StyleReference from './StyleReference'
import { WithCopy } from 'components/utilities'
import { getTextStyle } from 'utils/style'
import { getTextTable } from 'utils/text'
import StyleMeta from './StyleMeta'
import './font-panel.scss'

import multipleStylesImage from './multi-styles.gif'

class FontPanel extends React.Component {
  constructor(props) {
    super(props)
    const { onGetStyle } = props
    const textStyle = getTextStyle(props.node.style, true)
    // from plugin
    const textTable = props.node.textTable || getTextTable(props.node)
    this.state = {
      textTable,
      selected: null,
      style: textStyle
    }
    onGetStyle && onGetStyle(textStyle)
  }
  switchPiece = (piece, index) => {
    const textStyle = getTextStyle(piece, true)
    this.setState({
      selected: index,
      style: textStyle
    })
    const { onSwitch, onGetStyle } = this.props
    onGetStyle && onGetStyle(textStyle)
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
    const { node, styles, nodeStyles, stylePropertiesVisible, propsSider, onShowStyleDetail, t } = this.props
    const { textTable, selected, style } = this.state
    return (
      <div className="props-section props-text">
        <h5 className="section-title">
          <span className="title-name">{t('text')}</span>
          {
            selected===null && !stylePropertiesVisible &&
            <StyleReference
              styleItems={style}
              styles={styles}
              nodeStyles={node.styles}
              type="text"
              onShowStyleDetail={onShowStyleDetail}
            />
          }
        </h5>
        <div className="text-content">
          <WithCopy text={node.characters} className="content-copy">
            <Copy size={14}/>
          </WithCopy>
          <div className="content-box" onClick={this.onDeselectPiece}>
            {
              textTable.length===0 ?
              <span>{ node.characters }</span> :
              textTable.map((piece, index) =>
                <PieceWithCopy
                  key={index}
                  text={piece.text}
                  className={cn('box-piece', {'selected': selected===index})}
                  onClick={() => this.switchPiece(piece, index)}
                />
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
                    <img src={multipleStylesImage} alt="multi-styles tutorial"/>
                    <p>{t('multiple text styles tip')}</p>
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
                <span>{t('multiple text styles')}</span> <HelpCircle size={12}/>
              </p>
            </Tooltip>
          }
        </div>
        {
          stylePropertiesVisible ?
          <StyleMeta
            nodeStyles={nodeStyles}
            type="text"
          /> :
          <div className="section-items">
            <TextItems flag={selected} items={style}/>
          </div>
        }
      </div>
    )
  }
}

export default withTranslation('right')(FontPanel)
