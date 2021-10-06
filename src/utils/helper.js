import { LOCALIZED_SETTING_KEYS } from "./const"

export const throttle = (fn, delay) => {
 	var timer = null
 	return function(){
 		var context = this, args = arguments
 		clearTimeout(timer)
 		timer = setTimeout(function(){
 			fn.apply(context, args)
 		}, delay)
 	}
}

export const isCmdOrCtrl = e => navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey

export const getStyleItems = (node, key) =>
  key==='backgrounds' ? node.fills : node[key]

export const isAllImageFill = fills =>
  fills.filter(fill => fill.type === 'IMAGE').length === fills.length

export const getFileName = (exportSetting, index) => {
  const { name, suffix, format, constraint } = exportSetting
  let fileName = suffix ? `${name}-${suffix}` : name
  if (index!==undefined) {
    fileName += `-${index}`
  }
  const scale = format==='SVG' ? '' : `@${constraint.value}x`
  const fileFormat = format.toLowerCase()
  fileName = fileName.replace(/ /g, '-')
  return `${trimFilePath(fileName)}${scale}.${fileFormat}`
}

export const formatStyles = styles => {
  const fatStyles = {}
  // eslint-disable-next-line
  Object.keys(styles).map(key => {
    const { styleType } = styles[key]
    if (fatStyles[styleType]) {
      fatStyles[styleType].push({id: key, ...styles[key]})
    } else {
      fatStyles[styleType] = [{id: key, ...styles[key]}]
    }
  })
  return fatStyles
}

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

export function getImageUrl (item, mode, isMock) {
  const fileName = item.fileName ? `exports/${item.fileName}` : `${item.id.replace(/:/g, '-')}.png`
  return (mode==='local' || isMock) ?
    `${process.env.PUBLIC_URL}/data/${fileName}` :
    item.image.url
}

export function getBackgroundImageUrl (item, mode, isMock) {
  return `url(${getImageUrl(item, mode, isMock)})`
}

export const onInputClick = (e, callback) => {
  const input = e.target
  input.setSelectionRange(0, 9999)
  if (document.execCommand('copy')) {
    document.execCommand('copy')
    callback && callback()
  }
}

export const copySomething = (text, callback) => {
  return () => {
    navigator.clipboard.writeText(text)
      .then(callback)
  }
}

export const trimFilePath = filePath =>
  filePath.replace(/\//g, '-').replace(/:/g, '-')

export const filterLocalizedSettings = (settings) => {
  const filteredSettings = {}
  // eslint-disable-next-line
  Object.keys(settings).map(key => {
    if (LOCALIZED_SETTING_KEYS.includes(key)) {
      filteredSettings[key] = settings[key]
    }
  })
  return filteredSettings
}

export const getLocalGlobalSettings = () => {
  return JSON.parse(window.localStorage.getItem('heronHandoff.settings'))
}

export const setLocalGlobalSettings = (settings) => {
  window.localStorage.setItem('heronHandoff.settings', JSON.stringify(filterLocalizedSettings(settings)))
}
