// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Field',
    required: false,
    description:
      'Standalone Field shell that provides the label and optional supporting content; omitted inside InputGroup.',
  },
  {
    name: 'Input surface',
    required: true,
    description:
      'Painted control surface containing the editable input or the selected token.',
  },
  {
    name: 'Icon-rendered start icon',
    required: false,
    description:
      'Optional leading semantic icon or icon component rendered through Icon.',
  },
  {
    name: 'Caller-rendered start content',
    required: false,
    description:
      'Optional arbitrary React content rendered directly at the start of the input surface.',
  },
  {
    name: 'Selected token',
    required: false,
    description:
      'Token that presents the selected item while the control is not in edit mode.',
  },
  {
    name: 'Spinner',
    required: false,
    description:
      'Loading indicator shown at the end of the input surface while a search is in flight.',
  },
  {
    name: 'Clear button',
    required: false,
    description:
      'Shared clear action that removes the selected item when hasClear is enabled.',
  },
  {
    name: 'Dropdown',
    required: false,
    description:
      'Anchored listbox surface containing the current search results.',
  },
  {
    name: 'Empty state',
    required: false,
    description: 'Message shown after a completed search returns no results.',
  },
  {
    name: 'Result row',
    required: false,
    description:
      'Stable option wrapper that owns highlight, selection, pointer, and keyboard behavior.',
  },
  {
    name: 'Default item content',
    required: false,
    description:
      'Standard TypeaheadItem label and supporting content rendered inside a result row when renderItem and item.element are absent.',
  },
  {
    name: 'Caller-rendered item content',
    required: false,
    description:
      'Caller-owned result content supplied through renderItem or item.element inside the stable result row.',
  },
  {
    name: 'Result group heading',
    required: false,
    description: 'Visible heading for a labeled group of result rows.',
  },
  {
    name: 'Selected result state',
    required: false,
    description:
      'Selected styling and trailing check presented on the current result row.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Typeahead',
  displayName: 'Typeahead',
  group: 'Typeahead',
  category: 'Form Controls',
  keywords: [
    'typeahead',
    'autocomplete',
    'combobox',
    'searchbox',
    'autosuggest',
    'select',
    'dropdown',
    'lookup',
    'searchable',
    'suggestion',
    'picker',
  ],
  description:
    'Styled typeahead with label, description, validation, and all field features. Wraps BaseTypeahead with Field for the primary use case.',
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the input.',
      required: true,
    },
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
      description: 'Currently selected item, or null if nothing is selected.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(item: T | null) => void',
      description: 'Called when the selection changes.',
      required: true,
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Input placeholder text.',
    },
    {
      name: 'hasEntriesOnFocus',
      type: 'boolean',
      description: 'Show bootstrap results on focus before typing.',
      default: 'false',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description: 'Show clear button to deselect the current value.',
      default: 'true',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Disables the input. The field keeps its tab stop: it is announced as disabled (aria-disabled), is read-only, and opens and picks nothing.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the input is disabled. With isDisabled, shows a tooltip on hover/keyboard focus, and the reason describes the field (activation stays blocked). Use this instead of wrapping a disabled Typeahead in Tooltip, so the reason is attached to the field itself.',
    },
    {
      name: 'maxMenuItems',
      type: 'number',
      description: 'Maximum number of dropdown items to display.',
      default: '10',
    },
    {
      name: 'minQueryLength',
      type: 'number',
      description:
        'Minimum query length before the search source is queried. Below it no search runs and the menu stays closed.',
      default: '1',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description:
        'Validation status object with type and message for error/warning/success states.',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description:
        'How the status message is placed relative to the input. attached overlaps directly below the input (bordered treatment); detached floats below as a separate element with spacing; tooltip reveals the message in an info-tip button.',
      default: "'attached'",
    },
    {
      name: 'renderItem',
      type: '(item: T) => ReactNode',
      description:
        'Custom render function for dropdown items. Default renders TypeaheadItem.',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Visually hides the label while keeping it accessible.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Helper text displayed below the label.',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Marks the field as required.',
      default: 'false',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: 'Shows an optional indicator on the label.',
      default: 'false',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: 'Tooltip text shown on the label.',
    },
    {
      name: 'emptySearchText',
      type: 'ReactNode',
      description:
        'Content shown when the query matched nothing. Takes a ReactNode, so the dead end can carry a link or a create row. Announced in a polite live region as the text it renders, read from the DOM; aria-hidden parts stay out of both, and content that renders no text announces nothing. null counts as not given, like undefined, and falls through to the default; pass an empty string to render nothing.',
      default: "'No results found'",
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description: 'Auto-focus the input on mount.',
      default: 'false',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Input and token size.',
      default: "'md'",
    },
    {
      name: 'debounceMs',
      type: 'number',
      description:
        'Debounce delay in ms before triggering search. Set to 0 for synchronous sources, and for a source that shows local matches through `context.update` and delays its own server request.',
      default: '150',
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
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
    },
    {
      name: 'startIcon',
      type: 'IconType | ReactNode',
      description: 'SVG icon component displayed at the start of the input.',
    },
    {
      name: 'containerXstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for the field container (label, control, and status together). No effect inside InputGroup (style the InputGroup instead) or in a `horizontal-labels` FormLayout. Root `xstyle`, `className`, and `style` are not accepted.',
    },
    {
      name: 'containerClassName',
      type: 'string',
      description:
        'Class name for the field container. Same targeting as `containerXstyle`.',
    },
    {
      name: 'containerStyle',
      type: 'CSSProperties',
      description:
        'Inline styles for the field container. Same targeting as `containerXstyle`.',
    },
    {
      name: 'controlXstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for the visual control box: the element that paints the border and background and holds icons and end controls. Never the native input.',
    },
    {
      name: 'controlClassName',
      type: 'string',
      description: 'Class name for the visual control box.',
    },
    {
      name: 'controlStyle',
      type: 'CSSProperties',
      description: 'Inline styles for the visual control box.',
    },
  ],
  components: [{name: 'BaseTypeahead'}, {name: 'TypeaheadItem'}],
  theming: {
    targets: [
      {className: 'astryx-typeahead', visualProps: ['status', 'size']},
      {className: 'astryx-typeahead-dropdown'},
      {className: 'astryx-typeahead-empty-state'},
      {className: 'astryx-typeahead-item'},
    ],
  },
  usage: {
    anatomy,
    description:
      'A searchable input for selecting a single item from a large or dynamic dataset. Results appear as the user types, with support for async data sources, debounced search, and custom item rendering. Use it when the option list is too large for a Selector dropdown.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide descriptive placeholder text that hints at what users can search for.',
      },
      {
        guidance: true,
        description:
          'Show suggestions on focus when users benefit from seeing popular or recent options before typing.',
      },
      {
        guidance: true,
        description:
          'Add a search delay for remote data sources to avoid excessive network requests.',
      },
      {
        guidance: true,
        description:
          'For a remote source, show the matches the page already has at once: call `context.update(local)` in `search`, pass `debounceMs={0}`, delay the server request in the source, and return the server answer with the shown rows first.',
      },
      {
        guidance: true,
        description:
          'Use inside InputGroup when the typeahead needs a single-line prefix or suffix addon.',
      },
      {
        guidance: false,
        description:
          'Use for short, static option lists; use Selector for better discoverability.',
      },
      {
        guidance: false,
        description: 'Use for multi-selection; use Tokenizer instead.',
      },
      {
        guidance: false,
        description:
          'Place multiple Typeaheads adjacent to each other without clear labels differentiating them.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled Typeahead in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "用于从大型或动态数据集中选择单个条目的可搜索输入框。结果随用户键入出现，支持异步数据源、防抖搜索和自定义条目渲染。当选项列表对 Selector 下拉菜单来说过大时使用它。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "提供描述性的占位文本，提示用户可以搜索什么。"
      },
      {
        "guidance": true,
        "description": "当用户在键入前看到热门或最近选项会有帮助时，在聚焦时显示建议。"
      },
      {
        "guidance": true,
        "description": "为远程数据源添加搜索延迟，避免过多的网络请求。"
      },
      {
        "guidance": true,
        "description": "对于远程数据源，立即显示页面已有的匹配项：在 `search` 中调用 `context.update(local)`，传入 `debounceMs={0}`，在 source 中延迟服务器请求，并在返回服务器结果时将已显示的行放在最前面。"
      },
      {
        "guidance": true,
        "description": "当 typeahead 需要单行前缀或后缀附加项时，在 InputGroup 内使用。"
      },
      {
        "guidance": false,
        "description": "不要用于简短、静态的选项列表；请使用 Selector 获得更好的可发现性。"
      },
      {
        "guidance": false,
        "description": "不要用于多选；请改用 Tokenizer。"
      },
      {
        "guidance": false,
        "description": "不要在相邻位置放置多个没有清晰标签区分的 Typeahead。"
      },
      {
        "guidance": false,
        "description": "不要用 Tooltip 包裹禁用的 Typeahead 来解释其禁用原因；禁用触发器会吞掉包装器所需的悬停事件。请改用 disabledMessage 属性。"
      }
    ],
    "anatomy": [
      {
        "name": "字段",
        "required": false,
        "description": "独立的 Field 外壳，提供标签和可选支持内容；在 InputGroup 内省略。"
      },
      {
        "name": "输入表面",
        "required": true,
        "description": "绘制出来的控件表面，包含可编辑输入框或已选令牌。"
      },
      {
        "name": "图标渲染的起始图标",
        "required": false,
        "description": "通过 Icon 渲染的可选前置语义图标或图标组件。"
      },
      {
        "name": "调用方渲染的起始内容",
        "required": false,
        "description": "直接在输入表面起始处渲染的可选任意 React 内容。"
      },
      {
        "name": "已选令牌",
        "required": false,
        "description": "在控件不处于编辑模式时呈现所选条目的令牌。"
      },
      {
        "name": "加载旋转图标",
        "required": false,
        "description": "搜索进行时显示在输入表面末端的加载指示器。"
      },
      {
        "name": "清除按钮",
        "required": false,
        "description": "共享的清除操作，在启用 hasClear 时移除所选条目。"
      },
      {
        "name": "下拉菜单",
        "required": false,
        "description": "包含当前搜索结果、带锚点的列表框表面。"
      },
      {
        "name": "空状态",
        "required": false,
        "description": "搜索完成但没有结果后显示的消息。"
      },
      {
        "name": "结果行",
        "required": false,
        "description": "稳定的选项包装元素，拥有高亮、选中、指针和键盘行为。"
      },
      {
        "name": "默认条目内容",
        "required": false,
        "description": "当 renderItem 和 item.element 都不存在时，在结果行内渲染的标准 TypeaheadItem 标签和支持内容。"
      },
      {
        "name": "调用方渲染的条目内容",
        "required": false,
        "description": "通过 renderItem 或 item.element 在稳定结果行内提供的调用方拥有的结果内容。"
      },
      {
        "name": "结果组标题",
        "required": false,
        "description": "带标签的结果行组的可见标题。"
      },
      {
        "name": "已选结果状态",
        "required": false,
        "description": "在当前结果行上呈现的选中样式和末尾勾选标记。"
      }
    ]
  },
  "name": "Typeahead",
  "description": "带标签、描述、校验和全部字段功能的样式化 typeahead。为主用例用 Field 包裹 BaseTypeahead。",
  "propDescriptions": {
    "label": "输入框的无障碍标签。",
    "searchSource": "提供 search 和 bootstrap 方法的数据源。`search(query, context)` 可以调用 `context.update(items)`，在返回前显示它已有的匹配项；其返回值是最终列表，而某个查询在第一次之后返回的每个列表都会把已显示的行放在最前面，并在其后添加新行。",
    "value": "当前选中的条目，未选中任何内容时为 null。",
    "onChange": "选择变化时调用。",
    "placeholder": "输入框占位文本。",
    "hasEntriesOnFocus": "在聚焦时、键入之前显示 bootstrap 结果。",
    "hasClear": "显示清除按钮以取消选择当前值。",
    "isDisabled": "禁用输入框。字段保留其 Tab 停靠点：它被宣布为禁用（aria-disabled），为只读，并且不会打开或选择任何内容。",
    "disabledMessage": "解释输入框为何禁用。与 isDisabled 一起使用时，在悬停/键盘聚焦时显示工具提示，原因会描述该字段（激活仍被阻止）。请使用它而不是用 Tooltip 包裹禁用的 Typeahead，使原因附加到字段本身。",
    "maxMenuItems": "下拉菜单中显示的最大条目数。",
    "minQueryLength": "查询 searchSource 之前的最小查询长度。低于此值不会运行搜索，菜单保持关闭。",
    "status": "包含 type 和 message 的校验状态对象，用于错误/警告/成功状态。",
    "statusVariant": "状态消息相对于输入框的放置方式。attached 直接重叠在输入框下方（带边框处理）；detached 作为独立元素在下方浮动并留有间距；tooltip 在信息提示按钮中显示消息。",
    "renderItem": "下拉条目的自定义渲染函数。默认渲染 TypeaheadItem。",
    "isLabelHidden": "视觉上隐藏标签，同时保持其可访问。",
    "description": "显示在标签下方的辅助文本。",
    "isRequired": "将字段标记为必填。",
    "isOptional": "在标签上显示可选指示器。",
    "labelTooltip": "在标签上显示的工具提示文本。",
    "emptySearchText": "查询未匹配任何内容时显示的内容。接受 ReactNode，因此死路可以带有链接或创建行。会作为其渲染的文本在礼貌的实时区域中宣布，从 DOM 读取；aria-hidden 部分不会出现在两者中，不渲染文本的内容不会宣布任何内容。null 与 undefined 一样视为未提供，会回退到默认值；传入空字符串以不渲染任何内容。",
    "hasAutoFocus": "挂载时自动聚焦输入框。",
    "size": "输入框和令牌的尺寸。",
    "debounceMs": "触发搜索前的防抖延迟（毫秒）。对于同步数据源，以及通过 `context.update` 显示本地匹配并延迟自身服务器请求的数据源，设为 0。",
    "onChangeQuery": "搜索查询文本变化时触发的回调。",
    "onOpenChange": "下拉菜单打开或关闭时的回调。",
    "menu": "菜单显示的内容。role 'listbox'（默认）是结果列表；其可选 render({listbox, query, isBusy, isEmptySearch, close}) 在结果列表周围放置页眉或提示等信息，人员可操作的任何内容仍是结果，以便方向键能到达它。role 'dialog' 在由 label 命名的对话框中显示 render({query, close}) 并获取焦点；Escape、外部按压或 close() 会将焦点返回到菜单打开时的位置。无论哪种方式，Astryx 都拥有该层。从 listbox 切换到 dialog 会保持菜单打开：在 onChange 中调用 handleRef.open()。",
    "handleRef": "命令式句柄：open() 打开菜单（dialog 立即打开；listbox 显示或加载其结果），close() 关闭它。没有受控的打开状态；onOpenChange 报告变化。",
    "width": "字段的宽度（数字 = 像素，字符串按原样使用，例如 \"100%\"）。调整整个字段（标签、控件和状态）的尺寸，使它们保持对齐。",
    "startIcon": "显示在输入框起始处的 SVG 图标组件。",
    "containerXstyle": "用于字段容器（标签、控件和状态一起）的 StyleX 样式。在 InputGroup 内（请改为为 InputGroup 设置样式）或 `horizontal-labels` FormLayout 中无效。不接受根级 `xstyle`、`className` 和 `style`。",
    "containerClassName": "字段容器的类名。目标与 `containerXstyle` 相同。",
    "containerStyle": "字段容器的内联样式。目标与 `containerXstyle` 相同。",
    "controlXstyle": "用于视觉控件盒子的 StyleX 样式：绘制边框和背景并包含图标和末端控件的元素。绝不是原生输入框。",
    "controlClassName": "视觉控件盒子的类名。",
    "controlStyle": "视觉控件盒子的内联样式。"
  },
  "components": [
    {
      "name": "BaseTypeahead",
      "description": ""
    },
    {
      "name": "TypeaheadItem",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Searchable dropdown for single-item selection w/ keyboard navigation. Supports async+sync search via searchSource interface.',
  usage: {
    description:
      'A searchable input for selecting a single item from a large or dynamic dataset. Results appear as the user types, with support for async data sources, debounced search, and custom item rendering. Use it when the option list is too large for a Selector dropdown.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide descriptive placeholder text that hints at what users can search for.',
      },
      {
        guidance: true,
        description:
          'Show suggestions on focus when users benefit from seeing popular or recent options before typing.',
      },
      {
        guidance: true,
        description:
          'Add a search delay for remote data sources to avoid excessive network requests.',
      },
      {
        guidance: true,
        description:
          'For a remote source, show the matches the page already has at once: call `context.update(local)` in `search`, pass `debounceMs={0}`, delay the server request in the source, and return the server answer with the shown rows first.',
      },
      {
        guidance: true,
        description:
          'Use inside InputGroup when the typeahead needs a single-line prefix or suffix addon.',
      },
      {
        guidance: false,
        description:
          'Use for short, static option lists; use Selector for better discoverability.',
      },
      {
        guidance: false,
        description: 'Use for multi-selection; use Tokenizer instead.',
      },
      {
        guidance: false,
        description:
          'Place multiple Typeaheads adjacent to each other without clear labels differentiating them.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled Typeahead in Tooltip to explain why it is disabled; disabled triggers swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
};
