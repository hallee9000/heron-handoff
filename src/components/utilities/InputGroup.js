import React from 'react'
import cn from 'classnames'
import './input-group.scss'

export default ({ children, className, isQuiet=false }) => {
  return <span
    className={
      cn(
        'input-group',
        className,
        {'input-group-quiet': isQuiet}
      )
    }
  >
    { children }
  </span>
}
