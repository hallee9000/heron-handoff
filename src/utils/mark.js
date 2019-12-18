export const getSpacing = (selected, target) => {
  const spacingV = Math.max(selected.top - target.bottom, target.top - selected.bottom)
  const spacingH = Math.max(selected.left - target.right, target.left - selected.right)
  return {
    // spacing between selected and target in both direction
    spacingV,
    spacingH,
    // selected position(relative to target)
    l: target.left - selected.right>0,
    r: selected.left - target.right>0,
    t: target.top - selected.bottom>0,
    b: selected.top - target.bottom>0
  }
}

// return: selected position, not intersect direction
export const getPosition = (selected, target) => {
  const position = {}
  if (selected.top>=target.bottom) {
    position.v = [selected.top - target.bottom, 1]
  }
  if (target.top>=selected.bottom) {
    position.v = [target.top - selected.bottom, 0]
  }
  if (selected.left>=target.right) {
    position.h = [selected.left - target.right, 1]
  }
  if (target.left>=selected.right) {
    position.h = [target.left - selected.right, 0]
  }
  return position
}

// get sorted four numbers
export const getSortedNumbers = (numbers) =>
  numbers.length!==4 ? [] : [...numbers].sort((a,b) => a - b)

// get middle two from four numbers
export const getMidNumbers = (numbers) =>
  getSortedNumbers(numbers).slice(1, 3)

// get middle two from four numbers
export const getEverage = (numbers) =>
  (numbers.reduce((a, b) => a + b, 0))/numbers.length

export const getNums = (direction, verticalNums, horizontalNums) =>
  direction==='v' ?
  {
    'parallel': [...verticalNums],
    'intersect': [...horizontalNums]
  } :
  {
    'parallel': [...horizontalNums],
    'intersect': [...verticalNums]
  }

export const getOrderedNums = (nums) => {
  const orderedNums = {}
  Object
    .keys(nums)
    .map(key => {
      orderedNums[key] = getSortedNumbers(nums[key])
    })
  return orderedNums
}

export const getMidIndex = (intersectNums, closerIndex) => {
  const flag = closerIndex===0 ? 1 : -1
  return [
    (intersectNums[0]-intersectNums[2])*flag>0 ? 0 : 1,
    (intersectNums[1]-intersectNums[3])*flag>0 ? 1 : 0
  ]
}

export const getParallelSpacing = (parallelNums) =>
  parallelNums[2] - parallelNums[1]

export const getMargin = (intersectNums, whichOne) =>
  intersectNums[whichOne==='smaller' ? 1 : 3]-intersectNums[whichOne==='smaller' ? 0 : 2]
