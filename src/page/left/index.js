import React from 'react'
import cn from 'classnames'
import Frames from './Frames'
import Components from './Components'
import './left-sider.scss'

export default class LeftSider extends React.Component {
  state = {
    tabIndex: 0
  }
  handleTabClick = (index) => {
    const { tabIndex } = this.state
    if (tabIndex===index) return
    this.setState({ tabIndex: index })
  }
  onItemChange = (itemId, pageId) => {
    const { onFrameOrComponentChange } = this.props
    onFrameOrComponentChange && onFrameOrComponentChange(itemId, pageId)
  }
  render () {
    const { components, useLocalImages, images, pagedFrames } = this.props
    const { tabIndex } = this.state
    return (
      <div className="main-left-sider">
        <ul className="left-sider-tabs">
          <li
            className={cn({selected: tabIndex===0})}
            onClick={() => this.handleTabClick(0)}
          >页面</li>
          <li
            className={cn({selected: tabIndex===1})}
            onClick={() => this.handleTabClick(1)}
          >组件</li>
        </ul>
        <div className="left-sider-list">
          <Frames
            visible={tabIndex===0}
            pagedFrames={pagedFrames}
            useLocalImages={useLocalImages}
            images={images}
            onFrameChange={this.onItemChange}
          />
          <Components
            visible={tabIndex===1}
            components={components}
            useLocalImages={useLocalImages}
            images={images}
            onComponentChange={this.onItemChange}
          />
        </div>
      </div>
    )
  }
}
