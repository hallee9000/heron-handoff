import React, { Fragment } from 'react'
import cn from 'classnames'
import { withTranslation } from 'react-i18next'
import Search from './Search'
import { WithTooltip } from 'components/utilities'
import { getImageUrl, getBackgroundImageUrl } from 'utils/helper'

class Components extends React.Component {
  defaultComponents = this.props.components.map(c =>({...c, filterVisible: true}))
  state = {
    searchValue: '',
    components: this.defaultComponents,
    selectedIndex: 0
  }
  handleComponentSelect = (index, componentId) => {
    const { onComponentChange, mode, isMock } = this.props
    const componentImageUrl = getImageUrl(this.defaultComponents[index], mode, isMock)
    this.setState({
      searchValue: '',
      components: this.defaultComponents,
      selectedIndex: index
    })
    onComponentChange && onComponentChange(componentId, componentImageUrl)
  }
  handleSearchChange = e => {
    const searchValue = e.target.value
    this.setState({
      searchValue,
      components: this.defaultComponents
        .map(c =>({
          ...c,
          filterVisible: c.name.toLowerCase().indexOf(searchValue.toLowerCase())>-1
        }))
    })
  }
  clearSearch = () => {
    this.setState({
      searchValue: '',
      components: this.defaultComponents
    })
  }
  componentDidUpdate(prevProps) {
    const { components } = this.props
    const { selectedIndex } = this.state
    if (this.props.visible && (this.props.visible !== prevProps.visible) && components.length) {
      this.handleComponentSelect(selectedIndex, components[selectedIndex].id)
    }
  }
  render () {
    const { visible, mode, isMock, t } = this.props
    const { searchValue, components, selectedIndex } = this.state
    return (
      <Fragment>
        <Search
          visible={visible}
          value={searchValue}
          onChange={this.handleSearchChange}
          onClear={this.clearSearch}
        />
        <ul className={cn('list-container list-components', {hide: !visible})}>
          {
            !!components.length ?
            components.map(
              (component, index) =>
                <WithTooltip
                  key={component.id}
                  yes={!!component.description}
                  tooltipProps={{overlay: component.description, placement: 'right'}}
                >                                  
                  <li
                    className={cn('list-item', {'list-item-hidden': !component.filterVisible, selected: index===selectedIndex})}
                    onClick={() => this.handleComponentSelect(index, component.id)}
                    title={component.name}
                  >
                    <div
                      className="item-thumbnail"
                      style={{
                        backgroundImage: getBackgroundImageUrl(component, mode, isMock)
                      }}
                    />
                    <span>{component.name}</span>
                  </li>
                </WithTooltip>
            ) :
            <li className="item-empty">{t('no components')}</li>
          }
        </ul>
      </Fragment>
    )
  }
}

export default withTranslation('left')(Components)
