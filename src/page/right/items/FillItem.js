import React, { useState } from 'react'
import cn from 'classnames'
import { withTranslation } from 'react-i18next'
import { ChevronDown } from 'react-feather'
import { withGlobalContextConsumer } from 'contexts/GlobalContext'
import { CopiableInput, InputGroup } from 'components/utilities'
import { Degree, Opacity } from 'components/icons/style'
import { getFillCSSCode } from 'utils/style'
import Color from './Color'
import './fill-item.scss'

const FillItem = ({flag, style, globalSettings, t}) => {
  const isSolid = style.type==='Solid'
  const [isExpanded, setExpanded] = useState(false)
  return <ul key={flag} className={cn('fill-item', { 'fill-item-expanded': isExpanded })}>
    <li className="fill-summary" onClick={() => setExpanded(!isExpanded)}>
      <ChevronDown
        className="summary-chevron"
        size={18}
      />
      <div className="summary-bg"/>
      <div className="summary-preview" style={{background: style.css, opacity: style.opacity}}/>
      <span className="summary-type">{ style.type }</span>
      <InputGroup isQuiet onWrapperClick={e => e.stopPropagation()}>
        {
          isSolid ?
          <Color color={style}/> :
          <CopiableInput
            label={<Degree size={12}/>}
            inputClass="summary-degree"
            value={style.angle}
            title={t('stop angle')}
            style={{width: 42}}
          />
        }
        {
          !isSolid &&
          <CopiableInput
            label={<Opacity size={12}/>}
            inputClass="summary-opacity"
            value={ style.opacity }
            title={t('stop opacity')}
            style={{width: 42}}
          />
        }
      </InputGroup>
    </li>
    {
      style.stops &&
      <li className={cn('fill-stops fill-collapse', { 'detail-stops-expanded': isExpanded })}>
        {
          style.stops.map((stop, index) =>
            <div className="stops-item" key={index}>
              <div className="stops-dot"/>
              <InputGroup isQuiet>
                <CopiableInput inputClass="stops-position" value={ stop.position } title={t('stop position')}/>
                <Color color={stop}/>
              </InputGroup>
            </div>
          )
        }
      </li>
    }
    <li className="fill-code fill-collapse">
      <CopiableInput type="textarea" value={ getFillCSSCode(style, globalSettings) }/>
    </li>
  </ul>
}

export default withTranslation('right.items')(withGlobalContextConsumer(FillItem))
