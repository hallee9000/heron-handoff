import Color from "color"
import { toFixed } from 'utils/mark'

export const getRGBA = color =>
  ({r: (color.r*255).toFixed(), g: (color.g*255).toFixed(), b: (color.b*255).toFixed(), alpha: color.a})

export const getRGB = color => {
  const rgba = getRGBA(color)
  delete rgba.alpha
  return Object.keys(rgba)
    .map(key => rgba[key])
    .join(', ')
}

export const getCSSRGBA = color =>
  `rgba(${Object.keys(getRGBA(color)).map(key => getRGBA(color)[key]).join(',')})`

export const getCSSHEX = color =>
  getColor(color).hex()


export const getCSSAlpha = color =>
  getColor(color).alpha()

export const getColor = color =>
  Color(getRGBA(color))

export const getPercentage = opacity =>
  `${toFixed(opacity)==='' ? 100 : toFixed(opacity)*100 }%`

export const getStops = stops =>
  stops.map(stop => ({
    position: getPercentage(stop.position),
    hex: getCSSHEX(stop.color),
    alpha: toFixed(getCSSAlpha(stop.color))
  }))

export const stopsToBackground = stops =>
  stops.map(s => getCSSRGBA(s.color) + getPercentage(s.position)).join()

// gradientHandlePositions
export const getSolidColor = fill => ({
  css: getCSSRGBA(fill.color),
  opacity: getPercentage(fill.opacity),
  hex: getCSSHEX(fill.color),
  color: getCSSHEX(fill.color),
  type: 'Solid'
})

export const getLinearGradient = fill => ({
  css: `linear-gradient(to bottom, ${ stopsToBackground(fill.gradientStops) }`,
  opacity: getPercentage(fill.opacity),
  color: 'Linear',
  type: 'Linear',
  stops: getStops(fill.gradientStops),
  positions: 'fill.gradientHandlePositions'
})

export const getRadialGradient = fill => ({
  css: `radial-gradient(circle at 50% 50%, ${ stopsToBackground(fill.gradientStops) })`,
  opacity: getPercentage(fill.opacity),
  color: 'Radial',
  type: 'Radial',
  stops: getStops(fill.gradientStops),
  positions: 'fill.gradientHandlePositions'
})

export const getAngularGradient = fill => ({
  css: `conic-gradient(from 0.25turn, ${ stopsToBackground(fill.gradientStops) })`,
  opacity: getPercentage(fill.opacity),
  color: 'Angular',
  type: 'Angular',
  stops: getStops(fill.gradientStops),
  positions: 'fill.gradientHandlePositions'
})

export const getDiamondGradient = fill => ({
  css: `linear-gradient(to bottom right, ${ stopsToBackground(fill.gradientStops) }) bottom right / 50% 50% no-repeat,` +
  `linear-gradient(to bottom left, ${ stopsToBackground(fill.gradientStops) }) bottom left / 50% 50% no-repeat, ` +
  `linear-gradient(to top left, ${ stopsToBackground(fill.gradientStops) }) top left / 50% 50% no-repeat, ` +
  `linear-gradient(to top right, ${ stopsToBackground(fill.gradientStops) }) top right / 50% 50% no-repeat`,
  opacity: getPercentage(fill.opacity),
  color: 'Diamond',
  type: 'Diamond',
  stops: getStops(fill.gradientStops),
  positions: 'fill.gradientHandlePositions'
})

export const getFillsStyle = fills => {
  let type = ''
  const styles = fills.map(fill => {
    type = type==='' ? fill.type : ( type===fill.type ? type : 'MIX_FILL')
    switch (fill.type) {
      case 'SOLID':
        return getSolidColor(fill)
      case 'GRADIENT_LINEAR':
        return getLinearGradient(fill)
      case 'GRADIENT_RADIAL':
        return getRadialGradient(fill)
      case 'GRADIENT_ANGULAR':
        return getAngularGradient(fill)
      case 'GRADIENT_DIAMOND':
        return getDiamondGradient(fill)
      default:
        return ''
    }
  })
  .filter(fill => !!fill)
  return { type, styles }
}

export const getShadowEffect = effect => ({
    x: effect.offset.x,
    y: effect.offset.y,
    blur: effect.radius,
    hex: getCSSHEX(effect.color),
    rgba: getRGB(effect.color),
    alpha: toFixed(getCSSAlpha(effect.color))
  })

export const getEffectsStyle = effects => {
  let type = ''
  const styles = effects.map(effect => {
    type = type==='' ? effect.type : ( type===effect.type ? type : 'MIX_EFFECT')
    switch (effect.type) {
      case 'DROP_SHADOW':
        return {
          type: effect.type,
          typeName: 'Drop Shadow',
          category: 'shadow',
          ...getShadowEffect(effect),
          css: {
            code: `box-shadow: ${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px 0 ${getCSSRGBA(effect.color)}`,
            boxShadow: `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px 0 ${getCSSRGBA(effect.color)}`
          }
        }
      case 'INNER_SHADOW':
        return {
          type: effect.type,
          typeName: 'Inner Shadow',
          category: 'shadow',
          ...getShadowEffect(effect),
          css: {
            code: `box-shadow: inset ${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px 0 ${getCSSRGBA(effect.color)}`,
            boxShadow: `inset ${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px 0 ${getCSSRGBA(effect.color)}`
          }
        }
      case 'LAYER_BLUR':
        return {
          type: effect.type,
          typeName: 'Layer Blur',
          category: 'blur',
          blur: effect.radius,
          css: {
            code: `filter: blur(${effect.radius}px)`,
            filter: `blur(${effect.radius}px)`
          }
        }
      case 'BACKGROUND_BLUR':
        return {
          type: effect.type,
          category: 'blur',
          typeName: 'Background Blur',
          blur: effect.radius,
          css: {
            code: `backdrop-filter: blur(${effect.radius}px)`,
            backdropFilter: `blur(${effect.radius}px)`
          }
        }
      default:
        return {}
    }
  })
  return { type, styles }
}

export const getCSSEffects = effectItems => {
  let style = {}, shadows = []
  // eslint-disable-next-line
  effectItems.map(({type, css}) => {
    if (type==='DROP_SHADOW' || type==='INNER_SHADOW') {
      shadows.push(css.boxShadow)
    } else {
      style = { ...style, ...css }
    }
  })
  style.boxShadow = shadows.join()
  return style
}

export const getTextIcon = textStyle => {
  const { fontSize, fontWeight } = textStyle
  const size = fontSize > 30 ? 'large' : (fontSize < 16 ? 'small' : 'normal')
  const weight = fontWeight > 500 ? 'bold' : (fontWeight < 400 ? 'thin' : 'regular')
  return `${size}-${weight}`
}

export const getStyle = (type, styles) => {
  if (!styles) return []
  switch (type) {
    case 'FILL':
      return getFillsStyle(styles)
    case 'EFFECT':
      return getEffectsStyle(styles)
    case 'TEXT':
      return { type: 'TEXT', styles }
    case 'GRID':
      return { type: 'GRID', styles }
    default:
      return { styles }
  }
}

export const getStyleById = (styles, nodeStyles, type='fill') => {
  if (!nodeStyles) {
    return ''
  }
  if (styles[type.toUpperCase()] && nodeStyles[type]) {
    return styles[type.toUpperCase()].find(({id}) => id===nodeStyles[type])
  } else {
    return ''
  }
}
