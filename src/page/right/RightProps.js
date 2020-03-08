import React, { createRef } from 'react'
import cn from 'classnames'
import Prism from 'prismjs'
import { withTranslation } from 'react-i18next'
import { Copy } from 'react-feather'
import { withGlobalSettings } from 'contexts/SettingsContext'
import { CopiableInput, InputGroup, WithCopy } from 'components/utilities'
import { getFillsStyle, getEffectsStyle, formattedNumber, getCode } from 'utils/style'
import { toFixed } from 'utils/mark'
import { ColorFormatSelect, FillItem, EffectItem, ExportItem } from './items'
import StyleReference from './StyleReference'
import StyleDetail from './StyleDetail'
import FontPanel from './FontPanel'
import './right-props.scss'

class RightProps extends React.Component {
  propsSider = createRef()
  state = {
    hasEntered: false,
    flag: 0,
    fills: this.props.data.node.fills,
    exportSettings: [],
    isPieceSelected: false,
    detailVisible: false,
    currentStyle: {},
    textStyle: {}
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
  handleStyleGot = textStyle => {
    this.setState({textStyle})
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
    const { data, currentComponentName, styles, useLocalImages, globalSettings, t } = this.props
    const { node } = data
    const { strokes, effects, styles: nodeStyles } = node
    const { hasEntered, fills, exportSettings, flag, isPieceSelected, detailVisible, currentStyle, textStyle } = this.state
    const { styles: fillItems } = getFillsStyle(fills)
    const { styles: strokeItems } = getFillsStyle(strokes)
    const { styles: effectItems } = getEffectsStyle(effects)
    const code = getCode(node, fillItems, strokeItems, effectItems, textStyle, globalSettings)
    const styledCode = Prism.highlight(code, Prism.languages.css, 'css')
    return (
      <div
        className={cn('main-right-props', {'main-right-props-entered': hasEntered})}
        key={data.index}
        ref={this.propsSider}
      >
        <div className={cn('right-props', {'right-props-hidden': detailVisible})}>
          <div className="props-section">
            <h5 className="section-title section-name" title={node.name}>
              <span>{ node.name }</span>
              <ColorFormatSelect/>
            </h5>
          </div>
          {/* position and size */}
          <div className="props-section props-basic">
            <h5 className="section-title">{t('position and spacing')}</h5>
            <div className="section-items">
              <CopiableInput isQuiet label="X" value={ formattedNumber(data.left, globalSettings) }/>
              <CopiableInput isQuiet label="Y" value={ formattedNumber(data.top, globalSettings) }/>
              <CopiableInput isQuiet label="W" value={ formattedNumber(data.width, globalSettings) }/>
              <CopiableInput isQuiet label="H" value={ formattedNumber(data.height, globalSettings) }/>
              {
                node.opacity!==undefined &&
                <CopiableInput isQuiet label={t('opacity')} value={ toFixed(node.opacity) }/>
              }
              {
                node.cornerRadius &&
                <CopiableInput isQuiet label={t('radius')} value={ formattedNumber(node.cornerRadius, globalSettings) }/>
              }
            </div>
          </div>
          {
            node.isMask &&
            <div className="props-section">
              <h5 className="section-title section-name">{t('mask')}</h5>
            </div>
          }
          {
            node.type==='GROUP' &&
            <div className="props-section">
              <h5 className="section-title section-name">{t('group type')}</h5>
            </div>
          }
          {
            node.type==='SLICE' &&
            <div className="props-section">
              <h5 className="section-title section-name">{t('slice type')}</h5>
            </div>
          }
          {
            currentComponentName &&
            <div className="props-section">
              <h5 className="section-title section-name">{t('component')}: { currentComponentName }</h5>
            </div>
          }
          {/* font */}
          {
            node.type==='TEXT' &&
            <FontPanel
              node={node}
              styles={styles}
              propsSider={this.propsSider.current}
              onSwitch={this.handleTextChange}
              onGetStyle={this.handleStyleGot}
              onShowDetail={this.toggleDetail}
            />
          }
          {/* fills */}
          {
            !!(fillItems && fillItems.length) &&
            <div className="props-section props-fills">
              <h5 className="section-title">
                <span className="title-name">{t('fill')}</span>
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
                <span className="title-name">{t('stroke')}</span>
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
                <CopiableInput label={t('stroke weight')} value={ formattedNumber(node.strokeWeight, globalSettings) }/>
                {
                  node.strokeDashes &&
                  <CopiableInput
                    label={t('stroke dash')}
                    value={ node.strokeDashes.map(dash => formattedNumber(dash, globalSettings, true)).join() }
                  />
                }
                <CopiableInput label={t('stroke position')} value={ node.strokeAlign.toLowerCase() }/>
              </InputGroup>
            </div>
          }
          {/* effects */}
          {
            !!(effects && effects.length) &&
            <div className="props-section props-effects">
              <h5 className="section-title">
                <span className="title-name">{t('effect')}</span>
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
                      <EffectItem flag={flag} style={effectStyle} nodeType={node.type}/>
                    </li>
                  )
                }
              </ul>
            </div>
          }
          {
            code &&
            <div className="props-section props-code">
              <h5 className="section-title">{t('code')}</h5>
              <div className="section-items">
                <WithCopy text={code} className="code-copy">
                  <Copy size={14}/>
                </WithCopy>
                <pre className="code-box">
                  <code dangerouslySetInnerHTML={{__html: styledCode}}></code>
                </pre>
              </div>
            </div>
          }
          {/* export settings */}
          {
            !!(exportSettings && exportSettings.length) &&
            <div className="props-section props-export">
              <h5 className="section-title">
                <span className="title-name">{t('exported images')}</span>
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

export default withTranslation('right')(withGlobalSettings(RightProps))
