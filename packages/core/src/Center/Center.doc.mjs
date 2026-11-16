// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Center',
  displayName: 'Center',
  group: 'Layout',
  category: 'Layout',
  isHiddenFromOverview: true,
  keywords: ["center","centered","centering","align","alignment","justify","flexbox","middle"],
  playground: {
    defaults: {
      width: 240,
      height: 120,
      children: {__element: 'Text', props: {type: 'body'}, children: 'Centered content'},
    },
  },
  props: [
    {
      name: 'axis',
      type: "'both' | 'horizontal' | 'vertical'",
      description:
        'Which Center mode to use. In horizontal writing, "horizontal" centers the flex main/inline axis and "vertical" centers the cross/block axis. In vertical writing, current single-axis behavior follows those logical flex axes rather than the physical names; "both" still centers both axes.',
      default: "'both'",
    },
    {
      name: 'width',
      type: 'SizeValue',
      description: 'Container width (px or CSS value).',
    },
    {
      name: 'height',
      type: 'SizeValue',
      description: 'Container height (px or CSS value).',
    },
    {
      name: 'maxWidth',
      type: 'SizeValue',
      description: 'Maximum container width (px or CSS value).',
    },
    {
      name: 'minHeight',
      type: 'SizeValue',
      description: 'Minimum container height (px or CSS value).',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Inner padding on all sides, using the spacing scale (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10). Matches the padding prop on Stack, Card, LayoutContent, and LayoutPanel. Pass as a JSX number expression e.g. padding={3}.',
    },
    {
      name: 'paddingInline',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Logical inline-axis padding, using the spacing scale. Overrides padding on the inline axis when both are set.',
    },
    {
      name: 'paddingInlineStart',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Logical inline-start padding, using the spacing scale. Its resolved physical edge depends on writing mode and direction. Overrides paddingInline and padding on that edge only.',
    },
    {
      name: 'paddingInlineEnd',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Logical inline-end padding, using the spacing scale. Its resolved physical edge depends on writing mode and direction. Overrides paddingInline and padding on that edge only.',
    },
    {
      name: 'paddingBlock',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Logical block-axis padding, using the spacing scale. Overrides padding on the block axis when both are set.',
    },
    {
      name: 'paddingBlockStart',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Logical block-start padding, using the spacing scale. Its resolved physical edge depends on writing mode. Overrides paddingBlock and padding on that edge only.',
    },
    {
      name: 'paddingBlockEnd',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Logical block-end padding, using the spacing scale. Its resolved physical edge depends on writing mode. Overrides paddingBlock and padding on that edge only.',
    },
    {
      name: 'isInline',
      type: 'boolean',
      description: 'Use inline-flex (useful for text/icons).',
      default: 'false',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content to center.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
  ],
  theming: {
    targets: [
      {className: 'astryx-center', visualProps: ['axis']},
    ],
  },
  usage: {
    description:
      'Center aligns content to the middle of its container. Use it for empty states, loading screens, login forms, or any content that should sit in the center of the available space.',
    bestPractices: [
      {guidance: true, description: 'Use a single-axis value only in horizontal writing, or after verifying the active writing mode. In vertical writing, the current implementation follows flex main/cross axes rather than the physical prop names.'},
      {guidance: true, description: 'In horizontal writing, give Center height when using axis="vertical"; centering needs available space on the selected flex axis.'},
      {guidance: true, description: 'Use isInline to center small elements like icons or badges within a line of text without breaking the text flow.'},
      {guidance: true, description: 'Keep semantic structure and accessible names on the content. Center is a layout-only container and does not add a role or label.'},
      {guidance: false, description: 'Wrap large page sections in Center. Use Layout or AppShell for page-level structure.'},
      {guidance: false, description: 'Use Center for horizontal lists of items. Use Stack with hAlign="center" instead.'},
    ],
    anatomy: [
      {name: 'Container', required: true, description: 'A flexbox wrapper that aligns its children to the center along the chosen axis.'},
      {name: 'Content', required: true, description: 'Any children passed to Center. Typically a card, form, spinner, or empty state message.'},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Center",
  "displayName": "Center",
  "usage": {
    "description": "Center 将内容对齐到容器中部。用于空状态、加载屏幕、登录表单，或任何应位于可用空间中央的内容。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "仅在水平书写模式中使用单轴值，或先确认当前书写模式。在垂直书写模式下，当前实现遵循 flex 主轴/交叉轴，而不是物理属性名称。"
      },
      {
        "guidance": true,
        "description": "在水平书写模式下，使用 axis=\"vertical\" 时为 Center 提供高度；居中需要所选 flex 轴上有可用空间。"
      },
      {
        "guidance": true,
        "description": "使用 isInline 将图标或徽标等小元素在一行文本内居中，而不打断文本流。"
      },
      {
        "guidance": true,
        "description": "将语义结构和无障碍名称保留在内容上。Center 只是布局容器，不会添加 role 或标签。"
      },
      {
        "guidance": false,
        "description": "将大型页面区块包裹在 Center 中。页面级结构请使用 Layout 或 AppShell。"
      },
      {
        "guidance": false,
        "description": "将 Center 用于水平项目列表。请改用 hAlign=\"center\" 的 Stack。"
      }
    ],
    "anatomy": [
      {
        "name": "容器",
        "required": true,
        "description": "一个 flexbox 包装器，沿所选轴将子元素对齐到中心。"
      },
      {
        "name": "内容",
        "required": true,
        "description": "传给 Center 的任意子元素。通常是卡片、表单、加载指示器或空状态消息。"
      }
    ]
  },
  "props": [
    {
      "name": "axis",
      "type": "'both' | 'horizontal' | 'vertical'",
      "description": "使用哪种 Center 模式。在水平书写模式下，\"horizontal\" 使 flex 主轴/行内轴居中，\"vertical\" 使交叉轴/块轴居中。在垂直书写模式下，当前的单轴行为遵循这些逻辑 flex 轴，而不是物理名称；\"both\" 仍会使两个轴都居中。",
      "default": "'both'"
    },
    {
      "name": "width",
      "type": "number | string",
      "description": "容器宽度（px 或 CSS 值）。"
    },
    {
      "name": "height",
      "type": "number | string",
      "description": "容器高度（px 或 CSS 值）。"
    },
    {
      "name": "padding",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "四周的内部内边距，使用间距刻度（0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10）。与 Stack、Card、LayoutContent 和 LayoutPanel 的 padding 属性一致。以 JSX 数字表达式传入，例如 padding={3}。"
    },
    {
      "name": "paddingInline",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "逻辑行内轴内边距，使用间距刻度。同时设置时覆盖行内轴上的 padding。"
    },
    {
      "name": "paddingInlineStart",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "逻辑行内起始内边距，使用间距刻度。其解析后的物理边缘取决于书写模式和方向。仅覆盖该边缘上的 paddingInline 和 padding。"
    },
    {
      "name": "paddingInlineEnd",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "逻辑行内末端内边距，使用间距刻度。其解析后的物理边缘取决于书写模式和方向。仅覆盖该边缘上的 paddingInline 和 padding。"
    },
    {
      "name": "paddingBlock",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "逻辑块轴内边距，使用间距刻度。同时设置时覆盖块轴上的 padding。"
    },
    {
      "name": "paddingBlockStart",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "逻辑块起始内边距，使用间距刻度。其解析后的物理边缘取决于书写模式。仅覆盖该边缘上的 paddingBlock 和 padding。"
    },
    {
      "name": "paddingBlockEnd",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "逻辑块末端内边距，使用间距刻度。其解析后的物理边缘取决于书写模式。仅覆盖该边缘上的 paddingBlock 和 padding。"
    },
    {
      "name": "isInline",
      "type": "boolean",
      "description": "使用 inline-flex（适用于文本/图标）。",
      "default": "false"
    },
    {
      "name": "children",
      "type": "ReactNode",
      "description": "要居中的内容。"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值，而不是像 style={{}} 这样的内联样式对象。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-center",
        "visualProps": [
          "axis"
        ]
      }
    ]
  },
  "propDescriptions": {
    "axis": "使用哪种 Center 模式。在水平书写模式下，\"horizontal\" 使 flex 主轴/行内轴居中，\"vertical\" 使交叉轴/块轴居中。在垂直书写模式下，当前的单轴行为遵循这些逻辑 flex 轴，而不是物理名称；\"both\" 仍会使两个轴都居中。",
    "width": "容器宽度（px 或 CSS 值）。",
    "height": "容器高度（px 或 CSS 值）。",
    "maxWidth": "容器最大宽度（px 或 CSS 值）。",
    "minHeight": "容器最小高度（px 或 CSS 值）。",
    "padding": "四周的内部内边距，使用间距刻度（0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10）。与 Stack、Card、LayoutContent 和 LayoutPanel 的 padding 属性一致。以 JSX 数字表达式传入，例如 padding={3}。",
    "paddingInline": "逻辑行内轴内边距，使用间距刻度。同时设置时覆盖行内轴上的 padding。",
    "paddingInlineStart": "逻辑行内起始内边距，使用间距刻度。其解析后的物理边缘取决于书写模式和方向。仅覆盖该边缘上的 paddingInline 和 padding。",
    "paddingInlineEnd": "逻辑行内末端内边距，使用间距刻度。其解析后的物理边缘取决于书写模式和方向。仅覆盖该边缘上的 paddingInline 和 padding。",
    "paddingBlock": "逻辑块轴内边距，使用间距刻度。同时设置时覆盖块轴上的 padding。",
    "paddingBlockStart": "逻辑块起始内边距，使用间距刻度。其解析后的物理边缘取决于书写模式。仅覆盖该边缘上的 paddingBlock 和 padding。",
    "paddingBlockEnd": "逻辑块末端内边距，使用间距刻度。其解析后的物理边缘取决于书写模式。仅覆盖该边缘上的 paddingBlock 和 padding。",
    "isInline": "使用 inline-flex（适用于文本/图标）。",
    "children": "要居中的内容。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值，而不是像 style={{}} 这样的内联样式对象。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'centers content on one or both flex axes; single-axis names match physical axes only in horizontal writing',
  usage: {
    description:
      'Center aligns content to the middle of its container. Use for empty states, loading screens, login forms.',
    bestPractices: [
      {guidance: true, description: 'Use a single-axis value only in horizontal writing, or after verifying the active writing mode. In vertical writing, the current implementation follows flex main/cross axes rather than the physical prop names.'},
      {guidance: true, description: 'In horizontal writing, give Center height when using axis="vertical"; centering needs available space on the selected flex axis.'},
      {guidance: true, description: 'Use isInline to center small elements (icons, badges) within a line of text without breaking text flow.'},
      {guidance: true, description: 'Keep semantic structure and accessible names on the content; Center adds no role or label.'},
      {guidance: false, description: 'Wrap large page sections in Center. Use Layout or AppShell for page-level structure.'},
      {guidance: false, description: 'Use Center for horizontal lists of items. Use Stack with hAlign="center" instead.'},
    ],
  },
  propDescriptions: {
    axis: 'centering mode; outside horizontal writing, single-axis values follow flex main/cross axes',
    width: 'container width (px or CSS)',
    height: 'container height (px or CSS)',
    padding:
      'inner padding on all sides (spacing step: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10)',
    paddingInline: 'logical inline-axis padding; overrides padding on that axis',
    paddingInlineStart: 'logical inline-start padding; physical edge depends on writing mode and direction',
    paddingInlineEnd: 'logical inline-end padding; physical edge depends on writing mode and direction',
    paddingBlock: 'logical block-axis padding; overrides padding on that axis',
    paddingBlockStart: 'logical block-start padding; physical edge depends on writing mode',
    paddingBlockEnd: 'logical block-end padding; physical edge depends on writing mode',
    isInline: 'use inline-flex for text/icons',
    children: 'content to center',
    xstyle: 'StyleX styles for layout (margins, positioning, sizing); must be stylex.create() value',
  },
};
