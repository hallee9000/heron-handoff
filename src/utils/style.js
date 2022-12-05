import Color from "color"
import { toFixed } from 'utils/mark'
import { DEFAULT_SETTINGS, WEB_MULTIPLE, IOS_DENSITY, ANDROID_DENSITY, UNITS, COLOR_FORMATS, ANDROID_COLOR_FORMATS } from 'utils/const'

const resolutions = [ WEB_MULTIPLE, IOS_DENSITY, ANDROID_DENSITY ]

export const polyfillAlpha = alpha =>
  typeof alpha!=='number' ? 1 : alpha

export const getRGBAObj = color => {
  const alpha = polyfillAlpha(color.a)
  return ({r: (color.r*255).toFixed(), g: (color.g*255).toFixed(), b: (color.b*255).toFixed(), alpha: toFixed(alpha)})
}

export const getColor = color =>
  Color(getRGBAObj(color))

export const getRGB = color => {
  const rgba = getRGBAObj(color)
  delete rgba.alpha
  return Object.keys(rgba)
    .map(key => rgba[key])
    .join(', ')
}

export const getCSSRGBA = (color, opacity) => {
  (typeof opacity === 'number') && (color.a = opacity)
  const colorObject = getRGBAObj(color)
  const keys = Object.keys(colorObject)
  return `rgba(${keys.map(key => colorObject[key]).join(',')})`
}

export const getCSSHEX = color =>
  getColor(color).hex()

export const getHEXAlpha = alpha =>
  ("0" + parseInt(alpha*255, 10).toString(16))
    .slice(-2)
    .toUpperCase()

export const getCSSHEXA = (color, opacity) => {
  if (typeof opacity === 'number') {
    color.a = opacity
  }
  const alpha = getColor(color).valpha
  const hexAlpha = getHEXAlpha(alpha)
  return getCSSHEX(color) + (alpha===1 ? '' : hexAlpha)
}

export const getCSSAHEX = (hexa) => {
  if (hexa.length===9) {
    return '#' + hexa.slice(-2) + hexa.slice(1, 7)
  } else {
    return '#FF' + hexa.slice(1, 7)
  }
}

export const getCSSHSLA = (color, opacity) => {
  (typeof opacity === 'number') && (color.a = opacity)
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

export const formattedColor = (color, globalSettings) => {
  const { platform, colorFormat } = globalSettings
  const formats = platform===2 ? ANDROID_COLOR_FORMATS : COLOR_FORMATS
  const key = formats[colorFormat].toLowerCase()
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
    ahex: getCSSAHEX(getCSSHEXA(stop.color)),
    rgba: getCSSRGBA(stop.color),
    hsla: getCSSHSLA(stop.color),
    alpha: toFixed(polyfillAlpha(stop.color.a))
  }))

// default RGBA, use as inline css
export const stopsToBackground = (stops) =>
  stops.map(stop =>
    formattedColor(stop, { colorFormat: 2 }) + ' ' + stop.position
  ).join(', ')

// use as dynamic template
export const stopsToBackgroundWithFormat = (stops, globalSettings) => {
  // 如果是 HEX，代码里仍需使用 HEXA
  const { colorFormat } = globalSettings
  const overridedSettings = { ...globalSettings, colorFormat: colorFormat || 1 }
  return stops.map(stop =>
    formattedColor(stop, overridedSettings) + ' ' + stop.position
  ).join(', ')
}

export const getGradientDegreeFromMatrix = gradientTransform => {
  const angle = Math.atan2(-gradientTransform[1][0], gradientTransform[0][0]) * (180 / Math.PI)
  if (angle >= -180 && angle <= 90) {
    return toFixed(angle+90) + '°'
  } else {
    return toFixed(angle-270) + '°'
  }
}

export const getGradientDegreeFromPositions = positions => {
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

export const getGradientDegree = fill =>
  fill.gradientHandlePositions ?
  getGradientDegreeFromPositions(fill.gradientHandlePositions) :
  // from plugin
  getGradientDegreeFromMatrix(fill.gradientTransform)

export const getSolidColor = fill => ({
  codeTemplate: '{{color}}',
  css: getCSSRGBA(fill.color, fill.opacity),
  alpha: toFixed(polyfillAlpha(fill.color.a)),
  hex: getCSSHEX(fill.color),
  hexa: getCSSHEXA(fill.color, fill.opacity),
  ahex: getCSSAHEX(getCSSHEXA(fill.color, fill.opacity)),
  rgba: getCSSRGBA(fill.color, fill.opacity),
  hsla: getCSSHSLA(fill.color, fill.opacity),
  type: 'Solid'
})

export const getLinearGradient = fill => ({
  codeTemplate: 'linear-gradient({{degree}}, {{stops}})',
  css: `linear-gradient(to bottom, ${ stopsToBackground(getStops(fill.gradientStops)) })`,
  opacity: getOpacity(fill.opacity),
  type: 'Linear',
  stops: getStops(fill.gradientStops),
  angle: getGradientDegree(fill)
})

export const getRadialGradient = fill => ({
  codeTemplate: 'radial-gradient(circle at 50% 50%, {{stops}})',
  css: `radial-gradient(circle at 50% 50%, ${ stopsToBackground(getStops(fill.gradientStops)) })`,
  opacity: getOpacity(fill.opacity),
  type: 'Radial',
  stops: getStops(fill.gradientStops),
  angle: getGradientDegree(fill)
})

export const getAngularGradient = fill => ({
  codeTemplate: 'conic-gradient(from {{degree}}, {{stops}})',
  css: `conic-gradient(from 0.25turn, ${ stopsToBackground(getStops(fill.gradientStops)) })`,
  opacity: getOpacity(fill.opacity),
  type: 'Angular',
  stops: getStops(fill.gradientStops),
  angle: getGradientDegree(fill)
})

export const getDiamondCodeTemplate = () => {
  const directions = ['bottom right', 'bottom left', 'top left', 'top right']
  return directions
    .map(direction => `linear-gradient(to ${direction}, {{stops}}) ${direction} / 50% 50% no-repeat`)
    .join(', \n')
}

export const getDiamondGradient = fill => ({
  codeTemplate: getDiamondCodeTemplate(),
  css: getDiamondCodeTemplate().replace(/{{stops}}/g, stopsToBackground(getStops(fill.gradientStops))),
  opacity: getOpacity(fill.opacity),
  type: 'Diamond',
  stops: getStops(fill.gradientStops),
  angle: getGradientDegree(fill)
})

export const getFillsStyle = fills => {
  if (!fills) {
    return { styles:[] }
  }
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

export const getFillCSSCode = (fillStyle, globalSettings) => {
  const { codeTemplate, angle } = fillStyle
  // 如果是 HEX，代码里仍需使用 HEXA
  const { colorFormat } = globalSettings
  const overridedSettings = { ...globalSettings, colorFormat: colorFormat || 1 }
  const color = formattedColor(fillStyle, overridedSettings)
  let code = codeTemplate
  if (codeTemplate.indexOf('{{degree}}') > -1) {
    code = code.replace(/{{degree}}/g, `${angle.replace('°', '')}deg`)
  }
  if (codeTemplate.indexOf('{{color}}') > -1) {
    code = code.replace(/{{color}}/g, color)
  }
  if (codeTemplate.indexOf('{{stops}}') > -1) {
    code = code.replace(/{{stops}}/g, stopsToBackgroundWithFormat(fillStyle.stops, globalSettings))
  }
  return code
}

export const getShadowEffect = effect => ({
    x: effect.offset.x,
    y: effect.offset.y,
    blur: effect.radius,
    spread: effect.spread||0,
    hex: getCSSHEX(effect.color),
    hexa: getCSSHEXA(effect.color),
    ahex: getCSSAHEX(getCSSHEXA(effect.color)),
    rgba: getCSSRGBA(effect.color),
    hsla: getCSSHSLA(effect.color),
    alpha: toFixed(polyfillAlpha(effect.color.a))
  })

export const getEffectsStyle = effects => {
  if (!effects || effects.length===0) {
    return { type: 'FAILED_EFFECT', styles:[] }
  }
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
            codeTemplate: `{{x}} {{y}} {{radius}} {{spread}} {{color}}`
          }
        case 'INNER_SHADOW':
          return {
            type: effect.type,
            typeName: 'Inner Shadow',
            category: 'shadow',
            ...getShadowEffect(effect),
            porpertyName: 'shadow',
            codeTemplate: `inset {{x}} {{y}} {{radius}} {{spread}} {{color}}`
          }
        case 'LAYER_BLUR':
          return {
            type: effect.type,
            typeName: 'Layer Blur',
            category: 'blur',
            blur: effect.radius,
            dashedPorpertyName: 'filter',
            porpertyName: 'filter',
            codeTemplate: `blur({{radius}})`
          }
        case 'BACKGROUND_BLUR':
          return {
            type: effect.type,
            category: 'blur',
            typeName: 'Background Blur',
            blur: effect.radius,
            dashedPorpertyName: 'backdrop-filter',
            porpertyName: 'backdropFilter',
            codeTemplate: `blur({{radius}})`
          }
        default:
          return {}
      }
    })
  return { type, styles }
}

export const getEffectCSSCode = (effectStyle, globalSettings) => {
  const { category, codeTemplate, blur, spread, x, y } = effectStyle
  // 如果是 HEX，代码里仍需使用 HEXA
  const { colorFormat } = globalSettings
  const overridedSettings = { ...globalSettings, colorFormat: colorFormat || 1 }
  let code = codeTemplate
  code = code.replace('{{radius}}', formattedNumber(blur, overridedSettings))
  if (category==='shadow') {
    code = code.replace('{{x}}', formattedNumber(x, overridedSettings))
    code = code.replace('{{y}}', formattedNumber(y, overridedSettings))
    code = code.replace('{{spread}}', formattedNumber(spread, overridedSettings))
    code = code.replace('{{color}}', formattedColor(effectStyle, overridedSettings))
  }
  return code
}

export const getEffectsCSSObject = (
  effectItems,
  globalSettings=DEFAULT_SETTINGS,
  colorFormat=2,
  shadowType='box',
  useDashedName
) => {
  let style = {}, shadows = []
  // eslint-disable-next-line
  effectItems.map((effectItem) => {
    const { type, dashedPorpertyName, porpertyName } = effectItem
    const code = getEffectCSSCode(effectItem, globalSettings, colorFormat)
    if (type==='DROP_SHADOW' || type==='INNER_SHADOW') {
      shadows.push(code)
    } else {
      style[useDashedName ? dashedPorpertyName : porpertyName] = code
    }
  })
  style[useDashedName ? `${shadowType}-shadow` : `${shadowType}Shadow`] = shadows.join()
  return style
}

export const getLineHeight = textItems => {
  const { lineHeightPx, lineHeightPercentFontSize, lineHeight, lineHeightUnit } = textItems
  let finalLineHeight
  if (typeof lineHeightPx === 'number') {
    finalLineHeight =
      lineHeightUnit==='PIXELS' ?
      lineHeightPx :
      (lineHeightUnit==='INTRINSIC_%' ? 'normal' : toFixed((lineHeightPercentFontSize || 100)/100))
  } else {
    // from plugin
    finalLineHeight =
      lineHeightUnit==='PIXELS' ?
      lineHeight :
      (lineHeightUnit==='AUTO' ? 'normal' : toFixed((lineHeight || 100)/100))
  }
  return finalLineHeight
}

export const getTextStyle = (textItems, isInPropPanel) => {
  const {
    fontFamily, fontWeight, fontSize, textDecoration,
    letterSpacing, lineHeightUnit,
    textAlignHorizontal
  } = textItems
  const decorations = { 'UNDERLINE': 'underline', 'STRIKETHROUGH': 'line-through' }
  const lineHeight = getLineHeight(textItems)
  const textStyle = {
    fontFamily,
    fontWeight,
    fontSize,
    lineHeight,
    lineHeightUnit,
    letterSpacing,
    textDecoration: decorations[textDecoration]
  }
  isInPropPanel && (textStyle.textAlign = textAlignHorizontal.toLowerCase())
  return textStyle
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
  const localStyles = styles[type.toUpperCase()]
  const selfStyle = nodeStyles && nodeStyles[type]
  if (!selfStyle) {
    return null
  }
  const localStyle = localStyles ? localStyles.find(({id}) => id===selfStyle.id) : null
  if (localStyle) {
    // local style
    return localStyle
  } else {
    // remote style
    return selfStyle
  }
}

export const formattedNumber = (number, { platform, unit, resolution, remBase, numberFormat }, withoutUnit=false) => {
  const scaledNumber = number*resolutions[platform][resolution].value
  const finalNumber = (unit===3 || unit===4) ? number/remBase : scaledNumber
  return toFixed(finalNumber, numberFormat) + (withoutUnit ? '' : UNITS[unit])
}

function getBorderCSS (node, globalSettings, borderStyle, strokeColor) {
  if (node.strokeWeight) {
    return `border: ${formattedNumber(node.strokeWeight, globalSettings)} ${borderStyle} ${strokeColor};\n`
  } else {
    const { strokeTopWeight, strokeRightWeight, strokeBottomWeight, strokeLeftWeight } = node
    const strokeWeights = {
      top: strokeTopWeight,
      right: strokeRightWeight,
      bottom: strokeBottomWeight,
      left: strokeLeftWeight
    }
    return Object.keys(strokeWeights)
      .filter(position => strokeWeights[position]!==0)
      .map(position =>
        `border-${position}: ${formattedNumber(strokeWeights[position], globalSettings)} ${borderStyle} ${strokeColor};\n`
      )
      .join('')
  }
}

export const getCode = (node, fillItems, strokeItems, effectItems, textStyle, globalSettings) => {
  const colorFormat = globalSettings.colorFormat || 0
  const { opacity, cornerRadius, rectangleCornerRadii, strokeDashes } = node
  let code = ''

  // opacity
  if (opacity!==undefined) {
    code += `opacity: ${opacity};\n`
  }

  // border-radius
  if (cornerRadius) {
    code += `border-radius: ${formattedNumber(cornerRadius, globalSettings)};\n`
  } else if (rectangleCornerRadii) {
    code += `border-radius: ${rectangleCornerRadii.map(r => formattedNumber(r, globalSettings)).join(' ')};\n`
  }

  // color or background
  if (fillItems.length) {
    if (node.type==='TEXT') {
      fillItems
        .filter(({type}) => type==='Solid')
        // eslint-disable-next-line
        .map(fill => {
          code += `color: ${getFillCSSCode(fill, globalSettings)};\n`
        })
    } else {
      code += 'background: ' + fillItems
        .map(fill => getFillCSSCode(fill, globalSettings))
        .join()
        +';\n'
    }
  }

  // border
  if (strokeItems.length) {
    const borderStyle = strokeDashes ? 'dashed' : 'solid'
    strokeItems
      .filter(({type}) => type==='Solid')
      // eslint-disable-next-line
      .map(stroke => {
        const strokeColor = getFillCSSCode(stroke, globalSettings)
        code += getBorderCSS(node, globalSettings, borderStyle, strokeColor)
      })
  }

  // shadow or blur
  if (effectItems.length) {
    const shadowType = node.type==='TEXT' ? 'text' : 'box'
    const effects = getEffectsCSSObject(effectItems, globalSettings, colorFormat, shadowType, true)
    Object.keys(effects)
      // eslint-disable-next-line
      .map(propertyName => {
        code += `${propertyName}: ${effects[propertyName]};\n`
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
