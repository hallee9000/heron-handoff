import React from 'react'
import './left-sider.scss'

class LeftSider extends React.Component {
  render () {
    const { pageData } = this.props
    return (
      <div className="main-left-sider">
        <ul className="left-sider-tabs">
          <li>页面</li>
          <li>组件</li>
          <li>样式</li>
        </ul>
        <div className="left-sider-pages">
          <div className="pages-selector">
            <select className="input">
              {
                pageData.children.map(
                  page =>
                    <option key={page.id} value={page.id}>{page.name}</option>
                )
              }
            </select>
          </div>
          <ul className="pages-frames">
            {
              pageData.children[0].children.map(
                frame =>
                  <li key={frame.id}>
                    <img src="/home.jpg"/> {frame.name}
                  </li>
              )
            }
          </ul>
        </div>
      </div>
    )
  }
}

export default LeftSider
