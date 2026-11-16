// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Citation',
  displayName: 'Citation',
  group: 'Citation',
  category: 'Content',

  usage: {
    description:
      'Citations display inline references to external sources. Use them to attribute information within AI-generated responses, articles, or anywhere provenance and source links are needed.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use the label variant when the source title adds meaningful context for the reader.',
      },
      {
        guidance: true,
        description:
          'Use the number variant for compact inline references within body text, like footnotes.',
      },
      {
        guidance: false,
        description:
          'Mix label and number variants in the same paragraph. Pick one style per context for visual consistency.',
      },
    ],
    anatomy: [
      {
        name: 'Container',
        required: true,
        description:
          'The root wrapper. Accepted source URLs render an anchor; missing or rejected URLs render an inert span.',
      },
      {
        name: 'Icon',
        required: false,
        description:
          'An optional source icon shown before the label text. Accepts a favicon/logo image URL (via source.src) or a React node such as an Astryx <Icon>. Only available in the label variant.',
      },
      {
        name: 'Label text',
        required: false,
        description:
          'The source title, truncated with ellipsis when it exceeds the max width. Shown in the label variant.',
      },
      {
        name: 'Number',
        required: false,
        description:
          'The citation index displayed as a superscript badge. Shown in the number variant.',
      },
    ],
  },

  // `source` is a custom object type the docsite preview cannot generate
  // automatically; without these defaults the properties tab shows the
  // missing-required-props placeholder instead of an interactive preview.
  playground: {
    defaults: {
      source: {title: 'Astryx Design', url: 'https://example.com'},
      number: 1,
    },
  },

  props: [
    {
      name: 'source',
      type: 'CitationSource',
      description:
        'The citation source object containing title, url, an optional image src, and an optional icon node. The url follows the shared navigation rule described on the Link `href` prop; rejected destinations leave the citation visible without navigation. Image src uses separate resource handling.',
      required: true,
    },
    {
      name: 'number',
      type: 'number',
      description: 'The display index for this citation.',
      required: true,
    },
    {
      name: 'variant',
      type: "'label' | 'number'",
      description:
        'Display style: a label chip showing the source title or a compact numbered badge.',
      default: "'label'",
    },
  ],
  theming: {
    targets: [
      {className: 'astryx-citation', visualProps: ['variant']},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Inline reference to external source. Attribute info in AI responses, articles, or anywhere provenance needed.',
  usage: {
    description:
      'Inline reference to external source. Attribute info in AI responses, articles, or anywhere provenance needed.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use label variant when source title adds meaningful context.',
      },
      {
        guidance: true,
        description:
          'Use number variant for compact inline references in body text, like footnotes.',
      },
      {
        guidance: false,
        description:
          'Mix label and number variants in same paragraph. Pick one style per context.',
      },
    ],
  },
  propDescriptions: {
    source:
      'citation source with title, url, optional image src, and optional icon. url follows the Link href navigation rule; rejected destinations stay visible without navigation. Image src handling is separate.',
    number: 'display index for this citation.',
    variant: 'display style: label chip with source title or compact numbered badge.',
  },
};

export const docsZh = {
  "name": "Citation",
  "usage": {
    "description": "Citation 显示对外部来源的行内引用。用于在 AI 生成的回复、文章或任何需要标明出处和来源链接的地方标注信息。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "当来源标题能为读者提供有意义的上下文时，使用标签变体。"
      },
      {
        "guidance": true,
        "description": "在正文中进行紧凑的行内引用（类似脚注）时，使用数字变体。"
      },
      {
        "guidance": false,
        "description": "不要在同一段落中混用标签和数字变体。为保持视觉一致性，每个上下文只选择一种样式。"
      }
    ],
    "anatomy": [
      {
        "name": "容器",
        "required": true,
        "description": "根包装器。有效的来源 URL 会渲染为锚点；缺失或被拒绝的 URL 会渲染为不可交互的 span。"
      },
      {
        "name": "图标",
        "required": false,
        "description": "显示在标签文本之前的可选来源图标。接受 favicon/logo 图片 URL（通过 source.src）或 React 节点，例如 Astryx <Icon>。仅在标签变体中可用。"
      },
      {
        "name": "标签文本",
        "required": false,
        "description": "来源标题，超过最大宽度时以省略号截断。在标签变体中显示。"
      },
      {
        "name": "数字",
        "required": false,
        "description": "以上标徽章形式显示的引用索引。在数字变体中显示。"
      }
    ]
  },
  "propDescriptions": {
    "source": "引用来源对象，包含 title、url、可选的 image src 以及可选的 icon 节点。url 遵循 Link `href` 属性上描述的共享导航规则；被拒绝的目标会让引用保持可见但无法导航。图片 src 使用独立的资源处理。",
    "number": "此引用的显示索引。",
    "variant": "显示样式：带来源标题的标签，或紧凑的数字徽章。"
  }
};
