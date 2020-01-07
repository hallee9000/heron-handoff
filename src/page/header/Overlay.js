import React from 'react'
import cn from 'classnames'
import { X } from 'react-feather'

export default ({ children, visible, caretRight, onClose }) => {
  return (
    <div className={cn('header-overlay', {'header-overlay-visible': visible})}>
      <div className="overlay-caret" style={{right: caretRight}}/>
      { children }
      <div className="overlay-close" onClick={onClose}>
        <X size={16}/>
      </div>
    </div>
  )
}
