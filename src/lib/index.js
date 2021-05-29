import React, { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { withGlobalContextProvider } from 'contexts/GlobalContext'
import i18n from '../i18n'
import App from '../App'

function Canvas ({
  pagedFrames,
  fileData,
  exportSettings,
  settings,
  onHeaderBack,
  links,
  currentFrameId,
  changeGlobalData
}) {

  useEffect(() => {
    document.body.classList.add('heron-handoff')
    return () => {
      document.body.classList.remove('heron-handoff')
    }
  })

  useEffect(() => {
    changeGlobalData('currentFrameId', currentFrameId)
  }, [currentFrameId])

  return (
    <I18nextProvider i18n={i18n}>
      <App
        isModule
        pagedFrames={pagedFrames}
        fileData={fileData}
        exportSettings={exportSettings}
        settings={settings}
        onHeaderBack={onHeaderBack}
        links={links}
      />
    </I18nextProvider>
  )
}

export default withGlobalContextProvider(Canvas)
