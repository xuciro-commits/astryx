// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Divider group',
    required: true,
    description:
      'Separator group that arranges one or two rules around an optional label.',
  },
  {
    name: 'Rule',
    required: true,
    description:
      'Painted line segment; a second segment renders when a label is present.',
  },
  {
    name: 'Label',
    required: false,
    description: 'Optional content displayed between two rule segments.',
  },
];



/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Divider',
  displayName: 'Divider',
  category: 'Layout',
  keywords: ["divider","separator","hr","rule","line","border","spacer","horizontal rule"],
  props: [
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      description: 'Orientation of the divider.',
      default: "'horizontal'",
    },
    {
      name: 'label',
      type: 'ReactNode',
      description:
        'Optional label centered on the divider. Numeric zero is preserved; null, booleans, and empty strings render no label.',
    },
    {
      name: 'variant',
      type: "'subtle' | 'strong'",
      description: 'Visual weight of the divider line.',
      default: "'subtle'",
    },
    {
      name: 'isFullBleed',
      type: 'boolean',
      description:
        'Extend the divider to container edges with negative margins.',
      default: 'false',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
  ],
  theming: {
    targets: [
      {className: 'astryx-divider', visualProps: ['orientation', 'variant']},
    ],
  },
  usage: {
    anatomy,
    description: 'A visual separator that divides content into distinct sections. Use to create clear boundaries between groups of related content, or to demarcate interactive regions within a layout.',
    bestPractices: [
      { guidance: true, description: 'Use subtle dividers between related content sections and strong dividers for high-contrast boundaries.' },
      { guidance: true, description: 'Add a label to the divider when sections need a visible category heading.' },
      { guidance: false, description: 'Overuse dividers; rely on spacing and layout to separate content when possible.' },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Divider",
  "displayName": "Divider",
  "props": [
    {
      "name": "orientation",
      "type": "'horizontal' | 'vertical'",
      "description": "分隔线的方向。",
      "default": "'horizontal'"
    },
    {
      "name": "label",
      "type": "ReactNode",
      "description": "居中显示在分隔线上的可选标签。数字 0 会保留；null、布尔值和空字符串不渲染标签。"
    },
    {
      "name": "variant",
      "type": "'subtle' | 'strong'",
      "description": "分隔线的视觉粗细。",
      "default": "'subtle'"
    },
    {
      "name": "isFullBleed",
      "type": "boolean",
      "description": "使用负外边距将分隔线延伸到容器边缘。",
      "default": "false"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值，而不是 style={{}} 这样的内联样式对象。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-divider",
        "visualProps": [
          "orientation",
          "variant"
        ]
      }
    ]
  },
  "usage": {
    "anatomy": [
      {
        "name": "分隔线组",
        "required": true,
        "description": "在一个可选标签周围排布一条或两条分隔线的分隔线组。"
      },
      {
        "name": "线条",
        "required": true,
        "description": "绘制的线段；存在标签时会渲染第二段。"
      },
      {
        "name": "标签",
        "required": false,
        "description": "显示在两条线段之间的可选内容。"
      }
    ],
    "description": "将内容分隔为不同区段的视觉分隔线。用于在相关内容的组之间建立清晰边界，或划分布局中的交互区域。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在相关内容区段之间使用细微分隔线，在高对比度边界处使用强烈分隔线。"
      },
      {
        "guidance": true,
        "description": "当区段需要可见的分类标题时，为分隔线添加标签。"
      },
      {
        "guidance": false,
        "description": "过度使用分隔线；尽可能依靠间距和布局来分隔内容。"
      }
    ]
  },
  "propDescriptions": {
    "orientation": "分隔线的方向。",
    "label": "居中显示在分隔线上的可选标签。数字 0 会保留；null、布尔值和空字符串不渲染标签。",
    "variant": "分隔线的视觉粗细。",
    "isFullBleed": "使用负外边距将分隔线延伸到容器边缘。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值，而不是 style={{}} 这样的内联样式对象。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'visual separator w/ optional label, using Astryx design tokens',
  usage: {
    anatomy,
    description: 'A visual separator that divides content into distinct sections. Use to create clear boundaries between groups of related content, or to demarcate interactive regions within a layout.',
    bestPractices: [
      { guidance: true, description: 'Use subtle dividers between related content sections and strong dividers for high-contrast boundaries.' },
      { guidance: true, description: 'Add a label to the divider when sections need a visible category heading.' },
      { guidance: false, description: 'Overuse dividers; rely on spacing and layout to separate content when possible.' },
    ],
  },
  propDescriptions: {
    orientation: 'divider orientation',
    label: 'optional centered label; preserves 0; null/boolean/"" omit it',
    variant: 'visual weight of divider line',
    isFullBleed: 'extend to container edges w/ negative margins',
    xstyle: 'StyleX styles for layout; must be stylex.create() value',
  },
};
