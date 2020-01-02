import Color from "color"
import { toFixed } from 'utils/mark'

export const getRGBA = color =>
  ({r: (color.r*255).toFixed(), g: (color.g*255).toFixed(), b: (color.b*255).toFixed(), alpha: color.a})

export const getCSSRGBA = color =>
  `rgba(${Object.keys(getRGBA(color)).map(key => getRGBA(color)[key]).join(',')})`

export const getCSSHEX = color =>
  getColor(color).hex()

export const getColor = color =>
  Color(getRGBA(color))

export const getOpacity = opacity =>
  `${toFixed(opacity)*100 || 100}%`

// gradientHandlePositions
export const getSolidColor = fill => ({
  css: getCSSRGBA(fill.color),
  opacity: getOpacity(fill.opacity),
  color: getCSSHEX(fill.color)
})

export const getLinearGradient = fill => ({
  css: `linear-gradient(to top, ${getCSSRGBA(fill.gradientStops[0].color)}, ${getCSSRGBA(fill.gradientStops[1].color)})`,
  opacity: getOpacity(fill.opacity),
  color: 'Linear'
})

export const getRadialGradient = fill => ({
  css: `radial-gradient(circle at 50% 50%, ${getCSSRGBA(fill.gradientStops[0].color)}, ${getCSSRGBA(fill.gradientStops[1].color)})`,
  opacity: getOpacity(fill.opacity),
  color: 'Radial'
})

export const getAngularGradient = fill => ({
  css: `conic-gradient(from 0.25turn, ${getCSSRGBA(fill.gradientStops[0].color)}, ${getCSSRGBA(fill.gradientStops[1].color)})`, opacity: getOpacity(fill.opacity),
  color: 'Angular'
})

export const getDiamondGradient = fill => ({
  css: `linear-gradient(to bottom right, ${getCSSRGBA(fill.gradientStops[0].color)}, ${getCSSRGBA(fill.gradientStops[1].color)}) bottom right / 50% 50% no-repeat,` +
  `linear-gradient(to bottom left, ${getCSSRGBA(fill.gradientStops[0].color)}, ${getCSSRGBA(fill.gradientStops[1].color)}) bottom left / 50% 50% no-repeat, ` +
  `linear-gradient(to top left, ${getCSSRGBA(fill.gradientStops[0].color)}, ${getCSSRGBA(fill.gradientStops[1].color)}) top left / 50% 50% no-repeat, ` +
  `linear-gradient(to top right, ${getCSSRGBA(fill.gradientStops[0].color)}, ${getCSSRGBA(fill.gradientStops[1].color)}) top right / 50% 50% no-repeat`,
  opacity: getOpacity(fill.opacity),
  color: 'Diamond'
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
