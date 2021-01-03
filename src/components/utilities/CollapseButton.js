import React, { useState } from 'react'
import { ChevronsLeft, ChevronsRight } from 'react-feather'
import cn from 'classnames'
import './collapse-button.scss'

export default ({placement='left', globalSettings, changeGlobalSettings}) => {
  const isLeft = placement==='left'
  const {leftCollapse, rightCollapse} = globalSettings
  const [collapsed, setCollapsed] = useState(isLeft ? leftCollapse : rightCollapse)
  const toggleCollapse = () => {
    setCollapsed(!collapsed)
    changeGlobalSettings(isLeft ? 'leftCollapse' : 'rightCollapse', !collapsed)
  }
  return (
    <button
      className={cn('collapse-button', `collapse-button-${placement}`)}
      onClick={toggleCollapse}
    >
      {
        collapsed ?
        (isLeft ? <ChevronsRight size={16}/> : <ChevronsLeft size={16}/>) :
        (isLeft ? <ChevronsLeft size={16}/> : <ChevronsRight size={16}/>)
      }
    </button>
  )
}
