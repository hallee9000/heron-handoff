import React, { Fragment } from 'react'
import { toPercentage } from 'utils/helper'
import './distance.scss'

const DistanceItem = ({data, isVertical}) => {
  if (!data) {
    return null
  }
  const size = isVertical ? {height: toPercentage(data.h)} : {width: toPercentage(data.w)}
  return (
    <div
      className={`mark-distance mark-distance-${isVertical ? 'v' : 'h'}`}
      style={{left: toPercentage(data.x), top: toPercentage(data.y), ...size }}
    >
      <div className="mark-distance-sizing">{ `${data.distance}px` }</div>
    </div>
  )
}

export default props => {
  const { distanceData } = props
  const { topData, bottomData, leftData, rightData } = distanceData
  return (
    <Fragment>
      <DistanceItem data={topData} isVertical/>
      <DistanceItem data={bottomData} isVertical/>
      <DistanceItem data={leftData}/>
      <DistanceItem data={rightData}/>
    </Fragment>
  )
}
