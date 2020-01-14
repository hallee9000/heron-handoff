import React, { createRef } from 'react'
import cn from 'classnames'
import { CopiableInput, InputGroup } from 'components/utilities'
import { getFillsStyle, getEffectsStyle } from 'utils/style'
import { toFixed } from 'utils/mark'
import FillItem from './items/FillItem'
import EffectItem from './items/EffectItem'
import ExportItem from './items/ExportItem'
import StyleReference from './StyleReference'
import StyleDetail from './StyleDetail'
import FontPanel from './FontPanel'
import './right-props.scss'

export default class RightProps extends React.Component {
  propsSider = createRef()
  state = {
    hasEntered: false,
    flag: 0,
    fills: this.props.data.node.fills,
    exportSettings: [],
    isPieceSelected: false,
    detailVisible: false,
    currentStyle: {}
  }
  getExportSettings = () => {
    const { data, exportSettings } = this.props
    this.setState({
      exportSettings: exportSettings ?
        exportSettings
          .map((exportSetting, index) => ({...exportSetting, index}))
          .filter(({id}) => id===data.node.id) :
        []
    })
  }
  handleTextChange = (fills, pieceIndex) => {
    const { flag } = this.state
    this.setState({
      flag: 1-flag,
      fills,
      isPieceSelected: pieceIndex!==null
    })
  }
  toggleDetail = (type, selectedId) => {
    const { styles } = this.props
    const { detailVisible } = this.state
    const currentStyle = (type && !detailVisible) ?
      styles[type].find(({id}) => selectedId===id) :
      {}
    this.setState({
      currentStyle,
      detailVisible: !detailVisible
    })
  }
  componentDidUpdate(prevProps) {
    const { data, dissolved, onDissolveEnd } = this.props
    const { detailVisible } = this.state
    if (dissolved && dissolved!==prevProps.dissolved) {
      this.setState({
        hasEntered: false
      })
      detailVisible && this.toggleDetail()
      setTimeout(() => {
        onDissolveEnd && onDissolveEnd()
      }, 200)
    }
    // switch selected element
    if (data.index!==prevProps.data.index) {
      const { flag } = this.state
      this.setState({
        flag: 1-flag, 
        fills: data.node.fills
      })
      detailVisible && this.toggleDetail()
      this.getExportSettings()
    }
  }
  componentDidMount () {
    this.getExportSettings()
    setTimeout(() => {
      this.setState({
        hasEntered: true
      })
    }, 10)
  }
  render () {
    const { data, styles, useLocalImages } = this.props
    const { node } = data
    const { strokes, effects, styles: nodeStyles } = node
    const { hasEntered, fills, exportSettings, flag, isPieceSelected, detailVisible, currentStyle } = this.state
    const { styles: fillItems } = getFillsStyle(fills)
    const { styles: strokeItems } = getFillsStyle(strokes)
    const { styles: effectItems } = getEffectsStyle(effects)
    return (
      <div
        className={cn('main-right-props', {'main-right-props-entered': hasEntered})}
        key={data.index}
        ref={this.propsSider}
      >
        <div className={cn('right-props', {'right-props-hidden': detailVisible})}>
          <div className="props-section">
            <h5 className="section-title">{ node.name }</h5>
          </div>
          {/* position and size */}
          <div className="props-section props-basic">
            <h5 className="section-title">位置和尺寸</h5>
            <div className="section-items">
              <CopiableInput isQuiet label="X" defaultValue={ toFixed(data.left) }/>
              <CopiableInput isQuiet label="Y" defaultValue={ toFixed(data.top) }/>
              <CopiableInput isQuiet label="W" defaultValue={ toFixed(data.width) }/>
              <CopiableInput isQuiet label="H" defaultValue={ toFixed(data.height) }/>
              {
                data.opacity &&
                <CopiableInput isQuiet label="不透明度" defaultValue={ toFixed(data.opacity) }/>
              }
              {
                data.cornerRadius &&
                <CopiableInput isQuiet label="圆角" defaultValue={ toFixed(data.cornerRadius) }/>
              }
            </div>
          </div>
          {/* font */}
          {
            node.type==='TEXT' &&
            <FontPanel
              node={node}
              styles={styles}
              propsSider={this.propsSider.current}
              onSwitch={this.handleTextChange}
              onShowDetail={this.toggleDetail}
            />
          }
          {/* fills */}
          {
            !!(fillItems && fillItems.length) &&
            <div className="props-section props-fills">
              <h5 className="section-title">
                <span className="title-name">颜色</span>
                {
                  !isPieceSelected &&
                  <StyleReference
                    styleItems={fills}
                    styles={styles}
                    nodeStyles={nodeStyles}
                    type="fill"
                    onShowDetail={this.toggleDetail}
                  />
                }
              </h5>
              <ul className="section-items">
                {
                  fillItems.map((fillStyle, index) =>
                    <li className="item-block" key={index}>
                      <FillItem flag={flag} style={fillStyle}/>
                    </li>
                  )
                }
              </ul>
            </div>
          }
          {/* strokes */}
          {
            !!(strokeItems && strokeItems.length) &&
            <div className="props-section props-strokes">
              <h5 className="section-title">
                <span className="title-name">描边</span>
                <StyleReference
                  styleItems={strokes}
                  styles={styles}
                  nodeStyles={nodeStyles}
                  type="stroke"
                  onShowDetail={this.toggleDetail}
                />
              </h5>
              <ul className="section-items">
                {
                  strokeItems.map((strokeStyle, index) =>
                    <li className="item-block" key={index}>
                      <FillItem flag={flag} style={strokeStyle}/>
                    </li>
                  )
                }
              </ul>
              <InputGroup>
                <CopiableInput label="粗细" defaultValue={ node.strokeWeight }/>
                <CopiableInput label="位置" defaultValue={ node.strokeAlign.toLowerCase() }/>
              </InputGroup>
            </div>
          }
          {/* effects */}
          {
            !!(effects && effects.length) &&
            <div className="props-section props-effects">
              <h5 className="section-title">
                <span className="title-name">效果</span>
                <StyleReference
                  styleItems={effects}
                  styles={styles}
                  nodeStyles={nodeStyles}
                  type="effect"
                  onShowDetail={this.toggleDetail}
                />
              </h5>
              <ul className="section-items">
                {
                  effectItems.map((effectStyle, index) =>
                    <li className="item-block" key={index}>
                      <EffectItem flag={flag} style={effectStyle}/>
                    </li>
                  )
                }
              </ul>
            </div>
          }
          {/* export settings */}
          {
            !!(exportSettings && exportSettings.length) &&
            <div className="props-section props-export">
              <h5 className="section-title">
                <span className="title-name">切图</span>
              </h5>
              <ul className="section-items">
                {
                  exportSettings.map((exportSetting, index) =>
                    <li key={index}>
                      <ExportItem
                        exportSetting={exportSetting}
                        useLocalImages={useLocalImages}
                        index={exportSetting.index}
                      />
                    </li>
                  )
                }
              </ul>
            </div>
          }
        </div>
        <StyleDetail
          visible={detailVisible}
          onBack={this.toggleDetail}
          style={currentStyle}
        />
      </div>
    )
  }
}