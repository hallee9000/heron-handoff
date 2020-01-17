import React, { Fragment } from 'react'
import { CopiableInput } from 'components/utilities'
import { Fill } from 'components/icons/style'
import { formattedColor } from 'utils/style'

export default ({color, colorFormat}) =>
  <Fragment>
    <CopiableInput
      label={<Fill size={12}/>}
      value={formattedColor(colorFormat, color)}
      style={{width: colorFormat===0 ? 64 : 100}}
      title="颜色"
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
