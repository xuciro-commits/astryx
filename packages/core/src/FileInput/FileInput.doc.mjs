// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'FileInput',
  displayName: 'File Input',
  category: 'Form Controls',
  keywords: ["fileinput","file","upload","drag","drop","dropzone","attachment","browse"],
  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible label for the file input.',
      required: true,
    },
    {
      name: 'value',
      type: 'File | File[] | null',
      description: 'Currently selected file(s). Controlled component.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(files: File | File[] | null) => void',
      description: 'Callback fired when files are selected or removed.',
      required: true,
    },
    {
      name: 'changeAction',
      type: '(files: File | File[] | null) => Promise<void>',
      description:
        'Async change action (React 19 transitions pattern). Use for immediate upload on file selection.',
    },
    {
      name: 'accept',
      type: 'string',
      description:
        'Accepted file types. Uses the HTML accept attribute format (e.g. "image/*", ".pdf,.doc").',
    },
    {
      name: 'isMultiple',
      type: 'boolean',
      description: 'Whether multiple files can be selected. When true, value and onChange use File[] instead of File.',
      default: 'false',
    },
    {
      name: 'maxSize',
      type: 'number',
      description: 'Maximum file size in bytes. Files exceeding this are rejected with an error status.',
    },
    {
      name: 'maxFiles',
      type: 'number',
      description: 'Maximum number of files (only applies when isMultiple is true).',
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
        'Displays a "Required" indicator next to the label and adds a screen-reader-only "Required" description to the trigger (assistive tech does not reliably announce aria-required on the trigger). Mutually exclusive with isOptional.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Disables the input, preventing interaction and dimming the element.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the input is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the trigger focusable via aria-disabled (opening the file picker stays blocked). Use this instead of wrapping a disabled FileInput in Tooltip; disabled controls swallow the hover events an external Tooltip needs.',
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
      description: 'Placeholder text shown when no file is selected.',
      default: '"Choose file" or "Choose files"',
    },
    {
      name: 'mode',
      type: "'input' | 'dropzone'",
      description: "Visual mode. 'input' is a compact inline style; 'dropzone' is a larger area with drag-and-drop support.",
      default: "'input'",
    },
    {
      name: 'status',
      type: "{type: 'error' | 'warning' | 'success', message?: string}",
      description:
        'Validation status: applies a colored border. If message is provided, displays a floating message below the input. Error type also sets aria-invalid.',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description:
        'How the status message is placed relative to the input. attached overlaps directly below the input (bordered treatment); detached floats below as a separate element with spacing; tooltip hides the message box and surfaces it in a tooltip on the status icon. Dropzone mode does not support attached, so a dropzone defaults to detached; an explicit attached keeps its released rendering until the next minor release, which resolves it to detached.',
      default: "'attached' in input mode; 'detached' in dropzone mode",
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description:
        'Tooltip text displayed in an info icon at the end of the label.',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
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
      {className: 'astryx-file-input', visualProps: ['mode', 'status']},
      {className: 'astryx-file-input-icon', visualProps: ['mode']},
    ],
  },
  usage: {
    description:
      'FileInput provides file upload with optional drag-and-drop support. Use it for single or multiple file selection with built-in validation for file type, size, and count. Pair with validation status for upload feedback.',
    bestPractices: [
      {guidance: true, description: 'Always specify an accept prop to guide users toward valid file types.'},
      {guidance: true, description: 'Use maxSize and maxFiles to prevent oversized uploads; the component handles validation and error display automatically.'},
      {guidance: true, description: 'Add a description to communicate constraints like file size limits or accepted formats.'},
      {guidance: true, description: 'Use changeAction for immediate upload workflows that benefit from optimistic UI.'},
      {guidance: false, description: "Don't use FileInput for directory or folder uploads; that is not supported in v1."},
      {guidance: false, description: "Don't avoid dropzone mode unless space is constrained; drag-and-drop is the expected interaction for file uploads."},
      {guidance: false, description: "Don't wrap a disabled FileInput in Tooltip to explain why it's disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead."},
    ],
    anatomy: [
      {name: 'Label', required: true, description: 'Text that identifies the field. Always rendered for accessibility even when visually hidden.'},
      {name: 'Description', required: false, description: 'Helper text between the label and the drop zone explaining accepted formats or size limits.'},
      {name: 'Drop zone', required: true, description: 'The clickable area for file selection. In dropzone mode, also accepts dragged files.'},
      {name: 'Upload icon', required: false, description: 'An upload-to-tray icon in the drop zone hinting at the upload action.'},
      {name: 'Placeholder', required: false, description: 'Hint text shown when no files are selected.'},
      {name: 'File name display', required: false, description: 'Shows the name(s) of selected files.'},
      {name: 'Clear button', required: false, description: 'A close button that removes selected files and returns focus to the file-selection trigger.'},
      {name: 'Spinner', required: false, description: 'Loading indicator that appears during async upload actions.'},
      {name: 'Status message', required: false, description: 'Validation feedback showing error, warning, or success with a message.'},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "FileInput",
  "displayName": "File Input",
  "props": [
    {
      "name": "label",
      "type": "string",
      "description": "文件输入的无障碍标签。",
      "required": true
    },
    {
      "name": "value",
      "type": "File | File[] | null",
      "description": "当前选中的文件。受控组件。",
      "required": true
    },
    {
      "name": "onChange",
      "type": "(files: File | File[] | null) => void",
      "description": "选择或移除文件时触发的回调。",
      "required": true
    },
    {
      "name": "accept",
      "type": "string",
      "description": "可接受的文件类型。使用 HTML accept 属性格式（例如 \"image/*\"、\".pdf,.doc\"）。"
    },
    {
      "name": "isMultiple",
      "type": "boolean",
      "description": "是否可选择多个文件。为 true 时，value 和 onChange 使用 File[] 而非 File。",
      "default": "false"
    },
    {
      "name": "maxSize",
      "type": "number",
      "description": "最大文件大小（字节）。超过此大小的文件会以错误状态被拒绝。"
    },
    {
      "name": "maxFiles",
      "type": "number",
      "description": "最大文件数量（仅在 isMultiple 为 true 时适用）。"
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
      "name": "isDisabled",
      "type": "boolean",
      "description": "禁用输入，阻止交互并使元素变暗。",
      "default": "false"
    },
    {
      "name": "disabledMessage",
      "type": "string",
      "description": "说明输入被禁用的原因。与 isDisabled 一起使用时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持触发器可聚焦（打开文件选择器仍被阻止）。请使用此属性，而不要将禁用的 FileInput 包裹在 Tooltip 中；禁用控件会吞掉外部 Tooltip 所需的悬停事件。"
    },
    {
      "name": "isLoading",
      "type": "boolean",
      "description": "使输入进入加载状态，显示加载指示器并设置 aria-busy。",
      "default": "false"
    },
    {
      "name": "placeholder",
      "type": "string",
      "description": "未选择文件时显示的占位文本。"
    },
    {
      "name": "mode",
      "type": "'input' | 'dropzone'",
      "description": "视觉模式。'input' 是紧凑的内联样式；'dropzone' 是支持拖放的较大区域。",
      "default": "'input'"
    },
    {
      "name": "status",
      "type": "{type: 'error' | 'warning' | 'success', message?: string}",
      "description": "校验状态：应用彩色边框。若提供了 message，则在输入下方显示浮动消息。error 类型还会设置 aria-invalid。"
    },
    {
      "name": "statusVariant",
      "type": "'attached' | 'detached' | 'tooltip'",
      "description": "状态消息相对于输入的位置。attached 直接重叠在输入下方（带边框处理）；detached 作为独立元素在下方浮动并留出间距；tooltip 隐藏消息框，并在状态图标的工具提示中显示。dropzone 模式不支持 attached，因此 dropzone 默认为 detached；显式指定 attached 时会保留其已发布版本的渲染，直到下一个次版本将其解析为 detached。",
      "default": "输入模式为 'attached'；dropzone 模式为 'detached'"
    },
    {
      "name": "containerXstyle",
      "type": "StyleXStyles",
      "description": "字段容器（标签、控件和状态整体）的 StyleX 样式。在 InputGroup 内（请改为设置 InputGroup 样式）或 `horizontal-labels` FormLayout 中无效。不接受根级 `xstyle`、`className` 和 `style`。"
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
      "description": "视觉控件框的 StyleX 样式：绘制边框和背景、容纳图标和尾部控件的元素。绝不是原生输入框。"
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
        "className": "astryx-file-input",
        "visualProps": [
          "mode",
          "status"
        ]
      },
      {
        "className": "astryx-file-input-icon",
        "visualProps": [
          "mode"
        ]
      }
    ]
  },
  "usage": {
    "description": "FileInput 提供文件上传，并可选支持拖放。用于单个或多个文件选择，内置对文件类型、大小和数量的校验。配合校验状态可提供上传反馈。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "始终指定 accept 属性，引导用户选择有效的文件类型。"
      },
      {
        "guidance": true,
        "description": "使用 maxSize 和 maxFiles 防止过大的上传；组件会自动处理校验和错误显示。"
      },
      {
        "guidance": true,
        "description": "添加 description，说明文件大小限制或可接受格式等约束。"
      },
      {
        "guidance": true,
        "description": "对于能从乐观 UI 中获益的即时上传流程，请使用 changeAction。"
      },
      {
        "guidance": false,
        "description": "不要将 FileInput 用于目录或文件夹上传；v1 不支持该功能。"
      },
      {
        "guidance": false,
        "description": "除非空间受限，否则不要避开 dropzone 模式；拖放是文件上传的预期交互方式。"
      },
      {
        "guidance": false,
        "description": "不要将禁用的 FileInput 包裹在 Tooltip 中以说明禁用原因；禁用控件会吞掉包裹层所需的悬停事件。请改用 disabledMessage 属性。"
      }
    ],
    "anatomy": [
      {
        "name": "标签",
        "required": true,
        "description": "标识该字段的文本。即使视觉上隐藏，也始终为无障碍而渲染。"
      },
      {
        "name": "描述",
        "required": false,
        "description": "位于标签和拖放区域之间、说明可接受格式或大小限制的辅助文本。"
      },
      {
        "name": "拖放区域",
        "required": true,
        "description": "用于选择文件的可点击区域。在 dropzone 模式下还接受拖入的文件。"
      },
      {
        "name": "上传图标",
        "required": false,
        "description": "拖放区域中的上传到托盘图标，提示上传操作。"
      },
      {
        "name": "占位符",
        "required": false,
        "description": "未选择文件时显示的提示文本。"
      },
      {
        "name": "文件名显示",
        "required": false,
        "description": "显示所选文件的名称。"
      },
      {
        "name": "清除按钮",
        "required": false,
        "description": "一个关闭按钮，用于移除所选文件并将焦点返回文件选择触发器。"
      },
      {
        "name": "加载指示器",
        "required": false,
        "description": "异步上传操作期间出现的加载指示器。"
      },
      {
        "name": "状态消息",
        "required": false,
        "description": "显示错误、警告或成功及相应消息的校验反馈。"
      }
    ]
  },
  "propDescriptions": {
    "label": "文件输入的无障碍标签。",
    "value": "当前选中的文件。受控组件。",
    "onChange": "选择或移除文件时触发的回调。",
    "changeAction": "异步变更操作（React 19 transitions 模式）。用于选择文件后立即上传。",
    "accept": "可接受的文件类型。使用 HTML accept 属性格式（例如 \"image/*\"、\".pdf,.doc\"）。",
    "isMultiple": "是否可选择多个文件。为 true 时，value 和 onChange 使用 File[] 而非 File。",
    "maxSize": "最大文件大小（字节）。超过此大小的文件会以错误状态被拒绝。",
    "maxFiles": "最大文件数量（仅在 isMultiple 为 true 时适用）。",
    "isLabelHidden": "在视觉上隐藏标签，同时保持屏幕阅读器可访问。",
    "description": "显示在标签和输入框之间的描述文本。",
    "isOptional": "在标签旁显示“可选”指示。与 isRequired 互斥。",
    "isRequired": "在标签旁显示“必填”指示，并为触发器添加仅屏幕阅读器可见的“必填”描述（辅助技术无法可靠播报触发器上的 aria-required）。与 isOptional 互斥。",
    "isDisabled": "禁用输入，阻止交互并使元素变暗。",
    "disabledMessage": "说明输入被禁用的原因。与 isDisabled 一起使用时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持触发器可聚焦（打开文件选择器仍被阻止）。请使用此属性，而不要将禁用的 FileInput 包裹在 Tooltip 中；禁用控件会吞掉外部 Tooltip 所需的悬停事件。",
    "isLoading": "使输入进入加载状态，显示加载指示器并设置 aria-busy。",
    "placeholder": "未选择文件时显示的占位文本。",
    "mode": "视觉模式。'input' 是紧凑的内联样式；'dropzone' 是支持拖放的较大区域。",
    "status": "校验状态：应用彩色边框。若提供了 message，则在输入下方显示浮动消息。error 类型还会设置 aria-invalid。",
    "statusVariant": "状态消息相对于输入的位置。attached 直接重叠在输入下方（带边框处理）；detached 作为独立元素在下方浮动并留出间距；tooltip 隐藏消息框，并在状态图标的工具提示中显示。dropzone 模式不支持 attached，因此 dropzone 默认为 detached；显式指定 attached 时会保留其已发布版本的渲染，直到下一个次版本将其解析为 detached。",
    "labelTooltip": "显示在标签末尾信息图标中的工具提示文本。",
    "width": "字段宽度（数字表示像素，字符串按原样使用，例如 \"100%\"）。会设置整个字段（标签、控件和状态）的尺寸，使其保持对齐。",
    "containerXstyle": "字段容器（标签、控件和状态整体）的 StyleX 样式。在 InputGroup 内（请改为设置 InputGroup 样式）或 `horizontal-labels` FormLayout 中无效。不接受根级 `xstyle`、`className` 和 `style`。",
    "containerClassName": "字段容器的类名。作用目标与 `containerXstyle` 相同。",
    "containerStyle": "字段容器的内联样式。作用目标与 `containerXstyle` 相同。",
    "controlXstyle": "视觉控件框的 StyleX 样式：绘制边框和背景、容纳图标和尾部控件的元素。绝不是原生输入框。",
    "controlClassName": "视觉控件框的类名。",
    "controlStyle": "视觉控件框的内联样式。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'File input w/ input/dropzone modes, validation, label, description, status.',
  usage: {
    description:
      'FileInput provides file upload with optional drag-and-drop support. Use it for single or multiple file selection with built-in validation for file type, size, and count.',
    bestPractices: [
      {guidance: true, description: 'Always specify an accept prop to guide users toward valid file types.'},
      {guidance: true, description: 'Use maxSize and maxFiles to prevent oversized uploads.'},
      {guidance: true, description: 'Add a description to communicate constraints.'},
      {guidance: true, description: 'Use changeAction for immediate upload workflows that benefit from optimistic UI.'},
      {guidance: false, description: "Don't use FileInput for directory uploads."},
      {guidance: false, description: "Don't use mode='input' unless space is constrained; dropzone mode provides a better experience."},
      {guidance: false, description: "Don't wrap a disabled FileInput in Tooltip to explain the disabled state; use the disabledMessage prop instead."},
    ],
    anatomy: [
      {name: 'Label', required: true, description: 'Text identifying the field.'},
      {name: 'Drop zone', required: true, description: 'Clickable area for file selection.'},
      {name: 'Placeholder', required: false, description: 'Hint text when no files selected.'},
      {name: 'File name display', required: false, description: 'Shows selected file names.'},
      {name: 'Clear button', required: false, description: 'Removes selected files.'},
    ],
  },
  propDescriptions: {
    containerXstyle: 'StyleX styles for the field container; no effect in InputGroup or horizontal-labels FormLayout. No root xstyle/className/style.',
    containerClassName: 'Class name for the field container.',
    containerStyle: 'Inline styles for the field container.',
    controlXstyle: 'StyleX styles for the visual control box (border, background, icons); not the native input.',
    controlClassName: 'Class name for the visual control box.',
    controlStyle: 'Inline styles for the visual control box.',
    label: 'Accessible label for the file input.',
    value: 'Currently selected file(s). Controlled.',
    onChange: 'Fired when files are selected or removed.',
    changeAction: 'Async action after onChange. For immediate upload.',
    accept: 'Accepted file types (HTML accept format).',
    isMultiple: 'Allow multiple file selection.',
    maxSize: 'Max file size in bytes. Rejects oversized files.',
    maxFiles: 'Max file count (isMultiple only).',
    isLabelHidden: 'Visually hides label; keeps screen reader access.',
    description: 'Description text between label+input.',
    isOptional: 'Shows "Optional" indicator.',
    isRequired: 'Shows "Required" indicator+SR-only trigger description.',
    isDisabled: 'Disables input, prevents interaction.',
    disabledMessage:
      'Explains why input is disabled. With isDisabled, shows tooltip on hover/focus + keeps trigger focusable via aria-disabled (opening picker stays blocked). Use instead of wrapping a disabled FileInput in Tooltip.',
    isLoading: 'Loading state w/ spinner+aria-busy.',
    placeholder: 'Placeholder when no files selected.',
    mode: "Visual mode: 'input' (compact) or 'dropzone' (drag-and-drop).",
    status: 'Validation status; colored border. Message floats below.',
    statusVariant: 'How status message is placed: attached overlaps below input; detached floats below w/ spacing; tooltip hides the box and shows it on the status icon. Dropzone: attached unsupported; defaults to detached (explicit attached kept until next minor).',
    labelTooltip: 'Tooltip in info icon at label end.',
  },
};
