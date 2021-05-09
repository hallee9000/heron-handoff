import React from 'react'
import cn from 'classnames'
import { ChevronRight } from 'react-feather'
import Cascader from 'rc-cascader'
import { getFrameOptions, filterFrameOptions } from 'utils/helper'
import './frame-selector.scss'

class FrameSelector extends React.Component {
  defaultOptions = getFrameOptions(this.props.pagedFrames)
  state = {
    frameOptions: this.defaultOptions,
    selectedValue: [this.props.pageId, this.props.frameId],
    selectedText: `${this.defaultOptions[0].label} / ${this.defaultOptions[0].children[0].label}`,
    inputValue: '',
    activeValue: null
  }
  handleCascaderChange = (value, selectedOptions) => {
    const { onSelected } = this.props
    const { frameOptions } = this.state
    let selectedValue = value, selectedText = selectedOptions.map(o => o.label).join(' / ')
    if (value.length===1) {
      const selectedFrame = frameOptions.find(o => o.value===value[0]).children[0]
      selectedValue.push(selectedFrame.value)
      selectedText = [selectedText, selectedFrame.label].join(' / ')
    }
    this.setState({
      activeValue: null,
      selectedValue,
      selectedText
    })
    onSelected(...value)
  }
  handleInputChange = e => {
    const value = !!e ? e.target.value : ''
    this.setState({
      popupVisible: !!value,
      inputValue: value,
      frameOptions: value ? filterFrameOptions(this.defaultOptions, value) : this.defaultOptions
    })
  }
  handleKeyDown = e => {
    // press delete or space
    if (e.keyCode === 8 || e.keyCode === 32) {
      e.stopPropagation()
    }
    // press up or down
    if (e.keyCode === 38 || e.keyCode === 40) {
      const { frameOptions, selectedValue } = this.state
      if (!frameOptions.length) {
        e.stopPropagation()
      } else if (!this.getIfValueInOptions(selectedValue, frameOptions)) {
        // if selectedValue is not in current options
        // select the first frame when press up or down
        this.setState({
          selectedValue: [frameOptions[0].value, frameOptions[0].children[0].value],
          selectedText: `${frameOptions[0].label} / ${frameOptions[0].children[0].label}`,
          // remember selected value
          activeValue: selectedValue
        })
      }
    }
  }
  getIfValueInOptions = (selectedValue, frameOptions) => {
    const isPageInOptions = frameOptions.some(p => p.value === selectedValue[0])
    if (isPageInOptions) {
      const { children } = frameOptions.find(p => p.value === selectedValue[0])
      const isFrameInOptions = children.some(f => f.value === selectedValue[1])
      return isFrameInOptions
    } else {
      return false
    }
  }
  handlePopupVisibleChange = popupVisible => {
    this.setState({
      popupVisible
    }, () => {
      // reset frameOptions and inputValue when closing popup
      !popupVisible && this.handleInputChange()
      const { activeValue } = this.state
      if (!popupVisible && activeValue) {
        this.setState({
          selectedValue: activeValue,
          selectedText: this.getSelectedTextByValue(activeValue[0], activeValue[1])
        })
      }
    })
  }
  getSelectedTextByValue = (pageId, frameId) => {
    const page = this.defaultOptions.filter(p => p.value===pageId)[0]
    const frame = page.children.filter(f => f.value===frameId)[0]
    return `${page.label} / ${frame.label}`
  }
  componentDidUpdate(prevProps) {
    const { frameId, pageId: upcomingPageId } = this.props
    const { selectedValue } = this.state
    // when frame changing by sider click
    if (frameId !== prevProps.frameId && frameId !== selectedValue[1]) {
      const pageId = upcomingPageId!==selectedValue[0] ? upcomingPageId : selectedValue[0]
      this.setState({
        selectedValue: [pageId, frameId],
        selectedText: this.getSelectedTextByValue(pageId, frameId)
      })
    }
  }
  render () {
    const { frameOptions, selectedValue, selectedText, inputValue, popupVisible } = this.state
    return (
      <Cascader
        options={frameOptions}
        onChange={this.handleCascaderChange}
        changeOnSelect={true}
        expandIcon={<ChevronRight size={14}/>}
        value={selectedValue}
        popupVisible={popupVisible}
        onPopupVisibleChange={this.handlePopupVisibleChange}
        expandTrigger="hover"
        transitionName="slide-up"
      >
        <div className="frame-selector" title={selectedText}>
          {
            (!inputValue || !popupVisible) &&
            <div className="frame-selector-result">{selectedText}</div>
          }
          <input
            tabIndex="-1"
            className={cn('input', {'input-has-value': !!inputValue})}
            value={inputValue}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
          />
        </div>
      </Cascader>
    )
  }
}

export default FrameSelector
