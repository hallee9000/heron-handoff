import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import { onInputClick } from 'utils/helper'
import WithTooltip from './WithTooltip'
import './copiable-input.scss'

export default ({ label, type='input', isQuiet=false, onWrapperClick, value, ...otherProps }) => {
  const [ copied, setCopied ] = useState(false)
  const [ timer, setTimer ] = useState()
  const onCopied = () => {
    let timer = setTimeout(() => {
      setCopied(false)
      clearTimeout(timer)
    }, 1000)
    setTimer(timer)
  }
  const handleClick = e => {
    setCopied(true)
    onInputClick(e, onCopied)
  }
  useEffect(() => {
    return () => {
      // clear when will unmount
      timer!==undefined && clearTimeout(timer)
    }
  }, [timer])
  return <span key={value} className={cn('copiable-input', {'copiable-input-quiet': isQuiet})} onClick={onWrapperClick}>
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
        <input readOnly={true} onClick={handleClick} defaultValue={value} {...otherProps}/> :
        <textarea readOnly={true} onClick={handleClick} defaultValue={value} {...otherProps}/>
      }
    </WithTooltip>
  </span>
}
