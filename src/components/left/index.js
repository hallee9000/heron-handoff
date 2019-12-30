import React from 'react'
import cn from 'classnames'
import { WithTooltip } from 'utils/hoc'
import './left-sider.scss'

export default class LeftSider extends React.Component {
  state = {
    selectedIndex: 0,
    frames: [],
    pageIndex: 0,
    tabIndex: 0
  }
  initializeFrames = () => {
    const { pages } = this.props
    const { pageIndex } = this.state
    const frames = pages[pageIndex].children
      .filter(frame => frame.type==='FRAME')
    this.setState({ frames })
    if (frames.length) {
      // select first frame
      this.handleFrameSelect(0, frames[0].id)
    }
  }
  handlePageChange = e => {
    const pageIndex = e.target.value - 0
    this.setState({ pageIndex }, () => {
      this.initializeFrames()
    })
  }
  handleFrameSelect = (index, frameId) => {
    const { onFrameChange } = this.props
    const { pageIndex } = this.state
    this.setState({ selectedIndex: index })
    onFrameChange && onFrameChange(pageIndex, frameId)
  }
  handleComponentSelect = (index, frameId) => {
    const { onFrameChange } = this.props
    const { pageIndex } = this.state
    this.setState({ selectedIndex: index })
    onFrameChange && onFrameChange(pageIndex, frameId)
  }
  handleTabClick = (tabIndex) => {
    const { components } = this.props
    this.setState({ tabIndex })
    if (components.length) {
      // select first component
      this.handleComponentSelect(0, components[0].id)
    }
  }
  componentDidMount () {
    this.initializeFrames()
  }
  getImage = (id) => {
    const { isMock, images } = this.props
    return isMock ?
    `url(${process.env.PUBLIC_URL}/mock/${id.replace(':', '-')}.jpg)` :
    `url(${images[id]})`
  }
  render () {
    const { pages, components } = this.props
    console.log(components)
    const { selectedIndex, frames, tabIndex } = this.state
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
        <div className="left-sider-list">
          <div className="list-pages">
            <select className="input" onChange={this.handlePageChange}>
              {
                pages.map(
                  (page, index) =>
                    <option key={index} value={index}>{page.name}</option>
                )
              }
            </select>
          </div>
          <ul className={cn('list-items list-frames', {hide: tabIndex===1})}>
            {
              !!frames.length ?
              frames.map(
                (frame, index) =>
                  <li
                    key={frame.id}
                    className={cn({selected: selectedIndex===index})}
                    onClick={() => this.handleFrameSelect(index, frame.id)}
                  >
                    <div
                      className="item-thumbnail"
                      style={{backgroundImage: this.getImage(frame.id)}}
                    /> {frame.name}
                  </li>
              ) :
              <li className="item-empty">本页没有 Frame</li>
            }
          </ul>
          <ul className={cn('list-items list-components', {hide: tabIndex===0})}>
            {
              !!components.length ?
              components.map(
                (component, index) =>
                  <WithTooltip
                    key={component.id}
                    yes={!!component.description}
                    tooltipProps={{overlay: component.description, placement: 'right'}}
                  >                                  
                    <li
                      className={cn({selected: index===selectedIndex})}
                      onClick={() => this.handleComponentSelect(index, component.id)}
                    >
                      <div
                        className="item-thumbnail"
                        style={{backgroundImage: this.getImage(component.id)}}
                      /> {component.name}
                    </li>
                  </WithTooltip>
              ) :
              <li className="item-empty">没有组件</li>
            }
          </ul>
        </div>
      </div>
    )
  }
}
