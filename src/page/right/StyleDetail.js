import React from 'react'
import cn from 'classnames'
import { ChevronLeft } from 'react-feather'
import { ColorFormatSelect, FillItem, EffectItem, TextItems, Preview } from './items'
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
          <ColorFormatSelect/>
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
