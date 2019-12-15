import React, { Fragment } from 'react'
import './ruler.scss'

export default ({rect}) =>
  rect &&
  <Fragment>
    <div
      className="mark-ruler mark-ruler-top"
      style={{top: rect.box.top}}
    />
    <div
      className="mark-ruler mark-ruler-bottom"
      style={{top: `calc(${rect.box.bottom} - 1px)`}}
    />
    <div
      className="mark-ruler mark-ruler-left"
      style={{left: rect.box.left}}
    />
    <div
      className="mark-ruler mark-ruler-right"
      style={{left: `calc(${rect.box.right} - 1px)`}}
    />
  </Fragment>