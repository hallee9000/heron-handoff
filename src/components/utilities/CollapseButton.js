import React from 'react'
import { withTranslation } from 'react-i18next'
import { withGlobalContextConsumer } from 'contexts/GlobalContext'
import { ChevronsLeft, ChevronsRight } from 'react-feather'
import cn from 'classnames'
import './collapse-button.scss'

const CollapseButton = ({placement='left', globalSettings, changeGlobalSetting, t}) => {
  const isLeft = placement==='left'
  const {leftCollapse, rightCollapse} = globalSettings
  const collapsed = isLeft ? leftCollapse : rightCollapse

  const toggleCollapse = () => {
    changeGlobalSetting(isLeft ? 'leftCollapse' : 'rightCollapse', !collapsed)
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

export default withGlobalContextConsumer(withTranslation('common')(CollapseButton))
