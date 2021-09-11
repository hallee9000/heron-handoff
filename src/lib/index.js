import React, { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { withGlobalContextProvider } from 'contexts/GlobalContext'
import i18n from '../i18n'
import App from '../App'

const ContextedApp = withGlobalContextProvider(App)

function Canvas ({
  pagedFrames,
  fileData,
  exportSettings,
  settings,
  onHeaderBack,
  links,
  currentFrameId,
  versions,
  currentVersion,
  onVersionChange
}) {

  useEffect(() => {
    document.body.classList.add('heron-handoff')
    return () => {
      document.body.classList.remove('heron-handoff')
    }
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <ContextedApp
        isModule
        pagedFrames={pagedFrames}
        fileData={fileData}
        exportSettings={exportSettings}
        settings={{...settings, currentFrameId}}
        onHeaderBack={onHeaderBack}
        links={links}
        versionData={{
          versions,
          currentVersion,
          onVersionChange
        }}
      />
    </I18nextProvider>
  )
}

export default Canvas
