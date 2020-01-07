import React from 'react'
import cn from 'classnames'
import './input-group.scss'

export default ({ children, className, hasDivider=true, isQuiet=false }) => {
  return <span
    className={
      cn(
        'input-group',
        className,
        {'input-group-divided': hasDivider},
        {'input-group-quiet': isQuiet}
      )
    }
  >
    { children }
  </span>
}
