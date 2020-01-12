export const getTextTable = ({ characters, characterStyleOverrides, styleOverrideTable, style, fills }) => {
  const overrides = characterStyleOverrides
  const styles = styleOverrideTable
  const textTable = []
  let lastOverrideKey
  if (overrides.length===0) return textTable
  // eslint-disable-next-line
  Array.prototype.map.call(characters, (character, index) => {
    const currentOverride = overrides[index]
    const styleKey = currentOverride!==undefined ? currentOverride : 0
    const key = styleKey - 0
    if (index===0) {
      textTable.push({
        text: character,
        fills,
        ...style,
        ...styles[key]
      })
    } else {
      if (key===lastOverrideKey) {
        textTable[textTable.length-1].text += character
      } else {
        textTable.push({
          text: character,
          fills,
          ...style,
          ...styles[key]
        })
      }
    }
    lastOverrideKey = styleKey
  })
  return textTable
}
