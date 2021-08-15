import React from 'react'
import { withGlobalContextConsumer } from 'contexts/GlobalContext'
import { toMarkPercentage } from 'utils/mark'
import { formattedNumber } from 'utils/style'

const Dimension = ({whichSide, actualSize, percentageMode, closedCommonParent, pageRect, globalSettings}) =>
  <div className={`layer-sizing layer-${whichSide}`}>
    {
      !!percentageMode && closedCommonParent ? (
        percentageMode==='auto' ?
        toMarkPercentage(actualSize/closedCommonParent[whichSide]) :
        toMarkPercentage(actualSize/pageRect[whichSide])
      ) :
      formattedNumber(actualSize, globalSettings)
    }
  </div>

export default withGlobalContextConsumer(Dimension)
