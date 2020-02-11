import React, { Fragment } from 'react'
import { withTranslation } from 'react-i18next'

const Exported = ({t}) =>
  <Fragment>
    <h3><span role="img" aria-label="Congratulations">🎉</span> {t('marked zip downloaded tip')}</h3>
    <p>{t('marked zip downloaded description')}</p>
  </Fragment>

export default withTranslation('header')(Exported)
