import React from 'react'
import cn from 'classnames'
import { ChevronLeft } from 'react-feather'
import FillItem from './items/FillItem'
import EffectItem from './items/EffectItem'
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
          <span>{style.name}</span>
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
              <ul className="properties-items">
                <li className="properties-item">
                  <CopiableInput isQuiet label="字体" defaultValue={ styleItems.fontFamily }/>
                </li>
                <li className="properties-item">
                  <CopiableInput isQuiet label="字重" defaultValue={ styleItems.fontWeight }/>
                </li>
                <li className="properties-item">
                  <CopiableInput isQuiet label="字号" defaultValue={ styleItems.fontSize }/>
                </li>
                <li className="properties-item">
                  <CopiableInput isQuiet label="对齐方式" defaultValue={ styleItems.textAlignHorizontal }/>
                </li>
                <li className="properties-item">
                  <CopiableInput isQuiet label="字间距" defaultValue={ styleItems.letterSpacing }/>
                </li>
                <li className="properties-item">
                  <CopiableInput isQuiet label="行高" defaultValue={ `${styleItems.lineHeightPercent.toFixed()}%` }/>
                </li>
              </ul> :
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
