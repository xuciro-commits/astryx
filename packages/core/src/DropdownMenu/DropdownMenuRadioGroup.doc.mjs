// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'DropdownMenuRadioGroup',
  subComponentOf: 'DropdownMenu',
  displayName: 'Dropdown Menu Radio Group',
  isHiddenFromOverview: true,
  description:
    'A controlled, named single-select group of DropdownMenuRadioItem children (role="group" of menuitemradio). Owns value propagation, close policy, root composition, and the menu inter-item gap; the parent DropdownMenu owns keyboard navigation.',
  usage: {
    description:
      'Use DropdownMenuRadioGroup inside compound-mode DropdownMenu when several commands represent one mutually exclusive choice. Keep value in caller state, provide a concise accessible label, and render each choice as DropdownMenuRadioItem.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep value controlled and update it from onChange so checked state follows caller data.',
      },
      {
        guidance: true,
        description:
          'Provide a concise label even when aria-labelledby points to visible text; label remains required and supplies the aria-label fallback.',
      },
      {
        guidance: true,
        description:
          'Set hasCloseOnSelect=false only when the menu must stay open to show another selection or an in-place result.',
      },
      {
        guidance: false,
        description:
          'Place buttons, links, checkboxes, or arbitrary menu rows inside the radio group.',
      },
      {
        guidance: false,
        description:
          'Add a second key handler or roving-focus model; DropdownMenu owns keyboard navigation.',
      },
    ],
    anatomy: [
      {
        name: 'Group',
        required: true,
        description:
          'The role="group" root that owns the accessible name, controlled-selection context, close policy, root inputs, and inter-item gap.',
      },
      {
        name: 'Radio items',
        required: true,
        description:
          'DropdownMenuRadioItem children; each child owns its menuitemradio role, checked state, content, and indicator paint.',
      },
    ],
  },
  playground: {
    wrapper: {
      component: 'DropdownMenu',
      // Open on first load so the radio choices are visible without a click;
      // the preview bridges `onOpenChange` back so selecting still closes the
      // menu and the trigger reopens it.
      props: {
        button: {label: 'Sort'},
        presentation: 'popover',
        isMenuOpen: true,
      },
    },
    defaults: {
      value: 'newest',
      label: 'Sort by',
      children: [
        {
          __element: 'DropdownMenuRadioItem',
          props: {value: 'newest', label: 'Newest'},
        },
        {
          __element: 'DropdownMenuRadioItem',
          props: {value: 'oldest', label: 'Oldest'},
        },
      ],
    },
  },
  props: [
    {
      name: 'value',
      type: 'string | undefined',
      description:
        'The currently selected value in the group. Pass undefined when nothing is selected yet.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Callback fired when the selected value changes.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible name for the group, applied as aria-label so screen readers announce the radios as a named set, e.g. "Sort by". Required even when aria-labelledby (via base props) points to visible text; that visible reference becomes the computed name while label remains the fallback.',
      required: true,
    },
    {
      name: 'hasCloseOnSelect',
      type: 'boolean',
      default: 'true',
      description:
        'Whether selecting a value closes the menu. Radio items default to closing on selection (a single-choice commit).',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLDivElement>',
      description: 'Ref forwarded to the role="group" root.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The DropdownMenuRadioItems that make up the group.',
      required: true,
    },
  ],
};

export const docsZh = {
  "name": "DropdownMenuRadioGroup",
  "displayName": "Dropdown Menu Radio Group",
  "description": "由 DropdownMenuRadioItem 子项组成的受控、具名单选组（role=\"group\"，其中为 menuitemradio）。负责值传播、关闭策略、根组合以及菜单项间距；父级 DropdownMenu 负责键盘导航。",
  "propDescriptions": {
    "value": "组中当前选中的值。尚未选中任何项时传入 undefined。",
    "onChange": "所选值变化时触发的回调。",
    "label": "组的无障碍名称，作为 `aria-label` 应用，使屏幕阅读器将该组单选按钮作为一个命名集合朗读，例如 \"Sort by\"。即使 `aria-labelledby`（通过基础属性）指向可见文本，也仍为必填；该可见引用会成为计算名称，而 `label` 保留为回退。",
    "hasCloseOnSelect": "选择值是否关闭菜单。单选项默认在选择时关闭（单选提交）。",
    "ref": "转发到 role=\"group\" 根节点的 ref。",
    "children": "组成该组的 DropdownMenuRadioItem。"
  },
  "usage": {
    "description": "当多个命令代表同一个互斥选择时，在复合模式 DropdownMenu 中使用 DropdownMenuRadioGroup。将 `value` 保存在调用方状态中，提供简洁的无障碍标签，并将每个选择渲染为 DropdownMenuRadioItem。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "保持 `value` 受控，并通过 `onChange` 更新它，使选中状态跟随调用方数据。"
      },
      {
        "guidance": true,
        "description": "即使 `aria-labelledby` 指向可见文本，也请提供简洁的 `label`；`label` 仍为必填，并提供 `aria-label` 回退。"
      },
      {
        "guidance": true,
        "description": "仅当菜单必须保持打开以显示另一个选择或就地结果时，才设置 `hasCloseOnSelect=false`。"
      },
      {
        "guidance": false,
        "description": "不要在单选组中放置按钮、链接、复选框或任意菜单行。"
      },
      {
        "guidance": false,
        "description": "不要添加第二个按键处理器或漫游焦点模型；DropdownMenu 负责键盘导航。"
      }
    ],
    "anatomy": [
      {
        "name": "组",
        "required": true,
        "description": "role=\"group\" 根节点，负责无障碍名称、受控选择上下文、关闭策略、根输入和项间距。"
      },
      {
        "name": "单选项",
        "required": true,
        "description": "DropdownMenuRadioItem 子项；每个子项负责其 menuitemradio 角色、选中状态、内容和指示器绘制。"
      }
    ]
  }
};

export const docsDense = {
  name: 'DropdownMenuRadioGroup',
  displayName: 'Dropdown Menu Radio Group',
  description:
    'controlled named menuitemradio group; owns value propagation, close policy, root inputs, and item gap',
  propDescriptions: {
    value: 'selected value (undefined = none)',
    onChange: 'fired when selected value changes',
    label: 'accessible group name (applied as aria-label); required',
    hasCloseOnSelect: 'close menu on select (default true)',
    ref: 'forwarded to the role="group" root',
    children: 'the DropdownMenuRadioItems',
  },
};
