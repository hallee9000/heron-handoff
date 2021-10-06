import React, { Fragment } from 'react'
import cn from 'classnames'
import { withTranslation } from 'react-i18next'
import { ChevronDown } from 'react-feather'
import { withGlobalContextConsumer } from 'contexts/GlobalContext'
import Search from './Search'
import { getFlattenedFrames } from 'utils/frame'
import { getImageUrl, getBackgroundImageUrl } from 'utils/helper'

class Frames extends React.Component {
  constructor (props) {
    super(props)
    // show first page first frame initially
    const { pageId, frameId, frameImageUrl } = this.getFirstFrameMeta()
    this.state = {
      searchValue: '',
      collapsedPages: [],
      pageId,
      frameId,
      frameImageUrl
    }
  }
  getFirstFrameMeta = () => {
    const { pagedFrames, mode, isMock, onFrameChange } = this.props
    const pageId = Object.keys(pagedFrames)[0]
    const firstFrame = pagedFrames[pageId].frames[0]
    const frameId = firstFrame.id
    const frameImageUrl = getImageUrl(firstFrame, mode, isMock)
    onFrameChange(frameId, frameImageUrl, pageId)
    return { pageId, frameId, frameImageUrl }
  }
  changeFrameByIdProperty = prevProps => {
    const { pagedFrames, onFrameChange, globalSettings, mode, isMock } = this.props
    const { currentFrameId } = globalSettings
    const flattenedFrames = getFlattenedFrames(pagedFrames, false)
    const currentFrame = flattenedFrames.find(({id}) => id===currentFrameId)
    if (
      currentFrameId &&
      currentFrameId!==prevProps.globalSettings.currentFrameId &&
      currentFrame
    ) {
      const pageId = currentFrame.pageId
      const frameId = currentFrame.id
      const frameImageUrl = getImageUrl(currentFrame, mode, isMock)
      this.setState({
        pageId,
        frameId,
        frameImageUrl
      }, () => {
        onFrameChange(frameId, frameImageUrl, pageId)
      })
    }
  }
  handleFrameSelect = (frame, pageId) => {
    const { onFrameChange, mode, isMock } = this.props
    const frameImageUrl = getImageUrl(frame, mode, isMock)
    this.setState({
      pageId,
      frameId: frame.id,
      frameImageUrl
    })
    onFrameChange(frame.id, frameImageUrl, pageId)
  }
  togglePage = key => {
    const { collapsedPages } = this.state
    const index = collapsedPages.indexOf(key)
    const newExpandedPages = [...collapsedPages]
    index>=0 ? newExpandedPages.splice(index, 1) : newExpandedPages.push(key)
    this.setState({
      collapsedPages: newExpandedPages
    })
  }
  clearSearch = () => {
    this.setState({
      searchValue: ''
    })
  }
  handleSearchChange = e => {
    const searchValue = e.target.value
    this.setState({
      searchValue
    })
  }
  componentDidUpdate (prevProps) {
    const { onFrameChange } = this.props
    const { pageId, frameId, frameImageUrl } = this.state
    // when tab changing
    if (this.props.visible && (this.props.visible !== prevProps.visible)) {
      onFrameChange(frameId, frameImageUrl, pageId)
    }
    this.changeFrameByIdProperty(prevProps)
  }
  render () {
    const { pagedFrames, visible, mode, isMock } = this.props
    const { frameId, searchValue, collapsedPages } = this.state
    return (
      <Fragment>
        <Search
          visible={visible}
          value={searchValue}
          onChange={this.handleSearchChange}
          onClear={this.clearSearch}
        />
        <ul className={cn('list-container frames', {hide: !visible})}>
          {
            Object.keys(pagedFrames).map(key => {
              const frames = pagedFrames[key].frames.filter(({name}) => name.toLowerCase().includes(searchValue))
              return (
                <li key={key} className={cn('frames-page', {'frames-page-collapsed': collapsedPages.includes(key)})}>
                  <h4 onClick={() => this.togglePage(key)}>
                    <span>{pagedFrames[key].name}</span>
                    <ChevronDown size={16}/>
                  </h4>
                  <ul className="frames-items" style={{height: `${frames.length*70}px`}}>
                    {
                      frames
                        .map(
                          frame =>
                            <li
                              key={frame.id}
                              title={frame.name}
                              className={cn('list-item', {selected: frameId===frame.id})}
                              onClick={() => this.handleFrameSelect(frame, key)}
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
                </li>
              )
            })
          }
        </ul>
      </Fragment>
    )
  }
}

export default withGlobalContextConsumer(withTranslation('left')(Frames))
