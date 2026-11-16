// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'InputGroupText',
  subComponentOf: 'InputGroup',
  displayName: 'Input Group Text',
  isHiddenFromOverview: true,
  description:
    'A prefix or suffix text element rendered inside InputGroup. Displays text or icons.',
  usage: {
    description:
      "Use InputGroupText inside InputGroup for a short fixed prefix or suffix, such as a currency symbol, a protocol, or a unit, or for a decorative icon. It is plain text, not a control, and it is not part of the input's accessible name.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep the text short, such as $, https://, or kg. It stays on one line and does not shrink.',
      },
      {
        guidance: true,
        description:
          'Plain text keeps its character order under right-to-left, so https:// and .com read as written. When rich content mixes directions, mark the direction on your own content, for example with `dir` or `<bdi>`.',
      },
      {
        guidance: true,
        description:
          'Put what a screen reader user needs in the input\'s own label, such as "Amount in USD" beside a $ prefix. The addon is read as plain text in reading order.',
      },
      {
        guidance: false,
        description:
          'Put buttons, links, or other controls inside InputGroupText. Use a Button addon for an action.',
      },
      {
        guidance: false,
        description:
          'Use InputGroupText outside InputGroup. Its borders and corners join an InputGroup row.',
      },
    ],
    anatomy: [
      {
        name: 'Text cell',
        required: true,
        description:
          'A non-interactive cell that holds text or an icon and joins the borders of its neighbours in the row.',
      },
    ],
  },
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Text or icon content.',
      required: true,
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'CSS class name(s).',
    },
    {
      name: 'style',
      type: 'React.CSSProperties',
      description: 'Inline styles.',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLDivElement>',
      description: 'Ref forwarded to the text cell element.',
    },
  ],
};

export const docsDense = {
  name: 'InputGroupText',
  isHiddenFromOverview: true,
  displayName: 'Input Group Text',
  description: 'prefix/suffix text/icon element',
  propDescriptions: {
    children: 'text or icon content',
    xstyle: 'StyleX styles (stylex.create() value)',
    className: 'CSS class name(s)',
    style: 'inline styles',
    ref: 'ref to the text cell',
  },
};

export const docsZh = {
  "name": "InputGroupText",
  "displayName": "Input Group Text",
  "description": "在 InputGroup 内渲染的前缀或后缀文本元素。可显示文本或图标。",
  "usage": {
    "description": "在 InputGroup 内使用 InputGroupText 表示简短的固定前缀或后缀（例如货币符号、协议或单位），或表示装饰性图标。它是纯文本而非控件，也不属于输入框的无障碍名称。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "文本保持简短，例如 $、https:// 或 kg。它会保持单行且不会收缩。"
      },
      {
        "guidance": true,
        "description": "在从右到左的书写环境中，纯文本会保持字符顺序，因此 https:// 和 .com 仍按原样阅读。当富内容混合了不同书写方向时，请在你自己的内容上标明方向，例如使用 `dir` 或 `<bdi>`。"
      },
      {
        "guidance": true,
        "description": "把屏幕阅读器用户需要的信息放进输入框自身的 label，例如在 $ 前缀旁写 “Amount in USD”。附加内容会按阅读顺序作为纯文本朗读。"
      },
      {
        "guidance": false,
        "description": "不要在 InputGroupText 内放置按钮、链接或其他控件。需要操作时请使用 Button 附加项。"
      },
      {
        "guidance": false,
        "description": "不要在 InputGroup 之外使用 InputGroupText。它的边框和圆角会与 InputGroup 行拼接。"
      }
    ],
    "anatomy": [
      {
        "name": "文本单元格",
        "required": true,
        "description": "非交互单元格，用于承载文本或图标，并与行内相邻元素的边框拼接。"
      }
    ]
  },
  "propDescriptions": {
    "children": "文本或图标内容。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值：不能是 style={{}} 这样的内联样式对象。",
    "className": "CSS 类名。",
    "style": "内联样式。",
    "ref": "转发到文本单元格元素的 ref。"
  }
};
