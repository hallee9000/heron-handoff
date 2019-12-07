import React from 'react'
import './header.scss'

class Header extends React.Component {
  render () {
    const { name } = this.props
    return (
      <header className="app-header">
        <img className="header-logo" src="/logo.png" alt="logo"/>
        <span className="header-name">{name}</span>
      </header>
    )
  }
}

export default Header
