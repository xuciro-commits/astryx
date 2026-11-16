// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TextInput',
  playground: {
    defaults: {label: 'Name', value: 'Jordan'},
  },
  displayName: 'Text Input',
  category: 'Form Controls',
  keywords: ["textinput","textfield","input","search","clearable","prefix","suffix","adornment","validation"],
  props: [
    {
      name: 'type',
      type: "'text' | 'password' | 'email' | 'search' | 'tel' | 'url'",
      description:
        'The HTML input type. `email`, `tel` and `url` also bring up the matching touch keyboard (email, phone pad, URL); `search` makes the field a search box (pair it with `enterKeyHint="search"` for a Search key on iOS; Chrome on Android shows one for `type="search"` alone).',
      default: "'text'",
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Label text for the input: always rendered for accessibility.',
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: 'Current value of the input.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string, e: ChangeEvent<HTMLInputElement>) => void',
      description: 'Callback fired when the input value changes.',
    },
    {
      name: 'changeAction',
      type: '(value: string, e: ChangeEvent<HTMLInputElement>) => void | Promise<void>',
      description:
        'Async action fired after onChange (if not prevented). Triggers optimistic update and shows a loading spinner while pending.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size variant of the input.',
      default: "'md'",
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        'Visually hides the label while keeping it accessible to screen readers.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Description text displayed between the label and input.',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description:
        'Displays an "Optional" indicator next to the label. Mutually exclusive with isRequired.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description:
        'Displays a "Required" indicator next to the label and sets aria-required. Mutually exclusive with isOptional.',
      default: 'false',
    },
    {
      name: 'onEnter',
      type: '() => void',
      description:
        'Callback fired when the user presses the Enter key. IME-safe: Enter used to commit a Japanese/Chinese/Korean conversion does not fire it.',
    },
    {
      name: 'onKeyDown',
      type: '(e: KeyboardEvent<HTMLInputElement>) => void',
      description: 'Callback fired on keydown events on the input.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Disables the input, preventing interaction and dimming the element.',
      default: 'false',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description:
        'Makes the input read-only: the value is shown at full opacity and still submits with the form, but cannot be edited. Unlike isDisabled, a read-only input is not dimmed and keeps its form value. isDisabled takes precedence when both are set.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the input is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the input focusable via aria-disabled (the field becomes read-only). Use this instead of wrapping a disabled TextInput in Tooltip, so the reason is attached to the field itself.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Puts the input in a loading state, showing a spinner and setting aria-busy.',
      default: 'false',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text shown when the input is empty.',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description:
        'Tooltip text displayed in an info icon at the end of the label.',
    },
    {
      name: 'startIcon',
      type: 'IconType',
      description:
        'SVG icon component displayed at the start of the input. See `astryx docs icons` for valid semantic names.',
    },
    {
      name: 'status',
      type: "{type: 'error' | 'warning' | 'success', message?: string}",
      description:
        'Validation status: applies a colored border and status icon. If message is provided, displays a floating message below the input. Error type also sets aria-invalid.',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description:
        'How the status message is placed relative to the input. attached overlaps directly below the input (bordered treatment); detached floats below as a separate element with spacing; tooltip hides the message box and surfaces it in a tooltip on the status icon.',
      default: "'attached'",
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description:
        'Shows a clear (\u00d7) button when the input has a value. Clicking it clears the value and returns focus to the input.',
      default: 'false',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description: 'Automatically focuses the input on mount.',
      default: 'false',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        'The HTML name attribute for the input, useful for form submissions.',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned. Without a width the field can shrink with its row, so a filter bar never overflows; use `<HStack wrap="wrap">` when the controls should move to a second line instead.',
    },
    {
      name: 'autoComplete',
      type: 'string',
      description:
        'The native autocomplete attribute, forwarded to the input unchanged. Does not affect the controlled value. It is also how AutoFill knows what a field holds: tag sign-in, address and payment fields (`username`, `new-password`, `one-time-code`, `email`, `tel`, `street-address`, …).',
    },
    {
      name: 'enterKeyHint',
      type: "'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'",
      description:
        'What the Return key of a touch keyboard says (the native `enterkeyhint`). iOS gives `done`, `go`, `next`, `search` and `send` their own key (a glyph on iOS 26: a checkmark, an arrow, a chevron, a magnifier, an up arrow); `enter` and `previous` keep the plain Return key. Chrome on Android (Gboard) gives every value its own key, `enter` and `previous` included; with no hint the key reads Next while another field follows, and a `type="url"` field shows Next instead of `go` while another field follows. It only labels the key: what Enter does stays with your handlers.',
    },
    {
      name: 'inputMode',
      type: "'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'",
      description:
        'Which touch keyboard the field asks for (the native `inputmode`) without changing what it accepts: `numeric` brings up the number pad, `decimal` the decimal pad, `tel` the phone pad, `search` the web-search keyboard (whose Return key reads Go on iOS even with `enterKeyHint="search"`; Chrome on Android shows the Enter key for `inputMode="search"` alone).',
    },
    {
      name: 'autoCapitalize',
      type: "'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'",
      description:
        'When a touch keyboard capitalizes as you type (the native `autocapitalize`). Unset, iOS capitalizes sentences, except in a URL field. `off` and `none` never capitalize; `on` and `sentences` capitalize each sentence.',
    },
    {
      name: 'hasAutoCorrect',
      type: 'boolean',
      description:
        'Whether a touch keyboard corrects words as you type (the native `autocorrect`). Unset, the browser decides; turn it off for usernames, codes and other values that are not words.',
    },
    {
      name: 'hasSpellCheck',
      type: 'boolean',
      description:
        'Whether misspelled words are underlined (the native `spellcheck`). Unset, the browser decides.',
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
      description: 'Class name for the field container. Same targeting as `containerXstyle`.',
    },
    {
      name: 'containerStyle',
      type: 'CSSProperties',
      description: 'Inline styles for the field container. Same targeting as `containerXstyle`.',
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
  theming: {
    targets: [
      {className: 'astryx-text-input', visualProps: ['size', 'status'], states: ['disabled', 'readonly']},
    ],
  },
  usage: {
    description:
      'TextInput collects short-form text like names, emails, or search queries. Use it for single-line values where the expected input is brief. Pair it with validation status to guide users through required or formatted fields.',
    bestPractices: [
      {guidance: true, description: 'Always provide a visible label so users know what the field is for. Only hide the label when surrounding context makes it obvious, like a search bar with a magnifying-glass icon.'},
      {guidance: true, description: 'Use validation status with a message to explain what went wrong: "Email must include @" is better than just turning the border red.'},
      {guidance: true, description: 'Size the input to match the expected content length so users can gauge how much to type: small for zip codes, medium for names, large for URLs.'},
      {guidance: true, description: 'Add a clear button for search and filter inputs so users can quickly reset without selecting all text.'},
      {guidance: true, description: 'Tell a touch keyboard what the field holds: `type="email"`, `"tel"` or `"url"` for those values, `inputMode="numeric"` for digits that are not a number (a one-time code), `enterKeyHint` for what Return does (Search, Send, Next), and `autoComplete` so AutoFill can fill it.'},
      {guidance: false, description: "Don't use placeholder text as a replacement for a label; placeholders disappear on focus and are not reliably read by screen readers."},
      {guidance: false, description: "Don't use TextInput for multi-line content like comments or descriptions; use TextArea instead."},
      {guidance: false, description: "Don't mark every field as required; only flag mandatory fields so users are not overwhelmed by validation errors."},
      {guidance: false, description: "Don't wrap a disabled TextInput in Tooltip to explain why it's disabled. Use the disabledMessage prop, which attaches the reason to the field itself."},
    ],
    anatomy: [
      {name: 'Label', required: true, description: 'Text that identifies the field. Always rendered for accessibility even when visually hidden.'},
      {name: 'Description', required: false, description: 'Helper text between the label and the input that provides additional context or formatting hints.'},
      {name: 'Start icon', required: false, description: 'A leading icon inside the input that hints at the expected content, like a magnifying glass for search.'},
      {name: 'Placeholder', required: false, description: 'Hint text shown when the input is empty. Disappears on focus.'},
      {name: 'Clear button', required: false, description: 'A trailing × button that resets the value and returns focus to the input.'},
      {name: 'Spinner', required: false, description: 'Loading indicator that appears during async actions like server-side validation.'},
      {name: 'Status icon', required: false, description: 'A trailing icon (error, warning, or success) that communicates validation state.'},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "TextInput",
  "displayName": "Text Input",
  "props": [
    {
      "name": "type",
      "type": "'text' | 'password' | 'email' | 'search' | 'tel' | 'url'",
      "description": "HTML 输入类型。`email`、`tel` 和 `url` 还会调出匹配的触摸键盘（电子邮件、电话键盘、URL）；`search` 会将字段变为搜索框（在 iOS 上配合 `enterKeyHint=\"search\"` 可获得 Search 键；Android 上的 Chrome 仅凭 `type=\"search\"` 就会显示 Search 键）。",
      "default": "'text'"
    },
    {
      "name": "label",
      "type": "string",
      "description": "输入框的标签文本：始终为可访问性而渲染。",
      "required": true
    },
    {
      "name": "value",
      "type": "string",
      "description": "输入框的当前值。",
      "required": true
    },
    {
      "name": "onChange",
      "type": "(value: string, e: ChangeEvent<HTMLInputElement>) => void",
      "description": "输入值变化时触发的回调。"
    },
    {
      "name": "changeAction",
      "type": "(value: string, e: ChangeEvent<HTMLInputElement>) => void | Promise<void>",
      "description": "在 onChange 之后触发的异步操作（如果未被阻止）。会触发乐观更新，并在等待期间显示加载指示器。"
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "description": "输入框的尺寸变体。",
      "default": "'md'"
    },
    {
      "name": "isLabelHidden",
      "type": "boolean",
      "description": "在视觉上隐藏标签，同时保持屏幕阅读器可访问。",
      "default": "false"
    },
    {
      "name": "description",
      "type": "string",
      "description": "显示在标签和输入框之间的描述文本。"
    },
    {
      "name": "isOptional",
      "type": "boolean",
      "description": "在标签旁显示 \"Optional\" 指示。与 isRequired 互斥。",
      "default": "false"
    },
    {
      "name": "isRequired",
      "type": "boolean",
      "description": "在标签旁显示 \"Required\" 指示并设置 aria-required。与 isOptional 互斥。",
      "default": "false"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "禁用输入框，阻止交互并使元素变暗。",
      "default": "false"
    },
    {
      "name": "isReadOnly",
      "type": "boolean",
      "description": "将输入框设为只读：值以完全不透明显示，仍随表单提交，但不可编辑。与 isDisabled 不同，只读输入框不会变暗，并保留其表单值。两者同时设置时 isDisabled 优先。",
      "default": "false"
    },
    {
      "name": "disabledMessage",
      "type": "string",
      "description": "解释输入框被禁用的原因。配合 isDisabled 使用时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持输入框可聚焦（字段变为只读）。用它代替用 Tooltip 包裹禁用的 TextInput，使原因附加到字段本身。"
    },
    {
      "name": "isLoading",
      "type": "boolean",
      "description": "将输入框置于加载状态，显示加载指示器并设置 aria-busy。",
      "default": "false"
    },
    {
      "name": "placeholder",
      "type": "string",
      "description": "输入框为空时显示的占位符文本。"
    },
    {
      "name": "labelTooltip",
      "type": "string",
      "description": "在标签末尾的信息图标中显示的工具提示文本。"
    },
    {
      "name": "startIcon",
      "type": "IconType",
      "description": "显示在输入框起始处的 SVG 图标组件。有效语义名称请参阅 `astryx docs icons`。"
    },
    {
      "name": "status",
      "type": "{type: 'error' | 'warning' | 'success', message?: string}",
      "description": "验证状态：应用彩色边框和状态图标。如果提供了 message，则在输入框下方显示浮动消息。error 类型还会设置 aria-invalid。"
    },
    {
      "name": "statusVariant",
      "type": "'attached' | 'detached' | 'tooltip'",
      "description": "状态消息相对于输入框的放置方式。attached 直接重叠在输入框下方（带边框的处理）；detached 作为独立元素在下方浮动并留有间距；tooltip 隐藏消息框，并在状态图标的工具提示中呈现。",
      "default": "'attached'"
    },
    {
      "name": "hasClear",
      "type": "boolean",
      "description": "输入框有值时显示清除（×）按钮。点击会清除值并将焦点返回输入框。",
      "default": "false"
    },
    {
      "name": "hasAutoFocus",
      "type": "boolean",
      "description": "挂载时自动聚焦输入框。",
      "default": "false"
    },
    {
      "name": "htmlName",
      "type": "string",
      "description": "输入框的 HTML name 属性，便于表单提交。"
    },
    {
      "name": "autoComplete",
      "type": "string",
      "description": "原生 autocomplete 属性，会原样转发到输入框。不影响受控值。它也是自动填充识别字段内容的方式：为登录、地址和支付字段打上标记（`username`、`new-password`、`one-time-code`、`email`、`tel`、`street-address` 等）。"
    },
    {
      "name": "enterKeyHint",
      "type": "'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'",
      "description": "触摸键盘上 Return 键显示的文字（原生 `enterkeyhint`）。iOS 为 `done`、`go`、`next`、`search` 和 `send` 提供专属按键（iOS 26 上为字形：对勾、箭头、尖括号、放大镜、向上箭头）；`enter` 和 `previous` 保留普通的 Return 键。Android 上的 Chrome（Gboard）会为每个值提供专属按键，包括 `enter` 和 `previous`；没有提示时，如果后面还有其他字段，该键显示为 Next，而当后面还有其他字段时，`type=\"url\"` 字段会显示 Next 而不是 `go`。它只设置按键标签：Enter 的实际行为仍由你的处理函数决定。"
    },
    {
      "name": "inputMode",
      "type": "'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'",
      "description": "字段请求的触摸键盘类型（原生 `inputmode`），不会改变可接受的内容：`numeric` 调出数字键盘，`decimal` 调出小数键盘，`tel` 调出电话键盘，`search` 调出网络搜索键盘（即使在 `enterKeyHint=\"search\"` 时，其 Return 键在 iOS 上也显示 Go；Android 上的 Chrome 仅凭 `inputMode=\"search\"` 就会显示 Enter 键）。"
    },
    {
      "name": "autoCapitalize",
      "type": "'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'",
      "description": "触摸键盘在输入时何时自动大写（原生 `autocapitalize`）。未设置时，iOS 会将句子首字母大写，URL 字段除外。`off` 和 `none` 从不自动大写；`on` 和 `sentences` 会将每个句子首字母大写。"
    },
    {
      "name": "hasAutoCorrect",
      "type": "boolean",
      "description": "触摸键盘是否在输入时纠正单词（原生 `autocorrect`）。未设置时由浏览器决定；对于用户名、代码和其他非单词值，请关闭此功能。"
    },
    {
      "name": "hasSpellCheck",
      "type": "boolean",
      "description": "拼写错误的单词是否显示下划线（原生 `spellcheck`）。未设置时由浏览器决定。"
    },
    {
      "name": "containerXstyle",
      "type": "StyleXStyles",
      "description": "字段容器（标签、控件和状态整体）的 StyleX 样式。在 InputGroup 内无效（请改为设置 InputGroup 的样式），在 `horizontal-labels` FormLayout 中也无效。不接受根级 `xstyle`、`className` 和 `style`。"
    },
    {
      "name": "containerClassName",
      "type": "string",
      "description": "字段容器的类名。作用目标与 `containerXstyle` 相同。"
    },
    {
      "name": "containerStyle",
      "type": "CSSProperties",
      "description": "字段容器的内联样式。作用目标与 `containerXstyle` 相同。"
    },
    {
      "name": "controlXstyle",
      "type": "StyleXStyles",
      "description": "视觉控件框的 StyleX 样式：绘制边框和背景、容纳图标和末端控件的元素。绝不是原生 input。"
    },
    {
      "name": "controlClassName",
      "type": "string",
      "description": "视觉控件框的类名。"
    },
    {
      "name": "controlStyle",
      "type": "CSSProperties",
      "description": "视觉控件框的内联样式。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-text-input",
        "visualProps": [
          "size",
          "status"
        ],
        "states": [
          "disabled",
          "readonly"
        ]
      }
    ]
  },
  "usage": {
    "description": "TextInput 收集姓名、电子邮件或搜索查询等短文本。用于预期输入简短的单行值。配合验证状态引导用户填写必填或格式化的字段。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "始终提供可见标签，让用户知道字段的用途。仅当周围上下文已足够明确时才隐藏标签，例如带放大镜图标的搜索栏。"
      },
      {
        "guidance": true,
        "description": "使用带消息的验证状态说明问题所在：\"Email must include @\" 比仅仅把边框变红更好。"
      },
      {
        "guidance": true,
        "description": "让输入框尺寸与预期内容长度匹配，便于用户判断需要输入多少：邮政编码用 small，姓名用 medium，URL 用 large。"
      },
      {
        "guidance": true,
        "description": "为搜索和筛选输入框添加清除按钮，让用户无需全选文本即可快速重置。"
      },
      {
        "guidance": true,
        "description": "告知触摸键盘字段的内容类型：对应值使用 `type=\"email\"`、`\"tel\"` 或 `\"url\"`，非数字的数字（一次性验证码）使用 `inputMode=\"numeric\"`，用 `enterKeyHint` 指定 Return 键的作用（Search、Send、Next），并用 `autoComplete` 让自动填充能够填入。"
      },
      {
        "guidance": false,
        "description": "不要用占位符文本代替标签；占位符在获得焦点时会消失，并且屏幕阅读器无法可靠读取。"
      },
      {
        "guidance": false,
        "description": "不要将 TextInput 用于评论或描述等多行内容；应改用 TextArea。"
      },
      {
        "guidance": false,
        "description": "不要将每个字段都标记为必填；只标记必填字段，以免用户被验证错误淹没。"
      },
      {
        "guidance": false,
        "description": "不要用 Tooltip 包裹禁用的 TextInput 来解释禁用原因。请使用 disabledMessage 属性，它会将原因附加到字段本身。"
      }
    ],
    "anatomy": [
      {
        "name": "标签",
        "required": true,
        "description": "标识字段的文本。即使视觉上隐藏，也始终为可访问性而渲染。"
      },
      {
        "name": "描述",
        "required": false,
        "description": "位于标签和输入框之间、提供额外上下文或格式提示的辅助文本。"
      },
      {
        "name": "起始图标",
        "required": false,
        "description": "输入框内部的前置图标，用于提示预期内容，例如搜索用的放大镜。"
      },
      {
        "name": "占位符",
        "required": false,
        "description": "输入框为空时显示的提示文本。获得焦点时消失。"
      },
      {
        "name": "清除按钮",
        "required": false,
        "description": "尾随的 × 按钮，用于重置值并将焦点返回输入框。"
      },
      {
        "name": "加载指示器",
        "required": false,
        "description": "在服务端验证等异步操作期间出现的加载指示器。"
      },
      {
        "name": "状态图标",
        "required": false,
        "description": "传达验证状态的尾随图标（错误、警告或成功）。"
      }
    ]
  },
  "propDescriptions": {
    "type": "HTML 输入类型。`email`、`tel` 和 `url` 还会调出匹配的触摸键盘（电子邮件、电话键盘、URL）；`search` 会将字段变为搜索框（在 iOS 上配合 `enterKeyHint=\"search\"` 可获得 Search 键；Android 上的 Chrome 仅凭 `type=\"search\"` 就会显示 Search 键）。",
    "label": "输入框的标签文本：始终为可访问性而渲染。",
    "value": "输入框的当前值。",
    "onChange": "输入值变化时触发的回调。",
    "changeAction": "在 onChange 之后触发的异步操作（如果未被阻止）。会触发乐观更新，并在等待期间显示加载指示器。",
    "size": "输入框的尺寸变体。",
    "isLabelHidden": "在视觉上隐藏标签，同时保持屏幕阅读器可访问。",
    "description": "显示在标签和输入框之间的描述文本。",
    "isOptional": "在标签旁显示 \"Optional\" 指示。与 isRequired 互斥。",
    "isRequired": "在标签旁显示 \"Required\" 指示并设置 aria-required。与 isOptional 互斥。",
    "onEnter": "用户按下 Enter 键时触发的回调。对输入法安全：用于确认日文/中文/韩文转换的 Enter 不会触发它。",
    "onKeyDown": "输入框上的 keydown 事件触发时调用的回调。",
    "isDisabled": "禁用输入框，阻止交互并使元素变暗。",
    "isReadOnly": "将输入框设为只读：值以完全不透明显示，仍随表单提交，但不可编辑。与 isDisabled 不同，只读输入框不会变暗，并保留其表单值。两者同时设置时 isDisabled 优先。",
    "disabledMessage": "解释输入框被禁用的原因。配合 isDisabled 使用时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持输入框可聚焦（字段变为只读）。用它代替用 Tooltip 包裹禁用的 TextInput，使原因附加到字段本身。",
    "isLoading": "将输入框置于加载状态，显示加载指示器并设置 aria-busy。",
    "placeholder": "输入框为空时显示的占位符文本。",
    "labelTooltip": "在标签末尾的信息图标中显示的工具提示文本。",
    "startIcon": "显示在输入框起始处的 SVG 图标组件。有效语义名称请参阅 `astryx docs icons`。",
    "status": "验证状态：应用彩色边框和状态图标。如果提供了 message，则在输入框下方显示浮动消息。error 类型还会设置 aria-invalid。",
    "statusVariant": "状态消息相对于输入框的放置方式。attached 直接重叠在输入框下方（带边框的处理）；detached 作为独立元素在下方浮动并留有间距；tooltip 隐藏消息框，并在状态图标的工具提示中呈现。",
    "hasClear": "输入框有值时显示清除（×）按钮。点击会清除值并将焦点返回输入框。",
    "hasAutoFocus": "挂载时自动聚焦输入框。",
    "htmlName": "输入框的 HTML name 属性，便于表单提交。",
    "width": "字段宽度（数字表示像素，字符串按原样使用，例如 \"100%\"）。会调整整个字段（标签、控件和状态）的尺寸，使它们保持对齐。未设置宽度时，字段可随所在行收缩，因此筛选栏不会溢出；当控件应换到第二行时，使用 `<HStack wrap=\"wrap\">`。",
    "autoComplete": "原生 autocomplete 属性，会原样转发到输入框。不影响受控值。它也是自动填充识别字段内容的方式：为登录、地址和支付字段打上标记（`username`、`new-password`、`one-time-code`、`email`、`tel`、`street-address` 等）。",
    "enterKeyHint": "触摸键盘上 Return 键显示的文字（原生 `enterkeyhint`）。iOS 为 `done`、`go`、`next`、`search` 和 `send` 提供专属按键（iOS 26 上为字形：对勾、箭头、尖括号、放大镜、向上箭头）；`enter` 和 `previous` 保留普通的 Return 键。Android 上的 Chrome（Gboard）会为每个值提供专属按键，包括 `enter` 和 `previous`；没有提示时，如果后面还有其他字段，该键显示为 Next，而当后面还有其他字段时，`type=\"url\"` 字段会显示 Next 而不是 `go`。它只设置按键标签：Enter 的实际行为仍由你的处理函数决定。",
    "inputMode": "字段请求的触摸键盘类型（原生 `inputmode`），不会改变可接受的内容：`numeric` 调出数字键盘，`decimal` 调出小数键盘，`tel` 调出电话键盘，`search` 调出网络搜索键盘（即使在 `enterKeyHint=\"search\"` 时，其 Return 键在 iOS 上也显示 Go；Android 上的 Chrome 仅凭 `inputMode=\"search\"` 就会显示 Enter 键）。",
    "autoCapitalize": "触摸键盘在输入时何时自动大写（原生 `autocapitalize`）。未设置时，iOS 会将句子首字母大写，URL 字段除外。`off` 和 `none` 从不自动大写；`on` 和 `sentences` 会将每个句子首字母大写。",
    "hasAutoCorrect": "触摸键盘是否在输入时纠正单词（原生 `autocorrect`）。未设置时由浏览器决定；对于用户名、代码和其他非单词值，请关闭此功能。",
    "hasSpellCheck": "拼写错误的单词是否显示下划线（原生 `spellcheck`）。未设置时由浏览器决定。",
    "containerXstyle": "字段容器（标签、控件和状态整体）的 StyleX 样式。在 InputGroup 内无效（请改为设置 InputGroup 的样式），在 `horizontal-labels` FormLayout 中也无效。不接受根级 `xstyle`、`className` 和 `style`。",
    "containerClassName": "字段容器的类名。作用目标与 `containerXstyle` 相同。",
    "containerStyle": "字段容器的内联样式。作用目标与 `containerXstyle` 相同。",
    "controlXstyle": "视觉控件框的 StyleX 样式：绘制边框和背景、容纳图标和末端控件的元素。绝不是原生 input。",
    "controlClassName": "视觉控件框的类名。",
    "controlStyle": "视觉控件框的内联样式。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Text input for collecting user text w/ label, description, validation status, optional/required indicators.',
  usage: {
    description:
      'TextInput collects short-form text like names, emails, or search queries. Use it for single-line values where the expected input is brief. Pair it with validation status to guide users through required or formatted fields.',
    bestPractices: [
      {guidance: true, description: 'Always provide a visible label so users know what the field is for. Only hide the label when surrounding context makes it obvious, like a search bar with a magnifying-glass icon.'},
      {guidance: true, description: 'Use validation status with a message to explain what went wrong: "Email must include @" is better than just turning the border red.'},
      {guidance: true, description: 'Size the input to match the expected content length so users can gauge how much to type: small for zip codes, medium for names, large for URLs.'},
      {guidance: true, description: 'Add a clear button for search and filter inputs so users can quickly reset without selecting all text.'},
      {guidance: true, description: 'Tell a touch keyboard what the field holds: `type="email"`, `"tel"` or `"url"` for those values, `inputMode="numeric"` for digits that are not a number (a one-time code), `enterKeyHint` for what Return does (Search, Send, Next), and `autoComplete` so AutoFill can fill it.'},
      {guidance: false, description: "Don't use placeholder text as a replacement for a label; placeholders disappear on focus and are not reliably read by screen readers."},
      {guidance: false, description: "Don't use TextInput for multi-line content like comments or descriptions; use TextArea instead."},
      {guidance: false, description: "Don't mark every field as required; only flag mandatory fields so users are not overwhelmed by validation errors."},
      {guidance: false, description: "Don't wrap a disabled TextInput in Tooltip to explain why it's disabled. Use the disabledMessage prop, which attaches the reason to the field itself."},
    ],
    anatomy: [
      {name: 'Label', required: true, description: 'Text that identifies the field. Always rendered for accessibility even when visually hidden.'},
      {name: 'Description', required: false, description: 'Helper text between the label and the input that provides additional context or formatting hints.'},
      {name: 'Start icon', required: false, description: 'A leading icon inside the input that hints at the expected content, like a magnifying glass for search.'},
      {name: 'Placeholder', required: false, description: 'Hint text shown when the input is empty. Disappears on focus.'},
      {name: 'Clear button', required: false, description: 'A trailing × button that resets the value and returns focus to the input.'},
      {name: 'Spinner', required: false, description: 'Loading indicator that appears during async actions like server-side validation.'},
      {name: 'Status icon', required: false, description: 'A trailing icon (error, warning, or success) that communicates validation state.'},
    ],
  },
  propDescriptions: {
    containerXstyle: 'StyleX styles for the field container; no effect in InputGroup or horizontal-labels FormLayout. No root xstyle/className/style.',
    containerClassName: 'Class name for the field container.',
    containerStyle: 'Inline styles for the field container.',
    controlXstyle: 'StyleX styles for the visual control box (border, background, icons); not the native input.',
    controlClassName: 'Class name for the visual control box.',
    controlStyle: 'Inline styles for the visual control box.',
    type: 'HTML input type.',
    label: 'Label text for input; always rendered for a11y.',
    value: 'Current input value.',
    onChange: 'Fired on input value change.',
    changeAction: 'Async action after onChange (if not prevented). Triggers optimistic update+spinner while pending.',
    size: 'Size variant of input.',
    isLabelHidden: 'Visually hides label; keeps screen reader access.',
    description: 'Description text between label+input.',
    isOptional: 'Shows "Optional" indicator. Mutually exclusive w/ isRequired.',
    isRequired: 'Shows "Required" indicator+sets aria-required. Mutually exclusive w/ isOptional.',
    isDisabled: 'Disables input, prevents interaction, dims element.',
    isReadOnly:
      'Read-only: value visible + still submits, but not editable. Unlike isDisabled: not dimmed.',
    disabledMessage:
      'Explains why input is disabled. With isDisabled, shows tooltip on hover/focus + keeps input focusable via aria-disabled (field becomes read-only). Use instead of wrapping a disabled TextInput in Tooltip.',
    isLoading: 'Loading state w/ spinner+aria-busy.',
    placeholder: 'Placeholder when input empty.',
    labelTooltip: 'Tooltip in info icon at label end.',
    startIcon: 'SVG icon at input start (e.g. heroicons or lucide).',
    status: 'Validation status; colored border+icon. Message floats below. Error sets aria-invalid.',
    statusVariant: 'How status message is placed: attached overlaps below input; detached floats below w/ spacing; tooltip hides the box and shows it on the status icon.',
    hasClear: 'Shows clear button when input has value. Clears value on click.',
    hasAutoFocus: 'Auto-focus input on mount.',
    htmlName: 'HTML name attr for form submissions.',
    autoComplete: 'Native autocomplete attr, forwarded unchanged. Does not affect the controlled value.',
  },
};
