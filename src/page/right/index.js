import React, { Fragment } from 'react'
import cn from 'classnames'
import { Droplet, Image, Download } from 'react-feather'
import StyleDetail from './StyleDetail'
import StyleItem from './items/StyleItem'
import { STYLE_TYPES } from 'utils/const'
import './right-sider.scss'

export default class RightSider extends React.Component {
  state = {
    maskVisible: false,
    tabIndex: 0,
    detailVisible: false,
    currentStyle: {}
  }
  handleTransitionEnd = () => {
    const { hasMask } = this.props
    if (!hasMask) {
      this.setState({maskVisible: false})
    }
  }
  componentDidUpdate (prevProps) {
    if (this.props.hasMask && !prevProps.hasMask) {
      this.setState({maskVisible: true})
    }
  }
  openDetail = style => {
    this.setState({currentStyle: style})
    this.toggleDetail()
  }
  toggleDetail = () => {
    const { detailVisible } = this.state
    this.setState({
      detailVisible: !detailVisible
    })
  }
  changeTab = index => {
    const { tabIndex } = this.state
    if (tabIndex!==index) {
      this.setState({tabIndex: index})
    }
  }
  componentDidMount() {
    // const { styles } = this.props
    // this.openDetail(styles.FILL[1])exportSettings
  }
  render () {
    const { styles, exportSettings, hasMask } = this.props
    const { maskVisible, tabIndex, detailVisible, currentStyle } = this.state
    console.log(exportSettings)
    return (
      <div className={cn('main-right-sider', {'has-mask': hasMask})}>
        <div className={cn('sider-mask', {'mask-hidden': !maskVisible})} onTransitionEnd={this.handleTransitionEnd}/>
        <div className={cn('sider-styles', {'sider-styles-visible': !detailVisible})}>
          <ul className="styles-tabs">
            <li className={cn({'selected': tabIndex===0})} onClick={() => this.changeTab(0)}><Droplet size={14}/>样式</li>
            <li className={cn({'selected': tabIndex===1})} onClick={() => this.changeTab(1)}><Image size={14}/>切图</li>
          </ul>
          <ul className={cn('styles-list', {'hide': tabIndex!==0})}>
            {
              Object.keys(styles).map(key =>
                key!=='GRID' &&
                <Fragment key={key}>
                  <li className="list-title">{ STYLE_TYPES[key] }</li>
                  {
                    styles[key] &&
                    styles[key].map((style, index) =>
                      <StyleItem
                        key={index}
                        styles={style.value}
                        styleName={style.name}
                        styleType={style.styleType}
                        onClick={() => this.openDetail(style)}
                      />
                    )
                  }
                </Fragment>
              )
            }
          </ul>
          <ul className={cn('exports-list', {'hide': tabIndex!==1})}>
            {
              Object.keys(exportSettings)
                .map(key => {
                  const { name, settings } = exportSettings[key]
                  return settings.map((setting, index) => {
                    const fileName = setting.suffix ? `${name}-${setting.suffix}` : name
                    const fileFormat = setting.format.toLowerCase()
                    return <li key={index} className="list-item">
                      <div/>
                      <span>{ `${fileName}@${setting.constraint.value}x.${fileFormat}` }</span>
                      <Download size={14}/>
                    </li>
                  })
                })
            }
          </ul>
        </div>
        <StyleDetail
          visible={detailVisible}
          onBack={this.toggleDetail}
          style={currentStyle}
        />
      </div>
    )
  }
}
