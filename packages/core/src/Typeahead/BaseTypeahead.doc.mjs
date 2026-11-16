// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Input',
    required: true,
    description:
      'Bare combobox input. The caller supplies its visible field chrome and accessible name.',
  },
  {
    name: 'Loading status',
    required: false,
    description:
      'Named Spinner shown beside the input while an asynchronous source is pending, unless a composed owner takes over the busy indicator lane.',
  },
  {
    name: 'Dropdown',
    required: false,
    description:
      'Anchored listbox surface containing current search or bootstrap results.',
  },
  {
    name: 'Empty state',
    required: false,
    description:
      'Disabled listbox option shown after a completed search returns no results.',
  },
  {
    name: 'Result group heading',
    required: false,
    description: 'Visible label for a group of result options.',
  },
  {
    name: 'Result row',
    required: false,
    description:
      'Option wrapper that owns highlight, selection, pointer, and keyboard behavior.',
  },
  {
    name: 'Default item content',
    required: false,
    description:
      'TypeaheadItem label and optional supporting content rendered inside a result row.',
  },
  {
    name: 'Caller-rendered item content',
    required: false,
    description:
      'Caller content supplied through renderItem or item.element inside the stable result row.',
  },
  {
    name: 'Menu content',
    required: false,
    description:
      'Caller content from menu.render: information around the result list in the listbox role, or the content of the dialog role.',
  },
  {
    name: 'Menu dialog',
    required: false,
    description:
      'The named dialog a dialog-role menu shows in the anchored layer; it takes focus and returns it on close.',
  },
  {
    name: 'Selected result state',
    required: false,
    description:
      'Selected row weight and trailing check shown when a result matches value.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'BaseTypeahead',
  subComponentOf: 'Typeahead',
  displayName: 'Base Typeahead',
  isHiddenFromOverview: true,
  description:
    'Composable combobox engine providing a bare input, search, keyboard navigation, and a styled result dropdown. It renders no input wrapper, border, or selected-value token. Typeahead and Tokenizer compose it for standard fields.',
  usage: {
    anatomy,
    description:
      'Composable combobox engine providing a bare input, search, keyboard navigation, and a styled result dropdown. It renders no input wrapper, border, or selected-value token. Typeahead and Tokenizer compose it for standard fields.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use Typeahead or Tokenizer for standard fields; they wrap BaseTypeahead with input chrome and selected-value rendering it intentionally omits.',
      },
      {
        guidance: true,
        description:
          'Provide your own visible label or aria-label and custom input wrapper so the bare combobox has an accessible name, focus treatment, border, and layout.',
      },
      {
        guidance: true,
        description:
          'Pass anchorRef pointing to your wrapper so the dropdown positions against your custom input chrome, not just the bare input element.',
      },
      {
        guidance: false,
        description:
          'Expect input chrome or selected-value rendering. BaseTypeahead is an engine; the caller owns those visible parts.',
      },
      {
        guidance: false,
        description:
          'Use BaseTypeahead when Typeahead or Tokenizer would suffice; the extra wrapper and styling work is only justified for truly custom compositions.',
      },
      {
        guidance: false,
        description:
          'Treat Escape as cancellation of pending source work. It hides the current popup, but a late response can reopen it.',
      },
    ],
  },
  props: [
    {
      name: 'searchSource',
      type: 'SearchSource<T>',
      description:
        'Data source providing search and bootstrap methods. `search(query, context)` may call `context.update(items)` to show matches it already has before it returns; the value it returns is the final list, and every list after the first for a query keeps the shown rows first and adds new rows after them.',
      required: true,
    },
    {
      name: 'value',
      type: 'T | null',
      description: 'Currently selected item.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(item: T | null) => void',
      description: 'Called when the selection changes.',
      required: true,
    },
    {
      name: 'renderItem',
      type: '(item: T) => ReactNode',
      description: 'Custom render function for dropdown items.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Input placeholder text.',
      default: "'Search…'",
    },
    {
      name: 'hasEntriesOnFocus',
      type: 'boolean',
      description: 'Show bootstrap results on focus before typing.',
      default: 'false',
    },
    {
      name: 'maxMenuItems',
      type: 'number',
      description: 'Maximum dropdown items to display.',
      default: '10',
    },
    {
      name: 'menuWidth',
      type: 'number',
      description:
        'Requested dropdown width in pixels before viewport clamping.',
    },
    {
      name: 'minQueryLength',
      type: 'number',
      description:
        'Minimum query length before the search source is queried. Below it no search runs and the menu stays closed.',
      default: '1',
    },
    {
      name: 'emptySearchText',
      type: 'ReactNode',
      description:
        'Content shown when the query matched nothing. Takes a ReactNode, so the dead end can carry a link or a create row. Announced in a polite live region as the text it renders, read from the DOM; aria-hidden parts stay out of both, and content that renders no text announces nothing. null counts as not given, like undefined, and falls through to the default; pass an empty string to render nothing.',
      default: "'No results found'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the input is disabled.',
      default: 'false',
    },
    {
      name: 'isFocusableDisabled',
      type: 'boolean',
      description:
        'Keep a disabled input focusable with aria-disabled and readOnly so a caller-owned disabled reason remains discoverable. It blocks text entry, opening the results and picking a result, also from results that were open before it applied; Escape or Tab still closes them.',
      default: 'false',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description: 'Auto-focus the input on mount.',
      default: 'false',
    },
    {
      name: 'debounceMs',
      type: 'number',
      description:
        'Debounce delay in ms before triggering search. Set to 0 for synchronous sources, and for a source that shows local matches through `context.update` and delays its own server request.',
      default: '150',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size used to scale dropdown option padding.',
      default: "'md'",
    },
    {
      name: 'anchorRef',
      type: 'RefObject<HTMLElement | null>',
      description:
        'Ref to the anchor element for dropdown positioning. If not provided, the input itself is used.',
    },
    {
      name: 'inputXStyle',
      type: 'StyleXStyles',
      description: 'Additional StyleX styles for the input element.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'Standard BaseProps StyleX styles applied to the input. Must be a stylex.create() value, not an inline style object.',
    },
    {
      name: 'inputTabIndex',
      type: 'number',
      description:
        'Legacy input-specific alias for native tabIndex. When provided, it takes precedence; otherwise native tabIndex is preserved.',
    },
    {
      name: 'onKeyDown',
      type: '(e: React.KeyboardEvent<HTMLInputElement>) => void',
      description:
        'Additional keydown handler called before internal keyboard navigation. Call e.preventDefault() to skip internal handling.',
    },
    {
      name: 'onChangeQuery',
      type: '(query: string) => void',
      description: 'Callback fired when the search query text changes.',
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description: 'Callback when the dropdown opens or closes.',
    },
    {
      name: 'menu',
      type: 'BaseTypeaheadMenu',
      description:
        "What the menu shows. role 'listbox' (default) is the result list; its optional render({listbox, query, isBusy, isEmptySearch, close}) places information such as a header or a hint around it, and anything a person acts on stays a result so the arrow keys reach it. role 'dialog' shows render({query, close}) in a dialog named by label that takes focus; Escape, an outside press or close() returns focus to where it was when the menu opened. Astryx owns the layer either way. Switching from listbox to dialog keeps the menu open: call handleRef.open() from onChange.",
    },
    {
      name: 'handleRef',
      type: 'React.Ref<BaseTypeaheadHandle>',
      description:
        'Imperative handle: open() opens the menu (a dialog at once; a listbox shows or loads its results) and close() closes it. There is no controlled open state; onOpenChange reports changes.',
    },
    {
      name: 'inputId',
      type: 'string',
      description:
        'Legacy input-specific alias for native id. When provided, it takes precedence; otherwise native id is preserved.',
    },
    {
      name: 'ariaDescribedBy',
      type: 'string',
      description:
        'Legacy input-specific alias for native aria-describedby. When provided, it takes precedence; otherwise the native attribute is preserved.',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string',
      description:
        'Legacy input-specific alias for native aria-labelledby. When provided, it takes precedence; otherwise the native attribute is preserved.',
    },
  ],
};

export const docsZh = {
  "name": "BaseTypeahead",
  "isHiddenFromOverview": true,
  "displayName": "Base Typeahead",
  "description": "可组合的 combobox 引擎，提供裸输入框、搜索、键盘导航和带样式的结果下拉列表。它不渲染输入框包装、边框或选中值令牌。Typeahead 和 Tokenizer 会组合它来提供标准字段。",
  "props": [
    {
      "name": "searchSource",
      "type": "SearchSource<T>",
      "description": "提供 search 和 bootstrap 方法的数据源。`search(query, context)` 可以调用 `context.update(items)` 在返回前显示它已有的匹配项；其返回值是最终列表，而查询产生第一个列表之后的每个列表都会保留已显示的行在前，并在其后追加新行。",
      "required": true
    },
    {
      "name": "value",
      "type": "T | null",
      "description": "当前选中的项。",
      "required": true
    },
    {
      "name": "onChange",
      "type": "(item: T | null) => void",
      "description": "选择变化时调用。",
      "required": true
    },
    {
      "name": "renderItem",
      "type": "(item: T) => ReactNode",
      "description": "下拉项的自定义渲染函数。"
    },
    {
      "name": "placeholder",
      "type": "string",
      "description": "输入框占位文本。",
      "default": "'Search…'"
    },
    {
      "name": "hasEntriesOnFocus",
      "type": "boolean",
      "description": "聚焦时在输入前显示引导结果。",
      "default": "false"
    },
    {
      "name": "maxMenuItems",
      "type": "number",
      "description": "显示的最大下拉项数。",
      "default": "10"
    },
    {
      "name": "menuWidth",
      "type": "number",
      "description": "在视口限制之前请求的下拉宽度（像素）。"
    },
    {
      "name": "minQueryLength",
      "type": "number",
      "description": "查询 search 数据源所需的最小查询长度。低于该长度时不运行搜索，菜单保持关闭。",
      "default": "1"
    },
    {
      "name": "emptySearchText",
      "type": "ReactNode",
      "description": "查询未匹配任何内容时显示的内容。接受 ReactNode，因此死胡同也可以携带链接或创建行。会作为其渲染的文本在礼貌实时区域中播报，文本从 DOM 读取；aria-hidden 部分不会出现在两者中，不渲染文本的内容不会播报任何内容。null 会被视为未提供，与 undefined 一样，并回退到默认值；传入空字符串可渲染为空。",
      "default": "'No results found'"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "输入框是否禁用。",
      "default": "false"
    },
    {
      "name": "isFocusableDisabled",
      "type": "boolean",
      "description": "通过 aria-disabled 和 readOnly 保持禁用输入框可聚焦，使调用方拥有的禁用原因仍可被发现。它会阻止文本输入、打开结果和选择结果，对在此状态应用前已打开的结果也有效；Escape 或 Tab 仍会关闭它们。",
      "default": "false"
    },
    {
      "name": "hasAutoFocus",
      "type": "boolean",
      "description": "挂载时自动聚焦输入框。",
      "default": "false"
    },
    {
      "name": "debounceMs",
      "type": "number",
      "description": "触发搜索前的防抖延迟（毫秒）。同步数据源请设为 0，对于通过 `context.update` 显示本地匹配并延迟自身服务器请求的数据源也请设为 0。",
      "default": "150"
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "description": "用于缩放下拉选项内边距的尺寸。",
      "default": "'md'"
    },
    {
      "name": "anchorRef",
      "type": "RefObject<HTMLElement | null>",
      "description": "用于下拉定位的锚点元素 ref。未提供时，会使用输入框本身。"
    },
    {
      "name": "inputXStyle",
      "type": "StyleXStyles",
      "description": "输入框元素的额外 StyleX 样式。"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "应用于输入框的标准 BaseProps StyleX 样式。必须是 `stylex.create()` 的值，不能是内联样式对象。"
    },
    {
      "name": "inputTabIndex",
      "type": "number",
      "description": "原生 tabIndex 的旧式输入框专用别名。提供时优先使用；否则保留原生 tabIndex。"
    },
    {
      "name": "onKeyDown",
      "type": "(e: React.KeyboardEvent<HTMLInputElement>) => void",
      "description": "在内部键盘导航之前调用的额外 keydown 处理函数。调用 e.preventDefault() 可跳过内部处理。"
    },
    {
      "name": "onChangeQuery",
      "type": "(query: string) => void",
      "description": "搜索查询文本变化时触发的回调。"
    },
    {
      "name": "onOpenChange",
      "type": "(isOpen: boolean) => void",
      "description": "下拉列表打开或关闭时的回调。"
    },
    {
      "name": "menu",
      "type": "BaseTypeaheadMenu",
      "description": "菜单显示的内容。role 'listbox'（默认）是结果列表；其可选的 render({listbox, query, isBusy, isEmptySearch, close}) 会在列表周围放置页眉或提示等信息，用户可操作的任何内容仍是结果，以便方向键能够到达。role 'dialog' 会在以 label 命名的对话框中显示 render({query, close})，该对话框获取焦点；Escape、外部按压或 close() 会将焦点返回到菜单打开时的位置。无论哪种方式，layer 都由 Astryx 管理。从 listbox 切换到 dialog 会保持菜单打开：请在 onChange 中调用 handleRef.open()。"
    },
    {
      "name": "handleRef",
      "type": "React.Ref<BaseTypeaheadHandle>",
      "description": "命令式句柄：open() 打开菜单（dialog 立即打开；listbox 显示或加载其结果），close() 关闭菜单。没有受控的打开状态；onOpenChange 报告变化。"
    },
    {
      "name": "inputId",
      "type": "string",
      "description": "原生 id 的旧式输入框专用别名。提供时优先使用；否则保留原生 id。"
    },
    {
      "name": "ariaDescribedBy",
      "type": "string",
      "description": "原生 aria-describedby 的旧式输入框专用别名。提供时优先使用；否则保留原生属性。"
    },
    {
      "name": "ariaLabelledBy",
      "type": "string",
      "description": "原生 aria-labelledby 的旧式输入框专用别名。提供时优先使用；否则保留原生属性。"
    }
  ],
  "usage": {
    "description": "可组合的 combobox 引擎，提供裸输入框、搜索、键盘导航和带样式的结果下拉列表。它不渲染输入框包装、边框或选中值令牌。Typeahead 和 Tokenizer 会组合它来提供标准字段。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "标准字段请使用 Typeahead 或 Tokenizer；它们为 BaseTypeahead 包裹了它有意省略的输入框外观和选中值渲染。"
      },
      {
        "guidance": true,
        "description": "提供自己的可见标签或 aria-label 以及自定义输入框包装，使这个裸 combobox 具有无障碍名称、焦点处理、边框和布局。"
      },
      {
        "guidance": true,
        "description": "传入指向包装元素的 anchorRef，使下拉列表相对于自定义输入框外观定位，而不仅仅是裸输入框元素。"
      },
      {
        "guidance": false,
        "description": "不要期望输入框外观或选中值渲染。BaseTypeahead 是引擎；调用方负责这些可见部分。"
      },
      {
        "guidance": false,
        "description": "不要在 Typeahead 或 Tokenizer 已足够时使用 BaseTypeahead；额外的包装和样式工作只有在真正自定义组合时才值得。"
      },
      {
        "guidance": false,
        "description": "不要将 Escape 视为对进行中数据源工作的取消。它会隐藏当前弹出层，但迟到的响应仍可能重新打开它。"
      }
    ],
    "anatomy": [
      {
        "name": "输入框",
        "required": true,
        "description": "裸 combobox 输入框。调用方提供其可见字段外观和无障碍名称。"
      },
      {
        "name": "加载状态",
        "required": false,
        "description": "异步数据源挂起时显示在输入框旁的具名 Spinner，除非组合方接管了忙碌指示器通道。"
      },
      {
        "name": "下拉列表",
        "required": false,
        "description": "包含当前搜索或引导结果的锚定 listbox 表面。"
      },
      {
        "name": "空状态",
        "required": false,
        "description": "搜索完成但没有结果后显示的禁用 listbox 选项。"
      },
      {
        "name": "结果组标题",
        "required": false,
        "description": "一组结果选项的可见标签。"
      },
      {
        "name": "结果行",
        "required": false,
        "description": "负责高亮、选择、指针和键盘行为的选项包装。"
      },
      {
        "name": "默认项内容",
        "required": false,
        "description": "在结果行内渲染的 TypeaheadItem 标签和可选辅助内容。"
      },
      {
        "name": "调用方渲染的项内容",
        "required": false,
        "description": "通过 renderItem 或 item.element 在稳定结果行内提供的调用方内容。"
      },
      {
        "name": "菜单内容",
        "required": false,
        "description": "来自 menu.render 的调用方内容：在 listbox 角色中围绕结果列表的信息，或 dialog 角色的内容。"
      },
      {
        "name": "菜单对话框",
        "required": false,
        "description": "dialog 角色菜单在锚定层中显示的具名对话框；它会获取焦点，并在关闭时归还焦点。"
      },
      {
        "name": "选中结果状态",
        "required": false,
        "description": "当某个结果与 value 匹配时显示的选中行字重和末尾勾选标记。"
      }
    ]
  },
  "propDescriptions": {
    "searchSource": "提供 search 和 bootstrap 方法的数据源。`search(query, context)` 可以调用 `context.update(items)` 在返回前显示它已有的匹配项；其返回值是最终列表，而查询产生第一个列表之后的每个列表都会保留已显示的行在前，并在其后追加新行。",
    "value": "当前选中的项。",
    "onChange": "选择变化时调用。",
    "renderItem": "下拉项的自定义渲染函数。",
    "placeholder": "输入框占位文本。",
    "hasEntriesOnFocus": "聚焦时在输入前显示引导结果。",
    "maxMenuItems": "显示的最大下拉项数。",
    "menuWidth": "在视口限制之前请求的下拉宽度（像素）。",
    "minQueryLength": "查询 search 数据源所需的最小查询长度。低于该长度时不运行搜索，菜单保持关闭。",
    "emptySearchText": "查询未匹配任何内容时显示的内容。接受 ReactNode，因此死胡同也可以携带链接或创建行。会作为其渲染的文本在礼貌实时区域中播报，文本从 DOM 读取；aria-hidden 部分不会出现在两者中，不渲染文本的内容不会播报任何内容。null 会被视为未提供，与 undefined 一样，并回退到默认值；传入空字符串可渲染为空。",
    "isDisabled": "输入框是否禁用。",
    "isFocusableDisabled": "通过 aria-disabled 和 readOnly 保持禁用输入框可聚焦，使调用方拥有的禁用原因仍可被发现。它会阻止文本输入、打开结果和选择结果，对在此状态应用前已打开的结果也有效；Escape 或 Tab 仍会关闭它们。",
    "hasAutoFocus": "挂载时自动聚焦输入框。",
    "debounceMs": "触发搜索前的防抖延迟（毫秒）。同步数据源请设为 0，对于通过 `context.update` 显示本地匹配并延迟自身服务器请求的数据源也请设为 0。",
    "size": "用于缩放下拉选项内边距的尺寸。",
    "anchorRef": "用于下拉定位的锚点元素 ref。未提供时，会使用输入框本身。",
    "inputXStyle": "输入框元素的额外 StyleX 样式。",
    "xstyle": "应用于输入框的标准 BaseProps StyleX 样式。必须是 `stylex.create()` 的值，不能是内联样式对象。",
    "inputTabIndex": "原生 tabIndex 的旧式输入框专用别名。提供时优先使用；否则保留原生 tabIndex。",
    "onKeyDown": "在内部键盘导航之前调用的额外 keydown 处理函数。调用 e.preventDefault() 可跳过内部处理。",
    "onChangeQuery": "搜索查询文本变化时触发的回调。",
    "onOpenChange": "下拉列表打开或关闭时的回调。",
    "menu": "菜单显示的内容。role 'listbox'（默认）是结果列表；其可选的 render({listbox, query, isBusy, isEmptySearch, close}) 会在列表周围放置页眉或提示等信息，用户可操作的任何内容仍是结果，以便方向键能够到达。role 'dialog' 会在以 label 命名的对话框中显示 render({query, close})，该对话框获取焦点；Escape、外部按压或 close() 会将焦点返回到菜单打开时的位置。无论哪种方式，layer 都由 Astryx 管理。从 listbox 切换到 dialog 会保持菜单打开：请在 onChange 中调用 handleRef.open()。",
    "handleRef": "命令式句柄：open() 打开菜单（dialog 立即打开；listbox 显示或加载其结果），close() 关闭菜单。没有受控的打开状态；onOpenChange 报告变化。",
    "inputId": "原生 id 的旧式输入框专用别名。提供时优先使用；否则保留原生 id。",
    "ariaDescribedBy": "原生 aria-describedby 的旧式输入框专用别名。提供时优先使用；否则保留原生属性。",
    "ariaLabelledBy": "原生 aria-labelledby 的旧式输入框专用别名。提供时优先使用；否则保留原生属性。"
  }
};

export const docsDense = {
  name: 'BaseTypeahead',
  isHiddenFromOverview: true,
  displayName: 'Base Typeahead',
  description:
    'Composable combobox engine providing a bare input and a styled result dropdown. Callers own input chrome and selected-value presentation.',
  usage: {
    bestPractices: [
      {
        guidance: true,
        description:
          'Use Typeahead or Tokenizer for standard fields; they add the input chrome and selected-value rendering BaseTypeahead omits.',
      },
      {
        guidance: true,
        description:
          'Provide a visible label or aria-label plus a custom wrapper with focus treatment, border, and layout.',
      },
      {
        guidance: true,
        description:
          'Pass anchorRef to your wrapper so the dropdown positions against your input chrome, not the bare input.',
      },
      {
        guidance: false,
        description:
          'Expect input chrome or selected-value rendering. The caller owns those visible parts.',
      },
      {
        guidance: false,
        description:
          'Use BaseTypeahead when Typeahead or Tokenizer suffice; extra work only pays off for custom compositions.',
      },
      {
        guidance: false,
        description:
          'Treat Escape as pending-work cancellation. It hides the popup, but a late response can reopen it.',
      },
    ],
  },
  propDescriptions: {
    searchSource: 'Data source w/ search+bootstrap methods.',
    value: 'Currently selected item.',
    onChange: 'Fired on selection change.',
    renderItem: 'Custom dropdown item render.',
    placeholder: 'Input placeholder.',
    hasEntriesOnFocus: 'Bootstrap results on focus.',
    maxMenuItems: 'Max dropdown items.',
    menuWidth: 'Requested px width before viewport clamping.',
    minQueryLength:
      'Min query length before searching. Menu stays closed below it.',
    emptySearchText: 'Content when the query matched nothing. ReactNode.',
    isDisabled: 'Whether input disabled.',
    isFocusableDisabled:
      'Keeps disabled input focusable; blocks text entry, opening and picking, also from an already-open list (Escape/Tab close it).',
    hasAutoFocus: 'Auto-focus on mount.',
    debounceMs: 'Search debounce ms. 0 for sync.',
    size: 'Dropdown option padding size.',
    anchorRef: 'Anchor for dropdown positioning. Defaults to input.',
    inputXStyle: 'Additional StyleX styles for input.',
    xstyle: 'Standard BaseProps StyleX styles for input.',
    inputTabIndex:
      'Legacy tabIndex alias; defined alias wins, otherwise native tabIndex passes through.',
    onKeyDown:
      'Keydown before internal nav. preventDefault() skips internal handling.',
    onChangeQuery: 'Fired on query text change.',
    onOpenChange: 'Fired on dropdown open/close.',
    menu: "Menu content: {role:'listbox', render?({listbox,query,isBusy,isEmptySearch,close})} (info around the list; actions stay results) | {role:'dialog', label, render({query,close})} (takes focus; close returns focus to opener, else input). Astryx owns the layer. open() from onChange keeps it open across a role switch.",
    handleRef:
      'Handle: open(), close(). No controlled isOpen; onOpenChange reports.',
    inputId:
      'Legacy id alias; defined alias wins, otherwise native id passes through.',
    ariaDescribedBy:
      'Legacy aria-describedby alias; defined alias wins, otherwise native attribute passes through.',
    ariaLabelledBy:
      'Legacy aria-labelledby alias; defined alias wins, otherwise native attribute passes through.',
  },
};
