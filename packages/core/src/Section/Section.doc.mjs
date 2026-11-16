// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Section container',
    required: true,
    description: 'Painted container that groups a page region.',
  },
  {
    name: 'Consumer content',
    required: false,
    description: 'Caller-provided content rendered inside the section container.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Section',
  displayName: 'Section',
  group: 'Layout',
  category: 'Layout',
  keywords: ["section","panel","container","group","fieldset","region","block"],
  props: [
    {
      name: 'variant',
      type: "'section' | 'transparent' | 'muted'",
      description: 'Background variant applied to the section container.',
      default: "'section'",
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the section; a number is interpreted as pixels, a string is used as-is.',
    },
    {
      name: 'height',
      type: 'SizeValue',
      description:
        'Height of the section; a number is interpreted as pixels, a string is used as-is.',
    },
    {
      name: 'maxWidth',
      type: 'SizeValue',
      description: 'Maximum width of the section.',
    },
    {
      name: 'minHeight',
      type: 'SizeValue',
      description: 'Minimum height of the section.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content rendered inside the section.',
    },
    {
      name: 'dividers',
      type: "Array<'top' | 'bottom' | 'start' | 'end'>",
      description: 'Which sides of the section have divider borders.',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Internal padding using the spacing scale (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10). Use padding={0} for edge-to-edge content.',
      default: '4',
    },
    {
      name: 'paddingInline',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Inline (horizontal) padding override. Overrides only the inline-axis padding while preserving block padding from `padding` or the container theme default. Accepts the spacing scale (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10).',
    },
    {
      name: 'paddingInlineStart',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Inline-start padding override (left in LTR, right in RTL). Overrides paddingInline and padding on that edge only.',
    },
    {
      name: 'paddingInlineEnd',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Inline-end padding override (right in LTR, left in RTL). Overrides paddingInline and padding on that edge only.',
    },
    {
      name: 'paddingBlock',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Block (vertical) padding override. Overrides only the block-axis padding while preserving inline padding from `padding` or the container theme default. Accepts the spacing scale (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10).',
    },
    {
      name: 'paddingBlockStart',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Block-start (top) padding, using the spacing scale. Overrides paddingBlock and padding on that edge only.',
    },
    {
      name: 'paddingBlockEnd',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Block-end (bottom) padding, using the spacing scale. Overrides paddingBlock and padding on that edge only.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object.',
    },
  ],
  theming: {
    container: true,
    targets: [
      {className: 'astryx-section', visualProps: ['variant']},
    ],
    derived: [
      {property: 'padding', expand: 'container'},
    ],
  },
  usage: {
    anatomy,
    description:
      'Section is the correct way to create page regions and group related content on a page. Use it for settings groups, form sections, sidebar areas, or any time you need visual separation between parts of a page. If you are tempted to use a Card for a page section, use Section instead.',
    bestPractices: [
      { guidance: true, description: 'Use Section for page-level grouping: settings panels, form groups, sidebar regions. These are sections of a page, not discrete items.' },
      { guidance: true, description: 'Start with the default variant. Use muted only to call attention to a specific region.' },
      { guidance: true, description: 'Add dividers between same-background sections that need separation.' },
      { guidance: true, description: 'Combine with a heading + Stack for a typical page section pattern.' },
      { guidance: false, description: 'Use Card when you mean Section. Cards are for discrete items (one notification, one profile). Sections are for page regions.' },
      { guidance: true, description: "To center a Section, set marginInlineStart and marginInlineEnd to 'auto' in xstyle. If Astryx source is compiled in your app's own StyleX pass, the marginInline shorthand loses to Section's own inline margins." },
    ],
  },
  examples: [
    {
      label: 'Center a Section with a maximum width',
      code: `import * as stylex from '@stylexjs/stylex';
import {Section} from '@astryxdesign/core/Section';

const styles = stylex.create({
  centered: {marginInlineStart: 'auto', marginInlineEnd: 'auto'},
});

function Page({children}: {children: React.ReactNode}) {
  return (
    <Section maxWidth={1280} xstyle={styles.centered}>
      {children}
    </Section>
  );
}`,
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Section",
  "displayName": "Section",
  "props": [
    {
      "name": "variant",
      "type": "'section' | 'transparent' | 'muted'",
      "description": "应用于分区容器的背景变体。",
      "default": "'section'"
    },
    {
      "name": "width",
      "type": "SizeValue",
      "description": "分区宽度；数字按像素解释，字符串按原样使用。"
    },
    {
      "name": "height",
      "type": "SizeValue",
      "description": "分区高度；数字按像素解释，字符串按原样使用。"
    },
    {
      "name": "maxWidth",
      "type": "SizeValue",
      "description": "分区的最大宽度。"
    },
    {
      "name": "minHeight",
      "type": "SizeValue",
      "description": "分区的最小高度。"
    },
    {
      "name": "children",
      "type": "ReactNode",
      "description": "在分区内渲染的内容。"
    },
    {
      "name": "dividers",
      "type": "Array<'top' | 'bottom' | 'start' | 'end'>",
      "description": "分区哪些边具有分隔边框。"
    },
    {
      "name": "padding",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "使用间距刻度的内部内边距（0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10）。边缘到边缘的内容使用 padding={0}。",
      "default": "4"
    },
    {
      "name": "paddingInline",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "行内（水平）内边距覆盖。仅覆盖行内轴内边距，同时保留来自 `padding` 或容器主题默认的块级内边距。接受间距刻度（0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10）。"
    },
    {
      "name": "paddingInlineStart",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "行内起始内边距覆盖（LTR 中为左，RTL 中为右）。仅覆盖该边的 paddingInline 和 padding。"
    },
    {
      "name": "paddingInlineEnd",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "行内结束内边距覆盖（LTR 中为右，RTL 中为左）。仅覆盖该边的 paddingInline 和 padding。"
    },
    {
      "name": "paddingBlock",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "块级（垂直）内边距覆盖。仅覆盖块级轴内边距，同时保留来自 `padding` 或容器主题默认的行内内边距。接受间距刻度（0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10）。"
    },
    {
      "name": "paddingBlockStart",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "块级起始（顶部）内边距，使用间距刻度。仅覆盖该边的 paddingBlock 和 padding。"
    },
    {
      "name": "paddingBlockEnd",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "块级结束（底部）内边距，使用间距刻度。仅覆盖该边的 paddingBlock 和 padding。"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值，而不是内联样式对象。"
    }
  ],
  "theming": {
    "container": true,
    "targets": [
      {
        "className": "astryx-section",
        "visualProps": [
          "variant"
        ]
      }
    ],
    "derived": [
      {
        "property": "padding",
        "expand": "container"
      }
    ]
  },
  "usage": {
    "anatomy": [
      {
        "name": "分区容器",
        "required": true,
        "description": "分组页面区域的绘制容器。"
      },
      {
        "name": "调用方内容",
        "required": false,
        "description": "在分区容器内渲染的调用方提供的内容。"
      }
    ],
    "description": "Section 是创建页面区域并分组页面相关内容的标准方式。用于设置组、表单分区、侧边栏区域，或任何需要页面各部分之间视觉分隔的场景。如果你想用 Card 表示页面分区，请改用 Section。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将 Section 用于页面级分组：设置面板、表单组、侧边栏区域。这些是页面的分区，而不是离散项目。"
      },
      {
        "guidance": true,
        "description": "从默认变体开始。仅在需要引起对特定区域的注意时使用 muted。"
      },
      {
        "guidance": true,
        "description": "在需要分隔的同背景分区之间添加分隔线。"
      },
      {
        "guidance": true,
        "description": "搭配标题 + Stack，构成典型的页面分区模式。"
      },
      {
        "guidance": false,
        "description": "在本应使用 Section 时使用 Card。卡片用于离散项目（一条通知、一个资料）。分区用于页面区域。"
      },
      {
        "guidance": true,
        "description": "要使 Section 居中，请在 xstyle 中将 marginInlineStart 和 marginInlineEnd 设为 'auto'。如果 Astryx 源码在你的应用自己的 StyleX 编译过程中编译，marginInline 简写会输给 Section 自己的行内边距。"
      }
    ]
  },
  "propDescriptions": {
    "variant": "应用于分区容器的背景变体。",
    "width": "分区宽度；数字按像素解释，字符串按原样使用。",
    "height": "分区高度；数字按像素解释，字符串按原样使用。",
    "maxWidth": "分区的最大宽度。",
    "minHeight": "分区的最小高度。",
    "children": "在分区内渲染的内容。",
    "dividers": "分区哪些边具有分隔边框。",
    "padding": "使用间距刻度的内部内边距（0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10）。边缘到边缘的内容使用 padding={0}。",
    "paddingInline": "行内（水平）内边距覆盖。仅覆盖行内轴内边距，同时保留来自 `padding` 或容器主题默认的块级内边距。接受间距刻度（0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10）。",
    "paddingInlineStart": "行内起始内边距覆盖（LTR 中为左，RTL 中为右）。仅覆盖该边的 paddingInline 和 padding。",
    "paddingInlineEnd": "行内结束内边距覆盖（LTR 中为右，RTL 中为左）。仅覆盖该边的 paddingInline 和 padding。",
    "paddingBlock": "块级（垂直）内边距覆盖。仅覆盖块级轴内边距，同时保留来自 `padding` 或容器主题默认的行内内边距。接受间距刻度（0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10）。",
    "paddingBlockStart": "块级起始（顶部）内边距，使用间距刻度。仅覆盖该边的 paddingBlock 和 padding。",
    "paddingBlockEnd": "块级结束（底部）内边距，使用间距刻度。仅覆盖该边的 paddingBlock 和 padding。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值，而不是内联样式对象。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Page-level container for grouping content into regions. Use INSTEAD of Card for settings panels, form groups, and page sections.',
  usage: {
    anatomy,
    description:
      'Section creates page regions. Use for settings groups, form sections, sidebar areas. If you want to visually separate a part of a page, use Section, not Card. Cards are for discrete items (one profile, one notification).',
    bestPractices: [
      { guidance: true, description: 'Use Section for page-level grouping: settings panels, form groups, sidebar regions. Page sections, not discrete items.' },
      { guidance: true, description: 'Start w/ default variant. Use muted only to call attention to a specific region.' },
      { guidance: true, description: 'Add dividers between same-background sections that need separation.' },
      { guidance: true, description: 'Combine w/ heading + Stack for typical page section pattern.' },
      { guidance: false, description: 'Use Card when you mean Section. Cards = discrete items (one notification, one profile). Sections = page regions.' },
      { guidance: true, description: "Center: xstyle marginInlineStart + marginInlineEnd 'auto'. If Astryx source goes through your app's StyleX pass, marginInline shorthand loses to Section's inline margins." },
    ],
  },
  propDescriptions: {
    variant: 'Background variant applied to section container.',
    width: 'Section width; number interpreted as pixels, string used as-is.',
    height: 'Section height; number interpreted as pixels, string used as-is.',
    maxWidth: 'Maximum width of section.',
    minHeight: 'Minimum height of section.',
    children: 'Content rendered inside section.',
    dividers: 'Which sides of section have divider borders.',
    padding: 'Internal padding via spacing scale; 0 for edge-to-edge content.',
    paddingInline: 'Inline-axis padding override; preserves block padding from padding/theme.',
    paddingInlineStart: 'Inline-start (left in LTR) padding override; wins over paddingInline/padding on that edge.',
    paddingInlineEnd: 'Inline-end (right in LTR) padding override; wins over paddingInline/padding on that edge.',
    paddingBlock: 'Block-axis padding override; preserves inline padding from padding/theme.',
    paddingBlockStart: 'Block-start (top) padding override; wins over paddingBlock/padding on that edge.',
    paddingBlockEnd: 'Block-end (bottom) padding override; wins over paddingBlock/padding on that edge.',
    xstyle: 'StyleX styles for layout customization; must be stylex.create() value.',
  },
};
