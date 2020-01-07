import React, { Fragment } from 'react'
import { toPercentage } from 'utils/mark'
import './distance.scss'

export default ({ distanceData }) =>
  distanceData && distanceData.length ?
  <Fragment>
    {
      distanceData.map((distance, index) => {
        const isVertical = !!distance.h
        const size = isVertical ? {height: toPercentage(distance.h)} : {width: toPercentage(distance.w)}
        return (
          <div
            key={index}
            className={`mark-distance mark-distance-${isVertical ? 'v' : 'h'}`}
            style={{left: toPercentage(distance.x), top: toPercentage(distance.y), ...size }}
          >
            <div className="mark-distance-sizing">{ `${distance.distance}px` }</div>
          </div>
        )
      })
    }
  </Fragment> :
  null
