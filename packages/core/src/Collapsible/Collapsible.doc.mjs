// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Collapsible',
  displayName: 'Collapsible',
  group: 'Collapsible',
  category: 'Container',
  keywords: ["accordion","collapse","expandable","disclosure","toggle","panel","foldable","expander","expand"],
  playground: {
    defaults: {
      trigger: 'Click to expand',
      children: {__element: 'Text', props: {type: 'body'}, children: 'This content is revealed when the collapsible is expanded. It can contain any components.'},
    },
  },
  theming: {
    targets: [
      {
        className: 'astryx-collapsible',
        visualProps: ['density'],
        states: ['divided'],
      },
      {
        className: 'astryx-collapsible-trigger',
        visualProps: ['density', 'chevronPosition'],
        states: ['open', 'disabled'],
      },
      {
        className: 'astryx-collapsible-content',
        visualProps: ['density'],
        states: ['open'],
      },
      {className: 'astryx-collapsible-group', visualProps: ['density']},
    ],
  },
  description: 'A primitive that makes any content collapsible: a trigger button toggles visibility of the content area, managing its own state or deferring to a parent CollapsibleGroup.',
  props: [
    {
      name: 'trigger',
      type: 'ReactNode',
      description: 'Content shown in the trigger area (always visible).',
      required: true,
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Trigger',
        },
      ],
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content that collapses and expands.',
    },
    {
      name: 'defaultIsOpen',
      type: 'boolean',
      description:
        'Default open state for standalone uncontrolled usage. Ignored when value binds the item to a surrounding CollapsibleGroup.',
      default: 'true',
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description:
        'Controlled open state for standalone usage. Ignored when value binds the item to a surrounding CollapsibleGroup.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: "Disable the item so its trigger can't be toggled (dimmed, aria-disabled, and out of the tab order). Doesn't collapse an already-open item.",
      default: 'false',
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description:
        'Callback invoked when standalone open state changes. A surrounding CollapsibleGroup owns grouped state and calls its onChange instead.',
    },
    {
      name: 'chevronPosition',
      type: "'start' | 'end'",
      description: 'Logical position of Collapsible\'s disclosure chevron. `end` (default) follows the label, pointing down when collapsed and up when expanded. `start` precedes the label, pointing inward toward content when collapsed (mirrored under RTL) and down when expanded. Inside a CollapsibleGroup this defaults to the group\'s chevronPosition.',
      default: "'end'",
    },
    {
      name: 'value',
      type: 'string',
      description:
        'Identifier used for group coordination. When set inside a CollapsibleGroup, the group owns open state and its onChange is the notification callback.',
    },
    {
      name: 'animatedLayout',
      type: 'AnimatedLayout',
      description:
        'The handle from useAnimatedLayout({containerRef}). With it, opening and closing glides the content after this Collapsible, up to that container, on one shared motion role instead of jumping, and the revealed content and the chevron move on the same motion. Without it, the content after it takes its place at once.',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLDivElement>',
      description: 'Ref forwarded to the root collapsible element.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization. Must be a stylex.create() value.',
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
        'Inline styles. Prefer xstyle for StyleX-optimized styling.',
    },
    {
      name: 'data-testid',
      type: 'string',
      description: 'Test selector for automated testing frameworks.',
    },
  ],
  components: [
    {name: 'CollapsibleGroup'},
  ],
  usage: {
    accessibility: [
      {
        name: 'Trigger label',
        category: 'Color contrast',
        criterion: '1.4.3 Contrast (Minimum)',
        requirement: '4.5:1',
        states: ['Rest', 'Pointer down'],
        description:
          'The trigger text must have at least 4.5:1 contrast with the surface behind it. For Pointer down, measure against the pressed overlay the trigger row paints while it is pressed.',
      },
    ],
    description: 'Collapsible hides and reveals content behind a trigger button. Use it in settings panels, FAQ pages, or detail views to keep the page scannable while letting users drill into sections they care about. Wrap multiple collapsibles in CollapsibleGroup for accordion behavior. For custom collapsible components, use the `useCollapsible` hook directly (`astryx hook useCollapsible`).',
    bestPractices: [
      { guidance: true, description: 'Give every trigger a meaningful accessible name. Visible text usually supplies it; custom trigger content should include VisuallyHidden text when its visuals do not.' },
      { guidance: true, description: 'Use hasDividers on CollapsibleGroup for FAQ-style lists: built-in row hairlines with themed border tokens, no hand-rolled borders.' },
      { guidance: true, description: 'Wrap each Collapsible in an Card for visual separation in accordion layouts, or use CollapsibleGroup\'s hasDividers for flat lists; don\'t combine both.' },
      { guidance: true, description: 'Use CollapsibleGroup with type="single" for settings or FAQ pages where only one section should be open at a time.' },
      { guidance: true, description: 'Use type="multiple" when users need to compare content across sections, like feature lists or pricing tiers.' },
      { guidance: true, description: 'Start sections open (defaultIsOpen) when the content is likely needed on first view; don\'t make users click to see essential info.' },
      { guidance: false, description: 'Hide critical or required content behind a collapsible; users may not discover it.' },
      { guidance: false, description: 'Nest collapsibles more than two levels deep; it makes content hard to find and navigate.' },
      { guidance: false, description: 'Use a collapsible for a single short paragraph; just show the text directly instead.' },
    ],
    anatomy: [
      { name: 'Container', required: true, description: 'The root that contains one trigger and its controlled content and, in a divided group, paints the item divider.' },
      { name: 'Trigger', required: true, description: 'The always-visible button that toggles the content. Shows a label and a chevron indicator.' },
      { name: 'Chevron', required: false, description: 'Animated disclosure arrow. It follows the label by default; chevronPosition="start" moves it ahead of the label, points inward when collapsed (mirrored under RTL), and turns down when expanded.' },
      { name: 'Content', required: false, description: 'The area that hides or reveals when the trigger is clicked.' },
      { name: 'Group container', required: false, description: 'The CollapsibleGroup wrapper rendered when dividers are enabled. It contains the coordinated items and carries their density.' },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "Collapsible 通过触发按钮隐藏和显示内容。适用于设置面板、FAQ 页面或详情视图，既能保持页面易于浏览，又让用户能深入查看自己关心的区块。将多个 Collapsible 包裹在 CollapsibleGroup 中可实现手风琴行为。若要构建自定义折叠组件，请直接使用 `useCollapsible` Hook（`astryx hook useCollapsible`）。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "为每个触发器提供有意义的无障碍名称。可见文本通常已能提供；当自定义触发器内容无法通过视觉表达时，应包含 VisuallyHidden 文本。"
      },
      {
        "guidance": true,
        "description": "FAQ 风格列表应在 CollapsibleGroup 上使用 hasDividers：内置行细分隔线使用主题边框令牌，无需手写边框。"
      },
      {
        "guidance": true,
        "description": "在手风琴布局中，将每个 Collapsible 包裹在 Card 中以获得视觉分隔；扁平列表则使用 CollapsibleGroup 的 hasDividers；不要同时使用两者。"
      },
      {
        "guidance": true,
        "description": "在设置或 FAQ 页面中，若同一时间只应展开一个区块，请使用 type=\"single\" 的 CollapsibleGroup。"
      },
      {
        "guidance": true,
        "description": "当用户需要跨区块比较内容时（例如功能列表或定价层级），请使用 type=\"multiple\"。"
      },
      {
        "guidance": true,
        "description": "当内容很可能在首次查看时就需要，请让区块默认展开（defaultIsOpen）；不要让用户为了查看关键信息而点击。"
      },
      {
        "guidance": false,
        "description": "将关键或必需内容藏在折叠面板之后；用户可能无法发现它。"
      },
      {
        "guidance": false,
        "description": "将折叠面板嵌套超过两层；这会使内容难以查找和导航。"
      },
      {
        "guidance": false,
        "description": "用折叠面板承载单个短段落；直接显示文本即可。"
      }
    ],
    "accessibility": [
      {
        "name": "触发器标签",
        "category": "Color contrast",
        "criterion": "1.4.3 Contrast (Minimum)",
        "requirement": "4.5:1",
        "states": [
          "静止",
          "指针按下"
        ],
        "description": "触发器文本与其背后表面的对比度必须至少为 4.5:1。对于指针按下状态，应针对触发行按下时绘制的按下遮罩进行测量。"
      }
    ],
    "anatomy": [
      {
        "name": "容器",
        "required": true,
        "description": "根元素，包含一个触发器及其受控内容；在带分隔线的组中，还负责绘制项分隔线。"
      },
      {
        "name": "触发器",
        "required": true,
        "description": "始终可见的按钮，用于切换内容。显示标签和 chevron 指示器。"
      },
      {
        "name": "chevron 图标",
        "required": false,
        "description": "带动画的展开箭头。默认跟随标签；chevronPosition=\"start\" 会将其移到标签之前，折叠时指向内侧（RTL 下镜像），展开时向下。"
      },
      {
        "name": "内容",
        "required": false,
        "description": "点击触发器时隐藏或显示的区域。"
      },
      {
        "name": "组容器",
        "required": false,
        "description": "启用分隔线时渲染的 CollapsibleGroup 包裹层。它包含协同工作的各项，并承载其密度设置。"
      }
    ]
  },
  "name": "Collapsible",
  "description": "让任意内容可折叠的基础组件：触发按钮切换内容区域的可见性，可自行管理状态，也可交给父级 CollapsibleGroup 管理。",
  "propDescriptions": {
    "trigger": "显示在触发器区域的内容（始终可见）。",
    "children": "可折叠和展开的内容。",
    "defaultIsOpen": "独立非受控使用时的默认展开状态。当 value 将此项绑定到外围 CollapsibleGroup 时忽略。",
    "isOpen": "独立使用时的受控展开状态。当 value 将此项绑定到外围 CollapsibleGroup 时忽略。",
    "isDisabled": "禁用此项，使其触发器无法切换（变暗、aria-disabled，并移出 Tab 顺序）。不会折叠已展开的项。",
    "onOpenChange": "独立展开状态变化时调用的回调。外围 CollapsibleGroup 负责分组状态，并改为调用其 onChange。",
    "chevronPosition": "Collapsible 展开箭头（chevron）的逻辑位置。`end`（默认）跟随标签，折叠时向下、展开时向上。`start` 位于标签之前，折叠时朝内容方向指向内侧（RTL 下镜像），展开时向下。在 CollapsibleGroup 内，默认使用组的 chevronPosition。",
    "value": "用于组内协调的标识符。在 CollapsibleGroup 内设置时，由组负责展开状态，其 onChange 为通知回调。",
    "animatedLayout": "来自 useAnimatedLayout({containerRef}) 的句柄。提供后，此 Collapsible 之后的内容在打开和关闭时会以同一共享动效角色平滑滑动至该容器，而非跳变；显示的内容和 chevron 也以相同的动效移动。不提供时，其后的内容会立即占据位置。",
    "ref": "转发到折叠根元素的 ref。",
    "xstyle": "用于布局自定义的 StyleX 样式。必须是 stylex.create() 的返回值。",
    "className": "根元素的 CSS 类名。样式优先使用 xstyle。",
    "style": "内联样式。样式优先使用 xstyle，以获得 StyleX 优化。",
    "data-testid": "供自动化测试框架使用的测试选择器。"
  },
  "components": [
    {
      "name": "CollapsibleGroup",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'hide/reveal content behind a trigger; group for accordion behavior',
  usage: {
    description: 'Collapsible hides and reveals content behind a trigger button. Use in settings, FAQs, or detail views. Wrap in CollapsibleGroup for accordion behavior.',
    bestPractices: [
      { guidance: true, description: 'Give every trigger a meaningful accessible name; add VisuallyHidden text when custom visuals do not.' },
      { guidance: true, description: 'Use hasDividers on CollapsibleGroup for FAQ-style lists: built-in row hairlines, no hand-rolled borders.' },
      { guidance: true, description: 'Wrap each Collapsible in an Card for visual separation, or use CollapsibleGroup\'s hasDividers for flat lists; not both.' },
      { guidance: true, description: 'Use CollapsibleGroup with type="single" for settings or FAQ pages where only one section should be open at a time.' },
      { guidance: true, description: 'Use type="multiple" when users need to compare across sections.' },
      { guidance: true, description: 'Start sections open (defaultIsOpen) when content is needed on first view.' },
      { guidance: false, description: 'Hide critical content behind a collapsible; users may not discover it.' },
      { guidance: false, description: 'Nest collapsibles more than two levels deep; makes content hard to find and navigate.' },
      { guidance: false, description: 'Use a collapsible for a single short paragraph; just show the text directly instead.' },
    ],
  },
};
