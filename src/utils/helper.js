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

export const walkFile = fileData => {
  const { styles, components } = fileData
  const finalComponents = []
  const step = (nodes) => {
    nodes.map(node => {
      if (node.styles) {
        Object.keys(node.styles).map(styleType => {
          const id = node.styles[styleType]
          styles[id].value = node[`${styleType}s`]
        })
      }
      if (node.type==='COMPONENT') {
        finalComponents.push({...node, description: components[node.id].description})
      }
      if (node.children) {
        step(node.children)
      }
      return 1
    })
  }
  step(fileData.document.children)
  return { styles: formatStyles(styles), components: finalComponents }
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

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

export const getImage = (id, useLocalImages, images) =>
  useLocalImages ?
  `${process.env.PUBLIC_URL}/data/${id.replace(':', '-')}.jpg` :
  images[id]

export const getUrlImage = (id, useLocalImages, images) =>
  `url(${getImage(id, useLocalImages, images)})`
