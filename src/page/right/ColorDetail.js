import React from 'react'
import cn from 'classnames'
import { CopiableInput, InputGroup } from 'components/utilities'
import { Fill, Degree, Opacity } from 'components/icons/style'
import './color-detail.scss'

export default ({fillStyle, expanded}) =>
  <ul className="color-detail">
    <li className="detail-summary">
      <span className="summary-type">{ fillStyle.type }</span>
      <InputGroup hasDivider={false}>
        <CopiableInput label={<Degree size={12}/>} className="summary-degree" defaultValue='12°' title="角度"/>
        <CopiableInput label={<Opacity size={12}/>} className="summary-opacity" defaultValue={ fillStyle.opacity } title="不透明度"/>
      </InputGroup>
    </li>
    {
      fillStyle.stops &&
      <li className={cn('detail-stops', { 'detail-stops-expanded': expanded })}>
        {
          fillStyle.stops.map((stop, index) =>
            <div className="stops-item" key={index}>
              <div className="stops-dot"/>
              <InputGroup hasDivider={false} isQuiet>
                <CopiableInput className="stops-position" defaultValue={ stop.position } title="位置"/>
                <CopiableInput label={<Fill size={12}/>} className="stops-value" defaultValue={ stop.hex } title="颜色"/>
                <CopiableInput className="stops-opacity" defaultValue={ stop.alpha } title="不透明度"/>
              </InputGroup>
            </div>
          )
        }
      </li>
    }
    <li className="color-value">
      <CopiableInput type="textarea" defaultValue={ fillStyle.css }/>
    </li>
  </ul>
