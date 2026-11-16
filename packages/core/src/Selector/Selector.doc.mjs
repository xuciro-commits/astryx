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
    name: 'Trigger',
    required: true,
    description:
      'Painted control that displays the current selection or placeholder and opens the selection surface when editable.',
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
      'Optional arbitrary React content rendered directly at the start of the trigger.',
  },
  {
    name: 'Trigger clear button',
    required: false,
    description:
      'Shared clear action that removes the selected value when hasClear is enabled.',
  },
  {
    name: 'Status icon',
    required: false,
    description:
      'Status glyph shown in place of the disclosure indicator for attached or tooltip status.',
  },
  {
    name: 'Indicator icon',
    required: false,
    description:
      'Trailing chevron shown when status presentation does not replace it; reflects collapsed or expanded state.',
  },
  {
    name: 'Search row',
    required: false,
    description:
      'Panel header with a borderless search input and optional clear action.',
  },
  {
    name: 'Search icon',
    required: false,
    description:
      'Leading magnifier rendered through Icon inside the search row.',
  },
  {
    name: 'Search clear button',
    required: false,
    description:
      'Shared clear action shown in the search row while a query is present.',
  },
  {
    name: 'Option row',
    required: false,
    description: 'Selectable row for one supplied option.',
  },
  {
    name: 'SelectorOption-rendered content',
    required: false,
    description:
      'Option content rendered with SelectorOption, either by the default renderer or by renderOption when it returns SelectorOption.',
  },
  {
    name: 'Bare caller-rendered option content',
    required: false,
    description:
      'Arbitrary content returned directly by renderOption without opting into SelectorOption.',
  },
  {
    name: 'Option selection indicator',
    required: false,
    description:
      'Resolved selection mark rendered for each option in its checked or unchecked state. Its layout space collapses when the resolved indicator draws nothing.',
  },
  {
    name: 'Option divider',
    required: false,
    description:
      'Divider supplied in the public options data to separate adjacent option groups.',
  },
  {
    name: 'Section heading',
    required: false,
    description: 'Visible heading for a labeled group of option rows.',
  },
  {
    name: 'Empty state',
    required: false,
    description:
      'Message shown when the shared panel content has no options or no search matches.',
  },
  {
    name: 'Pointer popup',
    required: false,
    description:
      'Anchored painted surface that hosts the shared panel content for popover presentation.',
  },
  {
    name: 'Touch sheet heading',
    required: false,
    description:
      'Heading above the shared panel content in bottom-sheet presentation.',
  },
  {
    name: 'Touch sheet',
    required: false,
    description:
      'BottomSheet surface that hosts the same panel content for bottom-sheet presentation.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Selector',
  displayName: 'Selector',
  group: 'Selector',
  category: 'Form Controls',
  keywords: [
    'selector',
    'select',
    'dropdown',
    'combobox',
    'picker',
    'listbox',
    'chooser',
    'autocomplete',
    'option',
    'selectmenu',
  ],
  theming: {
    targets: [
      {
        className: 'astryx-selector',
        visualProps: ['variant', 'size', 'status'],
        states: ['disabled', 'readonly'],
      },
      {className: 'astryx-selector-option'},
      {
        className: 'astryx-selector-option-row',
        visualProps: ['size'],
        states: ['selected', 'disabled'],
      },
      {className: 'astryx-selector-search'},
      {className: 'astryx-selector-section-heading'},
      {className: 'astryx-selector-empty-state'},
      {className: 'astryx-selector-indicator-icon', states: ['state']},
      {className: 'astryx-selector-check'},
      {className: 'astryx-selector-popup'},
    ],
  },
  description: 'Dropdown selector for choosing from a list of options.',
  playground: {
    defaults: {
      label: 'Fruit',
      options: [
        {value: 'apple', label: 'Apple'},
        {value: 'orange', label: 'Orange'},
        {value: 'banana', label: 'Banana'},
      ],
    },
  },
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Label text for accessibility.',
      required: true,
    },
    {
      name: 'options',
      type: 'SelectorOption[]',
      description:
        'Array of items: strings, objects with value/label/description/icon/disabled, dividers ({type: "divider"}), or sections ({type: "section", title, options}).',
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: 'Currently selected value.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Callback fired when the selection changes.',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description:
        'Shows a clear (×) button when a value is selected. When true, onChange also accepts null to signal the user cleared the selection.',
      default: 'false',
    },
    {
      name: 'hasSearch',
      type: 'boolean',
      description:
        'Whether to show a search input for filtering options. As the user types, the match count (or "No results found") is announced to screen readers via a polite live region. The search field has built-in affordances: a leading magnifier icon and, once a query is typed, a trailing clear (✕) button that resets the query and returns focus to the input.',
      default: 'false',
    },
    {
      name: 'searchPlaceholder',
      type: 'string',
      description: 'Placeholder text for the search input.',
      default: "'Search...'",
    },
    {
      name: 'emptyText',
      type: 'ReactNode',
      description:
        'Content shown in the dropdown panel when there are no options to show, and announced in a polite live region when the panel opens. The announcement is the text this content renders, read from the DOM, so an element is announced as written and aria-hidden parts are left out of both. Not shown while isLoading.',
      default: "'No options'",
    },
    {
      name: 'emptySearchText',
      type: 'ReactNode',
      description:
        'Content shown in the dropdown panel when a search query matches no options, and announced in a polite live region at the same time. The announcement is the text this content renders, read from the DOM, so an element is announced as written and aria-hidden parts are left out of both.',
      default: "'No results found'",
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text shown when no value is selected.',
      default: "'Select...'",
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size variant for the selector.',
      default: "'md'",
    },
    {
      name: 'variant',
      type: "'input' | 'secondary' | 'ghost'",
      description:
        'Visual trigger style. input is the bordered input treatment for forms; secondary matches the secondary buttons of the active theme (borderless and neutral-filled by default) for navs and toolbars; ghost is borderless and transparent, matching ghost buttons for toolbar usage.',
      default: "'input'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disables the selector.',
      default: 'false',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description:
        'Makes the selector read-only: the selected value stays visible, focusable, and included in form submission, and retains its combobox identity with aria-readonly. The selection surface, clear action, and disclosure indicator are removed. Unlike isDisabled, the control is not dimmed. isDisabled takes precedence when both are set.',
      default: 'false',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        'The HTML name attribute for form submissions. Renders a hidden input carrying the selected value, like a native select.',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the selector is disabled. With isDisabled, shows the reason as a tooltip on hover and keyboard focus of the trigger, which stays focusable (aria-disabled) like every disabled selector; activation stays blocked. Use this instead of wrapping a disabled Selector in Tooltip.',
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
      name: 'isOptional',
      type: 'boolean',
      description: 'Marks the field as optional.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Marks the field as required.',
      default: 'false',
    },
    {
      name: 'status',
      type: "{type: 'error' | 'warning' | 'success', message?: string}",
      description: 'Validation status with an optional message.',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description:
        'How the status message is placed relative to the input. attached overlaps directly below the bordered input and is only valid for the input variant; secondary and ghost selectors detach attached status messages by default. Use tooltip for compact toolbar controls.',
      default:
        "'attached' for input selectors; 'detached' for secondary and ghost selectors",
    },
    {
      name: 'renderOption',
      type: '(option: SelectorOptionData) => ReactNode',
      description:
        'Custom render function for each selectable option in the dropdown. Use this instead of JSX children; dividers and sections are rendered by the selector.',
    },
    {
      name: 'renderValue',
      type: '(option: SelectorOptionData) => ReactNode',
      description:
        'Custom render function for the selected option inside the closed trigger. A one-line value follows the active size token, including compact or wide spacing scales with icons or a clear control. Padding accommodates the trigger line box, and each extra line grows the control by one line (28/32/36 for one line and 48/52/56 for two with the default tokens). Content inherits the trigger line height; content that sets a larger font should set its own line height so the trigger grows to fit it. Inside an InputGroup the group owns the row height: a SelectorOption folds onto one line and ellipsizes, and any taller node is cut off at the row.',
    },
    {
      name: 'indicatorPosition',
      type: "'start' | 'end'",
      description:
        'Which logical edge of the option row carries a rendered selection mark. An empty mark consumes no space, so selected and unselected labels may shift or have different available width. end is the house convention shared with Typeahead and CommandPalette.',
      default: "'end'",
    },
    {
      name: 'presentation',
      type: "'popover' | 'bottom-sheet' | 'adaptive'",
      description:
        'How the option list is presented. adaptive uses a bottom sheet on compact touch screens and an anchored popover otherwise.',
      default: "'popover'",
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned. Without a width the field follows its displayed value and can shrink with its row (the value truncates) instead of overflowing it; use `<HStack wrap="wrap">` for filter bars so selectors move to a second line on phones.',
    },
    {
      name: 'startIcon',
      type: 'IconType | ReactNode',
      description: 'Icon displayed at the start of the selector trigger.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description: 'Shows a loading spinner in the trigger.',
      default: 'false',
    },
    {
      name: 'onClick',
      type: '(event: MouseEvent) => void',
      description:
        'Click handler on the trigger button. Runs before the selector toggles its surface; preventDefault() does not keep it closed.',
    },
    {
      name: 'onFocus',
      type: '(event: FocusEvent) => void',
      description:
        "Focus handler on the trigger button. Runs before the selector's own focus handling.",
    },
    {
      name: 'onKeyDown',
      type: '(event: KeyboardEvent) => void',
      description:
        'Key handler on the trigger button. Runs after the built-in keyboard model and is skipped for keys it handles and cancels.',
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
        'StyleX styles for the visual control box: the element that paints the border and background and holds the value, icons, and end controls. Never the trigger button itself.',
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
  components: [{name: 'SelectorOption'}],
  usage: {
    description:
      'A dropdown selector for choosing a single value from a list of options. Supports labels, validation, descriptions, and required/optional states. Use it in forms and settings when presenting a moderate number of options. Keyboard typeahead matches a native select: typing on the focused closed trigger selects the matching option directly, repeated presses cycle through options sharing a first letter, and spaces count as match characters ("new y" reaches "New York"). With the menu open, typing moves the highlight and Enter commits. With hasSearch, typing on the closed trigger opens the popup and seeds the search input.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide a visible label so users understand what they are selecting.',
      },
      {
        guidance: true,
        description:
          'Use sections and dividers to organize options when the list exceeds ~8 items.',
      },
      {
        guidance: true,
        description:
          'Use renderOption for custom option rows. Do not pass SelectorOption directly as JSX children.',
      },
      {
        guidance: true,
        description:
          'Set a meaningful placeholder that hints at the expected selection (e.g. "Choose a country" not "Select...").',
      },
      {
        guidance: true,
        description:
          'Use inside InputGroup only when the selector needs a short prefix or suffix addon as part of one decorated input surface.',
      },
      {
        guidance: true,
        description:
          'Use variant="secondary" when a selector sits in a nav or toolbar beside secondary buttons or a segmented control, so it shares their treatment instead of reading as a form field. Use variant="ghost" when a selector sits in a toolbar with ghost buttons. If validation status is needed there, prefer statusVariant="tooltip" so the toolbar height stays compact.',
      },
      {
        guidance: true,
        description:
          'Use presentation="adaptive" when the selector should become a bottom sheet on compact touch screens.',
      },
      {
        guidance: false,
        description:
          'Use for action menus; use Dropdown Menu for triggering commands or navigation.',
      },
      {
        guidance: false,
        description:
          'Use when there are only two options; use a SegmentedControl or radio buttons instead.',
      },
      {
        guidance: false,
        description:
          'Use Selector for navigation; links should be links, not dropdown options.',
      },
      {
        guidance: false,
        description:
          'Use for yes/no or on/off choices; use Switch or CheckboxInput instead.',
      },
      {
        guidance: false,
        description:
          'Put more than ~20 options without sections; consider Typeahead for large lists.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled Selector in Tooltip to explain why it is disabled. Use the disabledMessage prop, which attaches the reason to the trigger itself.',
      },
    ],
    anatomy,
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "用于从选项列表中选择单个值的下拉选择器。支持标签、校验、描述以及必填/可选状态。在表单和设置中呈现适量选项时使用。键盘 typeahead 与原生 select 匹配：在聚焦的关闭触发器上键入会直接选择匹配的选项，重复按键会在共享首字母的选项之间循环，空格也算作匹配字符（“new y”可到达“New York”）。菜单打开时，键入会移动高亮，Enter 提交。启用 `hasSearch` 时，在关闭的触发器上键入会打开弹出层并预填搜索输入框。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "提供可见标签，让用户了解他们正在选择什么。"
      },
      {
        "guidance": true,
        "description": "当列表超过约 8 项时，使用分区和分隔线组织选项。"
      },
      {
        "guidance": true,
        "description": "使用 `renderOption` 自定义选项行。不要直接将 SelectorOption 作为 JSX 子元素传入。"
      },
      {
        "guidance": true,
        "description": "设置有意义的占位符，提示预期的选择（例如“Choose a country”而不是“Select...”）。"
      },
      {
        "guidance": true,
        "description": "仅当选择器需要作为单个装饰输入表面的一部分提供简短前缀或后缀附加项时，才在 InputGroup 内使用。"
      },
      {
        "guidance": true,
        "description": "当选择器位于导航或工具栏中、旁边是 secondary 按钮或分段控件时，使用 `variant=\"secondary\"`，使其共享同样的处理，而不被读作表单字段。当选择器位于带 ghost 按钮的工具栏中时，使用 `variant=\"ghost\"`。如果此处需要校验状态，优先使用 `statusVariant=\"tooltip\"`，以保持工具栏高度紧凑。"
      },
      {
        "guidance": true,
        "description": "当选择器在紧凑触摸屏上应变为底部抽屉时，使用 `presentation=\"adaptive\"`。"
      },
      {
        "guidance": false,
        "description": "不要用于操作菜单；触发命令或导航请使用 Dropdown Menu。"
      },
      {
        "guidance": false,
        "description": "当只有两个选项时不要使用；请改用 SegmentedControl 或单选按钮。"
      },
      {
        "guidance": false,
        "description": "不要将 Selector 用于导航；链接应该是链接，而不是下拉选项。"
      },
      {
        "guidance": false,
        "description": "不要用于是/否或开/关选择；请改用 Switch 或 CheckboxInput。"
      },
      {
        "guidance": false,
        "description": "不要在未分区的情况下放置超过约 20 个选项；大型列表请考虑 Typeahead。"
      },
      {
        "guidance": false,
        "description": "不要将禁用的 Selector 包裹在 Tooltip 中以解释禁用原因。请使用 `disabledMessage` 属性，它会将原因附加到触发器本身。"
      }
    ],
    "anatomy": [
      {
        "name": "字段",
        "required": false,
        "description": "独立的 Field 外壳，提供标签和可选的支持性内容；在 InputGroup 内省略。"
      },
      {
        "name": "触发器",
        "required": true,
        "description": "绘制的控件，显示当前选择或占位符，并在可编辑时打开选择表面。"
      },
      {
        "name": "图标渲染的起始图标",
        "required": false,
        "description": "可选的、通过 Icon 渲染的前置语义图标或图标组件。"
      },
      {
        "name": "调用方渲染的起始内容",
        "required": false,
        "description": "可选的在触发器起始处直接渲染的任意 React 内容。"
      },
      {
        "name": "触发器清除按钮",
        "required": false,
        "description": "启用 `hasClear` 时移除所选值的共享清除操作。"
      },
      {
        "name": "状态图标",
        "required": false,
        "description": "用于 attached 或 tooltip 状态时，替代展开指示器显示的状态字形。"
      },
      {
        "name": "指示器图标",
        "required": false,
        "description": "状态呈现未替换它时显示的尾部箭头；反映折叠或展开状态。"
      },
      {
        "name": "搜索行",
        "required": false,
        "description": "带无边框搜索输入框和可选清除操作的面板标题栏。"
      },
      {
        "name": "搜索图标",
        "required": false,
        "description": "在搜索行内通过 Icon 渲染的前置放大镜。"
      },
      {
        "name": "搜索清除按钮",
        "required": false,
        "description": "存在查询时显示在搜索行中的共享清除操作。"
      },
      {
        "name": "选项行",
        "required": false,
        "description": "一个所提供选项的可选择行。"
      },
      {
        "name": "SelectorOption 渲染的内容",
        "required": false,
        "description": "使用 SelectorOption 渲染的选项内容，可由默认渲染器或 `renderOption` 返回 SelectorOption 时渲染。"
      },
      {
        "name": "调用方渲染的裸选项内容",
        "required": false,
        "description": "`renderOption` 直接返回、未选择使用 SelectorOption 的任意内容。"
      },
      {
        "name": "选项选择指示器",
        "required": false,
        "description": "为每个选项在其选中或未选中状态下渲染的解析后选择标记。当解析后的指示器不绘制任何内容时，其布局空间会折叠。"
      },
      {
        "name": "选项分隔线",
        "required": false,
        "description": "在公共 options 数据中提供、用于分隔相邻选项组的分隔线。"
      },
      {
        "name": "分区标题",
        "required": false,
        "description": "带标签的选项行组的可见标题。"
      },
      {
        "name": "空状态",
        "required": false,
        "description": "当共享面板内容没有选项或没有搜索匹配时显示的消息。"
      },
      {
        "name": "指针弹出层",
        "required": false,
        "description": "承载共享面板内容的锚定绘制表面，用于 popover 呈现。"
      },
      {
        "name": "触摸抽屉标题",
        "required": false,
        "description": "底部抽屉呈现中，共享面板内容上方的标题。"
      },
      {
        "name": "触摸抽屉",
        "required": false,
        "description": "承载同一面板内容、用于底部抽屉呈现的 BottomSheet 表面。"
      }
    ]
  },
  "name": "Selector",
  "description": "用于从选项列表中选择的下拉选择器。",
  "propDescriptions": {
    "label": "用于无障碍的标签文本。",
    "options": "项数组：字符串、带 value/label/description/icon/disabled 的对象、分隔线（`{type: \"divider\"}`）或分区（`{type: \"section\", title, options}`）。",
    "value": "当前选中的值。",
    "onChange": "选择变化时触发的回调。",
    "hasClear": "选中值时显示清除（×）按钮。为 true 时，`onChange` 也接受 null，以表示用户清除了选择。",
    "hasSearch": "是否显示用于筛选选项的搜索输入框。用户键入时，匹配数量（或“No results found”）会通过礼貌的实时区域播报给屏幕阅读器。搜索字段具有内置辅助功能：前置放大镜图标，以及输入查询后的尾部清除（✕）按钮，用于重置查询并将焦点返回输入框。",
    "searchPlaceholder": "搜索输入框的占位符文本。",
    "emptyText": "下拉面板中没有可显示的选项时显示的内容，并在面板打开时在礼貌的实时区域中播报。播报内容为此内容渲染的文本，从 DOM 读取，因此元素会按书写内容播报，aria-hidden 部分则不会出现在两者中。`isLoading` 时不显示。",
    "emptySearchText": "搜索查询未匹配任何选项时在下拉面板中显示的内容，并同时在礼貌的实时区域中播报。播报内容为此内容渲染的文本，从 DOM 读取，因此元素会按书写内容播报，aria-hidden 部分则不会出现在两者中。",
    "placeholder": "未选择值时显示的占位符文本。",
    "size": "选择器的尺寸变体。",
    "variant": "视觉触发器样式。`input` 是用于表单的带边框输入处理；`secondary` 匹配活动主题的 secondary 按钮（默认为无边框且中性填充），用于导航和工具栏；`ghost` 无边框且透明，匹配用于工具栏的 ghost 按钮。",
    "isDisabled": "禁用选择器。",
    "isReadOnly": "使选择器成为只读：所选值保持可见、可聚焦并包含在表单提交中，并保留其组合框身份及 aria-readonly。选择表面、清除操作和展开指示器会被移除。与 `isDisabled` 不同，控件不会变暗。两者同时设置时，`isDisabled` 优先。",
    "htmlName": "用于表单提交的 HTML name 属性。渲染一个携带所选值的隐藏 input，类似原生 select。",
    "disabledMessage": "解释选择器为何被禁用。与 `isDisabled` 一起使用时，在触发器的悬停和键盘焦点时以 Tooltip 显示原因，触发器像每个禁用的选择器一样保持可聚焦（aria-disabled）；激活仍被阻止。请使用此属性，而不是将禁用的 Selector 包裹在 Tooltip 中。",
    "isLabelHidden": "在视觉上隐藏标签，同时保持其可访问。",
    "description": "显示在标签下方的辅助文本。",
    "isOptional": "将字段标记为可选。",
    "isRequired": "将字段标记为必填。",
    "status": "带可选消息的校验状态。",
    "statusVariant": "状态消息相对于输入框的放置方式。`attached` 直接重叠在带边框输入框下方，仅对 `input` 变体有效；secondary 和 ghost 选择器默认将 attached 状态消息分离。对于紧凑的工具栏控件，使用 `tooltip`。",
    "renderOption": "下拉列表中每个可选择选项的自定义渲染函数。请使用此属性而不是 JSX 子元素；分隔线和分区由选择器渲染。",
    "renderValue": "关闭的触发器中所选选项的自定义渲染函数。单行值遵循活动尺寸令牌，包括带图标或清除控件的紧凑或宽间距刻度。内边距会适应触发器行框，每增加一行会使控件增加一行高度（使用默认令牌时，单行为 28/32/36，双行为 48/52/56）。内容继承触发器行高；设置更大字体的内容应设置自己的行高，以便触发器随之增高。在 InputGroup 内，组负责行高：SelectorOption 会折叠到一行并显示省略号，任何更高的节点都会在行处被裁掉。",
    "indicatorPosition": "选项行的哪个逻辑边缘承载渲染的选择标记。空标记不占空间，因此选中和未选中的标签可能会移位或可用宽度不同。`end` 是与 Typeahead 和 CommandPalette 共享的惯例。",
    "presentation": "选项列表的呈现方式。`adaptive` 在紧凑触摸屏上使用底部抽屉，否则使用锚定弹出层。",
    "width": "字段的宽度（数字 = 像素，字符串按原样使用，例如 \"100%\"）。设置整个字段（标签、控件和状态）的尺寸，使其保持对齐。不设置宽度时，字段跟随其显示值并可随行收缩（值会截断），而不是溢出；对于筛选栏，使用 `<HStack wrap=\"wrap\">`，以便选择器在手机上移到第二行。",
    "startIcon": "显示在选择器触发器起始处的图标。",
    "isLoading": "在触发器中显示加载转圈。",
    "onClick": "触发器按钮上的点击处理函数。在选择器切换其表面之前运行；`preventDefault()` 不会使其保持关闭。",
    "onFocus": "触发器按钮上的焦点处理函数。在选择器自身的焦点处理之前运行。",
    "onKeyDown": "触发器按钮上的按键处理函数。在内置键盘模型之后运行，对于其处理并取消的按键会跳过。",
    "containerXstyle": "用于字段容器（标签、控件和状态一起）的 StyleX 样式。在 InputGroup 内无效（请改为设置 InputGroup 的样式），在 `horizontal-labels` FormLayout 中也无效。不接受根级 `xstyle`、`className` 和 `style`。",
    "containerClassName": "字段容器的类名。作用域与 `containerXstyle` 相同。",
    "containerStyle": "字段容器的内联样式。作用域与 `containerXstyle` 相同。",
    "controlXstyle": "用于视觉控件框的 StyleX 样式：绘制边框和背景并容纳值、图标和结束控件的元素。绝不是触发器按钮本身。",
    "controlClassName": "视觉控件框的类名。",
    "controlStyle": "视觉控件框的内联样式。"
  },
  "components": [
    {
      "name": "SelectorOption",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  usage: {
    description:
      'A dropdown selector for choosing a single value from a list of options. Supports labels, validation, descriptions, and required/optional states. Use it in forms and settings when presenting a moderate number of options. Keyboard typeahead matches a native select: typing on the focused closed trigger selects the matching option directly, repeated presses cycle through options sharing a first letter, and spaces count as match characters ("new y" reaches "New York"). With the menu open, typing moves the highlight and Enter commits. With hasSearch, typing on the closed trigger opens the popup and seeds the search input.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide a visible label so users understand what they are selecting.',
      },
      {
        guidance: true,
        description:
          'Use sections and dividers to organize options when the list exceeds ~8 items.',
      },
      {
        guidance: true,
        description:
          'renderOption for custom rows; do not pass SelectorOption as JSX children.',
      },
      {
        guidance: true,
        description:
          'Set a meaningful placeholder that hints at the expected selection (e.g. "Choose a country" not "Select...").',
      },
      {
        guidance: true,
        description:
          'Use inside InputGroup only when the selector needs a short prefix or suffix addon.',
      },
      {
        guidance: true,
        description:
          'Use variant="secondary" in navs/toolbars beside secondary buttons; use variant="ghost" in toolbars with ghost buttons; prefer statusVariant="tooltip" for compact validation status.',
      },
      {
        guidance: false,
        description:
          'Use for action menus; use Dropdown Menu for triggering commands or navigation.',
      },
      {
        guidance: false,
        description:
          'Use when there are only two options; use a SegmentedControl or radio buttons instead.',
      },
      {
        guidance: false,
        description:
          'Use Selector for navigation; links should be links, not dropdown options.',
      },
      {
        guidance: false,
        description:
          'Use for yes/no or on/off choices; use Switch or CheckboxInput instead.',
      },
      {
        guidance: false,
        description:
          'Put more than ~20 options without sections; consider Typeahead for large lists.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled Selector in Tooltip to explain why it is disabled. Use the disabledMessage prop, which attaches the reason to the trigger itself.',
      },
    ],
    anatomy,
  },
};
