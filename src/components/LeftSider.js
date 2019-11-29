import React from 'react'


class LeftSider extends React.Component {
  render () {
    const { pageData } = this.props
    return (
      <div className="app-left-sider">
        {
          pageData.children.map(
            page =>
              <div key={page.id}>{page.name}</div>
          )
        }
      </div>
    )
  }
}

export default LeftSider
