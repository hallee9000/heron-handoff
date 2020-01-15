import { asyncForEach, getFileName, trimFilePath } from 'utils/helper'
import { withCors, getSourceCode, getBufferData } from 'api'

// generate index.html
export const handleIndex = async (zip, data, whenStart) => {
  whenStart && whenStart()
  const indexSource = await getSourceCode(window.location.href)
  zip.file('index.html', indexSource.replace('var FILE_DATA=""', `var FILE_DATA = ${JSON.stringify(data)}`))
}

// generate js
export const handleJs = async (zip, whenStart) => {
  whenStart && whenStart()
  const js = zip.folder("static/js")
  const scripts = document.getElementsByTagName('script')
  await asyncForEach(scripts, async script => {
    const jsSource = await getSourceCode(script.src)
    const pieces = script.src.split('/')
    js.file(pieces[pieces.length - 1], jsSource)
  })
}

// generate ico and css
export const handleIcoAndCSS = async (zip, whenStart) => {
  whenStart && whenStart()
  const css = zip.folder("static/css")
  const styles = document.getElementsByTagName('link')
  await asyncForEach(styles, async style => {
    if (style.rel==='icon') {
      const iconSource = await getBufferData(style.href)
      zip.file('favicon.ico', iconSource, {base64: true})
    } else if (style.rel==='stylesheet') {
      const cssSource = await getSourceCode(style.href)
      const pieces = style.href.split('/')
      css.file(pieces[pieces.length - 1], cssSource)
    }
  })
}

// generate logo.svg
export const handleLogo = async (zip, logoSrc, whenStart) => {
  whenStart && whenStart()
  const logoData = await getBufferData(logoSrc)
  zip.file('logo.svg', logoData, {base64: true})
}

// generate frame and component images
export const handleFramesAndComponents = async (zip, images, imageMetas, whenStart) => {
  const dataFolder = zip.folder('data')
  await asyncForEach(imageMetas, async ({id, name}, index) => {
    const imgName = trimFilePath(id) + '.png'
    whenStart && whenStart(index, name, imageMetas.length)
    const imgData = await getBufferData(withCors(images[id]))
    dataFolder.file(imgName, imgData, {base64: true})
  })
}

// generate exporting images
export const handleExports = async (zip, exportSettings, whenStart) => {
  const exportsFolder = zip.folder('data/exports')
  await asyncForEach(exportSettings, async (exportSetting, index) => {
    const imgName = getFileName(exportSetting, index)
    whenStart && whenStart(index, imgName, exportSettings.length)
    const imgData = await getBufferData(withCors(exportSetting.image))
    exportsFolder.file(imgName, imgData, {base64: true})
  })
}
