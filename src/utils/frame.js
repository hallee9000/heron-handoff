export function getAllFrames (nestedFrames) {
  const frames = []
  function walk (items, pageId) {
    // eslint-disable-next-line array-callback-return
    items.map(item => {
      if (!item.id.startsWith('temp-')) {
        frames.push({
          id: item.id,
          name: item.name,
          pageId
        })
      }
      if (item.children) {
        walk(item.children, pageId)
      }
    })
  }
  // page 不需要参与
  nestedFrames.map(page => walk(page.children, page.id))
  return frames
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

export const getFlattenedFrames = (pagedFrames, needCheck=true) => {
  let flattenedFrames = []
  Object.keys(pagedFrames)
    // eslint-disable-next-line
    .map(pageId => {
      flattenedFrames = flattenedFrames
        .concat(
          pagedFrames[pageId].frames
            .filter(({checked}) => needCheck ? checked : true)
            .map(frame => ({...frame, pageId}))
        )
    })
  return flattenedFrames
}
