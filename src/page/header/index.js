import React, { Fragment } from 'react'
import { withTranslation } from 'react-i18next'
import { FileText, Settings, HelpCircle, MessageCircle, ChevronLeft } from 'react-feather'
import Overlay from './Overlay'
import SettingsPanel from './Settings'
import Changelog from './Changelog'
import './header.scss'

class Header extends React.Component {
  hasNames = () => {
    const { pageName, frameName } = this.props
    return !!(pageName && frameName)
  }
  render () {
    const { mode, documentName, pageName, frameName, isComponent, onBack, links, t } = this.props
    const { docs, feedback } = links
    const logoVisible = mode==='local' ? true : !this.hasNames()
    return (
      <header className="app-header">
        {
          logoVisible ?
          <a
            className="header-logo"
            href="https://heron.design"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="logo" ref={this.logo}/>
          </a> :
          <span className="header-back" onClick={onBack}>
            <ChevronLeft size={24}/>
          </span>
        }
        <span className="header-filename">{documentName}</span>
        <span className="header-space"/>
        {
          this.hasNames() ?
          <span className="header-pagename">
            {
              !isComponent &&
              <Fragment>{pageName}<span> / </span></Fragment>
            }
            {frameName}
          </span> :
          <span className="header-pagename">Heron Handoff</span>
        }
        <div className="header-operates">
          {
            this.hasNames() &&
            <Overlay
              overlay={
                <SettingsPanel/>
              }
              overlayClassName="header-overlay header-overlay-settings"
            >
              <span title={t('settings')}>
                <Settings size={14}/>
              </span>
            </Overlay>
          }
          <Overlay
            trigger={['click']}
            overlay={<Changelog mode={mode}/>}
            align={{
              offset: [30, -10]
            }}
            overlayClassName="header-overlay header-overlay-changelog"
          >
            <span title={t('changelog')}>
              <FileText size={14}/>
            </span>
          </Overlay>
          <a title={t('help')} href={docs || t('help link')} target="_blank" rel="noopener noreferrer">
            <HelpCircle size={14}/>
          </a>
          <a title={t('feedback')} href={feedback || 'https://github.com/leadream/heron-handoff/issues'} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={14}/>
          </a>
        </div>
      </header>
    )
  }
}

export default withTranslation('header')(Header)
