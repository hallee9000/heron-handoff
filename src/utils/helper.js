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

export const getFileKey = pageUrl => {
  if (!/^https:\/\/(www.)?figma.com\/file\//.test(pageUrl)) {
    return ''
  }
  const parser = document.createElement('a')
  parser.href = pageUrl
  return parser.pathname.replace('/file/', '').replace(/\/.*/,'')
}

export const urlWithParams = (url, data) => {
  const urlObj = new URL(url)
  Object.keys(data).forEach(key => urlObj.searchParams.append(key, data[key]))
  return urlObj
}

export const getFrames = data =>
  data
    .map(page => page.children
      .filter(frame => frame.type==='FRAME')
      .map(({id, name}) => ({id, name}))
    )
    .filter(frameIds => frameIds.length)
    .reduce((ids, currentIds) => ids.concat(currentIds), [])

export const getStyleItems = (node, key) =>
  key==='backgrounds' ? node.fills : node[key]

export const isAllImageFill = fills =>
  fills.filter(fill => fill.type === 'IMAGE').length === fills.length

export const walkFile = fileData => {
  const { styles, components } = fileData
  const finalStyles = {}
  const finalComponents = [], exportSettings = []
  const step = (nodes) => {
    // eslint-disable-next-line
    nodes.map(node => {
      // handle style
      if (node.styles) {
        // eslint-disable-next-line
        Object.keys(node.styles).map(styleType => {
          const id = node.styles[styleType]
          if (!finalStyles[id]) {
            const items = styleType!=='text' ? getStyleItems(node, `${styleType}s`) : node.style
            finalStyles[id] = {
              items,
              ...styles[id]
            }
          }
        })
      }
      // handle component
      if (node.type==='COMPONENT') {
        finalComponents.push({...node, description: components[node.id].description})
      }
      // handle exports
      if (node.visible!==false && node.exportSettings && node.exportSettings.length) {
        // eslint-disable-next-line
        node.exportSettings.map(setting => {
          exportSettings.push({
            id: node.id,
            name: node.name.replace(/\//g, '-'),
            ...setting
          })
        })
      }
      // walk in
      if (node.children) {
        step(node.children)
      }
    })
  }
  step(fileData.document.children)
  return { styles: formatStyles(finalStyles), components: finalComponents, exportSettings }
}

export const getFileName = (exportSetting, index) => {
  const { name, suffix, format, constraint } = exportSetting
  let fileName = suffix ? `${name}-${suffix}` : name
  if (index!==undefined) {
    fileName += `-${index}`
  }
  const scale = format==='SVG' ? '' : `@${constraint.value}x`
  const fileFormat = format.toLowerCase()
  return `${fileName}${scale}.${fileFormat}`
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

export const getImage = (id, useLocalImages, images) =>
  useLocalImages ?
  `${process.env.PUBLIC_URL}/data/${id.replace(/:/g, '-')}.png` :
  images[id]

export const getUrlImage = (id, useLocalImages, images) =>
  `url(${getImage(id, useLocalImages, images)})`

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
    const textarea = document.createElement('textarea')
    textarea.setAttribute('readonly', 'readonly')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.setSelectionRange(0, 9999);
    if (document.execCommand('copy')) {
      document.execCommand('copy')
      callback && callback()
    }
    document.body.removeChild(textarea)
  }
}

export const trimFilePath = filePath =>
  filePath.replace(/\//g, '-').replace(/:/g, '-')

export const getGlobalSettings = () =>
  JSON.parse(window.localStorage.getItem('globalSettings'))

export const setGlobalSettings = (...args) => {
  let globalSettings
  const argsLength = args.length
  if (argsLength===1) {
    const [ settings ] = args
    globalSettings = JSON.stringify(settings)
    window.localStorage.setItem('globalSettings', globalSettings)
  } else {
    const [ name, value, callback ] = args
    const localSettings = getGlobalSettings()
    globalSettings = {...localSettings, [name]: value}
    window.localStorage.setItem('globalSettings', JSON.stringify(globalSettings))
    callback && callback(globalSettings)
  }
}
