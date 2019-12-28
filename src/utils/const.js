import React from 'react'
import { DropShadow, InnerShadow, LayerBlur, BackgroundBlur, MixEffect } from 'components/icons/style'

export const STYLE_TYPES = {
  'FILL': '颜色',
  'TEXT': '文字',
  'EFFECT': '效果',
  'GRID': '布局栅格'
}

export const PAINTS = [ 'SOLID', 'GRADIENT_LINEAR', 'GRADIENT_RADIAL', 'GRADIENT_ANGULAR', 'GRADIENT_DIAMOND', 'IMAGE', 'EMOJI' ]

export const EFFECTS = {
  'INNER_SHADOW': {
    icon: <InnerShadow/>
  },
  'DROP_SHADOW': {
    icon: <DropShadow/>
  },
  'LAYER_BLUR': {
    icon: <LayerBlur/>
  },
  'BACKGROUND_BLUR': {
    icon: <BackgroundBlur/>
  },
  'MIX_EFFECT': {
    icon: <MixEffect/>
  }
}
