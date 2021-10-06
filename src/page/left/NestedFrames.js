import React, { useEffect, useMemo, useState } from 'react'
import { Sidebar, Folder, FileText, ChevronDown } from 'react-feather'
import cn from 'classnames'
import { getAllFrames } from 'utils/frame'
import { getImageUrl } from 'utils/helper'

import './nestedFrames.scss'

const IconIndicator = function ({id, level}) {
  if (id.startsWith('temp-')) {
    return <Folder size={14}/>
  } else if (level===0) {
    return <Sidebar size={14}/>
  } else {
    return <FileText size={14}/>
  }
}

const FrameItem = function ({item, level, onSelect, selectedId}) {
  const [collapsed, setCollapsed] = useState(false)

  function toggleCollapsed (e) {
    if (e) {
      e.stopPropagation()
    }
    setCollapsed(!collapsed)
  }

  function handleItemClick () {
    if (level===0 || item.id.startsWith('temp-')) {
      toggleCollapsed()
    } else {
      onSelect(item)
    }
  }

  return (
    <li key={item.id} className={cn('frame-item', {'frame-item-page': level===0})}>
      <h4
        style={{paddingLeft: `${level*20 + 8}px`}}
        title={item.name}
        onClick={handleItemClick}
        className={cn({'item-selected': selectedId===item.id})}
      >
        <IconIndicator id={item.id} level={level}/>
        <span>{item.name}</span>
        {
          item.children &&
          <div
            className={cn('item-chevron', { 'item-chevron-collapsed': collapsed })}
            onClick={toggleCollapsed}
          >
            <ChevronDown size={16}/>
          </div>
        }
      </h4>
      {
        item.children &&
        <ul
          className={cn('item-children', {'item-children-collapsed': collapsed})}
        >
          {
            item.children.map(item =>
              <FrameItem
                key={item.id}
                item={item}
                level={level+1}
                onSelect={onSelect}
                selectedId={selectedId}
              />
            )
          }
        </ul>
      }
    </li>
  )
}

const NestedFrames = function ({visible, pagedFrames, mode, isMock, onSelect}) {
  const [selectedId, setSelectedId] = useState('')

  const allFrames = useMemo(function () {
    return getAllFrames(pagedFrames)
  }, [pagedFrames])

  function handleFrameSelect (item, pageId) {
    const frameImageUrl = getImageUrl(item, mode, isMock)
    onSelect(item.id, frameImageUrl, pageId)
    setSelectedId(item.id)
  }

  useEffect(() => {
    const firstFrame = allFrames[0]
    const frameImageUrl = getImageUrl(firstFrame, mode, isMock)
    onSelect(firstFrame.id, frameImageUrl, firstFrame.pageId)
    setSelectedId(firstFrame.id)
  }, [allFrames, isMock, mode, onSelect])

  return (
    <ul className={cn('list-container nested-frames', {hide: !visible})}>
      {
        pagedFrames.map(page =>
          <FrameItem
            key={page.id}
            item={page}
            level={0}
            onSelect={(item) => handleFrameSelect(item, page.id)}
            selectedId={selectedId}
          />
        )
      }
    </ul>
  )
}

export default NestedFrames
