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
import FontPanel from './FontPanel'
import './right-props.scss'

class RightProps extends React.Component {
  propsSider = createRef()
  state = {
    flag: 0,
    fills: this.props.elementData.node.fills,
    exportSettings: [],
    isPieceSelected: false,
    textStyle: {}
  }
  getExportSettings = () => {
    const { elementData, exportSettings, currentIndex, currentExportIds } = this.props
    this.setState({
      exportSettings: exportSettings ?
        exportSettings
          .map((exportSetting, index) => ({...exportSetting, index}))
          .filter(({id}) =>
            currentIndex===0 ? currentExportIds.indexOf(id)>-1 : id===elementData.node.id
          ) :
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
  handleStyleDetailShow = (type, selectedId) => {
    const { styles, onShowDetail } = this.props
    const styleDetail = styles[type].find(({id}) => selectedId===id)
    onShowDetail(styleDetail)
  }
  componentDidUpdate(prevProps) {
    const { elementData, detailVisible, onCloseDetail } = this.props
    // switch selected element
    if (elementData.index!==prevProps.elementData.index) {
      const { flag } = this.state
      this.setState({
        flag: 1-flag, 
        fills: elementData.node.fills
      })
      detailVisible && onCloseDetail()
      this.getExportSettings()
    }
  }
  componentDidMount () {
    this.getExportSettings()
  }
  render () {
    const {
      elementData,
      currentComponentName,
      styles,
      mode,
      isMock,
      globalSettings,
      onPropsPanelTransitionEnd,
      propsPanelState,
      t
    } = this.props
    const { node } = elementData
    const { strokes, effects, styles: nodeStyles } = node
    const { fills, exportSettings, flag, isPieceSelected, textStyle } = this.state
    const { styles: fillItems } = getFillsStyle(fills)
    const { styles: strokeItems } = getFillsStyle(strokes)
    const { styles: effectItems } = getEffectsStyle(effects)
    const code = getCode(node, fillItems, strokeItems, effectItems, textStyle, globalSettings)
    const styledCode = Prism.highlight(code, Prism.languages.css, 'css')
    return (
      <div
        className={cn('right-props', `right-props-${propsPanelState}`)}
        key={elementData.index}
        ref={this.propsSider}
        onTransitionEnd={onPropsPanelTransitionEnd}
      >
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
            <CopiableInput isQuiet label="X" value={ formattedNumber(elementData.left, globalSettings) }/>
            <CopiableInput isQuiet label="Y" value={ formattedNumber(elementData.top, globalSettings) }/>
            <CopiableInput isQuiet label="W" value={ formattedNumber(elementData.width, globalSettings) }/>
            <CopiableInput isQuiet label="H" value={ formattedNumber(elementData.height, globalSettings) }/>
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
          !!elementData.maskedBound &&
          <div className="props-section">
            <h5 className="section-title section-name">{t('masked element')}</h5>
            <p className="section-helper">{t('masked element tip')}</p>
          </div>
        }
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
            onShowStyleDetail={this.handleStyleDetailShow}
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
                  onShowStyleDetail={this.handleStyleDetailShow}
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
                onShowStyleDetail={this.handleStyleDetailShow}
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
                onShowStyleDetail={this.handleStyleDetailShow}
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
                      mode={mode}
                      isMock={isMock}
                      exportSetting={exportSetting}
                      index={exportSetting.index}
                    />
                  </li>
                )
              }
            </ul>
          </div>
        }
      </div>
    )
  }
}

export default withTranslation('right')(withGlobalSettings(RightProps))
