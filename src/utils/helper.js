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

export const generateRects = (nodes, docRect, rate) => {
  const rects = []
  const step = (nodes) => {
    nodes.map(node => {
      const nbb = node.absoluteBoundingBox
      if (node.visible===false) {
        return
      } else {
        rects.push({
          box: {
            top: (nbb.y - docRect.y)*rate,
            left: (nbb.x - docRect.x)*rate,
            width: nbb.width*rate,
            height: nbb.height*rate
          },
          actualWidth: Math.floor(nbb.width)===nbb.width ? nbb.width : nbb.width.toFixed(2),
          actualHeight: Math.floor(nbb.height)===nbb.height ? nbb.height : nbb.height.toFixed(2),
          title: node.name,
          clazz: [
            node.type==='COMPONENT' || node.type==='INSTANCE' ? 'component' : ''
          ]
        })
        if (node.children) {
          step(node.children)
        }
      }
    })
  }
  step(nodes)
  return rects
}
