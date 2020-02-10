import Color from "color"
import { toFixed } from 'utils/mark'
import { WEB_MULTIPLE, IOS_DENSITY, ANDROID_DENSITY, UNITS, COLOR_FORMATS } from 'utils/const'

const resolutions = [ WEB_MULTIPLE, IOS_DENSITY, ANDROID_DENSITY ]

export const getRGBAObj = color =>
  ({r: (color.r*255).toFixed(), g: (color.g*255).toFixed(), b: (color.b*255).toFixed(), alpha: toFixed(color.a)})

export const getColor = color =>
  Color(getRGBAObj(color))

export const getRGB = color => {
  const rgba = getRGBAObj(color)
  delete rgba.alpha
  return Object.keys(rgba)
    .map(key => rgba[key])
    .join(', ')
}

export const getCSSRGBA = color =>
  `rgba(${Object.keys(getRGBAObj(color)).map(key => getRGBAObj(color)[key]).join(',')})`

export const getCSSHEX = color =>
  getColor(color).hex()

export const getCSSHEXA = color => {
  const alpha = getColor(color).valpha
  const hexAlpha = ("0" + parseInt(alpha*256,10)
    .toString(16))
    .slice(-2)
    .toUpperCase()
  return  getCSSHEX(color) + hexAlpha
}

export const getCSSHSLA = color => {
  const c = getColor(color).hsl().string()
  const hsl = c.split(',')
    .map((part, index) =>
      index===0 ? part.split('(')[0] + '(' + toFixed(part.split('(')[1] - 0) : part
    )
    .join()
  return hsl
}

export const getCSSAlpha = color =>
  getColor(color).alpha()

export const formattedColor = (colorFormat, color) => {
  const key = COLOR_FORMATS[colorFormat].toLowerCase()
  return color[key]
}

export const getPercentage = num =>
  `${toFixed(num)==='' ? 100 : toFixed(num)*100 }%`

export const getOpacity = opacity =>
  toFixed(opacity) || 1

export const getStops = stops =>
  stops.map(stop => ({
    position: getPercentage(stop.position),
    hex: getCSSHEX(stop.color),
    hexa: getCSSHEXA(stop.color),
    rgba: getCSSRGBA(stop.color),
    hsla: getCSSHSLA(stop.color),
    alpha: toFixed(stop.color.a)
  }))

// default RGBA
export const stopsToBackground = (stops, colorFormat=2, separator=', ') =>
  stops.map(stop =>
    formattedColor(colorFormat, stop) + ' ' + stop.position
  ).join(separator)

export const getGradientDegree = positions => {
  const offsetX = positions[1].x-positions[0].x
  const offsetY = positions[1].y-positions[0].y
  const a = Math.atan2(offsetY, offsetX)
  let angle = a * 180 / Math.PI
  if (angle > 360) {
      angle -= 360
  }
  if (angle < 0) {
      angle += 360
  }
  return toFixed(angle) + '°'
}

export const getSolidColor = fill => ({
  codeTemplate: '{{color}}',
  css: getCSSRGBA(fill.color),
  opacity: getOpacity(fill.opacity),
  alpha: toFixed(fill.color.a),
  hex: getCSSHEX(fill.color),
  hexa: getCSSHEXA(fill.color),
  rgba: getCSSRGBA(fill.color),
  hsla: getCSSHSLA(fill.color),
  type: 'Solid'
})

export const getLinearGradient = fill => ({
  codeTemplate: 'linear-gradient(to bottom, {{stops}})',
  css: `linear-gradient(to bottom, ${ stopsToBackground(getStops(fill.gradientStops)) })`,
  opacity: getOpacity(fill.opacity),
  type: 'Linear',
  stops: getStops(fill.gradientStops),
  angle: getGradientDegree(fill.gradientHandlePositions)
})

export const getRadialGradient = fill => ({
  codeTemplate: 'radial-gradient(circle at 50% 50%, {{stops}})',
  css: `radial-gradient(circle at 50% 50%, ${ stopsToBackground(getStops(fill.gradientStops)) })`,
  opacity: getOpacity(fill.opacity),
  type: 'Radial',
  stops: getStops(fill.gradientStops),
  angle: getGradientDegree(fill.gradientHandlePositions)
})

export const getAngularGradient = fill => ({
  codeTemplate: 'conic-gradient(from 0.25turn, {{stops}})',
  css: `conic-gradient(from 0.25turn, ${ stopsToBackground(getStops(fill.gradientStops)) })`,
  opacity: getOpacity(fill.opacity),
  type: 'Angular',
  stops: getStops(fill.gradientStops),
  angle: getGradientDegree(fill.gradientHandlePositions)
})

export const getDiamondCodeTemplate = () => {
  const directions = ['bottom right', 'bottom left', 'top left', 'top right']
  return directions
    .map(direction => `linear-gradient(to ${direction}, {{stops}}) ${direction} / 50% 50% no-repeat`)
    .join(', ')
}

export const getDiamondGradient = fill => ({
  codeTemplate: getDiamondCodeTemplate(),
  css: getDiamondCodeTemplate().replace(/{{stops}}/g, stopsToBackground(getStops(fill.gradientStops))),
  opacity: getOpacity(fill.opacity),
  type: 'Diamond',
  stops: getStops(fill.gradientStops),
  angle: getGradientDegree(fill.gradientHandlePositions)
})

export const getFillsStyle = fills => {
  let type = ''
  const styles = fills
    .filter(({visible}) => visible!==false)
    .map(fill => {
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

export const getFillCSSCode = (fillStyle, colorFormat=0) => {
  const { codeTemplate } = fillStyle
  const color = formattedColor(colorFormat, fillStyle)
  let code = codeTemplate
  if (codeTemplate.indexOf('{{color}}') > -1) {
    code = code.replace(/{{color}}/g, color)
  }
  if (codeTemplate.indexOf('{{stops}}') > -1) {
    code = code.replace(/{{stops}}/g, stopsToBackground(fillStyle.stops, colorFormat, ', '))
  }
  return code
}

export const getShadowEffect = effect => ({
    x: effect.offset.x,
    y: effect.offset.y,
    blur: effect.radius,
    hex: getCSSHEX(effect.color),
    hexa: getCSSHEXA(effect.color),
    rgba: getCSSRGBA(effect.color),
    hsla: getCSSHSLA(effect.color),
    alpha: toFixed(effect.color.a)
  })

export const getEffectsStyle = effects => {
  let type = ''
  const styles = effects
    .filter(({visible}) => visible!==false)
    .map(effect => {
      type = type==='' ? effect.type : ( type===effect.type ? type : 'MIX_EFFECT')
      switch (effect.type) {
        case 'DROP_SHADOW':
          return {
            type: effect.type,
            typeName: 'Drop Shadow',
            category: 'shadow',
            ...getShadowEffect(effect),
            porpertyName: 'shadow',
            codeTemplate: `{{x}} {{y}} {{radius}} 0 {{color}}`,
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
            porpertyName: 'shadow',
            codeTemplate: `inset {{x}} {{y}} {{radius}} 0 {{color}}`,
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
            porpertyName: 'filter',
            codeTemplate: `blur({{radius}})`,
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
            porpertyName: 'backdrop-filter',
            codeTemplate: `blur({{radius}})`,
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

export const getEffectCSSCode = (effectStyle, globalSettings, colorFormat=0) => {
  const { category, codeTemplate, blur, x, y } = effectStyle
  let code = codeTemplate
  code = code.replace('{{radius}}', formattedNumber(blur, globalSettings))
  if (category==='shadow') {
    code = code.replace('{{x}}', formattedNumber(x, globalSettings))
    code = code.replace('{{y}}', formattedNumber(y, globalSettings))
    code = code.replace('{{color}}', formattedColor(colorFormat, effectStyle))
  }
  return code
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

export const getTextStyle = textItems => {
  const {
    fontFamily, fontWeight, fontSize, textDecoration,
    letterSpacing, textAlignHorizontal, lineHeightPx,
    lineHeightPercentFontSize, lineHeightUnit
  } = textItems
  const decorations = { 'UNDERLINE': 'underline', 'STRIKETHROUGH': 'line-through' }
  const lineHeight =
    lineHeightUnit==='PIXELS' ?
    lineHeightPx :
    (lineHeightUnit==='INTRINSIC_%' ? 'normal' : toFixed((lineHeightPercentFontSize || 100)/100))
  return {
    fontFamily,
    fontWeight,
    fontSize,
    lineHeight,
    lineHeightUnit,
    letterSpacing,
    textAlign: textAlignHorizontal.toLowerCase(),
    textDecoration: decorations[textDecoration]
  }
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
      return { type: 'TEXT', styles: getTextStyle(styles) }
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

export const formattedNumber = (number, { platform, unit, resolution, remBase }, withoutUnit=false) => {
  const scaledNumber = number*resolutions[platform][resolution].value
  const finalNumber = unit===4 ? number/remBase : scaledNumber
  return toFixed(finalNumber) + (withoutUnit ? '' : UNITS[unit])
}

export const getCode = (node, fillItems, strokeItems, effectItems, textStyle, globalSettings) => {
  const colorFormat = globalSettings.colorFormat || 0
  const { opacity, cornerRadius, strokeWeight, strokeDashes } = node
  let code = ''

  // opacity
  if (opacity!==undefined) {
    code += `opacity: ${opacity};\n`
  }

  // border-radius
  if (cornerRadius) {
    code += `border-radius: ${formattedNumber(cornerRadius, globalSettings)};\n`
  }

  // color or background
  if (fillItems.length) {
    const propertyName = node.type==='TEXT' ? 'color' : 'background'
    fillItems
      // eslint-disable-next-line
      .map(fill => {
        const fillColor = getFillCSSCode(fill, colorFormat)
        code += `${propertyName}: ${fillColor};\n`
      })
  }

  // border
  if (strokeItems.length) {
    const borderStyle = strokeDashes ? 'dashed' : 'solid'
    strokeItems
      // eslint-disable-next-line
      .map(stroke => {
        const strokeColor = getFillCSSCode(stroke, colorFormat)
        code += `border: ${formattedNumber(strokeWeight, globalSettings)} ${borderStyle} ${strokeColor};\n`
      })
  }

  // shadow or blur
  if (effectItems.length) {
    effectItems
      // eslint-disable-next-line
      .map(effect => {
        code += getEffectCSSCode(effect, globalSettings, colorFormat) +'\n'
      })
  }

  // font style
  if (node.type==='TEXT') {
    const { fontFamily, fontWeight, fontSize, lineHeightUnit, lineHeight, letterSpacing, textAlign, textDecoration } = textStyle
    code += `font-family: ${fontFamily};\n`
    code += `font-weight: ${fontWeight};\n`
    code += `font-size: ${formattedNumber(fontSize, globalSettings)};\n`
    code += `line-height: ${lineHeightUnit==='PIXELS' ? formattedNumber(lineHeight, globalSettings) : lineHeight};\n`
    code += `letter-spacing: ${formattedNumber(letterSpacing, globalSettings)};\n`
    code += `text-align: ${textAlign};\n`
    if (textDecoration) {
      code += `text-decoration: ${textDecoration};\n`
    }
  }

  return code
}
