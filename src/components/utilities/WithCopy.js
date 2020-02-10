import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import Tooltip from 'rc-tooltip'
import { copySomething } from 'utils/helper'

const WithCopy = ({children, text, className, callback, t, props}) => {
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
    overlay={t('copied tip')}
    placement="top"
    transitionName="rc-tooltip-slide"
    {...props}
  >
    <span className={className} onClick={copySomething(text, afterCopy)}>
      { children }
    </span>
  </Tooltip>
}

export default withTranslation('utilities')(WithCopy)
