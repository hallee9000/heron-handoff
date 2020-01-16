import React from 'react'
import ReactDOM from 'react-dom'
import cn from 'classnames'
import { X } from 'react-feather'
import './modal.scss'

export default class Modal extends React.Component {
  state = { visible: true }
  toggleVisible = () => {
    const { visible } = this.state
    this.setState({visible: !visible})
  }
  render() {
    const { children, visible: PropsVisible } = this.props
    const { visible } = this.state
    return ReactDOM.createPortal(
      <div className={cn('modal-overlay', {'modal-hidden': !(PropsVisible || visible)})}>
        <div className="modal">
          { children }
          <div className="modal-close" onClick={this.onClose}>
            <X size={20}/>
          </div>
        </div>
      </div>,
      document.getElementById('modal')
    )
  }
}
