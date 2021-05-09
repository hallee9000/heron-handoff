import React, { Fragment, useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import marked from 'marked'
import changelog from './changelog.md';

const isModule = process.env.IS_MODULE

const Changelog = ({t}) => {
  const [changelogMD, setChangelogMD] = useState('')

  useEffect(() => {
    if (!isModule) {
      fetch(process.env.PUBLIC_URL + changelog)
        .then(response => response.text())
        .then(md => setChangelogMD(md))
    }
  }, [])

  return (
    <Fragment>
      <h2><span role="img" aria-label="New release">🎊</span> {t('changelog')}</h2>
      <div className="changelog-content" dangerouslySetInnerHTML={{__html: isModule ? changelog.html : marked(changelogMD)}}/>
    </Fragment>
  )
}

export default withTranslation('header')(Changelog)
