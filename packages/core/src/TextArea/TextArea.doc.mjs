// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Label',
    required: true,
    description: 'Text identifying the multi-line field.',
  },
  {
    name: 'Description',
    required: false,
    description: 'Helper text between the label and the input.',
  },
  {
    name: 'Input container',
    required: true,
    description: 'Painted boundary containing the text area and its overlays.',
  },
  {
    name: 'Text area',
    required: true,
    description: 'Multi-line control that displays and edits the value.',
  },
  {
    name: 'Placeholder',
    required: false,
    description: 'Hint text shown inside the empty text area.',
  },
  {
    name: 'Start icon',
    required: false,
    description:
      'Astryx Icon rendered at the start when startIcon is a semantic name or icon component.',
  },
  {
    name: 'Custom start content',
    required: false,
    description:
      'Caller-provided ReactNode rendered at the start instead of an Astryx Icon.',
  },
  {
    name: 'Spinner',
    required: false,
    description: 'Loading indicator shown at the end of the input container.',
  },
  {
    name: 'Status icon',
    required: false,
    description: 'Error, warning, or success icon shown inside the input.',
  },
  {
    name: 'Character counter',
    required: false,
    description:
      'Current and maximum character counts shown inside the input container.',
  },
  {
    name: 'Field status message',
    required: false,
    description:
      'Attached or detached error, warning, or success message associated with the field.',
  },
  {
    name: 'Tooltip status message',
    required: false,
    description:
      'Tooltip surface presenting the status message for the tooltip variant.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TextArea',
  playground: {
    defaults: {label: 'Notes', value: 'Some notes'},
  },
  displayName: 'Text Area',
  category: 'Form Controls',
  keywords: [
    'textarea',
    'textfield',
    'multiline',
    'comment',
    'message',
    'autoresize',
    'autosize',
    'charlimit',
  ],
  props: [
    {
      name: 'ref',
      type: 'React.Ref<HTMLTextAreaElement>',
      description: 'Ref forwarded to the underlying <textarea> element.',
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Label text for the textarea. Always rendered for accessibility.',
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: 'Current value of the textarea.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string, e: ChangeEvent<HTMLTextAreaElement>) => void',
      description: 'Callback fired when the textarea value changes.',
    },
    {
      name: 'changeAction',
      type: '(value: string, e: ChangeEvent<HTMLTextAreaElement>) => void | Promise<void>',
      description:
        'Async action fired after onChange inside a React transition. Enables optimistic updates via useOptimistic.',
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
      description: 'Helper text displayed between the label and textarea.',
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
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disables the textarea, preventing interaction.',
      default: 'false',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description:
        'Makes the textarea read-only: the value is shown at full opacity and still submits with the form, but cannot be edited. Unlike isDisabled, a read-only textarea is not dimmed and keeps its form value. isDisabled takes precedence when both are set.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the textarea is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the textarea focusable via aria-disabled (the field becomes read-only). Use this instead of wrapping a disabled TextArea in Tooltip, so the reason is attached to the field itself.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Puts the textarea in a loading state, showing a spinner inside the input.',
      default: 'false',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text shown when the textarea is empty.',
    },
    {
      name: 'rows',
      type: 'number',
      description: 'Number of visible text rows.',
      default: '3',
    },
    {
      name: 'maxLength',
      type: 'number',
      description:
        'Maximum number of characters allowed, counted as user-perceived characters: an emoji or flag sequence counts as one. When set, a character counter (current/max) is displayed inside the input container, anchored to the bottom-right beneath the text. Does not enforce the limit natively; when exceeded the counter turns red and shows a warning icon (a non-color cue), and screen-reader users hear the remaining/over-limit count announced. Consumers validating the limit should count with characterCount (exported from the package) so enforcement matches the displayed count.',
    },
    {
      name: 'htmlMaxLength',
      type: 'number',
      description:
        'The native `maxlength` attribute: the browser stops typing past this many UTF-16 code units (an emoji can take two or more). It is separate from `maxLength`, the soft counter of user-perceived characters: it works without the counter, and it neither shows nor changes the counter. It can stop typing before the counter reaches its limit. TextArea adds no truncation or validation of its own, so a longer controlled value stays as set. The attribute is in the server-rendered HTML, so it applies before hydration. Validate on the server too: the browser limit does not bind requests that skip the UI.',
    },
    {
      name: 'status',
      type: "{ type: 'warning' | 'error' | 'success'; message?: string }",
      description:
        'Status indicator that applies a colored border and icon. An optional message is displayed in a floating box below the textarea.',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description:
        'How the status message is placed relative to the input. attached overlaps directly below the input (bordered treatment); detached floats below as a separate element with spacing; tooltip hides the message box and surfaces it in a tooltip on the status icon.',
      default: "'attached'",
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
        'Icon component rendered inside the leading edge of the textarea wrapper. See `astryx docs icons` for valid semantic names.',
    },
    {
      name: 'hasSpellCheck',
      type: 'boolean',
      description:
        'Enables or disables browser spell checking.',
      default: 'true',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description: 'Automatically focuses the textarea on mount.',
      default: 'false',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description:
        'Size of the textarea, affecting internal padding. Height is controlled by rows, not size.',
      default: "'md'",
    },
    {
      name: 'onPaste',
      type: '(e: ClipboardEvent<HTMLTextAreaElement>) => void',
      description: 'Callback fired when content is pasted into the textarea.',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        'HTML name attribute for the textarea element, useful for form submissions.',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
    },
    {
      name: 'onFocus',
      type: '(e: FocusEvent<HTMLTextAreaElement>) => void',
      description: 'Callback fired when the textarea receives focus.',
    },
    {
      name: 'onBlur',
      type: '(e: FocusEvent<HTMLTextAreaElement>) => void',
      description: 'Callback fired when the textarea loses focus.',
    },
    {
      name: 'autoComplete',
      type: 'string',
      description:
        'The native autocomplete attribute, forwarded to the textarea unchanged. Does not affect the controlled value.',
    },
    {
      name: 'enterKeyHint',
      type: "'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'",
      description:
        'What the Return key of a touch keyboard says (the native `enterkeyhint`). iOS gives `done`, `go`, `next`, `search` and `send` their own key (a glyph on iOS 26: a checkmark, an arrow, a chevron, a magnifier, an up arrow); `enter` and `previous` keep the plain Return key. Chrome on Android (Gboard) gives every value its own key; with no hint a TextArea keeps Return. It only labels the key: what Enter does stays with your handlers.',
    },
    {
      name: 'inputMode',
      type: "'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'",
      description:
        'Which touch keyboard the field asks for (the native `inputmode`) without changing what it accepts: `numeric` brings up the number pad, `decimal` the decimal pad, `tel` the phone pad, `search` the web-search keyboard (whose Return key reads Go on iOS even with `enterKeyHint="search"`).',
    },
    {
      name: 'autoCapitalize',
      type: "'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'",
      description:
        'When a touch keyboard capitalizes as you type (the native `autocapitalize`). Unset, iOS capitalizes sentences. `off` and `none` never capitalize; `on` and `sentences` capitalize each sentence.',
    },
    {
      name: 'hasAutoCorrect',
      type: 'boolean',
      description:
        'Whether a touch keyboard corrects words as you type (the native `autocorrect`). Unset, the browser decides; turn it off for usernames, codes and other values that are not words.',
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
      {
        className: 'astryx-text-area',
        visualProps: ['size', 'status'],
        states: ['disabled', 'readonly'],
      },
      {className: 'astryx-text-area-control'},
      {className: 'astryx-text-area-counter'},
    ],
    vars: [
      {
        name: '--_textarea-inline-padding',
        description:
          "Inline padding of the textarea's text. The wrapper stays flush (padding: 0) so the native resize grip sits in the true corner; this var carries the inset on the inner <textarea>, and the start icon, status/spinner, and character counter align to it.",
        default: 'var(--spacing-2)',
        private: true,
      },
    ],
    derived: [
      {
        property: 'paddingInline',
        vars: ['--_textarea-inline-padding'],
        replaces: true,
      },
    ],
  },
  usage: {
    anatomy,
    description:
      'TextArea is a multi-line text input for collecting longer-form content like comments, descriptions, or messages. Use it when the expected input spans multiple lines. For shorter, single-line values, use TextInput.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide a visible label so users know what to enter. If the label must be hidden, set isLabelHidden with a descriptive label for screen readers.',
      },
      {
        guidance: true,
        description:
          'Set maxLength with a character counter when there is a defined limit; it helps users stay within bounds before they submit.',
      },
      {
        guidance: true,
        description:
          'Keep Return a line break in a multi-line field. Relabel it with enterKeyHint (send, done) only when your own Enter handling does what the label says.',
      },
      {
        guidance: true,
        description:
          'Use the status prop to surface validation feedback inline: show success when input is valid, warning for soft limits, and error for hard failures.',
      },
      {
        guidance: true,
        description:
          'Add a description or placeholder to clarify expected content, like "Describe the issue in detail," but never rely on placeholder alone as the only label.',
      },
      {
        guidance: false,
        description:
          'Avoid using TextArea for short, single-line values like names or emails; use TextInput instead.',
      },
      {
        guidance: false,
        description:
          "Don't rely solely on placeholder text to communicate the purpose of the field; placeholders disappear on focus and are not accessible labels.",
      },
      {
        guidance: false,
        description:
          "Don't show a status message without also setting the status type; the colored border and icon are what draw the user's attention to the message.",
      },
      {
        guidance: false,
        description:
          "Don't wrap a disabled TextArea in Tooltip to explain why it's disabled. Use the disabledMessage prop, which attaches the reason to the field itself.",
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "TextArea",
  "displayName": "Text Area",
  "props": [
    {
      "name": "ref",
      "type": "React.Ref<HTMLTextAreaElement>",
      "description": "转发到底层 <textarea> 元素的 Ref。"
    },
    {
      "name": "label",
      "type": "string",
      "description": "文本区域的标签文本。始终为无障碍而渲染。",
      "required": true
    },
    {
      "name": "value",
      "type": "string",
      "description": "文本区域的当前值。",
      "required": true
    },
    {
      "name": "onChange",
      "type": "(value: string, e: ChangeEvent<HTMLTextAreaElement>) => void",
      "description": "文本区域值变化时触发的回调。"
    },
    {
      "name": "changeAction",
      "type": "(value: string, e: ChangeEvent<HTMLTextAreaElement>) => void | Promise<void>",
      "description": "在 React transition 中于 onChange 之后触发的异步操作。通过 useOptimistic 支持乐观更新。"
    },
    {
      "name": "isLabelHidden",
      "type": "boolean",
      "description": "在视觉上隐藏标签，同时保持其对屏幕阅读器可访问。",
      "default": "false"
    },
    {
      "name": "description",
      "type": "string",
      "description": "显示在标签和文本区域之间的辅助文本。"
    },
    {
      "name": "isOptional",
      "type": "boolean",
      "description": "在标签旁显示 \"Optional\" 指示器。与 isRequired 互斥。",
      "default": "false"
    },
    {
      "name": "isRequired",
      "type": "boolean",
      "description": "在标签旁显示 \"Required\" 指示器并设置 aria-required。与 isOptional 互斥。",
      "default": "false"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "禁用文本区域，阻止交互。",
      "default": "false"
    },
    {
      "name": "isReadOnly",
      "type": "boolean",
      "description": "使文本区域只读：值以完全不透明显示，仍随表单提交，但无法编辑。与 isDisabled 不同，只读文本区域不会变暗，并保留其表单值。两者都设置时，isDisabled 优先。",
      "default": "false"
    },
    {
      "name": "disabledMessage",
      "type": "string",
      "description": "解释文本区域为何被禁用。与 isDisabled 搭配时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持文本区域可聚焦（字段变为只读）。请使用此属性，而不是用 Tooltip 包裹禁用的 TextArea，这样原因会附加到字段本身。"
    },
    {
      "name": "isLoading",
      "type": "boolean",
      "description": "使文本区域进入加载状态，在输入框内显示加载动画。",
      "default": "false"
    },
    {
      "name": "placeholder",
      "type": "string",
      "description": "文本区域为空时显示的占位文本。"
    },
    {
      "name": "rows",
      "type": "number",
      "description": "可见文本行数。",
      "default": "3"
    },
    {
      "name": "maxLength",
      "type": "number",
      "description": "允许的最大字符数，按用户感知的字符计数：一个 emoji 或旗帜序列算作一个。设置后，输入容器内会在文本下方右下角显示字符计数器（当前/最大）。不会原生强制限制；超出时计数器变红并显示警告图标（非颜色提示），屏幕阅读器用户会听到剩余/超出计数播报。验证该限制的调用方应使用 characterCount（从包中导出）计数，使强制行为与显示的计数一致。"
    },
    {
      "name": "htmlMaxLength",
      "type": "number",
      "description": "原生 `maxlength` 属性：浏览器会在超过这么多 UTF-16 代码单元后停止输入（一个 emoji 可能占两个或更多）。它与 `maxLength`（用户感知字符的软计数器）分开：无需计数器即可工作，且既不会显示也不会更改计数器。它可能在计数器达到限制之前就停止输入。TextArea 不添加自己的截断或校验，因此更长的受控值会按设置保留。该属性存在于服务端渲染的 HTML 中，因此在 hydration 之前就生效。也要在服务端验证：浏览器限制不会约束绕过 UI 的请求。"
    },
    {
      "name": "status",
      "type": "{ type: 'warning' | 'error' | 'success'; message?: string }",
      "description": "应用彩色边框和图标的状态指示器。可选消息显示在文本区域下方的浮动框中。"
    },
    {
      "name": "statusVariant",
      "type": "'attached' | 'detached' | 'tooltip'",
      "description": "状态消息相对于输入框的放置方式。attached 直接重叠在输入框下方（带边框的处理）；detached 作为单独元素浮动在下方并留有间距；tooltip 隐藏消息框，并在状态图标上的工具提示中展示。",
      "default": "'attached'"
    },
    {
      "name": "labelTooltip",
      "type": "string",
      "description": "在标签末尾的信息图标中显示的工具提示文本。"
    },
    {
      "name": "startIcon",
      "type": "IconType",
      "description": "渲染在文本区域包装器前缘内部的图标组件。有效语义名称参见 `astryx docs icons`。"
    },
    {
      "name": "hasSpellCheck",
      "type": "boolean",
      "description": "启用或禁用浏览器拼写检查。",
      "default": "true"
    },
    {
      "name": "hasAutoFocus",
      "type": "boolean",
      "description": "在挂载时自动聚焦文本区域。",
      "default": "false"
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "description": "文本区域的尺寸，影响内部内边距。高度由 rows 控制，而不是 size。",
      "default": "'md'"
    },
    {
      "name": "onPaste",
      "type": "(e: ClipboardEvent<HTMLTextAreaElement>) => void",
      "description": "内容粘贴到文本区域时触发的回调。"
    },
    {
      "name": "htmlName",
      "type": "string",
      "description": "文本区域元素的 HTML name 属性，用于表单提交。"
    },
    {
      "name": "onFocus",
      "type": "(e: FocusEvent<HTMLTextAreaElement>) => void",
      "description": "文本区域获得焦点时触发的回调。"
    },
    {
      "name": "onBlur",
      "type": "(e: FocusEvent<HTMLTextAreaElement>) => void",
      "description": "文本区域失去焦点时触发的回调。"
    },
    {
      "name": "autoComplete",
      "type": "string",
      "description": "原生 autocomplete 属性，原样转发到文本区域。不影响受控值。"
    },
    {
      "name": "enterKeyHint",
      "type": "'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'",
      "description": "触摸键盘的 Return 键显示什么（原生 `enterkeyhint`）。iOS 会为 `done`、`go`、`next`、`search` 和 `send` 提供各自的按键（iOS 26 上为字形：对勾、箭头、尖角、放大镜、向上箭头）；`enter` 和 `previous` 保持普通 Return 键。Android 上的 Chrome（Gboard）会为每个值提供各自的按键；没有提示时 TextArea 保持 Return。它只标注按键：Enter 实际做什么仍由你的处理程序决定。"
    },
    {
      "name": "inputMode",
      "type": "'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'",
      "description": "字段请求哪种触摸键盘（原生 `inputmode`），而不改变其接受的内容：`numeric` 调出数字键盘，`decimal` 调出小数键盘，`tel` 调出电话键盘，`search` 调出网页搜索键盘（其 Return 键在 iOS 上即使 `enterKeyHint=\"search\"` 也显示 Go）。"
    },
    {
      "name": "autoCapitalize",
      "type": "'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'",
      "description": "触摸键盘何时在输入时自动大写（原生 `autocapitalize`）。未设置时，iOS 会将句子大写。`off` 和 `none` 从不自动大写；`on` 和 `sentences` 将每个句子大写。"
    },
    {
      "name": "hasAutoCorrect",
      "type": "boolean",
      "description": "触摸键盘是否在输入时纠正词语（原生 `autocorrect`）。未设置时由浏览器决定；对于用户名、代码和其他非词语的值，请将其关闭。"
    },
    {
      "name": "containerXstyle",
      "type": "StyleXStyles",
      "description": "字段容器（标签、控件和状态一起）的 StyleX 样式。在 InputGroup 内无效（请改为设置 InputGroup 样式），在 `horizontal-labels` FormLayout 中也无效。不接受根级 `xstyle`、`className` 和 `style`。"
    },
    {
      "name": "containerClassName",
      "type": "string",
      "description": "字段容器的类名。定位方式与 `containerXstyle` 相同。"
    },
    {
      "name": "containerStyle",
      "type": "CSSProperties",
      "description": "字段容器的内联样式。定位方式与 `containerXstyle` 相同。"
    },
    {
      "name": "controlXstyle",
      "type": "StyleXStyles",
      "description": "可视控件框的 StyleX 样式：绘制边框和背景并容纳图标和结束控件的元素。绝不是原生输入框。"
    },
    {
      "name": "controlClassName",
      "type": "string",
      "description": "可视控件框的类名。"
    },
    {
      "name": "controlStyle",
      "type": "CSSProperties",
      "description": "可视控件框的内联样式。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-text-area",
        "visualProps": [
          "size",
          "status"
        ],
        "states": [
          "disabled",
          "readonly"
        ]
      },
      {
        "className": "astryx-text-area-control"
      },
      {
        "className": "astryx-text-area-counter"
      }
    ],
    "vars": [
      {
        "name": "--_textarea-inline-padding",
        "description": "文本域文本的行内内边距。外层容器保持无内边距（padding: 0），使原生缩放手柄位于真正的角落；该变量在内部 <textarea> 上承载内边距，起始图标、状态/加载指示器和字符计数器都与之对齐。",
        "default": "var(--spacing-2)",
        "private": true
      }
    ],
    "derived": [
      {
        "property": "paddingInline",
        "vars": [
          "--_textarea-inline-padding"
        ],
        "replaces": true
      }
    ]
  },
  "usage": {
    "description": "TextArea 是用于收集较长内容（如评论、描述或消息）的多行文本输入框。当预期输入跨多行时使用它。对于较短的单行值，请使用 TextInput。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "提供可见标签，让用户知道要输入什么。如果标签必须隐藏，请设置 isLabelHidden，并为屏幕阅读器提供描述性标签。"
      },
      {
        "guidance": true,
        "description": "存在明确限制时，设置 maxLength 并启用字符计数器；它帮助用户在提交前保持在限制范围内。"
      },
      {
        "guidance": true,
        "description": "在多行字段中保持 Return 为换行。仅当你自己的 Enter 处理与标签所述一致时，才用 enterKeyHint（send、done）重新标注它。"
      },
      {
        "guidance": true,
        "description": "使用 status 属性在行内呈现校验反馈：输入有效时显示成功，软限制时显示警告，硬性失败时显示错误。"
      },
      {
        "guidance": true,
        "description": "添加描述或占位符以说明预期内容，例如 \"Describe the issue in detail,\"，但绝不要仅依赖占位符作为唯一标签。"
      },
      {
        "guidance": false,
        "description": "避免将 TextArea 用于姓名或邮箱等短单行值；请改用 TextInput。"
      },
      {
        "guidance": false,
        "description": "不要仅依赖占位文本来传达字段用途；占位符在聚焦时消失，且不是可访问标签。"
      },
      {
        "guidance": false,
        "description": "不要在未设置状态类型的情况下显示状态消息；彩色边框和图标才是吸引用户注意消息的元素。"
      },
      {
        "guidance": false,
        "description": "不要用 Tooltip 包裹禁用的 TextArea 来解释其禁用原因。请使用 disabledMessage 属性，它会将原因附加到字段本身。"
      }
    ],
    "anatomy": [
      {
        "name": "标签",
        "required": true,
        "description": "标识多行字段的文本。"
      },
      {
        "name": "描述",
        "required": false,
        "description": "标签和输入框之间的辅助文本。"
      },
      {
        "name": "输入容器",
        "required": true,
        "description": "包含文本区域及其覆盖层的绘制边界。"
      },
      {
        "name": "文本区域",
        "required": true,
        "description": "显示和编辑值的多行控件。"
      },
      {
        "name": "占位文本",
        "required": false,
        "description": "空文本区域内显示的提示文本。"
      },
      {
        "name": "起始图标",
        "required": false,
        "description": "当 startIcon 为语义名称或图标组件时，在起始处渲染的 Astryx Icon。"
      },
      {
        "name": "自定义起始内容",
        "required": false,
        "description": "在起始处代替 Astryx Icon 渲染的调用方提供的 ReactNode。"
      },
      {
        "name": "加载指示器",
        "required": false,
        "description": "显示在输入容器末尾的加载指示器。"
      },
      {
        "name": "状态图标",
        "required": false,
        "description": "显示在输入框内的错误、警告或成功图标。"
      },
      {
        "name": "字符计数器",
        "required": false,
        "description": "显示在输入容器内的当前和最大字符数。"
      },
      {
        "name": "字段状态消息",
        "required": false,
        "description": "与字段关联的附加或分离的错误、警告或成功消息。"
      },
      {
        "name": "工具提示状态消息",
        "required": false,
        "description": "为 tooltip 变体呈现状态消息的工具提示表面。"
      }
    ]
  },
  "propDescriptions": {
    "ref": "转发到底层 <textarea> 元素的 Ref。",
    "label": "文本区域的标签文本。始终为无障碍而渲染。",
    "value": "文本区域的当前值。",
    "onChange": "文本区域值变化时触发的回调。",
    "changeAction": "在 React transition 中于 onChange 之后触发的异步操作。通过 useOptimistic 支持乐观更新。",
    "isLabelHidden": "在视觉上隐藏标签，同时保持其对屏幕阅读器可访问。",
    "description": "显示在标签和文本区域之间的辅助文本。",
    "isOptional": "在标签旁显示 \"Optional\" 指示器。与 isRequired 互斥。",
    "isRequired": "在标签旁显示 \"Required\" 指示器并设置 aria-required。与 isOptional 互斥。",
    "isDisabled": "禁用文本区域，阻止交互。",
    "isReadOnly": "使文本区域只读：值以完全不透明显示，仍随表单提交，但无法编辑。与 isDisabled 不同，只读文本区域不会变暗，并保留其表单值。两者都设置时，isDisabled 优先。",
    "disabledMessage": "解释文本区域为何被禁用。与 isDisabled 搭配时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持文本区域可聚焦（字段变为只读）。请使用此属性，而不是用 Tooltip 包裹禁用的 TextArea，这样原因会附加到字段本身。",
    "isLoading": "使文本区域进入加载状态，在输入框内显示加载动画。",
    "placeholder": "文本区域为空时显示的占位文本。",
    "rows": "可见文本行数。",
    "maxLength": "允许的最大字符数，按用户感知的字符计数：一个 emoji 或旗帜序列算作一个。设置后，输入容器内会在文本下方右下角显示字符计数器（当前/最大）。不会原生强制限制；超出时计数器变红并显示警告图标（非颜色提示），屏幕阅读器用户会听到剩余/超出计数播报。验证该限制的调用方应使用 characterCount（从包中导出）计数，使强制行为与显示的计数一致。",
    "htmlMaxLength": "原生 `maxlength` 属性：浏览器会在超过这么多 UTF-16 代码单元后停止输入（一个 emoji 可能占两个或更多）。它与 `maxLength`（用户感知字符的软计数器）分开：无需计数器即可工作，且既不会显示也不会更改计数器。它可能在计数器达到限制之前就停止输入。TextArea 不添加自己的截断或校验，因此更长的受控值会按设置保留。该属性存在于服务端渲染的 HTML 中，因此在 hydration 之前就生效。也要在服务端验证：浏览器限制不会约束绕过 UI 的请求。",
    "status": "应用彩色边框和图标的状态指示器。可选消息显示在文本区域下方的浮动框中。",
    "statusVariant": "状态消息相对于输入框的放置方式。attached 直接重叠在输入框下方（带边框的处理）；detached 作为单独元素浮动在下方并留有间距；tooltip 隐藏消息框，并在状态图标上的工具提示中展示。",
    "labelTooltip": "在标签末尾的信息图标中显示的工具提示文本。",
    "startIcon": "渲染在文本区域包装器前缘内部的图标组件。有效语义名称参见 `astryx docs icons`。",
    "hasSpellCheck": "启用或禁用浏览器拼写检查。",
    "hasAutoFocus": "在挂载时自动聚焦文本区域。",
    "size": "文本区域的尺寸，影响内部内边距。高度由 rows 控制，而不是 size。",
    "onPaste": "内容粘贴到文本区域时触发的回调。",
    "htmlName": "文本区域元素的 HTML name 属性，用于表单提交。",
    "width": "字段宽度（数字 = 像素，字符串按原样使用，例如 \"100%\"）。设置整个字段（标签、控件和状态）的尺寸，使它们保持对齐。",
    "onFocus": "文本区域获得焦点时触发的回调。",
    "onBlur": "文本区域失去焦点时触发的回调。",
    "autoComplete": "原生 autocomplete 属性，原样转发到文本区域。不影响受控值。",
    "enterKeyHint": "触摸键盘的 Return 键显示什么（原生 `enterkeyhint`）。iOS 会为 `done`、`go`、`next`、`search` 和 `send` 提供各自的按键（iOS 26 上为字形：对勾、箭头、尖角、放大镜、向上箭头）；`enter` 和 `previous` 保持普通 Return 键。Android 上的 Chrome（Gboard）会为每个值提供各自的按键；没有提示时 TextArea 保持 Return。它只标注按键：Enter 实际做什么仍由你的处理程序决定。",
    "inputMode": "字段请求哪种触摸键盘（原生 `inputmode`），而不改变其接受的内容：`numeric` 调出数字键盘，`decimal` 调出小数键盘，`tel` 调出电话键盘，`search` 调出网页搜索键盘（其 Return 键在 iOS 上即使 `enterKeyHint=\"search\"` 也显示 Go）。",
    "autoCapitalize": "触摸键盘何时在输入时自动大写（原生 `autocapitalize`）。未设置时，iOS 会将句子大写。`off` 和 `none` 从不自动大写；`on` 和 `sentences` 将每个句子大写。",
    "hasAutoCorrect": "触摸键盘是否在输入时纠正词语（原生 `autocorrect`）。未设置时由浏览器决定；对于用户名、代码和其他非词语的值，请将其关闭。",
    "containerXstyle": "字段容器（标签、控件和状态一起）的 StyleX 样式。在 InputGroup 内无效（请改为设置 InputGroup 样式），在 `horizontal-labels` FormLayout 中也无效。不接受根级 `xstyle`、`className` 和 `style`。",
    "containerClassName": "字段容器的类名。定位方式与 `containerXstyle` 相同。",
    "containerStyle": "字段容器的内联样式。定位方式与 `containerXstyle` 相同。",
    "controlXstyle": "可视控件框的 StyleX 样式：绘制边框和背景并容纳图标和结束控件的元素。绝不是原生输入框。",
    "controlClassName": "可视控件框的类名。",
    "controlStyle": "可视控件框的内联样式。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Multi-line text input for collecting longer user input.',
  usage: {
    description:
      'Multi-line input for comments, descriptions, messages. Use when input spans multiple lines; use TextInput for single-line.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Visible label or isLabelHidden with descriptive label for screen readers.',
      },
      {
        guidance: true,
        description: 'Set maxLength for character counter when a limit exists.',
      },
      {
        guidance: true,
        description:
          'Return stays a line break; relabel it (enterKeyHint) only if your Enter handling matches.',
      },
      {
        guidance: true,
        description:
          'Use status prop for inline validation: success, warning, error.',
      },
      {
        guidance: true,
        description:
          'Add description or placeholder for context; never placeholder alone as label.',
      },
      {
        guidance: false,
        description: 'Avoid TextArea for single-line values; use TextInput.',
      },
      {
        guidance: false,
        description:
          "Don't use placeholder as only label; disappears on focus, not accessible.",
      },
      {
        guidance: false,
        description:
          "Don't show status message without status type; border and icon draw attention.",
      },
      {
        guidance: false,
        description:
          "Don't wrap a disabled TextArea in Tooltip to explain the disabled state; use the disabledMessage prop instead.",
      },
    ],
  },
  propDescriptions: {
    containerXstyle: 'StyleX styles for the field container; no effect in InputGroup or horizontal-labels FormLayout. No root xstyle/className/style.',
    containerClassName: 'Class name for the field container.',
    containerStyle: 'Inline styles for the field container.',
    controlXstyle: 'StyleX styles for the visual control box (border, background, icons); not the native input.',
    controlClassName: 'Class name for the visual control box.',
    controlStyle: 'Inline styles for the visual control box.',
    ref: 'ref forwarded to underlying <textarea>.',
    label: 'Label text for textarea; always rendered for a11y.',
    value: 'Current textarea value.',
    onChange: 'Fired on textarea value change.',
    changeAction:
      'Async action after onChange in React transition. Enables useOptimistic.',
    isLabelHidden: 'Visually hides label; keeps screen reader access.',
    description: 'Helper text between label+textarea.',
    isOptional: 'Shows "Optional" indicator. Mutually exclusive w/ isRequired.',
    isRequired:
      'Shows "Required" indicator+sets aria-required. Mutually exclusive w/ isOptional.',
    isDisabled: 'Disables textarea, prevents interaction.',
    isReadOnly:
      'Read-only: value visible + still submits, but not editable. Unlike isDisabled: not dimmed.',
    disabledMessage:
      'Explains why textarea is disabled. With isDisabled, shows tooltip on hover/focus + keeps textarea focusable via aria-disabled (field becomes read-only). Use instead of wrapping a disabled TextArea in Tooltip.',
    isLoading: 'Loading state w/ spinner inside input.',
    placeholder: 'Placeholder when textarea empty.',
    rows: 'Visible text rows.',
    maxLength:
      'Max chars allowed. Shows counter (current/max) inside the container, bottom-right beneath the text. No native enforcement; over-limit shows red + a warning icon and is announced to screen readers.',
    status:
      'Colored border+icon status. Optional floating message below textarea.',
    statusVariant:
      'How status message is placed: attached overlaps below input; detached floats below w/ spacing; tooltip hides the box and shows it on the status icon.',
    labelTooltip: 'Tooltip in info icon at label end.',
    startIcon: 'Icon inside leading edge of textarea wrapper.',
    hasSpellCheck: 'Enables/disables browser spell checking.',
    hasAutoFocus: 'Auto-focus textarea on mount.',
    size: 'Textarea size; affects internal padding. Height controlled by rows.',
    onPaste: 'Fired on paste into textarea.',
    htmlName: 'HTML name attr for form submissions.',
    onFocus: 'Callback on focus.',
    onBlur: 'Callback on blur.',
    autoComplete:
      'Native autocomplete attr, forwarded unchanged. Does not affect the controlled value.',
  },
};
