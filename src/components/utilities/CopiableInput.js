import React, { useState, useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import cn from 'classnames'
import { onInputClick } from 'utils/helper'
import WithTooltip from './WithTooltip'
import './copiable-input.scss'

const CopiableInput = ({ label, type='input', title, style, inputClass, isQuiet=false, labelWidth, onWrapperClick, value, t }) => {
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
  return <span
    key={value}
    title={title}
    className={cn('copiable-input', {'copiable-input-quiet': isQuiet})}
    onClick={onWrapperClick}
  >
    {
      label &&
      <span className="copiable-label" style={{width: labelWidth}}>{ label }</span>
    }
    <WithTooltip
      yes
      tooltipProps={{
        trigger: [],
        visible: copied,
        overlay: t('copied tip'),
        placement: 'top',
        transitionName: 'rc-tooltip-slide'
      }}
    >
      {
        type==='input' ?
        <input readOnly={true} onClick={handleClick} defaultValue={value} style={style} className={inputClass}/> :
        <textarea readOnly={true} onClick={handleClick} defaultValue={value} style={style} className={inputClass}/>
      }
    </WithTooltip>
  </span>
}

export default withTranslation('utilities')(CopiableInput)
