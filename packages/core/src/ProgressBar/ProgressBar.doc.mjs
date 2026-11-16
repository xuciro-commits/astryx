// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Progress bar',
    required: true,
    description: 'Container arranging the label row and progress track.',
  },
  {
    name: 'Label',
    required: true,
    description:
      'Text naming the operation, optionally hidden visually while remaining accessible.',
  },
  {
    name: 'Value text',
    required: false,
    description:
      'Formatted determinate value shown beside the label when requested.',
  },
  {
    name: 'Track',
    required: true,
    description:
      'Remaining-progress rail that carries the progressbar semantics.',
  },
  {
    name: 'Fill',
    required: true,
    description:
      'Painted segment showing completed progress or indeterminate movement.',
  },
  {
    name: 'Mark',
    required: false,
    description: 'Labeled target tick positioned on a determinate track.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ProgressBar',
  playground: {
    defaults: {label: 'Uploading files', value: 60},
  },
  displayName: 'Progress Bar',
  category: 'Feedback & Status',
  keywords: [
    'progressbar',
    'progress',
    'loader',
    'loading',
    'linear',
    'determinate',
    'indeterminate',
    'meter',
    'linearprogress',
  ],
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'accessible label',
      required: true,
    },
    {
      name: 'value',
      type: 'number',
      description: 'Current value (ignored when indeterminate).',
      default: '0',
    },
    {
      name: 'max',
      type: 'number',
      description: 'Maximum value.',
      default: '100',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Visually hide the label (remains accessible).',
      default: 'false',
    },
    {
      name: 'hasValueLabel',
      type: 'boolean',
      description: 'Show formatted value text (ignored when indeterminate).',
      default: 'false',
    },
    {
      name: 'formatValueLabel',
      type: '(value: number, max: number) => string',
      description:
        'Custom value label formatter; defaults to a percentage string.',
    },
    {
      name: 'variant',
      type: "'accent' | 'success' | 'warning' | 'error' | 'neutral'",
      description: 'Semantic color variant.',
      default: "'accent'",
    },
    {
      name: 'isIndeterminate',
      type: 'boolean',
      description:
        'Animated loading indicator for unknown progress. Under reduced motion it pulses in place instead of sliding.',
      default: 'false',
    },
    {
      name: 'marks',
      type: 'ReadonlyArray<{value: number; label: string}>',
      description:
        "Fixed target marks drawn on the track at values in the same 0..max scale as value (e.g. a goal line). They stay visible whether progress is below or past them, and take their color from what they sit on: a mark inside the filled area uses the fill variant's on-color (on-accent, on-warning, on-error, and so on), a mark still out on the bare track uses the primary text color (the secondary one on a disabled bar, which dims everything it draws). Each mark requires a label: it is the mark's accessible name and the text revealed via a tooltip on hover/focus. Ignored when indeterminate.",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Visually disabled state: grays out the fill and text. Use for canceled or inactive operations.',
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
      {className: 'astryx-progress-bar', visualProps: ['variant']},
      {className: 'astryx-progress-bar-fill', visualProps: ['variant']},
      {className: 'astryx-progress-bar-track'},
      {
        className: 'astryx-progress-bar-mark',
        visualProps: ['variant', 'placement'],
      },
    ],
    vars: [
      {
        name: '--_progressbar-mark-width',
        description: 'Target mark tick width',
        default: '2px',
        private: true,
      },
      {
        name: '--_progressbar-mark-height',
        description: 'Target mark tick height',
        default: '8px',
        private: true,
      },
    ],
    derived: [
      {property: 'width', vars: ['--_progressbar-mark-width'], replaces: true},
      {
        property: 'height',
        vars: ['--_progressbar-mark-height'],
        replaces: true,
      },
    ],
  },
  usage: {
    anatomy,
    description:
      "A horizontal bar showing the completion progress of a task. Use it for operations where the duration is known, or as an animated indicator when progress can't be calculated. Supports semantic color variants, value labels, and custom formatting. Under a finger a new value animates as on iOS: linearly, in proportion to how far it moves (a full track takes one second at the theme's default tempo), and the fill keeps a minimum visible length above zero.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use a determinate bar when the total amount of work is known, and indeterminate when it's not.",
      },
      {
        guidance: true,
        description:
          'Choose a color variant that matches the context: accent for general progress, success for completion, warning or error for alerts.',
      },
      {
        guidance: true,
        description:
          "Always provide a label, even if hidden; screen readers need it to announce what's loading.",
      },
      {
        guidance: false,
        description:
          'Place icons or labels inside the bar; compose them alongside it using layout components.',
      },
      {
        guidance: false,
        description:
          "Use a progress bar for instant actions; it's meant for operations that take noticeable time.",
      },
      {
        guidance: false,
        description:
          'Use multiple progress bars stacked together for the same operation; use one bar with a value label instead.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "ProgressBar",
  "displayName": "Progress Bar",
  "props": [
    {
      "name": "label",
      "type": "string",
      "description": "无障碍标签",
      "required": true
    },
    {
      "name": "value",
      "type": "number",
      "description": "当前值（不确定性时忽略）。",
      "default": "0"
    },
    {
      "name": "max",
      "type": "number",
      "description": "最大值。",
      "default": "100"
    },
    {
      "name": "isLabelHidden",
      "type": "boolean",
      "description": "在视觉上隐藏标签（仍可访问）。",
      "default": "false"
    },
    {
      "name": "hasValueLabel",
      "type": "boolean",
      "description": "显示格式化的数值文本（不确定性时忽略）。",
      "default": "false"
    },
    {
      "name": "formatValueLabel",
      "type": "(value: number, max: number) => string",
      "description": "自定义数值标签格式化函数；默认为百分比字符串。"
    },
    {
      "name": "variant",
      "type": "'accent' | 'success' | 'warning' | 'error' | 'neutral'",
      "description": "语义颜色变体。",
      "default": "'accent'"
    },
    {
      "name": "isIndeterminate",
      "type": "boolean",
      "description": "用于未知进度的动画加载指示器。在减少动态效果下，它原地脉动而不是滑动。",
      "default": "false"
    },
    {
      "name": "marks",
      "type": "ReadonlyArray<{value: number; label: string}>",
      "description": "在轨道上以与 value 相同的 0..max 刻度绘制的固定目标标记（例如目标线）。无论进度低于还是越过它们，它们都保持可见，并根据所在位置取色：填充区域内的标记使用填充变体的对比色（on-accent、on-warning、on-error 等），仍在裸轨道上的标记使用主文本色（禁用状态下使用次要色，禁用会使其绘制的所有内容变暗）。每个标记都需要 label：它是标记的无障碍名称，也是悬停/聚焦时通过工具提示显示的文本。不确定性时忽略。"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "视觉禁用状态：将填充和文本置灰。用于已取消或未激活的操作。",
      "default": "false"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的返回值，而不是 style={{}} 这样的内联样式对象。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-progress-bar",
        "visualProps": [
          "variant"
        ]
      },
      {
        "className": "astryx-progress-bar-fill",
        "visualProps": [
          "variant"
        ]
      },
      {
        "className": "astryx-progress-bar-track"
      },
      {
        "className": "astryx-progress-bar-mark",
        "visualProps": [
          "variant",
          "placement"
        ]
      }
    ],
    "vars": [
      {
        "name": "--_progressbar-mark-width",
        "description": "目标标记刻度宽度",
        "default": "2px",
        "private": true
      },
      {
        "name": "--_progressbar-mark-height",
        "description": "目标标记刻度高度",
        "default": "8px",
        "private": true
      }
    ],
    "derived": [
      {
        "property": "width",
        "vars": [
          "--_progressbar-mark-width"
        ],
        "replaces": true
      },
      {
        "property": "height",
        "vars": [
          "--_progressbar-mark-height"
        ],
        "replaces": true
      }
    ]
  },
  "usage": {
    "anatomy": [
      {
        "name": "进度条",
        "required": true,
        "description": "安排标签行和进度轨道的容器。"
      },
      {
        "name": "标签",
        "required": true,
        "description": "命名该操作的文本，可选在视觉上隐藏但保持可访问。"
      },
      {
        "name": "数值文本",
        "required": false,
        "description": "请求时显示在标签旁的格式化确定值。"
      },
      {
        "name": "轨道",
        "required": true,
        "description": "承载 progressbar 语义的剩余进度轨。"
      },
      {
        "name": "填充",
        "required": true,
        "description": "显示已完成进度或不确定性移动的绘制区段。"
      },
      {
        "name": "标记",
        "required": false,
        "description": "位于确定性轨道上的带标签目标刻度。"
      }
    ],
    "description": "显示任务完成进度的水平条。用于持续时间已知的操作，或在无法计算进度时作为动画指示器。支持语义颜色变体、数值标签和自定义格式化。手指操作下，新值会像 iOS 一样动画：线性地按移动距离成比例变化（在主题默认节奏下，整条轨道耗时一秒），且填充保持大于零的最小可见长度。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "当工作总量已知时使用确定性进度条，未知时使用不确定性进度条。"
      },
      {
        "guidance": true,
        "description": "选择与上下文匹配的颜色变体：一般进度用 accent，完成用 success，警报用 warning 或 error。"
      },
      {
        "guidance": true,
        "description": "始终提供标签，即使隐藏；屏幕阅读器需要它来播报正在加载的内容。"
      },
      {
        "guidance": false,
        "description": "在进度条内放置图标或标签；请使用布局组件将它们与进度条并排组合。"
      },
      {
        "guidance": false,
        "description": "将进度条用于即时操作；它适用于需要明显时间的操作。"
      },
      {
        "guidance": false,
        "description": "为同一操作堆叠多个进度条；请改用带数值标签的单个进度条。"
      }
    ]
  },
  "propDescriptions": {
    "label": "无障碍标签",
    "value": "当前值（不确定性时忽略）。",
    "max": "最大值。",
    "isLabelHidden": "在视觉上隐藏标签（仍可访问）。",
    "hasValueLabel": "显示格式化的数值文本（不确定性时忽略）。",
    "formatValueLabel": "自定义数值标签格式化函数；默认为百分比字符串。",
    "variant": "语义颜色变体。",
    "isIndeterminate": "用于未知进度的动画加载指示器。在减少动态效果下，它原地脉动而不是滑动。",
    "marks": "在轨道上以与 value 相同的 0..max 刻度绘制的固定目标标记（例如目标线）。无论进度低于还是越过它们，它们都保持可见，并根据所在位置取色：填充区域内的标记使用填充变体的对比色（on-accent、on-warning、on-error 等），仍在裸轨道上的标记使用主文本色（禁用状态下使用次要色，禁用会使其绘制的所有内容变暗）。每个标记都需要 label：它是标记的无障碍名称，也是悬停/聚焦时通过工具提示显示的文本。不确定性时忽略。",
    "isDisabled": "视觉禁用状态：将填充和文本置灰。用于已取消或未激活的操作。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的返回值，而不是 style={{}} 这样的内联样式对象。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Progress bar for displaying determinate or indeterminate progress.',
  usage: {
    anatomy,
    description:
      "A horizontal bar showing the completion progress of a task. Use it for operations where the duration is known, or as an animated indicator when progress can't be calculated. Supports semantic color variants, value labels, and custom formatting. Under a finger a new value animates as on iOS: linearly, in proportion to how far it moves (a full track takes one second at the theme's default tempo), and the fill keeps a minimum visible length above zero.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use a determinate bar when the total amount of work is known, and indeterminate when it's not.",
      },
      {
        guidance: true,
        description:
          'Choose a color variant that matches the context: accent for general progress, success for completion, warning or error for alerts.',
      },
      {
        guidance: true,
        description:
          "Always provide a label, even if hidden; screen readers need it to announce what's loading.",
      },
      {
        guidance: false,
        description:
          'Place icons or labels inside the bar; compose them alongside it using layout components.',
      },
      {
        guidance: false,
        description:
          "Use a progress bar for instant actions; it's meant for operations that take noticeable time.",
      },
      {
        guidance: false,
        description:
          'Use multiple progress bars stacked together for the same operation; use one bar with a value label instead.',
      },
    ],
  },
  propDescriptions: {
    label: 'accessible label',
    value: 'Current value (ignored when indeterminate).',
    max: 'Maximum value.',
    isLabelHidden: 'Visually hide label (remains accessible).',
    hasValueLabel: 'Show formatted value text (ignored when indeterminate).',
    formatValueLabel:
      'Custom value label formatter; defaults to percentage string.',
    variant: 'Semantic color variant.',
    isIndeterminate:
      'Animated loading indicator for unknown progress. Under reduced motion it pulses in place instead of sliding.',
    marks:
      'Fixed target marks ({value, label?}) drawn on the track in the 0..max scale; stay visible past the fill. Marks inside the fill take the variant on-color; marks on the bare track take the primary text color (secondary when disabled). A label reveals a tooltip on hover/focus. Ignored when indeterminate.',
    isDisabled: 'Visually disabled: grays out fill and text.',
    xstyle:
      'StyleX styles for layout customization. Must be stylex.create() value.',
  },
};
