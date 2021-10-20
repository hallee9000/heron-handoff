type Matrix = number[][]

// Figma transform: https://www.figma.com/plugin-docs/api/Transform/
// type Transform = [
//   [m00, m01, m02],
//   [m10, m11, m12]
// ]
// 参见：https://frederic-wang.fr/decomposition-of-2d-transform-matrices.html
export function decompose2DMatrix(matrix: Matrix) {
  //          | a  c  tx |
  // matrix = | b  d  ty |
  //          | 0  0  1  |
  const a = matrix[0][0]
  const b = matrix[1][0]
  const c = matrix[0][1]
  const d = matrix[1][1]
  const tx = matrix[0][2]
  const ty = matrix[1][2]

  const delta = a * d - b * c

  const result = {
    translation: [tx, ty],
    rotation: 0,
    scale: [0, 0],
    skew: [0, 0]
  }

  // Apply the QR-like decomposition.
  if (a !== 0 || b !== 0) {
    const r = Math.sqrt(a * a + b * b)
    result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r)
    result.scale = [r, delta / r]
    result.skew = [Math.atan((a * c + b * d) / (r * r)), 0]
  } else if (c !== 0 || d !== 0) {
    const s = Math.sqrt(c * c + d * d)
    result.rotation =
      Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s))
    result.scale = [delta / s, s]
    result.skew = [0, Math.atan((a * c + b * d) / (s * s))]
  } else {
    // a = b = c = d = 0
  }
  result.rotation = result.rotation * 180 / Math.PI
  return result
}
