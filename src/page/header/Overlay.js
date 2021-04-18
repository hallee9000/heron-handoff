import React from 'react'
import Tooltip from 'rc-tooltip'

const Overlay = ({ children, ...props }) =>
  <Tooltip
    trigger={['click']}
    overlayStyle={{width: 320}}
    align={{
      offset: [0, -10]
    }}
    placement="bottomRight"
    transitionName="rc-tooltip-slide"
    {...props}
  >
    { children }
  </Tooltip>

export default Overlay
