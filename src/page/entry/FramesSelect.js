import React from 'react'
import cn from 'classnames'
import { ArrowDown, ChevronDown } from 'react-feather'
import Title from './Title'
import { getPagedFrames, getSelectedPagedFrames, getFlattedFrames } from 'utils/helper'
import './framesSelect.scss'

export default class FramesSelect extends React.Component {
  state = {
    editable: false,
    allSelected: true,
    errorMessage: '',
    pagedFrames: {}
  }
  handleFramesSelect = (e, pageId) => {
    const { checked, value } = e.target
    const { pagedFrames } = this.state
    const parsedValue = JSON.parse(value)
    const index = pagedFrames[pageId].frames
      .findIndex(({id}) => id===parsedValue.id)
    pagedFrames[pageId].frames[index].checked = checked
    this.setState({
      pagedFrames
    }, () => {
      this.setPageSelectStatus(pageId, pagedFrames[pageId].frames)
    })
  }
  handlePageSelect = e => {
    const { checked, value } = e.target
    const { pagedFrames } = this.state
    const frames = pagedFrames[value].frames
      .map(frame => ({...frame, checked}))
    pagedFrames[value].checked = checked
    pagedFrames[value].frames = frames
    this.setState({
      pagedFrames
    }, () => {
      this.setAllSelectStatus()
    })
  }
  setPageSelectStatus = (pageId, frames) => {
    const { pagedFrames } = this.state
    const checkedFrames = frames
      .filter(({checked}) => checked)
    pagedFrames[pageId].checked = checkedFrames.length === frames.length
    this.setState({
      pagedFrames
    }, () => {
      this.setAllSelectStatus()
    })
  }
  handleAllSelect = e => {
    const { checked } = e.target
    const { pagedFrames } = this.state
    Object.keys(pagedFrames)
      // eslint-disable-next-line
      .map(pageId => {
        pagedFrames[pageId].checked = checked
        pagedFrames[pageId].frames
          // eslint-disable-next-line
          .map((frame, index) => {
            pagedFrames[pageId].frames[index] = {...frame, checked}
          })
      })
    this.setState({
      allSelected: checked,
      pagedFrames
    })
  }
  setAllSelectStatus = () => {
    const { pagedFrames } = this.state
    const ids = Object.keys(pagedFrames)
    const checkedIds = ids.filter(pageId => pagedFrames[pageId].checked)
    this.setState({
      allSelected: checkedIds.length === ids.length
    })
  }
  setPagedFrames = () => {
    const { data } = this.props
    const pagedFrames = getPagedFrames(data)
    this.setState({
      pagedFrames,
      allSelected: true
    })
  }
  handleCollapse = pageId => {
    const { pagedFrames } = this.state
    pagedFrames[pageId].isCollapsed = !pagedFrames[pageId].isCollapsed
    this.setState({ pagedFrames })
  }
  handleSubmit = () => {
    const { onFinished } = this.props
    const { pagedFrames } = this.state
    const selectedFrames = getFlattedFrames(pagedFrames)
    if (!selectedFrames.length) {
      this.setState({ errorMessage: '请至少选择一个 Frame' })
      return
    }
    this.setState({ editable: true })
    onFinished && onFinished(getSelectedPagedFrames(pagedFrames))
  }
  getCheckedRatio = frames => {
    const checkedNum = frames.filter(({checked}) => checked).length
    return ` (${checkedNum}/${frames.length})`
  }
  componentDidUpdate (prevProps) {
    if (this.props.fileKey !== prevProps.fileKey) {
      this.setPagedFrames()
    } else {
      if (this.props.data.lastModified !== prevProps.data.lastModified) {
        this.setPagedFrames()
      }
    }
    if (this.props.formVisible && (this.props.formVisible !== prevProps.formVisible)) {
      this.setState({
        editable: false
      })
    }
  }
  render() {
    const { formVisible, onEdit } = this.props
    const { errorMessage, editable, pagedFrames, allSelected } = this.state
    const selectedFrames = getFlattedFrames(pagedFrames)
    const results = getSelectedPagedFrames(pagedFrames)
    return (
      <div className="entry-block entry-selection">
        <Title
          step={2}
          content="选择 Frame"
          editable={editable}
          hasBottom={formVisible || editable}
          onEdit={onEdit}
        />
        <div className={cn('form entry-form', {'form-visible': formVisible})}>
          <div className={cn('form-item', {'has-error': !!errorMessage})}>
            <div className="selection-frames">
              {
                Object.keys(pagedFrames)
                  .map(pageId => {
                    const { isCollapsed, name, frames, checked } = pagedFrames[pageId]
                    return !frames.length ?
                    null :
                    <ul key={pageId} className={cn('frames-page', {'frames-page-collapsed': isCollapsed})}>
                      <li className="frames-header">
                        <span className="header-caret" onClick={() => this.handleCollapse(pageId)}><ChevronDown size={14}/></span>
                        <label>
                          <input
                            type="checkbox"
                            value={pageId}
                            checked={checked}
                            onChange={this.handlePageSelect}
                          />
                          { name }{ this.getCheckedRatio(frames) }
                        </label>
                      </li>
                      <li className="frames-items" style={{height: 24*frames.length}}>
                        {
                          frames.map(({id, name, checked}, index) =>
                            <label key={index} className="frames-item">
                              <input
                                type="checkbox"
                                name="frame"
                                value={JSON.stringify({id, name})}
                                checked={checked}
                                onChange={e => this.handleFramesSelect(e, pageId)}
                              /> { name }
                            </label>
                          )
                        }
                      </li>
                    </ul>
                  })
              }
            </div>
            <div className="selection-all-select">
              <label>
                <input type="checkbox" checked={allSelected} onChange={this.handleAllSelect}/> 全选
              </label>
            </div>
            {
              !selectedFrames.length && errorMessage &&
              <div className="help-block">{ errorMessage }</div>
            }
          </div>
          <div className="form-item form-item-right">
            <button
              className="btn btn-lg btn-primary btn-round"
              onClick={this.handleSubmit}
            >
              <ArrowDown size={16}/>
            </button>
          </div>
        </div>
        {
          !formVisible && editable &&
          <div className="selection-selected">
            {
              Object.keys(results)
                .map(pageId =>
                  <section key={pageId} className="selected-section">
                    <h5 className="section-title">{ results[pageId].name }</h5>
                    <div className="section-items">
                      {
                        results[pageId].frames
                          .map(({id, name}) =>
                            <span key={id} className="section-item">{ name }</span>
                          )
                      }
                    </div>
                  </section>
                )
            }
          </div>
        }
      </div>
    )
  }
}
