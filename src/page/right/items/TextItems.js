import React from 'react'
import { withTranslation } from 'react-i18next'
import { withGlobalContextConsumer } from 'contexts/GlobalContext'
import { CopiableInput } from 'components/utilities'
import { formattedNumber } from 'utils/style'
import './text-items.scss'

const TextItems = ({flag, items, globalSettings, t, i18n}) => {
  const labelWidth = i18n.language==='en' ? 80 : 60
  return <ul key={flag} className="text-items">
    <li className="text-item">
      <CopiableInput isQuiet labelWidth={labelWidth} label={t('font family')} value={ items.fontFamily }/>
    </li>
    <li className="text-item">
      <CopiableInput isQuiet labelWidth={labelWidth} label={t('font weight')} value={ items.fontWeight }/>
    </li>
    <li className="text-item">
      <CopiableInput isQuiet labelWidth={labelWidth} label={t('font size')} value={ formattedNumber(items.fontSize, globalSettings) }/>
    </li>
    <li className="text-item">
      <CopiableInput isQuiet labelWidth={labelWidth} label={t('letter spacing')} value={ formattedNumber(items.letterSpacing, globalSettings) }/>
    </li>
    <li className="text-item">
      <CopiableInput
        isQuiet
        labelWidth={labelWidth}
        label={t('line height')}
        value={
          items.lineHeightUnit==='PIXELS' ?
          formattedNumber(items.lineHeight, globalSettings) :
          items.lineHeight
        }
      />
    </li>
    {
      items.textDecoration &&
      <li className="text-item">
        <CopiableInput isQuiet labelWidth={labelWidth} label={t('text decoration')} value={ items.textDecoration }/>
      </li>
    }
    {
      items.textAlign &&
      <li className="text-item">
        <CopiableInput isQuiet labelWidth={labelWidth} label={t('text align')} value={ items.textAlign }/>
      </li>
    }
  </ul>
}

export default withTranslation('right.items')(withGlobalContextConsumer(TextItems))
