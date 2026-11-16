// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Trigger button',
    required: true,
    description:
      'Small round native button, named by `label`, that previews and pins the help.',
  },
  {
    name: 'Info icon',
    required: true,
    description:
      "The icon registry's `info` artwork at `size`; a theme may replace it.",
  },
  {
    name: 'Help surface',
    required: true,
    description:
      'Tooltip surface that shows `content` while the help is shown.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'InfoTip',
  displayName: 'Info Tip',
  // Keeps the registry route InfoTip had as a canary-only Lab component.
  registry: {aliases: ['lab/info-tip']},
  category: 'Feedback & Status',
  keywords: [
    'info',
    'tooltip',
    'help',
    'hint',
    'affordance',
    'icon',
    'label',
    'field',
    'metric',
    'definition',
  ],
  props: [
    {
      name: 'content',
      type: 'ReactNode',
      description:
        "Content to display in the tooltip. Typically short, non-interactive text. Mirrors Tooltip's content prop.",
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible name for the trigger button. Defaults to the translated "More information".',
      default: "'More information'",
    },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg'",
      description:
        'Size of the info icon (12px, 16px, 20px, 24px). Maps 1:1 to Icon sizes.',
      default: "'sm'",
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
  ],
  usage: {
    anatomy,
    description:
      'An info icon that reveals help: a small "i" button. Hover and keyboard focus preview the help, and a click, tap, Enter, or Space pins it open until Escape, a second press, a press outside, or focus leaving. Use it next to labels, values, and metrics for permission notes, metric definitions, and field help. Its value over hand-composing Icon inside Tooltip is the pre-wired accessible trigger: a real button with an aria-label, Tab-reachable, tooltip on hover AND focus AND tap, and Escape dismissal. It follows the toggletip pattern: the button reports `aria-expanded="true"` while the help is pinned, and a screen reader hears the help once when it pins. Host `data-*` attributes reach the button; its name and disclosure attributes stay component-owned.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep tooltip content concise, plain, and non-interactive; use Popover or HoverCard for links and buttons.',
      },
      {
        guidance: true,
        description:
          'Override label when "More information" is too generic, e.g. "About this metric".',
      },
      {
        guidance: true,
        description:
          'Rely on InfoTip rather than a hand-rolled info button on touch: it pins its help on a press, so a tap, a click, Enter, or Space pins the tooltip even though the trigger is a button, and a tap outside dismisses it.',
      },
      {
        guidance: false,
        description:
          'Hand-compose Icon inside Tooltip for info affordances; the bare Icon is aria-hidden and unfocusable, so keyboard and screen-reader users never see it.',
      },
      {
        guidance: false,
        description:
          'Use InfoTip for essential information users must see to complete a task; put that text inline instead.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "InfoTip",
  "displayName": "Info Tip",
  "props": [
    {
      "name": "content",
      "type": "ReactNode",
      "description": "在工具提示中显示的内容。通常是简短的非交互文本。对应 Tooltip 的 content 属性。",
      "required": true
    },
    {
      "name": "label",
      "type": "string",
      "description": "触发按钮的无障碍名称。默认为翻译后的“More information”。",
      "default": "'More information'"
    },
    {
      "name": "size",
      "type": "'xsm' | 'sm' | 'md' | 'lg'",
      "description": "信息图标的尺寸（12px、16px、20px、24px）。与 Icon 尺寸一一对应。",
      "default": "'sm'"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值，而不是 style={{}} 这样的内联样式对象。"
    }
  ],
  "usage": {
    "anatomy": [
      {
        "name": "触发按钮",
        "required": true,
        "description": "小型圆形原生按钮，由 `label` 命名，用于预览并固定帮助。"
      },
      {
        "name": "信息图标",
        "required": true,
        "description": "图标注册表中的 `info` 图案，尺寸为 `size`；主题可以替换它。"
      },
      {
        "name": "帮助浮层",
        "required": true,
        "description": "帮助显示期间展示 `content` 的工具提示表面。"
      }
    ],
    "description": "一个显示帮助信息的信息图标：小型“i”按钮。悬停和键盘聚焦会预览帮助，点击、轻点、Enter 或 Space 会将其固定为打开，直到按 Escape、再次按下、外部按下或焦点离开。将其用于标签、值和指标旁，提供权限说明、指标定义和字段帮助。相比手动在 Tooltip 中组合 Icon，它的价值在于预接线的可访问触发按钮：一个带 aria-label 的真实按钮，可通过 Tab 到达，悬停、聚焦和轻点都会显示工具提示，并可按 Escape 关闭。它遵循 toggletip 模式：帮助固定期间按钮报告 `aria-expanded=\"true\"`，屏幕阅读器在固定时播报一次帮助。宿主 `data-*` 属性会到达按钮；其名称和披露属性由组件管理。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "保持工具提示内容简洁、平实且不可交互；链接和按钮请使用 Popover 或 HoverCard。"
      },
      {
        "guidance": true,
        "description": "当“More information”过于通用时覆盖 label，例如“About this metric”。"
      },
      {
        "guidance": true,
        "description": "在触摸设备上依赖 InfoTip，而不是手动构建信息按钮：它会在按下时固定帮助，因此轻点、点击、Enter 或 Space 都能固定工具提示（即使触发元素是按钮），而在外部轻点会将其关闭。"
      },
      {
        "guidance": false,
        "description": "不要为信息提示手动在 Tooltip 中组合 Icon；裸 Icon 带有 aria-hidden 且不可聚焦，键盘和屏幕阅读器用户永远看不到它。"
      },
      {
        "guidance": false,
        "description": "不要将 InfoTip 用于用户完成任务所必需的关键信息；请将该文本内联显示。"
      }
    ]
  },
  "propDescriptions": {
    "content": "在工具提示中显示的内容。通常是简短的非交互文本。对应 Tooltip 的 content 属性。",
    "label": "触发按钮的无障碍名称。默认为翻译后的“More information”。",
    "size": "信息图标的尺寸（12px、16px、20px、24px）。与 Icon 尺寸一一对应。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值，而不是 style={{}} 这样的内联样式对象。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Inline info-icon help affordance: accessible "i" button trigger pre-wired into a Tooltip.',
  usage: {
    description:
      'A small "i" button: hover and keyboard focus preview the help; a click, tap, Enter, or Space pins it open. Use next to labels, values, and metrics for permission notes, metric definitions, and field help. Pre-wired accessible trigger: real button, aria-label, Tab-reachable, tooltip on hover AND focus AND tap, Escape dismissal. Toggletip pattern: aria-expanded="true" while pinned; the help is announced once when it pins. Host data-* attrs reach the button; name and disclosure attrs stay owned.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep tooltip content concise, plain, and non-interactive; use Popover or HoverCard for links and buttons.',
      },
      {
        guidance: true,
        description:
          'Override label when "More information" is too generic, e.g. "About this metric".',
      },
      {
        guidance: true,
        description:
          'Rely on InfoTip rather than a hand-rolled info button on touch: it pins its help on a press, so a tap, a click, Enter, or Space pins the tooltip even though the trigger is a button, and a tap outside dismisses it.',
      },
      {
        guidance: false,
        description:
          'Hand-compose Icon inside Tooltip for info affordances; the bare Icon is aria-hidden and unfocusable.',
      },
      {
        guidance: false,
        description:
          'Use InfoTip for essential information users must see to complete a task; put that text inline instead.',
      },
    ],
  },
  propDescriptions: {
    content:
      'Tooltip content. Short, non-interactive text. Mirrors Tooltip content prop.',
    label:
      "Accessible name for the trigger button. Default: the translated 'More information'.",
    size: 'Info icon size (12/16/20/24px). Maps 1:1 to Icon sizes.',
  },
};
