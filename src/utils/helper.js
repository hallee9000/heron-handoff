import { STYLE_TYPES } from 'utils/const'

export const throttle = (fn, delay) => {
 	var timer = null
 	return function(){
 		var context = this, args = arguments;
 		clearTimeout(timer)
 		timer = setTimeout(function(){
 			fn.apply(context, args);
 		}, delay)
 	}
}

export const getFileKey = pageUrl => {
  if (!/^https:\/\/(www.)?figma.com\/file\//.test(pageUrl)) {
    return ''
  }
  const parser = document.createElement('a');
  parser.href = pageUrl;
  return parser.pathname.replace('/file/', '').replace(/\/.*/,'');
}

export const urlWithParams = (url, data) => {
  const urlObj = new URL(url)
  Object.keys(data).forEach(key => urlObj.searchParams.append(key, data[key]))
  return urlObj
}

export const walkFile = fileData => {
  const { styles } = fileData
  const components = []
  const step = (nodes) => {
    nodes.map(node => {
      if (node.styles) {
        Object.keys(node.styles).map(styleType => {
          const id = node.styles[styleType]
          styles[id].value = node[`${styleType}s`]
        })
      }
      if (node.type==='COMPONENT') {
        components.push(node)
      }
      if (node.children) {
        step(node.children)
      }
      return 1
    })
  }
  step(fileData.document.children)
  return { styles: formatStyles(styles), components }
}

export const formatStyles = styles => {
  const fatStyles = {}
  Object.keys(styles).map(key => {
    const { styleType } = styles[key]
    if (fatStyles[styleType]) {
      fatStyles[styleType].push(styles[key])
    } else {
      fatStyles[styleType] = [styles[key]]
    }
  })
  return fatStyles
}