import React, { Fragment } from 'react'
import cn from 'classnames'
import { Droplet, Image, Download } from 'react-feather'
import { saveAs } from 'file-saver'
import { getBufferData } from 'api'
import StyleDetail from './StyleDetail'
import StyleItem from './items/StyleItem'
import { STYLE_TYPES } from 'utils/const'
import { getFileName } from 'utils/helper'
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
  handleSave = async (url, name) => {
    const imgData = await getBufferData(`https://figma-handoff-cors.herokuapp.com/${url}`)
    saveAs(imgData, name)
  }
  componentDidMount() {
    // const { styles } = this.props
    // this.openDetail(styles.EFFECT[4])
  }
  render () {
    const { styles, exportSettings, hasMask } = this.props
    console.log(exportSettings)
    const { maskVisible, tabIndex, detailVisible, currentStyle } = this.state
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
                        styles={style.items}
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
              exportSettings
                .map((exportSetting, index) => {
                  const { image } = exportSetting
                  const name = getFileName(exportSetting, index)
                  return <li key={index} className="list-item" onClick={() => this.handleSave(image, name)}>
                    <div style={{backgroundImage: `url(${image})`}}/>
                    <span>{ name }</span>
                    <Download size={14}/>
                  </li>
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
