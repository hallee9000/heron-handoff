export const generateRects = (nodes, docRect) => {
  const rects = []
  const step = (nodes) => {
    nodes.map(node => {
      const nbb = node.absoluteBoundingBox
      if (node.visible===false) {
        return
      } else {
        const top = (nbb.y - docRect.y)/docRect.height
        const left = (nbb.x - docRect.x)/docRect.width
        const width = nbb.width/docRect.width
        const height = nbb.height/docRect.height
        rects.push({
          box: {
            top: `${top*100}%`,
            left: `${left*100}%`,
            width: `${width*100}%`,
            height: `${height*100}%`
          },
          ruler: {
            top: `calc(${(top+height)*100}% - 1px)`,
            left: `calc(${(left+width)*100}% - 1px)`
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
