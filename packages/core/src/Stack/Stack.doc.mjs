// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Stack container',
    required: true,
    description: 'Layout container that arranges content along one flex axis.',
  },
  {
    name: 'Item',
    required: false,
    description: 'Optional StackItem wrapper that controls one item in the stack.',
  },
  {
    name: 'Content',
    required: false,
    description: 'Caller-supplied content rendered by a Stack or StackItem.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Stack',
  displayName: 'Stack',
  group: 'Layout',
  category: 'Layout',
  keywords: ["stack","hstack","vstack","flexbox","flex","spacing","gap","horizontal","vertical","row","column"],
  theming: {
    targets: [
      {className: 'astryx-stack', visualProps: ['direction', 'gap', 'wrap']},
      {className: 'astryx-stack-item', visualProps: ['size']},
    ],
  },
  components: [
    {
      name: 'Stack',
      displayName: 'Stack',
      description:
        'Unified stack layout component with a direction prop. Use direction="horizontal" to flow along the inline axis (left to right in LTR, right to left in RTL) or direction="vertical" (default) for top-to-bottom. For convenience, HStack and VStack are pre-configured wrappers.',
      playground: {
        defaults: {
          direction: 'horizontal',
          gap: 2,
          children: [
            {__element: 'Card', props: {padding: 3}, children: 'Item 1'},
            {__element: 'Card', props: {padding: 3}, children: 'Item 2'},
            {__element: 'Card', props: {padding: 3}, children: 'Item 3'},
          ],
        },
      },
      props: [
        {
          name: 'direction',
          type: "'horizontal' | 'vertical'",
          description:
            "Direction of the stack layout. 'horizontal' flows items along the inline axis, left to right in LTR and right to left in RTL (like HStack), 'vertical' flows top-to-bottom (like VStack). Note: the value is 'horizontal', NOT 'row'.",
          default: "'vertical'",
        },
        {
          name: 'gap',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Spacing step (number literal): 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10. Pass as a JSX number expression e.g. gap={4}, NOT a string like gap="4".',
        },
        {
          name: 'padding',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Inner padding on all sides, using the spacing scale. Pass as a JSX number expression e.g. padding={3}.',
        },
        {
          name: 'paddingInline',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Inline (horizontal) padding. Overrides padding on the inline axis when both are set.',
        },
        {
          name: 'paddingInlineStart',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Inline-start padding, using the spacing scale (left in LTR, right in RTL). Overrides paddingInline and padding on that edge only.',
        },
        {
          name: 'paddingInlineEnd',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Inline-end padding, using the spacing scale (right in LTR, left in RTL). Overrides paddingInline and padding on that edge only.',
        },
        {
          name: 'paddingBlock',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Block (vertical) padding. Overrides padding on the block axis when both are set.',
        },
        {
          name: 'paddingBlockStart',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Block-start (top) padding, using the spacing scale. Overrides paddingBlock and padding on that edge only.',
        },
        {
          name: 'paddingBlockEnd',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Block-end (bottom) padding, using the spacing scale. Overrides paddingBlock and padding on that edge only.',
        },
        {
          name: 'isScrollable',
          type: 'boolean',
          description:
            'Enables scrollable overflow (overflow: auto).',
          default: 'false',
        },
        {
          name: 'width',
          type: 'SizeValue',
          description: "Width of the stack container. Numbers are treated as pixels, strings are used as-is (e.g., '100%').",
        },
        {
          name: 'height',
          type: 'SizeValue',
          description: "Height of the stack container. Numbers are treated as pixels, strings are used as-is (e.g., '100%').",
        },
        {
          name: 'maxWidth',
          type: 'SizeValue',
          description: "Maximum width of the stack container.",
        },
        {
          name: 'minHeight',
          type: 'SizeValue',
          description: "Minimum height of the stack container.",
        },
        {
          name: 'hAlign',
          type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' | 'stretch'",
          description: "Horizontal alignment. When direction='horizontal': main-axis (justify-content). When direction='vertical': cross-axis (align-items).",
        },
        {
          name: 'vAlign',
          type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' | 'stretch'",
          description: "Vertical alignment. When direction='horizontal': cross-axis (align-items). When direction='vertical': main-axis (justify-content).",
        },
        {
          name: 'justify',
          type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
          description: "Main-axis alignment alias. Resolves to hAlign (horizontal) or vAlign (vertical). Note: use 'between', NOT 'space-between'.",
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end' | 'stretch'",
          description: 'Cross-axis alignment alias. Mirrors CSS align-items.',
        },
        {
          name: 'wrap',
          type: "'nowrap' | 'wrap' | 'wrap-reverse'",
          description: 'Flex wrap behavior.',
          default: "'nowrap'",
        },
        {
          name: 'as',
          type: 'ElementType',
          description: 'HTML element to render as the stack container.',
          default: "'div'",
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Stack content.',
        },
        {
          name: 'xstyle',
          type: 'StyleXStyles',
          description:
            'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Class name added to the stack element, after the component styles.',
        },
        {
          name: 'style',
          type: 'CSSProperties',
          description: 'Inline styles for the stack element. width, height, maxWidth, and minHeight win over the same properties here.',
        },
        {
          name: 'ref',
          type: 'Ref<HTMLElement>',
          description: 'Ref to the rendered stack element.',
        },
      ],
    },

    {
      name: 'HStack',
      isHiddenFromOverview: true,
      displayName: 'H Stack',
      description:
        'Horizontal stack that arranges items along the inline axis: left to right in LTR, right to left in RTL. Supports polymorphic rendering.',
      playground: {
        defaults: {
          gap: 2,
          children: [
            {__element: 'Card', props: {padding: 3}, children: 'Item 1'},
            {__element: 'Card', props: {padding: 3}, children: 'Item 2'},
            {__element: 'Card', props: {padding: 3}, children: 'Item 3'},
          ],
        },
      },
      props: [
        {
          name: 'gap',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Spacing step (number literal): 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10. Pass as a JSX number expression e.g. gap={4}, NOT a string like gap="4".',
        },
        {
          name: 'padding',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Inner padding on all sides, using the spacing scale (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10). Matches the padding prop on Card, LayoutContent, and LayoutPanel. Pass as a JSX number expression e.g. padding={3}.',
        },
        {
          name: 'paddingInline',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Inline (horizontal) padding, using the spacing scale. Overrides padding on the inline axis when both are set.',
        },
        {
          name: 'paddingInlineStart',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Inline-start padding, using the spacing scale (left in LTR, right in RTL). Overrides paddingInline and padding on that edge only.',
        },
        {
          name: 'paddingInlineEnd',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Inline-end padding, using the spacing scale (right in LTR, left in RTL). Overrides paddingInline and padding on that edge only.',
        },
        {
          name: 'paddingBlock',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Block (vertical) padding, using the spacing scale. Overrides padding on the block axis when both are set.',
        },
        {
          name: 'paddingBlockStart',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Block-start (top) padding, using the spacing scale. Overrides paddingBlock and padding on that edge only.',
        },
        {
          name: 'paddingBlockEnd',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Block-end (bottom) padding, using the spacing scale. Overrides paddingBlock and padding on that edge only.',
        },
        {
          name: 'isScrollable',
          type: 'boolean',
          description:
            'Enables scrollable overflow (overflow: auto). Matches isScrollable on LayoutContent and LayoutPanel.',
          default: 'false',
        },
        {
          name: 'width',
          type: 'SizeValue',
          description: "Width of the stack container. Numbers are treated as pixels, strings are used as-is (e.g., '100%').",
        },
        {
          name: 'height',
          type: 'SizeValue',
          description: "Height of the stack container. Numbers are treated as pixels, strings are used as-is (e.g., '100%').",
        },
        {
          name: 'maxWidth',
          type: 'SizeValue',
          description: "Maximum width of the stack container. Numbers are treated as pixels, strings are used as-is (e.g., '100%').",
        },
        {
          name: 'minHeight',
          type: 'SizeValue',
          description: "Minimum height of the stack container. Numbers are treated as pixels, strings are used as-is (e.g., '100%').",
        },
        {
          name: 'hAlign',
          type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
          description: 'Horizontal (main-axis) alignment of items.',
        },
        {
          name: 'vAlign',
          type: "'start' | 'center' | 'end' | 'stretch'",
          description: 'Vertical (cross-axis) alignment of items.',
          default: "'stretch'",
        },
        {
          name: 'justify',
          type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
          description: 'Main-axis alignment alias for hAlign. Mirrors CSS justify-content. When hAlign is also set, hAlign wins.',
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end' | 'stretch'",
          description: 'Cross-axis alignment alias for vAlign. Mirrors CSS align-items. When vAlign is also set, vAlign wins.',
        },
        {
          name: 'wrap',
          type: "'nowrap' | 'wrap' | 'wrap-reverse'",
          description: 'Flex wrap behavior.',
          default: "'nowrap'",
        },
        {
          name: 'as',
          type: 'ElementType',
          description: 'HTML element to render as the stack container.',
          default: "'div'",
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Stack content.',
        },
        {
          name: 'xstyle',
          type: 'StyleXStyles',
          description:
            'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Class name added to the stack element, after the component styles.',
        },
        {
          name: 'style',
          type: 'CSSProperties',
          description: 'Inline styles for the stack element. width, height, maxWidth, and minHeight win over the same properties here.',
        },
        {
          name: 'ref',
          type: 'Ref<HTMLElement>',
          description: 'Ref to the rendered stack element.',
        },
      ],    },
    {
      name: 'VStack',
      isHiddenFromOverview: true,
      displayName: 'V Stack',
      description:
        'Vertical stack for arranging items top-to-bottom. Supports polymorphic rendering.',
      playground: {
        defaults: {
          gap: 2,
          children: [
            {__element: 'Card', props: {padding: 3}, children: 'Item 1'},
            {__element: 'Card', props: {padding: 3}, children: 'Item 2'},
            {__element: 'Card', props: {padding: 3}, children: 'Item 3'},
          ],
        },
      },
      props: [
        {
          name: 'gap',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Spacing step (number literal): 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10. Pass as a JSX number expression e.g. gap={4}, NOT a string like gap="4".',
        },
        {
          name: 'padding',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Inner padding on all sides, using the spacing scale (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10). Matches the padding prop on Card, LayoutContent, and LayoutPanel. Pass as a JSX number expression e.g. padding={3}.',
        },
        {
          name: 'paddingInline',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Inline (horizontal) padding, using the spacing scale. Overrides padding on the inline axis when both are set.',
        },
        {
          name: 'paddingInlineStart',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Inline-start padding, using the spacing scale (left in LTR, right in RTL). Overrides paddingInline and padding on that edge only.',
        },
        {
          name: 'paddingInlineEnd',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Inline-end padding, using the spacing scale (right in LTR, left in RTL). Overrides paddingInline and padding on that edge only.',
        },
        {
          name: 'paddingBlock',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Block (vertical) padding, using the spacing scale. Overrides padding on the block axis when both are set.',
        },
        {
          name: 'paddingBlockStart',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Block-start (top) padding, using the spacing scale. Overrides paddingBlock and padding on that edge only.',
        },
        {
          name: 'paddingBlockEnd',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description:
            'Block-end (bottom) padding, using the spacing scale. Overrides paddingBlock and padding on that edge only.',
        },
        {
          name: 'isScrollable',
          type: 'boolean',
          description:
            'Enables scrollable overflow (overflow: auto). Matches isScrollable on LayoutContent and LayoutPanel.',
          default: 'false',
        },
        {
          name: 'width',
          type: 'SizeValue',
          description: "Width of the stack container. Numbers are treated as pixels, strings are used as-is (e.g., '100%').",
        },
        {
          name: 'height',
          type: 'SizeValue',
          description: "Height of the stack container. Numbers are treated as pixels, strings are used as-is (e.g., '100%').",
        },
        {
          name: 'maxWidth',
          type: 'SizeValue',
          description: "Maximum width of the stack container. Numbers are treated as pixels, strings are used as-is (e.g., '100%').",
        },
        {
          name: 'minHeight',
          type: 'SizeValue',
          description: "Minimum height of the stack container. Numbers are treated as pixels, strings are used as-is (e.g., '100%').",
        },
        {
          name: 'hAlign',
          type: "'start' | 'center' | 'end' | 'stretch'",
          description: 'Horizontal (cross-axis) alignment of items.',
          default: "'stretch'",
        },
        {
          name: 'vAlign',
          type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
          description: 'Vertical (main-axis) alignment of items.',
        },
        {
          name: 'justify',
          type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
          description: 'Main-axis alignment alias for vAlign. Mirrors CSS justify-content.',
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end' | 'stretch'",
          description: 'Cross-axis alignment alias for hAlign. Mirrors CSS align-items.',
        },
        {
          name: 'wrap',
          type: "'nowrap' | 'wrap' | 'wrap-reverse'",
          description: 'Flex wrap behavior.',
          default: "'nowrap'",
        },
        {
          name: 'as',
          type: 'ElementType',
          description: 'HTML element to render as the stack container.',
          default: "'div'",
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Stack content.',
        },
        {
          name: 'xstyle',
          type: 'StyleXStyles',
          description:
            'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Class name added to the stack element, after the component styles.',
        },
        {
          name: 'style',
          type: 'CSSProperties',
          description: 'Inline styles for the stack element. width, height, maxWidth, and minHeight win over the same properties here.',
        },
        {
          name: 'ref',
          type: 'Ref<HTMLElement>',
          description: 'Ref to the rendered stack element.',
        },
      ],
    },
    {
      name: 'StackItem',
      isHiddenFromOverview: true,
      displayName: 'Stack Item',
      description:
        'Stack item for controlling individual item behavior within a stack. Supports polymorphic rendering.',
      playground: {
        wrapper: {component: 'HStack', props: {gap: 2, width: 300}},
        defaults: {
          size: 'fill',
          children: {__element: 'Card', props: {padding: 3}, children: 'Fills the row'},
        },
      },
      props: [
        {
          name: 'size',
          type: "'static' | 'fill'",
          description:
            'Flex grow behavior: static keeps natural size, fill expands to consume remaining space.',
          default: "'static'",
        },
        {
          name: 'isScrollable',
          type: 'boolean',
          description:
            'Enables scrollable overflow (overflow: auto). StackItem already applies the flex min-height/min-width reset, so <StackItem size="fill" isScrollable> is a complete scroll region. Matches isScrollable on LayoutContent and LayoutPanel. While its content overflows, a div or span item is a group named by aria-label, or by a translated "Content"; another element keeps its own role.',
          default: 'false',
        },
        {
          name: 'crossAlignSelf',
          type: "'start' | 'center' | 'end' | 'stretch'",
          description:
            'Override the cross-axis alignment for this individual item, ignoring the parent stack alignment.',
        },
        {
          name: 'as',
          type: 'ElementType',
          description: 'HTML element to render as the item wrapper.',
          default: "'div'",
        },
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Item content.',
        },
        {
          name: 'xstyle',
          type: 'StyleXStyles',
          description:
            'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Class name added to the item element, after the component styles.',
        },
        {
          name: 'style',
          type: 'CSSProperties',
          description: 'Inline styles for the item element.',
        },
        {
          name: 'ref',
          type: 'Ref<HTMLElement>',
          description: 'Ref to the rendered item element.',
        },
      ],
    },
  ],
  usage: {
    anatomy,
    description:
      'Stack arranges items in a row or column with consistent spacing. Use the gap prop to control the space between items.',
    bestPractices: [
      { guidance: true, description: 'Use the gap prop for spacing between items; don\'t add margins manually.' },
      { guidance: true, description: 'Use StackItem with size="fill" to make one item stretch and fill the leftover space.' },
      { guidance: false, description: 'Nest stacks inside stacks; try wrap="wrap" first to let items flow to the next line.' },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Stack",
  "displayName": "Stack",
  "group": "Layout",
  "theming": {
    "targets": [
      {
        "className": "astryx-stack",
        "visualProps": [
          "direction",
          "gap",
          "wrap"
        ]
      },
      {
        "className": "astryx-stack-item",
        "visualProps": [
          "size"
        ]
      }
    ]
  },
  "components": [
    {
      "name": "Stack",
      "description": "统一的 Stack 布局组件，带有 direction 属性。使用 direction=\"horizontal\" 沿行内轴排列（LTR 中从左到右，RTL 中从右到左），或使用 direction=\"vertical\"（默认）从上到下排列。为方便起见，HStack 和 VStack 是预配置的包装器。",
      "propDescriptions": {
        "direction": "Stack 布局的方向。'horizontal' 沿行内轴排列项目，LTR 中从左到右，RTL 中从右到左（类似 HStack）；'vertical' 从上到下排列（类似 VStack）。注意：值是 'horizontal'，不是 'row'。",
        "gap": "间距刻度（数字字面量）：0、0.5、1、1.5、2、3、4、5、6、8、10。以 JSX 数字表达式传入，例如 gap={4}，而不是像 gap=\"4\" 这样的字符串。",
        "padding": "使用间距刻度的四边内边距。以 JSX 数字表达式传入，例如 padding={3}。",
        "paddingInline": "行内（水平）内边距。两者都设置时，覆盖行内轴上的 padding。",
        "paddingInlineStart": "行内起始内边距，使用间距刻度（LTR 中为左，RTL 中为右）。仅在该边缘覆盖 paddingInline 和 padding。",
        "paddingInlineEnd": "行内结束内边距，使用间距刻度（LTR 中为右，RTL 中为左）。仅在该边缘覆盖 paddingInline 和 padding。",
        "paddingBlock": "块级（垂直）内边距。两者都设置时，覆盖块轴上的 padding。",
        "paddingBlockStart": "块级起始（顶部）内边距，使用间距刻度。仅在该边缘覆盖 paddingBlock 和 padding。",
        "paddingBlockEnd": "块级结束（底部）内边距，使用间距刻度。仅在该边缘覆盖 paddingBlock 和 padding。",
        "isScrollable": "启用可滚动溢出（overflow: auto）。",
        "width": "Stack 容器的宽度。数字按像素处理，字符串按原样使用（例如 '100%'）。",
        "height": "Stack 容器的高度。数字按像素处理，字符串按原样使用（例如 '100%'）。",
        "maxWidth": "Stack 容器的最大宽度。",
        "minHeight": "Stack 容器的最小高度。",
        "hAlign": "水平对齐。当 direction='horizontal' 时：主轴（justify-content）。当 direction='vertical' 时：交叉轴（align-items）。",
        "vAlign": "垂直对齐。当 direction='horizontal' 时：交叉轴（align-items）。当 direction='vertical' 时：主轴（justify-content）。",
        "justify": "主轴对齐别名。解析为 hAlign（水平）或 vAlign（垂直）。注意：使用 'between'，不是 'space-between'。",
        "align": "交叉轴对齐别名。对应 CSS align-items。",
        "wrap": "Flex 换行行为。",
        "as": "作为 Stack 容器渲染的 HTML 元素。",
        "children": "Stack 内容。",
        "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值，而不是像 style={{}} 这样的内联样式对象。",
        "className": "添加到 Stack 元素的类名，位于组件样式之后。",
        "style": "Stack 元素的内联样式。width、height、maxWidth 和 minHeight 优先于这里的同名属性。",
        "ref": "指向渲染后的 Stack 元素的 ref。"
      }
    },
    {
      "name": "HStack",
      "description": "沿行内轴排列项目的水平 Stack：LTR 中从左到右，RTL 中从右到左。支持多态渲染。",
      "propDescriptions": {
        "gap": "间距刻度（数字字面量）：0、0.5、1、1.5、2、3、4、5、6、8、10。以 JSX 数字表达式传入，例如 gap={4}，而不是像 gap=\"4\" 这样的字符串。",
        "padding": "使用间距刻度（0、0.5、1、1.5、2、3、4、5、6、8、10）的四边内边距。与 Card、LayoutContent 和 LayoutPanel 上的 padding 属性一致。以 JSX 数字表达式传入，例如 padding={3}。",
        "paddingInline": "行内（水平）内边距，使用间距刻度。两者都设置时，覆盖行内轴上的 padding。",
        "paddingInlineStart": "行内起始内边距，使用间距刻度（LTR 中为左，RTL 中为右）。仅在该边缘覆盖 paddingInline 和 padding。",
        "paddingInlineEnd": "行内结束内边距，使用间距刻度（LTR 中为右，RTL 中为左）。仅在该边缘覆盖 paddingInline 和 padding。",
        "paddingBlock": "块级（垂直）内边距，使用间距刻度。两者都设置时，覆盖块轴上的 padding。",
        "paddingBlockStart": "块级起始（顶部）内边距，使用间距刻度。仅在该边缘覆盖 paddingBlock 和 padding。",
        "paddingBlockEnd": "块级结束（底部）内边距，使用间距刻度。仅在该边缘覆盖 paddingBlock 和 padding。",
        "isScrollable": "启用可滚动溢出（overflow: auto）。与 LayoutContent 和 LayoutPanel 上的 isScrollable 一致。",
        "width": "Stack 容器的宽度。数字按像素处理，字符串按原样使用（例如 '100%'）。",
        "height": "Stack 容器的高度。数字按像素处理，字符串按原样使用（例如 '100%'）。",
        "maxWidth": "Stack 容器的最大宽度。数字按像素处理，字符串按原样使用（例如 '100%'）。",
        "minHeight": "Stack 容器的最小高度。数字按像素处理，字符串按原样使用（例如 '100%'）。",
        "hAlign": "项目的水平（主轴）对齐。",
        "vAlign": "项目的垂直（交叉轴）对齐。",
        "justify": "hAlign 的主轴对齐别名。对应 CSS justify-content。当同时设置 hAlign 时，hAlign 优先。",
        "align": "vAlign 的交叉轴对齐别名。对应 CSS align-items。当同时设置 vAlign 时，vAlign 优先。",
        "wrap": "Flex 换行行为。",
        "as": "作为 Stack 容器渲染的 HTML 元素。",
        "children": "Stack 内容。",
        "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值，而不是像 style={{}} 这样的内联样式对象。",
        "className": "添加到 Stack 元素的类名，位于组件样式之后。",
        "style": "Stack 元素的内联样式。width、height、maxWidth 和 minHeight 优先于这里的同名属性。",
        "ref": "指向渲染后的 Stack 元素的 ref。"
      }
    },
    {
      "name": "VStack",
      "description": "从上到下排列项目的垂直 Stack。支持多态渲染。",
      "propDescriptions": {
        "gap": "间距刻度（数字字面量）：0、0.5、1、1.5、2、3、4、5、6、8、10。以 JSX 数字表达式传入，例如 gap={4}，而不是像 gap=\"4\" 这样的字符串。",
        "padding": "使用间距刻度（0、0.5、1、1.5、2、3、4、5、6、8、10）的四边内边距。与 Card、LayoutContent 和 LayoutPanel 上的 padding 属性一致。以 JSX 数字表达式传入，例如 padding={3}。",
        "paddingInline": "行内（水平）内边距，使用间距刻度。两者都设置时，覆盖行内轴上的 padding。",
        "paddingInlineStart": "行内起始内边距，使用间距刻度（LTR 中为左，RTL 中为右）。仅在该边缘覆盖 paddingInline 和 padding。",
        "paddingInlineEnd": "行内结束内边距，使用间距刻度（LTR 中为右，RTL 中为左）。仅在该边缘覆盖 paddingInline 和 padding。",
        "paddingBlock": "块级（垂直）内边距，使用间距刻度。两者都设置时，覆盖块轴上的 padding。",
        "paddingBlockStart": "块级起始（顶部）内边距，使用间距刻度。仅在该边缘覆盖 paddingBlock 和 padding。",
        "paddingBlockEnd": "块级结束（底部）内边距，使用间距刻度。仅在该边缘覆盖 paddingBlock 和 padding。",
        "isScrollable": "启用可滚动溢出（overflow: auto）。与 LayoutContent 和 LayoutPanel 上的 isScrollable 一致。",
        "width": "Stack 容器的宽度。数字按像素处理，字符串按原样使用（例如 '100%'）。",
        "height": "Stack 容器的高度。数字按像素处理，字符串按原样使用（例如 '100%'）。",
        "maxWidth": "Stack 容器的最大宽度。数字按像素处理，字符串按原样使用（例如 '100%'）。",
        "minHeight": "Stack 容器的最小高度。数字按像素处理，字符串按原样使用（例如 '100%'）。",
        "hAlign": "项目的水平（交叉轴）对齐。",
        "vAlign": "项目的垂直（主轴）对齐。",
        "justify": "vAlign 的主轴对齐别名。对应 CSS justify-content。",
        "align": "hAlign 的交叉轴对齐别名。对应 CSS align-items。",
        "wrap": "Flex 换行行为。",
        "as": "作为 Stack 容器渲染的 HTML 元素。",
        "children": "Stack 内容。",
        "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值，而不是像 style={{}} 这样的内联样式对象。",
        "className": "添加到 Stack 元素的类名，位于组件样式之后。",
        "style": "Stack 元素的内联样式。width、height、maxWidth 和 minHeight 优先于这里的同名属性。",
        "ref": "指向渲染后的 Stack 元素的 ref。"
      }
    },
    {
      "name": "StackItem",
      "description": "用于控制 Stack 中单个项目行为的 Stack 项目。支持多态渲染。",
      "propDescriptions": {
        "size": "Flex 增长行为：static 保持自然尺寸，fill 扩展以占用剩余空间。",
        "isScrollable": "启用可滚动溢出（overflow: auto）。StackItem 已应用 flex 最小高度/最小宽度重置，因此 <StackItem size=\"fill\" isScrollable> 是完整的滚动区域。与 LayoutContent 和 LayoutPanel 上的 isScrollable 一致。当内容溢出时，div 或 span 项是一个由 aria-label 或本地化的 \"Content\" 命名的组；其他元素保留自己的 role。",
        "crossAlignSelf": "覆盖此单个项目的交叉轴对齐，忽略父 Stack 的对齐。",
        "as": "作为项目包装器渲染的 HTML 元素。",
        "children": "项目内容。",
        "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值，而不是像 style={{}} 这样的内联样式对象。",
        "className": "添加到项目元素的类名，位于组件样式之后。",
        "style": "项目元素的内联样式。",
        "ref": "指向渲染后的项目元素的 ref。"
      }
    }
  ],
  "usage": {
    "anatomy": [
      {
        "name": "Stack 容器",
        "required": true,
        "description": "沿一个 flex 轴排列内容的布局容器。"
      },
      {
        "name": "项目",
        "required": false,
        "description": "可选的 StackItem 包装器，用于控制 Stack 中的单个项目。"
      },
      {
        "name": "内容",
        "required": false,
        "description": "由 Stack 或 StackItem 渲染的调用方内容。"
      }
    ],
    "description": "Stack 以行或列排列项目，并保持一致的间距。使用 gap 属性控制项目之间的空间。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "使用 gap 属性设置项目间距；不要手动添加外边距。"
      },
      {
        "guidance": true,
        "description": "使用 size=\"fill\" 的 StackItem 让某个项目拉伸并填满剩余空间。"
      },
      {
        "guidance": false,
        "description": "不要嵌套 Stack；先尝试 wrap=\"wrap\"，让项目流到下一行。"
      }
    ]
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Stack layout primitives for horizontal/vertical sequences using flexbox w/ themed spacing tokens.',
  usage: {
    anatomy,
    description:
      'Stack arranges items in a row or column with consistent spacing. Use the gap prop to control the space between items.',
    bestPractices: [
      { guidance: true, description: 'Use the gap prop for spacing between items; don\'t add margins manually.' },
      { guidance: true, description: 'Use StackItem with size="fill" to make one item stretch and fill the leftover space.' },
      { guidance: false, description: 'Nest stacks inside stacks; try wrap="wrap" first to let items flow to the next line.' },
    ],
  },
  components: [
    {
      name: 'HStack',
      isHiddenFromOverview: true,
      displayName: 'H Stack',
      description: 'Horizontal stack; inline direction (left to right in LTR, right to left in RTL), polymorphic rendering.',
      propDescriptions: {
        gap: 'Number literal spacing step: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10. Use gap={4} not gap="4".',
        width: "Width of container. Numbers=pixels, strings=as-is (e.g. '100%').",
        height: "Height of container. Numbers=pixels, strings=as-is (e.g. '100%').",
        hAlign: 'Horizontal (main-axis) alignment.',
        vAlign: 'Vertical (cross-axis) alignment.',
        justify: 'Main-axis alignment alias for hAlign. Mirrors CSS justify-content. An explicit hAlign wins.',
        align: 'Cross-axis alignment alias for vAlign. Mirrors CSS align-items. An explicit vAlign wins.',
        wrap: 'Flex wrap behavior.',
        as: 'HTML element to render as container.',
        children: 'Stack content.',
        xstyle: 'StyleX layout styles; must be stylex.create() value.',
      },
    },
    {
      name: 'VStack',
      isHiddenFromOverview: true,
      displayName: 'V Stack',
      description: 'Vertical stack; top-to-bottom, polymorphic rendering.',
      propDescriptions: {
        gap: 'Number literal spacing step: 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10. Use gap={4} not gap="4".',
        width: "Width of container. Numbers=pixels, strings=as-is (e.g. '100%').",
        height: "Height of container. Numbers=pixels, strings=as-is (e.g. '100%').",
        hAlign: 'Horizontal (cross-axis) alignment.',
        vAlign: 'Vertical (main-axis) alignment.',
        justify: 'Main-axis alignment alias for vAlign. Mirrors CSS justify-content.',
        align: 'Cross-axis alignment alias for hAlign. Mirrors CSS align-items.',
        wrap: 'Flex wrap behavior.',
        as: 'HTML element to render as container.',
        children: 'Stack content.',
      },
    },
    {
      name: 'StackItem',
      isHiddenFromOverview: true,
      displayName: 'Stack Item',
      description: 'Controls individual item behavior in stack; polymorphic rendering.',
      propDescriptions: {
        size: 'Flex grow: static=natural size, fill=expand to remaining space.',
        crossAlignSelf: 'Override cross-axis alignment for this item, ignoring parent.',
        as: 'HTML element to render as wrapper.',
        children: 'Item content.',
      },
    },
  ],
};