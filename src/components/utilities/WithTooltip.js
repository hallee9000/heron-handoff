import React from 'react'
import Tooltip from 'rc-tooltip'

export default ({yes, tooltipProps, children}) =>
  yes ?
  <Tooltip {...tooltipProps}>
    { children }
  </Tooltip> :
  children
