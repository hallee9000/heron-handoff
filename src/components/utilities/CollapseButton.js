import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { ChevronsLeft, ChevronsRight } from 'react-feather'
import cn from 'classnames'
import './collapse-button.scss'

const CollapseButton = ({placement='left', globalSettings, changeGlobalSettings, t}) => {
  const isLeft = placement==='left'
  const {leftCollapse, rightCollapse} = globalSettings
  const [collapsed, setCollapsed] = useState(isLeft ? leftCollapse : rightCollapse)
  // changed by outside actions, like shortcuts
  useEffect(() => {
    setCollapsed(isLeft ? leftCollapse : rightCollapse)
  }, [isLeft, leftCollapse, rightCollapse])

  const toggleCollapse = () => {
    setCollapsed(!collapsed)
    changeGlobalSettings(isLeft ? 'leftCollapse' : 'rightCollapse', !collapsed)
  }
  return (
    <button
      className={cn('collapse-button', `collapse-button-${placement}`)}
      onClick={toggleCollapse}
      title={t(`hide ${placement} sider`)}
    >
      {
        collapsed ?
        (isLeft ? <ChevronsRight size={16}/> : <ChevronsLeft size={16}/>) :
        (isLeft ? <ChevronsLeft size={16}/> : <ChevronsRight size={16}/>)
      }
    </button>
  )
}

export default withTranslation('common')(CollapseButton)
