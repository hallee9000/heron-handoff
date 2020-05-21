// get mock file data
export const getMockFile = () =>
  fetch(`${process.env.PUBLIC_URL}/data/file.json`)
    .then(response => response.json())
    .catch(function (error) {
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
export const getBufferData = url => {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .catch(error => {
      console.dir(error)
      return { err: error }
    })
}
