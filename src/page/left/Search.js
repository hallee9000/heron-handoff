import React from 'react'
import cn from 'classnames'
import { X } from 'react-feather'
import { withTranslation } from 'react-i18next'

function Search ({visible, value, onChange, onClear, t}) {
  function resetInput () {
    onClear()
  }

  function handleKeyDown (e) {
    if (e.keyCode===27) {
      onClear()
    }
  }

  return (
    <div className={cn('list-filter', {hide: !visible})}>
      <input
        className="input"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={t('component placeholder')}
      />
      {
        value &&
        <X size={14} className="filter-clear" onClick={resetInput}/>
      }
    </div>
  )
}

export default withTranslation('left')(Search)
