import React from 'react'
import cn from 'classnames'
import { withTranslation } from 'react-i18next'
import { withGlobalContextConsumer } from 'contexts/GlobalContext'
import { CollapseButton } from 'components/utilities'
import Frames from './Frames'
import NestedFrames from './NestedFrames'
import Components from './Components'
import './index.scss'

class LeftPanel extends React.Component {
  state = {
    tabIndex: 0
  }
  handleTabClick = (index) => {
    const { tabIndex } = this.state
    if (tabIndex===index) return
    this.setState({ tabIndex: index })
  }

  render () {
    const {
      components,
      includeComponents,
      mode,
      isMock,
      pagedFrames,
      globalSettings,
      onSiderTransitionEnd,
      onFrameOrComponentChange,
      t
    } = this.props
    const { leftCollapse } = globalSettings
    const { tabIndex } = this.state
    return (
      <div
        className={cn('main-left', {collapsed: leftCollapse})}
        onTransitionEnd={onSiderTransitionEnd}
      >
        <CollapseButton placement="left" />
        <div className="left-sider">
          {
            !!includeComponents &&
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
          <div className={cn('left-sider-list', {'without-tab': !includeComponents})}>
            {
              // 此处不能使用 useNestedPages 判断，因为默认为 undefined 会进入后一个，导致出错中断
              Array.isArray(pagedFrames) ?
              <NestedFrames
                visible={tabIndex===0}
                pagedFrames={pagedFrames}
                mode={mode}
                isMock={isMock}
                onSelect={onFrameOrComponentChange}
              /> :
              <Frames
                visible={tabIndex===0}
                pagedFrames={pagedFrames}
                mode={mode}
                isMock={isMock}
                onFrameChange={onFrameOrComponentChange}
              />
            }
            {
              !!includeComponents &&
              <Components
                visible={tabIndex===1}
                components={components}
                mode={mode}
                isMock={isMock}
                onComponentChange={onFrameOrComponentChange}
              />
            }
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation('left')(withGlobalContextConsumer(LeftPanel))
