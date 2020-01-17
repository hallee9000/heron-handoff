import React, { Fragment } from 'react'
import { toPercentage } from 'utils/mark'
import { formattedNumber } from 'utils/style'
import './distance.scss'

export default ({ distanceData, globalSettings }) =>
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
            <div className="mark-distance-sizing">{ formattedNumber(distance.distance, globalSettings) }</div>
          </div>
        )
      })
    }
  </Fragment> :
  null
