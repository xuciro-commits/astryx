// Copyright (c) Meta Platforms, Inc. and affiliates.



/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Blockquote',
  displayName: 'Blockquote',
  category: 'Content',
  keywords: ["blockquote","quote","citation","pullquote","quotation","cite","excerpt"],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content of the blockquote.',
      required: true,
    },
    {
      name: 'cite',
      type: 'ReactNode',
      description: 'Optional attribution for the quote. Rendered in a <cite> element after the quoted content.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
  ],
  playground: {
    defaults: {
      children:
        'Design is not just what it looks like and feels like. Design is how it works.',
      cite: 'Steve Jobs',
    },
  },
  theming: {
    targets: [
      {className: 'astryx-blockquote', visualProps: []},
    ],
  },
  usage: {
    description: 'A quotation block with a rule on its inline-start edge and secondary text color. Use to highlight quoted content, testimonials, or excerpts. The rule and padding are logical, so they move to the right edge in right-to-left locales.',
    anatomy: [
      {name: 'Rule', required: true, description: 'The border on the inline-start edge, drawn with --color-border-emphasized.'},
      {name: 'Quotation', required: true, description: 'The quoted content, passed as children. Renders inside the <blockquote> element.'},
      {name: 'Attribution', required: false, description: 'The source, passed as cite. Renders as a <cite> element below the quotation.'},
    ],
    bestPractices: [
      { guidance: true, description: 'Use for quoted text, testimonials, or highlighted excerpts from external sources.' },
      { guidance: true, description: 'Provide a cite prop when the source of the quote is known.' },
      { guidance: true, description: 'Pass the source through cite rather than typing it into children, so it renders as a semantic <cite> element that assistive technology can distinguish from the quotation.' },
      { guidance: false, description: 'Use for callout boxes or informational notes; use Banner for those.' },
      { guidance: false, description: 'Wrap the attribution in your own <footer>. A <footer> inside a <blockquote> becomes a contentinfo document landmark, and a page with several quotes then reports several page footers.' },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Blockquote",
  "displayName": "Blockquote",
  "props": [
    {
      "name": "children",
      "type": "ReactNode",
      "description": "引用块的内容。",
      "required": true
    },
    {
      "name": "cite",
      "type": "ReactNode",
      "description": "引文的可选署名。在引用内容之后渲染于 `<cite>` 元素中。"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 `stylex.create()` 的值，而不是 `style={{}}` 这样的内联样式对象。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-blockquote",
        "visualProps": []
      }
    ]
  },
  "usage": {
    "description": "带内联起始侧规则线和次要文字颜色的引用块。用于突出显示引用内容、证言或节选。规则线和内边距采用逻辑属性，因此在从右到左的语言环境中会移到右侧边缘。",
    "anatomy": [
      {
        "name": "规则线",
        "required": true,
        "description": "内联起始侧边缘的边框，使用 `--color-border-emphasized` 绘制。"
      },
      {
        "name": "引用内容",
        "required": true,
        "description": "作为 `children` 传入的引用内容，在 `<blockquote>` 元素内渲染。"
      },
      {
        "name": "署名",
        "required": false,
        "description": "作为 `cite` 传入的来源，在引用内容下方渲染为 `<cite>` 元素。"
      }
    ],
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于引用文本、证言或来自外部来源的突出节选。"
      },
      {
        "guidance": true,
        "description": "当引文来源已知时，提供 `cite` 属性。"
      },
      {
        "guidance": true,
        "description": "通过 `cite` 传入来源，而不是直接输入到 `children` 中，这样它会渲染为语义化的 `<cite>` 元素，辅助技术可将其与引文区分开。"
      },
      {
        "guidance": false,
        "description": "用于标注框或信息性提示；这些场景请改用 Banner。"
      },
      {
        "guidance": false,
        "description": "将署名包裹在自己的 `<footer>` 中。`<blockquote>` 内的 `<footer>` 会成为 contentinfo 文档地标，含有多处引用的页面会因此报告多个页面页脚。"
      }
    ]
  },
  "propDescriptions": {
    "children": "引用块的内容。",
    "cite": "引文的可选署名。在引用内容之后渲染于 `<cite>` 元素中。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 `stylex.create()` 的值，而不是 `style={{}}` 这样的内联样式对象。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'quotation block w/ inline-start rule, secondary text, optional citation',
  usage: {
    description: 'A quotation block with a rule on its inline-start edge and secondary text color. Use to highlight quoted content, testimonials, or excerpts.',
    bestPractices: [
      { guidance: true, description: 'Use for quoted text, testimonials, or highlighted excerpts.' },
      { guidance: true, description: 'Provide cite when source is known.' },
      { guidance: true, description: 'Pass the source via cite, not inside children.' },
      { guidance: false, description: 'Use for callouts/notes; use Banner instead.' },
      { guidance: false, description: 'Wrap the attribution in <footer>; it becomes a contentinfo landmark.' },
    ],
  },
  propDescriptions: {
    children: 'blockquote content',
    cite: 'optional attribution rendered as <cite> after the quote',
    xstyle: 'StyleX styles for layout; must be stylex.create() value',
  },
};
