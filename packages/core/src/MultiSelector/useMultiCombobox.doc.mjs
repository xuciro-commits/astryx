// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useMultiCombobox',
  displayName: 'useMultiCombobox',
  group: 'MultiSelector',
  keywords: [
    'combobox',
    'multi-select',
    'multiselect',
    'listbox',
    'grid',
    'toggle',
    'highlight',
    'active option',
    'aria-activedescendant',
    'keyboard',
    'headless',
    'apg',
    'accessibility',
    'a11y',
  ],
  params: [
    {
      name: 'options',
      type: 'UseMultiComboboxOptions',
      description: 'Configuration object.',
      required: true,
    },
    {
      name: 'options.selectableItems',
      type: 'MultiSelectorOptionData[]',
      description:
        'The options in the same order as they render. Options with `disabled` cannot be toggled and are skipped while moving through the open list. Opening never lands on a disabled option: ArrowUp opens on the last enabled option, and ArrowDown, a press, Enter or Space on the first enabled option.',
      required: true,
    },
    {
      name: 'options.isOpen',
      type: 'boolean',
      description: 'Whether the list is shown. The caller owns this state.',
      required: true,
    },
    {
      name: 'options.onOpen',
      type: '() => unknown',
      description:
        'Called to show the list. Return `false` to refuse; the hook then leaves the highlight alone.',
      required: true,
    },
    {
      name: 'options.onClose',
      type: '() => void',
      description: 'Called to hide the list. The highlight resets first.',
      required: true,
    },
    {
      name: 'options.onToggle',
      type: '(itemValue: string) => void',
      description:
        'Called with the value of the option to add or remove. Toggling keeps the list open.',
      required: true,
    },
    {
      name: 'options.listboxId',
      type: 'string',
      description:
        "The listbox (or grid) element's id. Option and action-cell ids are derived from it.",
      required: true,
    },
    {
      name: 'options.hasSearch',
      type: 'boolean',
      description:
        'Whether the list has its own search field. Space then types instead of toggling, opening by a press or Enter does not pre-highlight (ArrowDown and ArrowUp still open on the first and last enabled option), Delete and Backspace edit the query, and type-to-select is off. Home and End still jump to the first and last option, so a search input that keeps them for the caret should stop them before this handler and rely on PageUp and PageDown.',
      default: 'false',
    },
    {
      name: 'options.onClear',
      type: '() => void',
      description:
        'Clears every selected value. When provided, Delete or Backspace on the closed control clears them, so clearing is not pointer-only. Ignored while the list is open or with `hasSearch`.',
    },
    {
      name: 'options.hasValue',
      type: 'boolean',
      description:
        'Whether anything is selected. The Delete and Backspace clear is skipped when false.',
      default: 'false',
    },
    {
      name: 'options.isGrid',
      type: 'boolean',
      description:
        "Whether each row pairs an option cell with an action cell. The inline-end arrow then moves the highlight to the row's action and the inline-start arrow back, following visual direction in right-to-left layouts, and Enter on the action runs `onActivateAction` instead of toggling.",
      default: 'false',
    },
    {
      name: 'options.rowHasAction',
      type: '(index: number) => boolean',
      description:
        'In a grid, whether the row at `index` has an action cell to move to.',
    },
    {
      name: 'options.onActivateAction',
      type: '(index: number) => void',
      description:
        "In a grid, runs the control in the highlighted row's action cell. The selection does not change.",
    },
    {
      name: 'options.isDisabled',
      type: 'boolean',
      description: 'Whether the control ignores clicks and keys.',
      default: 'false',
    },
  ],
  returns: [
    {
      name: 'highlightedIndex',
      type: 'number',
      description: 'Index of the active row, or -1 when none is active.',
    },
    {
      name: 'setHighlightedIndex',
      type: '(index: number) => void',
      description:
        "Sets the active row, for example after filtering. The highlight lands on the row's option cell.",
    },
    {
      name: 'highlightedCell',
      type: "'option' | 'action'",
      description:
        "Which cell of the active row is highlighted; `'action'` only in a grid.",
    },
    {
      name: 'activeDescendantId',
      type: 'string | undefined',
      description:
        "The id to pass as the control's `aria-activedescendant`: the active option, or its action cell in a grid. Undefined while the list is closed or nothing is active.",
    },
    {
      name: 'getItemId',
      type: '(index: number) => string',
      description: 'The id to render on the option at `index`.',
    },
    {
      name: 'getActionCellId',
      type: '(index: number) => string',
      description:
        'In a grid, the id to render on the action cell of row `index`.',
    },
    {
      name: 'onTriggerClick',
      type: '() => void',
      description: 'Toggles the list from a press on the control.',
    },
    {
      name: 'onKeyDown',
      type: '(e: React.KeyboardEvent) => void',
      description:
        'Key handler for the control that keeps focus. ArrowDown and ArrowUp open the list or move the active row; Enter (and Space without search) toggles the active option and keeps the list open; Escape and Tab close it; Home, End, PageUp and PageDown jump to the first or last option; without search, typed characters move to the next option whose label starts with them, as in Selector (a repeated letter cycles, and a single letter searches from the option after the active one), and Space still toggles.',
    },
    {
      name: 'onItemMouseEnter',
      type: "(item: MultiSelectorOptionData, index: number, cell?: 'option' | 'action') => void",
      description:
        'Makes the hovered option, or its action cell, active without scrolling the list or moving focus.',
    },
  ],
  usage: {
    description:
      'Tracks the active option of a multi-select combobox and handles its keys, while DOM focus stays on the control. It powers MultiSelector; unlike useCombobox, toggling an option keeps the list open, and rows can carry an action cell. It renders nothing and sets no attributes: the caller renders the control and the list, and wires the ARIA attributes from what it returns.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Render each option with `id={getItemId(index)}` and pass `activeDescendantId` as the control's `aria-activedescendant`.",
      },
      {
        guidance: true,
        description:
          'Use `isGrid` only when rows carry a control next to the option; give each action cell `id={getActionCellId(index)}`.',
      },
      {
        guidance: true,
        description:
          'Announce the number of results through useAnnounce when the options change for a new query.',
      },
      {
        guidance: false,
        description:
          'Close the list after each toggle; a multi-select stays open so several options can be picked in a row.',
      },
    ],
  },
  relatedComponents: ['MultiSelector'],
  relatedHooks: ['useCombobox', 'useAnnounce'],
  importPath: '@astryxdesign/core/MultiSelector',
  category: 'focus',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Multi-select combobox state + keys; focus stays on control. Powers MultiSelector. Toggle keeps list open; rows may carry an action cell (grid). Renders nothing, sets no attrs: caller renders + wires ARIA.',
  paramDescriptions: {
    options: 'config.',
    'options.selectableItems':
      'options in render order; disabled ones not toggleable, skipped while moving in open list; opening lands on the first / last enabled option (ArrowUp: last).',
    'options.isOpen': 'list shown; caller owns state.',
    'options.onOpen':
      'show list; return false to refuse (highlight untouched).',
    'options.onClose': 'hide list; highlight resets first.',
    'options.onToggle': 'add / remove value; list stays open.',
    'options.listboxId':
      'listbox / grid id; option + action-cell ids derive from it.',
    'options.hasSearch':
      'own search field: Space types, press / Enter opening does not pre-highlight (ArrowDown/Up still first / last enabled), Delete / Backspace edit query, no type-to-select. Home / End still jump; stop them first to keep them for the caret, use PageUp / PageDown.',
    'options.onClear':
      'clear all; Delete / Backspace on closed control. ignored when open or hasSearch.',
    'options.hasValue': 'anything selected; clear skipped when false.',
    'options.isGrid':
      'rows = option + action cell; inline-end / inline-start arrows move between them (RTL-aware); Enter on action -> onActivateAction.',
    'options.rowHasAction': 'grid: row at index has an action cell.',
    'options.onActivateAction':
      "grid: run highlighted row's action; selection unchanged.",
    'options.isDisabled': 'ignore clicks + keys.',
  },
  returnDescriptions: {
    highlightedIndex: 'active row index, -1 = none.',
    setHighlightedIndex: 'set active row (lands on option cell).',
    highlightedCell: "'option' | 'action' (action only in grid).",
    activeDescendantId:
      'control aria-activedescendant: active option or its action cell; undefined when closed / none.',
    getItemId: 'id for option at index.',
    getActionCellId: 'grid: id for action cell of row index.',
    onTriggerClick: 'toggle list from a press on control.',
    onKeyDown:
      'control keydown: ArrowDown/Up open or move; Enter (Space w/o search) toggles, stays open; Escape / Tab close; Home / End / PageUp / PageDown jump; typed chars jump to the next option by label prefix, as in Selector (w/o search); Space still toggles.',
    onItemMouseEnter:
      'hover makes option / action cell active; no scroll, no focus move.',
  },
  usage: {
    description:
      'Headless multi-select combobox: active option + keys, focus stays on control; toggle keeps list open. Caller renders + wires ARIA.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Option id = getItemId(index); control aria-activedescendant = activeDescendantId.',
      },
      {
        guidance: true,
        description:
          'isGrid only when rows carry a control; action cell id = getActionCellId(index).',
      },
      {
        guidance: true,
        description: 'Announce result count via useAnnounce on new query.',
      },
      {
        guidance: false,
        description: 'Close after each toggle; multi-select stays open.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useMultiCombobox",
  "usage": {
    "description": "跟踪多选组合框的当前活动选项并处理其按键，同时 DOM 焦点保持在控件上。它为 MultiSelector 提供支持；与 useCombobox 不同，切换选项后列表保持打开，并且行可以带有操作单元格。它不渲染任何内容，也不设置任何属性：调用方负责渲染控件和列表，并根据返回值连接 ARIA 属性。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "使用 `id={getItemId(index)}` 渲染每个选项，并将 `activeDescendantId` 作为控件的 `aria-activedescendant` 传入。"
      },
      {
        "guidance": true,
        "description": "仅当行在选项旁边带有控件时才使用 `isGrid`；为每个操作单元格设置 `id={getActionCellId(index)}`。"
      },
      {
        "guidance": true,
        "description": "当选项因新查询而变化时，通过 useAnnounce 宣布结果数量。"
      },
      {
        "guidance": false,
        "description": "不要在每次切换后关闭列表；多选列表会保持打开，以便连续选择多个选项。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "配置对象。",
    "options.selectableItems": "与渲染顺序相同的选项。带有 `disabled` 的选项无法切换，在浏览打开的列表时会被跳过。打开时绝不会落在禁用的选项上：ArrowUp 落在最后一个启用选项上，ArrowDown、按下、Enter 或 Space 落在第一个启用选项上。",
    "options.isOpen": "列表是否显示。此状态由调用方管理。",
    "options.onOpen": "在显示列表时调用。返回 `false` 表示拒绝；此时 Hook 不会移动高亮。",
    "options.onClose": "在隐藏列表时调用。高亮会先重置。",
    "options.onToggle": "使用要添加或移除的选项值调用。切换后列表保持打开。",
    "options.listboxId": "listbox（或 grid）元素的 id。选项和操作单元格的 id 由它派生。",
    "options.hasSearch": "列表是否有自己的搜索字段。此时 Space 用于输入而不是切换，按下或按 Enter 打开时不会预先高亮（ArrowDown 和 ArrowUp 仍会落在第一个和最后一个启用选项上），Delete 和 Backspace 用于编辑查询，类型选择被关闭。Home 和 End 仍会跳转到第一个和最后一个选项，因此要为光标保留这些按键的搜索输入应在该处理程序之前阻止它们，并依赖 PageUp 和 PageDown。",
    "options.onClear": "清除所有已选值。提供后，在处于关闭状态的控件上按 Delete 或 Backspace 会清除它们，因此清除操作不仅限于指针操作。在列表打开或设置了 `hasSearch` 时忽略。",
    "options.hasValue": "是否有任何选中项。为 false 时跳过 Delete 和 Backspace 清除。",
    "options.isGrid": "每一行是否将一个选项单元格与一个操作单元格配对。此时行内末端箭头会将高亮移动到该行的操作上，行内起始箭头则移回，并遵循从右到左布局中的视觉方向；在操作上按 Enter 会运行 `onActivateAction`，而不是切换选项。",
    "options.rowHasAction": "在网格中，`index` 处的行是否有可移动到的操作单元格。",
    "options.onActivateAction": "在网格中，运行高亮行操作单元格中的控件。选择不会改变。",
    "options.isDisabled": "控件是否忽略点击和按键。"
  },
  "returnDescriptions": {
    "highlightedIndex": "活动行的索引；没有活动行时为 -1。",
    "setHighlightedIndex": "设置活动行，例如在过滤之后。高亮会落在该行的选项单元格上。",
    "highlightedCell": "活动行中高亮的是哪个单元格；仅在网格中为 `'action'`。",
    "activeDescendantId": "要作为控件 `aria-activedescendant` 传入的 id：活动选项，或在网格中其操作单元格。列表关闭或没有活动项时为 undefined。",
    "getItemId": "要渲染在 `index` 处选项上的 id。",
    "getActionCellId": "在网格中，要渲染在 `index` 行操作单元格上的 id。",
    "onTriggerClick": "通过在控件上按下切换列表。",
    "onKeyDown": "用于保持焦点的控件的按键处理程序。ArrowDown 和 ArrowUp 打开列表或移动活动行；Enter（以及无搜索时的 Space）切换活动选项并保持列表打开；Escape 和 Tab 关闭列表；Home、End、PageUp 和 PageDown 跳转到第一个或最后一个选项；无搜索时，键入的字符会移动到标签以该字符开头的下一个选项，与 Selector 中一致（重复的字母会循环，单个字母会从活动选项之后开始搜索），Space 仍会切换。",
    "onItemMouseEnter": "将悬停的选项或其操作单元格设为活动，而不滚动列表或移动焦点。"
  }
};
