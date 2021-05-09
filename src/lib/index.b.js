import React, { useEffect } from 'react'
import Heading from './Heading'

function Canvas () {

  useEffect(() => {
    document.body.classList.add('heron-handoff')
    return () => {
      document.body.classList.remove('heron-handoff')
    }
  })

  return (
    <div>
      <Heading>这是大标题</Heading>
    </div>
  )
}

export default Canvas
