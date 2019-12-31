import React from 'react'
import cn from 'classnames'
import { WithTooltip } from 'utils/hoc'
import { getUrlImage } from 'utils/helper'

export default class Components extends React.Component {
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
    if (this.props.visible !== prevProps.visible) {
      this.handleComponentSelect(0, components[0].id)
    }
  }
  render () {
    const { visible, components, useLocalImages, images } = this.props
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
                >
                  <div
                    className="item-thumbnail"
                    style={{
                      backgroundImage: getUrlImage(component.id, useLocalImages, images)
                    }}
                  /> {component.name}
                </li>
              </WithTooltip>
          ) :
          <li className="item-empty">没有组件</li>
        }
      </ul>
    )
  }
}
