import React from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import App from '../App'

function Canvas ({isModule, pagedFrames, fileData, settings}) {
  return (
    <I18nextProvider i18n={i18n}>
      <App isModule={isModule} pagedFrames={pagedFrames} fileData={fileData} settings={settings}/>
    </I18nextProvider>
  )
}

export default Canvas
