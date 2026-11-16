// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Text',
    required: true,
    description:
      'Polymorphic text element that renders the supplied content with themed typography.',
  },
  {
    name: 'Heading',
    required: false,
    description:
      'Referenced Heading member that renders the supplied content as a semantic h1–h6 element.',
  },
  {
    name: 'Truncation tooltip',
    required: false,
    description:
      'Tooltip-owned surface available only when Text or Heading is measured as truncated and truncation tooltips are enabled.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Text',
  displayName: 'Text',
  category: 'Content',
  keywords: [
    'text',
    'typography',
    'label',
    'paragraph',
    'heading',
    'caption',
    'font',
    'body',
    'subtitle',
  ],
  playground: {
    defaults: {
      children: 'The quick brown fox jumps over the lazy dog.',
      type: 'body',
    },
  },
  theming: {
    targets: [
      {
        className: 'astryx-heading',
        visualProps: ['level', 'color', 'type', 'weight'],
      },
      {className: 'astryx-text', visualProps: ['type', 'size', 'color']},
    ],
  },
  description:
    'Semantic body text component that renders text with type-based styling from the theme, with optional truncation, decoration, and layout props.',
  props: [
    {
      name: 'type',
      type: "'body' | 'large' | 'label' | 'supporting' | 'code' | 'display-1' | 'display-2' | 'display-3' | 'inherit'",
      description:
        "Semantic text type. Determines size, weight, and line-height from the theme. 'inherit' takes all three from the surrounding text instead. Themes may add custom types. Note: this prop is called `type`, not `variant`.",
      default: "'body'",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Text content.',
      required: true,
    },
    {
      name: 'size',
      type: "'4xs' | '3xs' | '2xs' | 'xsm' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'",
      description:
        'Explicit font size override. Overrides the size from `type` but preserves other type properties. Prefer using `type` alone.',
    },
    {
      name: 'color',
      type: "'primary' | 'secondary' | 'disabled' | 'placeholder' | 'accent' | 'inherit'",
      description:
        "Text color. Defaults to 'secondary' for the 'supporting' type, 'primary' for all others. Themes may add custom colors.",
    },
    {
      name: 'weight',
      type: "'normal' | 'medium' | 'semibold' | 'bold'",
      description: 'Font weight override.',
    },
    {
      name: 'display',
      type: "'inline' | 'block'",
      description:
        "Display type. Silently overridden to 'block' when maxLines > 0 or hasCapsize is true.",
      default: "'inline'",
    },
    {
      name: 'as',
      type: "'span' | 'p' | 'div' | 'label'",
      description: 'HTML element to render.',
      default: "'span'",
    },
    {
      name: 'maxLines',
      type: 'number',
      description:
        'Maximum lines before truncation. 0 means no truncation. When set, shows a tooltip on hover if content is truncated.',
      default: '0',
    },
    {
      name: 'hasTruncateTooltip',
      type: "boolean | 'above' | 'below' | 'start' | 'end'",
      description:
        "Controls tooltip behavior for truncated text. true shows the tooltip at the default position, false disables it, or a placement string ('above' | 'below' | 'start' | 'end') sets a specific position.",
      default: 'true',
    },
    {
      name: 'wordBreak',
      type: "'break-word' | 'break-all'",
      description:
        "Word break behavior when truncating. Defaults to 'break-all' for single-line truncation, 'break-word' otherwise. Without truncation, a token longer than its line (a URL, an ID) wraps (`overflow-wrap: break-word`), so in ordinary flow text does not make the page scroll sideways. Inside a flex row, give the flex child `min-width: 0` so it can shrink. A container you style with `overflow-wrap: anywhere` does not reach this text; Astryx's own containers pass their wrap through.",
    },
    {
      name: 'textWrap',
      type: "'wrap' | 'nowrap' | 'balance' | 'pretty'",
      description: 'Text wrapping behavior.',
    },
    {
      name: 'justify',
      type: "'start' | 'center' | 'end'",
      description:
        'Text alignment (justification). Uses logical values (start/end) for i18n/RTL compatibility.',
      default: "'start'",
    },
    {
      name: 'hasCapsize',
      type: 'boolean',
      description:
        'Enable optical alignment using text-box-trim. Forces block display.',
      default: 'false',
    },
    {
      name: 'hasStrikethrough',
      type: 'boolean',
      description: 'Apply strikethrough text decoration.',
      default: 'false',
    },
    {
      name: 'hasTabularNumbers',
      type: 'boolean',
      description: 'Use tabular (monospace) numbers for aligned numeric data.',
      default: 'false',
    },
    {
      name: 'id',
      type: 'string',
      description: 'HTML id attribute.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
  ],
  components: [{name: 'Heading'}],
  usage: {
    anatomy,
    description:
      'Text renders styled body text and headings from the theme. Use Text with a semantic type for body copy, labels, and captions, and Heading for section titles that output the correct h1\u2013h6 element.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pick a semantic type (body, label, supporting, large, code) instead of manually setting size and weight; the theme handles the details.',
      },
      {
        guidance: true,
        description:
          'Set accessibilityLevel on Heading when the visual level differs from the document outline so screen readers announce the correct hierarchy.',
      },
      {
        guidance: true,
        description:
          'Use maxLines with a number to truncate long content; a tooltip appears automatically on hover so no text is lost.',
      },
      {
        guidance: true,
        description:
          'Enable hasTabularNumbers for columns of numeric data so digits align vertically across rows.',
      },
      {
        guidance: false,
        description:
          'Override size and weight when a semantic type already matches; extra overrides fight the theme and break when themes change.',
      },
      {
        guidance: false,
        description:
          'Skip heading levels in the document outline; go h1 then h2 then h3, never h1 then h3.',
      },
      {
        guidance: false,
        description:
          'Use raw HTML tags like <p>, <h1>\u2013<h6>, or <span> for text; Text and Heading apply the correct theme tokens automatically.',
      },
      {
        guidance: false,
        description:
          'Pass a `variant` prop; Text does not have a `variant` prop. Use `type` for semantic styling (body, label, large, supporting, code) or use Heading for headings.',
      },
      {
        guidance: false,
        description:
          'Use Text for headings; use Heading with a `level` prop (1\u20136) for section titles and headings.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "Text 使用主题渲染带样式的正文文本和标题。正文、标签和说明文字使用带语义类型的 Text；需要输出正确 h1–h6 元素的章节标题使用 Heading。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "选择语义类型（body、label、supporting、large、code），而不是手动设置大小和字重；主题会处理细节。"
      },
      {
        "guidance": true,
        "description": "当视觉层级与文档大纲不一致时，在 Heading 上设置 accessibilityLevel，以便屏幕阅读器宣布正确的层级。"
      },
      {
        "guidance": true,
        "description": "使用带数字的 maxLines 截断长内容；悬停时会自动显示工具提示，因此不会丢失文本。"
      },
      {
        "guidance": true,
        "description": "为数值数据列启用 hasTabularNumbers，使数字在各行之间垂直对齐。"
      },
      {
        "guidance": false,
        "description": "当语义类型已经匹配时不要覆盖 size 和 weight；额外覆盖会与主题冲突，并在主题变化时失效。"
      },
      {
        "guidance": false,
        "description": "不要跳过文档大纲中的标题层级；依次 h1、h2、h3，绝不要 h1 后直接 h3。"
      },
      {
        "guidance": false,
        "description": "文本使用原生 HTML 标签，如 <p>、<h1>–<h6> 或 <span>；Text 和 Heading 会自动应用正确的主题令牌。"
      },
      {
        "guidance": false,
        "description": "传入 `variant` 属性；Text 没有 `variant` 属性。使用 `type` 进行语义样式设置（body、label、large、supporting、code），或使用 Heading 处理标题。"
      },
      {
        "guidance": false,
        "description": "不要用 Text 处理标题；章节标题和标题请使用带 `level` 属性（1–6）的 Heading。"
      }
    ],
    "anatomy": [
      {
        "name": "文本",
        "required": true,
        "description": "多态文本元素，使用主题排版渲染提供的内容。"
      },
      {
        "name": "标题",
        "required": false,
        "description": "引用的 Heading 成员，将提供的内容渲染为语义 h1–h6 元素。"
      },
      {
        "name": "截断工具提示",
        "required": false,
        "description": "仅当 Text 或 Heading 被测量为已截断且启用了截断工具提示时可用的工具提示自有表面。"
      }
    ]
  },
  "name": "Text",
  "description": "语义正文文本组件，使用主题中基于类型的样式渲染文本，并支持可选的截断、装饰和布局属性。",
  "propDescriptions": {
    "type": "语义文本类型。从主题决定大小、字重和行高。'inherit' 改为从周围文本继承这三者。主题可以添加自定义类型。注意：此属性名为 `type`，不是 `variant`。",
    "children": "文本内容。",
    "size": "显式字体大小覆盖。覆盖 `type` 中的大小，但保留其他类型属性。建议仅使用 `type`。",
    "color": "文本颜色。'supporting' 类型默认为 'secondary'，其他类型默认为 'primary'。主题可以添加自定义颜色。",
    "weight": "字重覆盖。",
    "display": "显示类型。当 maxLines > 0 或 hasCapsize 为 true 时会静默覆盖为 'block'。",
    "as": "要渲染的 HTML 元素。",
    "maxLines": "截断前的最大行数。0 表示不截断。设置后，如果内容被截断，悬停时会显示工具提示。",
    "hasTruncateTooltip": "控制截断文本的工具提示行为。true 在默认位置显示工具提示，false 禁用它，或使用位置字符串（'above' | 'below' | 'start' | 'end'）设置特定位置。",
    "wordBreak": "截断时的断词行为。单行截断默认为 'break-all'，否则为 'break-word'。不截断时，长于其行的令牌（URL、ID）会换行（`overflow-wrap: break-word`），因此在普通流式文本中不会使页面横向滚动。在 flex 行中，为 flex 子项设置 `min-width: 0` 以便它能够收缩。使用 `overflow-wrap: anywhere` 设置样式的容器不会影响此文本；Astryx 自有的容器会传递其换行设置。",
    "textWrap": "文本换行行为。",
    "justify": "文本对齐（两端对齐）。使用逻辑值（start/end）以兼容 i18n/RTL。",
    "hasCapsize": "使用 text-box-trim 启用光学对齐。强制块级显示。",
    "hasStrikethrough": "应用删除线文本装饰。",
    "hasTabularNumbers": "为对齐的数值数据使用表格（等宽）数字。",
    "id": "HTML id 属性。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值：不能是 style={{}} 这样的内联样式对象。"
  },
  "components": [
    {
      "name": "Heading",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'semantic body text + headings w/ theme-driven type scale, truncation, tabular numbers',
  usage: {
    description:
      'Text renders styled body text and headings. Text for body copy with semantic types, Heading for h1\u2013h6 with theme tokens.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Semantic type (body, label, supporting, large, code) instead of manual size/weight.',
      },
      {
        guidance: true,
        description:
          'accessibilityLevel on Heading when visual level differs from document outline.',
      },
      {
        guidance: true,
        description:
          'maxLines for truncation; tooltip shows full text on hover.',
      },
      {
        guidance: true,
        description: 'hasTabularNumbers for aligned numeric columns.',
      },
      {
        guidance: false,
        description:
          'Override size/weight when a semantic type already matches.',
      },
      {
        guidance: false,
        description: 'Skip heading levels; sequential h1 \u2192 h2 \u2192 h3.',
      },
      {
        guidance: false,
        description: 'Raw <p>/<h1>/<span>; use Text/Heading for theme tokens.',
      },
      {
        guidance: false,
        description:
          '`variant` prop, which does not exist. Use `type` for text styling or Heading for headings.',
      },
      {
        guidance: false,
        description: 'Text for headings: use Heading with level (1\u20136).',
      },
    ],
  },
};
