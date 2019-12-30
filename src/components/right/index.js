import React, { Fragment } from 'react'
import cn from 'classnames'
import { Droplet, Image } from 'react-feather'
import { STYLE_TYPES, EFFECTS } from 'utils/const'
import { getFillsStyle, getEffectsStyle } from 'utils/style'
import './right-sider.scss'

export default class RightSider extends React.Component {
  state = {
    maskVisible: false,
    tabIndex: 0
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
  render () {
    const { styles, hasMask } = this.props
    const { maskVisible, tabIndex } = this.state
    console.log(styles)
    return (
      <div className={cn('main-right-sider', {'has-mask': hasMask})}>
        <div className={cn('sider-mask', {'mask-hidden': !maskVisible})} onTransitionEnd={this.handleTransitionEnd}/>
        <ul className="sider-tabs">
          <li className={cn({'selected': tabIndex===0})}><Droplet size={14}/>样式</li>
          <li className={cn({'selected': tabIndex===1})}><Image size={14}/>切图</li>
        </ul>
        <ul className="sider-list">
          {
            Object.keys(styles).map(key => {
              return <Fragment key={key}>
                <li className="item-title">{ STYLE_TYPES[key] }</li>
                {
                  styles[key].map((style, index) =>
                    <li key={index}>
                      <div
                        className={cn('item-preview', `item-${key.toLowerCase()}`)}
                        style={{background: key==='FILL' && getFillsStyle(style.value).filter(fill => !!fill).join()}}
                      >
                        {
                          key==='EFFECT' &&
                          EFFECTS[getEffectsStyle(style.value).type].icon
                        }
                      </div>
                      { style.name }
                    </li>
                  )
                }
              </Fragment>
            })
          }
        </ul>
      </div>
    )
  }
}
