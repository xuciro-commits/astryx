// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Placeholder',
    required: true,
    description: 'Painted shape that stands in for content while it loads.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Skeleton',
  displayName: 'Skeleton',
  category: 'Feedback & Status',
  keywords: ["skeleton","placeholder","loading","shimmer","pulse","loader","bone","ghost","preloader"],
  props: [
    {
      name: 'width',
      type: 'number | string',
      description: 'Width in pixels (number) or CSS value (string).',
      default: "'100%'",
    },
    {
      name: 'height',
      type: 'number | string',
      description: 'Height in pixels (number) or CSS value (string).',
      default: "'100%'",
    },
    {
      name: 'radius',
      type: "'none' | 0 | 1 | 2 | 3 | 4 | 'rounded'",
      description: 'Border radius using design token scale. Use none for sharp corners, rounded for fully rounded (avatars, pills, circles).',
      default: '3',
    },
    {
      name: 'index',
      type: 'number',
      description:
        'Index for staggered animation timing. For element at index n, animation starts at DELAY_TIME + (STAGGER_TIME × n).',
      default: '0',
    },
  ],
  playground: {
    // Skeleton width/height default to '100%', which collapses to a zero-size
    // (invisible) element in the properties-tab preview. Give the example
    // explicit pixel dimensions so the shimmer placeholder is visible.
    defaults: {
      width: 320,
      height: 80,
    },
  },
  theming: {
    targets: [
      {className: 'astryx-skeleton'},
    ],
  },
  usage: {
    anatomy,
    description:
      'An animated shimmer placeholder that previews the shape of content while it loads. Use it to build loading screens that match the layout of the real content. For content with unknown dimensions, use Spinner instead.',
    bestPractices: [
      {guidance: true, description: 'Match the size and shape of the content being loaded to create a realistic placeholder.'},
      {guidance: true, description: 'Stagger multiple skeletons with the `index` prop for a natural wave animation.'},
      {guidance: false, description: 'Use when the content dimensions are unknown; use Spinner instead.'},
      {guidance: false, description: 'Combine with a Spinner on the same content area; pick one loading pattern.'},
      {guidance: false, description: 'Show skeletons indefinitely; if loading takes too long, show an error or empty state instead.'},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Skeleton",
  "displayName": "Skeleton",
  "props": [
    {
      "name": "width",
      "type": "number | string",
      "description": "宽度，单位为像素（数字）或 CSS 值（字符串）。",
      "default": "'100%'"
    },
    {
      "name": "height",
      "type": "number | string",
      "description": "高度，单位为像素（数字）或 CSS 值（字符串）。",
      "default": "'100%'"
    },
    {
      "name": "radius",
      "type": "'none' | 0 | 1 | 2 | 3 | 4 | 'rounded'",
      "description": "使用设计令牌刻度的边框圆角。none 表示直角，rounded 表示完全圆角（头像、胶囊、圆形）。",
      "default": "3"
    },
    {
      "name": "index",
      "type": "number",
      "description": "用于错峰动画时序的索引。对于索引为 n 的元素，动画在 DELAY_TIME +（STAGGER_TIME × n）时开始。",
      "default": "0"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-skeleton"
      }
    ]
  },
  "usage": {
    "anatomy": [
      {
        "name": "占位符",
        "required": true,
        "description": "在内容加载期间代替内容显示的绘制形状。"
      }
    ],
    "description": "动画微光占位符，在内容加载时预览其形状。用于构建与真实内容布局一致的加载界面。对于尺寸未知的内容，请改用 Spinner。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "匹配所加载内容的尺寸和形状，以创建逼真的占位符。"
      },
      {
        "guidance": true,
        "description": "通过 `index` 属性为多个骨架屏设置错峰，以获得自然的波浪动画。"
      },
      {
        "guidance": false,
        "description": "不要在内容尺寸未知时使用；请改用 Spinner。"
      },
      {
        "guidance": false,
        "description": "不要在同一内容区域同时使用 Spinner；应只选择一种加载模式。"
      },
      {
        "guidance": false,
        "description": "不要无限期显示骨架屏；如果加载时间过长，应改为显示错误或空状态。"
      }
    ]
  },
  "propDescriptions": {
    "width": "宽度，单位为像素（数字）或 CSS 值（字符串）。",
    "height": "高度，单位为像素（数字）或 CSS 值（字符串）。",
    "radius": "使用设计令牌刻度的边框圆角。none 表示直角，rounded 表示完全圆角（头像、胶囊、圆形）。",
    "index": "用于错峰动画时序的索引。对于索引为 n 的元素，动画在 DELAY_TIME +（STAGGER_TIME × n）时开始。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  usage: {
    anatomy,
    description:
      'An animated shimmer placeholder that previews the shape of content while it loads. Use it to build loading screens that match the layout of the real content. For content with unknown dimensions, use Spinner instead.',
    bestPractices: [
      {guidance: true, description: 'Match the size and shape of the content being loaded to create a realistic placeholder.'},
      {guidance: true, description: 'Stagger multiple skeletons with the `index` prop for a natural wave animation.'},
      {guidance: false, description: 'Use when the content dimensions are unknown; use Spinner instead.'},
      {guidance: false, description: 'Combine with a Spinner on the same content area; pick one loading pattern.'},
      {guidance: false, description: 'Show skeletons indefinitely; if loading takes too long, show an error or empty state instead.'},
    ],
  },
  propDescriptions: {
    width: 'Width in pixels (number) or CSS value (string).',
    height: 'Height in pixels (number) or CSS value (string).',
    radius: 'Border radius using design tokens. none for sharp, 0-4 for scale, rounded for pills.',
    index: 'Index for staggered animation timing. Element at index n starts at DELAY_TIME + (STAGGER_TIME \u00d7 n).',
  },
};
