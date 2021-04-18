import React, { Fragment } from 'react'
import { toPercentage, toMarkPercentage } from 'utils/mark'
import { formattedNumber } from 'utils/style'
import './distance.scss'

const Distance = ({
  distanceData,
  globalSettings,
  percentageMode,
  pageRect,
  closedCommonParent
}) =>
  distanceData && distanceData.length ?
  <Fragment>
    {
      distanceData.map((distance, index) => {
        const isVertical = !!distance.h
        const size = isVertical ? {height: toPercentage(distance.h)} : {width: toPercentage(distance.w)}
        const whichSide = isVertical ? 'height' : 'width'
        return (
          <div
            key={index}
            className={`mark-distance mark-distance-${isVertical ? 'v' : 'h'}`}
            style={{left: toPercentage(distance.x), top: toPercentage(distance.y), ...size }}
          >
            <div className="mark-distance-sizing">
              {
                !!percentageMode ? (
                  percentageMode==='auto' ?
                  toMarkPercentage(distance.distance/closedCommonParent[whichSide]) :
                  toMarkPercentage(distance.distance/pageRect[whichSide])
                ) :
                formattedNumber(distance.distance, globalSettings)
              }
            </div>
          </div>
        )
      })
    }
  </Fragment> :
  null

export default Distance
