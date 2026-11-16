// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'IconButton',
  displayName: 'Icon Button',
  group: 'Button',
  category: 'Action',
  keywords: ['icon-button', 'icon', 'button', 'toolbar', 'action', 'compact'],

  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible label. Used as aria-label (not rendered as visible text).',
      required: true,
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description:
        'Icon element rendered inside the button. An Astryx Icon with no explicit size defaults to sm for sm/md buttons and md for lg buttons.',
      required: true,
      slotElements: [{__element: 'Icon', props: {icon: 'check'}}],
    },
    {
      name: 'variant',
      type: "\'primary\' | \'secondary\' | \'ghost\' | \'destructive\'",
      description: 'Visual style variant.',
      default: "\'secondary\'",
    },
    {
      name: 'size',
      type: "\'sm\' | \'md\' | \'lg\'",
      description: 'Size variant.',
      default: "\'md\'",
    },
    {
      name: 'elevation',
      type: "'none' | 'low' | 'med' | 'high'",
      description:
        'Resting shadow depth. The most common FAB shape is an icon-only button, so raise it with `low`/`med`/`high` for a floating action button. `none` is the default flat button.',
      default: "'none'",
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Shows a loading spinner and blocks re-activation while staying focusable (aria-busy + aria-disabled, not native disabled).',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Disables the button. Uses aria-disabled instead of native disabled so the button stays focusable.',
      default: 'false',
    },
    {
      name: 'tooltip',
      type: 'string',
      description:
        "Tooltip text shown on hover and keyboard focus. It also describes the button, unless it repeats the button's accessible name.",
    },
    {
      name: 'onClick',
      type: '(e: MouseEvent) => void',
      description: 'Standard click handler.',
    },
    {
      name: 'clickAction',
      type: '(e: MouseEvent) => void | Promise<void>',
      description: 'Async click handler with automatic loading state.',
    },
    {
      name: 'isInterruptible',
      type: 'boolean',
      description:
        'Keep the button clickable while a clickAction is pending: the spinner and aria-busy still show, but the button is not disabled and the action is not deduped, so a re-click lands and interrupts the in-flight action with a fresh one. Use it for interruptible actions, not fire-once actions (submit, save, pay).',
      default: 'false',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the button. Numbers are treated as pixels, strings are used as-is. Without it the button keeps its icon-only aspect, square by default; with it the button takes that width.',
    },
    {
      name: 'type',
      type: "'button' | 'submit' | 'reset'",
      description: 'HTML button type attribute.',
      default: "'button'",
    },
    {
      name: 'name',
      type: 'string',
      description: 'HTML name attribute for form submission.',
    },
    {
      name: 'value',
      type: 'string | number | readonly string[]',
      description: 'HTML value attribute for form submission.',
    },
    {
      name: 'form',
      type: 'string',
      description: 'Associates the button with a form element by ID.',
    },
    {
      name: 'href',
      type: 'string',
      description:
        'When provided, renders the button as a link element (<a> or custom link component). A disabled IconButton still renders a <button>.',
    },
    {
      name: 'as',
      type: 'ComponentType',
      description:
        'Custom link component to use when href is provided (e.g. Next.js Link).',
    },
    {
      name: 'target',
      type: 'string',
      description:
        'HTML target attribute when rendered as a link (e.g. "_blank").',
    },
    {
      name: 'rel',
      type: 'string',
      description:
        'HTML rel attribute when rendered as a link (e.g. "noopener noreferrer").',
    },
  ],

  usage: {
    description:
      'A button that shows only an icon with no visible text. Use IconButton in toolbars, table rows, and compact UI where space is tight and the icon is universally understood.',
    accessibility: [
      {
        name: 'Essential icon or spinner arc',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Rest', 'Hover', 'Pointer down', 'Loading'],
        description:
          'IconButton has no visible label. Its icon must have at least 3:1 contrast with the button background in Rest, Hover, and Pointer down. The moving spinner arc must also meet 3:1 while loading.',
      },
      {
        name: 'Visible control boundary',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1 if needed',
        states: ['Rest'],
        description:
          'The button edge needs 3:1 contrast only when users need it to see the control.',
      },
      {
        name: 'Keyboard focus indicator',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Focus visible'],
        description:
          'The focus outline must have at least 3:1 contrast with the area around the button. Check the red outline on destructive buttons too.',
      },
      {
        name: 'Disabled appearance',
        category: 'Color contrast',
        criterion: '1.4.3 and 1.4.11 exceptions',
        requirement: 'Not required',
        states: ['Disabled'],
        description:
          'Disabled controls do not need to meet these contrast ratios.',
      },
    ],
    bestPractices: [
      {
        guidance: true,
        description:
          'Make the aria-label specific: a trash icon labeled "Delete conversation" is clearer than just "Delete" for screen readers.',
      },
      {
        guidance: true,
        description:
          'Add a tooltip: even a gear icon can mean Settings, Preferences, or Configure.',
      },
      {
        guidance: true,
        description:
          'Use ghost in toolbars and dense areas to reduce visual clutter.',
      },
      {
        guidance: false,
        description:
          "Use IconButton if the action isn't obvious from the icon alone; use Button with text.",
      },
      {
        guidance: false,
        description:
          'Skip the tooltip; label only reaches screen readers, sighted users need the hover hint.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Button showing only an icon, no visible text. Use in toolbars, table rows, compact UI where space is tight + icon universally understood.',
  usage: {
    description:
      'Button showing only an icon, no visible text. Use in toolbars, table rows, compact UI where space is tight + icon universally understood.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Make aria-label specific: trash icon labeled "Delete conversation" > just "Delete" for screen readers.',
      },
      {
        guidance: true,
        description:
          'Add tooltip: even gear icon can mean Settings/Preferences/Configure.',
      },
      {
        guidance: true,
        description:
          'Use ghost in toolbars + dense areas to reduce visual clutter.',
      },
      {
        guidance: false,
        description:
          "Use IconButton if action isn't obvious from icon alone; use Button w/ text instead.",
      },
      {
        guidance: false,
        description:
          'Skip tooltip: label only reaches screen readers; sighted users need hover hint.',
      },
    ],
  },
  propDescriptions: {
    label: 'accessible label; used as aria-label, not rendered as visible text',
    icon: 'icon element rendered inside button; unsized Astryx Icon defaults to sm for sm/md buttons and md for lg',
    variant: 'visual style variant',
    size: 'size variant',
    elevation:
      'resting shadow depth: none|low|med|high; raise for a floating action button (FAB)',
    isLoading:
      'shows loading spinner, blocks re-activation but stays focusable (aria-disabled, not native disabled)',
    isDisabled: 'disables button; uses aria-disabled instead of native disabled',
    tooltip:
      'tooltip on hover + keyboard focus; also describes the button unless it repeats the accessible name',
    onClick: 'standard click handler',
    clickAction: 'async click handler w/ automatic loading state',
    isInterruptible:
      'keeps button clickable while clickAction pending; a re-click interrupts it. Not for fire-once actions (submit/save/pay)',
    width:
      'button width; numbers=pixels, strings=as-is; without it keeps the icon-only aspect (square by default)',
    type: 'HTML button type; defaults to "button"',
    name: 'HTML name for form submission',
    value: 'HTML value for form submission',
    form: 'associates button with form element by ID',
    href: 'renders as a link; a disabled IconButton stays a <button>',
    as: 'custom link component used with href',
    target: 'HTML target when rendered as a link',
    rel: 'HTML rel when rendered as a link',
  },
};

export const docsZh = {
  "name": "IconButton",
  "displayName": "Icon Button",
  "usage": {
    "description": "只显示图标、没有可见文本的按钮。在工具栏、表格行和空间紧张且图标含义广为人知的紧凑 UI 中使用 IconButton。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "让 `aria-label` 具体明确：标为“Delete conversation”的垃圾桶图标比仅“Delete”对屏幕阅读器更清晰。"
      },
      {
        "guidance": true,
        "description": "添加 Tooltip：即使是齿轮图标也可能表示 Settings、Preferences 或 Configure。"
      },
      {
        "guidance": true,
        "description": "在工具栏和密集区域使用 `ghost` 以减少视觉杂乱。"
      },
      {
        "guidance": false,
        "description": "如果仅凭图标无法明确操作，请使用带文本的 Button，而不是 IconButton。"
      },
      {
        "guidance": false,
        "description": "不要跳过 Tooltip；`label` 只会传达给屏幕阅读器，视力正常的用户需要悬停提示。"
      }
    ],
    "accessibility": [
      {
        "name": "必要图标或加载弧线",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1",
        "states": [
          "静止",
          "悬停",
          "指针按下",
          "加载中"
        ],
        "description": "IconButton 没有可见标签。其图标在静止、悬停和指针按下状态下与按钮背景的对比度必须至少为 3:1。加载时，旋转的加载弧线也必须达到 3:1。"
      },
      {
        "name": "可见控件边界",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1 if needed",
        "states": [
          "静止"
        ],
        "description": "只有当用户需要靠按钮边缘识别控件时，边缘才需要 3:1 的对比度。"
      },
      {
        "name": "键盘焦点指示器",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1",
        "states": [
          "焦点可见"
        ],
        "description": "焦点轮廓与按钮周围区域的对比度必须至少为 3:1。还要检查 destructive 按钮上的红色轮廓。"
      },
      {
        "name": "禁用外观",
        "category": "Color contrast",
        "criterion": "1.4.3 and 1.4.11 exceptions",
        "requirement": "Not required",
        "states": [
          "禁用"
        ],
        "description": "禁用控件无需满足这些对比度比例。"
      }
    ]
  },
  "propDescriptions": {
    "label": "无障碍标签。用作 aria-label（不会渲染为可见文本）。",
    "icon": "在按钮内渲染的图标元素。未指定尺寸的 Astryx Icon 在 sm/md 按钮中默认为 sm，在 lg 按钮中默认为 md。",
    "variant": "视觉样式变体。",
    "size": "尺寸变体。",
    "elevation": "静止阴影深度。最常见的 FAB 形态就是纯图标按钮，因此对于浮动操作按钮，使用 `low`/`med`/`high` 抬高它。`none` 是默认的扁平按钮。",
    "isLoading": "显示加载转圈并阻止重复激活，同时保持可聚焦（aria-busy + aria-disabled，而非原生 disabled）。",
    "isDisabled": "禁用按钮。使用 aria-disabled 而非原生 disabled，使按钮保持可聚焦。",
    "tooltip": "悬停和键盘焦点时显示的 Tooltip 文本。它还会描述按钮，除非其内容与按钮的无障碍名称重复。",
    "onClick": "标准点击处理函数。",
    "clickAction": "异步点击处理函数，带自动加载状态。",
    "isInterruptible": "在 `clickAction` 挂起期间保持按钮可点击：仍显示加载转圈和 aria-busy，但按钮不会被禁用，操作也不会被去重，因此再次点击会生效，并用新操作中断正在进行的操作。适用于可中断的操作，不适用于一次性触发的操作（提交、保存、支付）。",
    "width": "按钮的宽度。数字按像素处理，字符串按原样使用。不指定时，按钮保持纯图标的长宽比，默认为方形；指定后，按钮采用该宽度。",
    "type": "HTML button 的 type 属性。",
    "name": "用于表单提交的 HTML name 属性。",
    "value": "用于表单提交的 HTML value 属性。",
    "form": "通过 ID 将按钮与 form 元素关联。",
    "href": "提供后，将按钮渲染为链接元素（<a> 或自定义链接组件）。禁用的 IconButton 仍渲染为 <button>。",
    "as": "提供 href 时使用的自定义链接组件（例如 Next.js Link）。",
    "target": "作为链接渲染时的 HTML target 属性（例如 \"_blank\"）。",
    "rel": "作为链接渲染时的 HTML rel 属性（例如 \"noopener noreferrer\"）。"
  }
};
