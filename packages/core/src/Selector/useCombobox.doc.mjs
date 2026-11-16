// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useCombobox',
  displayName: 'useCombobox',
  group: 'Selector',
  keywords: [
    'combobox',
    'listbox',
    'select',
    'dropdown',
    'highlight',
    'active option',
    'aria-activedescendant',
    'keyboard',
    'arrow keys',
    'headless',
    'autocomplete',
    'apg',
    'accessibility',
    'a11y',
  ],
  params: [
    {
      name: 'options',
      type: 'UseComboboxOptions',
      description: 'Configuration object.',
      required: true,
    },
    {
      name: 'options.selectableItems',
      type: 'ReadonlyArray<T extends {value: string; disabled?: boolean}>',
      description:
        'The options in the same order as they render: `SelectorOptionData`, or any option type with a string `value` and an optional `disabled`. Options with `disabled` cannot be picked and are skipped while moving through the open list; ArrowDown or ArrowUp that opens the list from `onKeyDown` lands on the selected option when it is enabled, else on the first or last enabled option.',
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
      description:
        'Called when the hook hides the list; the hook resets the highlight first. When the caller closes the list itself (an outside press, say), it should also call `setHighlightedIndex(-1)`.',
      required: true,
    },
    {
      name: 'options.listboxId',
      type: 'string',
      description:
        "The listbox element's id. Option ids are derived from it through `getItemId`.",
      required: true,
    },
    {
      name: 'options.value',
      type: 'string',
      description:
        'The selected value. Opening the list highlights it when it is enabled; otherwise ArrowUp opens on the last enabled option and ArrowDown, a press, Enter or Space on the first. A disabled option is never highlighted on opening, and with no enabled option nothing is.',
    },
    {
      name: 'options.onSelect',
      type: '(value: string) => void',
      description:
        'Called with the picked value. Picking also closes the list.',
    },
    {
      name: 'options.onClear',
      type: '() => void',
      description:
        'Clears the value. When provided, Delete or Backspace on the closed control clears it, so clearing is not pointer-only. Ignored while the list is open or with `hasSearch`.',
    },
    {
      name: 'options.hasSearch',
      type: 'boolean',
      description:
        'Whether the list has its own search field. Space then types instead of picking, opening by a press or Enter does not pre-highlight (ArrowDown and ArrowUp still open on the selected or the first or last enabled option), and printable keys on the closed control go to `onSearchSeed`.',
      default: 'false',
    },
    {
      name: 'options.onSearchSeed',
      type: '(char: string) => void',
      description:
        'With `hasSearch`, receives each printable character except Space typed while the control has focus, opening the list first when it is closed, so type-to-find needs no separate open step.',
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
      description:
        'Index of the active option, or -1 when none is active. With `hasSearch`, opening by a press or Enter does not set one, so it stays -1 after the hook itself closes the list; ArrowDown and ArrowUp still open on the selected or the first or last enabled option. Render it as the active option and name it in `aria-activedescendant` only while it points at a rendered option.',
    },
    {
      name: 'setHighlightedIndex',
      type: '(index: number) => void',
      description:
        'Sets the active option, for example from a filter that changes the options.',
    },
    {
      name: 'getItemId',
      type: '(index: number) => string',
      description:
        "The id to render on the option at `index`. Set the control's `aria-activedescendant` to `isOpen && highlightedIndex >= 0 && highlightedIndex < selectableItems.length ? getItemId(highlightedIndex) : undefined`, so it never names an option that does not exist, including in an empty list.",
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
        'Key handler for the control that keeps focus. ArrowDown and ArrowUp open the list or move the active option; Enter (and Space without search) picks it or opens the list; Escape and Tab close it; Home, End, PageUp and PageDown jump to the first or last option. An editable control that keeps Home and End for the caret does not pass them to this handler, as CommandPalette does.',
    },
    {
      name: 'onItemSelect',
      type: '(item: T) => void',
      description: 'Picks an option from a press on it, then closes the list.',
    },
    {
      name: 'onItemMouseEnter',
      type: '(item: T, index: number) => void',
      description:
        'Makes the hovered option active without scrolling the list or moving focus.',
    },
    {
      name: 'getFieldProps',
      type: '(props?: {onKeyDown?(event: React.KeyboardEvent): void}) => object',
      description:
        'Props for a single-line `input` you render: `role="combobox"`, `aria-expanded`, `aria-autocomplete="list"`, `aria-controls` only while the listbox renders (`isOpen` with at least one option), `aria-activedescendant` only while an option is active, and the field\u2019s key handler. Pass your own `onKeyDown` here rather than beside the spread: it runs after the hook\u2019s handler unless that handler claimed the key, and it may be typed for its element.',
    },
    {
      name: 'getListboxProps',
      type: '() => object',
      description:
        'Props for the listbox you render, anywhere in the document, including the page\u2019s flow: its `id` and `role`, and a press handler that keeps focus in the field. Render it while `isOpen` and there are options, and name it with `aria-label` or `aria-labelledby`.',
    },
    {
      name: 'getOptionProps',
      type: '(index: number) => object',
      description:
        'Props for the option at `index`: its `id`, `role`, `aria-selected` (true on the active option), `aria-disabled` on a disabled one, a pointer move that makes it active without moving focus, and a press that picks it.',
    },
  ],
  usage: {
    description:
      'Tracks the active option of a single-select combobox and handles its keys, while DOM focus stays on the control. It powers Selector and CommandPalette; use it to build a combobox those components do not cover, including one over a single-line text field you render yourself, such as a search field whose results replace a page section, or an \u201cadd people\u201d field in a dialog. It renders nothing: you render the field, the listbox and the options, and spread `getFieldProps`, `getListboxProps` and `getOptionProps` onto them, or wire `role`, `aria-expanded`, `aria-controls` and `aria-activedescendant` yourself from `onKeyDown` and `getItemId` for a control such as a button.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Render each option with `id={getItemId(index)}` and set the control's `aria-activedescendant` only while `isOpen` and `highlightedIndex` points at a rendered option, as CommandPalette does.",
      },
      {
        guidance: true,
        description:
          "For type-to-select without a search field, run useTypeahead's handler first and fall through to this `onKeyDown` when it returns false, as Selector does.",
      },
      {
        guidance: true,
        description:
          'For a field you render, spread the prop getters, and set the active option yourself when a new query changes the options: the first option so Enter picks it, or -1 so Enter stays the field\u2019s.',
      },
      {
        guidance: true,
        description:
          'Announce the number of results through useAnnounce when the options change for a new query (AST-075 DEC-2). When nothing matches, announce the words the field shows for it.',
      },
      {
        guidance: false,
        description:
          'Render controls that are not options, such as a create button or an empty message, inside the listbox; render them beside it.',
      },
      {
        guidance: false,
        description:
          'Move DOM focus onto the options; the active option is announced through `aria-activedescendant` while focus stays on the control.',
      },
    ],
    accessibility: [
      {
        name: 'Focus stays in the field',
        category: 'Semantics',
        requirement: 'AST-075 FR1',
        description:
          'With the prop getters, moving the active option never moves focus out of the field. The field names the active option through `aria-activedescendant` and carries none while no option is active.',
      },
      {
        name: 'Expanded state follows the list',
        category: 'Semantics',
        requirement: 'AST-075 FR2',
        description:
          'While the listbox renders, the field exposes `aria-expanded="true"` and `aria-controls` naming it. Otherwise it exposes `aria-expanded="false"` and references nothing.',
      },
      {
        name: 'Roles',
        category: 'Semantics',
        requirement: 'AST-075 FR3',
        description:
          'The field is a `combobox` with `aria-autocomplete="list"`. The list is a `listbox` of `option`s with `aria-selected="true"` on the active one. You name the field and the listbox.',
      },
      {
        name: 'Keys',
        category: 'Keyboard',
        requirement: 'AST-075 FR4',
        description:
          'While the list shows, ArrowDown and ArrowUp move the active option and wrap; Enter picks an active option and only then stops the field\u2019s own Enter; Escape, whatever modifier is held, hides the list without closing an enclosing dialog or popover on the same press. While it is hidden, ArrowDown shows it when there are options. An open field with no options still takes Escape, which closes the list, so render an empty message while it is open. Home, End, other chords such as Shift+Enter, and every other key reach the field.',
      },
      {
        name: 'Input method',
        category: 'Keyboard',
        requirement: 'AST-075 FR5',
        description:
          'No key moves, picks or hides while an input method is composing text.',
      },
      {
        name: 'Pointer',
        category: 'Semantics',
        requirement: 'AST-075 FR6',
        description:
          'Moving the pointer over an option makes it active without moving focus; pressing an option picks it, and the field keeps focus through the press.',
      },
      {
        name: 'Result count',
        category: 'Content',
        requirement: 'AST-075 FR7',
        description:
          'Yours to announce: compose useAnnounce (AST-075 DEC-2) so each new query announces the number of options, or that there are none, once and politely. For none, announce the words the field shows.',
      },
    ],
  },
  relatedComponents: ['Selector', 'CommandPalette'],
  relatedHooks: ['useMultiCombobox', 'useTypeahead', 'useAnnounce'],
  importPath: '@astryxdesign/core/Selector',
  category: 'focus',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Single-select combobox state + keys; focus stays on control. Powers Selector / CommandPalette, and comboboxes over a single-line field you render (search whose results replace a section, an add-people field). Renders nothing: spread getFieldProps / getListboxProps / getOptionProps, or wire role, aria-expanded, aria-controls, aria-activedescendant yourself.',
  paramDescriptions: {
    options: 'config.',
    'options.selectableItems':
      'options in render order: SelectorOptionData or any type w/ string value + optional disabled; disabled ones not pickable, skipped while moving in open list (onKeyDown ArrowDown/Up opening lands on the enabled selected option, else first / last enabled).',
    'options.isOpen': 'list shown; caller owns state.',
    'options.onOpen':
      'show list; return false to refuse (highlight untouched).',
    'options.onClose':
      'hook hides list; resets highlight first. caller closing itself (outside press): also setHighlightedIndex(-1).',
    'options.listboxId': 'listbox id; option ids derive from it (getItemId).',
    'options.value':
      'selected value; opening highlights it when enabled, else ArrowUp -> last enabled, other opens -> first enabled; never a disabled option.',
    'options.onSelect': 'called w/ picked value; picking closes.',
    'options.onClear':
      'clears value; Delete / Backspace on closed control. ignored when open or hasSearch.',
    'options.hasSearch':
      'list has own search field: Space types, press / Enter opening does not pre-highlight (ArrowDown/Up still selected, else first / last enabled), printable keys on closed control -> onSearchSeed.',
    'options.onSearchSeed':
      'w/ hasSearch, each printable char except Space typed while control focused (opens first if closed).',
    'options.isDisabled': 'ignore clicks + keys.',
  },
  returnDescriptions: {
    highlightedIndex:
      'active option index, -1 = none. hasSearch: press / Enter opening sets none (stays -1 after hook closes); ArrowDown/Up still selected, else first / last enabled. name in aria-activedescendant only when it points at a rendered option.',
    setHighlightedIndex: 'set active option (e.g. after filtering).',
    getItemId:
      'id for option at index; aria-activedescendant = isOpen && highlightedIndex >= 0 && highlightedIndex < selectableItems.length ? getItemId(highlightedIndex) : undefined (empty list safe).',
    onTriggerClick: 'toggle list from a press on control.',
    onKeyDown:
      'control keydown: ArrowDown/Up open or move; Enter (Space w/o search) picks or opens; Escape / Tab close; Home / End / PageUp / PageDown jump. editable control keeping Home / End for caret: do not pass them.',
    onItemSelect: 'pick from a press, then close.',
    onItemMouseEnter: 'hover makes option active; no scroll, no focus move.',
    getFieldProps:
      'input props: role=combobox, aria-expanded, aria-autocomplete=list, aria-controls only while listbox renders (isOpen + options), aria-activedescendant only while an option is active, key handler. pass own onKeyDown here (may be typed for its element): runs after hook unless hook claimed key.',
    getListboxProps:
      'listbox props (id, role, press keeps focus in field); render anywhere incl. page flow while isOpen + options; name it (aria-label / aria-labelledby).',
    getOptionProps:
      'option props at index: id, role, aria-selected on active, aria-disabled, pointer move activates w/o focus move, press picks.',
  },
  usage: {
    description:
      'Headless single-select combobox: active option + keys, focus stays on control. Caller renders + wires ARIA.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Option id = getItemId(index); aria-activedescendant only while open and highlightedIndex points at a rendered option.',
      },
      {
        guidance: true,
        description:
          'Type-to-select w/o search: run useTypeahead first, fall through when it returns false.',
      },
      {
        guidance: true,
        description:
          'Own field: spread the getters, set active option on new query (first: Enter picks; -1: Enter stays the field\u2019s).',
      },
      {
        guidance: true,
        description:
          'Announce result count via useAnnounce on new query (AST-075 DEC-2); for none, the words the field shows.',
      },
      {
        guidance: false,
        description:
          'Non-option controls (create button, empty message) inside listbox; render beside it.',
      },
      {
        guidance: false,
        description: 'Move DOM focus onto options; use aria-activedescendant.',
      },
    ],
    accessibility: [
      {
        name: 'Focus stays in the field',
        category: 'Semantics',
        requirement: 'AST-075 FR1',
        description:
          'moving active option never moves focus; aria-activedescendant names it, none while nothing active.',
      },
      {
        name: 'Expanded state follows the list',
        category: 'Semantics',
        requirement: 'AST-075 FR2',
        description:
          'listbox renders -> aria-expanded=true + aria-controls; else false + no reference.',
      },
      {
        name: 'Roles',
        category: 'Semantics',
        requirement: 'AST-075 FR3',
        description:
          'field = combobox + aria-autocomplete=list. listbox of options, aria-selected=true on active. you name field + listbox.',
      },
      {
        name: 'Keys',
        category: 'Keyboard',
        requirement: 'AST-075 FR4',
        description:
          'shown: ArrowDown/Up move (wrap), Enter picks active option then stops field Enter, Escape (any modifier) hides w/o closing enclosing dialog / popover same press. hidden: ArrowDown shows it w/ options. open field w/ no options still takes Escape (closes list): render an empty message while open. Home / End / other chords (Shift+Enter) / others reach field.',
      },
      {
        name: 'Input method',
        category: 'Keyboard',
        requirement: 'AST-075 FR5',
        description: 'no key moves / picks / hides during IME composition.',
      },
      {
        name: 'Pointer',
        category: 'Semantics',
        requirement: 'AST-075 FR6',
        description:
          'pointer move over option activates w/o focus move; press picks, field keeps focus.',
      },
      {
        name: 'Result count',
        category: 'Content',
        requirement: 'AST-075 FR7',
        description:
          'yours: compose useAnnounce (DEC-2), each new query announces count or none once, politely; none = the words the field shows.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useCombobox",
  "usage": {
    "description": "跟踪单选组合框的活动选项并处理其按键，同时 DOM 焦点保持在控件上。它为 Selector 和 CommandPalette 提供支持；当你需要构建这些组件未覆盖的组合框时可以使用它，包括基于你自己渲染的单行文本字段（例如搜索结果会替换页面区块的搜索字段，或对话框中的“添加人员”字段）。它不渲染任何内容：你负责渲染字段、列表框和选项，并将 `getFieldProps`、`getListboxProps` 和 `getOptionProps` 展开到它们上面；或者针对按钮这类控件，自行从 `onKeyDown` 和 `getItemId` 接线 `role`、`aria-expanded`、`aria-controls` 和 `aria-activedescendant`。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "使用 `id={getItemId(index)}` 渲染每个选项，并且仅在 `isOpen` 且 `highlightedIndex` 指向已渲染选项时设置控件的 `aria-activedescendant`，就像 CommandPalette 那样。"
      },
      {
        "guidance": true,
        "description": "对于没有搜索字段的输入预选，先运行 useTypeahead 的处理器，当其返回 false 时再落入此 `onKeyDown`，就像 Selector 那样。"
      },
      {
        "guidance": true,
        "description": "对于你自己渲染的字段，展开属性 getter，并在新查询改变选项时自行设置活动选项：选择第一个选项以便 Enter 选中它，或设为 -1 以便 Enter 保留给字段。"
      },
      {
        "guidance": true,
        "description": "当选项因新查询而变化时，通过 useAnnounce 播报结果数量（AST-075 DEC-2）。当没有任何匹配时，播报字段为此显示的词语。"
      },
      {
        "guidance": false,
        "description": "在列表框内渲染非选项控件（例如创建按钮或空消息）；请将它们渲染在列表框旁边。"
      },
      {
        "guidance": false,
        "description": "将 DOM 焦点移到选项上；活动选项通过 `aria-activedescendant` 播报，而焦点仍留在控件上。"
      }
    ],
    "accessibility": [
      {
        "name": "焦点留在字段中",
        "category": "Semantics",
        "criterion": "",
        "requirement": "AST-075 FR1",
        "description": "使用属性 getter 时，移动活动选项永远不会把焦点移出字段。字段通过 `aria-activedescendant` 命名活动选项，没有活动选项时不携带该属性。"
      },
      {
        "name": "展开状态跟随列表",
        "category": "Semantics",
        "criterion": "",
        "requirement": "AST-075 FR2",
        "description": "列表框渲染时，字段暴露 `aria-expanded=\"true\"` 和指向它的 `aria-controls`。否则暴露 `aria-expanded=\"false\"` 且不引用任何内容。"
      },
      {
        "name": "角色",
        "category": "Semantics",
        "criterion": "",
        "requirement": "AST-075 FR3",
        "description": "字段是 `combobox`，带 `aria-autocomplete=\"list\"`。列表是 `option` 的 `listbox`，活动项带 `aria-selected=\"true\"`。字段和列表框由你命名。"
      },
      {
        "name": "按键",
        "category": "Keyboard",
        "criterion": "",
        "requirement": "AST-075 FR4",
        "description": "列表显示时，ArrowDown 和 ArrowUp 移动活动选项并循环；Enter 选择活动选项，且仅在这种情况下阻止字段自身的 Enter；无论按住什么修饰键，Escape 都会隐藏列表，而不会在同一次按键中关闭外层对话框或弹出层。列表隐藏时，如果有选项，ArrowDown 会显示它。已打开但没有选项的字段仍会接收 Escape，它会关闭列表，因此打开时应渲染空消息。Home、End、Shift+Enter 等其他组合键以及所有其他按键都会传给字段。"
      },
      {
        "name": "输入法",
        "category": "Keyboard",
        "criterion": "",
        "requirement": "AST-075 FR5",
        "description": "输入法正在组合文本时，任何按键都不会移动、选择或隐藏内容。"
      },
      {
        "name": "指针",
        "category": "Semantics",
        "criterion": "",
        "requirement": "AST-075 FR6",
        "description": "指针移过选项会使其成为活动项而不移动焦点；按下选项会选择它，字段在按压期间保持焦点。"
      },
      {
        "name": "结果数量",
        "category": "Content",
        "criterion": "",
        "requirement": "AST-075 FR7",
        "description": "由你播报：组合 useAnnounce（AST-075 DEC-2），让每个新查询以礼貌方式播报一次选项数量，或播报没有选项。对于没有结果的情况，播报字段显示的词语。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "配置对象。",
    "options.selectableItems": "按渲染顺序排列的选项：`SelectorOptionData`，或任何具有字符串 `value` 和可选 `disabled` 的选项类型。带 `disabled` 的选项无法选择，在浏览打开的列表时会被跳过；从 `onKeyDown` 打开列表的 ArrowDown 或 ArrowUp 会落在选中的选项（若其已启用），否则落在第一个或最后一个已启用选项。",
    "options.isOpen": "是否显示列表。此状态由调用方持有。",
    "options.onOpen": "调用以显示列表。返回 `false` 可拒绝；此时 Hook 不会改动高亮。",
    "options.onClose": "Hook 隐藏列表时调用；Hook 会先重置高亮。当调用方自行关闭列表时（例如外部按压），还应调用 `setHighlightedIndex(-1)`。",
    "options.listboxId": "列表框元素的 id。选项 id 通过 `getItemId` 由此派生。",
    "options.value": "选中的值。打开列表时若其已启用则高亮它；否则 ArrowUp 在最后一个已启用选项上打开，ArrowDown、按压、Enter 或 Space 在第一个上打开。禁用选项在打开时永远不会高亮，没有已启用选项时也不会高亮任何项。",
    "options.onSelect": "以选中的值调用。选择也会关闭列表。",
    "options.onClear": "清除值。提供后，在关闭的控件上按 Delete 或 Backspace 会清除它，因此清除不仅限于指针。列表打开或使用 `hasSearch` 时忽略。",
    "options.hasSearch": "列表是否有自己的搜索字段。此时 Space 会输入而不是选择，通过按压或 Enter 打开时不会预高亮（ArrowDown 和 ArrowUp 仍会在选中、第一个或最后一个已启用选项上打开），关闭控件上的可打印按键会传给 `onSearchSeed`。",
    "options.onSearchSeed": "使用 `hasSearch` 时，接收控件聚焦时输入的每个可打印字符（Space 除外）；列表关闭时先打开列表，因此输入即查找无需单独的打开步骤。",
    "options.isDisabled": "控件是否忽略点击和按键。"
  },
  "returnDescriptions": {
    "highlightedIndex": "活动选项的索引，没有活动项时为 -1。使用 `hasSearch` 时，通过按压或 Enter 打开不会设置索引，因此 Hook 自行关闭列表后它仍为 -1；ArrowDown 和 ArrowUp 仍会在选中、第一个或最后一个已启用选项上打开。仅在它指向已渲染选项时，将其渲染为活动选项并在 `aria-activedescendant` 中命名它。",
    "setHighlightedIndex": "设置活动选项，例如来自改变选项的筛选器。",
    "getItemId": "要在 `index` 处选项上渲染的 id。将控件的 `aria-activedescendant` 设置为 `isOpen && highlightedIndex >= 0 && highlightedIndex < selectableItems.length ? getItemId(highlightedIndex) : undefined`，确保它永远不会命名不存在的选项，包括空列表。",
    "onTriggerClick": "通过按压控件切换列表。",
    "onKeyDown": "用于保持焦点的控件的按键处理器。ArrowDown 和 ArrowUp 打开列表或移动活动选项；Enter（以及无搜索时的 Space）选择它或打开列表；Escape 和 Tab 关闭它；Home、End、PageUp 和 PageDown 跳到第一个或最后一个选项。为光标保留 Home 和 End 的可编辑控件不会将它们传给此处理器，就像 CommandPalette 那样。",
    "onItemSelect": "通过按压选项来选择它，然后关闭列表。",
    "onItemMouseEnter": "使悬停的选项成为活动项，而不滚动列表或移动焦点。",
    "getFieldProps": "为你渲染的单行 `input` 准备的属性：`role=\"combobox\"`、`aria-expanded`、`aria-autocomplete=\"list\"`、仅在列表框渲染时（`isOpen` 且至少有一个选项）的 `aria-controls`、仅在选项活动时的 `aria-activedescendant`，以及字段的按键处理器。将自己的 `onKeyDown` 传到这里，而不是放在展开属性旁边：它会在 Hook 的处理器之后运行，除非该处理器已认领该按键；它还可以按其元素类型标注。",
    "getListboxProps": "为你渲染的列表框准备的属性，列表框可位于文档任意位置，包括页面流中：其 `id` 和 `role`，以及一个将焦点保持在字段中的按压处理器。在 `isOpen` 且存在选项时渲染它，并用 `aria-label` 或 `aria-labelledby` 命名它。",
    "getOptionProps": "为 `index` 处选项准备的属性：其 `id`、`role`、`aria-selected`（活动选项为 true）、禁用项上的 `aria-disabled`、使其成为活动项而不移动焦点的指针移动，以及选择它的按压。"
  }
};
