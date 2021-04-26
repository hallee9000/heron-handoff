import React, { Fragment } from 'react'
import cn from 'classnames'
import { X } from 'react-feather'
import { withTranslation } from 'react-i18next'
import { WithTooltip } from 'components/utilities'
import { getImageUrl, getBackgroundImageUrl } from 'utils/helper'

class Components extends React.Component {
  defaultComponents = this.props.components.map(c =>({...c, filterVisible: true}))
  state = {
    inputValue: '',
    components: this.defaultComponents,
    selectedIndex: 0
  }
  handleComponentSelect = (index, componentId) => {
    const { onComponentChange, mode, isMock } = this.props
    const componentImageUrl = getImageUrl(this.defaultComponents[index], mode, isMock)
    this.setState({
      inputValue: '',
      components: this.defaultComponents,
      selectedIndex: index
    })
    onComponentChange && onComponentChange(componentId, componentImageUrl)
  }
  handleInputChange = e => {
    const inputValue = e.target.value
    this.setState({
      inputValue,
      components: this.defaultComponents
        .map(c =>({
          ...c,
          filterVisible: c.name.toLowerCase().indexOf(inputValue.toLowerCase())>-1
        }))
    })
  }
  handleKeyDown = e => {
    if (e.keyCode===27) {
      this.resetInput()
    }
  }
  resetInput = () => {
    this.setState({
      inputValue: '',
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
    const { inputValue, components, selectedIndex } = this.state
    return (
      <Fragment>
        <div className={cn('list-filter', {hide: !visible})}>
          <input
            className="input"
            value={inputValue}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            placeholder={t('component placeholder')}
          />
          {
            inputValue &&
            <X size={14} className="filter-clear" onClick={this.resetInput}/>
          }
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
