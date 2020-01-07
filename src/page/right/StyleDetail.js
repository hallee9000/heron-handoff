import React from 'react'
import cn from 'classnames'
import { ChevronLeft, ChevronDown } from 'react-feather'
import ColorDetail from './ColorDetail'
import MixedFill from './items/MixedFill'
import { CopiableInput } from 'components/utilities'
import { getFillsStyle } from 'utils/style'
import './style-detail.scss'

export default class StyleDetail extends React.Component {
  state = {
    styleIndex: ''
  }
  toggleStyle = index => {
    const { styleIndex } = this.state
    this.setState({
      styleIndex: styleIndex===index ? '' : index
    })
  }
  render () {
    const { visible, style, onBack } = this.props
    const { styleIndex } = this.state
    const fillStyles = style.value ? getFillsStyle(style.value) : []
    return (
      <div className={cn('sider-detail', {'sider-detail-visible': visible})}>
        <div className="detail-title">
          <ChevronLeft onClick={onBack} size={36}/>
          <span>{style.name}</span>
        </div>
        {
          style.value &&
          <div className="detail-preview">
            <MixedFill fillStyles={fillStyles}/>
          </div>
        }
        <div className="detail-name">
          <h5>名称</h5>
          <CopiableInput defaultValue={ style.name }/>
          {
            style.description &&
            <CopiableInput type="textarea" defaultValue={ style.description }/>
          }
        </div>
        <div className="detail-properties">
          <h5>属性</h5>
          {
            style.value &&
            <ul className="properties-items">
              {
                fillStyles
                  .map((fillStyle, index) =>
                    <li className="properties-item" key={index}>
                      <div className="item-bg"/>
                      <div className="item-preview" style={{background: fillStyle.css, opacity: fillStyle.opacity}}/>
                      {
                        fillStyle.stops &&
                        <ChevronDown
                          className={cn('item-chevron', { 'item-chevron-expanded': styleIndex===index })}
                          size={18}
                          onClick={() => this.toggleStyle(index)}
                        />
                      }
                      <ColorDetail fillStyle={fillStyle} expanded={styleIndex===index}/>
                    </li>
                  )
              }
            </ul>
          }
        </div>
      </div>
    )
  }
}
