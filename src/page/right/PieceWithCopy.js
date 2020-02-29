import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import Tooltip from 'rc-tooltip'
import { copySomething } from 'utils/helper'

const PieceWithCopy = ({text, className, onClick, t, props}) => {
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
  }
  return <Tooltip
    visible={visible}
    trigger={['click']}
    overlay={t('copied tip')}
    placement="top"
    transitionName="rc-tooltip-slide"
    {...props}
  >
    <span
      className={className}
      onClick={onClick}
      onDoubleClick={copySomething(text, afterCopy)}
    >
      { text }
    </span>
  </Tooltip>
}

export default withTranslation('utilities')(PieceWithCopy)
