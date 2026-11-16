// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Checkable row',
    required: true,
    description:
      'The menuitemcheckbox root that owns the accessible name, checked state, focus, and activation.',
  },
  {
    name: 'Label/content',
    required: true,
    description:
      'Caller content laid out by Item: the required label plus optional description, icon, and end content.',
  },
  {
    name: 'Checkbox marker',
    required: true,
    description:
      'Decorative shared Indicator chrome that visualizes checked and disabled state without adding a second control.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'DropdownMenuCheckboxItem',
  subComponentOf: 'DropdownMenu',
  displayName: 'Dropdown Menu Checkbox Item',
  isHiddenFromOverview: true,
  description:
    'A checkable menu item (role="menuitemcheckbox") that toggles an independent boolean. Use for on/off options inside a DropdownMenu; for a one-of-N choice use DropdownMenuRadioGroup.',
  usage: {
    anatomy,
    description:
      'An independently checkable option inside DropdownMenu. The row owns menuitemcheckbox semantics while the shared Indicator supplies decorative checkbox paint.',
  },
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Primary label text identifying the item.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Secondary description text displayed below the label.',
    },
    {
      name: 'icon',
      type: 'IconType',
      description:
        'Icon to display before the label. See `astryx docs icons` for valid semantic names.',
    },
    {
      name: 'value',
      type: 'boolean',
      description:
        'Whether the item is checked. Controlled; pair with onChange.',
    },
    {
      name: 'onChange',
      type: '(checked: boolean) => void',
      description:
        'Callback fired with the next checked state when the item is toggled.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      default: 'false',
      description:
        'Whether the item is disabled. A disabled item stays in the accessibility tree as disabled (aria-disabled), and the arrow keys and typeahead reach it so keyboard users find it. The pointer highlight skips it, and activation is blocked.',
    },
    {
      name: 'hasCloseOnSelect',
      type: 'boolean',
      default: 'false',
      description:
        'Whether toggling the item closes the menu. Checkbox items default to staying open so several can be toggled in a single session.',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLElement>',
      description:
        'Ref forwarded to the row root, the element carrying role="menuitemcheckbox". Register the row with an element-keyed observer or overlay.',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Content to render after the label and description, such as a keyboard shortcut hint or badge.',
    },
  ],
  theming: {
    targets: [
      {
        className: 'astryx-dropdown-menu-item',
        visualProps: ['size'],
      },
    ],
  },
};

export const docsZh = {
  "name": "DropdownMenuCheckboxItem",
  "isHiddenFromOverview": true,
  "displayName": "Dropdown Menu Checkbox Item",
  "description": "可勾选的菜单项（role=\"menuitemcheckbox\"），用于切换独立的布尔值。用于 DropdownMenu 内的开/关选项；若为 N 选一，请使用 DropdownMenuRadioGroup。",
  "propDescriptions": {
    "label": "标识该项的主要标签文本。",
    "description": "显示在标签下方的次要描述文本。",
    "icon": "显示在标签前的图标。有效语义名称见 `astryx docs icons`。",
    "value": "该项是否被勾选。受控；需与 onChange 搭配使用。",
    "onChange": "切换该项时触发的回调，传入下一个勾选状态。",
    "isDisabled": "该项是否禁用。禁用项仍以禁用状态（aria-disabled）保留在无障碍树中，方向键和键入搜索可以到达它，以便键盘用户找到它。指针高亮会跳过它，激活也会被阻止。",
    "hasCloseOnSelect": "切换该项是否关闭菜单。复选框项默认保持打开，以便在一次会话中切换多项。",
    "ref": "转发到行根节点的 ref，即承载 role=\"menuitemcheckbox\" 的元素。使用以元素为键的 observer 或 overlay 注册该行。",
    "endContent": "在标签和描述之后渲染的内容，例如键盘快捷键提示或 Badge。"
  },
  "usage": {
    "description": "DropdownMenu 内可独立勾选的选项。该行拥有 menuitemcheckbox 语义，而共享的 Indicator 提供装饰性的复选框绘制。",
    "anatomy": [
      {
        "name": "可勾选行",
        "required": true,
        "description": "拥有无障碍名称、勾选状态、焦点和激活行为的 menuitemcheckbox 根节点。"
      },
      {
        "name": "标签/内容",
        "required": true,
        "description": "由 Item 布局的调用方内容：必填的 label，以及可选的 description、icon 和结束内容。"
      },
      {
        "name": "复选框标记",
        "required": true,
        "description": "装饰性的共享 Indicator 外观，用于呈现勾选和禁用状态，同时不增加第二个控件。"
      }
    ]
  }
};

export const docsDense = {
  name: 'DropdownMenuCheckboxItem',
  isHiddenFromOverview: true,
  displayName: 'Dropdown Menu Checkbox Item',
  description:
    'checkable menu item (menuitemcheckbox); independent boolean toggle',
  propDescriptions: {
    label: 'primary label text',
    description: 'secondary text below label',
    icon: 'icon before label',
    value: 'checked state (controlled, w/ onChange)',
    onChange: 'fired w/ next checked state on toggle',
    isDisabled:
      'disabled (aria-disabled); reached by arrows/typeahead, focusable, inert',
    hasCloseOnSelect: 'close menu on toggle (default false, stays open)',
    ref: 'forwarded to the row root (the role="menuitemcheckbox" element)',
    endContent: 'content after label+description',
  },
};
