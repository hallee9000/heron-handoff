import React, { Fragment } from 'react'
import { withTranslation } from 'react-i18next'
import { CopiableInput } from 'components/utilities'
import { Fill } from 'components/icons/style'
import { formattedColor } from 'utils/style'

const Color = ({color, colorFormat, t}) =>
  <Fragment>
    <CopiableInput
      label={<Fill size={12}/>}
      value={formattedColor(colorFormat, color)}
      style={{width: colorFormat===0 ? 64 : 100}}
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

export default withTranslation('right.items')(Color)