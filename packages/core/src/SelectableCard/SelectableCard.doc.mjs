// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'SelectableCard',
  displayName: 'Selectable Card',
  group: 'Card',
  category: 'Container',
  keywords: ['card', 'selectable', 'toggle', 'checkbox', 'radio', 'selection'],
  usage: {
    description: 'A card that toggles between selected and unselected states with an accent border. For navigation use ClickableCard.',
    bestPractices: [
      {guidance: true, description: 'Use for multi-select choices: filter chips, feature add-ons, or option grids where several can be on.'},
      {guidance: true, description: 'Use for multi-select groups; track the selected IDs in a Set.'},
      {guidance: true, description: 'When focused, toggle selection with Space or Enter.'},
      {guidance: false, description: 'Use for navigation; use ClickableCard for that.'},
      {guidance: false, description: 'Use for a single-select group: each card is a checkbox, so assistive technology announces a multi-select group with one tab stop per card.'},
    ],
    anatomy: [
      {name: 'Container', required: true, description: 'Interactive div with accent border on selection.'},
      {name: 'Content', required: true, description: 'Children rendered inside the card.'},
    ],
  },
  props: [
    {name: 'label', type: 'string', description: 'Accessibility label.', required: true},
    {name: 'isSelected', type: 'boolean', description: 'Controlled selection state.', required: true},
    {name: 'onChange', type: '(isSelected: boolean) => void', description: 'Called when toggled.', required: true},
    {name: 'isDisabled', type: 'boolean', description: 'Disables the card.', default: 'false'},
    {name: 'children', type: 'ReactNode', description: 'Card content.'},
    {name: 'padding', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Inner padding.', default: '4'},
    {name: 'variant', type: "'default' | 'transparent' | 'muted' | 'blue' | 'cyan' | 'gray' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow'", description: 'Background color variant.', default: "'default'"},
    {name: 'elevation', type: "'none' | 'low' | 'med' | 'high'", description: 'Resting shadow depth. The selection ring composes on top, so a selected card keeps its shadow.', default: "'none'"},
    {name: 'width', type: 'SizeValue', description: 'Card width.'},
    {name: 'height', type: 'SizeValue', description: 'Card height.'},
    {name: 'maxWidth', type: 'SizeValue', description: 'Maximum card width.'},
    {name: 'xstyle', type: 'StyleXStyles', description: 'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.'},
  ],
  theming: {
    container: true,
    targets: [{className: 'astryx-selectable-card', visualProps: ['selected', 'variant']}],
    vars: [
      {name: '--selectable-card-ring-color', description: 'Colour of the selection ring drawn for a variant a theme added. The built-in variants each ring in their own border token and ignore this; a theme that adds a variant sets it in the same rule as that variant\'s `backgroundColor`, because no token the component could pick is guaranteed to contrast with a fill it cannot know.', default: 'var(--color-accent)'},
      {name: '--_press-overlay', description: 'Colour of the ::after interaction overlay for the hover and mouse states: transparent at rest, the hover overlay token on hover (hover-capable pointers), the pressed overlay token while a mouse holds `:active`. A press the touch press controller paints (`data-astryx-press`) is the overlay\'s image instead, at the press\'s strength, and the colour yields to it. Set on the card element by its own interaction arms.', default: 'transparent', private: true},
    ],
  },
  playground: {
    defaults: {
      label: 'Pro plan',
      isSelected: true,
      padding: 4,
      children: {
        __element: 'XDSVStack',
        props: {gap: 1},
        children: [
          {__element: 'XDSHeading', props: {level: 3}, children: 'Pro plan'},
          {__element: 'XDSText', props: {type: 'body'}, children: '$29/month, unlimited projects and priority support.'},
        ],
      },
    },
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Card toggling between selected/unselected states w/ accent border. For navigation use ClickableCard instead.',
  usage: {
    description: 'Card toggling between selected/unselected states w/ accent border. For navigation use ClickableCard instead.',
    bestPractices: [
      {guidance: true, description: 'Use for multi-select choices: filter chips, add-ons, option grids.'},
      {guidance: true, description: 'Use for multi-select groups; track selected IDs in a Set.'},
      {guidance: true, description: 'When focused, toggle selection with Space or Enter.'},
      {guidance: false, description: 'Use for navigation; use ClickableCard instead.'},
      {guidance: false, description: 'Use for single-select: each card is a checkbox, so screen readers announce multi-select.'},
    ],
  },
  propDescriptions: {
    label: 'accessibility label',
    isSelected: 'controlled selection state',
    onChange: 'called when toggled',
    isDisabled: 'disables card',
    padding: 'inner padding',
    variant: 'background color variant',
    elevation: 'resting shadow depth: none|low|med|high; selection ring composes on top',
    width: 'card width',
    height: 'card height',
    maxWidth: 'max card width',
  },
};

export const docsZh = {
  "name": "SelectableCard",
  "displayName": "Selectable Card",
  "usage": {
    "description": "在选中和未选中状态之间切换、带强调边框的卡片。导航请使用 ClickableCard。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于多选选项：筛选标签、功能附加项或可同时开启多个的选项网格。"
      },
      {
        "guidance": true,
        "description": "用于多选组；在 Set 中跟踪选中的 ID。"
      },
      {
        "guidance": true,
        "description": "聚焦时，使用 Space 或 Enter 切换选择。"
      },
      {
        "guidance": false,
        "description": "用于导航；请改用 ClickableCard。"
      },
      {
        "guidance": false,
        "description": "用于单选组：每张卡片都是复选框，因此辅助技术会将其播报为多选组，每张卡片各有一个 Tab 停靠点。"
      }
    ],
    "anatomy": [
      {
        "name": "容器",
        "required": true,
        "description": "交互式 div，选中时显示强调边框。"
      },
      {
        "name": "内容",
        "required": true,
        "description": "在卡片内渲染的子元素。"
      }
    ]
  },
  "propDescriptions": {
    "label": "无障碍标签。",
    "isSelected": "受控选择状态。",
    "onChange": "切换时调用。",
    "isDisabled": "禁用卡片。",
    "children": "卡片内容。",
    "padding": "内部内边距。",
    "variant": "背景颜色变体。",
    "elevation": "静止阴影深度。选中环会叠加在上方，因此选中的卡片会保留其阴影。",
    "width": "卡片宽度。",
    "height": "卡片高度。",
    "maxWidth": "卡片最大宽度。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值，而不是像 style={{}} 这样的内联样式对象。"
  }
};
