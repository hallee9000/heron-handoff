import React from 'react'
import { DropShadow, InnerShadow, LayerBlur, BackgroundBlur, MixEffect } from 'components/icons/style'
import {
  SmallThin, NormalThin, LargeThin,
  SmallRegular, NormalRegular, LargeRegular,
  SmallBold, NormalBold, LargeBold
} from 'components/icons/text'

export const STYLE_TYPES = {
  'FILL': '颜色',
  'TEXT': '文字',
  'EFFECT': '效果',
  'GRID': '布局栅格'
}

export const PAINTS = [ 'SOLID', 'GRADIENT_LINEAR', 'GRADIENT_RADIAL', 'GRADIENT_ANGULAR', 'GRADIENT_DIAMOND', 'IMAGE', 'EMOJI' ]

export const EFFECTS = {
  'INNER_SHADOW': {
    icon: <InnerShadow size={18} className="effect-thumbnail"/>
  },
  'DROP_SHADOW': {
    icon: <DropShadow size={18} className="effect-thumbnail"/>
  },
  'LAYER_BLUR': {
    icon: <LayerBlur size={18} className="effect-thumbnail"/>
  },
  'BACKGROUND_BLUR': {
    icon: <BackgroundBlur size={18} className="effect-thumbnail"/>
  },
  'MIX_EFFECT': {
    icon: <MixEffect size={18} className="effect-thumbnail"/>
  }
}

export const TEXTS = {
  'small-thin': <SmallThin size={16} className="text-thumbnail"/>,
  'normal-thin': <NormalThin size={16} className="text-thumbnail"/>,
  'large-thin': <LargeThin size={16} className="text-thumbnail"/>,
  'small-regular': <SmallRegular size={16} className="text-thumbnail"/>,
  'normal-regular': <NormalRegular size={16} className="text-thumbnail"/>,
  'large-regular': <LargeRegular size={16} className="text-thumbnail"/>,
  'small-bold': <SmallBold size={16} className="text-thumbnail"/>,
  'normal-bold': <NormalBold size={16} className="text-thumbnail"/>,
  'large-bold': <LargeBold size={16} className="text-thumbnail"/>
}
