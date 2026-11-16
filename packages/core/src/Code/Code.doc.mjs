// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'Code',
  displayName: 'Code',
  keywords: ['inlinecode', 'monospace'],
  group: 'Code',
  category: 'Content',
  description:
    'Inline code element with a monospace font and muted background. Use it for short code references within prose.',
  usage: {
    description:
      'Code marks short inline references such as function names, variables, file paths, and command-line flags. Use CodeBlock for standalone or multi-line snippets.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use Code for short technical terms inside prose, such as a function name, prop, file path, or command-line flag.',
      },
      {
        guidance: true,
        description:
          "Set size to 'inherit' when inline code should match the surrounding text size and line height.",
      },
      {
        guidance: false,
        description:
          'Use Code for multi-line or standalone snippets. Use CodeBlock instead so readers get appropriate block formatting and syntax support.',
      },
      {
        guidance: false,
        description:
          'Use Code as an interactive copy or navigation control. Pair it with the appropriate Button or Link when an action is required.',
      },
    ],
    anatomy: [
      {
        name: 'Container',
        required: true,
        description:
          'The semantic code element that contains the inline code content and paints the background, typography, padding, and radius.',
      },
    ],
  },
  playground: {
    defaults: {
      children: 'const count = 0',
    },
  },
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The inline code content.',
      required: true,
    },
    {
      name: 'color',
      type: "'primary' | 'secondary' | 'inherit'",
      description:
        "Text color. Use 'inherit' to take the surrounding text color.",
      default: "'primary'",
    },
    {
      name: 'size',
      type: "'inherit'",
      description:
        "Set to 'inherit' to take the surrounding font size and line height. Omit it to use the code type-scale size.",
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLElement>',
      description: 'Ref forwarded to the semantic code element.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization. Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'CSS class name for the root element. Prefer xstyle for styling.',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description:
        'Inline styles for the root element. Prefer xstyle for StyleX-optimized styling.',
    },
    {
      name: 'data-testid',
      type: 'string',
      description: 'Test selector for automated testing frameworks.',
    },
  ],
  theming: {
    targets: [{className: 'astryx-code', visualProps: ['color', 'size']}],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'inline semantic code for short technical references in prose; CodeBlock handles standalone or multi-line snippets',
  usage: {
    description:
      'Use for short function names, variables, paths, and CLI flags inside prose. Use CodeBlock for standalone or multi-line snippets.',
    bestPractices: [
      {
        guidance: true,
        description: 'Use for short technical references inside prose.',
      },
      {
        guidance: true,
        description:
          "Set size='inherit' to match surrounding text size and line height.",
      },
      {
        guidance: false,
        description:
          'Use for multi-line or standalone snippets; use CodeBlock instead.',
      },
      {
        guidance: false,
        description:
          'Use as an interactive control; pair with Button or Link for actions.',
      },
    ],
  },
  propDescriptions: {
    children: 'inline code content.',
    color:
      'text color: primary, secondary, or inherited from surrounding text.',
    size: "set to 'inherit' to take the surrounding font size and line height.",
    ref: 'ref forwarded to the semantic code element.',
    xstyle:
      'StyleX layout styles; must be a stylex.create() value, not an inline style object.',
    className: 'CSS class for the root; prefer xstyle.',
    style: 'inline styles for the root; prefer xstyle.',
    'data-testid': 'test selector for automated testing frameworks.',
  },
};

export const docsZh = {
  "name": "Code",
  "description": "具有等宽字体和柔和背景的行内代码元素。用于正文中的简短代码引用。",
  "usage": {
    "description": "Code 标记简短的行内引用，例如函数名、变量、文件路径和命令行标志。独立或多行代码片段请使用 CodeBlock。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在正文中使用 Code 表示简短的技术术语，例如函数名、属性、文件路径或命令行标志。"
      },
      {
        "guidance": true,
        "description": "当行内代码需要匹配周围文本的字号和行高时，将 size 设为 'inherit'。"
      },
      {
        "guidance": false,
        "description": "不要将 Code 用于多行或独立代码片段。请改用 CodeBlock，以便读者获得合适的块级格式和语法支持。"
      },
      {
        "guidance": false,
        "description": "不要将 Code 用作交互式复制或导航控件。需要操作时，请搭配相应的 Button 或 Link。"
      }
    ],
    "anatomy": [
      {
        "name": "容器",
        "required": true,
        "description": "包含行内代码内容并绘制背景、排版、内边距和圆角的语义化 code 元素。"
      }
    ]
  },
  "propDescriptions": {
    "children": "行内代码内容。",
    "color": "文本颜色。使用 'inherit' 继承周围文本颜色。",
    "size": "设为 'inherit' 以继承周围的字号和行高。省略则使用代码字体比例尺寸。",
    "ref": "转发到语义化 code 元素的 ref。",
    "xstyle": "用于布局自定义的 StyleX 样式。必须是 stylex.create() 值，而不是像 style={{}} 这样的内联样式对象。",
    "className": "根元素的 CSS 类名。样式优先使用 xstyle。",
    "style": "根元素的内联样式。优先使用 xstyle 以获得 StyleX 优化的样式。",
    "data-testid": "供自动化测试框架使用的测试选择器。"
  }
};
