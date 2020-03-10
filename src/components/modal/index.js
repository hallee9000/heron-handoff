import React from 'react'
import ReactDOM from 'react-dom'
import cn from 'classnames'
import { X } from 'react-feather'
import './modal.scss'

export default ({children, visible, onClose}) =>
  ReactDOM.createPortal(
    <div
      className={cn('modal-overlay', {'modal-hidden': !visible})}
      onClick={onClose}
    >
      <div className="modal">
        { children }
        <div className="modal-close" onClick={onClose}>
          <X size={20}/>
        </div>
      </div>
    </div>,
    document.getElementById('modal')
  )