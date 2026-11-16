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
      'Shared clear action that removes every selected value when hasClear is enabled.',
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
    description:
      'Selectable row for an option or the optional select-all choice.',
  },
  {
    name: 'Option checkbox indicator',
    required: false,
    description:
      'CheckboxInput indicator that presents each row’s selected, unselected, or indeterminate state.',
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
  name: 'MultiSelector',
  displayName: 'Multi Selector',
  group: 'Selector',
  category: 'Form Controls',
  keywords: [
    'multiselect',
    'checkbox',
    'dropdown',
    'multi',
    'picker',
    'checklist',
    'facet',
    'filter',
    'select',
  ],
  playground: {
    defaults: {
      label: 'Fruit',
      options: [
        {value: 'apple', label: 'Apple'},
        {value: 'orange', label: 'Orange'},
        {value: 'banana', label: 'Banana'},
      ],
      value: [],
    },
  },
  theming: {
    targets: [
      {
        className: 'astryx-multi-selector',
        visualProps: ['variant', 'size', 'status'],
        states: ['disabled', 'readonly'],
      },
      {className: 'astryx-multi-selector-empty-state'},
      {className: 'astryx-multi-selector-search'},
      {className: 'astryx-multi-selector-section-heading'},
      {
        className: 'astryx-multi-selector-indicator-icon',
        states: ['state'],
      },
      {
        className: 'astryx-multi-selector-option',
        visualProps: ['size'],
        states: ['select-all', 'selected', 'disabled'],
      },
      {className: 'astryx-multi-selector-popup'},
    ],
  },
  components: [
    {
      name: 'MultiSelector',
      displayName: 'Multi Selector',
      description:
        'Multi-select dropdown with checkboxes for choosing multiple items.',
      props: [
        {
          name: 'label',
          type: 'string',
          description: 'Label text for accessibility.',
          required: true,
        },
        {
          name: 'options',
          type: 'MultiSelectorOptionType[]',
          description:
            'Array of items: strings, objects with value/label/icon/disabled, dividers, or sections. An option may carry `action`: one node — an IconButton, a Button, a menu trigger — the caller renders and names. Once any option does, the popup is a grid whose rows pair the option with its action: Up/Down move rows, the inline-end arrow reaches the action, Enter fires it, pointer and touch press it directly, and pressing it never changes the selection.',
          required: true,
        },
        {
          name: 'value',
          type: 'string[]',
          description: 'Currently selected values.',
          required: true,
        },
        {
          name: 'onChange',
          type: '(value: string[], change?: MultiSelectorChange) => void',
          description:
            'Called when the selection changes. A creation (hasCreate) arrives with `{type: "create", query}` as the second argument and the query appended to value; the caller adds the matching option in that same update. Every other change passes no descriptor, so a one-argument handler keeps working.',
          required: true,
        },
        {
          name: 'changeAction',
          type: '(value: string[]) => void | Promise<void>',
          description: 'Async action on change. Fires after onChange.',
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
          name: 'triggerDisplay',
          type: "'count' | 'labels' | 'badges'",
          description: 'How to display selected items in the trigger.',
          default: "'count'",
        },
        {
          name: 'formatValue',
          type: '(items: {value: string; label: string}[]) => string',
          description:
            'Formats the trigger text when triggerDisplay="count" or "labels". Receives the selected items (value plus resolved label); the count is items.length. Not used by triggerDisplay="badges".',
        },
        {
          name: 'maxBadges',
          type: 'number',
          description:
            'Maximum badges to show before "+N". Only for triggerDisplay="badges".',
          default: '3',
        },
        {
          name: 'hasSelectAll',
          type: 'boolean',
          description: 'Whether to show a select-all checkbox.',
        },
        {
          name: 'selectAllLabel',
          type: 'string',
          description: 'Label for the select-all checkbox.',
          default: "'Select all'",
        },
        {
          name: 'hasSearch',
          type: 'boolean',
          description:
            'Whether to show a search input for filtering options. As the user types, the match count (or "No results found") is announced to screen readers via a polite live region. The search field has built-in affordances: a leading magnifier icon and, once a query is typed, a trailing clear (✕) button that resets the query and returns focus to the input.',
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
          name: 'hasCreate',
          type: 'boolean',
          description:
            'With hasSearch, offers a `Create "<query>"` row first in the list when the typed text equals no option label under the search’s case-insensitive matching. Picking it, or Enter with nothing highlighted, calls onChange with the query appended to value and a `{type: "create", query}` descriptor, then clears the search; the caller must add an option for the new value in that update. Nothing is offered while isLoading. Without hasSearch it warns in development and offers nothing.',
          default: 'false',
        },
        {
          name: 'isDisabled',
          type: 'boolean',
          description: 'Disables the selector.',
        },
        {
          name: 'isReadOnly',
          type: 'boolean',
          description:
            'Makes the selector read-only: the selected values stay visible, focusable, and included in form submission, and retain their combobox identity with aria-readonly. The selection surface, clear action, and disclosure indicator are removed. Unlike isDisabled, the control is not dimmed. isDisabled takes precedence when both are set.',
          default: 'false',
        },
        {
          name: 'htmlName',
          type: 'string',
          description:
            'The HTML name attribute for form submissions. Renders one hidden input per selected value, like a native multi-select.',
        },
        {
          name: 'disabledMessage',
          type: 'string',
          description:
            'Explains why the selector is disabled. With isDisabled, shows the reason as a tooltip on hover and keyboard focus of the trigger, which stays focusable (aria-disabled) like every disabled selector; activation stays blocked. Use this instead of wrapping a disabled MultiSelector in Tooltip.',
        },
        {
          name: 'isLabelHidden',
          type: 'boolean',
          description: 'Visually hides the label while keeping it accessible.',
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
        },
        {
          name: 'isRequired',
          type: 'boolean',
          description: 'Marks the field as required.',
        },
        {
          name: 'isLoading',
          type: 'boolean',
          description: 'Shows a loading spinner in the trigger.',
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
          type: '(option: MultiSelectorOptionData) => ReactNode',
          description:
            'Custom render function for each selectable option in the dropdown. Not called for dividers, sections, or the select-all row.',
        },
        {
          name: 'indicatorPosition',
          type: "'start' | 'end'",
          description:
            'Which edge of the option row carries the checkbox. end pushes it to the far edge of the row, including on the select-all row.',
          default: "'start'",
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
            'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
        },
        {
          name: 'startIcon',
          type: 'IconType | ReactNode',
          description: 'Icon displayed at the start of the selector trigger.',
        },
        {
          name: 'hasClear',
          type: 'boolean',
          description: 'Shows a clear button when values are selected.',
          default: 'false',
        },
        {
          name: 'isDefaultOpen',
          type: 'boolean',
          description: 'Whether the dropdown starts open on mount.',
          default: 'false',
        },
        {
          name: 'renderTrigger',
          type: '(props: MultiSelectorRenderTriggerProps) => ReactNode',
          description:
            "Render the control the panel hangs off — a glyph in a list row, a chip, an icon button — instead of the selector's own field and button. Spread the given props ({ref, id, onClick, onKeyDown, onFocus, aria-haspopup, aria-expanded, aria-controls, aria-busy}) onto it; the listbox is anchored to that control and named by `label`. The field chrome (Field, status, clear, spinner) is not rendered. Pair with handleRef to open from a keystroke elsewhere.",
        },
        {
          name: 'handleRef',
          type: 'React.Ref<MultiSelectorHandle>',
          description:
            'Imperative handle with open(), close(), toggle() and isOpen(). Prefer it over mirroring open state in the parent; the selector owns its visibility.',
        },
        {
          name: 'onOpenChange',
          type: '(isOpen: boolean) => void',
          description:
            'Called whenever the panel opens or closes, however it happened: the trigger, the keyboard, a light dismiss, Escape, or the handle.',
        },
        {
          name: 'onClick',
          type: '(event: MouseEvent) => void',
          description:
            'Click handler on the trigger (or the renderTrigger control). Runs after the built-in toggle and cannot cancel it.',
        },
        {
          name: 'onFocus',
          type: '(event: FocusEvent) => void',
          description:
            "Focus handler on the trigger. Runs before the selector's own focus handling.",
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
    },
  ],
  usage: {
    anatomy,
    description:
      'A checkbox dropdown for selecting multiple values from a list. Selected items can display as a count, labels, or badges. Use it for filtering or when presenting a finite set of options where multiple choices are needed.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for a moderate, finite set of options where multiple choices are needed.',
      },
      {
        guidance: true,
        description:
          'Enable search filtering when the list exceeds ~15 options.',
      },
      {
        guidance: true,
        description:
          'Use renderOption for custom option rows; the checkbox affordance remains owned by MultiSelector.',
      },
      {
        guidance: true,
        description:
          'Enable select-all when most users will want all or nearly all options selected.',
      },
      {
        guidance: true,
        description:
          'Use inside InputGroup only when the control needs a short prefix or suffix addon as part of one decorated input surface; prefer count or labels trigger display so the group stays single-line.',
      },
      {
        guidance: true,
        description:
          'Use variant="secondary" when a multi-selector sits beside secondary buttons or segmented controls, and variant="ghost" when it sits beside ghost buttons. If validation status is needed there, prefer statusVariant="tooltip" so the toolbar height stays compact.',
      },
      {
        guidance: true,
        description:
          'Use presentation="adaptive" when the multi-selector should become a bottom sheet on compact touch screens.',
      },
      {
        guidance: false,
        description: 'Use for single-value selection; use Selector instead.',
      },
      {
        guidance: false,
        description: 'Show more than ~20 options without enabling search.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled MultiSelector in Tooltip to explain why it is disabled. Use the disabledMessage prop, which attaches the reason to the trigger itself.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "components": [
    {
      "name": "MultiSelector",
      "displayName": "Multi Selector",
      "description": "带复选框的多选下拉框，用于选择多个项目。",
      "propDescriptions": {
        "label": "用于无障碍的标签文本。",
        "options": "项目数组：字符串、带 `value`/`label`/`icon`/`disabled` 的对象、分隔线或分区。选项可以携带 `action`：一个节点——IconButton、Button、菜单触发器——由调用方渲染并命名。一旦任何选项这样设置，弹出层就是网格布局，其行将选项与其操作配对：Up/Down 移动行，行内末端箭头进入操作，Enter 触发操作，指针和触摸可直接按下，且按下它绝不会改变选择。",
        "value": "当前选中的值。",
        "onChange": "选择变化时调用。创建操作（`hasCreate`）会以 `{type: \"create\", query}` 作为第二个参数传入，并将查询追加到 `value`；调用方需在同一次更新中添加匹配的选项。其他所有变更不传描述符，因此单参数处理器仍可正常工作。",
        "changeAction": "变更时的异步操作。在 `onChange` 之后触发。",
        "placeholder": "未选择任何值时的占位文本。",
        "size": "选择器的尺寸变体。",
        "triggerDisplay": "如何在触发器中显示选中项。",
        "formatValue": "当 `triggerDisplay=\"count\"` 或 `\"labels\"` 时格式化触发器文本。接收选中项（`value` 加解析后的标签）；计数为 `items.length`。`triggerDisplay=\"badges\"` 不使用此项。",
        "maxBadges": "在显示“+N”之前最多显示多少个徽章。仅用于 `triggerDisplay=\"badges\"`。",
        "hasSelectAll": "是否显示全选复选框。",
        "selectAllLabel": "全选复选框的标签。",
        "hasSearch": "是否显示用于筛选选项的搜索输入框。用户输入时，匹配数量（或“未找到结果”）会通过礼貌的实时区域播报给屏幕阅读器。搜索字段具有内置辅助功能：前置放大镜图标，以及输入查询后出现的尾部清除（✕）按钮，用于重置查询并将焦点返回输入框。",
        "searchPlaceholder": "搜索输入框的占位文本。",
        "emptyText": "下拉面板没有可显示选项时显示的内容，并在面板打开时通过礼貌的实时区域播报。播报内容是该内容渲染出的文本，从 DOM 读取，因此元素会按其书写内容播报，`aria-hidden` 的部分会在两者中排除。`isLoading` 期间不显示。",
        "emptySearchText": "搜索查询没有匹配选项时在下拉面板中显示的内容，并同时通过礼貌的实时区域播报。播报内容是该内容渲染出的文本，从 DOM 读取，因此元素会按其书写内容播报，`aria-hidden` 的部分会在两者中排除。",
        "hasCreate": "与 `hasSearch` 一起使用时，如果输入的文本在搜索的不区分大小写匹配下不等于任何选项标签，会在列表最前面提供 `Create \"<query>\"` 行。选择该行，或在没有高亮项时按 Enter，会调用 `onChange`，将查询追加到 `value` 并附带 `{type: \"create\", query}` 描述符，然后清空搜索；调用方必须在同一次更新中为新值添加选项。`isLoading` 期间不提供任何内容。没有 `hasSearch` 时会在开发环境警告并且不提供任何内容。",
        "isDisabled": "禁用选择器。",
        "isReadOnly": "使选择器变为只读：选中值保持可见、可聚焦并包含在表单提交中，并通过 `aria-readonly` 保留其组合框身份。选择表面、清除操作和展开指示符会被移除。与 `isDisabled` 不同，控件不会变暗。两者同时设置时 `isDisabled` 优先。",
        "htmlName": "用于表单提交的 HTML `name` 属性。为每个选中值渲染一个隐藏输入框，类似原生多选。",
        "disabledMessage": "说明选择器为何被禁用。与 `isDisabled` 一起使用时，在触发器悬停和键盘聚焦时以工具提示显示原因；触发器仍可聚焦（`aria-disabled`），与所有禁用的选择器一样；激活仍被阻止。请使用此属性，而不是用 Tooltip 包裹已禁用的 MultiSelector。",
        "isLabelHidden": "在视觉上隐藏标签，同时保持其可访问。",
        "description": "显示在标签下方的辅助文本。",
        "isOptional": "将字段标记为可选。",
        "isRequired": "将字段标记为必填。",
        "isLoading": "在触发器中显示加载指示器。",
        "status": "带可选消息的校验状态。",
        "statusVariant": "状态消息相对于输入框的放置方式。`attached` 直接重叠在带边框输入框下方，且仅对 `input` 变体有效；`secondary` 和 `ghost` 选择器默认会将附加状态消息分离。对于紧凑的工具栏控件，请使用 `tooltip`。",
        "renderOption": "用于下拉框中每个可选项的自定义渲染函数。分隔线、分区或全选行不会调用。",
        "renderTrigger": "渲染面板所依附的控件——列表行中的字形、标签片、图标按钮——而不是选择器自身的字段和按钮。将给定的属性（`{ref, id, onClick, onKeyDown, onFocus, aria-haspopup, aria-expanded, aria-controls, aria-busy}`）展开到该控件上；列表框会锚定到该控件，并由 `label` 命名。字段外观（Field、状态、清除、加载指示器）不会渲染。与 `handleRef` 搭配，可从其他位置的按键打开。",
        "handleRef": "包含 `open()`、`close()`、`toggle()` 和 `isOpen()` 的命令式句柄。优先使用它，而不是在父组件中镜像打开状态；选择器自行管理可见性。",
        "onOpenChange": "面板每次打开或关闭时调用，无论原因如何：触发器、键盘、轻触关闭、Escape 或句柄。",
        "presentation": "选项列表的呈现方式。`adaptive` 在紧凑触摸屏上使用底部抽屉，否则使用锚定弹出层。",
        "onClick": "触发器（或 `renderTrigger` 控件）上的点击处理器。在内置切换逻辑之后运行，且无法取消它。",
        "onFocus": "触发器上的聚焦处理器。在选择器自身的聚焦处理之前运行。",
        "onKeyDown": "触发器按钮上的按键处理器。在内置键盘模型之后运行；对于它已处理并取消的按键会跳过。",
        "containerXstyle": "用于字段容器（标签、控件和状态整体）的 StyleX 样式。在 InputGroup 内（请改为设置 InputGroup 样式）或 `horizontal-labels` FormLayout 中无效。不接受根级 `xstyle`、`className` 和 `style`。",
        "containerClassName": "字段容器的类名。定位范围与 `containerXstyle` 相同。",
        "containerStyle": "字段容器的内联样式。定位范围与 `containerXstyle` 相同。",
        "controlXstyle": "用于视觉控件盒子的 StyleX 样式：绘制边框和背景并承载值、图标和末端控件的元素，绝不是触发按钮本身。",
        "controlClassName": "视觉控件盒子的类名。",
        "controlStyle": "视觉控件盒子的内联样式。",
        "variant": "视觉触发器样式。`input` 是用于表单的带边框输入处理；`secondary` 匹配当前主题的次要按钮（默认无边框且为中性填充），用于导航和工具栏；`ghost` 无边框且透明，匹配工具栏场景中的幽灵按钮。",
        "indicatorPosition": "选项行的哪一侧承载复选框。`end` 将其推到行的最远端，包括全选行。",
        "width": "字段宽度（数字 = 像素，字符串按原样使用，例如 `\"100%\"`）。用于设置整个字段（标签、控件和状态）的尺寸，使它们保持对齐。",
        "startIcon": "显示在选择器触发器起始位置的图标。",
        "hasClear": "选中值后显示清除按钮。",
        "isDefaultOpen": "挂载时下拉框是否默认打开。"
      }
    }
  ],
  "usage": {
    "description": "用于从列表中选择多个值的复选框下拉框。选中项可以显示为计数、标签或徽章。用于筛选，或呈现需要多选的有限选项集合。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于规模适中、有限的选项集合，且需要多选。"
      },
      {
        "guidance": true,
        "description": "当列表超过约 15 个选项时，启用搜索筛选。"
      },
      {
        "guidance": true,
        "description": "使用 `renderOption` 自定义选项行；复选框交互仍由 MultiSelector 负责。"
      },
      {
        "guidance": true,
        "description": "当大多数用户希望选中全部或几乎全部选项时，启用全选。"
      },
      {
        "guidance": true,
        "description": "仅当控件需要简短的前缀或后缀附加内容、作为同一个装饰输入表面的一部分时，才在 InputGroup 内使用；优先使用计数或标签触发器显示，以保持组为单行。"
      },
      {
        "guidance": true,
        "description": "当多选控件与次要按钮或分段控件并排时，使用 `variant=\"secondary\"`；当它与幽灵按钮并排时，使用 `variant=\"ghost\"`。如果此处需要校验状态，优先使用 `statusVariant=\"tooltip\"`，以保持工具栏高度紧凑。"
      },
      {
        "guidance": true,
        "description": "当多选控件在紧凑触摸屏上应变为底部抽屉时，使用 `presentation=\"adaptive\"`。"
      },
      {
        "guidance": false,
        "description": "用于单值选择；请改用 Selector。"
      },
      {
        "guidance": false,
        "description": "在未启用搜索的情况下显示超过约 20 个选项。"
      },
      {
        "guidance": false,
        "description": "用 Tooltip 包裹已禁用的 MultiSelector 来解释禁用原因。请使用 `disabledMessage` 属性，它会把原因附加到触发器本身。"
      }
    ],
    "anatomy": [
      {
        "name": "字段",
        "required": false,
        "description": "独立的 Field 外壳，提供标签和可选的支持内容；在 InputGroup 内省略。"
      },
      {
        "name": "触发器",
        "required": true,
        "description": "绘制样式的控件，显示当前选择或占位符，并在可编辑时打开选择表面。"
      },
      {
        "name": "通过 Icon 渲染的起始图标",
        "required": false,
        "description": "可选的语义前置图标或通过 Icon 渲染的图标组件。"
      },
      {
        "name": "调用方渲染的起始内容",
        "required": false,
        "description": "可选的自定义 React 内容，直接渲染在触发器起始位置。"
      },
      {
        "name": "触发器清除按钮",
        "required": false,
        "description": "共享的清除操作，在启用 `hasClear` 时移除所有选中值。"
      },
      {
        "name": "状态图标",
        "required": false,
        "description": "在附加或工具提示状态下替代展开指示符显示的状态字形。"
      },
      {
        "name": "指示符图标",
        "required": false,
        "description": "当状态呈现不替代它时显示的尾部尖角；反映折叠或展开状态。"
      },
      {
        "name": "搜索行",
        "required": false,
        "description": "面板标题栏，包含无边框搜索输入框和可选的清除操作。"
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
        "description": "用于某个选项或可选全选项的可选择行。"
      },
      {
        "name": "选项复选框指示符",
        "required": false,
        "description": "CheckboxInput 指示符，呈现每行的选中、未选中或不确定状态。"
      },
      {
        "name": "选项分隔线",
        "required": false,
        "description": "公共选项数据中提供的分隔线，用于分隔相邻的选项组。"
      },
      {
        "name": "分区标题",
        "required": false,
        "description": "带标签的选项行组的可见标题。"
      },
      {
        "name": "空状态",
        "required": false,
        "description": "共享面板内容没有选项或没有搜索结果时显示的消息。"
      },
      {
        "name": "指针弹出层",
        "required": false,
        "description": "锚定的绘制表面，在弹出层呈现方式中承载共享面板内容。"
      },
      {
        "name": "触摸抽屉标题",
        "required": false,
        "description": "底部抽屉呈现方式中，共享面板内容上方的标题。"
      },
      {
        "name": "触摸抽屉",
        "required": false,
        "description": "BottomSheet 表面，在底部抽屉呈现方式中承载同一面板内容。"
      }
    ]
  },
  "name": "MultiSelector",
  "displayName": "Multi Selector"
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'checkbox multi-select dropdown for finite sets like column toggles or filter facets',
  usage: {
    description:
      'A checkbox dropdown for selecting multiple values from a list. Selected items can display as a count, labels, or badges. Use it for filtering or when presenting a finite set of options where multiple choices are needed.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for a moderate, finite set of options where multiple choices are needed.',
      },
      {
        guidance: true,
        description:
          'Enable search filtering when the list exceeds ~15 options.',
      },
      {
        guidance: true,
        description:
          'renderOption for custom rows; checkbox affordance stays owned by MultiSelector.',
      },
      {
        guidance: true,
        description:
          'Enable select-all when most users will want all or nearly all options selected.',
      },
      {
        guidance: true,
        description:
          'Use inside InputGroup only for a short prefix or suffix addon; prefer count or labels trigger display so the group stays single-line.',
      },
      {
        guidance: true,
        description:
          'Use variant="secondary" beside secondary buttons or segmented controls and variant="ghost" beside ghost buttons; prefer statusVariant="tooltip" for compact validation status.',
      },
      {
        guidance: false,
        description: 'Use for single-value selection; use Selector instead.',
      },
      {
        guidance: false,
        description: 'Show more than ~20 options without enabling search.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled MultiSelector in Tooltip to explain why it is disabled. Use the disabledMessage prop, which attaches the reason to the trigger itself.',
      },
    ],
  },
  components: [
    {
      name: 'MultiSelector',
      displayName: 'Multi Selector',
      description: 'checkbox multi-select dropdown',
      propDescriptions: {
        label: 'a11y label',
        options:
          'items: strings, objects w/ value/label/icon/disabled, dividers, sections',
        value: 'selected values',
        onChange: 'callback on selection change',
        changeAction: 'async; fires after onChange',
        placeholder: 'text when nothing selected',
        size: 'size variant',
        variant:
          'visual trigger style: input bordered control, secondary control matching the theme secondary buttons, or ghost transparent control',
        triggerDisplay: 'how to show selected in trigger',
        formatValue:
          'formats count/labels trigger text; receives selected items',
        maxBadges: 'max badges before "+N"; badges mode only',
        hasSelectAll: 'show select-all checkbox',
        selectAllLabel: 'select-all label',
        hasSearch: 'show search input',
        searchPlaceholder: 'search placeholder',
        emptyText: 'panel content when there are no options',
        emptySearchText: 'panel content when the query matches nothing',
        hasCreate:
          'with hasSearch: first row is Create "<query>" when no option label matches; reported through onChange with a {type: "create", query} descriptor; caller adds the option',
        isDisabled: 'disables selector',
        isReadOnly:
          'read-only: preserves values, focus + form submission; removes menu, clear + disclosure',
        htmlName: 'HTML name attr; one hidden input per selected value.',
        disabledMessage:
          'why disabled; w/ isDisabled shows tooltip on hover/focus, trigger stays focusable via aria-disabled; use instead of Tooltip wrapper',
        isLabelHidden: 'visually hides label',
        description: 'helper text below label',
        isOptional: 'marks optional',
        isRequired: 'marks required',
        isLoading: 'spinner in trigger',
        status: 'validation status w/ optional message',
        statusVariant:
          'status message placement; secondary and ghost detach attached by default; use tooltip for compact toolbars.',
        renderOption:
          'custom render fn per selectable option; not dividers/sections/select-all',
        renderTrigger:
          'caller-rendered opener replacing the field+button; spread the given props; listbox anchored to it, named by label',
        handleRef: 'imperative open()/close()/toggle()/isOpen()',
        onOpenChange: 'fires on every open/close, whatever caused it',
        presentation:
          'popover, bottom-sheet, or compact-touch adaptive presentation',
        onClick:
          'trigger click; runs after the built-in toggle, cannot cancel it',
        onFocus: 'trigger focus; runs before built-in focus handling',
        onKeyDown: 'trigger keys; runs after the built-in keyboard model',
        containerXstyle:
          'StyleX styles for the field container; no effect in InputGroup or horizontal-labels FormLayout. No root xstyle/className/style.',
        containerClassName: 'Class name for the field container.',
        containerStyle: 'Inline styles for the field container.',
        controlXstyle:
          'StyleX styles for the visual control box (border, background, icons); not the trigger button.',
        controlClassName: 'Class name for the visual control box.',
        controlStyle: 'Inline styles for the visual control box.',
      },
    },
  ],
};
