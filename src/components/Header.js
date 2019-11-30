import React from 'react'
import './header.scss'

class Header extends React.Component {
  render () {
    const { pageData } = this.props
    return (
      <header className="app-header">
        <img className="header-logo" src="/logo.png"/>
        <span className="header-name">{pageData.children[0].name}</span>
      </header>
    )
  }
}

export default Header
