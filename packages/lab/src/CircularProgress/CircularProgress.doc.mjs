// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'CircularProgress',
  displayName: 'Circular Progress',
  category: 'Feedback & Status',
  keywords: ["circular","progress","radial","ring","arc","determinate","indeterminate","gauge","meter","donut"],
  props: [
    {
      name: 'value',
      type: 'number',
      description: 'Current value. Ignored when isIndeterminate is true.',
      default: '0',
    },
    {
      name: 'max',
      type: 'number',
      description: 'Maximum value.',
      default: '100',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for screen readers.',
      required: true,
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Visually hide the label (remains accessible). Defaults to true since circular progress typically shows center content instead.',
      default: 'true',
    },
    {
      name: 'hasValueLabel',
      type: 'boolean',
      description: 'Show the formatted value (e.g. "75%") in the center of the ring. Ignored when isIndeterminate is true or when children provide custom center content.',
      default: 'false',
    },
    {
      name: 'formatValueLabel',
      type: '(value: number, max: number) => string',
      description: 'Custom value label formatter; defaults to a percentage string.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content displayed in the center of the ring: percentage, icon, or custom content. Takes precedence over hasValueLabel.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Diameter of the progress ring (32px, 48px, 64px).',
      default: "'md'",
    },
    {
      name: 'variant',
      type: "'accent' | 'success' | 'warning' | 'error' | 'neutral'",
      description: 'Semantic color variant for the progress fill.',
      default: "'accent'",
    },
    {
      name: 'isIndeterminate',
      type: 'boolean',
      description: 'Animated spinning indicator for unknown progress. Respects prefers-reduced-motion by slowing the animation.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Visually disabled: grays out the ring and text. Use for canceled or inactive operations.',
      default: 'false',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning). Must be a stylex.create() value.',
    },
  ],
  theming: {
    targets: [
      {className: 'astryx-circular-progress', visualProps: ['variant', 'size']},
      {className: 'astryx-circular-progress-track'},
      {className: 'astryx-circular-progress-fill', visualProps: ['variant']},
    ],
  },
  usage: {
    description:
      'A circular progress indicator that shows completion as a ring or arc. Use it for upload progress, score displays, dashboard gauges, or compact progress where horizontal space is limited. Complements ProgressBar for radial layouts.',
    bestPractices: [
      { guidance: true, description: 'Pass a value for determinate progress; set isIndeterminate when the duration is unknown.' },
      { guidance: true, description: 'Show the value with hasValueLabel, or pass children for custom center content: an icon or short label.' },
      { guidance: true, description: 'Always provide a label, even though it is visually hidden by default; screen readers need it.' },
      { guidance: false, description: 'Use circular progress for long text labels; use ProgressBar instead, which has more room for label and value display.' },
      { guidance: false, description: 'Use an indeterminate CircularProgress for small inline loading states; Spinner is the inline indicator.' },
    ],
  },
  examples: [
    {
      label: 'Determinate with value label',
      code: '<CircularProgress value={75} label="Upload progress" hasValueLabel />',
    },
    {
      label: 'Indeterminate',
      code: '<CircularProgress isIndeterminate label="Loading..." />',
    },
    {
      label: 'Custom value format',
      code: '<CircularProgress value={3.2} max={5} label="Disk usage" hasValueLabel formatValueLabel={(v, m) => `${v} GB / ${m} GB`} />',
    },
    {
      label: 'Disabled',
      code: '<CircularProgress value={30} label="Canceled" isDisabled hasValueLabel />',
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "CircularProgress",
  "displayName": "Circular Progress",
  "usage": {
    "description": "以圆环或弧形显示完成度的圆形进度指示器。用于上传进度、分数展示、仪表盘量表，或水平空间有限的紧凑进度。它是 ProgressBar 在径向布局中的补充。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "确定性进度请传入 value；当持续时间未知时设置 isIndeterminate。"
      },
      {
        "guidance": true,
        "description": "用 hasValueLabel 显示值，或传入 children 作为自定义中心内容：图标或短标签。"
      },
      {
        "guidance": true,
        "description": "始终提供标签，即使它默认在视觉上隐藏；屏幕阅读器需要它。"
      },
      {
        "guidance": false,
        "description": "将圆形进度用于长文本标签；请改用 ProgressBar，它为标签和值显示留出更多空间。"
      },
      {
        "guidance": false,
        "description": "将不确定的 CircularProgress 用于小型行内加载状态；Spinner 才是行内指示器。"
      }
    ]
  },
  "propDescriptions": {
    "value": "当前值。isIndeterminate 为 true 时忽略。",
    "max": "最大值。",
    "label": "供屏幕阅读器使用的可访问标签。",
    "isLabelHidden": "在视觉上隐藏标签（仍可访问）。默认值为 true，因为圆形进度通常改为显示中心内容。",
    "hasValueLabel": "在圆环中心显示格式化后的值（例如 \"75%\"）。isIndeterminate 为 true 或 children 提供自定义中心内容时忽略。",
    "formatValueLabel": "自定义值标签格式化函数；默认为百分比字符串。",
    "children": "显示在圆环中心的内容：百分比、图标或自定义内容。优先于 hasValueLabel。",
    "size": "进度圆环的直径（32px、48px、64px）。",
    "variant": "进度填充的语义颜色变体。",
    "isIndeterminate": "用于未知进度的动画旋转指示器。遵循 prefers-reduced-motion，通过减慢动画来响应。",
    "isDisabled": "视觉上禁用：将圆环和文本置灰。用于已取消或不活跃的操作。",
    "xstyle": "用于布局自定义（外边距、定位）的 StyleX 样式。必须是 stylex.create() 值。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Circular/radial progress indicator showing completion as a ring arc.',
  usage: {
    description:
      'A circular progress indicator that shows completion as a ring or arc. Use it for upload progress, score displays, dashboard gauges, or compact progress where horizontal space is limited. Complements ProgressBar for radial layouts.',
    bestPractices: [
      { guidance: true, description: 'Pass a value for determinate progress; set isIndeterminate when the duration is unknown.' },
      { guidance: true, description: 'Show the value with hasValueLabel, or pass children for custom center content: an icon or short label.' },
      { guidance: true, description: 'Always provide a label, even though it is visually hidden by default; screen readers need it.' },
      { guidance: false, description: 'Use circular progress for long text labels; use ProgressBar instead, which has more room for label and value display.' },
      { guidance: false, description: 'Use an indeterminate CircularProgress for small inline loading states; Spinner is the inline indicator.' },
    ],
  },
  propDescriptions: {
    value: 'Current value. Ignored when indeterminate.',
    max: 'Maximum value.',
    label: 'Accessible label for screen readers.',
    isLabelHidden: 'Visually hide label (remains accessible). Defaults to true.',
    hasValueLabel: 'Show formatted value in the ring center (ignored when indeterminate or children given).',
    formatValueLabel: 'Custom value label formatter; defaults to percentage string.',
    children: 'Center content: percentage, icon, or custom. Wins over hasValueLabel.',
    size: 'Ring diameter (32px, 48px, 64px).',
    variant: 'Semantic color variant for the fill.',
    isIndeterminate: 'Animated spinning indicator for unknown progress.',
    isDisabled: 'Visually disabled: grays out ring and text.',
    xstyle: 'StyleX styles for layout customization. Must be stylex.create() value.',
  },
};
