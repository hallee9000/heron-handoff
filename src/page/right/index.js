import React from 'react'
import cn from 'classnames'
import SettingsContext, { withGlobalSettings } from 'contexts/SettingsContext'
import { CollapseButton } from 'components/utilities'
import RightStyles from './RightStyles'
import RightProps from './RightProps'
import StyleDetail from './StyleDetail'
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
    }
  }
  render () {
    const {
      useLocalImages,
      styles,
      elementData,
      exportSettings,
      documentName,
      currentComponentName,
      currentExportIds,
      currentIndex,
      onSiderTransitionEnd,
      globalSettings
    } = this.props
    const { rightCollapse } = globalSettings
    const { propsPanelState, detailVisible, styleDetail } = this.state
    return (
      <div
        className={cn('main-right', { collapsed: rightCollapse })}
        onTransitionEnd={onSiderTransitionEnd}
      >
        <SettingsContext.Consumer>
          {({globalSettings, changeGlobalSettings}) => (
            <CollapseButton
              placement="right"
              globalSettings={globalSettings}
              changeGlobalSettings={changeGlobalSettings}
            />
          )}
        </SettingsContext.Consumer>
        <div className={cn('right-pannels', {'right-pannels-out': detailVisible})}>
          <RightStyles
            useLocalImages={useLocalImages}
            styles={styles}
            exportSettings={exportSettings}
            documentName={documentName}
            propsPanelState={propsPanelState}
            onShowDetail={this.openStyleDetail}
          />
          {
            elementData &&
            <RightProps
              useLocalImages={useLocalImages}
              elementData={elementData}
              currentComponentName={currentComponentName}
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

export default withGlobalSettings(Right)
