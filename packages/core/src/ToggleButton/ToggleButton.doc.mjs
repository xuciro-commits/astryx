// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ToggleButton',
  displayName: 'Toggle Button',
  group: 'Button',
  category: 'Action',
  keywords: ["toggle","togglebutton","pressed","toolbar","formatting","segmented","button-group","exclusive","multi-select"],
  playground: {
    defaults: {
      value: 'option-1',
      label: 'Toggle Group',
    },
  },
  theming: {
    targets: [
      {className: 'astryx-toggle-button-group'},
      {className: 'astryx-toggle-button', states: ['isPressed'], visualProps: ['elevation']},
    ],
  },
  description: 'A button that toggles between pressed and unpressed states. Thin wrapper over Button with controlled toggle pattern, icon swap, and font weight emphasis.',
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the button. Used as visible text, or as aria-label for icon-only buttons.',
      required: true,
    },
    {
      name: 'isPressed',
      type: 'boolean',
      description: 'Whether the button is currently pressed. Ignored for a ToggleButtonGroup member with a value.',
    },
    {
      name: 'onPressedChange',
      type: '(isPressed: boolean, event: MouseEvent) => void',
      description: 'Called synchronously when pressed state should change. Receives the next state and the click event; call event.preventDefault() to skip pressedChangeAction. Without an Action, the callback produces no Action-pending feedback. Ignored for a ToggleButtonGroup member with a value.',
    },
    {
      name: 'pressedChangeAction',
      type: '(isPressed: boolean) => void | Promise<void>',
      description: 'Action handler for API- or navigation-backed toggles, run in a transition after the synchronous onPressedChange callback unless that callback calls event.preventDefault(). Works without onPressedChange. Shows an optimistic pressed state and a spinner while pending, and remains interruptible by re-clicks. Omit it for callback-only toggles with no Action-pending feedback. Ignored for a ToggleButtonGroup member with a value.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Button size. Defaults to group size when inside a group.',
      default: "'md'",
    },
    {
      name: 'elevation',
      type: "'none' | 'low' | 'med' | 'high'",
      description:
        'Resting shadow depth for floating (FAB-style) toggle buttons, mirroring Button. `none` is the default flat button; `low`/`med`/`high` map to the shadow token scale. Applies inside a ToggleButtonGroup as well — grouped children retain their own elevation.',
      default: "'none'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the button is disabled.',
      default: 'false',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description: 'Whether the button shows a loading spinner.',
      default: 'false',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Icon element. When provided without children, button becomes icon-only with tooltip from label.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'check',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'isIconOnly',
      type: 'boolean',
      description: 'When true, renders as a square icon-only button with `label` as the aria-label and an automatic tooltip from the label.',
      default: 'false',
    },
    {
      name: 'pressedIcon',
      type: 'ReactNode',
      description: 'Icon shown when pressed. Falls back to icon if not provided.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'check',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Visible content. If omitted with icon, button becomes icon-only.',
    },
    {
      name: 'tooltip',
      type: 'string',
      description: 'Tooltip text shown on hover.',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Value identifier when used inside ToggleButtonGroup. Required in groups.',
    },
    {
      name: 'data-testid',
      type: 'string',
      description: 'Test selector for automated testing frameworks.',
    },
  ],
  components: [
    {name: 'ToggleButtonGroup'},
  ],
  usage: {
    description:
      'ToggleButton switches between selected and unselected states to represent a persistent on/off choice. Use it standalone for binary actions like bold, mute, or favorite, or inside a ToggleButtonGroup for single-select or multi-select toolbar controls.',
    accessibility: [
      {
        name: 'Text label',
        category: 'Color contrast',
        criterion: '1.4.3 Contrast (Minimum)',
        requirement: '4.5:1',
        states: ['Unselected', 'Selected', 'Hover', 'Pointer down'],
        description:
          'The label must have at least 4.5:1 contrast with the button background when selected and unselected. For Hover and Pointer down, measure the final background after the overlay is applied.',
      },
      {
        name: 'Essential icon or spinner arc',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Icon only', 'Loading'],
        description:
          'An icon-only ToggleButton must have at least 3:1 contrast between its icon and button background. The moving spinner arc must also meet 3:1. An icon beside a visible label does not need its own check.',
      },
      {
        name: 'Selected state indicator',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1 if relied upon',
        states: ['Selected'],
        description:
          'The selected background must reach 3:1 only when users need it to tell selected from unselected. Label weight or a changed icon can also show selection.',
      },
      {
        name: 'Visible control boundary',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1 if needed',
        states: ['Rest'],
        description:
          'The button edge needs 3:1 contrast only when users need it to see the control. A visible label or icon can show the control instead.',
      },
      {
        name: 'Keyboard focus indicator',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Focus visible'],
        description:
          'The focus outline must have at least 3:1 contrast with the area around the button. Check both selected and unselected states.',
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
      {guidance: true, description: 'Use a filled or colored icon for the pressed state so users can see the current state at a glance: an outline star vs a solid star, for example.'},
      {guidance: true, description: 'Keep the label identical between pressed and unpressed states. Let the visual treatment (icon, weight, background) communicate the change.'},
      {guidance: true, description: 'Wrap related toggles in a ToggleButtonGroup with an accessible label so screen readers announce them as a connected set.'},
      {guidance: false, description: "Don't use a ToggleButton for one-time actions like \"Submit\" or \"Delete\"; those are regular Buttons, not toggles."},
      {guidance: false, description: "Don't mix ToggleButtons with regular Buttons inside the same group; use only ToggleButtons in a ToggleButtonGroup."},
      {guidance: false, description: "Don't use a ToggleButton for on/off settings that persist across sessions; use a Switch instead, which better communicates \"setting\" semantics."},
    ],
    anatomy: [
      {name: 'Icon', required: false, description: 'A leading icon that represents the toggle action, like a star for favorite or bold "B" for formatting.'},
      {name: 'Pressed icon', required: false, description: 'An alternate icon shown when pressed: typically a filled version of the default icon to reinforce the active state.'},
      {name: 'Label', required: true, description: 'The visible text or accessible name. For icon-only toggles, used as the aria-label and auto-tooltip.'},
      {name: 'Spinner', required: false, description: 'Replaces the icon during async operations triggered by pressedChangeAction.'},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "ToggleButton 在选中和未选中状态之间切换，表示持久的开/关选择。可单独用于加粗、静音或收藏等二元操作，也可放在 ToggleButtonGroup 内用于单选或多选工具栏控件。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "为按下状态使用填充或着色图标，让用户一眼看出当前状态：例如空心星与实心星。"
      },
      {
        "guidance": true,
        "description": "在按下和未按下状态之间保持标签完全相同。让视觉处理（图标、字重、背景）传达变化。"
      },
      {
        "guidance": true,
        "description": "将相关切换按钮包裹在带无障碍标签的 ToggleButtonGroup 中，让屏幕阅读器将它们播报为一个连接的集合。"
      },
      {
        "guidance": false,
        "description": "不要将 ToggleButton 用于“提交”或“删除”等一次性操作；那些是常规 Button，而不是切换按钮。"
      },
      {
        "guidance": false,
        "description": "不要在同一组内混合 ToggleButton 和常规 Button；ToggleButtonGroup 中只使用 ToggleButton。"
      },
      {
        "guidance": false,
        "description": "不要将 ToggleButton 用于跨会话持久化的开/关设置；请改用 Switch，它能更好地传达“设置”语义。"
      }
    ],
    "anatomy": [
      {
        "name": "图标",
        "required": false,
        "description": "表示切换操作的前置图标，例如收藏用星形，格式化用粗体“B”。"
      },
      {
        "name": "按下图标",
        "required": false,
        "description": "按下时显示的替代图标：通常是默认图标的填充版本，以强化活动状态。"
      },
      {
        "name": "标签",
        "required": true,
        "description": "可见文本或无障碍名称。对于仅图标切换按钮，用作 aria-label 和自动工具提示。"
      },
      {
        "name": "加载指示器",
        "required": false,
        "description": "在由 pressedChangeAction 触发的异步操作期间替换图标。"
      }
    ],
    "accessibility": [
      {
        "name": "文本标签",
        "category": "Color contrast",
        "criterion": "1.4.3 Contrast (Minimum)",
        "requirement": "4.5:1",
        "states": [
          "未选中",
          "已选中",
          "悬停",
          "指针按下"
        ],
        "description": "选中和未选中时，标签与按钮背景的对比度至少为 4.5:1。对于悬停和指针按下状态，请测量应用覆盖层后的最终背景。"
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
        "description": "仅图标的 ToggleButton 其图标与按钮背景之间至少要有 3:1 的对比度。旋转的加载弧线也必须达到 3:1。可见标签旁的图标无需单独检查。"
      },
      {
        "name": "选中状态指示器",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1 if relied upon",
        "states": [
          "已选中"
        ],
        "description": "只有当用户需要依靠选中背景来区分选中与未选中时，它才需达到 3:1。标签字重或图标变化也可以表示选中。"
      },
      {
        "name": "可见控件边界",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1 if needed",
        "states": [
          "静止"
        ],
        "description": "只有当用户需要看到控件时才要求按钮边缘达到 3:1 对比度。可见标签或图标也可以表示控件。"
      },
      {
        "name": "键盘焦点指示器",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1",
        "states": [
          "焦点可见"
        ],
        "description": "焦点轮廓与按钮周围区域的对比度至少为 3:1。请同时检查选中和未选中状态。"
      },
      {
        "name": "禁用外观",
        "category": "Color contrast",
        "criterion": "1.4.3 and 1.4.11 exceptions",
        "requirement": "Not required",
        "states": [
          "已禁用"
        ],
        "description": "禁用控件无需满足这些对比度比例。"
      }
    ]
  },
  "name": "ToggleButton",
  "displayName": "Toggle Button",
  "description": "在按下和未按下状态之间切换的按钮。对 Button 的轻量封装，具有受控切换模式、图标切换和字重强调。",
  "propDescriptions": {
    "label": "按钮的无障碍标签。用作可见文本，或作为仅图标按钮的 aria-label。",
    "isPressed": "按钮当前是否处于按下状态。对于带 value 的 ToggleButtonGroup 成员会被忽略。",
    "onPressedChange": "在按下状态应发生变化时同步调用。接收下一状态和点击事件；调用 event.preventDefault() 可跳过 pressedChangeAction。没有 Action 时，该回调不会产生 Action 待定反馈。对于带 value 的 ToggleButtonGroup 成员会被忽略。",
    "pressedChangeAction": "由 API 或导航支持的切换按钮的 Action 处理函数，在同步的 onPressedChange 回调之后于 transition 中运行，除非该回调调用 event.preventDefault()。无需 onPressedChange 也可工作。待定期间显示乐观的按下状态和 Spinner，并可通过再次点击中断。对于没有 Action 待定反馈的仅回调切换按钮，请省略此项。对于带 value 的 ToggleButtonGroup 成员会被忽略。",
    "size": "按钮尺寸。在组内时默认使用组尺寸。",
    "elevation": "浮动（FAB 风格）切换按钮的静止阴影深度，与 Button 保持一致。`none` 是默认的扁平按钮；`low`/`med`/`high` 映射到阴影令牌比例。在 ToggleButtonGroup 内也同样适用——组内子项保留各自的 elevation。",
    "isDisabled": "按钮是否禁用。",
    "isLoading": "按钮是否显示加载 Spinner。",
    "icon": "图标元素。在没有 children 的情况下提供时，按钮变为仅图标按钮，并使用 label 作为工具提示。",
    "isIconOnly": "为 true 时渲染为方形仅图标按钮，`label` 作为 aria-label，并根据标签自动生成工具提示。",
    "pressedIcon": "按下时显示的图标。未提供时回退到 icon。",
    "children": "可见内容。与 icon 一起省略时，按钮变为仅图标按钮。",
    "tooltip": "悬停时显示的工具提示文本。",
    "value": "在 ToggleButtonGroup 内使用时的值标识符。在组内为必需项。",
    "data-testid": "供自动化测试框架使用的测试选择器。"
  },
  "components": [
    {
      "name": "ToggleButtonGroup",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'toggle btn w/ pressed/unpressed states, icon swap, group integration for single/multi-select',
  usage: {
    description:
      'ToggleButton switches between selected/unselected for persistent on/off choices. Standalone for binary actions or in ToggleButtonGroup for single/multi-select toolbar controls.',
    bestPractices: [
      {guidance: true, description: 'Filled/colored icon for pressed state so users see current state at a glance.'},
      {guidance: true, description: 'Keep label identical between states. Let visual treatment communicate the change.'},
      {guidance: true, description: 'Wrap related toggles in ToggleButtonGroup with accessible label.'},
      {guidance: false, description: "Don't use ToggleButton for one-time actions; use regular Button for submit/delete."},
      {guidance: false, description: "Don't mix ToggleButtons with regular Buttons in the same group."},
      {guidance: false, description: "Don't use ToggleButton for persistent settings; use Switch instead."},
    ],
  },
};
