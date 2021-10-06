import React from 'react'
import { DropShadow, InnerShadow, LayerBlur, BackgroundBlur, MixEffect, FailedEffect } from 'components/icons/style'
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
  },
  'FAILED_EFFECT': {
    icon: <FailedEffect size={18} className="effect-thumbnail"/>
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
    label: 'ldpi (4/3)',
    value: 4/3
  }, {
    label: 'mdpi',
    value: 1
  }, {
    label: 'tvdpi (3/4)',
    value: 3/4
  }, {
    label: 'hdpi (2/3)',
    value: 2/3
  }, {
    label: 'xhdpi (1/2)',
    value: 1/2
  }, {
    label: 'xxhdpi (1/3)',
    value: 1/3
  }, {
    label: 'xxxhdpi (1/4)',
    value: 1/4
  }
]

export const NUMBER_FORMATS = [ 'retain 2', 'rounded integer', 'floored integer', 'ceiled integer']

export const UNITS = [ 'pt', 'dp', 'px', 'em', 'rem', 'rpx' ]

export const COLOR_FORMATS = [ 'HEX', 'HEXA', 'RGBA', 'HSLA' ]
export const ANDROID_COLOR_FORMATS = [ 'HEX', 'AHEX', 'RGBA', 'HSLA' ]

export const DEFAULT_SETTINGS = {
  convention: 1,
  platform: 0,
  resolution: 0,
  unit: 2,
  remBase: 16,
  numberFormat: 0,
  colorFormat: 0,
  language: 'zh',
  disableInspectExportInner: false,
  disableInspectInComponent: false,
  notShowStyleProperties: false,
  leftCollapse: false,
  rightCollapse: false
}

export const LOCALIZED_SETTING_KEYS = [
  'disableInspectExportInner',
  'disableInspectInComponent',
  'colorFormat',
  'language',
  'notShowStyleProperties',
  'numberFormat',
  'leftCollapse',
  'rightCollapse'
]
