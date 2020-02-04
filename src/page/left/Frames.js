import React, { Fragment } from 'react'
import cn from 'classnames'
import { getUrlImage } from 'utils/helper'

export default class Frames extends React.Component {
  constructor (props) {
    super(props)
    const pageId = this.getDefaultPageId(props)
    const { frames, frameId } = this.getDefaultFrame(pageId)
    this.state = {
      pageId,
      frames,
      frameId
    }
  }
  getDefaultPageId = props => {
    const { pagedFrames } = props
    return Object.keys(pagedFrames)[0]
  }
  getDefaultFrame = pageId => {
    const { pagedFrames } = this.props
    const { frames } = pagedFrames[pageId]
    return {
      frames,
      frameId: frames[0].id
    }
  }
  handlePageChange = e => {
    const pageId = e.target.value
    this.setState({ pageId }, () => {
      this.initializeFrames()
    })
  }
  handleFrameSelect = frameId => {
    const { onFrameChange } = this.props
    const { pageId } = this.state
    this.setState({ frameId })
    onFrameChange && onFrameChange(frameId, pageId)
  }
  initializeFrames = () => {
    const { onFrameChange } = this.props
    const { pageId } = this.state
    const { frames, frameId } = this.getDefaultFrame(pageId)
    this.setState({ frameId, frames }, () => {
      // select first frame
      onFrameChange && onFrameChange(frameId, pageId)
    })
  }
  componentDidUpdate(prevProps) {
    const { onFrameChange } = this.props
    const { pageId, frameId } = this.state
    // when tab or page change
    if (this.props.visible && (this.props.visible !== prevProps.visible)) {
      onFrameChange && onFrameChange(frameId, pageId)
    }
  }
  componentDidMount () {
    this.initializeFrames()
  }
  render () {
    const { pagedFrames, visible, useLocalImages, images } = this.props
    const { frames, pageId, frameId } = this.state
    return (
      <Fragment>
        <div className={cn('list-pages', {hide: !visible})}>
          <select className="input" value={pageId} onChange={this.handlePageChange}>
            {
              Object.keys(pagedFrames)
                .map(
                  (pageId, index) =>
                    <option key={index} value={pageId}>{ pagedFrames[pageId].name }</option>
                )
            }
          </select>
        </div>
        <ul className={cn('list-items list-frames', {hide: !visible})}>
          {
            frames.map(
              frame =>
                <li
                  key={frame.id}
                  className={cn({selected: frameId===frame.id})}
                  onClick={() => this.handleFrameSelect(frame.id)}
                >
                  <div
                    className="item-thumbnail"
                    style={{
                      backgroundImage: getUrlImage(frame.id, useLocalImages, images)
                    }}
                    title={frame.name}
                  />
                  <span>{frame.name}</span>
                </li>
            )
          }
        </ul>
      </Fragment>
    )
  }
}
