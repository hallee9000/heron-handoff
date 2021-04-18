import React from 'react'
import Tooltip from 'rc-tooltip'

const WithTooltip = ({yes, tooltipProps, children}) =>
  yes ?
  <Tooltip {...tooltipProps}>
    { children }
  </Tooltip> :
  children

export default WithTooltip
