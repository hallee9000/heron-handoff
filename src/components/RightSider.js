import React from 'react'
import cn from 'classnames'
import { Droplet, Image } from 'react-feather'
import './right-sider.scss'

export default class RightSider extends React.Component {
  state = { maskVisible: false }
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
    const { hasMask } = this.props
    const { maskVisible } = this.state
    return (
      <div className={cn('main-right-sider', {'has-mask': hasMask})}>
        <div className={cn('sider-mask', {'mask-hidden': !maskVisible})} onTransitionEnd={this.handleTransitionEnd}/>
        <ul className="sider-tabs">
          <li><Droplet size={14}/>样式</li>
          <li><Image size={14}/>切图</li>
        </ul>
      </div>
    )
  }
}