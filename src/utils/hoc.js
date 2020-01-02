import React from 'react'
import Tooltip from 'rc-tooltip'

export const WithTooltip = ({yes, tooltipProps, children}) =>
  yes ?
  <Tooltip {...tooltipProps}>
    { children }
  </Tooltip> :
  children
