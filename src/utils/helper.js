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

export const getFileKey = pageUrl => {
  if (!/^https:\/\/(www.)?figma.com\/file\//.test(pageUrl)) {
    return ''
  }
  const parser = document.createElement('a')
  parser.href = pageUrl
  return parser.pathname.replace('/file/', '').replace(/\/.*/,'')
}

export const getUrlParameter = name => {
  // eslint-disable-next-line
  const tempName = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + tempName + '=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export const urlWithParams = (url, data) => {
  const urlObj = new URL(url)
  Object.keys(data).forEach(key => urlObj.searchParams.append(key, data[key]))
  return urlObj
}

export const getPagedFrames = data => {
  let pagedFrames = {}
  if (data.document && data.document.children) {
    data.document.children
      // eslint-disable-next-line
      .map((page) => {
        pagedFrames[page.id] = {
          isCollapsed: true,
          checked: true,
          name: page.name,
          frames: page.children
            .filter(frame => frame.type==='FRAME' && frame.visible!==false)
            .map(({id, name}) => ({id, name, checked: true}))
            .reverse()
        }
      })
  }
  return pagedFrames
}

export const getSelectedPagedFrames = pagedFrames => {
  let finalFrames = {}
  Object.keys(pagedFrames)
    // eslint-disable-next-line
    .map(pageId => {
      const { name, frames } = pagedFrames[pageId]
      const checkedFrames = frames.filter(({checked}) => checked)
      if (checkedFrames.length) {
        finalFrames[pageId] = {
          name, frames: checkedFrames
        }
      }
    })
  return finalFrames
}

export const getFrameOptions = pagedFrames => {
  const options = []
  Object.keys(pagedFrames)
    // eslint-disable-next-line
    .map(pageId => {
      const { name, frames } = pagedFrames[pageId]
      if (frames.length) {
        options.push({
          label: name,
          value: pageId,
          children: frames.map(({id, name}) => ({value: id, label: name}))
        })
      }
    })
  return options
}

export const filterFrameOptions = (frameOptions, value) => {
  return frameOptions.map(p => {
    const pageContainsValue = p.label.toLowerCase().indexOf(value.toLowerCase()) > -1
    const frameContainsValue = p.children.some(f => f.label.toLowerCase().indexOf(value.toLowerCase()) > -1)
    if (pageContainsValue) {
      return p
    } else if (frameContainsValue) {
      const targetedChildren = p.children.filter(f => f.label.toLowerCase().indexOf(value.toLowerCase()) > -1)
      return {...p, children: targetedChildren}
    } else {
      return ''
    }
  })
  .filter(p => !!p)
}

export const getFlattedFrames = (pagedFrames, needCheck=true) => {
  let flattedFrames = []
  Object.keys(pagedFrames)
    // eslint-disable-next-line
    .map(pageId => {
      flattedFrames = flattedFrames
        .concat(
          pagedFrames[pageId].frames
            .filter(({checked}) => needCheck ? checked : true)
            .map(({id, name}) => ({id, name}))
        )
    })
  return flattedFrames
}

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

export const getImage = (id, useLocalImages, images) =>
  useLocalImages ?
  `${process.env.PUBLIC_URL}/data/${id.replace(/:/g, '-')}.png` :
  images[id].url

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
  JSON.parse(window.localStorage.getItem('heronHandoff.settings'))

export const setGlobalSettings = (...args) => {
  let globalSettings
  const argsLength = args.length
  if (argsLength===1) {
    const [ settings ] = args
    globalSettings = JSON.stringify(settings)
    window.localStorage.setItem('heronHandoff.settings', globalSettings)
  } else {
    const [ name, value, callback ] = args
    const localSettings = getGlobalSettings()
    globalSettings = {...localSettings, [name]: value}
    window.localStorage.setItem('heronHandoff.settings', JSON.stringify(globalSettings))
    callback && callback(globalSettings)
  }
}
