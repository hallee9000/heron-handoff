import React, { Fragment } from 'react'
import cn from 'classnames'
import { withTranslation } from 'react-i18next'
import { FileText, Settings, HelpCircle, MessageCircle, ChevronLeft } from 'react-feather'
import SettingsContext from 'contexts/SettingsContext'
import Overlay from './Overlay'
import MarkSettings from './Settings'
import Changelog from './Changelog'
import './header.scss'

class Header extends React.Component {
  hasNames = () => {
    const { pageName, frameName } = this.props
    return !!(pageName && frameName)
  }
  render () {
    const { isLocal, documentName, pageName, frameName, isComponent, onBack, t } = this.props
    const logoHidden = this.hasNames()
    return (
      <header className="app-header">
        <span className={cn('header-back', {'hide': !logoHidden || isLocal})} onClick={onBack}>
          <ChevronLeft size={24}/>
        </span>
        <a
          className={cn('header-figmacn-logo', {'hide': logoHidden})}
          href="https://figmacn.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={`${process.env.PUBLIC_URL}/figmacn-logo.svg`} alt="figmacn logo" ref={this.figmacnLogo}/>
        </a>
        <div className={cn('header-divider', {'hide': logoHidden})}/>
        <a
          className={cn('header-logo', {'hide': logoHidden && !isLocal})}
          href="https://figmacn.com/handoff"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="logo" ref={this.logo}/>
        </a>
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
          <span className="header-pagename">Juuust Handoff</span>
        }
        <div className="header-operates">
          {
            this.hasNames() &&
            <Overlay
              overlay={
                <SettingsContext.Consumer>
                  {({globalSettings, changeGlobalSettings}) => (
                    <MarkSettings
                      globalSettings={globalSettings}
                      onSettingsChange={changeGlobalSettings}
                    />
                  )}
                </SettingsContext.Consumer>
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
            overlay={<Changelog/>}
            align={{
              offset: [30, -10]
            }}
            overlayClassName="header-overlay header-overlay-changelog"
          >
            <span title={t('changelog')}>
              <FileText size={14}/>
            </span>
          </Overlay>
          <a title={t('help')} href={t('help link')} target="_blank" rel="noopener noreferrer">
            <HelpCircle size={14}/>
          </a>
          <a title={t('feedback')} href="https://github.com/leadream/figma-handoff/issues" target="_blank" rel="noopener noreferrer">
            <MessageCircle size={14}/>
          </a>
        </div>
      </header>
    )
  }
}

export default withTranslation('header')(Header)
