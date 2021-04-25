import React from 'react'
import cn from 'classnames'
import { withTranslation } from 'react-i18next'
import SettingsContext, { withGlobalSettings } from 'contexts/SettingsContext'
import { CollapseButton } from 'components/utilities'
import Frames from './Frames'
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
  onItemChange = (itemId, pageId) => {
    const { onFrameOrComponentChange } = this.props
    onFrameOrComponentChange && onFrameOrComponentChange(itemId, pageId)
  }
  render () {
    const { components, includeComponents, mode, isMock, pagedFrames, globalSettings, onSiderTransitionEnd, t } = this.props
    const { leftCollapse } = globalSettings
    const { tabIndex } = this.state
    return (
      <div
        className={cn('main-left', {collapsed: leftCollapse})}
        onTransitionEnd={onSiderTransitionEnd}
      >
        <SettingsContext.Consumer>
          {({globalSettings, changeGlobalSettings}) => (
            <CollapseButton
              placement="left"
              globalSettings={globalSettings}
              changeGlobalSettings={changeGlobalSettings}
            />
          )}
        </SettingsContext.Consumer>
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
            <Frames
              visible={tabIndex===0}
              pagedFrames={pagedFrames}
              mode={mode}
              isMock={isMock}
              onFrameChange={this.onItemChange}
            />
            {
              !!includeComponents &&
              <Components
                visible={tabIndex===1}
                components={components}
                mode={mode}
                isMock={isMock}
                onComponentChange={this.onItemChange}
              />
            }
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation('left')(withGlobalSettings(LeftPanel))
