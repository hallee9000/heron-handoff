import React, { useState } from 'react'
import cn from 'classnames'
import { relativeTime } from 'utils/date'

function Versions ({visible, versionData}) {
  const { versions, currentVersion, onVersionChange } = versionData
  const [current, setCurrent] = useState(currentVersion)

  function handleVersionChange (id) {
    setCurrent(id)
    onVersionChange(id)
  }

  return (
    <ul className={cn('panel-versions', {'hide': visible})}>
      {
        versions.map(v =>
          <li
            key={v.id}
            onClick={() => handleVersionChange(v.id)}
            className={cn({'version-selected': current===v.id})}
          >
            <div className="version-timeline"/>
            <h3 className="version-title">{ v.title || '暂无版本标题' }</h3>
            {
              v.note &&
              <p className="version-note">{ v.note }</p>
            }
            <p className="version-date">{ relativeTime(v.createdAt) }</p>
          </li>
        )
      }
    </ul>
  )
}

export default Versions
