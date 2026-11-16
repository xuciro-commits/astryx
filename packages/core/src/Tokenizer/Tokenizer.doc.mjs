// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Tokenizer',
  displayName: 'Tokenizer',
  category: 'Form Controls',
  keywords: [
    'tokenizer',
    'multiselect',
    'multi-select',
    'chips',
    'tags',
    'combobox',
    'autocomplete',
    'taginput',
    'chipinput',
  ],
  playground: {
    // `value` is a required array of custom items the preview cannot
    // auto-generate; without a default the properties tab shows the
    // missing-props placeholder instead of the field. `searchSource` and
    // `onChange` are supplied by the preview's own fallbacks.
    defaults: {
      label: 'Tags',
      placeholder: 'Search...',
      value: [
        {id: '1', label: 'Design'},
        {id: '2', label: 'Engineering'},
      ],
    },
  },
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
      type: 'T[]',
      description: 'Array of currently selected items.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(items: T[], change: TokenizerChange<T>) => void',
      description:
        "Called when selection changes. The change argument includes the affected item and type ('add' | 'create' | 'remove' | 'reorder'). Additions and removals (including Backspace on an empty input) are announced to screen readers via a polite live region.",
      required: true,
    },
    {
      name: 'placeholder',
      type: 'string',
      description:
        'Input placeholder text. Only shown when no tokens are selected.',
    },
    {
      name: 'maxEntries',
      type: 'number',
      description:
        'Maximum number of selections allowed. Input is hidden when the limit is reached.',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description: 'Show a clear-all button for bulk removal of all tokens.',
      default: 'false',
    },
    {
      name: 'renderToken',
      type: '(item: T, onRemove: () => void) => ReactNode',
      description:
        'Custom render function for selected tokens. Default renders Token with label and onRemove.',
    },
    {
      name: 'renderItem',
      type: '(item: T) => ReactNode',
      description:
        'Custom render function for dropdown items. Default renders TypeaheadItem.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Disables the input and all token interactions. The input keeps its tab stop: it is announced as disabled (aria-disabled), is read-only, and opens and picks nothing. With tokenOverflowBehavior="unfocusedLayer" and no disabledMessage, the input is natively disabled and out of the tab order.',
      default: 'false',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        'The HTML name attribute for form submissions. Renders one hidden input per selected item id.',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the tokenizer is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the input focusable via aria-disabled (input stays blocked). Use this instead of wrapping a disabled Tokenizer in Tooltip, so the reason is attached to the field itself.',
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
      name: 'hasEntriesOnFocus',
      type: 'boolean',
      description:
        'Show bootstrap results on focus before typing. After a pick from that list, the input keeps focus and the list stays open with the next choice active, while another choice remains.',
      default: 'false',
    },
    {
      name: 'maxMenuItems',
      type: 'number',
      description:
        'Maximum number of search results to display. The hasCreate entry is offered on top of them, so a menu can show one more than this.',
      default: '10',
    },
    {
      name: 'menuWidth',
      type: 'number',
      description:
        'Fixed dropdown width in pixels. The menu never shrinks below its anchor width.',
    },
    {
      name: 'minQueryLength',
      type: 'number',
      description:
        'Minimum query length before the search source is queried. Below it no search runs, and the menu stays closed — unless hasCreate is set, in which case the "Create ..." entry is still offered, being derived from the typed text rather than fetched for it.',
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
      name: 'hasAutoFocus',
      type: 'boolean',
      description: 'Auto-focus the input on mount.',
      default: 'false',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description:
        "Input and token size. Inside an InputGroup the group's size applies instead.",
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
      name: 'hasCreate',
      type: 'boolean',
      description:
        "Allow users to create new tokens from free-text input. When true, a \"Create\" option appears in the dropdown for typed text that doesn't match existing results. The onChange change type is 'create' for these items.",
      default: 'false',
    },
    {
      name: 'onChangeQuery',
      type: '(query: string) => void',
      description: 'Callback fired when the search query text changes.',
    },
    {
      name: 'startIcon',
      type: 'ReactNode | IconType',
      description:
        'Icon to display at the start of the input, before any tokens. Accepts a semantic icon name, an SVG icon component, or a ReactNode directly.',
      slotElements: [{__element: 'Icon', props: {icon: 'search', size: 'sm'}}],
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Content to display at the end of the input row. Useful for buttons, result counts, or other controls.',
      slotElements: [
        {__element: 'Icon', props: {icon: 'chevronDown', size: 'sm'}},
        {__element: 'Badge', props: {label: '3'}},
      ],
    },
    {
      name: 'handleRef',
      type: 'React.Ref<TokenizerHandle>',
      description:
        'Imperative handle exposing focus(), blur(), open() and close(). open() and close() drive the inline menu; the sheet presentation ignores them.',
    },
    {
      name: 'menu',
      type: 'BaseTypeaheadMenu',
      description:
        "What the menu shows. role 'listbox' (default) is the result list; its optional render({listbox, query, isBusy, isEmptySearch, close}) places information such as a header or a hint around it, and anything a person acts on stays a result so the arrow keys reach it. role 'dialog' shows render({query, close}) in a dialog named by label that takes focus; Escape, an outside press or close() returns focus to where it was when the menu opened. Astryx owns the layer either way. Switching from listbox to dialog keeps the menu open: call handleRef.open() from onChange. The sheet presentation keeps its own sheet and ignores it.",
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description:
        'Called when the inline menu opens or closes. It reports changes only; drive the menu with handleRef. Not called by the sheet presentation.',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
    },
    {
      name: 'tokenOverflowBehavior',
      type: "'none' | 'unfocusedInline' | 'unfocusedLayer'",
      description:
        'Controls how tokens overflow when the container is too narrow.',
      default: "'none'",
    },
    {
      name: 'onFocus',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: 'Fires when focus enters the tokenizer input.',
    },
    {
      name: 'onBlur',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: 'Fires when focus leaves the tokenizer input.',
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
    {
      name: 'presentation',
      type: "'popover' | 'bottom-sheet' | 'adaptive'",
      description:
        'How the field presents its choices. adaptive (the default) uses the bottom sheet on compact touch screens and the popover otherwise, resolved the same way Selector resolves it; the server render and the hydrating render are the popover. popover is the inline combobox with its anchored suggestion menu on every device. bottom-sheet replaces it on every device with a field showing the selected tokens, whose trigger opens one tall modal sheet: a search row on top, full-width checkbox rows that keep their place while the sheet is open, a Create row with hasCreate, and a footer pinned in every state with a confirmed Clear all and Save; the sheet edits a draft, so onChange fires once, when Save commits it, and a swipe, scrim or Escape close of a changed draft asks before discarding. In the sheet presentation the field box holds the trigger, the tokens and endContent, and keeps the box, theming target and focus ring of the inline field; the trigger is the control: ref, id, aria-* and data-* reach it, and ref receives the trigger button there, so type it Ref<HTMLInputElement | HTMLButtonElement>, which the component accepts (TokenizerProps keeps its released input ref type). endContent sits at the inline end of the field and renderToken renders its tokens, as in the inline field; their own controls act without opening the sheet. renderItem, hasClear (the sheet has its own Clear all), hasEntriesOnFocus, menuWidth, menu, onOpenChange, tokenOverflowBehavior (the field wraps its tokens) and hasAutoFocus have no surface in the sheet, and the field warns once in development when they are passed. Pass presentation="popover" to keep the inline field and those props on every device.',
      default: "'adaptive'",
    },
  ],
  theming: {
    targets: [
      {
        className: 'astryx-tokenizer',
        visualProps: ['size', 'status'],
        states: ['disabled'],
      },
    ],
  },
  usage: {
    description:
      'Tokenizer is a multi-select input that lets users search, select, and manage multiple items displayed as removable chips. Use it when users need to build a set of selections from a searchable data source, like adding team members, applying tags, or choosing filters.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Write a placeholder that tells users what they can search for, such as "Search people..." or "Add tags...", so the input is not a blank mystery.',
      },
      {
        guidance: true,
        description:
          'Set maxEntries when the number of selections should be bounded, like limiting a review to 5 approvers.',
      },
      {
        guidance: true,
        description:
          'Use hasCreate for free-form tagging where users need to enter values that do not exist in the search source.',
      },
      {
        guidance: true,
        description:
          'Show validation status with the status prop so users know immediately when a selection is missing or invalid.',
      },
      {
        guidance: true,
        description:
          'Use inside InputGroup only when the tokenizer needs a short prefix or suffix addon as part of one decorated input surface; the grouped row stays single-line, so keep selections few (maxEntries) or use tokenOverflowBehavior to summarize them.',
      },
      {
        guidance: false,
        description:
          "Don't use Tokenizer for single-item selection; use Typeahead instead. Tokenizer is for building sets of two or more items.",
      },
      {
        guidance: false,
        description:
          'Avoid applying custom colors to individual tokens inside a Tokenizer; use the default token style for visual consistency across the set.',
      },
      {
        guidance: false,
        description:
          "Don't hide the label; every Tokenizer needs a visible label so users understand what they are selecting. Use isLabelHidden only when surrounding context makes the purpose obvious.",
      },
      {
        guidance: false,
        description:
          'Wrap a disabled Tokenizer in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
    anatomy: [
      {
        name: 'Label',
        required: true,
        description:
          'The visible text above the input describing what the user is selecting. Also used as the accessible name.',
      },
      {
        name: 'Token chips',
        required: false,
        description:
          'Removable chips representing each selected item. Each chip shows a label and a remove button.',
      },
      {
        name: 'Search input',
        required: true,
        description:
          'The text input where users type to search the data source. Hides when maxEntries is reached.',
      },
      {
        name: 'Dropdown menu',
        required: false,
        description:
          'The search results list that appears below the input as the user types.',
      },
      {
        name: 'Spinner',
        required: false,
        description:
          'Loading indicator shown at the end of the field while a search is in flight.',
      },
      {
        name: 'End content',
        required: false,
        description:
          'A trailing slot after the input for action buttons, counts, or other controls.',
      },
      {
        name: 'Clear button',
        required: false,
        description:
          'A button that removes all selected tokens at once. Shown when hasClear is true and tokens are present.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Tokenizer",
  "displayName": "Tokenizer",
  "props": [
    {
      "name": "label",
      "type": "string",
      "description": "输入框的可访问标签。",
      "required": true
    },
    {
      "name": "searchSource",
      "type": "SearchSource<T>",
      "description": "提供 search 和 bootstrap 方法的数据源。`search(query, context)` 可以在返回前调用 `context.update(items)` 以显示它已经拥有的匹配项；它返回的值是最终列表，并且某个查询在第一次之后的每个列表都会保持已显示的行在前，并在其后添加新行。",
      "required": true
    },
    {
      "name": "value",
      "type": "T[]",
      "description": "当前选中项的数组。",
      "required": true
    },
    {
      "name": "onChange",
      "type": "(items: T[], change: TokenizerChange<T>) => void",
      "description": "当选择发生变化时调用。change 参数包含受影响的条目和类型（'add' | 'create' | 'remove' | 'reorder'）。添加和移除（包括在空输入框上按 Backspace）会通过礼貌的实时区域向屏幕阅读器宣布。",
      "required": true
    },
    {
      "name": "placeholder",
      "type": "string",
      "description": "输入框占位文本。仅在未选择任何令牌时显示。"
    },
    {
      "name": "maxEntries",
      "type": "number",
      "description": "允许的最大选择数量。达到限制时隐藏输入框。"
    },
    {
      "name": "hasClear",
      "type": "boolean",
      "description": "显示一个清除全部按钮，用于批量移除所有令牌。",
      "default": "false"
    },
    {
      "name": "renderToken",
      "type": "(item: T, onRemove: () => void) => ReactNode",
      "description": "已选令牌的自定义渲染函数。默认渲染带 label 和 onRemove 的 Token。"
    },
    {
      "name": "renderItem",
      "type": "(item: T) => ReactNode",
      "description": "下拉项的自定义渲染函数。默认渲染 TypeaheadItem。"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "禁用输入框及所有令牌交互。输入框保留其 Tab 停靠点：它会被宣布为已禁用（aria-disabled）、为只读，并且不打开或选择任何内容。当 tokenOverflowBehavior=\"unfocusedLayer\" 且未设置 disabledMessage 时，输入框会原生禁用并移出 Tab 顺序。",
      "default": "false"
    },
    {
      "name": "htmlName",
      "type": "string",
      "description": "用于表单提交的 HTML name 属性。为每个选中项 id 渲染一个隐藏输入框。"
    },
    {
      "name": "disabledMessage",
      "type": "string",
      "description": "解释 Tokenizer 被禁用的原因。与 isDisabled 一起使用时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持输入框可聚焦（输入仍被阻止）。请使用此属性而不是将禁用的 Tokenizer 包裹在 Tooltip 中，以便原因附加到字段本身。"
    },
    {
      "name": "status",
      "type": "{type: 'warning' | 'error' | 'success', message?: string}",
      "description": "用于错误/警告/成功状态的验证状态对象，包含 type 和 message。"
    },
    {
      "name": "statusVariant",
      "type": "'attached' | 'detached' | 'tooltip'",
      "description": "状态消息相对于输入框的放置方式。attached 直接重叠在输入框下方（带边框的处理）；detached 作为独立元素带间距地浮动在下方；tooltip 在信息提示按钮中显示消息。",
      "default": "'attached'"
    },
    {
      "name": "isLabelHidden",
      "type": "boolean",
      "description": "在视觉上隐藏标签，同时保持其可访问。",
      "default": "false"
    },
    {
      "name": "description",
      "type": "string",
      "description": "显示在标签下方的辅助文本。"
    },
    {
      "name": "isRequired",
      "type": "boolean",
      "description": "将字段标记为必填。",
      "default": "false"
    },
    {
      "name": "isOptional",
      "type": "boolean",
      "description": "在标签上显示可选指示符。",
      "default": "false"
    },
    {
      "name": "labelTooltip",
      "type": "string",
      "description": "标签上显示的工具提示文本。"
    },
    {
      "name": "hasEntriesOnFocus",
      "type": "boolean",
      "description": "在输入前聚焦时显示 bootstrap 结果。从该列表中选择后，输入框保持焦点，列表保持打开并激活下一个选项，同时仍有其他选项可用。",
      "default": "false"
    },
    {
      "name": "maxMenuItems",
      "type": "number",
      "description": "显示的最大搜索结果数量。hasCreate 条目会在它们之上提供，因此菜单可以比此多显示一项。",
      "default": "10"
    },
    {
      "name": "menuWidth",
      "type": "number",
      "description": "固定的下拉宽度（像素）。菜单绝不会收缩到小于其锚点宽度。"
    },
    {
      "name": "minQueryLength",
      "type": "number",
      "description": "查询搜索源之前的最小查询长度。低于此长度不会运行搜索，菜单保持关闭——除非设置了 hasCreate，此时仍会提供 \"Create ...\" 条目，因为它是根据键入的文本派生的，而不是为此获取的。",
      "default": "1"
    },
    {
      "name": "emptySearchText",
      "type": "ReactNode",
      "description": "查询未匹配任何内容时显示的内容。接受 ReactNode，因此死胡同可以带有链接或创建行。它会作为其渲染的文本在礼貌的实时区域中宣布，从 DOM 读取；aria-hidden 的部分不会出现在两者中，不渲染文本的内容不会宣布任何内容。null 视为未提供，与 undefined 一样，并回退到默认值；传入空字符串以不渲染任何内容。",
      "default": "'No results found'"
    },
    {
      "name": "hasAutoFocus",
      "type": "boolean",
      "description": "挂载时自动聚焦输入框。",
      "default": "false"
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "description": "输入框和令牌的尺寸。在 InputGroup 内则应用组的尺寸。",
      "default": "'md'"
    },
    {
      "name": "debounceMs",
      "type": "number",
      "description": "触发搜索前的防抖延迟（毫秒）。对同步数据源设为 0；对于通过 `context.update` 显示本地匹配并延迟自身服务器请求的数据源也设为 0。",
      "default": "150"
    },
    {
      "name": "onChangeQuery",
      "type": "(query: string) => void",
      "description": "搜索查询文本变化时触发的回调。"
    },
    {
      "name": "startIcon",
      "type": "ReactNode | IconType",
      "description": "显示在输入框开头、任何令牌之前的图标。接受语义图标名称、SVG 图标组件或直接的 ReactNode。"
    },
    {
      "name": "endContent",
      "type": "ReactNode",
      "description": "显示在输入行末端的内容。适用于按钮、结果计数或其他控件。"
    },
    {
      "name": "handleRef",
      "type": "React.Ref<TokenizerHandle>",
      "description": "命令式句柄，暴露 focus()、blur()、open() 和 close()。open() 和 close() 驱动内联菜单；底部面板呈现方式会忽略它们。"
    },
    {
      "name": "menu",
      "type": "BaseTypeaheadMenu",
      "description": "菜单显示的内容。role 'listbox'（默认）是结果列表；其可选的 render({listbox, query, isBusy, isEmptySearch, close}) 会在其周围放置标题或提示等信息，而人们会操作的内容仍作为结果，以便方向键可以到达。role 'dialog' 会在以 label 命名的对话框中显示 render({query, close}) 并获得焦点；Escape、外部按下或 close() 会将焦点返回到菜单打开时的位置。无论哪种方式，Astryx 都拥有该层。从 listbox 切换到 dialog 会保持菜单打开：在 onChange 中调用 handleRef.open()。底部面板呈现方式保留自己的面板并忽略它。"
    },
    {
      "name": "onOpenChange",
      "type": "(isOpen: boolean) => void",
      "description": "内联菜单打开或关闭时调用。它仅报告变化；请使用 handleRef 驱动菜单。底部面板呈现方式不会调用它。"
    },
    {
      "name": "containerXstyle",
      "type": "StyleXStyles",
      "description": "用于字段容器（标签、控件和状态一起）的 StyleX 样式。在 InputGroup 内（请改为设置 InputGroup 样式）或 `horizontal-labels` FormLayout 中无效。不接受根级 `xstyle`、`className` 和 `style`。"
    },
    {
      "name": "containerClassName",
      "type": "string",
      "description": "字段容器的类名。目标与 `containerXstyle` 相同。"
    },
    {
      "name": "containerStyle",
      "type": "CSSProperties",
      "description": "字段容器的内联样式。目标与 `containerXstyle` 相同。"
    },
    {
      "name": "controlXstyle",
      "type": "StyleXStyles",
      "description": "视觉控件盒的 StyleX 样式：绘制边框和背景并容纳图标和末端控件的元素。绝不是原生输入框。"
    },
    {
      "name": "controlClassName",
      "type": "string",
      "description": "视觉控件盒的类名。"
    },
    {
      "name": "controlStyle",
      "type": "CSSProperties",
      "description": "视觉控件盒的内联样式。"
    },
    {
      "name": "presentation",
      "type": "'popover' | 'bottom-sheet' | 'adaptive'",
      "description": "字段呈现其选项的方式。adaptive（默认值）在紧凑触摸屏上使用底部面板，否则使用弹出框，解析方式与 Selector 相同；服务端渲染和 hydration 渲染都是弹出框。popover 是在所有设备上使用带锚定建议菜单的内联组合框。bottom-sheet 在所有设备上将其替换为一个显示已选令牌的字段，其触发按钮打开一个高模态面板：顶部是搜索行，全宽复选框行在面板打开期间保持位置，使用 hasCreate 时有一行 Create，以及一个在任何状态下都固定的页脚，带有需确认的 Clear all 和 Save；面板编辑草稿，因此 onChange 仅在 Save 提交时触发一次，而在草稿已更改时通过滑动、遮罩或 Escape 关闭会先询问是否放弃。在底部面板呈现方式中，字段盒容纳触发按钮、令牌和 endContent，并保留内联字段的盒子、主题目标和焦点环；触发按钮就是控件：ref、id、aria-* 和 data-* 会到达它，并且 ref 在那里接收触发按钮，因此请将其类型设为 Ref<HTMLInputElement | HTMLButtonElement>，组件接受该类型（TokenizerProps 保留其已发布的输入 ref 类型）。endContent 位于字段的行内末端，renderToken 像内联字段一样渲染其令牌；它们自己的控件可在不打开面板的情况下操作。renderItem、hasClear（面板有自己的 Clear all）、hasEntriesOnFocus、menuWidth、menu、onOpenChange、tokenOverflowBehavior（字段会包裹其令牌）和 hasAutoFocus 在面板中没有对应表面，传递时字段会在开发环境中警告一次。请传入 presentation=\"popover\" 以在所有设备上保留内联字段和这些属性。",
      "default": "'adaptive'"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-tokenizer",
        "visualProps": [
          "size",
          "status"
        ],
        "states": [
          "disabled"
        ]
      }
    ]
  },
  "usage": {
    "description": "Tokenizer 是一个多选输入控件，让用户可以搜索、选择并管理多个以可移除标签形式显示的条目。当用户需要从可搜索的数据源中构建一组选择时使用它，例如添加团队成员、应用标签或选择筛选条件。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "编写能告诉用户可以搜索什么的占位符，例如 \"Search people...\" 或 \"Add tags...\"，以免输入框成为一个空白的谜团。"
      },
      {
        "guidance": true,
        "description": "当选择数量应有上限时设置 maxEntries，例如将评审限制为 5 位审批人。"
      },
      {
        "guidance": true,
        "description": "对于需要输入搜索源中不存在的值的自由标签，使用 hasCreate。"
      },
      {
        "guidance": true,
        "description": "使用 status 属性显示验证状态，让用户立即知道某个选择缺失或无效。"
      },
      {
        "guidance": true,
        "description": "仅当 Tokenizer 需要作为单个装饰输入表面的一部分提供简短的前缀或后缀附加项时，才在 InputGroup 内使用；分组行保持单行，因此请保持选择较少（maxEntries），或使用 tokenOverflowBehavior 对其进行汇总。"
      },
      {
        "guidance": false,
        "description": "不要将 Tokenizer 用于单项选择；请改用 Typeahead。Tokenizer 用于构建包含两个或更多条目的集合。"
      },
      {
        "guidance": false,
        "description": "避免为 Tokenizer 内的单个令牌应用自定义颜色；使用默认令牌样式以保持整组视觉一致。"
      },
      {
        "guidance": false,
        "description": "不要隐藏标签；每个 Tokenizer 都需要可见的标签，以便用户理解他们在选择什么。仅当周围上下文使目的显而易见时才使用 isLabelHidden。"
      },
      {
        "guidance": false,
        "description": "不要将禁用的 Tokenizer 包裹在 Tooltip 中以解释其禁用原因；禁用的控件会吞掉包装器所需的悬停事件。请改用 disabledMessage 属性。"
      }
    ],
    "anatomy": [
      {
        "name": "标签",
        "required": true,
        "description": "输入框上方描述用户正在选择什么的可见文本。同时也用作可访问名称。"
      },
      {
        "name": "令牌标签",
        "required": false,
        "description": "代表每个选中项的可移除令牌标签。每个令牌标签显示文本和一个移除按钮。"
      },
      {
        "name": "搜索输入框",
        "required": true,
        "description": "用户在其中输入以搜索数据源的文本输入框。达到 maxEntries 时隐藏。"
      },
      {
        "name": "下拉菜单",
        "required": false,
        "description": "用户输入时出现在输入框下方的搜索结果列表。"
      },
      {
        "name": "加载指示器",
        "required": false,
        "description": "搜索进行中时显示在字段末端的加载指示器。"
      },
      {
        "name": "结束内容",
        "required": false,
        "description": "输入框之后用于操作按钮、计数或其他控件的尾随插槽。"
      },
      {
        "name": "清除按钮",
        "required": false,
        "description": "一次移除所有已选令牌的按钮。当 hasClear 为 true 且存在令牌时显示。"
      }
    ]
  },
  "propDescriptions": {
    "label": "输入框的可访问标签。",
    "searchSource": "提供 search 和 bootstrap 方法的数据源。`search(query, context)` 可以在返回前调用 `context.update(items)` 以显示它已经拥有的匹配项；它返回的值是最终列表，并且某个查询在第一次之后的每个列表都会保持已显示的行在前，并在其后添加新行。",
    "value": "当前选中项的数组。",
    "onChange": "当选择发生变化时调用。change 参数包含受影响的条目和类型（'add' | 'create' | 'remove' | 'reorder'）。添加和移除（包括在空输入框上按 Backspace）会通过礼貌的实时区域向屏幕阅读器宣布。",
    "placeholder": "输入框占位文本。仅在未选择任何令牌时显示。",
    "maxEntries": "允许的最大选择数量。达到限制时隐藏输入框。",
    "hasClear": "显示一个清除全部按钮，用于批量移除所有令牌。",
    "renderToken": "已选令牌的自定义渲染函数。默认渲染带 label 和 onRemove 的 Token。",
    "renderItem": "下拉项的自定义渲染函数。默认渲染 TypeaheadItem。",
    "isDisabled": "禁用输入框及所有令牌交互。输入框保留其 Tab 停靠点：它会被宣布为已禁用（aria-disabled）、为只读，并且不打开或选择任何内容。当 tokenOverflowBehavior=\"unfocusedLayer\" 且未设置 disabledMessage 时，输入框会原生禁用并移出 Tab 顺序。",
    "htmlName": "用于表单提交的 HTML name 属性。为每个选中项 id 渲染一个隐藏输入框。",
    "disabledMessage": "解释 Tokenizer 被禁用的原因。与 isDisabled 一起使用时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持输入框可聚焦（输入仍被阻止）。请使用此属性而不是将禁用的 Tokenizer 包裹在 Tooltip 中，以便原因附加到字段本身。",
    "status": "用于错误/警告/成功状态的验证状态对象，包含 type 和 message。",
    "statusVariant": "状态消息相对于输入框的放置方式。attached 直接重叠在输入框下方（带边框的处理）；detached 作为独立元素带间距地浮动在下方；tooltip 在信息提示按钮中显示消息。",
    "isLabelHidden": "在视觉上隐藏标签，同时保持其可访问。",
    "description": "显示在标签下方的辅助文本。",
    "isRequired": "将字段标记为必填。",
    "isOptional": "在标签上显示可选指示符。",
    "labelTooltip": "标签上显示的工具提示文本。",
    "hasEntriesOnFocus": "在输入前聚焦时显示 bootstrap 结果。从该列表中选择后，输入框保持焦点，列表保持打开并激活下一个选项，同时仍有其他选项可用。",
    "maxMenuItems": "显示的最大搜索结果数量。hasCreate 条目会在它们之上提供，因此菜单可以比此多显示一项。",
    "menuWidth": "固定的下拉宽度（像素）。菜单绝不会收缩到小于其锚点宽度。",
    "minQueryLength": "查询搜索源之前的最小查询长度。低于此长度不会运行搜索，菜单保持关闭——除非设置了 hasCreate，此时仍会提供 \"Create ...\" 条目，因为它是根据键入的文本派生的，而不是为此获取的。",
    "emptySearchText": "查询未匹配任何内容时显示的内容。接受 ReactNode，因此死胡同可以带有链接或创建行。它会作为其渲染的文本在礼貌的实时区域中宣布，从 DOM 读取；aria-hidden 的部分不会出现在两者中，不渲染文本的内容不会宣布任何内容。null 视为未提供，与 undefined 一样，并回退到默认值；传入空字符串以不渲染任何内容。",
    "hasAutoFocus": "挂载时自动聚焦输入框。",
    "size": "输入框和令牌的尺寸。在 InputGroup 内则应用组的尺寸。",
    "debounceMs": "触发搜索前的防抖延迟（毫秒）。对同步数据源设为 0；对于通过 `context.update` 显示本地匹配并延迟自身服务器请求的数据源也设为 0。",
    "hasCreate": "允许用户从自由文本输入创建新令牌。为 true 时，下拉菜单中会为不匹配现有结果的键入文本显示 \"Create\" 选项。这些条目的 onChange 变更类型为 'create'。",
    "onChangeQuery": "搜索查询文本变化时触发的回调。",
    "startIcon": "显示在输入框开头、任何令牌之前的图标。接受语义图标名称、SVG 图标组件或直接的 ReactNode。",
    "endContent": "显示在输入行末端的内容。适用于按钮、结果计数或其他控件。",
    "handleRef": "命令式句柄，暴露 focus()、blur()、open() 和 close()。open() 和 close() 驱动内联菜单；底部面板呈现方式会忽略它们。",
    "menu": "菜单显示的内容。role 'listbox'（默认）是结果列表；其可选的 render({listbox, query, isBusy, isEmptySearch, close}) 会在其周围放置标题或提示等信息，而人们会操作的内容仍作为结果，以便方向键可以到达。role 'dialog' 会在以 label 命名的对话框中显示 render({query, close}) 并获得焦点；Escape、外部按下或 close() 会将焦点返回到菜单打开时的位置。无论哪种方式，Astryx 都拥有该层。从 listbox 切换到 dialog 会保持菜单打开：在 onChange 中调用 handleRef.open()。底部面板呈现方式保留自己的面板并忽略它。",
    "onOpenChange": "内联菜单打开或关闭时调用。它仅报告变化；请使用 handleRef 驱动菜单。底部面板呈现方式不会调用它。",
    "width": "字段宽度（数字 = 像素，字符串按原样使用，例如 \"100%\"）。会调整整个字段（标签、控件和状态）的尺寸，使它们保持对齐。",
    "tokenOverflowBehavior": "控制容器太窄时令牌如何溢出。",
    "onFocus": "焦点进入 Tokenizer 输入框时触发。",
    "onBlur": "焦点离开 Tokenizer 输入框时触发。",
    "containerXstyle": "用于字段容器（标签、控件和状态一起）的 StyleX 样式。在 InputGroup 内（请改为设置 InputGroup 样式）或 `horizontal-labels` FormLayout 中无效。不接受根级 `xstyle`、`className` 和 `style`。",
    "containerClassName": "字段容器的类名。目标与 `containerXstyle` 相同。",
    "containerStyle": "字段容器的内联样式。目标与 `containerXstyle` 相同。",
    "controlXstyle": "视觉控件盒的 StyleX 样式：绘制边框和背景并容纳图标和末端控件的元素。绝不是原生输入框。",
    "controlClassName": "视觉控件盒的类名。",
    "controlStyle": "视觉控件盒的内联样式。",
    "presentation": "字段呈现其选项的方式。adaptive（默认值）在紧凑触摸屏上使用底部面板，否则使用弹出框，解析方式与 Selector 相同；服务端渲染和 hydration 渲染都是弹出框。popover 是在所有设备上使用带锚定建议菜单的内联组合框。bottom-sheet 在所有设备上将其替换为一个显示已选令牌的字段，其触发按钮打开一个高模态面板：顶部是搜索行，全宽复选框行在面板打开期间保持位置，使用 hasCreate 时有一行 Create，以及一个在任何状态下都固定的页脚，带有需确认的 Clear all 和 Save；面板编辑草稿，因此 onChange 仅在 Save 提交时触发一次，而在草稿已更改时通过滑动、遮罩或 Escape 关闭会先询问是否放弃。在底部面板呈现方式中，字段盒容纳触发按钮、令牌和 endContent，并保留内联字段的盒子、主题目标和焦点环；触发按钮就是控件：ref、id、aria-* 和 data-* 会到达它，并且 ref 在那里接收触发按钮，因此请将其类型设为 Ref<HTMLInputElement | HTMLButtonElement>，组件接受该类型（TokenizerProps 保留其已发布的输入 ref 类型）。endContent 位于字段的行内末端，renderToken 像内联字段一样渲染其令牌；它们自己的控件可在不打开面板的情况下操作。renderItem、hasClear（面板有自己的 Clear all）、hasEntriesOnFocus、menuWidth、menu、onOpenChange、tokenOverflowBehavior（字段会包裹其令牌）和 hasAutoFocus 在面板中没有对应表面，传递时字段会在开发环境中警告一次。请传入 presentation=\"popover\" 以在所有设备上保留内联字段和这些属性。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Multi-select typeahead w/ token chips for selected items. Composes BaseTypeahead for search+Token for chips.',
  usage: {
    description:
      'Multi-select input for searching and selecting multiple items as removable chips. Use for team members, tags, filters, or any set built from a searchable source.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Placeholder that communicates what to search, such as "Search people..." rather than blank.',
      },
      {
        guidance: true,
        description:
          'maxEntries when selections are bounded (e.g. 5 approvers max).',
      },
      {
        guidance: true,
        description:
          'hasCreate for free-form tagging with values not in the source.',
      },
      {
        guidance: true,
        description: 'status prop for immediate validation feedback.',
      },
      {
        guidance: true,
        description:
          'Use inside InputGroup only for a short prefix or suffix addon; the grouped row stays single-line, so keep selections few (maxEntries) or use tokenOverflowBehavior.',
      },
      {
        guidance: false,
        description:
          "Don't use for single-item selection; use Typeahead instead.",
      },
      {
        guidance: false,
        description:
          'Avoid custom token colors; default style for consistency.',
      },
      {
        guidance: false,
        description:
          "Don't hide the label unless context makes purpose obvious.",
      },
      {
        guidance: false,
        description:
          'Wrap a disabled Tokenizer in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
  propDescriptions: {
    containerXstyle:
      'StyleX styles for the field container; no effect in InputGroup or horizontal-labels FormLayout. No root xstyle/className/style.',
    containerClassName: 'Class name for the field container.',
    containerStyle: 'Inline styles for the field container.',
    controlXstyle:
      'StyleX styles for the visual control box (border, background, icons); not the native input.',
    controlClassName: 'Class name for the visual control box.',
    controlStyle: 'Inline styles for the visual control box.',
    label: 'Accessible label for input.',
    searchSource:
      'Data source w/ search+bootstrap methods for populating dropdown.',
    value: 'Array of currently selected items.',
    onChange:
      "Fired on selection change. Change arg includes affected item+type ('add'|'create'|'remove'|'reorder').",
    hasCreate:
      'Enable free-text token creation. Shows "Create" dropdown option for unmatched typed text.',
    placeholder: 'Input placeholder. Only shown when no tokens selected.',
    maxEntries: 'Max selections allowed. Input hidden at limit.',
    hasClear: 'Clear-all button for bulk removal.',
    renderToken:
      'Custom token render. Default renders Token w/ label+onRemove.',
    renderItem: 'Custom dropdown item render. Default renders TypeaheadItem.',
    isDisabled: 'Disables input+all token interactions.',
    htmlName: 'HTML name attr; one hidden input per selected item id.',
    status: 'Validation status w/ type+message for error/warning/success.',
    statusVariant:
      'How status message is placed: attached overlaps below input; detached floats below w/ spacing; tooltip shows on status icon.',
    isLabelHidden: 'Visually hides label; keeps a11y.',
    description: 'Helper text below label.',
    isRequired: 'Marks field required.',
    isOptional: 'Shows optional indicator on label.',
    labelTooltip: 'Tooltip on label.',
    hasEntriesOnFocus:
      'Show bootstrap results on focus before typing; a pick keeps the list open with the next choice active while choices remain.',
    maxMenuItems:
      'Max search results shown; the hasCreate entry sits on top of them.',
    menuWidth: 'Fixed dropdown width in pixels.',
    minQueryLength:
      'Min query length before searching. Menu stays closed below it, except the hasCreate entry.',
    emptySearchText: 'Content when the query matched nothing. ReactNode.',
    hasAutoFocus: 'Auto-focus input on mount.',
    size: 'Input+token size; the group size applies inside InputGroup.',
    debounceMs: 'Search debounce delay ms. 0 for sync sources.',
    onChangeQuery: 'Fired on search query text change.',
    startIcon:
      'Icon at input start, before tokens. Icon name, SVG component, or ReactNode.',
    endContent: 'Content at input row end. For buttons, counts, controls.',
    handleRef:
      'Handle: focus(), blur(), open(), close() (open/close inline only).',
    menu: "Menu content: {role:'listbox', render?({listbox,query,isBusy,isEmptySearch,close})} (info around the list; actions stay results) | {role:'dialog', label, render({query,close})} (takes focus; close returns focus to opener, else input). Astryx owns the layer. open() from onChange keeps it open across a role switch. Sheet ignores it (dev warning).",
    onOpenChange: 'Inline menu open/close report. Not called by the sheet.',
    presentation:
      "'adaptive' (default: sheet on compact touch, else popover; SSR/hydration render popover) | 'popover' (inline combobox, every device) | 'bottom-sheet' (field box with trigger + one searchable modal sheet of checkbox rows editing a draft that Save commits; onChange fires once, on Save). Sheet: field box keeps the inline box, theming target and focus ring; ref reaches the trigger button; endContent (field end) and renderToken (field tokens) work as inline; renderItem/hasClear/hasEntriesOnFocus/menuWidth/menu/onOpenChange/tokenOverflowBehavior/hasAutoFocus inert (dev warning). presentation=\"popover\" keeps them on every device.",
  },
};
