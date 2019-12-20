export const formatCharacters = (text, overrides, styles) => {
  const textTable = []
  if (overrides.length===0) return textTable
  overrides.map((styleKey, index) => {
    console.log(text[index]==='\t')
    if (index===0) {
      textTable.push({
        text: text[0],
        ...styles[styleKey]
      })
    } else {
      if (styleKey===overrides[index-1]) {
        textTable[textTable.length-1].text += text[index]
      } else {
        textTable.push({
          text: text[index],
          ...styles[styleKey]
        })
      }
    }
  })
  return textTable
}