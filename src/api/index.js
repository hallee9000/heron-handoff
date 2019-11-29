import { urlWithParams } from 'utils/helper'

export const baseUrl = 'https://api.figma.com/v1'

export const tokenHeaders = (others) => {
  const figmaToken = window.localStorage.getItem('figmaToken')
  return Object.assign({ "x-figma-token": figmaToken }, others ? others : {})
}

export const getFile = (fileKey) => {
  return fetch(`${baseUrl}/files/${fileKey}`, {
    headers: tokenHeaders()
  }).then(function(response) {
    return response.json()
  }).catch(function (error) {
    console.log(error)
    return { err: error }
  });
}

export const getImages = (fileKey, ids) => {
  return fetch(urlWithParams(`${baseUrl}/images/${fileKey}`, { ids }), {
    headers: tokenHeaders()
  }).then(function(response) {
    return response.json()
  }).catch(function (error) {
    console.log(error)
    return { err: error }
  })
}

export const getFileNodes = (fileKey, id) => {
  return fetch(urlWithParams(`${baseUrl}/files/${fileKey}/nodes`, {
    ids: id
  }), {
    headers: tokenHeaders()
  }).then(function(response) {
    return response.json()
  }).catch(function (error) {
    console.log(error)
    return { err: error }
  })
}
