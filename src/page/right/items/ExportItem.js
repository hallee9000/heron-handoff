import React, { useState } from 'react'
import { Download, ExternalLink, Loader } from 'react-feather'
import cn from 'classnames'
import { saveAs } from 'file-saver'
import { getBlobData, withCors } from 'api'
import { getFileName } from 'utils/helper'
import './export-item.scss'

export default ({exportSetting, useLocalImages, index}) => {
  const [ isDownloading, setDownloading ] = useState(false)
  const { image } = exportSetting
  const name = getFileName(exportSetting, useLocalImages ? index : undefined)
  const imageUrl = useLocalImages ? `${process.env.PUBLIC_URL}/data/exports/${name}` : image
  const { protocol } = window.location
  const isHttpServer = /^http/.test(protocol)

  const handleSave = (e, name) => {
    if (isHttpServer) {
      e.preventDefault()
      setDownloading(true)
      const imgUrl = useLocalImages ? imageUrl : withCors(imageUrl)
      getBlobData(imgUrl)
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
      onClick={e => handleSave(e, name)}
    >
      <div style={{backgroundImage: `url(${imageUrl})`}}/>
      <span>{ name }</span>
      {
        isDownloading ?
        <Loader size={14} className="motion-loading"/> :
        (isHttpServer ? <Download size={14}/> : <ExternalLink size={14}/>)
      }
    </a>
}
