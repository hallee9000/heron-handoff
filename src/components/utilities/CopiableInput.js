import React, { useState } from 'react'
import cn from 'classnames'
import { onInputClick } from 'utils/helper'
import WithTooltip from './WithTooltip'
import './copiable-input.scss'

export default ({ label, type='input', isQuiet=false, ...otherProps }) => {
  const [ copied, setCopied ] = useState(false)
  const onCopied = () => {
    const timer = setTimeout(() => {
      setCopied(false)
      clearTimeout(timer)
    }, 1000)
  }
  const handleClick = e => {
    setCopied(true)
    onInputClick(e, onCopied)
  }
  return <span className={cn('copiable-input', {'copiable-input-quiet': isQuiet})}>
    {
      label &&
      <span className="copiable-label">{ label }</span>
    }
    <WithTooltip
      yes
      tooltipProps={{
        trigger: [],
        visible: copied,
        overlay: "复制成功！",
        placement: 'top',
        transitionName: 'rc-tooltip-slide'
      }}
    >
      {
        type==='input' ?
        <input readOnly={true} onClick={handleClick} {...otherProps}/> :
        <textarea readOnly={true} onClick={handleClick} {...otherProps}/>
      }
    </WithTooltip>
  </span>
}
