import { getSpacing, getSortedNumbers, getEverage, toFixed } from './helper'

function getPosition(selected, target) {
  if (selected.top>target.bottom) {
    return [1, 'v']
  }
  if (target.top>selected.bottom) {
    return [0, 'v']
  }
  if (selected.left>target.right) {
    return [1, 'h']
  }
  if (target.left>selected.right) {
    return [0, 'h']
  }
}

function getNums(direction, verticalNums, horizontalNums) {
  return direction==='v' ?
    {
      'parallel': verticalNums,
      'intersect': horizontalNums
    } :
    {
      'parallel': horizontalNums,
      'intersect': verticalNums
    }
}

function getOrderedNums(nums) {
  const orderedNums = {}
  Object
    .keys(nums)
    .map(key => {
      orderedNums[key] = getSortedNumbers(nums[key])
    })
  return orderedNums
}

function getMidIndex(intersectNums, closerIndex) {
  const flag = closerIndex===0 ? 1 : -1
  return [
    (intersectNums[2]-intersectNums[0])*flag>0 ? 1 : 0,
    (intersectNums[1]-intersectNums[3])*flag>0 ? 1 : 0
  ]
}

export const mark = (selected, target, pageRect) => {
  if (!selected) return {}
  const position = getPosition(selected, target)
  if (!position) return {}
  const pw = pageRect.width
  const ph = pageRect.height
  const verticalNums = [selected.top, selected.bottom, target.top, target.bottom]
  const horizontalNums = [selected.left, selected.right, target.left, target.right]
  const nums = getNums(position[0], verticalNums, horizontalNums)
  const orderedNums = getOrderedNums(nums)
  const mids =[getEverage(orderedNums['parallel'].slice(0, 2)), getEverage(orderedNums['parallel'].slice(2))]
  const midIndex = getMidIndex(nums['intersect'], position[0])
  console.log(mids, midIndex)
  return {
    distanceData: [{
      x: position[1]==='v' ? orderedNums['intersect'][0]/pw : mids[midIndex[0]]/pw,
      y: position[1]==='v' ? mids[midIndex[0]]/ph : orderedNums['intersect'][0]/ph,
      [position[1]==='v' ? 'w' : 'h']: (orderedNums['intersect'][1]-orderedNums['intersect'][0])/(position[1]==='v' ? pw : ph),
      distance: toFixed(orderedNums['intersect'][1]-orderedNums['intersect'][0])
    }],
    rulerData: []
  }
  // console.log(mids[midIndex[0]], mids[midIndex[1]])
}
