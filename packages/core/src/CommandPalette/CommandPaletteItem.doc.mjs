// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'CommandPaletteItem',
  subComponentOf: 'CommandPalette',
  displayName: 'Command Palette Item',
  isHiddenFromOverview: true,
  description:
    'One option in a command palette result list. CommandPalette context supplies selection, highlight, identity, and close behavior.',
  usage: {
    description:
      'Use CommandPaletteItem for one non-interactive result row inside CommandPaletteList or CommandPaletteGroup. CommandPalette owns the composite keyboard model; standalone items expose only their explicit visual state and pointer activation.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep each value unique within the result list so highlight, active-descendant identity, and selection resolve to the same item.',
      },
      {
        guidance: true,
        description:
          'Inside CommandPalette, each item is an option in the listbox popup of the WAI-ARIA combobox pattern: keyboard focus stays in the query field, arrow keys move the highlight through aria-activedescendant, and Enter selects the highlighted item.',
      },
      {
        guidance: false,
        description:
          'Nest buttons, links, or other interactive controls inside an item. Option semantics make descendants presentational, so use non-interactive content such as icons, descriptions, and shortcut hints, and activate the option itself.',
      },
      {
        guidance: false,
        description:
          'Treat isHighlighted as selection. Highlight is the active keyboard result; isSelected represents the chosen value.',
      },
    ],
    anatomy: [
      {
        name: 'Item',
        required: true,
        description:
          'The option root that carries selection, disabled, item identity, interaction, and theme state.',
      },
      {
        name: 'Content',
        required: true,
        description:
          'Caller-provided non-interactive label and supporting presentation.',
      },
    ],
  },
  theming: {
    targets: [
      {
        className: 'astryx-command-palette-item',
        states: ['highlighted', 'selected', 'disabled'],
      },
    ],
  },
  props: [
    {
      name: 'value',
      type: 'string',
      description:
        'Unique value used for item identity, highlight lookup, and selection.',
      required: true,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Non-interactive item content such as a label, icon, description, or keyboard shortcut.',
      required: true,
    },
    {
      name: 'onSelect',
      type: '(value: string) => void',
      description:
        'Called after this item is activated by pointer. Keyboard selection in CommandPalette reports through CommandPalette onValueChange.',
    },
    {
      name: 'isHighlighted',
      type: 'boolean',
      description:
        'Whether this item is the active keyboard result. Derived from context when omitted inside CommandPalette.',
      default: 'false',
    },
    {
      name: 'isSelected',
      type: 'boolean',
      description:
        'Whether this item represents the selected value in picker mode. Derived from the CommandPalette value when omitted inside CommandPalette.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Whether the item is unavailable and suppresses pointer activation.',
      default: 'false',
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
      value: 'go-home',
      children: 'Go to Dashboard',
    },
  },
};

export const docsZh = {
  "name": "CommandPaletteItem",
  "isHiddenFromOverview": true,
  "displayName": "Command Palette Item",
  "description": "命令面板结果列表中的一个选项。CommandPalette 上下文提供选中、高亮、标识和关闭行为。",
  "propDescriptions": {
    "value": "用于条目标识、高亮查找和选中状态的唯一值。",
    "children": "非交互的条目内容，例如标签、图标、描述或键盘快捷键。",
    "onSelect": "当此条目被指针激活后调用。CommandPalette 内的键盘选择通过 CommandPalette 的 onValueChange 报告。",
    "isHighlighted": "此条目是否为当前键盘激活的结果。在 CommandPalette 内省略时从上下文派生。",
    "isSelected": "在选取模式下，此条目是否代表已选择的值。在 CommandPalette 内省略时从 CommandPalette 的 value 派生。",
    "isDisabled": "条目是否不可用，并禁止指针激活。",
    "xstyle": "用于布局自定义的 StyleX 样式。必须是 stylex.create() 值。"
  },
  "usage": {
    "description": "用 CommandPaletteItem 表示 CommandPaletteList 或 CommandPaletteGroup 内一个非交互的结果行。CommandPalette 拥有复合键盘模型；独立使用时，条目只暴露其显式视觉状态和指针激活。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "保持每个 value 在结果列表内唯一，使高亮、活动后代（active-descendant）标识和选中状态都解析到同一个条目。"
      },
      {
        "guidance": true,
        "description": "在 CommandPalette 内，每个条目都是 WAI-ARIA combobox 模式列表框弹出层中的一个选项：键盘焦点留在查询字段中，方向键通过 aria-activedescendant 移动高亮，Enter 选中高亮项。"
      },
      {
        "guidance": false,
        "description": "不要在条目内嵌套按钮、链接或其他交互控件。选项语义会使后代成为呈现性内容，因此请使用图标、描述和快捷键提示等非交互内容，并激活选项本身。"
      },
      {
        "guidance": false,
        "description": "不要把 isHighlighted 当作选中状态。高亮是当前键盘激活的结果；isSelected 表示已选择的值。"
      }
    ],
    "anatomy": [
      {
        "name": "条目",
        "required": true,
        "description": "承载选中、禁用、条目标识、交互和主题状态的选项根元素。"
      },
      {
        "name": "内容",
        "required": true,
        "description": "调用方提供的非交互标签及辅助呈现内容。"
      }
    ]
  }
};

export const docsDense = {
  name: 'CommandPaletteItem',
  isHiddenFromOverview: true,
  displayName: 'Command Palette Item',
  description:
    'one result option; context owns selection, highlight, identity, and close',
  propDescriptions: {
    value: 'unique value for identity, highlight lookup, and selection',
    children: 'non-interactive label and supporting content',
    onSelect:
      'called after pointer activation; palette keyboard selection uses root onValueChange',
    isHighlighted: 'active keyboard result; derived from context when omitted',
    isSelected:
      'selected value in picker mode; derived from palette value when omitted',
    isDisabled: 'unavailable; suppresses pointer activation',
    xstyle: 'StyleX layout styles; must be stylex.create() value',
  },
};
