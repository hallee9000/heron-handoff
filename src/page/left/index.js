import React from 'react'
import cn from 'classnames'
import { withTranslation } from 'react-i18next'
import Frames from './Frames'
import Components from './Components'
import './left-sider.scss'

class LeftSider extends React.Component {
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
    const { components, ignoreComponents, useLocalImages, images, pagedFrames, t } = this.props
    const { tabIndex } = this.state
    return (
      <div className="main-left-sider">
        {
          !ignoreComponents &&
          <ul className="left-sider-tabs">
            <li
              className={cn({selected: tabIndex===0})}
              onClick={() => this.handleTabClick(0)}
            >{t('pages')}</li>
            <li
              className={cn({selected: tabIndex===1})}
              onClick={() => this.handleTabClick(1)}
            >{t('components')}</li>
          </ul>
        }
        <div className={cn('left-sider-list', {'without-tab': ignoreComponents})}>
          <Frames
            visible={tabIndex===0}
            pagedFrames={pagedFrames}
            useLocalImages={useLocalImages}
            images={images}
            onFrameChange={this.onItemChange}
          />
          {
            !ignoreComponents &&
            <Components
              visible={tabIndex===1}
              components={components}
              useLocalImages={useLocalImages}
              images={images}
              onComponentChange={this.onItemChange}
            />
          }
        </div>
      </div>
    )
  }
}

export default withTranslation('left')(LeftSider)
