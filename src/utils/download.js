import { asyncForEach, getFileName, trimFilePath } from 'utils/helper'
import { withCors, getSourceCode, getBufferData } from 'api'

// generate index.html
export const handleIndex = async (zip, data, pagedFrames, onStart) => {
  onStart && onStart()
  let indexSourceCode = await getSourceCode(window.location.href)
  indexSourceCode = indexSourceCode
    .replace('PAGED_FRAMES=""', `PAGED_FRAMES = ${JSON.stringify(pagedFrames)}`)
    .replace('FILE_DATA=""', `FILE_DATA = ${JSON.stringify(data)}`)
  zip.file('index.html', indexSourceCode)
}

// generate js
export const handleJs = async (zip, onStart) => {
  onStart && onStart()
  const js = zip.folder("static/js")
  const scripts = document.getElementsByTagName('script')
  await asyncForEach(scripts, async script => {
    if (/chunk.js$/.test(script.src)) {
      const jsSource = await getSourceCode(script.src)
      const pieces = script.src.split('/')
      js.file(pieces[pieces.length - 1], jsSource)
    }
  })
}

// generate ico and css
export const handleIcoAndCSS = async (zip, onStart) => {
  onStart && onStart()
  const css = zip.folder("static/css")
  const styles = document.getElementsByTagName('link')
  await asyncForEach(styles, async style => {
    if (style.rel==='icon') {
      const iconSource = await getBufferData(style.href)
      zip.file('favicon.ico', iconSource, {base64: true})
    } else if (style.rel==='stylesheet') {
      if (/chunk.css$/.test(style.href)) {
        const cssSource = await getSourceCode(style.href)
        const pieces = style.href.split('/')
        css.file(pieces[pieces.length - 1], cssSource)
      }
    }
  })
}

// generate logo.svg
export const handleLogo = async (zip, logoSrc, onStart) => {
  onStart && onStart()
  const logoData = await getBufferData(logoSrc)
  zip.file('logo.svg', logoData, {base64: true})
}

// generate frame and component images
export const handleFramesAndComponents = async (zip, images, onStart) => {
  const dataFolder = zip.folder('data')
  const ids = Object.keys(images)
  await asyncForEach(ids, async (id, index) => {
    const { name, url } = images[id]
    const imgName = trimFilePath(id) + '.png'
    onStart && onStart(index, name, ids.length)
    const imgData = await getBufferData(withCors(url))
    dataFolder.file(imgName, imgData, {base64: true})
  })
}

// generate exporting images
export const handleExports = async (zip, exportSettings, onStart) => {
  const exportsFolder = zip.folder('data/exports')
  await asyncForEach(exportSettings, async (exportSetting, index) => {
    const imgName = getFileName(exportSetting, index)
    onStart && onStart(index, imgName, exportSettings.length)
    const imgData = await getBufferData(withCors(exportSetting.image))
    exportsFolder.file(imgName, imgData, {base64: true})
  })
}
