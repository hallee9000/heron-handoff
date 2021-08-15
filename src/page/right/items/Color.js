import React, { Fragment } from 'react'
import { withTranslation } from 'react-i18next'
import { withGlobalContextConsumer } from 'contexts/GlobalContext'
import { CopiableInput } from 'components/utilities'
import { Fill } from 'components/icons/style'
import { formattedColor } from 'utils/style'

const Color = ({color, globalSettings, t}) => {
  const { colorFormat } = globalSettings
  return (
    <Fragment>
      <CopiableInput
        label={<Fill size={12}/>}
        value={formattedColor(color, globalSettings)}
        style={{width: colorFormat===0 ? 86 : 130}}
        title={t('color value')}
      />
      {
        colorFormat===0 &&
        <CopiableInput
          value={color.alpha}
          style={{width: 36}}
          title="Alpha"
        />
      }
    </Fragment>
  )
}

export default withTranslation('right.items')(withGlobalContextConsumer(Color))