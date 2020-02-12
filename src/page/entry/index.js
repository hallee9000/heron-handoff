import React, { createRef } from 'react'
import { withTranslation } from 'react-i18next'
import cn from 'classnames'
import { GitHub, Coffee, Eye, DollarSign, Package, X } from 'react-feather'
import Tooltip from 'rc-tooltip'
import SettingsContext from 'contexts/SettingsContext'
import Basic from './Basic'
import FramesSelect from './FramesSelect'
import Options from './Options'
import LangSetting from './LangSetting'
import { getMockFile } from 'api'
import { walkFile, getPagedFrames, getSelectedPagedFrames } from 'utils/helper'
import './entry.scss'

class Entry extends React.Component {
  framercnLogo = createRef()
  logo = createRef()
  state = {
    currentStep: 0,
    data: {},
    fileKey: '',
    pagedFrames: {},
    coffeeVisible: false,
    isDownloaded: false
  }
  gotoDemo = async e => {
    e && e.preventDefault()
    const fileData = await getMockFile()
    // get components and styles
    const { components, styles, exportSettings } = walkFile(fileData)
    const { onDataGot } = this.props
    const pagedFrames = getSelectedPagedFrames(getPagedFrames(fileData))
    onDataGot && onDataGot(fileData, components, styles, exportSettings, pagedFrames)
  }
  switchStep = (step, key, data, fileKey) => {
    const { fileKey: prevFileKey } = this.state
    this.setState({
      currentStep: step,
      [key]: data,
      fileKey: fileKey || prevFileKey
    })
    if (key==='pagedFrames') {
      const { onPagedFramesGot } = this.props
      onPagedFramesGot && onPagedFramesGot(data)
    }
  }
  goBack = step => {
    this.setState({
      currentStep: step
    })
  }
  toggleCoffee = e => {
    e.preventDefault()
    const { coffeeVisible, isDownloaded } = this.state
    this.setState({
      coffeeVisible: !coffeeVisible
    })
    if (coffeeVisible && isDownloaded) {
      this.setState({
        currentStep: 0,
        data: {},
        fileKey: '',
        pagedFrames: {},
        isDownloaded: false
      })
    }
  }
  handleDownloaded = () => {
    this.setState({
      isDownloaded: true,
      coffeeVisible: true
    })
  }
  componentDidMount () {
    // this.gotoDemo()
  }
  render() {
    const { onDataGot, t } = this.props
    const { currentStep, data, fileKey, pagedFrames, coffeeVisible, isDownloaded } = this.state
    return (
      <div className="app-entry">
        <div className="entry-container">
          <div className="entry-logo">
            <img class="hide" src={`${process.env.PUBLIC_URL}/figmacn-logo.svg`} alt="framercn logo" ref={this.framercnLogo}/>
            <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="logo" ref={this.logo}/>
          </div>
          {
            !isDownloaded &&
            <div className={cn('entry-block', {hide: coffeeVisible})}>
              <Basic
                formVisible={currentStep===0}
                onFinished={(data, fileKey) => this.switchStep(1, 'data', data, fileKey)}
                onEdit={() => this.goBack(0)}
              />
              <FramesSelect
                formVisible={currentStep===1}
                fileKey={fileKey}
                data={data}
                onFinished={data => this.switchStep(2, 'pagedFrames', data)}
                onEdit={() => this.goBack(1)}
              />
              <Options
                formVisible={currentStep===2}
                fileKey={fileKey}
                data={data}
                pagedFrames={pagedFrames}
                logo={this.logo}
                framercnLogo={this.framercnLogo}
                onFinished={onDataGot}
                onDownloaded={this.handleDownloaded}
              />
            </div>
          }
          <div className={cn('entry-coffee', {'entry-coffee-downloaded': isDownloaded, hide: !coffeeVisible})}>
            <X size={36} className="coffee-close" onClick={this.toggleCoffee}/>
            {
              isDownloaded &&
              <div className="coffee-congratulation">
                <Package size={36}/>
                <h2>{t('congratulation title')}</h2>
                <p>{t('congratulation description')}</p>
              </div>
            }
            <img src={require('./qrcode.jpg')} alt="coffee qrcode"/>
            <div className="coffee-or">Or</div>
            <a href="https://paypal.me/leadream" target="_blank" rel="noopener noreferrer"><DollarSign size={12}/> {t('paypal')}</a>
          </div>
          <div className="entry-footer">
            <SettingsContext.Consumer>
              {({globalSettings, changeGlobalSettings}) => (
                <LangSetting
                  globalSettings={globalSettings}
                  onSettingsChange={changeGlobalSettings}
                />
              )}
            </SettingsContext.Consumer>
            <span className="footer-stretch"/>
            <Tooltip overlay={t('github')} placement="top" align={{offset: [0, 3]}}>
              <a className="footer-item" href="https://github.com/leadream/figma-handoff" target="_blank" rel="noopener noreferrer"><GitHub size={14}/></a>
            </Tooltip>
            <Tooltip overlay={t('buy me a coffee')} placement="top" align={{offset: [0, 3]}}>
              <a className="footer-item" onClick={this.toggleCoffee} href="/"><Coffee size={14}/></a>
            </Tooltip>
            <Tooltip overlay={t('demo')} placement="top" align={{offset: [0, 3]}}>
              <a className="footer-item" onClick={this.gotoDemo} href="/"><Eye size={14}/></a>
            </Tooltip>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation('entry')(Entry)
