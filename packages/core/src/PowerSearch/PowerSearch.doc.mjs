// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'PowerSearch',
  displayName: 'Power Search',
  category: 'Form Controls',
  keywords: [
    'powersearch',
    'search',
    'searchbar',
    'filter',
    'filterbar',
    'faceted',
    'querybuilder',
    'structured',
    'omnibar',
  ],
  props: [
    {
      name: 'config',
      type: 'PowerSearchConfig',
      description:
        'Configuration defining available fields, operators, and their value types.',
      required: true,
    },
    {
      name: 'filters',
      type: 'ReadonlyArray<PowerSearchFilter>',
      description: 'Currently active filters.',
      required: true,
    },
    {
      name: 'onChange',
      type: "(filters: ReadonlyArray<PowerSearchFilter>, changeType: 'add' | 'edit' | 'remove', index: number) => void",
      description:
        "Called when filters change. changeType is 'add', 'edit', or 'remove'. index is the affected filter's position.",
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the search input.',
      default: "'Search'",
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Visually hides the label while keeping it accessible.',
      default: 'true',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text shown when no filters are selected.',
      default: "'Search...'",
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description: 'Auto-focus the input on mount.',
      default: 'false',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description:
        'Show a clear-all button that removes every editable filter. Read-only filters stay.',
      default: 'true',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description: 'Prevent adding, editing, or removing filters.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disables the entire component.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the search is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the input focusable via aria-disabled (input stays blocked). Use this instead of wrapping a disabled PowerSearch in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description: 'Validation status object with type and optional message.',
    },
    {
      name: 'startIcon',
      type: 'ReactNode | IconType',
      description:
        'Icon to display at the start of the input, before any filter tokens. Forwarded to the internal Tokenizer. Accepts a semantic icon name, an SVG icon component, or a ReactNode directly.',
      slotElements: [{__element: 'Icon', props: {icon: 'search', size: 'sm'}}],
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached'",
      description:
        'How the status message is placed relative to the input. attached overlaps directly below the input (bordered treatment); detached floats below as a separate element with spacing.',
      default: "'attached'",
    },
    {
      name: 'maxTokenLength',
      type: 'number',
      description: 'Max character length for filter value display in tokens.',
      default: '40',
    },
    {
      name: 'maxOperatorMenuItems',
      type: 'number',
      description:
        'Maximum suggestions shown in string and entity value typeaheads. Does not affect the main field search menu or enum value menus.',
      default: '10',
    },
    {
      name: 'maxSearchResults',
      type: 'number',
      description:
        'Max ranked results for a non-empty query. Does not affect a field value editor. Browsing with an empty query shows up to 1,000 fields.',
      default: '10',
    },
    {
      name: 'menuWidth',
      type: 'number',
      description:
        'Width in pixels for the main field/search menu. Does not affect field value editors.',
    },
    {
      name: 'popoverSaveButtonLabel',
      type: 'string',
      description: 'Label for the save button in the edit popover.',
      default: "'Apply'",
    },
    {
      name: 'timezoneID',
      type: 'string',
      description:
        'IANA zone a date-only date_absolute value, and each absolute part of a date_range, is read and written in: the day shows, edits and stores (as that midnight) in it; unset, a day is its UTC day. A date_absolute with isDateOnly: false shows and edits its date and time in it; unset, in the viewer\'s zone. E.g. "America/New_York". Date values are written in the InternationalizationProvider calendar, such as calendar="persian"; filter values stay Unix seconds.',
    },
    {
      name: 'handleRef',
      type: 'Ref<PowerSearchHandle>',
      description:
        'Imperative handle with focusTypeahead() and blurTypeahead() methods.',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Content to display at the end of the input row. Useful for action buttons or other controls.',
      slotElements: [
        {__element: 'Icon', props: {icon: 'chevronDown', size: 'sm'}},
        {__element: 'Badge', props: {label: '3'}},
      ],
    },
    {
      name: 'resultCount',
      type: 'number | string',
      description:
        'Number of results matching the current filters. When a number, formatted as "N results". When a string, displayed as-is. Changes are announced to screen readers via a polite live region.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size of the search input and tokens.',
      default: "'md'",
    },
    {
      name: 'menuWidth',
      type: 'number',
      description:
        'Maximum width for the operator/value dropdown menu in pixels.',
    },
    {
      name: 'maxOperatorMenuItems',
      type: 'number',
      description:
        'Maximum number of items displayed in the operator dropdown.',
    },
    {
      name: 'tokenOverflowBehavior',
      type: "'none' | 'unfocusedInline' | 'unfocusedLayer'",
      description:
        'Controls how tokens overflow when the container is too narrow. Forwarded to Tokenizer.',
      default: "'none'",
    },
    {
      name: 'onFocus',
      type: '(e: React.FocusEvent) => void',
      description: 'Fires when focus enters the search input.',
    },
    {
      name: 'onBlur',
      type: '(e: React.FocusEvent) => void',
      description: 'Fires when focus leaves the search input.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization. Must be a stylex.create() value.',
    },
    {
      name: 'presentation',
      type: "'popover' | 'bottom-sheet' | 'adaptive'",
      description:
        'How the field presents filter editing. adaptive (the default) uses the bottom sheet on compact touch screens and the popover otherwise, resolved the same way Selector resolves it; the server render and the hydrating render are the popover. popover is the tokenizer field with its typeahead and the editor popover on every device. bottom-sheet makes the whole field, on every device, one trigger showing display-only filter tokens: it opens a Filters sheet listing the filters as rows that edit or remove a filter, with Add filter, Done, and Clear all (which asks first and keeps read-only filters); an Add filter sheet with the fields (or the content search with inline suggestions) opens above it, and a value step that stages operator → value and confirms from its footer opens above that. Dismissing a step reveals the one beneath. The flow edits a draft: adding, editing and removing filters and Clear all change the draft, and onChange is called when Done applies it, once per edit in order; dismissing the flow with a changed draft asks before discarding it. List values edit through the Tokenizer\'s own sheet. In the sheet presentation menuWidth and tokenOverflowBehavior have no surface to act on and warn in development. Pass presentation="popover" to keep the tokenizer field and the editor popover on every device.',
      default: "'adaptive'",
    },
  ],
  examples: [
    {
      label: 'Keep the popover on every device',
      code: `const [filters, setFilters] = useState([]);
<PowerSearch
  config={config}
  filters={filters}
  onChange={next => setFilters(next)}
  presentation="popover"
/>`,
    },
  ],
  // `config` and `filters` are custom values the docsite preview cannot
  // generate automatically. Keep this small, but include an initial token so
  // the Properties tab demonstrates a realistic controlled PowerSearch.
  playground: {
    defaults: {
      config: {
        name: 'IssueSearch',
        fields: [
          {
            key: 'status',
            label: 'Status',
            defaultOperator: 'is',
            operators: [
              {
                key: 'is',
                label: 'is',
                value: {
                  type: 'enum',
                  values: [
                    {value: 'open', label: 'Open'},
                    {value: 'closed', label: 'Closed'},
                  ],
                },
              },
            ],
          },
          {
            key: 'title',
            label: 'Title',
            defaultOperator: 'contains',
            operators: [
              {key: 'contains', label: 'contains', value: {type: 'string'}},
            ],
          },
        ],
      },
      filters: [
        {
          field: 'status',
          operator: 'is',
          value: {type: 'enum', value: 'open'},
        },
      ],
    },
  },
  usage: {
    description:
      'PowerSearch is a structured filter bar where each token represents a field, operator, and value. Use it for complex multi-dimensional filtering when users need to combine multiple search criteria. For simple single-field search, use a text input instead. Host `data-*` attributes, `data-testid` included, reach the primary control: the combobox input in the popover presentation and the trigger button in the sheet presentation. The `components.Token` and `components.Editor` defaults, `PowerSearchToken` and `PowerSearchFilterEditor`, pass them to the token and the editor root.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Define clear, descriptive field names and aliases so users can quickly find the filter they need.',
      },
      {
        guidance: true,
        description:
          'Provide a result count to give users feedback on how their filters affect the data set.',
      },
      {
        guidance: false,
        description:
          'Use PowerSearch for simple keyword searches; a standard text input is more appropriate for single-field lookups.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled PowerSearch in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
  theming: {
    targets: [{className: 'astryx-power-search'}],
    vars: [
      {
        name: '--_power-search-sheet-hit-inset',
        description:
          "Outset of the invisible hit area of the touch sheet's icon-sized actions (the Filters header's Add filter and each row's remove button), applied to a ::after overlay. 0 on a fine pointer; negative on a coarse one, which grows the action to a 44px touch target without changing what is drawn.",
        default: '0px',
        private: true,
      },
      {
        name: '--_power-search-sheet-hit-content',
        description:
          'Whether the touch sheet\'s invisible hit overlay exists. `none` on a fine pointer, so no ::after is generated and hover still reaches the action; `""` on a coarse one, where the overlay provides the 44px touch target.',
        default: 'none',
        private: true,
      },
    ],
  },
};

// -------------------------------------------------------
// Auto-generated translations below. Do not edit manually.
// Regenerate with the dense compression protocol.
// See .context/decisions/dense-compression-protocol.md
// -------------------------------------------------------

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "PowerSearch",
  "displayName": "Power Search",
  "props": [
    {
      "name": "config",
      "type": "PowerSearchConfig",
      "description": "定义可用字段、运算符及其值类型的配置。",
      "required": true
    },
    {
      "name": "filters",
      "type": "ReadonlyArray<PowerSearchFilter>",
      "description": "当前生效的筛选条件。",
      "required": true
    },
    {
      "name": "onChange",
      "type": "(filters: ReadonlyArray<PowerSearchFilter>, changeType: 'add' | 'edit' | 'remove', index: number) => void",
      "description": "筛选条件变化时调用。changeType 为 'add'、'edit' 或 'remove'。index 是受影响筛选条件的位置。",
      "required": true
    },
    {
      "name": "label",
      "type": "string",
      "description": "搜索输入框的无障碍标签。",
      "default": "'Search'"
    },
    {
      "name": "isLabelHidden",
      "type": "boolean",
      "description": "在视觉上隐藏标签，同时保持其可访问。",
      "default": "true"
    },
    {
      "name": "placeholder",
      "type": "string",
      "description": "未选择任何筛选条件时显示的占位符文本。",
      "default": "'Search...'"
    },
    {
      "name": "hasAutoFocus",
      "type": "boolean",
      "description": "挂载时自动聚焦输入框。",
      "default": "false"
    },
    {
      "name": "hasClear",
      "type": "boolean",
      "description": "显示一个清除全部按钮，移除所有可编辑的筛选条件。只读筛选条件保留。",
      "default": "true"
    },
    {
      "name": "isReadOnly",
      "type": "boolean",
      "description": "阻止添加、编辑或移除筛选条件。",
      "default": "false"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "禁用整个组件。",
      "default": "false"
    },
    {
      "name": "disabledMessage",
      "type": "string",
      "description": "解释搜索为何被禁用。与 isDisabled 一起使用时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持输入框可聚焦（输入仍被阻止）。请使用此属性，而不是将禁用的 PowerSearch 包裹在 Tooltip 中。禁用控件会吞掉外部 Tooltip 所需的悬停事件。"
    },
    {
      "name": "status",
      "type": "{type: 'warning' | 'error' | 'success', message?: string}",
      "description": "包含 type 和可选 message 的验证状态对象。"
    },
    {
      "name": "startIcon",
      "type": "ReactNode | IconType",
      "description": "在输入框起始处、任何筛选令牌之前显示的图标。会转发给内部 Tokenizer。接受语义图标名称、SVG 图标组件或直接传入 ReactNode。"
    },
    {
      "name": "statusVariant",
      "type": "'attached' | 'detached'",
      "description": "状态消息相对于输入框的放置方式。attached 直接重叠在输入框下方（带边框处理）；detached 作为独立元素悬浮在下方并带有间距。",
      "default": "'attached'"
    },
    {
      "name": "maxTokenLength",
      "type": "number",
      "description": "令牌中筛选值显示的最大字符长度。",
      "default": "40"
    },
    {
      "name": "maxOperatorMenuItems",
      "type": "number",
      "description": "运算符下拉菜单中显示的最大项数。",
      "default": "10"
    },
    {
      "name": "maxSearchResults",
      "type": "number",
      "description": "非空查询的最大排名结果数。不影响字段值编辑器。空查询浏览最多显示 1,000 个字段。",
      "default": "10"
    },
    {
      "name": "menuWidth",
      "type": "number",
      "description": "运算符/值下拉菜单的最大宽度（像素）。"
    },
    {
      "name": "popoverSaveButtonLabel",
      "type": "string",
      "description": "编辑弹出框中保存按钮的标签。",
      "default": "'Apply'"
    },
    {
      "name": "timezoneID",
      "type": "string",
      "description": "仅日期 date_absolute 值以及 date_range 的每个绝对部分所读取和写入的 IANA 时区：日期在其中显示、编辑和存储（作为该午夜）；未设置时，日期为其 UTC 日期。isDateOnly: false 的 date_absolute 会在其中显示和编辑其日期与时间；未设置时，使用查看者的时区。例如 \"America/New_York\"。日期值以 InternationalizationProvider 日历写入，例如 calendar=\"persian\"；筛选值保持为 Unix 秒。"
    },
    {
      "name": "handleRef",
      "type": "Ref<PowerSearchHandle>",
      "description": "带有 focusTypeahead() 和 blurTypeahead() 方法的命令式句柄。"
    },
    {
      "name": "endContent",
      "type": "ReactNode",
      "description": "在输入行末尾显示的内容。适用于操作按钮或其他控件。"
    },
    {
      "name": "resultCount",
      "type": "number | string",
      "description": "与当前筛选条件匹配的结果数。为数字时，格式化为 \"N results\"。为字符串时，按原样显示。变化会通过礼貌的实时区域向屏幕阅读器宣布。"
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "description": "搜索输入框和令牌的尺寸。",
      "default": "'md'"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义的 StyleX 样式。必须是 stylex.create() 的值。"
    },
    {
      "name": "presentation",
      "type": "'popover' | 'bottom-sheet' | 'adaptive'",
      "description": "字段如何呈现筛选编辑。adaptive（默认）在紧凑触摸屏上使用底部工作表，否则使用弹出框，解析方式与 Selector 相同；服务器渲染和水合渲染均为弹出框。popover 在任何设备上都使用带预输入的令牌化字段和编辑器弹出框。bottom-sheet 在任何设备上都将整个字段变成一个触发器，仅显示筛选令牌：它会打开一个“筛选条件”工作表，将筛选条件列为可编辑或删除的行，并提供“添加筛选条件”、“完成”和“全部清除”（会先询问并保留只读筛选条件）；在其上方会打开一个包含字段（或带内联建议的内容搜索）的“添加筛选条件”工作表，再上方是一个值步骤，用于暂存运算符 → 值并从其页脚确认。关闭一个步骤会显示下方的步骤。该流程编辑草稿：添加、编辑、删除筛选条件以及“全部清除”都会更改草稿；当“完成”应用草稿时，会按顺序为每次编辑调用一次 onChange；草稿有更改时关闭流程会先询问是否丢弃。列表值通过 Tokenizer 自带的工作表编辑。在 sheet 呈现中，menuWidth 和 tokenOverflowBehavior 没有可作用的表面，并会在开发模式下警告。传入 presentation=\"popover\" 可在所有设备上保留令牌化字段和编辑器弹出框。",
      "default": "'adaptive'"
    }
  ],
  "usage": {
    "description": "PowerSearch 是一个结构化筛选栏，每个令牌代表一个字段、运算符和值。当用户需要组合多个搜索条件时，用于复杂的多维筛选。简单单字段搜索请改用文本输入框。宿主 `data-*` 属性（包括 `data-testid`）会传到主控件：popover 呈现中是组合框输入框，sheet 呈现中是触发按钮。`components.Token` 和 `components.Editor` 的默认值 `PowerSearchToken` 和 `PowerSearchFilterEditor`，会将它们传给令牌和编辑器根元素。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "定义清晰、描述性的字段名称和别名，让用户能快速找到所需的筛选条件。"
      },
      {
        "guidance": true,
        "description": "提供结果计数，让用户了解筛选条件对数据集的影响。"
      },
      {
        "guidance": false,
        "description": "简单关键词搜索请使用 PowerSearch；标准文本输入框更适合单字段查找。"
      },
      {
        "guidance": false,
        "description": "将禁用的 PowerSearch 包裹在 Tooltip 中以解释禁用原因；禁用控件会吞掉包装层所需的悬停事件。请改用 disabledMessage 属性。"
      }
    ]
  },
  "propDescriptions": {
    "config": "定义可用字段、运算符及其值类型的配置。",
    "filters": "当前生效的筛选条件。",
    "onChange": "筛选条件变化时调用。changeType 为 'add'、'edit' 或 'remove'。index 是受影响筛选条件的位置。",
    "label": "搜索输入框的无障碍标签。",
    "isLabelHidden": "在视觉上隐藏标签，同时保持其可访问。",
    "placeholder": "未选择任何筛选条件时显示的占位符文本。",
    "hasAutoFocus": "挂载时自动聚焦输入框。",
    "hasClear": "显示一个清除全部按钮，移除所有可编辑的筛选条件。只读筛选条件保留。",
    "isReadOnly": "阻止添加、编辑或移除筛选条件。",
    "isDisabled": "禁用整个组件。",
    "disabledMessage": "解释搜索为何被禁用。与 isDisabled 一起使用时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持输入框可聚焦（输入仍被阻止）。请使用此属性，而不是将禁用的 PowerSearch 包裹在 Tooltip 中。禁用控件会吞掉外部 Tooltip 所需的悬停事件。",
    "status": "包含 type 和可选 message 的验证状态对象。",
    "startIcon": "在输入框起始处、任何筛选令牌之前显示的图标。会转发给内部 Tokenizer。接受语义图标名称、SVG 图标组件或直接传入 ReactNode。",
    "statusVariant": "状态消息相对于输入框的放置方式。attached 直接重叠在输入框下方（带边框处理）；detached 作为独立元素悬浮在下方并带有间距。",
    "maxTokenLength": "令牌中筛选值显示的最大字符长度。",
    "maxOperatorMenuItems": "运算符下拉菜单中显示的最大项数。",
    "maxSearchResults": "非空查询的最大排名结果数。不影响字段值编辑器。空查询浏览最多显示 1,000 个字段。",
    "menuWidth": "运算符/值下拉菜单的最大宽度（像素）。",
    "popoverSaveButtonLabel": "编辑弹出框中保存按钮的标签。",
    "timezoneID": "仅日期 date_absolute 值以及 date_range 的每个绝对部分所读取和写入的 IANA 时区：日期在其中显示、编辑和存储（作为该午夜）；未设置时，日期为其 UTC 日期。isDateOnly: false 的 date_absolute 会在其中显示和编辑其日期与时间；未设置时，使用查看者的时区。例如 \"America/New_York\"。日期值以 InternationalizationProvider 日历写入，例如 calendar=\"persian\"；筛选值保持为 Unix 秒。",
    "handleRef": "带有 focusTypeahead() 和 blurTypeahead() 方法的命令式句柄。",
    "endContent": "在输入行末尾显示的内容。适用于操作按钮或其他控件。",
    "resultCount": "与当前筛选条件匹配的结果数。为数字时，格式化为 \"N results\"。为字符串时，按原样显示。变化会通过礼貌的实时区域向屏幕阅读器宣布。",
    "size": "搜索输入框和令牌的尺寸。",
    "tokenOverflowBehavior": "控制容器过窄时令牌的溢出方式。转发给 Tokenizer。",
    "onFocus": "焦点进入搜索输入框时触发。",
    "onBlur": "焦点离开搜索输入框时触发。",
    "xstyle": "用于布局自定义的 StyleX 样式。必须是 stylex.create() 的值。",
    "presentation": "字段如何呈现筛选编辑。adaptive（默认）在紧凑触摸屏上使用底部工作表，否则使用弹出框，解析方式与 Selector 相同；服务器渲染和水合渲染均为弹出框。popover 在任何设备上都使用带预输入的令牌化字段和编辑器弹出框。bottom-sheet 在任何设备上都将整个字段变成一个触发器，仅显示筛选令牌：它会打开一个“筛选条件”工作表，将筛选条件列为可编辑或删除的行，并提供“添加筛选条件”、“完成”和“全部清除”（会先询问并保留只读筛选条件）；在其上方会打开一个包含字段（或带内联建议的内容搜索）的“添加筛选条件”工作表，再上方是一个值步骤，用于暂存运算符 → 值并从其页脚确认。关闭一个步骤会显示下方的步骤。该流程编辑草稿：添加、编辑、删除筛选条件以及“全部清除”都会更改草稿；当“完成”应用草稿时，会按顺序为每次编辑调用一次 onChange；草稿有更改时关闭流程会先询问是否丢弃。列表值通过 Tokenizer 自带的工作表编辑。在 sheet 呈现中，menuWidth 和 tokenOverflowBehavior 没有可作用的表面，并会在开发模式下警告。传入 presentation=\"popover\" 可在所有设备上保留令牌化字段和编辑器弹出框。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Structured filter bar where each token represents filter (field+operator+value). Users select fields from typeahead dropdown, configure operators+values in edit popover, manage filters as removable tokens.',
  usage: {
    description:
      'PowerSearch is a structured filter bar where each token represents a field, operator, and value. Use it for complex multi-dimensional filtering when users need to combine multiple search criteria. For simple single-field search, use a text input instead. Host data-* attrs (data-testid incl.) reach the primary control: combobox input (popover) or trigger button (sheet); PowerSearchToken/PowerSearchFilterEditor pass them to token/editor root.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Define clear, descriptive field names and aliases so users can quickly find the filter they need.',
      },
      {
        guidance: true,
        description:
          'Provide a result count to give users feedback on how their filters affect the data set.',
      },
      {
        guidance: false,
        description:
          'Use PowerSearch for simple keyword searches; a standard text input is more appropriate for single-field lookups.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled PowerSearch in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
  propDescriptions: {
    config: 'Configuration defining available fields, operators, value types.',
    filters: 'Currently active filters.',
    onChange:
      "Called on filter change. changeType is 'add', 'edit', or 'remove'. index is affected filter position.",
    label: 'Accessible label for search input.',
    isLabelHidden: 'Visually hides label while keeping accessible.',
    placeholder: 'Text shown when no filters selected.',
    hasAutoFocus: 'Auto-focus input on mount.',
    hasClear:
      'Show clear-all button; removes editable filters, keeps read-only ones.',
    isReadOnly: 'Prevent adding, editing, or removing filters.',
    isDisabled: 'Disables entire component.',
    status: 'Validation status object w/ type + optional message.',
    startIcon:
      'Icon at input start, before filter tokens. Forwarded to internal Tokenizer.',
    statusVariant:
      'How status message is placed: attached overlaps below input; detached floats below w/ spacing.',
    maxTokenLength: 'Max char length for filter value display in tokens.',
    maxOperatorMenuItems:
      'Max suggestions in string/entity value typeaheads; excludes main field search + enum menus.',
    maxSearchResults:
      'Max ranked results for a non-empty query; excludes value editors.',
    menuWidth: 'Main field/search menu width in pixels.',
    popoverSaveButtonLabel: 'Label for save button in edit popover.',
    timezoneID:
      'IANA zone a date-only value reads and writes in; unset, its UTC day. Dates show in the provider calendar.',
    handleRef:
      'Imperative handle w/ focusTypeahead() + blurTypeahead() methods.',
    endContent:
      'Content at end of input row. Useful for action buttons or controls.',
    resultCount:
      'Result count matching current filters. Number formatted as "N results"; string displayed as-is.',
    size: 'Search input+token size.',
    xstyle:
      'StyleX styles for layout customization. Must be stylex.create() value.',
    presentation:
      "'adaptive' (default: sheet on compact touch, else popover; SSR/hydration render popover) | 'popover' (tokenizer field + editor popover, every device) | 'bottom-sheet' (one trigger with display-only tokens + stacked Filters / Add filter / value sheets; rows remove inline; Clear all confirms, keeps read-only; list values via Tokenizer's sheet). Sheet: menuWidth/tokenOverflowBehavior inert (dev warning). presentation=\"popover\" keeps the popover on every device.",
  },
};
