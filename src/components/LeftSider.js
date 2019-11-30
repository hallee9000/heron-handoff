import React from 'react'
import './left-sider.scss'

class LeftSider extends React.Component {
  render () {
    const { pageData } = this.props
    return (
      <div className="main-left-sider">
        <select className="left-sider-pages">
          {
            pageData.children.map(
              page =>
                <option key={page.id} value={page.id}>{page.name}</option>
            )
          }
        </select>
        <ul className="left-sider-frames">
          {
            pageData.children[0].children.map(
              frame =>
                <li key={frame.id}>{frame.name}</li>
            )
          }
        </ul>
      </div>
    )
  }
}

export default LeftSider
