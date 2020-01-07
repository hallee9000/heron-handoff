import Color from "color"
import { toFixed } from 'utils/mark'

export const getRGBA = color =>
  ({r: (color.r*255).toFixed(), g: (color.g*255).toFixed(), b: (color.b*255).toFixed(), alpha: color.a})

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

export const getFillsStyle = fills =>
  fills.map(fill => {
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

export const getEffectsStyle = effects => {
  let type = ''
  const styles = effects.map(effect => {
    type = type==='' ? effect.type : ( type===effect.type ? type : 'MIX_EFFECT')
    switch (effect.type) {
      case 'DROP_SHADOW':
        return { boxShadow: `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px 0 ${getCSSRGBA(effect.color)}` }
      case 'INNER_SHADOW':
        return { boxShadow: `inset ${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px 0 ${getCSSRGBA(effect.color)}` }
      case 'LAYER_BLUR':
        return { filter: `blur(${effect.radius}px)` }
      case 'BACKGROUND_BLUR':
        return { backdropFilter: `blur(${effect.radius}px)` }
      default:
        return {}
    }
  })
  return { type, styles }
}
