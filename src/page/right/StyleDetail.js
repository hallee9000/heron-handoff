import React from 'react'
import cn from 'classnames'
import { ChevronLeft } from 'react-feather'
import FillItem from './items/FillItem'
import EffectItem from './items/EffectItem'
import TextItems from './items/TextItems'
import Preview from './items/Preview'
import { CopiableInput } from 'components/utilities'
import { getStyle } from 'utils/style'
import './style-detail.scss'

const itemsMap = {
  'FILL': FillItem,
  'EFFECT': EffectItem
}

export default class StyleDetail extends React.Component {
  render () {
    const { visible, style, onBack } = this.props
    const { styleType } = style
    const isText = styleType==='TEXT'
    const { styles: styleItems } = getStyle(styleType, style.items)
    return (
      <div className={cn('sider-detail', {'sider-detail-visible': visible})}>
        <div className="detail-title">
          <ChevronLeft onClick={onBack} size={36}/>
          <span className="title-name">{style.name}</span>
          <select className="input" defaultValue={0}>
            <option value={0}>HEX</option>
            <option value={0}>HEXA</option>
            <option value={1}>RGBA</option>
            <option value={2}>HSLA</option>
          </select>
        </div>
        {
          style.items &&
          <div className="detail-preview">
            <Preview type={styleType} styles={styleItems} name={style.name}/>
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
            style.items &&
            (
              isText ?
              <TextItems flag={visible} items={styleItems}/> :
              <ul className="properties-items">
                {
                  styleItems.map((styleItem, index) => {
                    const StyleItem = itemsMap[styleType]
                    return <li className="properties-item" key={index}>
                      <StyleItem flag={visible} style={styleItem}/>
                    </li>
                  })
                }
              </ul>
            )
          }
        </div>
      </div>
    )
  }
}
