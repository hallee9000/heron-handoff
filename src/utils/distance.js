export const getMidPoint = (numbers) => {
  // calculate average value of two middle numbers of four numbers
  const midPoints = numbers.sort().slice(1, 3)
  return (midPoints[0]+midPoints[1])/2
}

// calculate distance data
export const calculateDistance = (selected, target) => {
  const selectedMidX = selected.left + selected.width / 2
  const selectedMidY = selected.top + selected.height / 2
  const targetMidX = target.left + target.width / 2
  const targetMidY = target.top + target.height / 2
  let topDistance, rightDistance, bottomDistance, leftDistance
  let topRuler, rightRuler, bottomRuler, leftRuler
  if (selected.top > target.bottom) {
    const distance = selected.top - target.bottom
    topDistance = {
      x: (target.right>selected.left && target.left<selected.right) ? getMidPoint([target.left, target.right, selected.left, selected.left]) : selectedMidX,
      y: target.bottom,
      h: distance
    }
    bottomRuler = {
      x: topDistance.x,
      y: topDistance.y + distance,
      w: 
    }
  } else {
    
  }
  if (target.top - selected.bottom) {

  } else {

  }
  if (selected.left - target.right) {

  } else {
    
  }
  if (target.left - selected.right) {

  } else {
    
  }
}
