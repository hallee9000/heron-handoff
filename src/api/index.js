import { urlWithParams } from 'utils/helper'

export const baseUrl = 'https://api.figma.com/v1'

export const tokenHeaders = (others) => {
  const figmaToken = window.localStorage.getItem('figmaToken')
  return Object.assign({ "x-figma-token": figmaToken }, others ? others : {})
}

// get file data
export const getFile = (fileKey) => {
  return fetch(`${baseUrl}/files/${fileKey}`, {
    headers: tokenHeaders()
  }).then(function(response) {
    return response.json()
  }).catch(function (error) {
    console.dir(error)
    return { err: error }
  });
}

// get images url
export const getImages = (fileKey, ids) => {
  return fetch(
    urlWithParams(`${baseUrl}/images/${fileKey}`, { ids, scale: 2, format: 'jpg', }),
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

// get file styles
export const getFileStyles = fileKey => {
  return fetch(
    `${baseUrl}/files/${fileKey}/styles`,
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
