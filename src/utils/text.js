export const getTextTable = ({ characters, characterStyleOverrides, styleOverrideTable }) => {
  const text = characters
  const overrides = characterStyleOverrides
  const styles = styleOverrideTable
  const textTable = []
  if (overrides.length===0) return textTable
  overrides.map((styleKey, index) => {
    const key = styleKey - 0
    if (index===0) {
      textTable.push({
        text: text[0],
        ...styles[key]
      })
    } else {
      if (key===overrides[index-1]) {
        textTable[textTable.length-1].text += text[index]
      } else {
        textTable.push({
          text: text[index],
          ...styles[key]
        })
      }
    }
  })
  return textTable
}
