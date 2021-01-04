import React, { createContext, useState } from 'react'

const GlobalContext = createContext({
  globalData: {
    percentageMode: false
  },
  changeGlobalData: () => {}
})

export const withGlobalContextConsumer = (Component) =>
  props =>
    <GlobalContext.Consumer>
      {(({globalData, changeGlobalData}) => <Component globalData={globalData} changeGlobalData={changeGlobalData} {...props}/>)}
    </GlobalContext.Consumer>

export const withGlobalContextProvider = (Component) => {
  return props => {
    const [globalData, setGlobalData] = useState({ percentageMode: false })
    const handleChangeGlobalData = (property, value) => {
      const newGlobalData = {...globalData, [property]: value}
      setGlobalData(newGlobalData)
    }
    return (
      <GlobalContext.Provider value={{globalData, changeGlobalData: handleChangeGlobalData}}>
        <Component {...props}/>
      </GlobalContext.Provider>
    )
  }
}

export default GlobalContext
