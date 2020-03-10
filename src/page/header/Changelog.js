import React, { Fragment } from 'react'
import { withTranslation } from 'react-i18next'
import marked from 'marked'


class Changelog extends React.Component {
  state = {
    changelog: ''
  }
  componentDidMount () {
    fetch(`${process.env.PUBLIC_URL}/changelog.md`)
    .then(response => response.text())
      .then(changelog => {
        this.setState({changelog})
      })
  }
  render () {
    const { t } = this.props
    const { changelog } = this.state
    return (
      <Fragment>
        <h2><span role="img" aria-label="New release">🎊</span> {t('changelog')}</h2>
        <div className="changelog-content" dangerouslySetInnerHTML={{__html: marked(changelog)}}/>
      </Fragment>
    )
  }
}

export default withTranslation('header')(Changelog)
