import React from 'react'
import cn from 'classnames'
import { Edit3 } from 'react-feather'
import './title.scss'

export default ({ step, content, editable, hasBottom, onEdit }) =>
  <div className={cn('entry-title', {'entry-title-with-bottom': hasBottom})}>
    <div className="title-step">{ step }</div>
    <span className="title-content">{ content }</span>
    <span className="title-stretch"/>
    {
      editable &&
      <span className="title-edit" onClick={onEdit}>
        <Edit3 size={12}/>
      </span>
    }
  </div>
