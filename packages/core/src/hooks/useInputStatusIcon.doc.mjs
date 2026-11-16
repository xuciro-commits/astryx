// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useInputStatusIcon',
  displayName: 'useInputStatusIcon',
  keywords: [
    'input',
    'status',
    'icon',
    'error',
    'warning',
    'success',
    'validation',
    'tooltip',
    'info tip',
    'field',
    'describedby',
    'accessibility',
    'a11y',
  ],
  params: [
    {
      name: 'options',
      type: 'UseInputStatusIconOptions',
      description: 'Configuration object.',
      required: true,
    },
    {
      name: 'options.status',
      type: 'InputStatus',
      description:
        "The input's status (type plus message), or undefined when there is none.",
    },
    {
      name: 'options.statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description: 'How the status is presented relative to the input.',
      default: "'attached'",
    },
    {
      name: 'options.isInGroup',
      type: 'boolean',
      description:
        'Whether the input sits inside an InputGroup, which owns status rendering itself.',
      default: 'false',
    },
    {
      name: 'options.size',
      type: 'IconSize',
      description: 'Size of the on-field icon.',
      default: "'md'",
    },
  ],
  returns: [
    {
      name: 'statusIcon',
      type: 'ReactNode',
      description:
        'The affordance to render inside the input container: a plain icon, or a focusable info-tip button with its tooltip. Null when no icon should render.',
    },
    {
      name: 'describedBy',
      type: 'string | undefined',
      description:
        "ID to add to the input's aria-describedby, present exactly when a tooltip element is in the DOM, so there is never a dangling reference.",
    },
  ],
  usage: {
    description:
      'Builds the on-field status affordance for a bordered input and its accessibility wiring, so every input in the family behaves the same for a given status. The attached variant renders a plain glyph and leaves the text to the message box; the detached variant renders nothing here, because the message box already carries its own icon; the tooltip variant renders a real focusable button whose tooltip is reachable by keyboard, pointer, touch and assistive tech. Use it when building a bordered input, not for field-level messaging.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Render statusIcon inside the input container and merge describedBy into the control's aria-describedby list.",
      },
      {
        guidance: true,
        description:
          'Let it decide when nothing should render; pass isInGroup and the variant through rather than branching at the call site.',
      },
      {
        guidance: false,
        description:
          'Use it to convey the status by icon alone; the tooltip variant is the only one that carries the message, so the others still need a message box.',
      },
    ],
  },
  relatedComponents: [
    'TextInput',
    'TextArea',
    'NumberInput',
    'DateInput',
    'FileInput',
    'FieldStatus',
    'InputGroup',
  ],
  relatedHooks: ['useInputContainer'],
  importPath: '@astryxdesign/core/hooks',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'On-field status affordance + a11y wiring for bordered inputs. attached = plain glyph (message box carries text); detached = nothing (box has own icon); tooltip = focusable info-tip button reachable by keyboard / pointer / touch / AT.',
  paramDescriptions: {
    options: 'config.',
    'options.status': 'input status (type + message), or undefined.',
    'options.statusVariant': 'how status is presented relative to input.',
    'options.isInGroup': 'inside InputGroup, which owns status rendering.',
    'options.size': 'on-field icon size.',
  },
  returnDescriptions: {
    statusIcon:
      'node to render inside input container; null when nothing should render.',
    describedBy:
      'id for aria-describedby, present exactly when the tooltip element is in the DOM.',
  },
  usage: {
    description:
      'Use when building a bordered input so all inputs behave the same per status; not for field-level messaging.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Render statusIcon in the input container; merge describedBy into aria-describedby.',
      },
      {
        guidance: true,
        description:
          'Pass isInGroup + variant through; let the hook decide when nothing renders.',
      },
      {
        guidance: false,
        description:
          'Rely on the icon alone for meaning; only the tooltip variant carries the message.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useInputStatusIcon",
  "usage": {
    "description": "为带边框的输入框构建字段内状态提示及其可访问性接线，使该系列中的每个输入框在给定状态下行为一致。attached 变体渲染普通字形，将文本留给消息框；detached 变体在此不渲染任何内容，因为消息框已自带图标；tooltip 变体渲染真正的可聚焦按钮，其工具提示可通过键盘、指针、触摸和辅助技术访问。在构建带边框的输入框时使用它，不要用于字段级消息。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在输入容器内渲染 statusIcon，并将 describedBy 合并到控件的 aria-describedby 列表中。"
      },
      {
        "guidance": true,
        "description": "让它决定何时不渲染任何内容；直接传入 isInGroup 和变体，而不是在调用处分支。"
      },
      {
        "guidance": false,
        "description": "仅用它通过图标传达状态；tooltip 变体是唯一携带消息的变体，其他变体仍需要消息框。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "配置对象。",
    "options.status": "输入框的状态（类型加消息），没有状态时为 undefined。",
    "options.statusVariant": "状态相对于输入框的呈现方式。",
    "options.isInGroup": "输入框是否位于 InputGroup 内，InputGroup 会自行负责状态渲染。",
    "options.size": "字段内图标的尺寸。"
  },
  "returnDescriptions": {
    "statusIcon": "在输入容器内渲染的提示：普通图标，或带工具提示的可聚焦信息提示按钮。不应渲染图标时为 null。",
    "describedBy": "要添加到输入框 aria-describedby 的 ID，仅在工具提示元素存在于 DOM 中时提供，因此绝不会出现悬空引用。"
  }
};
