import React, { Fragment } from 'react'
import { withTranslation } from 'react-i18next'
import marked from 'marked'
import raw from "raw.macro"

const Changelog = ({t}) => {
  const changelog = raw("./changelog.md")
  return (
    <Fragment>
      <h2><span role="img" aria-label="New release">🎊</span> {t('changelog')}</h2>
      <div className="changelog-content" dangerouslySetInnerHTML={{__html: marked(changelog)}}/>
    </Fragment>
  )
}

export default withTranslation('header')(Changelog)
