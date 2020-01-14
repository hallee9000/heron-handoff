import { urlWithParams } from 'utils/helper'

export const baseUrl = 'https://api.figma.com/v1'

export const tokenHeaders = (others) => {
  const figmaToken = window.localStorage.getItem('figmaToken')
  return Object.assign({ "x-figma-token": figmaToken }, others ? others : {})
}

// get file data
export const getFile = fileKey =>
  fetch(`${baseUrl}/files/${fileKey}`, {
    headers: tokenHeaders()
  })
  .then(response => response.json())
  .catch(function (error) {
    console.dir(error)
    return { err: error }
  })

// get mock file data
export const getMockFile = () =>
  fetch(`${process.env.PUBLIC_URL}/data/file.json`)
    .then(response => response.json())
    .catch(function (error) {
      console.dir(error)
      return { err: error }
    })

// get images url
export const getImages = (fileKey, ids) => {
  return fetch(
    urlWithParams(`${baseUrl}/images/${fileKey}`, { ids, scale: 2, format: 'png', }),
    {
      headers: tokenHeaders()
    }
  )
  .then(response => response.json())
  .catch(function (error) {
    console.dir(error)
    return { err: error }
  })
}

// get image url
export const getImage = (fileKey, ids, scale, format) => {
  return fetch(
    urlWithParams(`${baseUrl}/images/${fileKey}`, { ids, scale, format }),
    {
      headers: tokenHeaders()
    }
  )
  .then(response => response.json())
  .catch(function (error) {
    console.dir(error)
    return { err: error }
  })
}

// get file styles
export const getFileStyles = fileKey => {
  return fetch(
    `${baseUrl}/files/${fileKey}/styles`,
    {
      headers: tokenHeaders()
    }
  )
  .then(response => response.json())
  .catch(function (error) {
    console.dir(error)
    return { err: error }
  })
}

// get file components
export const getFileComponents = fileKey => {
  return fetch(
    `${baseUrl}/files/${fileKey}/components`,
    {
      headers: tokenHeaders()
    }
  ).then(function(response) {
    return response.json()
  }).catch(function (error) {
    console.dir(error)
    return { err: error }
  })
}

// get component by key
export const getComponent = componentKey => {
  return fetch(
    `${baseUrl}/components/${componentKey}`,
    {
      headers: tokenHeaders()
    }
  ).then(function(response) {
    return response.json()
  }).catch(function (error) {
    console.dir(error)
    return { err: error }
  })
}

// get node data
export const getFileNodes = (fileKey, id) => {
  return fetch(urlWithParams(`${baseUrl}/files/${fileKey}/nodes`, {
    ids: id
  }), {
    headers: tokenHeaders()
  }).then(function(response) {
    return response.json()
  }).catch(function (error) {
    console.dir(error)
    return { err: error }
  })
}

// get source Code
export const getSourceCode = url =>
  fetch(url)
    .then(response => response.text())
    .catch(error => {
      console.dir(error)
      return { err: error }
    })

// get buffer data
export const getBlobData = url =>
  fetch(url)
    .then(response => response.blob())
    .catch(error => {
      console.dir(error)
      return { err: error }
    })

// get buffer data
export const getBufferData = url =>
  fetch(url)
    .then(response => response.arrayBuffer())
    .catch(error => {
      console.dir(error)
      return { err: error }
    })
