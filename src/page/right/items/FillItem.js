import React, { useState } from 'react'
import cn from 'classnames'
import { ChevronDown } from 'react-feather'
import { CopiableInput, InputGroup } from 'components/utilities'
import { Fill, Degree, Opacity } from 'components/icons/style'
import './fill-item.scss'

export default ({flag, style}) => {
  const isSolid = style.type==='Solid'
  const [isExpanded, setExpanded] = useState(false)
  return <ul key={flag} className={cn('fill-item', { 'fill-item-expanded': isExpanded })}>
    <li className="fill-summary">
      <ChevronDown
        className="summary-chevron"
        size={18}
        onClick={() => setExpanded(!isExpanded)}
      />
      <div className="summary-bg"/>
      <div className="summary-preview" style={{background: style.css, opacity: style.opacity}}/>
      <span className="summary-type">{ style.type }</span>
      <InputGroup hasDivider={false} isQuiet>
        {
          isSolid ?
          <CopiableInput label={<Fill size={12}/>} className="summary-color" defaultValue={style.hex} title="颜色"/> :
          <CopiableInput label={<Degree size={12}/>} className="summary-degree" defaultValue='12°' title="角度"/>
        }
        <CopiableInput label={<Opacity size={12}/>} className="summary-opacity" defaultValue={ style.opacity } title="不透明度"/>
      </InputGroup>
    </li>
    {
      style.stops &&
      <li className={cn('fill-stops fill-collapse', { 'detail-stops-expanded': isExpanded })}>
        {
          style.stops.map((stop, index) =>
            <div className="stops-item" key={index}>
              <div className="stops-dot"/>
              <InputGroup hasDivider={false} isQuiet>
                <CopiableInput className="stops-position" defaultValue={ stop.position } title="位置"/>
                <CopiableInput label={<Fill size={12}/>} className="stops-value" defaultValue={ stop.hex } title="颜色"/>
                <CopiableInput label={<Opacity size={12}/>} className="stops-opacity" defaultValue={ stop.alpha } title="不透明度"/>
              </InputGroup>
            </div>
          )
        }
      </li>
    }
    <li className="fill-code fill-collapse">
      <CopiableInput type="textarea" defaultValue={ style.css }/>
    </li>
  </ul>
}
