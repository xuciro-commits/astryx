// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Dialog',
    required: true,
    description: 'Modal surface that contains the command palette.',
  },
  {
    name: 'Input',
    required: true,
    description:
      'Search region containing the query field and its supporting visuals.',
  },
  {
    name: 'Search glyph',
    required: true,
    description: 'Search symbol rendered by Icon in the default Input.',
  },
  {
    name: 'Query field',
    required: true,
    description: 'Native text field used to enter a search query.',
  },
  {
    name: 'Loading spinner',
    required: false,
    description:
      'Spinner shown in the default Input while a search is pending.',
  },
  {
    name: 'List',
    required: true,
    description:
      'Scrollable results container: a listbox while selectable results exist, otherwise the Empty state as plain content.',
  },
  {
    name: 'Item',
    required: false,
    description: 'Selectable command result rendered inside the List.',
  },
  {
    name: 'Group',
    required: false,
    description: 'Optional collection of Items that share a heading.',
  },
  {
    name: 'Group heading',
    required: false,
    description: 'Visible heading rendered for a Group.',
  },
  {
    name: 'Empty',
    required: false,
    description: 'Message shown when the current result set is empty.',
  },
  {
    name: 'Footer',
    required: false,
    description:
      'Footer region for default keyboard guidance or caller-provided content.',
  },
  {
    name: 'Keyboard shortcut',
    required: false,
    description:
      'Painted key badges rendered by Kbd in the default Footer guidance.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'CommandPalette',
  displayName: 'Command Palette',
  group: 'CommandPalette',
  category: 'Overlay',
  keywords: [
    'command',
    'spotlight',
    'launcher',
    'omnibox',
    'quicksearch',
    'palette',
    'finder',
    'search',
    'modal',
    'dialog',
    'navigation',
    'commandmenu',
    'cmdk',
  ],
  description:
    'Root component. Manages open state, search, keyboard navigation, and composition slots.',
  // Intentionally a contained isInline preview, not playground.overlay: the
  // component stays visible on load and knobs stay live, whereas a real
  // showModal() overlay makes the page inert — see ComponentPlaygroundConfig.overlay
  // in docs-types.ts (#3657).
  playground: {
    defaults: {
      isOpen: true,
      isInline: true,
      onOpenChange: undefined,
    },
  },
  props: [
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Whether the command palette dialog is visible.',
      required: true,
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description: 'Called when the palette visibility changes.',
      required: true,
    },
    {
      name: 'searchSource',
      type: 'SearchSource<T>',
      description:
        'Search source providing items via search(query) and bootstrap(). Use createStaticSource for static lists.',
      required: true,
    },
    {
      name: 'input',
      type: 'ReactNode',
      description:
        'Input slot. Defaults to CommandPaletteInput with standard behavior.',
      default: '<CommandPaletteInput />',
      slotElements: [
        {
          __element: 'TextInput',
          props: {
            label: 'Input',
            placeholder: 'Type here...',
          },
        },
      ],
    },
    {
      name: 'footer',
      type: 'ReactNode',
      description:
        'Footer slot. Defaults to CommandPaletteFooter showing keyboard hints.',
      default: '<CommandPaletteFooter />',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Footer content',
        },
      ],
    },
    {
      name: 'renderItem',
      type: '(item: T, isSelected: boolean) => ReactNode',
      description:
        'Per-item render function for non-interactive presentation content such as labels, icons, descriptions, and shortcut hints. Do not return buttons or links inside the option. Auto-grouping by auxiliaryData.group is preserved. When omitted, renders label text.',
    },
    {
      name: 'emptySearchText',
      type: 'ReactNode',
      description: 'Content shown when a search query returns no results.',
      default: "'No results'",
    },
    {
      name: 'emptyBootstrapText',
      type: 'ReactNode',
      description:
        'Content shown when there is no search query and bootstrap() returns nothing.',
      default: "'Type to search'",
    },
    {
      name: 'value',
      type: 'string',
      description: 'Controlled selected value for picker mode.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: 'Called when the selected value changes in picker mode.',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the command palette dialog.',
      default: "'Command palette'",
    },
    {
      name: 'width',
      type: 'number | string',
      description: 'Width of the dialog.',
      default: '640',
    },
    {
      name: 'maxHeight',
      type: 'number | string',
      description: 'Maximum height of the dialog.',
      default: '480',
    },
    {
      name: 'isInline',
      type: 'boolean',
      description:
        'Renders command palette content inline without modal behavior. Automatically disables input auto-focus and initial highlighted-item auto-scroll. For documentation previews and showcases only.',
      default: 'false',
    },
  ],
  components: [
    {name: 'CommandPaletteInput'},
    {name: 'CommandPaletteList'},
    {name: 'CommandPaletteItem'},
    {name: 'CommandPaletteGroup'},
    {name: 'CommandPaletteFooter'},
    {name: 'CommandPaletteEmpty'},
  ],
  theming: {
    targets: [
      {className: 'astryx-command-palette-empty'},
      {className: 'astryx-command-palette-footer'},
      {className: 'astryx-command-palette-group'},
      {className: 'astryx-command-palette-group-heading'},
      {className: 'astryx-command-palette-input'},
      {
        className: 'astryx-command-palette-item',
        states: ['highlighted', 'selected', 'disabled'],
      },
      {className: 'astryx-command-palette-list'},
    ],
  },
  usage: {
    anatomy,
    description:
      'CommandPalette is a searchable dialog for quick access to commands, navigation, and actions. Use it as a keyboard-driven launcher powered by SearchSource for filtering and selection.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide a searchSource with bootstrap results so users see useful options before typing.',
      },
      {
        guidance: true,
        description:
          'Use auxiliaryData.group on items to automatically organize results into labeled sections.',
      },
      {
        guidance: true,
        description:
          'Provide a specific label when more than one command palette can appear in the same product surface.',
      },
      {
        guidance: true,
        description:
          'Keep renderItem content non-interactive; each rendered row is one option, so buttons and links cannot be nested inside it.',
      },
      {
        guidance: false,
        description:
          'Intercept query-field keyboard events without preserving active IME composition and native Home/End caret movement.',
      },
      {
        guidance: false,
        description:
          'Use CommandPalette for simple dropdowns or menus; use Menu or Selector for inline selections.',
      },
      {
        guidance: false,
        description:
          'Add too many groups or items; curate results to keep the palette fast and scannable.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "anatomy": [
      {
        "name": "对话框",
        "required": true,
        "description": "包含命令面板的模态表面。"
      },
      {
        "name": "输入区",
        "required": true,
        "description": "包含查询字段及其辅助视觉元素的搜索区域。"
      },
      {
        "name": "搜索图标",
        "required": true,
        "description": "默认 Input 中由 Icon 渲染的搜索符号。"
      },
      {
        "name": "查询字段",
        "required": true,
        "description": "用于输入搜索查询的原生文本字段。"
      },
      {
        "name": "加载指示器",
        "required": false,
        "description": "搜索挂起期间显示在默认 Input 中的加载指示器。"
      },
      {
        "name": "列表",
        "required": true,
        "description": "可滚动结果容器：存在可选结果时为列表框，否则以纯内容形式显示 Empty 状态。"
      },
      {
        "name": "项",
        "required": false,
        "description": "渲染在 List 中的可选命令结果。"
      },
      {
        "name": "分组",
        "required": false,
        "description": "共享同一标题的可选 Items 集合。"
      },
      {
        "name": "分组标题",
        "required": false,
        "description": "为 Group 渲染的可见标题。"
      },
      {
        "name": "空状态",
        "required": false,
        "description": "当前结果集为空时显示的消息。"
      },
      {
        "name": "页脚",
        "required": false,
        "description": "页脚区域，用于默认键盘提示或调用方提供的内容。"
      },
      {
        "name": "键盘快捷键",
        "required": false,
        "description": "默认 Footer 提示中由 Kbd 渲染的按键徽标。"
      }
    ],
    "description": "CommandPalette 是一个可搜索对话框，用于快速访问命令、导航和操作。将它作为由 SearchSource 提供筛选和选择能力的键盘驱动启动器。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "提供带有 bootstrap 结果的 searchSource，让用户在输入前就能看到有用的选项。"
      },
      {
        "guidance": true,
        "description": "在项上使用 auxiliaryData.group，自动将结果组织为带标签的分区。"
      },
      {
        "guidance": true,
        "description": "当同一产品界面中可能出现多个命令面板时，请提供具体的 label。"
      },
      {
        "guidance": true,
        "description": "保持 renderItem 的内容非交互；每个渲染行就是一个选项，因此不能在其中嵌套按钮和链接。"
      },
      {
        "guidance": false,
        "description": "拦截查询字段的键盘事件，却不保留活动输入法组合状态和原生 Home/End 光标移动。"
      },
      {
        "guidance": false,
        "description": "将 CommandPalette 用于简单的下拉菜单或菜单；内联选择请使用 Menu 或 Selector。"
      },
      {
        "guidance": false,
        "description": "添加过多的分组或项；应精选结果，使面板保持快速且易于浏览。"
      }
    ]
  },
  "name": "CommandPalette",
  "displayName": "Command Palette",
  "description": "根组件。管理打开状态、搜索、键盘导航和组合插槽。",
  "propDescriptions": {
    "isOpen": "命令面板对话框是否可见。",
    "onOpenChange": "面板可见性变化时调用。",
    "searchSource": "通过 search(query) 和 bootstrap() 提供项的搜索源。静态列表请使用 createStaticSource。",
    "input": "输入插槽。默认为具有标准行为的 CommandPaletteInput。",
    "footer": "页脚插槽。默认为显示键盘提示的 CommandPaletteFooter。",
    "renderItem": "逐项渲染函数，用于标签、图标、描述和快捷键提示等非交互展示内容。不要在选项内返回按钮或链接。按 auxiliaryData.group 自动分组的行为保持不变。省略时渲染 label 文本。",
    "emptySearchText": "搜索查询无结果时显示的内容。",
    "emptyBootstrapText": "没有搜索查询且 bootstrap() 未返回任何内容时显示的内容。",
    "value": "选择器模式下的受控选中值。",
    "onValueChange": "选择器模式下选中值变化时调用。",
    "label": "命令面板对话框的无障碍标签。",
    "width": "对话框的宽度。",
    "maxHeight": "对话框的最大高度。",
    "isInline": "以内联方式渲染命令面板内容，不带模态行为。自动禁用输入框自动聚焦和初始高亮项的自动滚动。仅用于文档预览和展示。"
  },
  "components": [
    {
      "name": "CommandPaletteInput",
      "description": ""
    },
    {
      "name": "CommandPaletteList",
      "description": ""
    },
    {
      "name": "CommandPaletteItem",
      "description": ""
    },
    {
      "name": "CommandPaletteGroup",
      "description": ""
    },
    {
      "name": "CommandPaletteFooter",
      "description": ""
    },
    {
      "name": "CommandPaletteEmpty",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'searchSource-driven command palette dialog; filtering, keyboard nav, grouping, selection; same SearchSource interface as Typeahead',
  usage: {
    anatomy,
    description:
      'CommandPalette is a searchable dialog for quick access to commands, navigation, and actions. Use it as a keyboard-driven launcher powered by SearchSource for filtering and selection.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide a searchSource with bootstrap results so users see useful options before typing.',
      },
      {
        guidance: true,
        description:
          'Use auxiliaryData.group on items to automatically organize results into labeled sections.',
      },
      {
        guidance: true,
        description:
          'Provide a specific label when more than one command palette can appear in the same product surface.',
      },
      {
        guidance: true,
        description:
          'Keep renderItem content non-interactive; each rendered row is one option, so buttons and links cannot be nested inside it.',
      },
      {
        guidance: false,
        description:
          'Intercept query-field keyboard events without preserving active IME composition and native Home/End caret movement.',
      },
      {
        guidance: false,
        description:
          'Use CommandPalette for simple dropdowns or menus; use Menu or Selector for inline selections.',
      },
      {
        guidance: false,
        description:
          'Add too many groups or items; curate results to keep the palette fast and scannable.',
      },
    ],
  },
};
