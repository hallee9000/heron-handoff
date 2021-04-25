import React, { Fragment } from 'react'
import cn from 'classnames'
import { withTranslation } from 'react-i18next'
import FrameSelector from './FrameSelector'
// import { getUrlImage } from 'utils/helper'

class Frames extends React.Component {
  constructor (props) {
    super(props)
    const { onFrameChange } = props
    const pageId = Object.keys(props.pagedFrames)[0]
    const { frames, frameId } = this.getDefaultFrame(pageId)
    this.state = {
      pageId,
      frames,
      frameId
    }
    onFrameChange(frameId, pageId)
  }
  getDefaultFrame = (pageId) => {
    const { pagedFrames } = this.props
    const { frames } = pagedFrames[pageId]
    return {
      frames,
      frameId: frames[0].id
    }
  }
  handlePageChange = (pageId, frameId) => {
    const { onFrameChange } = this.props
    this.setState({
      pageId,
      frameId,
      frames: this.getDefaultFrame(pageId).frames
    }, () => {
      onFrameChange(frameId, pageId)
    })
  }
  handleFrameSelect = frameId => {
    const { onFrameChange } = this.props
    const { pageId } = this.state
    this.setState({ frameId })
    onFrameChange(frameId, pageId)
  }
  componentDidUpdate(prevProps) {
    const { onFrameChange } = this.props
    const { pageId, frameId } = this.state
    // when tab changing
    if (this.props.visible && (this.props.visible !== prevProps.visible)) {
      onFrameChange(frameId, pageId)
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

function getImage (item, mode, isMock) {
  return (mode==='local' || isMock) ?
    `${process.env.PUBLIC_URL}/data/${item.id.replace(/:/g, '-')}.png` :
    item.image.url
}

function getBackgroundImageUrl (item, mode, isMock) {
  return `url(${getImage(item, mode, isMock)})`
}

export default withTranslation('left')(Frames)
