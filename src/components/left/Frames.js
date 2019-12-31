import React from 'react'
import cn from 'classnames'
import { getUrlImage } from 'utils/helper'

export default class Frames extends React.Component {
  state = {
    selectedIndex: 0
  }
  handleFrameSelect = (index, frameId) => {
    const { onFrameChange } = this.props
    this.setState({ selectedIndex: index })
    onFrameChange && onFrameChange(frameId)
  }
  componentDidUpdate(prevProps) {
    const { frames } = this.props
    if (this.props.visible !== prevProps.visible) {
      this.handleFrameSelect(0, frames[0].id)
    }
  }
  render () {
    const { visible, frames, useLocalImages, images } = this.props
    const { selectedIndex } = this.state
    return (
      <ul className={cn('list-items list-frames', {hide: !visible})}>
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
                  style={{
                    backgroundImage: getUrlImage(frame.id, useLocalImages, images)
                  }}
                /> {frame.name}
              </li>
          ) :
          <li className="item-empty">本页没有 Frame</li>
        }
      </ul>
    )
  }
}
