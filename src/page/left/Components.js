import React from 'react'
import cn from 'classnames'
import { withTranslation } from 'react-i18next'
import { WithTooltip } from 'components/utilities'
import { getUrlImage } from 'utils/helper'

class Components extends React.Component {
  state = {
    selectedIndex: 0
  }
  handleComponentSelect = (index, componentId) => {
    const { onComponentChange } = this.props
    this.setState({ selectedIndex: index })
    onComponentChange && onComponentChange(componentId)
  }
  componentDidUpdate(prevProps) {
    const { components } = this.props
    const { selectedIndex } = this.state
    if (this.props.visible && (this.props.visible !== prevProps.visible) && components.length) {
      this.handleComponentSelect(selectedIndex, components[selectedIndex].id)
    }
  }
  render () {
    const { visible, components, useLocalImages, images, t } = this.props
    const { selectedIndex } = this.state
    return (
      <ul className={cn('list-items list-components', {hide: !visible})}>
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
                  className={cn({selected: index===selectedIndex})}
                  onClick={() => this.handleComponentSelect(index, component.id)}
                  title={component.name}
                >
                  <div
                    className="item-thumbnail"
                    style={{
                      backgroundImage: getUrlImage(component.id, useLocalImages, images)
                    }}
                  />
                  <span>{component.name}</span>
                </li>
              </WithTooltip>
          ) :
          <li className="item-empty">{t('no components')}</li>
        }
      </ul>
    )
  }
}

export default withTranslation('left')(Components)
