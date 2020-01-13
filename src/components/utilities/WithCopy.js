import React, { useState } from 'react'
import Tooltip from 'rc-tooltip'
import { copySomething } from 'utils/helper'

export default ({children, text, className, callback, props}) => {
  const [ visible, setVisible ] = useState(false)
  const onCopied = () => {
    const timer = setTimeout(() => {
      setVisible(false)
      clearTimeout(timer)
    }, 1000)
  }
  const afterCopy = () => {
    setVisible(true)
    onCopied()
    callback && callback()
  }
  return <Tooltip
    visible={visible}
    trigger={['click']}
    overlay="复制成功！"
    placement="top"
    transitionName="rc-tooltip-slide"
    {...props}
  >
    <span className={className} onClick={copySomething(text, afterCopy)}>
      { children }
    </span>
  </Tooltip>
}
