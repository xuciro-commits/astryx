// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TabList',
  displayName: 'Tab List',
  group: 'Tabs',
  category: 'Navigation',
  keywords: ["tabs","tabbar","tabstrip","navigation","tabpanel","tabgroup","segmented","navtabs","tab"],
  playground: {
    defaults: {
      value: 'tab-1',
      children: [
        {__element: 'Tab', props: {value: 'tab-1', label: 'Overview'}},
        {__element: 'Tab', props: {value: 'tab-2', label: 'Activity'}},
      ],
    },
  },
  theming: {
    targets: [
      {className: 'astryx-tab-list', visualProps: ['size']},
      {className: 'astryx-tab-strip'},
      {className: 'astryx-tab-scroll-button'},
      {className: 'astryx-tab', states: ['selected']},
      {className: 'astryx-tab-indicator', states: ['selected']},
      {className: 'astryx-tab-menu'},
      {className: 'astryx-tab-menu-dropdown'},
      {className: 'astryx-tab-menu-item'},
    ],
    vars: [
      {name: '--_tab-indicator-bottom', description: 'Vertical offset of the selected-tab indicator from the tab bottom edge. A host that draws its own bottom divider (Toolbar) sets this so the indicator sits on the divider instead of above it.', default: '-1px', private: true},
    ],
  },
  description: 'Tab strip that provides TabListContext (value, onChange, size) to Tab and TabMenu children; a nav landmark, or the WAI-ARIA tabs pattern where role="tablist" asks for it.',
  props: [
    {
      name: 'value',
      type: 'string',
      description: 'The currently selected tab value.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Callback fired when a tab is selected.',
      required: true,
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size variant applied to all child tabs.',
      default: "'md'",
    },
    {
      name: 'layout',
      type: "'hug' | 'fill'",
      description: "Layout mode for tab sizing. 'hug': each tab hugs its content width. 'fill': tabs stretch equally to fill the container width.",
      default: "'hug'",
    },
    {
      name: 'hasDivider',
      type: 'boolean',
      description: 'Whether to show a bottom border divider under the tab list.',
      default: 'false',
    },
    {
      name: 'isFullBleed',
      type: 'boolean',
      description: "Makes the tab strip escape its parent's container padding, extending to the container's content edges (cancels the nearest padded Layout container's --container-padding-* custom properties with negative margins). The inner strip pads back by the portion of the container inset that is not already supplied by the first or last tab stop, keeping edge labels aligned while a hasDivider underline spans the full content width. Matches Divider's isFullBleed: inline (start/end) edges only; block-edge docking stays with the surrounding layout.",
      default: 'false',
    },
    {
      name: 'role',
      type: 'AriaRole',
      description: "ARIA role for the strip. 'tablist' asks for the WAI-ARIA tabs pattern: role=\"tablist\" / role=\"tab\" and aria-selected, with each tab pointing at the panel it controls via its panelId; only tabs may live in a tablist strip, and an href on a tab is ignored there. Left unset, the strip is a nav landmark marking the current tab with aria-current. Any other value is passed through to the element unchanged.",
    },
    {
      name: 'overflow',
      type: "'auto' | 'scroll' | 'visible'",
      description: "What happens when the tabs are wider than the strip. 'auto' lets the component choose, which today always scrolls. 'scroll' scrolls the tabs horizontally, with edge fades and arrow affordances for pointers that can hover. 'visible' turns overflow handling off and lets the tabs spill out of the strip. The selected tab is always scrolled back into view.",
      default: "'auto'",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Tab and TabMenu items to render inside the strip.',
      slotElements: [
        {
          __element: 'Tab',
          props: {
            label: 'Tab',
            value: 'tab',
          },
        },
      ],
      required: true,
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
  ],
  components: [
    {name: 'Tab'},
    {name: 'TabMenu'},
  ],
  usage: {
    accessibility: [
      {
        name: 'Tab label',
        category: 'Color contrast',
        criterion: '1.4.3 Contrast (Minimum)',
        requirement: '4.5:1',
        states: ['Rest', 'Hover', 'Pointer down', 'Selected'],
        description:
          'Each label must have at least 4.5:1 contrast with the tab surface behind it. For Hover and Pointer down, measure the final background after the overlay layer is applied.',
      },
    ],
    description:
      'TabList provides tab-style navigation for organizing content into categorized sections. Use it to let users switch between related views without leaving the page. A strip narrower than its tabs scrolls horizontally and keeps the selected tab in view.',
    bestPractices: [
      { guidance: true, description: 'Keep tab labels short and descriptive so users can quickly scan available sections.' },
      { guidance: true, description: 'Leave overflow handling on: a strip narrower than its tabs scrolls, and the selected tab is kept in view. Use TabMenu when you want a curated group of extra options rather than a scrolling strip.' },
      { guidance: true, description: 'When using hasDivider with action buttons alongside tabs, match the Button size to the TabList size (both md, both sm); the divided tab strip reserves space so tabs and same-size buttons align to a shared baseline above the rail.' },
      { guidance: true, description: 'Reach for role="tablist" when the strip switches panels in place, and give each tab a panelId pointing at the panel it opens: that link is how a screen reader gets from a tab to its content. Leave it off for navigation between views.' },
      { guidance: true, description: 'Set isFullBleed to stretch a tab bar inside a padded LayoutHeader, Card, or Section to the container\'s inline content edges, instead of reaching for negative-margin CSS.' },
      { guidance: false, description: 'Use tabs for sequential steps or workflows; use a stepper or wizard pattern instead.' },
      { guidance: false, description: 'Place more than 6–8 visible tabs before the overflow menu; prioritize the most important categories.' },
      { guidance: false, description: 'Confuse TabList with SegmentedControl or ToggleButton. TabList is for navigation between views. SegmentedControl and ToggleButton are input controls: SegmentedControl always has exactly one selected option, while ToggleButton can be toggled on or off.' },
    ],
    anatomy: [
      {name: 'Left Content', required: false, description: 'Most important area; hugs content width.'},
      {name: 'Center-Fill Content', required: false, description: 'Stretches to fill available space.'},
      {name: 'Right Content', required: false, description: 'Hugs content width.'},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "TabList 提供选项卡式导航，将内容组织为分类分区。用它让用户在不离开页面的情况下切换相关视图。比选项卡更窄的条会水平滚动，并保持所选选项卡可见。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "保持选项卡标签简短且具有描述性，让用户能快速浏览可用分区。"
      },
      {
        "guidance": true,
        "description": "保持溢出处理开启：比选项卡更窄的条会滚动，并保持所选选项卡可见。当你想要一组精选的额外选项而不是滚动条时，使用 TabMenu。"
      },
      {
        "guidance": true,
        "description": "当 hasDivider 与选项卡旁的操作按钮一起使用时，使 Button 尺寸与 TabList 尺寸匹配（同为 md 或同为 sm）；带分隔线的选项卡条会预留空间，使选项卡和同尺寸按钮在轨道上方的共同基线上对齐。"
      },
      {
        "guidance": true,
        "description": "当条在原地切换面板时使用 role=\"tablist\"，并为每个选项卡指定指向其打开面板的 panelId：该链接是屏幕阅读器从选项卡到达其内容的方式。在视图之间导航时不要设置它。"
      },
      {
        "guidance": true,
        "description": "设置 isFullBleed，将带内边距的 LayoutHeader、Card 或 Section 中的选项卡栏拉伸到容器的行内内容边缘，而不是使用负外边距 CSS。"
      },
      {
        "guidance": false,
        "description": "将选项卡用于顺序步骤或工作流程；请改用步骤器或向导模式。"
      },
      {
        "guidance": false,
        "description": "在溢出菜单之前放置超过 6–8 个可见选项卡；请优先保留最重要的类别。"
      },
      {
        "guidance": false,
        "description": "将 TabList 与 SegmentedControl 或 ToggleButton 混淆。TabList 用于视图之间的导航。SegmentedControl 和 ToggleButton 是输入控件：SegmentedControl 始终恰好有一个选中选项，而 ToggleButton 可打开或关闭。"
      }
    ],
    "anatomy": [
      {
        "name": "左侧内容",
        "required": false,
        "description": "最重要的区域；贴合内容宽度。"
      },
      {
        "name": "中间填充内容",
        "required": false,
        "description": "拉伸以填充可用空间。"
      },
      {
        "name": "右侧内容",
        "required": false,
        "description": "贴合内容宽度。"
      }
    ],
    "accessibility": [
      {
        "name": "选项卡标签",
        "category": "Color contrast",
        "criterion": "1.4.3 Contrast (Minimum)",
        "requirement": "4.5:1",
        "states": [
          "静止",
          "悬停",
          "指针按下",
          "已选中"
        ],
        "description": "每个标签与背后选项卡表面的对比度必须至少为 4.5:1。对于悬停和指针按下，测量应用叠加层后的最终背景。"
      }
    ]
  },
  "name": "TabList",
  "displayName": "Tab List",
  "description": "选项卡条，向 Tab 和 TabMenu 子元素提供 TabListContext（value、onChange、size）；它是导航地标，或在 role=\"tablist\" 要求时采用 WAI-ARIA 选项卡模式。",
  "propDescriptions": {
    "value": "当前选中的选项卡值。",
    "onChange": "选择选项卡时触发的回调。",
    "size": "应用于所有子选项卡的尺寸变体。",
    "layout": "选项卡尺寸的布局模式。'hug'：每个选项卡贴合其内容宽度。'fill'：选项卡等分拉伸以填满容器宽度。",
    "hasDivider": "是否在选项卡列表下方显示底部边框分隔线。",
    "isFullBleed": "使选项卡条脱离父容器的内边距，延伸到容器的内容边缘（用负外边距抵消最近的带内边距 Layout 容器的 --container-padding-* 自定义属性）。内部条会按容器内边距中尚未由第一个或最后一个选项卡停靠点提供的那部分重新填充，使边缘标签保持对齐，同时 hasDivider 下划线横跨整个内容宽度。与 Divider 的 isFullBleed 匹配：仅行内（起始/结束）边缘；块级边缘的停靠仍由周围布局负责。",
    "role": "条的 ARIA role。'tablist' 要求采用 WAI-ARIA 选项卡模式：role=\"tablist\" / role=\"tab\" 和 aria-selected，每个选项卡通过其 panelId 指向它控制的面板；只有选项卡可以放在 tablist 条中，选项卡上的 href 在其中会被忽略。未设置时，条是导航地标，用 aria-current 标记当前选项卡。任何其他值都会原样传递给元素。",
    "overflow": "选项卡比条宽时会发生什么。'auto' 让组件自行选择，目前总是滚动。'scroll' 水平滚动选项卡，并为可悬停的指针提供边缘渐变和箭头提示。'visible' 关闭溢出处理，让选项卡溢出条外。所选选项卡始终会滚动回视图。",
    "children": "在条内渲染的 Tab 和 TabMenu 项。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值：不是 style={{}} 这样的内联样式对象。"
  },
  "components": [
    {
      "name": "Tab",
      "description": ""
    },
    {
      "name": "TabMenu",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Tab strip w/ overflow scrolling; nav landmark by default, WAI-ARIA tabs pattern under role="tablist".',
  usage: {
    description:
      'TabList provides tab-style navigation for organizing content into categorized sections. Use it to let users switch between related views without leaving the page. A strip narrower than its tabs scrolls horizontally and keeps the selected tab in view.',
    bestPractices: [
      { guidance: true, description: 'Keep tab labels short and descriptive so users can quickly scan available sections.' },
      { guidance: true, description: 'Leave overflow handling on: a strip narrower than its tabs scrolls, and the selected tab is kept in view. Use TabMenu when you want a curated group of extra options rather than a scrolling strip.' },
      { guidance: true, description: 'When using hasDivider with action buttons alongside tabs, match the Button size to the TabList size (both md, both sm); the divided tab strip reserves space so tabs and same-size buttons align to a shared baseline above the rail.' },
      { guidance: true, description: 'Reach for role="tablist" when the strip switches panels in place, and give each tab a panelId pointing at the panel it opens: that link is how a screen reader gets from a tab to its content. Leave it off for navigation between views.' },
      { guidance: true, description: 'Set isFullBleed to stretch a tab bar inside a padded LayoutHeader, Card, or Section to the container\'s inline content edges, instead of reaching for negative-margin CSS.' },
      { guidance: false, description: 'Use tabs for sequential steps or workflows; use a stepper or wizard pattern instead.' },
      { guidance: false, description: 'Place more than 6–8 visible tabs before the overflow menu; prioritize the most important categories.' },
      { guidance: false, description: 'Confuse TabList with SegmentedControl or ToggleButton. TabList is for navigation between views. SegmentedControl and ToggleButton are input controls: SegmentedControl always has exactly one selected option, while ToggleButton can be toggled on or off.' },
    ],
    anatomy: [
      {name: 'Left Content', required: false, description: 'Most important area; hugs content width.'},
      {name: 'Center-Fill Content', required: false, description: 'Stretches to fill available space.'},
      {name: 'Right Content', required: false, description: 'Hugs content width.'},
    ],
  },
};
