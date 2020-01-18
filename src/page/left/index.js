import React from 'react'
import cn from 'classnames'
import Frames from './Frames'
import Components from './Components'
import './left-sider.scss'

export default class LeftSider extends React.Component {
  state = {
    frames: [],
    tabIndex: 0,
    pageIndex: 0
  }
  initializeFrames = () => {
    const { pages } = this.props
    const { pageIndex } = this.state
    const frames = pages[pageIndex].children
      .filter(frame => frame.type==='FRAME')
    this.setState({ frames })
    if (frames.length) {
      // select first frame
      this.onItemChange(frames[0].id, 'frame')
    }
  }
  handleTabClick = (index) => {
    const { tabIndex } = this.state
    if (tabIndex===index) return
    this.setState({ tabIndex: index })
  }
  handlePageChange = e => {
    const pageIndex = e.target.value - 0
    this.setState({ pageIndex }, () => {
      this.initializeFrames()
    })
  }
  onItemChange = (id, type) => {
    const { onFrameOrComponentChange } = this.props
    const { pageIndex } = this.state
    onFrameOrComponentChange && onFrameOrComponentChange(id, pageIndex, type)
  }
  componentDidMount () {
    this.initializeFrames()
  }
  render () {
    const { pages, components, useLocalImages, images } = this.props
    const { frames, tabIndex, pageIndex } = this.state
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
          {
            tabIndex===0 &&
            <div className="list-pages">
              <select className="input" value={pageIndex} onChange={this.handlePageChange}>
                {
                  pages.map(
                    (page, index) =>
                      <option key={index} value={index}>{page.name}</option>
                  )
                }
              </select>
            </div>
          }
          <Frames
            key={pageIndex}
            visible={tabIndex===0}
            frames={frames}
            useLocalImages={useLocalImages}
            images={images}
            onFrameChange={id => this.onItemChange(id, 'frame')}
          />
          <Components
            visible={tabIndex===1}
            components={components}
            useLocalImages={useLocalImages}
            images={images}
            onComponentChange={id => this.onItemChange(id, 'component')}
          />
        </div>
      </div>
    )
  }
}
