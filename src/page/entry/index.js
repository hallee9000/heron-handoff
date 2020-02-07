import React, { createRef } from 'react'
import { withTranslation } from 'react-i18next'
import { GitHub, Coffee, Eye, Globe } from 'react-feather'
import Tooltip from 'rc-tooltip'
import Basic from './Basic'
import FramesSelect from './FramesSelect'
import Options from './Options'
import { getMockFile } from 'api'
import { walkFile, getPagedFrames, getSelectedPagedFrames } from 'utils/helper'
import './entry.scss'

const languages = {
  en: 'English',
  zh: '中文'
}

class Entry extends React.Component {
  logo = createRef()
  state = {
    currentStep: 0,
    data: {},
    fileKey: '',
    pagedFrames: {},
    language: 'en'
  }
  gotoDemo = async e => {
    e.preventDefault()
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
  changeLanguage = e => {
    e.preventDefault()
    const { i18n } = this.props
    const { value } = e.target
    this.setState({language: value}, () => {
      i18n.changeLanguage(value)
    })
  }
  render() {
    const { onDataGot, t } = this.props
    const { currentStep, data, fileKey, pagedFrames, language } = this.state
    return (
      <div className="app-entry">
        <div>
          <div className="entry-logo">
            <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="logo" ref={this.logo}/>
          </div>
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
            onFinished={onDataGot}
          />
          <div className="entry-footer">
            <Tooltip overlay="Change Language" placement="top" align={{offset: [0, 3]}}>
              <a className="footer-language" onClick={this.changeLanguage} href="/">
                <select value={language} onChange={this.changeLanguage}>
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                </select>
                <Globe size={14}/>
                <span>{languages[language]}</span>
              </a>
            </Tooltip>
            <span className="footer-stretch"/>
            <Tooltip overlay="GitHub 源码" placement="top" align={{offset: [0, 3]}}>
              <a className="footer-item" href="https://github.com/leadream/figma-handoff" target="_blank" rel="noopener noreferrer"><GitHub size={14}/></a>
            </Tooltip>
            <Tooltip overlay={t('buy me a coffee')} placement="top" align={{offset: [0, 3]}}>
              <a className="footer-item" onClick={this.gotoDemo} href="/"><Coffee size={14}/></a>
            </Tooltip>
            <Tooltip overlay="查看 Demo" placement="top" align={{offset: [0, 3]}}>
              <a className="footer-item" onClick={this.gotoDemo} href="/"><Eye size={14}/></a>
            </Tooltip>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(Entry)
