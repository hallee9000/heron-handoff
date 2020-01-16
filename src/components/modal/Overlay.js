import React, { createRef, Fragment, Children, cloneElement } from 'react'
import { createPortal } from 'react-dom'
import cn from 'classnames'
import { X } from 'react-feather'
import './overlay.scss'

const triggerRef = createRef()

export default ({ children, overlay, visible, onClose }) => {
  const trigger = cloneElement(Children.only(children), {ref: triggerRef})
  const { right, width } = triggerRef.current ? triggerRef.current.getBoundingClientRect() : {}
  return <Fragment>
    { trigger }
    {
      createPortal(
        <div
          className={cn('overlay', {'overlay-visible': visible})}
          onClick={onClose}
        >
          <div className="overlay-content" onClick={e => e.stopPropagation()}>
            <div className="overlay-caret" style={{right: window.outerWidth-(right||0)+(width||0)/2-14}}/>
            { overlay }
            <div className="overlay-close" onClick={onClose}>
              <X size={16}/>
            </div>
          </div>
        </div>,
        document.getElementById('modal')
      )
    }
  </Fragment>
}
