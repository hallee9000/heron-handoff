import React from 'react'
import cn from 'classnames'
import { withGlobalContextConsumer } from 'contexts/GlobalContext'
import { CollapseButton } from 'components/utilities'
import RightPanel from './Panel'
import RightProps from './PanelProperties'
import StyleDetail from './PanelDetail'
import './index.scss'

class Right extends React.Component {
  state = {
    detailVisible: false,
    styleDetail: {},
    // the state of properties panel: leaved, entering, entered, leaving
    propsPanelState: 'leaved'
  }
  toggleDetail = () => {
    const { detailVisible } = this.state
    this.setState({
      detailVisible: !detailVisible
    })
  }
  openStyleDetail = styleDetail => {
    this.setState({ styleDetail })
    this.toggleDetail()
  }
  handlePropsPanelAnimationEnd = () => {
    const { onPropsPanelLeave } = this.props
    const { propsPanelState: currentState } = this.state
    if (currentState==='entering' || currentState==='leaving') {
      this.setState({
        propsPanelState: currentState==='entering' ? 'entered' : 'leaved'
      }, () => {
        // tell canvas when props panel leaved
        this.state.propsPanelState==='leaved' && onPropsPanelLeave()
      })
    }
  }
  componentDidUpdate (prevProps) {
    const { hasElementSelected } = this.props
    // an element selected
    if (!prevProps.hasElementSelected && hasElementSelected) {
      this.setState({propsPanelState: 'starting'})
      setTimeout(() => {
        this.setState({propsPanelState: 'entering'})
      }, 10)
    }
    // an element deselected
    if (prevProps.hasElementSelected && !hasElementSelected) {
      this.setState({propsPanelState: 'leaving'})
      this.state.detailVisible && this.toggleDetail()
    }
  }
  render () {
    const {
      mode,
      isMock,
      styles,
      elementData,
      exportSettings,
      documentName,
      closestComponent,
      currentExportIds,
      currentIndex,
      onSiderTransitionEnd,
      versionData,
      globalSettings
    } = this.props
    const { rightCollapse } = globalSettings
    const { propsPanelState, detailVisible, styleDetail } = this.state

    return (
      <div
        className={cn('main-right', { collapsed: rightCollapse })}
        onTransitionEnd={onSiderTransitionEnd}
      >
        <CollapseButton placement="right"/>
        <div className={cn('right-pannels', {'right-pannels-out': detailVisible})}>
          <RightPanel
            mode={mode}
            isMock={isMock}
            styles={styles}
            exportSettings={exportSettings}
            documentName={documentName}
            propsPanelState={propsPanelState}
            onShowDetail={this.openStyleDetail}
            versionData={versionData}
          />
          {
            elementData &&
            <RightProps
              mode={mode}
              isMock={isMock}
              elementData={elementData}
              closestComponent={closestComponent}
              styles={styles}
              exportSettings={exportSettings}
              currentExportIds={currentExportIds}
              currentIndex={currentIndex}
              propsPanelState={propsPanelState}
              onPropsPanelTransitionEnd={this.handlePropsPanelAnimationEnd}
              detailVisible={detailVisible}
              onCloseDetail={this.toggleDetail}
              onShowDetail={this.openStyleDetail}
            />
          }
          <StyleDetail
            visible={detailVisible}
            onBack={this.toggleDetail}
            style={styleDetail}
          />
        </div>
      </div>
    )
  }
}

export default withGlobalContextConsumer(Right)
