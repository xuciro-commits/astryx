// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'ClickableCard',
  displayName: 'Clickable Card',
  group: 'Card',
  category: 'Container',
  keywords: ['card', 'clickable', 'interactive', 'navigation', 'action', 'link'],
  usage: {
    description: 'An interactive card for navigation or action targets. Nested interactive elements work independently.',
    bestPractices: [
      {guidance: true, description: 'Use for cards that navigate to a detail page or trigger a single action.'},
      {guidance: true, description: 'Nest buttons or links freely inside; they handle their own events.'},
      {guidance: false, description: 'Use for toggling selection; use SelectableCard for that.'},
      {guidance: false, description: 'Use with a transparent variant and no padding only to borrow the press model for a surface that owns its own box. Compose the chrome-free recipe in the useClickableContainer docs instead: it adds no Card styles to the page.'},
    ],
    anatomy: [
      {name: 'Container', required: true, description: 'Interactive div with hover/focus/active states.'},
      {name: 'Content', required: true, description: 'Children, which may include nested interactive elements.'},
    ],
  },
  props: [
    {name: 'label', type: 'string', description: 'Accessibility label.', required: true},
    {name: 'onClick', type: '(event: MouseEvent) => void', description: 'Click handler: fires on card surface only.'},
    {name: 'href', type: 'string', description: 'Navigation URL. Plain, new-tab, Cmd/Ctrl-click, and middle-click activation all follow the shared navigation rule described on the Link `href` prop.'},
    {name: 'target', type: 'string', description: 'Link target.', default: "'_self'"},
    {name: 'isDisabled', type: 'boolean', description: 'Disables the card and removes a link destination; the card keeps its tab stop and is announced as disabled.', default: 'false'},
    {name: 'children', type: 'ReactNode', description: 'Card content.'},
    {name: 'padding', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Inner padding.', default: '4'},
    {name: 'variant', type: "'default' | 'transparent' | 'muted' | 'blue' | 'cyan' | 'gray' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow'", description: 'Background color variant.', default: "'default'"},
    {name: 'elevation', type: "'none' | 'low' | 'med' | 'high'", description: 'Resting shadow depth. Often raised to signal the whole card is clickable.', default: "'none'"},
    {name: 'width', type: 'SizeValue', description: 'Card width.'},
    {name: 'height', type: 'SizeValue', description: 'Card height.'},
    {name: 'maxWidth', type: 'SizeValue', description: 'Maximum card width.'},
    {name: 'xstyle', type: 'StyleXStyles', description: 'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.'},
  ],
  theming: {
    container: true,
    targets: [{className: 'astryx-clickable-card', visualProps: ['variant']}],
    vars: [
      {name: '--_press-overlay', description: 'Colour of the ::after interaction overlay for the hover and mouse states: transparent at rest, the hover overlay token on hover (hover-capable pointers), the pressed overlay token while a mouse holds `:active`. A press the touch press controller paints (`data-astryx-press`) is the overlay\'s image instead, at the press\'s strength, and the colour yields to it. Set on the card element by its own interaction arms.', default: 'transparent', private: true},
    ],
  },
  playground: {
    defaults: {
      label: 'View product details',
      href: '#',
      padding: 4,
      children: {
        __element: 'XDSVStack',
        props: {gap: 1},
        children: [
          {__element: 'XDSHeading', props: {level: 3}, children: 'Wireless Headphones'},
          {__element: 'XDSText', props: {type: 'body'}, children: 'Noise-cancelling over-ear headphones with 30-hour battery life.'},
        ],
      },
    },
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Interactive card for navigation/action targets. Nested interactive elements work independently.',
  usage: {
    description: 'Interactive card for navigation/action targets. Nested interactive elements work independently.',
    bestPractices: [
      {guidance: true, description: 'Use for cards navigating to detail page or triggering single action.'},
      {guidance: true, description: 'Nest buttons/links freely inside; they handle own events.'},
      {guidance: false, description: 'Use for toggling selection; use SelectableCard instead.'},
      {guidance: false, description: 'Use w/ transparent variant + no padding only to borrow press model for surface owning its own box; compose chrome-free recipe in useClickableContainer docs instead (no Card styles).'},
    ],
  },
  propDescriptions: {
    label: 'accessibility label',
    onClick: 'click handler: fires on card surface only',
    href: 'navigation URL; every activation follows the shared navigation rule (see Link href)',
    target: 'link target',
    isDisabled: 'disables card, removes link destination, keeps tab stop',
    padding: 'inner padding',
    variant: 'background color variant',
    elevation: 'resting shadow depth: none|low|med|high; often raised to signal clickability',
    width: 'card width',
    height: 'card height',
    maxWidth: 'max card width',
  },
};

export const docsZh = {
  "name": "ClickableCard",
  "displayName": "Clickable Card",
  "usage": {
    "description": "用于导航或操作目标的交互式卡片。嵌套的交互元素可独立工作。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于导航到详情页或触发单个操作的卡片。"
      },
      {
        "guidance": true,
        "description": "可以自由地在其中嵌套按钮或链接；它们会处理自己的事件。"
      },
      {
        "guidance": false,
        "description": "不要用于切换选择状态；这种情况请使用 SelectableCard。"
      },
      {
        "guidance": false,
        "description": "仅当需要借用按压模型让自带盒子的表面可交互时，才配合透明变体和无内边距使用。请改用 useClickableContainer 文档中无边框组合的配方：它不会向页面添加任何 Card 样式。"
      }
    ],
    "anatomy": [
      {
        "name": "容器",
        "required": true,
        "description": "具有 hover/focus/active 状态的交互式 div。"
      },
      {
        "name": "内容",
        "required": true,
        "description": "children，其中可以包含嵌套的交互元素。"
      }
    ]
  },
  "propDescriptions": {
    "label": "无障碍标签。",
    "onClick": "点击处理函数：仅在卡片表面触发。",
    "href": "导航 URL。普通点击、新标签页、Cmd/Ctrl 点击和中键激活均遵循 Link `href` 属性上描述的共享导航规则。",
    "target": "链接目标。",
    "isDisabled": "禁用卡片并移除链接目标；卡片保留其 Tab 停靠点，并会被宣布为已禁用。",
    "children": "卡片内容。",
    "padding": "内部内边距。",
    "variant": "背景颜色变体。",
    "elevation": "静止时的阴影深度。通常提升以暗示整张卡片可点击。",
    "width": "卡片宽度。",
    "height": "卡片高度。",
    "maxWidth": "卡片最大宽度。",
    "xstyle": "用于布局自定义（边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值，而不是 style={{}} 这样的内联样式对象。"
  }
};
