import React from 'react'
import { DropShadow, InnerShadow, LayerBlur, BackgroundBlur, MixEffect } from 'components/icons/style'
import {
  SmallThin, NormalThin, LargeThin,
  SmallRegular, NormalRegular, LargeRegular,
  SmallBold, NormalBold, LargeBold
} from 'components/icons/text'

export const STYLE_TYPES = {
  'FILL': 'fill type',
  'TEXT': 'text type',
  'EFFECT': 'effect type',
  'GRID': 'grid type'
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


export const DEFAULT_SETTINGS = {
  platform: 0,
  resolution: 0,
  unit: 2,
  remBase: 14,
  colorFormat: 0,
  language: 'zh',
  showAllExports: true,
  disableInspectExportInner: true
}

export const PLATFORMS = [ 'Web', 'iOS', 'Android' ]

export const WEB_MULTIPLE = [
  {
    label: '1x',
    value: 1
  }, {
    label: '2x',
    value: 2
  }, {
    label: '3x',
    value: 3
  }
]

export const IOS_DENSITY = [
  {
    label: '@1x',
    value: 1
  }, {
    label: '@2x',
    value: 1/2
  }, {
    label: '@3x',
    value: 1/3
  }
]

export const ANDROID_DENSITY = [
  {
    label: 'ldpi',
    value: 4/3
  }, {
    label: 'mdpi',
    value: 1
  }, {
    label: 'tvdpi',
    value: 3/4
  }, {
    label: 'hdpi',
    value: 2/3
  }, {
    label: 'xhdpi',
    value: 1/2
  }, {
    label: 'xxhdpi',
    value: 1/3
  }, {
    label: 'xxxhdpi',
    value: 1/4
  }
]

export const UNITS = [ 'pt', 'dp', 'px', 'em', 'rem', 'rpx' ]

export const COLOR_FORMATS = [ 'HEX', 'HEXA', 'RGBA', 'HSLA' ]
