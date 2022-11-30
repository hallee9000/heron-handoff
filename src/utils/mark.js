// 0.32 -> 32%
export const toPercentage = num => `${num*100}%`

// avoid so many numbers after point
export const toMarkPercentage = num => `${(num*100).toFixed(1)}%`

// '100px' -> 100
export const px2number = str => str.replace('px', '') - 0

// 0.2637378 -> 0.26, 8 -> 8
export const toFixed = (num, numberFormat=0) => {
  // 非数字
  if (typeof num!=='number') {
    return ''
  }
  // 整数原样返回
  if (Math.round(num)===num) {
    return num
  }
  // 非整数
  switch(numberFormat) {
    case 0:
      return (num.toFixed(2) - 0)
    case 1:
      return Math.round(num)
    case 2:
      return Math.floor(num)
    case 3:
      return Math.ceil(num)
    default:
      return (num.toFixed(2) - 0)
  }
}

// generate box data
export const generateRects = (nodes, docRect, globalSettings) => {
  const { disableInspectExportInner, disableInspectInComponent, disableInspectFunction } = globalSettings
  let index = 0
  const rects = []
  let exportIds = []
  const step = (nodes, parentId, parentComponentIndex, parentPaths) => {
    let maskParentId = ''
    let maskbb = {}
    let maskIndex
    let innerIndex = 0
    // start looping
    nodes.map(node => {
      const nbb = node.absoluteBoundingBox
      let maskedElementBound = null
      // deal with mask
      if (node.isMask) {
        // mask start
        maskParentId = parentId
        maskbb = node.absoluteBoundingBox
        maskIndex = index
      } else if (maskParentId && (node.type==='FRAME' ||  node.type==='COMPONENT' || node.type==='INSTANCE')) {
        // mask stop
        maskParentId = ''
      } else if (parentId===maskParentId && !node.isMask) {
        // elements of mask
        // if out of mask should jump out
        if (isOutOfMask(maskbb, nbb)) {
          // eslint-disable-next-line
          return
        } else {
          maskedElementBound = getMaskedElementBound(maskIndex, maskbb, nbb, docRect)
        }
      }

      // don't deal with invisible element
      if (node.visible===false) {
        // eslint-disable-next-line
        return
      }

      const bound = getBound(nbb, docRect)
      const isDirectFrame = index===0
      const isComponent = node.type==='COMPONENT' || node.type==='INSTANCE'
      const isGroup = node.type==='GROUP'
      // TODO: should in global exportSettings
      const hasExports = node.exportSettings && node.exportSettings.length

      const clazz = []
      isComponent && clazz.push('component')
      isGroup && clazz.push('group')
      // don't add on artboard
      hasExports && index && clazz.push('has-exports')

      const currentPaths = !parentPaths ? [innerIndex] : [...parentPaths, innerIndex]
      if (hasExports) {
        exportIds = exportIds.concat(node.exportSettings.map(() => node.id))
      }

      // find closest component to highlight
      let closestComponentIndex
      if (node.type==='COMPONENT') {
        closestComponentIndex = index
      } else if (node.type==='INSTANCE') {
        const { name } = node.mainComponent
        // privte component, use it's closest component
        if (name.startsWith('_') || name.startsWith('.')) {
          // private instance directly in design, no parent component wrapped
          closestComponentIndex = parentComponentIndex || index
        } else {
          closestComponentIndex = index
        }
      } else  {
        closestComponentIndex = parentComponentIndex
      }

      rects.push({
        // position in every level
        paths: currentPaths,
        index: index++,
        ...bound,
        maskedBound: maskedElementBound,
        actualWidth: toFixed(nbb.width),
        actualHeight: toFixed(nbb.height),
        title: node.name,
        isComponent,
        closestComponentIndex,
        clazz,
        node
      })
      innerIndex++
      // if has children, not boolean and mask element, then continue
      if (
        (disableInspectExportInner && hasExports && !isDirectFrame) ||
        !node.children ||
        node.type==='BOOLEAN_OPERATION' ||
        node.isMask ||
        (isComponent && disableInspectInComponent) ||
        (disableInspectFunction ? disableInspectFunction(node) : false)
      ) {
        // eslint-disable-next-line
        return
      }
      step(node.children, node.id, closestComponentIndex, currentPaths)
      // eslint-disable-next-line
      return
    })
  }
  step(nodes)
  return {rects, exportIds}
}

export const isOutOfMask = (mask, target) => {
  // target is at left of mask
  if (target.x + target.width<=mask.x) {
    return true
  }
  // target is at right of mask
  else if (target.x>=mask.x + mask.width) {
    return true
  }
  // target is at top of mask
  else if (target.y + target.height<=mask.y) {
    return true
  }
  // target is at bottom of mask
  else if (target.y>=mask.y + mask.height) {
    return true
  }
  return false
}

export const getMaskedElementBound = (maskIndex, mask, target, docRect) => {
  const maskBottom = mask.y+mask.height
  const targetBottom = target.y+target.height
  const top = (target.y<mask.y ? mask.y : target.y) - docRect.y
  const bottom = (targetBottom>maskBottom ? maskBottom : targetBottom) - docRect.y
  const maskRight = mask.x+mask.width
  const targetRight = target.x+target.width
  const left = (target.x<mask.x ? mask.x : target.x) - docRect.x
  const right = (targetRight>maskRight ? maskRight : targetRight) - docRect.x
  const width = right - left
  const height = bottom - top

  return { top, left, bottom, right, width, height, maskIndex }
}

export const getBound = (nodeBound, docRect) => {
  const top = nodeBound.y - docRect.y
  const left = nodeBound.x - docRect.x
  const width = nodeBound.width
  const height = nodeBound.height
  return {
    top,
    left,
    bottom: top+height,
    right: left+width,
    width: width,
    height: height
  }
}

function getStrokeIncrement (strokeAlign, strokeWeight) {
  let strokeIncrement = 0
  switch (strokeAlign) {
    case 'OUTSIDE':
      strokeIncrement += strokeWeight
      break
    case 'CENTER':
      strokeIncrement += strokeWeight/2
      break
    default:
      strokeIncrement += 0
  }
  return strokeIncrement
}

// get Bound of Frame
export const getFrameBounds = (strokes, strokeWeights, strokeAlign, effects) => {
  let strokeBases = { top: 0, bottom: 0, left: 0, right: 0 }
  const visibleStrokes = strokes.filter(({visible}) => visible!==false)
  
  if (visibleStrokes.length > 0) {
    if (typeof strokeWeights==='number') {
      Object.keys(strokeBases)
        // eslint-disable-next-line
        .map((position) => {
          strokeBases[position]+=getStrokeIncrement(strokeAlign, strokeWeights)
        })
    } else {
      Object.keys(strokeWeights)
        // eslint-disable-next-line
        .map((position) => {
          strokeBases[position]+=getStrokeIncrement(strokeAlign, strokeWeights[position])
        })
    }
  }

  const bounds = { top: 0, bottom: 0, left: 0, right: 0 }
  effects
    .filter(({type, visible}) => (type==='DROP_SHADOW' || type==='LAYER_BLUR') && visible!==false)
    // eslint-disable-next-line
    .map(effect => {
      const { offset, radius, spread } = effect
      const fallbackSpread = spread || 0
      const x = offset ? offset.x : 0
      const y = offset ? offset.y : 0
      bounds.top = Math.max(radius+fallbackSpread-y, bounds.top, 0)
      bounds.bottom = Math.max(radius+fallbackSpread+y, bounds.bottom, 0)
      bounds.left = Math.max(radius+fallbackSpread-x, bounds.left, 0)
      bounds.right = Math.max(radius+fallbackSpread+x, bounds.right, 0)
    })
  Object.keys(strokeBases)
    .map(position => bounds[position] += strokeBases[position])
  return bounds
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
      return key
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

// selectedRect is clicked box
// targetRect is hovered box
export const isIntersect = (selectedRect, targetRect) => {
  return !(
    selectedRect.right <= targetRect.left ||
    selectedRect.left >= targetRect.right ||
    selectedRect.top >= targetRect.bottom ||
    selectedRect.bottom <= targetRect.top
  )
}

// calculate distance data
export const calculateMarkData = (selected, target, pageRect) => {
  // has selected and not the the same
  if (selected && (selected.index !== target.index)){
    const pw = pageRect.width
    const ph = pageRect.height
    const selectedMidX = selected.left + selected.width / 2
    const selectedMidY = selected.top + selected.height / 2
    const verticalNums = [selected.top, selected.bottom, target.top, target.bottom]
    const horizontalNums = [selected.left, selected.right, target.left, target.right]
    const distanceData = [], rulerData = []
    // not intersect
    if (!isIntersect(selected, target)) {
      const position = getPosition(selected, target)
      if (position.v && position.h && position.v[0]>0 && position.h[0]>0) {
        // not intersect in any direction
        const spacingV = position.v[0]
        const spacingH = position.h[0]
        const selectedIsCloserV = position.v[1]===0
        const selectedIsCloserH = position.h[1]===0
        distanceData.push({
          x: (selectedIsCloserH ? selected.right : target.right)/pw,
          y: selectedMidY/ph,
          w: spacingH/pw,
          distance: toFixed(spacingH)
        })
        distanceData.push({
          x: selectedMidX/pw,
          y: (selectedIsCloserV ? selected.bottom : target.bottom)/ph,
          h: spacingV/ph,
          distance: toFixed(spacingV)
        })
        rulerData.push({
          x: (selectedIsCloserH ? selectedMidX : target.right)/pw,
          y: (selectedIsCloserV ? target.top : target.bottom)/ph,
          w: (selected.width/2 + spacingH)/pw,
          distance: toFixed(selected.width/2 + spacingH)
        })
        rulerData.push({
          x: (selectedIsCloserH ? target.left : target.right)/pw,
          y: (selectedIsCloserV ? selectedMidY : target.bottom)/ph,
          h: (selected.height/2 + spacingV)/ph,
          distance: toFixed(selected.height/2 + spacingV)
        })
      } else if (position.v && position.h && (position.v[0]===0 || position.h[0]===0)) {
        // intersect at a point
        if (position.v[0]===0 && position.h[0]===0) {
          const sortedVNumbers = getSortedNumbers(verticalNums)
          const sortedHNumbers = getSortedNumbers(horizontalNums)
          const edges = [sortedVNumbers[0], sortedVNumbers[3], sortedHNumbers[0], sortedHNumbers[3]]
          const mids = [sortedVNumbers[1], sortedHNumbers[1]]
          // position like \
          const isBackslashed = position.v[1]===position.h[1]
          edges.map((edge, index) => {
            let unfixedNum, d
            const flag = index%2===0 ? isBackslashed : !isBackslashed
            if (index<2) {
              unfixedNum = flag ? mids[1] : edges[2]
              d = flag ? edges[3]-mids[1] : mids[1]-edges[2]
            } else {
              unfixedNum = flag ? mids[0] : edges[0]
              d = flag ? edges[1]-mids[0] : mids[0]-edges[0]
            }
            distanceData.push({
              x: (index<2 ? unfixedNum : edge)/pw,
              y: (index<2 ? edge : unfixedNum)/ph,
              [index<2 ? 'w' : 'h']: d/(index<2 ? pw : ph),
              distance: toFixed(d)
            })
            return edge
          })
        } else {
          const direction = position.v[0]!==0 ? 'v' : 'h'
          const nums = getNums(direction, verticalNums, horizontalNums)
          const orderedNums = getOrderedNums(nums)
          distanceData.push({
            x: direction==='v' ? orderedNums['intersect'][1]/pw : orderedNums['parallel'][1]/pw,
            y: direction==='v' ? orderedNums['parallel'][1]/ph : orderedNums['intersect'][1]/ph,
            [direction==='v' ? 'h' : 'w']: (position[direction][0])/(direction==='v' ? ph : pw),
            distance: toFixed(position[direction][0])
          })
        }
      } else {
        // intersect vertically, parallel horizontally, or opposite
        const direction = position.v ? 'v' : 'h'
        const closerIndex = position[direction][1]
        const nums = getNums(direction, verticalNums, horizontalNums)
        const orderedNums = getOrderedNums(nums)
        const mids =[getEverage(orderedNums['parallel'].slice(0, 2)), getEverage(orderedNums['parallel'].slice(2))]
        const midIndex = getMidIndex(nums['intersect'], closerIndex)
        const parallelSpacing = getParallelSpacing(orderedNums['parallel'])
        const margins = [getMargin(orderedNums['intersect'], 'smaller'), getMargin(orderedNums['intersect'])]
        if (parallelSpacing!==0) {
          distanceData.push({
            x: direction==='v' ? getEverage(orderedNums['intersect'].slice(1,3))/pw : orderedNums['parallel'][1]/pw,
            y: direction==='v' ? orderedNums['parallel'][1]/ph : getEverage(orderedNums['intersect'].slice(1,3))/ph,
            [direction==='v' ? 'h' : 'w']: (parallelSpacing)/(direction==='v' ? ph : pw),
            distance: toFixed(parallelSpacing)
          })
        }
        margins.map((margin, index) => {
          if (margin!==0) {
            const rulerUnfixedStart = midIndex[index]===0 ? mids[0] : orderedNums['parallel'][1]
            const rulerDistance = midIndex[index]===0 ? (orderedNums['parallel'][2] - mids[0]) : (mids[1] - orderedNums['parallel'][1])
            distanceData.push({
              x: (direction==='v' ? orderedNums['intersect'][index*2] : mids[midIndex[index]])/pw,
              y: (direction==='v' ? mids[midIndex[index]] : orderedNums['intersect'][index*2])/ph,
              [direction==='v' ? 'w' : 'h']: margin/(direction==='v' ? pw : ph),
              distance: toFixed(margin)
            })
            rulerData.push({
              x: (direction==='v' ? orderedNums['intersect'][index*3] : rulerUnfixedStart)/pw,
              y: (direction==='v' ? rulerUnfixedStart : orderedNums['intersect'][index*3])/ph,
              [direction==='v' ? 'h' : 'w']: rulerDistance/(direction==='v' ? ph : pw),
              distance: toFixed(rulerDistance/(direction==='v' ? ph : pw))
            })
          }
          return margin
        })
      }
    } else {
      const sortedVNumbers = getSortedNumbers(verticalNums)
      const sortedHNumbers = getSortedNumbers(horizontalNums)
      const x = getEverage(getMidNumbers(sortedHNumbers))
      const y = getEverage(getMidNumbers(sortedVNumbers))
      if (sortedVNumbers[1] - sortedVNumbers[0]!==0) {
        distanceData.push({
          x: x/pw,
          y: sortedVNumbers[0]/ph,
          h: (sortedVNumbers[1] - sortedVNumbers[0])/ph,
          distance: toFixed(sortedVNumbers[1] - sortedVNumbers[0])
        })
      }
      if (sortedVNumbers[3] - sortedVNumbers[2]!==0) {
        distanceData.push({
          x: x/pw,
          y: sortedVNumbers[2]/ph,
          h: (sortedVNumbers[3] - sortedVNumbers[2])/ph,
          distance: toFixed(sortedVNumbers[3] - sortedVNumbers[2])
        })
      }
      if (sortedHNumbers[1] - sortedHNumbers[0]!==0) {
        distanceData.push({
          x: sortedHNumbers[0]/pw,
          y: y/ph,
          w: (sortedHNumbers[1] - sortedHNumbers[0])/pw,
          distance: toFixed(sortedHNumbers[1] - sortedHNumbers[0])
        })
      }
      if (sortedHNumbers[3] - sortedHNumbers[2]!==0) {
        distanceData.push({
          x: sortedHNumbers[2]/pw,
          y: y/ph,
          w: (sortedHNumbers[3] - sortedHNumbers[2])/pw,
          distance: toFixed(sortedHNumbers[3] - sortedHNumbers[2])
        })
      }
    }
    return {
      distanceData,
      rulerData
    }
  } else {
    return {}
  }
}
