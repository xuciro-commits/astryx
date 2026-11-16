// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Outer chrome',
    required: true,
    description:
      'Section-owned container that supplies the toolbar surface, padding, and selected divider edges.',
  },
  {
    name: 'Toolbar',
    required: true,
    description:
      'Named toolbar row that owns toolbar semantics and the start, optional center, and end layout.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Toolbar',
  displayName: 'Toolbar',
  category: 'Action',
  keywords: ['toolbar', 'nav', 'bar', 'actions', 'buttonbar', 'header', 'footer', 'action-bar', 'control-bar'],
  playground: {
    defaults: {
      label: 'Table actions',
      size: 'sm',
      dividers: ['bottom'],
      startContent: {
        __element: 'TabList',
        props: {value: 'overview'},
        children: [
          {__element: 'Tab', props: {label: 'Overview', value: 'overview'}},
          {__element: 'Tab', props: {label: 'Activity', value: 'activity'}},
        ],
      },
      endContent: [
        {__element: 'Selector', props: {label: 'Status', isLabelHidden: true, placeholder: 'Status', size: 'sm', options: ['Open', 'In progress', 'Done']}},
        {__element: 'Button', props: {label: 'New item', variant: 'primary', size: 'sm'}},
      ],
    },
  },
  theming: {
    targets: [
      {className: 'astryx-toolbar', states: ['size']},
    ],
  },
  components: [
    {
      name: 'Toolbar',
      displayName: 'Toolbar',
      description:
        'General-purpose toolbar container with three content slots and roving tabindex.',
      props: [
        {
          name: 'label',
          type: 'string',
          description: 'Accessible label for the toolbar, applied as aria-label.',
          required: true,
        },
        {
          name: 'startContent',
          type: 'ReactNode',
          description: 'Content aligned to the start (left in LTR).',
          slotElements: [
            {__element: 'Text', props: {type: 'body', weight: 'bold'}, children: 'Title'},
            {__element: 'Button', props: {label: 'Back', variant: 'ghost', size: 'sm'}},
            {__element: 'IconButton', props: {label: 'Filter', icon: {__element: 'Icon', props: {icon: 'check', size: 'sm'}}, variant: 'ghost', size: 'sm'}},
            {
              __element: 'TabList',
              props: {value: 'overview'},
              children: [
                {__element: 'Tab', props: {label: 'Overview', value: 'overview'}},
                {__element: 'Tab', props: {label: 'Activity', value: 'activity'}},
              ],
            },
            {
              __element: 'SegmentedControl',
              props: {label: 'View', value: 'list'},
              children: [
                {__element: 'SegmentedControlItem', props: {label: 'List', value: 'list'}},
                {__element: 'SegmentedControlItem', props: {label: 'Grid', value: 'grid'}},
              ],
            },
            {__element: 'Selector', props: {label: 'Status', isLabelHidden: true, placeholder: 'Status', size: 'sm', options: ['Open', 'In progress', 'Done']}},
          ],
        },
        {
          name: 'centerContent',
          type: 'ReactNode',
          description:
            'Centered content. Switches to the three-lane layout: centered while each side lane fits in half of the width it leaves, and the row wraps when the lanes do not fit.',
          slotElements: [
            {__element: 'Text', props: {type: 'body', weight: 'bold'}, children: 'Center'},
            {
              __element: 'SegmentedControl',
              props: {label: 'View', value: 'list'},
              children: [
                {__element: 'SegmentedControlItem', props: {label: 'List', value: 'list'}},
                {__element: 'SegmentedControlItem', props: {label: 'Grid', value: 'grid'}},
              ],
            },
            {
              __element: 'TabList',
              props: {value: 'overview'},
              children: [
                {__element: 'Tab', props: {label: 'Overview', value: 'overview'}},
                {__element: 'Tab', props: {label: 'Activity', value: 'activity'}},
              ],
            },
          ],
        },
        {
          name: 'endContent',
          type: 'ReactNode',
          description: 'Content aligned to the end (right in LTR).',
          slotElements: [
            {__element: 'Button', props: {label: 'Save', variant: 'primary', size: 'sm'}},
            {__element: 'IconButton', props: {label: 'More', icon: {__element: 'Icon', props: {icon: 'chevronDown', size: 'sm'}}, variant: 'ghost', size: 'sm'}},
            {__element: 'Selector', props: {label: 'Sort', isLabelHidden: true, placeholder: 'Sort by', size: 'sm', options: ['Newest', 'Oldest', 'A–Z']}},
            {__element: 'Badge', props: {label: '3'}},
          ],
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          description:
            'Size of the toolbar. Controls minimum height and coordinates with Button, TextInput, TabList, and Selector; children inherit this size as their default via SizeContext.',
          default: "'md'",
        },
        {
          name: 'gap',
          type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
          description: 'Gap between items within each slot.',
          default: '1',
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          description:
            'Orientation for keyboard navigation. Controls arrow key direction.',
          default: "'horizontal'",
        },
        {
          name: 'variant',
          type: 'SectionVariant',
          description: 'Visual variant passed to Section.',
          default: "'transparent'",
        },
        {
          name: 'dividers',
          type: "Array<'top' | 'bottom' | 'start' | 'end'>",
          description: 'Borders/dividers rendered around the toolbar.',
        },
        {
          name: 'xstyle',
          type: 'StyleXStyles',
          description:
            'StyleX styles for layout customization. Must be a stylex.create() value.',
        },
      ],    },
  ],
  usage: {
    anatomy,
    description:
      'Toolbar is a horizontal bar with left, center, and right areas. Use it for contextual actions within a content area (above a table, inside a card, or in a panel), not as a page-level header. Set the size once on the toolbar and all buttons, inputs, and tabs inside it match automatically.',
    bestPractices: [
      {guidance: true, description: 'Put secondary actions like "Back" on the left, and primary actions like "Save" on the right.'},
      {guidance: true, description: 'Make temporary toolbars like bulk selection visually distinct so users can tell they\'re contextual, for example with a background color or border.'},
      {guidance: true, description: 'Visually separate the toolbar from the content below it, with a divider, a background variant, or both.'},
      {guidance: true, description: 'Use Toolbar as a card header when the header has interactive actions like filter or add; it gives you slot layout, keyboard navigation, and size cascading. If the header is just a title with no actions, a LayoutHeader or Section is enough.'},
      {guidance: false, description: 'Put too many actions in one toolbar; move less common items into a MoreMenu.'},
      {guidance: false, description: 'Set size on individual child buttons; set it once on the toolbar and it cascades automatically.'},
      {guidance: false, description: 'Use Toolbar for app-wide navigation like main menu links or sign out; use TopNav or LayoutHeader for that.'},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "components": [
    {
      "name": "Toolbar",
      "displayName": "Toolbar",
      "description": "通用工具栏容器，具有三个内容插槽和漫游 tabindex。",
      "propDescriptions": {
        "label": "工具栏的无障碍标签，作为 aria-label 应用。",
        "startContent": "对齐到起始位置的内容（LTR 中为左侧）。",
        "centerContent": "居中的内容。会切换为三通道布局：当每个侧通道能放入所留宽度的一半时保持居中，通道放不下时行会换行。",
        "endContent": "对齐到结束位置的内容（LTR 中为右侧）。",
        "size": "工具栏的尺寸。控制最小高度并与 Button、TextInput、TabList 和 Selector 协调；子元素通过 SizeContext 继承此尺寸作为默认值。",
        "gap": "每个插槽内项目之间的间距。",
        "orientation": "键盘导航的方向。控制方向键方向。",
        "variant": "传给 Section 的视觉变体。",
        "xstyle": "用于布局自定义的 StyleX 样式。必须是 stylex.create() 值。",
        "dividers": "工具栏周围渲染的边框/分隔线。"
      }
    }
  ],
  "usage": {
    "anatomy": [
      {
        "name": "外部框架",
        "required": true,
        "description": "由 Section 拥有的容器，提供工具栏表面、内边距和选定的分隔线边缘。"
      },
      {
        "name": "工具栏",
        "required": true,
        "description": "具名工具栏行，拥有工具栏语义以及起始、可选居中和结束布局。"
      }
    ],
    "description": "Toolbar 是一个带有左、中、右区域的水平栏。用于内容区域内的上下文操作（表格上方、卡片内或面板中），而不是页面级页眉。在工具栏上设置一次 size，其中所有按钮、输入框和标签页都会自动匹配。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将“返回”等次要操作放在左侧，将“保存”等主要操作放在右侧。"
      },
      {
        "guidance": true,
        "description": "让批量选择等临时工具栏在视觉上有所区分，让用户知道它们是上下文相关的，例如使用背景色或边框。"
      },
      {
        "guidance": true,
        "description": "用分隔线、背景变体或两者将工具栏与其下方内容在视觉上分开。"
      },
      {
        "guidance": true,
        "description": "当卡片页眉带有筛选或添加等交互操作时，将 Toolbar 用作卡片页眉；它提供插槽布局、键盘导航和尺寸级联。如果页眉只是无操作的标题，LayoutHeader 或 Section 就足够了。"
      },
      {
        "guidance": false,
        "description": "不要在一个工具栏中放太多操作；将不常用的项目移到 MoreMenu 中。"
      },
      {
        "guidance": false,
        "description": "不要在单个子按钮上设置尺寸；在工具栏上设置一次，它会自动级联。"
      },
      {
        "guidance": false,
        "description": "不要将 Toolbar 用于全应用导航，如主菜单链接或退出登录；请使用 TopNav 或 LayoutHeader。"
      }
    ]
  },
  "name": "Toolbar"
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Horizontal bar w/ left, center, right areas. For contextual actions in content, not page headers. Size cascades to children.',
  usage: {
    anatomy,
    description:
      'Horizontal bar w/ left, optional center, right. For contextual actions within content (tables, cards, panels), not page-level headers. Size cascades to children.',
    bestPractices: [
      {guidance: true, description: 'Secondary actions (Back) left, primary actions (Save) right.'},
      {guidance: true, description: 'Make temporary toolbars (bulk selection) visually distinct, e.g. background color or border.'},
      {guidance: true, description: 'Separate toolbar from content: divider, background variant, or both.'},
      {guidance: true, description: 'Use Toolbar as card header when it has actions (filter, add). Just a title? Use LayoutHeader/Section.'},
      {guidance: false, description: 'Overload with actions; use MoreMenu for overflow.'},
      {guidance: false, description: 'Set size on child buttons; set once on toolbar, it cascades.'},
      {guidance: false, description: 'Use for app-wide nav (menu links, sign out); use TopNav/LayoutHeader.'},
    ],
  },
  components: [
    {
      name: 'Toolbar',
      displayName: 'Toolbar',
      description: 'Toolbar container w/ 3 content slots + roving tabindex.',
      propDescriptions: {
        label: 'A11y label, aria-label on toolbar.',
        startContent: 'Start-aligned content.',
        centerContent: 'Centered content; three lanes, wraps when they do not fit.',
        endContent: 'End-aligned content.',
        size: 'Toolbar size; controls min-height + cascades to children via SizeContext.',
        gap: 'Gap between slot items.',
        orientation: 'Keyboard nav direction.',
        variant: 'Visual variant for Section.',
        xstyle: 'StyleX layout styles. Must be stylex.create() value.',
      },
    },
  ],
};
