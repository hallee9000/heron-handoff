import Color from "color"

export const getRGBA = color =>
  ({r: (color.r*255).toFixed(), g: (color.g*255).toFixed(), b: (color.b*255).toFixed(), alpha: color.a})

export const getCSSColor = color =>
  `rgba(${Object.keys(getRGBA(color)).map(key => getRGBA(color)[key]).join(',')})`

export const getColor = color =>
  Color(getRGBA(color))
