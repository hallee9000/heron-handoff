import React, { Fragment } from 'react'
import cn from 'classnames'
import { Droplet, Image, Layers } from 'react-feather'
import StyleDetail from './StyleDetail'
import { STYLE_TYPES, EFFECTS } from 'utils/const'
import { getFillsStyle, getEffectsStyle } from 'utils/style'
import './right-sider.scss'

export default class RightSider extends React.Component {
  state = {
    maskVisible: false,
    tabIndex: 0,
    detailVisible: false,
    currentStyle: {}
  }
  handleTransitionEnd = () => {
    const { hasMask } = this.props
    if (!hasMask) {
      this.setState({maskVisible: false})
    }
  }
  componentDidUpdate (prevProps) {
    if (this.props.hasMask && !prevProps.hasMask) {
      this.setState({maskVisible: true})
    }
  }
  openDetail = style => {
    this.setState({currentStyle: style})
    this.toggleDetail()
  }
  toggleDetail = () => {
    const { detailVisible } = this.state
    this.setState({
      detailVisible: !detailVisible
    })
  }
  componentDidMount() {
    const { styles } = this.props
    // this.openDetail(styles.FILL[1])
  }
  render () {
    const { styles, exportSettings, hasMask } = this.props
    const { maskVisible, tabIndex, detailVisible, currentStyle } = this.state
    console.log(exportSettings)
    return (
      <div className={cn('main-right-sider', {'has-mask': hasMask})}>
        <div className={cn('sider-mask', {'mask-hidden': !maskVisible})} onTransitionEnd={this.handleTransitionEnd}/>
        <div className={cn('sider-styles', {'sider-styles-visible': !detailVisible})}>
          <ul className="styles-tabs">
            <li className={cn({'selected': tabIndex===0})}><Droplet size={14}/>样式</li>
            <li className={cn({'selected': tabIndex===1})}><Image size={14}/>切图</li>
          </ul>
          <ul className="styles-list">
            {
              Object.keys(styles).map(key =>
                <Fragment key={key}>
                  <li className="item-title">{ STYLE_TYPES[key] }</li>
                  {
                    styles[key].map((style, index) => {
                      const isSingleFill = key==='FILL' && style.value.length===1
                      const isMixFill = key==='FILL' && style.value.length>1
                      return <li key={index} onClick={() => this.openDetail(style)}>
                        <div
                          className={
                            cn('item-preview',
                              `item-${key.toLowerCase()}`,
                              {'item-no-border': key==='EFFECT', 'item-mix-fill': isMixFill}
                            )
                          }
                          style={{background: isSingleFill && getFillsStyle(style.value)[0].css}}
                        >
                          {
                            isMixFill && <Layers size={12} color='rgba(255, 255, 255, 0.65)'/>
                          }
                          {
                            key==='EFFECT' &&
                            EFFECTS[getEffectsStyle(style.value).type].icon
                          }
                        </div>
                        { style.name }
                        { isMixFill && <span className="mix-tip">（MixColor）</span> }
                      </li>
                    })
                  }
                </Fragment>
              )
            }
          </ul>
        </div>
        <StyleDetail
          visible={detailVisible}
          onBack={this.toggleDetail}
          style={currentStyle}
        />
      </div>
    )
  }
}
