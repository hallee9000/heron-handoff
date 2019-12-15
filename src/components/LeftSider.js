import React from 'react'
import cn from 'classnames'
import './left-sider.scss'

export default class LeftSider extends React.Component {
  state = {
    selectedIndex: 0,
    frames: [],
    components: [],
    tabIndex: 0
  }
  handleSelect = (index, id) => {
    const { onSelect } = this.props
    this.setState({ selectedIndex: index })
    onSelect && onSelect(id)
  }
  handleTabClick = (tabIndex) => {
    this.setState({ tabIndex })
  }
  componentDidMount () {
    const { pageData, onSelect } = this.props
    const frames = pageData.children[0].children
      .filter(frame => frame.type==='FRAME')
    const components = pageData.children[0].children
      .filter(frame => frame.type==='COMPONENT')
    this.setState({ frames, components })
    onSelect(frames[0].id)
  }
  render () {
    const { pageData } = this.props
    const { selectedIndex, frames, components, tabIndex } = this.state
    return (
      <div className="main-left-sider">
        <ul className="left-sider-tabs">
          <li
            className={cn({selected: tabIndex===0})}
            onClick={() => this.handleTabClick(0)}
          >页面</li>
          <li
            className={cn({selected: tabIndex===1})}
            onClick={() => this.handleTabClick(1)}
          >组件</li>
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
          <ul className={cn('pages-frames', {hide: tabIndex===1})}>
            {
              frames.map(
                (frame, index) =>
                  <li
                    key={frame.id}
                    className={cn({selected: selectedIndex===index})}
                    onClick={() => this.handleSelect(index, frame.id)}
                  >
                    <div className="frame-thumbnail" style={{backgroundImage: `url(/mock/${frame.id.replace(':', '-')}.jpg)`}}/> {frame.name}
                  </li>
              )
            }
          </ul>
          <ul className={cn('pages-components', {hide: tabIndex===0})}>
            {
              components.map(
                (component, index) =>
                  <li
                    key={component.id}
                    className={cn({selected: selectedIndex===index})}
                    onClick={() => this.handleSelect(index, component.id)}
                  >
                    <div className="component-thumbnail" style={{backgroundImage: `url(/mock/${component.id.replace(':', '-')}.jpg)`}}/> {component.name}
                  </li>
              )
            }
          </ul>
        </div>
      </div>
    )
  }
}
