// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Container',
    required: true,
    description: 'Circular painted container for the supplied icon.',
  },
  {
    name: 'Icon',
    required: true,
    description:
      'Caller-supplied visual content rendered inside the container.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'NavIcon',
  displayName: 'Nav Icon',
  group: 'Navigation',
  category: 'Navigation',
  isHiddenFromOverview: true,
  hidden: false,
  keywords: [
    'navicon',
    'iconbutton',
    'toolbar icon',
    'appbar icon',
    'nav button',
  ],
  props: [
    {
      name: 'icon',
      type: 'ReactNode',
      description:
        'The icon element to render inside the circular background. Should be an Icon or similar icon component.',
      required: true,
      slotElements: [{__element: 'Icon', props: {icon: 'check', size: 'sm'}}],
    },
  ],
  theming: {
    targets: [{className: 'astryx-nav-icon'}],
  },
  usage: {
    anatomy,
    description:
      'NavIcon is a circular icon container with an accent-colored background. Use it in navigation headers such as TopNavHeading and PageNavHeader to visually identify a section or application.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use in navigation headers to provide a recognizable visual anchor for the section.',
      },
      {
        guidance: true,
        description:
          'Pass an Icon or similarly sized icon component to ensure proper proportions.',
      },
      {
        guidance: false,
        description:
          'Use NavIcon for interactive purposes; it is a display-only container, not a button.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "NavIcon",
  "displayName": "Nav Icon",
  "props": [
    {
      "name": "icon",
      "type": "ReactNode",
      "description": "要在圆形背景内渲染的图标元素。应为 Icon 或类似的图标组件。",
      "required": true
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-nav-icon"
      }
    ]
  },
  "usage": {
    "anatomy": [
      {
        "name": "容器",
        "required": true,
        "description": "为所提供图标绘制样式的圆形容器。"
      },
      {
        "name": "图标",
        "required": true,
        "description": "调用方提供的视觉内容，渲染在容器内。"
      }
    ],
    "description": "NavIcon 是一个带强调色背景的圆形图标容器。用于 TopNavHeading 和 PageNavHeader 等导航标题中，以视觉方式标识某个分区或应用。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在导航标题中使用，为分区提供易于识别的视觉锚点。"
      },
      {
        "guidance": true,
        "description": "传入 Icon 或尺寸相近的图标组件，以确保比例正确。"
      },
      {
        "guidance": false,
        "description": "将 NavIcon 用于交互目的；它只是展示容器，不是按钮。"
      }
    ]
  },
  "propDescriptions": {
    "icon": "要在圆形背景内渲染的图标元素。应为 Icon 或类似的图标组件。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Circular icon container w/ accent background for navigation headers.',
  usage: {
    anatomy,
    description:
      'NavIcon is a circular icon container with an accent-colored background. Use it in navigation headers such as TopNavHeading and PageNavHeader to visually identify a section or application.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use in navigation headers to provide a recognizable visual anchor for the section.',
      },
      {
        guidance: true,
        description:
          'Pass an Icon or similarly sized icon component to ensure proper proportions.',
      },
      {
        guidance: false,
        description:
          'Use NavIcon for interactive purposes; it is a display-only container, not a button.',
      },
    ],
  },
  propDescriptions: {
    icon: 'Icon element inside circular background. Should be Icon or similar.',
  },
};
