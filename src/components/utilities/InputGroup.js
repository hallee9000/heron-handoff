import React from 'react'
import cn from 'classnames'
import './input-group.scss'

export default ({ children, className, isQuiet=false, onWrapperClick }) => {
  return <span
    className={
      cn(
        'input-group',
        className,
        {'input-group-quiet': isQuiet}
      )
    }
    onClick={onWrapperClick}
  >
    { children }
  </span>
}
