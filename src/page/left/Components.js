import React, { Fragment } from 'react'
import cn from 'classnames'
import { withTranslation } from 'react-i18next'
import { WithTooltip } from 'components/utilities'
import { getUrlImage } from 'utils/helper'

class Components extends React.Component {
  defaultComponents = this.props.components.map(c =>({...c, filterVisible: true}))
  state = {
    inputValue: '',
    components: this.defaultComponents,
    selectedIndex: 0
  }
  handleComponentSelect = (index, componentId) => {
    const { onComponentChange } = this.props
    this.setState({
      inputValue: '',
      components: this.defaultComponents,
      selectedIndex: index
    })
    onComponentChange && onComponentChange(componentId)
  }
  handleInputChange = e => {
    const { components } = this.props
    const inputValue = e.target.value
    this.setState({
      inputValue,
      components: components
        .map(c =>({
          ...c,
          filterVisible: c.name.toLowerCase().indexOf(inputValue.toLowerCase())>-1
        }))
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
    const { visible, useLocalImages, images, t } = this.props
    const { inputValue, components, selectedIndex } = this.state
    return (
      <Fragment>
        <div className={cn('list-filter', {hide: !visible})}>
          <input
            className="input"
            value={inputValue}
            onChange={this.handleInputChange}
            placeholder={t('component placeholder')}
          />
        </div>
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
                    className={cn({'list-item-hidden': !component.filterVisible, selected: index===selectedIndex})}
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
      </Fragment>
    )
  }
}

export default withTranslation('left')(Components)
