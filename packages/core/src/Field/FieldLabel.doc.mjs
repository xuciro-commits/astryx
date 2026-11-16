// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'FieldLabel',
  subComponentOf: 'Field',
  displayName: 'Field Label',
  isHiddenFromOverview: true,
  description:
    'Standalone label group for one control or a caller-labelled group, with optional supporting text, optionality indicators, icon, and tooltip.',
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Label text, always rendered for accessibility.',
      required: true,
    },
    {
      name: 'inputID',
      type: 'string',
      description: 'ID of the input this label is for.',
      required: true,
    },
    {
      name: 'labelID',
      type: 'string',
      description:
        'ID applied to the label element itself. Use it with `aria-labelledby` when `isGroupLabel` is true.',
    },
    {
      name: 'isGroupLabel',
      type: 'boolean',
      description:
        'Render a span that can name a group instead of a native label for one control.',
      default: 'false',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        'Visually hide the label and description while keeping both available to assistive technology.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Use disabled label presentation for the associated control.',
      default: 'false',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description:
        "Show the localized optional indicator unless it matches FormLayout's default optionality.",
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description:
        "Show the localized required indicator unless it matches FormLayout's default optionality.",
      default: 'false',
    },
    {
      name: 'labelIcon',
      type: 'ReactNode | IconType',
      description:
        'Icon or rendered icon content before the label text. See `astryx docs icons` for semantic names.',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description:
        'Help text for an info button after the label, named "About {label}". Hover and keyboard focus preview it; a tap, click, Enter, or Space opens it and never focuses or toggles the control.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description:
        "Supporting content displayed below the label and kept separate from the control's accessible name.",
    },
    {
      name: 'descriptionID',
      type: 'string',
      description:
        'ID applied to the supporting description for caller-owned `aria-describedby` wiring.',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLLabelElement>',
      description:
        'Ref forwarded to the label element. Group mode currently renders a span.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles applied to the label element after its base and state styles.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'CSS class name appended to the label element.',
    },
    {
      name: 'style',
      type: 'React.CSSProperties',
      description:
        'Inline styles applied to the label element after StyleX inline styles.',
    },
  ],
};

export const docsZh = {
  "name": "FieldLabel",
  "isHiddenFromOverview": true,
  "displayName": "Field Label",
  "description": "独立的标签组，用于单个控件或调用方标注的组，可包含支持文本、可选性指示器、图标和工具提示。",
  "props": [
    {
      "name": "label",
      "type": "string",
      "description": "标签文本，始终为无障碍而渲染。",
      "required": true
    },
    {
      "name": "inputID",
      "type": "string",
      "description": "此标签所对应输入框的 ID。",
      "required": true
    },
    {
      "name": "labelID",
      "type": "string",
      "description": "应用于标签元素本身的 ID。当 `isGroupLabel` 为 true 时，与 `aria-labelledby` 搭配使用。"
    },
    {
      "name": "isGroupLabel",
      "type": "boolean",
      "description": "渲染一个可为组命名的 span，而不是为单个控件渲染原生 label。",
      "default": "false"
    },
    {
      "name": "isLabelHidden",
      "type": "boolean",
      "description": "在视觉上隐藏标签和描述，同时保持两者对辅助技术可用。",
      "default": "false"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "为关联控件使用禁用状态的标签呈现。",
      "default": "false"
    },
    {
      "name": "isOptional",
      "type": "boolean",
      "description": "显示本地化的可选指示器，除非它与 FormLayout 的默认可选性一致。",
      "default": "false"
    },
    {
      "name": "isRequired",
      "type": "boolean",
      "description": "显示本地化的必填指示器，除非它与 FormLayout 的默认可选性一致。",
      "default": "false"
    },
    {
      "name": "labelIcon",
      "type": "ReactNode | IconType",
      "description": "标签文本之前的图标或渲染的图标内容。语义名称参见 `astryx docs icons`。"
    },
    {
      "name": "labelTooltip",
      "type": "string",
      "description": "标签后信息按钮的帮助文本，名称为 \"About {label}\"。悬停和键盘聚焦会预览它；轻触、单击、Enter 或 Space 会打开它，且绝不会聚焦或切换控件。"
    },
    {
      "name": "description",
      "type": "ReactNode",
      "description": "显示在标签下方的支持内容，与控件的可访问名称保持分离。"
    },
    {
      "name": "descriptionID",
      "type": "string",
      "description": "应用于支持描述的 ID，供调用方自行连接 `aria-describedby`。"
    },
    {
      "name": "ref",
      "type": "React.Ref<HTMLLabelElement>",
      "description": "转发到标签元素的 Ref。组模式当前渲染 span。"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "在基础样式和状态样式之后应用于标签元素的 StyleX 样式。"
    },
    {
      "name": "className",
      "type": "string",
      "description": "追加到标签元素的 CSS 类名。"
    },
    {
      "name": "style",
      "type": "React.CSSProperties",
      "description": "在 StyleX 内联样式之后应用于标签元素的内联样式。"
    }
  ],
  "propDescriptions": {
    "label": "标签文本，始终为无障碍而渲染。",
    "inputID": "此标签所对应输入框的 ID。",
    "labelID": "应用于标签元素本身的 ID。当 `isGroupLabel` 为 true 时，与 `aria-labelledby` 搭配使用。",
    "isGroupLabel": "渲染一个可为组命名的 span，而不是为单个控件渲染原生 label。",
    "isLabelHidden": "在视觉上隐藏标签和描述，同时保持两者对辅助技术可用。",
    "isDisabled": "为关联控件使用禁用状态的标签呈现。",
    "isOptional": "显示本地化的可选指示器，除非它与 FormLayout 的默认可选性一致。",
    "isRequired": "显示本地化的必填指示器，除非它与 FormLayout 的默认可选性一致。",
    "labelIcon": "标签文本之前的图标或渲染的图标内容。语义名称参见 `astryx docs icons`。",
    "labelTooltip": "标签后信息按钮的帮助文本，名称为 \"About {label}\"。悬停和键盘聚焦会预览它；轻触、单击、Enter 或 Space 会打开它，且绝不会聚焦或切换控件。",
    "description": "显示在标签下方的支持内容，与控件的可访问名称保持分离。",
    "descriptionID": "应用于支持描述的 ID，供调用方自行连接 `aria-describedby`。",
    "ref": "转发到标签元素的 Ref。组模式当前渲染 span。",
    "xstyle": "在基础样式和状态样式之后应用于标签元素的 StyleX 样式。",
    "className": "追加到标签元素的 CSS 类名。",
    "style": "在 StyleX 内联样式之后应用于标签元素的内联样式。"
  }
};

export const docsDense = {
  name: 'FieldLabel',
  isHiddenFromOverview: true,
  displayName: 'Field Label',
  description:
    'label group for one control or a caller-labelled group; supporting text, optionality, icon, tooltip',
  propDescriptions: {
    label: 'Label text.',
    inputID: 'ID of the associated control.',
    labelID: 'ID of the label element for caller-owned aria-labelledby.',
    isGroupLabel: 'Render a group-label span instead of a native label.',
    isLabelHidden: 'Visually hide label and description.',
    isDisabled: 'Use disabled label presentation.',
    isOptional: 'Show localized optional exception indicator.',
    isRequired: 'Show localized required exception indicator.',
    labelIcon: 'Icon type or rendered icon content before label text.',
    labelTooltip: 'Help text for the info button after the label.',
    description: 'Supporting content outside the accessible name.',
    descriptionID: 'ID for caller-owned aria-describedby wiring.',
    ref: 'Ref forwarded to the label element; group mode renders a span.',
    xstyle: 'StyleX styles for the label element.',
    className: 'CSS class name for the label element.',
    style: 'Inline styles for the label element.',
  },
};
