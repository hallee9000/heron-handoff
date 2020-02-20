import React, { useState } from 'react'
import { Download, ExternalLink, Loader } from 'react-feather'
import cn from 'classnames'
import { saveAs } from 'file-saver'
import { getBlobData } from 'api'
import { getFileName } from 'utils/helper'
import './export-item.scss'

export default ({exportSetting, useLocalImages, index}) => {
  const [ isDownloading, setDownloading ] = useState(false)
  const { image } = exportSetting
  const name = getFileName(exportSetting, useLocalImages ? index : undefined)
  const imageUrl = useLocalImages ? `${process.env.PUBLIC_URL}/data/exports/${name}` : image

  const handleSave = (e, url, name) => {
    if (!useLocalImages) {
      e.preventDefault()
      setDownloading(true)
      getBlobData(`https://figma-handoff-cors.herokuapp.com/${url}`)
        .then(blob => {
          saveAs(blob, name)
          setDownloading(false)
        })
    }
  }

  return <a
      href={imageUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('export-item', {'export-item-downloading': isDownloading})}
      onClick={e => handleSave(e, image, name)}
    >
      <div style={{backgroundImage: `url(${imageUrl})`}}/>
      <span>{ name }</span>
      {
        isDownloading ?
        <Loader size={14} className="motion-loading"/> :
        (useLocalImages ? <ExternalLink size={14}/> : <Download size={14}/>)
      }
    </a>
}
