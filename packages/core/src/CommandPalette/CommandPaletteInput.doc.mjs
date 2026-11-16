// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'CommandPaletteInput',
  subComponentOf: 'CommandPalette',
  displayName: 'Command Palette Input',
  isHiddenFromOverview: true,
  description:
    'Search input slot. Auto-focuses on mount. Wires to command palette context when used inside CommandPalette.',
  usage: {
    description:
      'Use CommandPaletteInput inside CommandPalette for a popup-backed command query, or as an independent search field when no result popup is present.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pass a concise label that identifies what can be searched when "Search commands" does not describe it; the placeholder is never the field\'s name.',
      },
      {
        guidance: true,
        description:
          'Use endContent for short supporting controls or shortcut hints at the trailing edge.',
      },
      {
        guidance: false,
        description:
          'Override combobox role or popup state. CommandPaletteInput owns those semantics when connected to CommandPalette.',
      },
    ],
    anatomy: [
      {
        name: 'Input',
        required: true,
        description:
          'The surrounding inline layout for the search glyph, query field, and trailing content.',
      },
      {
        name: 'Search glyph',
        required: true,
        description: 'A decorative search icon before the query field.',
      },
      {
        name: 'Query field',
        required: true,
        description:
          'The native text field. It is a searchbox when standalone without popup attributes and a combobox when popup relationships are supplied or CommandPalette context is present.',
      },
      {
        name: 'Loading spinner',
        required: false,
        description:
          'A delayed pending indicator shown before trailing content while search is busy.',
      },
      {
        name: 'Trailing content',
        required: false,
        description:
          'Caller-provided supporting content such as a clear control or shortcut hint.',
      },
    ],
  },
  theming: {
    targets: [{className: 'astryx-command-palette-input'}],
  },
  props: [
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text for the input.',
      default: "'Search…'",
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible label for the query field, announced by screen readers. Defaults to the translated "Search commands"; the placeholder is never used as the name.',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description:
        'Auto-focus the input when mounted. Automatically disabled when inside an inline command palette.',
      default: 'true',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Content rendered at the trailing end of the input, after the spinner. Use for clear buttons or keyboard shortcut hints.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'chevronDown',
            size: 'sm',
          },
        },
        {
          __element: 'Badge',
          props: {
            label: '3',
          },
        },
      ],
    },
    {
      name: 'value',
      type: 'string',
      description:
        'Search value. When omitted inside CommandPalette, reads from context.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description:
        'Called when search value changes. When omitted inside CommandPalette, writes to context.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization. Must be a stylex.create() value.',
    },
  ],
  playground: {
    defaults: {
      placeholder: 'Search commands, files, or actions...',
      hasAutoFocus: false,
    },
  },
};

export const docsZh = {
  "name": "CommandPaletteInput",
  "isHiddenFromOverview": true,
  "displayName": "Command Palette Input",
  "description": "搜索输入槽。挂载时自动聚焦。在 CommandPalette 内使用时自动接入命令面板的 context。",
  "propDescriptions": {
    "placeholder": "输入框的占位文本。",
    "label": "查询字段的无障碍标签，由屏幕阅读器朗读。默认为翻译后的 “Search commands”；placeholder 永远不会用作名称。",
    "hasAutoFocus": "挂载时自动聚焦输入框。在行内命令面板内会自动禁用。",
    "endContent": "渲染在输入框尾部、旋转图标之后的内容。用于清除按钮或键盘快捷键提示。",
    "value": "搜索值。在 CommandPalette 内省略时，从 context 读取。",
    "onValueChange": "搜索值变化时调用。在 CommandPalette 内省略时，写入 context。",
    "xstyle": "用于布局自定义的 StyleX 样式。必须是 stylex.create() 的值。"
  },
  "usage": {
    "description": "在 CommandPalette 内使用 CommandPaletteInput 以获得带弹层的命令查询；没有结果弹层时，也可将其作为独立的搜索字段使用。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "当 “Search commands” 无法说明搜索范围时，传入一个简洁的 label 指明可搜索的内容；placeholder 永远不会作为字段名称。"
      },
      {
        "guidance": true,
        "description": "在尾部需要简短辅助控件或快捷键提示时，使用 endContent。"
      },
      {
        "guidance": false,
        "description": "不要覆盖 combobox 角色或弹层状态。连接到 CommandPalette 后，这些语义由 CommandPaletteInput 负责。"
      }
    ],
    "anatomy": [
      {
        "name": "输入框",
        "required": true,
        "description": "围绕搜索图标、查询字段和尾部内容的行内布局。"
      },
      {
        "name": "搜索图标",
        "required": true,
        "description": "查询字段前的装饰性搜索图标。"
      },
      {
        "name": "查询字段",
        "required": true,
        "description": "原生文本字段。独立使用且没有弹层属性时是 searchbox；提供弹层关系或存在 CommandPalette context 时是 combobox。"
      },
      {
        "name": "加载旋转图标",
        "required": false,
        "description": "搜索繁忙时在尾部内容之前显示的延迟等待指示器。"
      },
      {
        "name": "尾部内容",
        "required": false,
        "description": "调用方提供的辅助内容，例如清除控件或快捷键提示。"
      }
    ]
  }
};

export const docsDense = {
  name: 'CommandPaletteInput',
  isHiddenFromOverview: true,
  displayName: 'Command Palette Input',
  description:
    'search input; auto-focus on mount; wires to context inside CommandPalette',
  propDescriptions: {
    placeholder: 'input placeholder text',
    label:
      'accessible label for the query field; default "Search commands", never the placeholder',
    hasAutoFocus: 'auto-focus on mount; auto-disabled in inline mode',
    endContent: 'trailing content after spinner',
    value: 'search value; reads context when omitted inside palette',
    onValueChange:
      'called on change; writes context when omitted inside palette',
    xstyle: 'StyleX layout styles; must be stylex.create() value',
  },
};
