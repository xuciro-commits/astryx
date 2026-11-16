// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ButtonGroup',
  displayName: 'Button Group',
  group: 'Button',
  category: 'Action',
  keywords: ["button-group","connected","split","toolbar","actions","grouped","buttons"],
  playground: {
    defaults: {
      label: 'Actions',
      children: [
        {__element: 'Button', props: {label: 'Copy', variant: 'secondary'}},
        {__element: 'Button', props: {label: 'Paste', variant: 'secondary'}},
        {__element: 'Button', props: {label: 'Delete', variant: 'secondary'}},
      ],
    },
  },
  theming: {
    targets: [
      {className: 'astryx-button-group', visualProps: ['size', 'orientation', 'elevation']},
    ],
  },
  components: [
    {
      name: 'ButtonGroup',
      displayName: 'Button Group',
      description: 'Groups multiple buttons together with connected styling: shared borders, proper border-radius handling (only on outer edges), and horizontal or vertical orientation. Under the touch presentation a press tracks like a menu: press a button and slide across the others, and the highlight follows. The button you lift on runs, and lifting outside the group runs nothing. A mouse press acts as a native button\'s. With a finger, each button\'s target grows toward 44 px, up to half the gap to a neighbour, without the buttons growing. A menu trigger in the group keeps its own opening.',
      props: [
        {name: 'children', type: 'ReactNode', description: 'Button or IconButton children.', required: true, slotElements: [{__element: 'Button', props: {label: 'Action'}}]},
        {name: 'label', type: 'string', description: 'Accessible label for the group (aria-label).', required: true},
        {name: 'orientation', type: "'horizontal' | 'vertical'", description: 'Layout direction of the button group.', default: "'horizontal'"},
        {name: 'size', type: "'sm' | 'md' | 'lg'", description: 'Default size for buttons in the group. Individual buttons can override.', default: "'md'"},
        {name: 'isDisabled', type: 'boolean', description: 'Whether all buttons in the group are disabled.', default: 'false'},
        {name: 'elevation', type: "'none' | 'low' | 'med' | 'high'", description: 'Resting shadow depth for the whole group. The connected buttons share one surface, so the shadow lifts them as a unit. Use for a group that floats above content.', default: "'none'"},
        {name: 'ref', type: 'React.Ref<HTMLDivElement>', description: 'Ref forwarded to the root element.'},
        {name: 'xstyle', type: 'StyleXStyles', description: 'StyleX styles for layout customization. Must be a stylex.create() value.'},
        {name: 'data-testid', type: 'string', description: 'Test selector for automated testing frameworks.'},
      ],
    },
  ],
  usage: {
    description:
      'ButtonGroup joins related actions into a single connected control. Use it when multiple buttons represent related choices or operations that belong together visually, like copy/cut/paste, or undo/redo.',
    accessibility: [
      {
        name: 'Text label',
        category: 'Color contrast',
        criterion: '1.4.3 Contrast (Minimum)',
        requirement: '4.5:1',
        states: ['Rest', 'Hover', 'Pointer down'],
        description:
          'Text in each button must have at least 4.5:1 contrast with its background in every state. For Hover and Pointer down, measure the final background after the overlay is applied.',
      },
      {
        name: 'Essential icon or spinner arc',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Icon only', 'Loading'],
        description:
          'An icon used instead of text must have at least 3:1 contrast with the button background. The moving spinner arc must also meet 3:1. An icon beside a visible label does not need its own check.',
      },
      {
        name: 'Visible control boundary',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1 if needed',
        states: ['Rest'],
        description:
          'Some groups need a divider or edge to show each button. That divider or edge must have at least 3:1 contrast.',
      },
      {
        name: 'Keyboard focus indicator',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Focus visible'],
        description:
          'The focus outline must have at least 3:1 contrast with the area around it.',
      },
      {
        name: 'Disabled appearance',
        category: 'Color contrast',
        criterion: '1.4.3 and 1.4.11 exceptions',
        requirement: 'Not required',
        states: ['Disabled'],
        description:
          'Disabled controls do not need to meet these contrast ratios.',
      },
    ],
    bestPractices: [
      {guidance: true, description: 'Group buttons that perform related actions on the same object, like copy, cut, paste on selected text.'},
      {guidance: true, description: 'Use the same variant for all buttons in a group so they look like a single connected unit.'},
      {guidance: true, description: 'Keep groups small (2–4 buttons). For more actions, use a Toolbar or DropdownMenu instead.'},
      {guidance: false, description: "Don't mix wildly different actions. A Save button next to a Delete button in the same group is confusing."},
      {guidance: false, description: "Don't use ButtonGroup for navigation. Use SegmentedControl or TabList for switching between views."},
      {guidance: false, description: "Don't nest ButtonGroups. If you need multiple groups, place them side by side with a gap."},
      {guidance: true, description: 'Name the group for what its buttons act on. The label is the group\'s accessible name and a screen reader reads it before each member.'},
      {guidance: true, description: 'Keep the group a single Tab stop. Arrow keys move between members along the orientation, and Home/End jump to the ends. This is the WAI-ARIA APG roving tabindex technique: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex'},
      {guidance: false, description: "Don't disable the group to show that an action is in flight. Leave the group enabled and show progress on the button that started the work."},
    ],
    anatomy: [
      {name: 'Button', required: true, description: 'One or more Button or IconButton children that form the connected group.'},
      {name: 'Divider', required: false, description: 'A thin border between buttons, rendered automatically by the group.'},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "components": [
    {
      "name": "ButtonGroup",
      "displayName": "Button Group",
      "description": "将多个按钮组合在一起，并提供连接式样式：共享边框、正确的 border-radius 处理（仅在外边缘）以及水平或垂直方向。在触摸呈现方式下，按压的跟踪方式类似菜单：按下一个按钮并滑过其他按钮时，高亮会跟随。抬起时所在的按钮会执行，而在组外抬起则不会执行任何操作。鼠标按压的行为与原生按钮一致。使用手指时，每个按钮的目标会扩展到 44 px，最多达到与相邻按钮间距的一半，而按钮本身不会变大。组内的菜单触发器保持自身的展开行为。",
      "propDescriptions": {
        "children": "Button 或 IconButton 子元素。",
        "label": "组的无障碍标签（aria-label）。",
        "orientation": "按钮组的布局方向。",
        "size": "组内按钮的默认尺寸。单个按钮可以覆盖此设置。",
        "isDisabled": "是否禁用组内所有按钮。",
        "elevation": "整个组的静止阴影深度。连接的按钮共享一个表面，因此阴影会将它们作为一个整体抬起。适用于浮在内容上方的组。",
        "ref": "转发到根元素的 ref。",
        "xstyle": "用于布局自定义的 StyleX 样式。必须是 `stylex.create()` 的值。",
        "data-testid": "供自动化测试框架使用的测试选择器。"
      }
    }
  ],
  "usage": {
    "description": "ButtonGroup 将相关操作组合为一个连接的控件。当多个按钮代表彼此相关、在视觉上属于一组的选项或操作时使用，例如复制/剪切/粘贴，或撤销/重做。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将针对同一对象执行相关操作的按钮分组，例如对选中文本的复制、剪切、粘贴。"
      },
      {
        "guidance": true,
        "description": "组内所有按钮使用相同的 `variant`，使其看起来像一个连接的整体。"
      },
      {
        "guidance": true,
        "description": "保持组内按钮较少（2–4 个）。如需更多操作，请改用 Toolbar 或 DropdownMenu。"
      },
      {
        "guidance": false,
        "description": "不要混用差异过大的操作。同一组内 Save 按钮紧挨 Delete 按钮会让人困惑。"
      },
      {
        "guidance": false,
        "description": "不要将 ButtonGroup 用于导航。切换视图请使用 SegmentedControl 或 TabList。"
      },
      {
        "guidance": false,
        "description": "不要嵌套 ButtonGroup。如需多个组，请将它们并排放置并保留间距。"
      },
      {
        "guidance": true,
        "description": "按按钮所作用的对象为组命名。该标签是组的无障碍名称，屏幕阅读器会在朗读每个成员之前朗读它。"
      },
      {
        "guidance": true,
        "description": "让整组只占一个 Tab 停靠点。方向键沿方向在成员之间移动，Home/End 跳到两端。这是 WAI-ARIA APG 的 roving tabindex 技术：https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex"
      },
      {
        "guidance": false,
        "description": "不要通过禁用整组来表示操作正在进行。保持组启用，并在发起工作的按钮上显示进度。"
      }
    ],
    "anatomy": [
      {
        "name": "按钮",
        "required": true,
        "description": "一个或多个构成连接组的 Button 或 IconButton 子元素。"
      },
      {
        "name": "分隔线",
        "required": false,
        "description": "按钮之间的细边框，由组自动渲染。"
      }
    ],
    "accessibility": [
      {
        "name": "文本标签",
        "category": "Color contrast",
        "criterion": "1.4.3 Contrast (Minimum)",
        "requirement": "4.5:1",
        "states": [
          "静止",
          "悬停",
          "指针按下"
        ],
        "description": "每个按钮中的文本在所有状态下与其背景的对比度都必须至少为 4.5:1。对于悬停和指针按下，请测量应用叠加层后的最终背景。"
      },
      {
        "name": "必要图标或加载弧线",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1",
        "states": [
          "仅图标",
          "加载中"
        ],
        "description": "替代文本使用的图标与按钮背景的对比度必须至少为 3:1。旋转的加载弧线也必须达到 3:1。可见标签旁的图标无需单独检查。"
      },
      {
        "name": "可见控件边界",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1 if needed",
        "states": [
          "静止"
        ],
        "description": "某些组需要分隔线或边缘来显示每个按钮。该分隔线或边缘的对比度必须至少为 3:1。"
      },
      {
        "name": "键盘焦点指示器",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1",
        "states": [
          "焦点可见"
        ],
        "description": "焦点轮廓与其周围区域的对比度必须至少为 3:1。"
      },
      {
        "name": "禁用外观",
        "category": "Color contrast",
        "criterion": "1.4.3 and 1.4.11 exceptions",
        "requirement": "Not required",
        "states": [
          "禁用"
        ],
        "description": "禁用控件无需满足这些对比度比例。"
      }
    ]
  },
  "name": "ButtonGroup",
  "displayName": "Button Group"
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'connected button group w/ shared borders, outer-only radius, horizontal/vertical',
  usage: {
    description:
      'ButtonGroup joins related actions into a single connected control. Use for related operations on the same object.',
    bestPractices: [
      {guidance: true, description: 'Group related actions on the same object: copy/cut/paste, undo/redo.'},
      {guidance: true, description: 'Same variant for all buttons to look like one unit.'},
      {guidance: true, description: 'Keep groups small (2–4 buttons). Use Toolbar or DropdownMenu for more.'},
      {guidance: false, description: "Don't mix unrelated actions in one group."},
      {guidance: false, description: "Don't use for navigation. Use SegmentedControl or TabList."},
      {guidance: false, description: "Don't nest ButtonGroups."},
      {guidance: true, description: 'Label the group for what its buttons act on; it is the accessible name.'},
      {guidance: true, description: 'Single Tab stop; arrows move between members, Home/End to ends (APG roving tabindex).'},
      {guidance: true, description: 'Under the touch presentation a press tracks like a menu: slide across, the lifted button runs, a lift outside runs nothing. A mouse press acts as a native button\'s. Finger targets grow toward 44 px, up to half the gap to a neighbour; a menu trigger keeps its own opening.'},
      {guidance: false, description: "Don't disable the group for an in-flight action; show progress on the active button instead."},
    ],
  },
  components: [
    {
      name: 'ButtonGroup',
      displayName: 'Button Group',
      description: 'connected button group w/ shared borders, outer-only radius',
      propDescriptions: {
        children: 'Button or IconButton children',
        label: 'a11y label (aria-label)',
        orientation: 'layout direction',
        size: 'default btn size; individual btns override',
        isDisabled: 'all btns disabled',
        elevation: 'resting shadow depth for whole group: none|low|med|high',
        xstyle: 'StyleX layout styles; must be stylex.create() value',
        'data-testid': 'test selector',
      },
    },
  ],
};
