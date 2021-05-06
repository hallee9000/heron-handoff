import React, { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import App from '../App'

function Canvas ({pagedFrames, fileData, exportSettings, settings, onHeaderBack, onFrameChange}) {
  useEffect(() => {
    document.body.classList.add('heron-handoff')
    return () => {
      document.body.classList.remove('heron-handoff')
    }
  })
  return (
    <I18nextProvider i18n={i18n}>
      <App
        isModule
        pagedFrames={pagedFrames}
        fileData={fileData}
        exportSettings={exportSettings}
        settings={settings}
        onHeaderBack={onHeaderBack}
        onFrameChange={onFrameChange}
      />
    </I18nextProvider>
  )
}

export default Canvas
