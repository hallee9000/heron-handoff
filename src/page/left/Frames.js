import React, { Fragment } from 'react'
import cn from 'classnames'
import { withTranslation } from 'react-i18next'
import FrameSelector from './FrameSelector'
import { getImageUrl, getBackgroundImageUrl } from 'utils/helper'

class Frames extends React.Component {
  constructor (props) {
    super(props)
    const { onFrameChange } = props
    const pageId = Object.keys(props.pagedFrames)[0]
    const { frames, frameId, frameImageUrl } = this.getFrameMeta(pageId)
    this.state = {
      pageId,
      frames,
      frameId,
      frameImageUrl
    }
    onFrameChange(frameId, frameImageUrl, pageId)
  }
  getFrameMeta = (pageId, frameId) => {
    const { pagedFrames, mode, isMock } = this.props
    const { frames } = pagedFrames[pageId]
    const currentFrame = frameId ? frames.find(({id}) => id===frameId) : frames[0]
    const frameImageUrl = getImageUrl(currentFrame, mode, isMock)
    return {
      frames,
      frameId: currentFrame.id,
      frameImageUrl
    }
  }
  handlePageChange = (pageId, frameId) => {
    const { onFrameChange } = this.props
    const { frameImageUrl, frames } = this.getFrameMeta(pageId, frameId)
    this.setState({
      pageId,
      frameId,
      frames,
      frameImageUrl
    }, () => {
      onFrameChange(frameId, frameImageUrl, pageId)
    })
  }
  handleFrameSelect = frameId => {
    const { onFrameChange } = this.props
    const { pageId } = this.state
    const { frameImageUrl } = this.getFrameMeta(pageId, frameId)
    this.setState({ frameId })
    onFrameChange(frameId, frameImageUrl, pageId)
  }
  componentDidUpdate(prevProps) {
    const { onFrameChange } = this.props
    const { pageId, frameId, frameImageUrl } = this.state
    // when tab changing
    if (this.props.visible && (this.props.visible !== prevProps.visible)) {
      onFrameChange(frameId, frameImageUrl, pageId)
    }
  }
  render () {
    const { pagedFrames, visible, mode, isMock } = this.props
    const { frames, pageId, frameId } = this.state
    return (
      <Fragment>
        <div className={cn('list-filter', {hide: !visible})}>
          <FrameSelector
            pageId={pageId}
            frameId={frameId}
            pagedFrames={pagedFrames}
            onSelected={this.handlePageChange}
          />
        </div>
        <ul className={cn('list-items list-frames', {hide: !visible})}>
          {
            frames.map(
              frame =>
                <li
                  key={frame.id}
                  title={frame.name}
                  className={cn({selected: frameId===frame.id})}
                  onClick={() => this.handleFrameSelect(frame.id)}
                >
                  <div
                    className="item-thumbnail"
                    style={{
                      backgroundImage: getBackgroundImageUrl(frame, mode, isMock)
                    }}
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

export default withTranslation('left')(Frames)
