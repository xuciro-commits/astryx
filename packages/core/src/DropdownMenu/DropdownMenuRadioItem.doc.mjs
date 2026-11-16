// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'DropdownMenuRadioItem',
  subComponentOf: 'DropdownMenu',
  displayName: 'Dropdown Menu Radio Item',
  isHiddenFromOverview: true,
  description:
    'A single option in a DropdownMenuRadioGroup (role="menuitemradio"). Must be used inside a DropdownMenuRadioGroup.',
  playground: {
    defaults: {
      value: 'option-1',
      label: 'Option 1',
    },
    wrapper: {
      component: 'DropdownMenuRadioGroup',
      props: {
        value: 'option-1',
        label: 'Radio group',
      },
    },
  },
  props: [
    {
      name: 'value',
      type: 'string',
      required: true,
      description:
        "The value this item represents within its group. The group's value matches against this to determine the checked state.",
    },
    {
      name: 'label',
      type: 'ReactNode',
      required: true,
      description: 'Primary label text identifying the option.',
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
      name: 'isDisabled',
      type: 'boolean',
      default: 'false',
      description:
        'Whether this individual radio item is disabled. A disabled item stays in the accessibility tree as disabled (aria-disabled), and the arrow keys and typeahead reach it so keyboard users find it. The pointer highlight skips it, and selection is blocked.',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Content to render after the label and description, such as a badge or metadata.',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLElement>',
      description:
        'Ref forwarded to the row root, the element carrying role="menuitemradio". Register the row with an element-keyed observer or overlay.',
    },
  ],
};

export const docsZh = {
  "name": "DropdownMenuRadioItem",
  "isHiddenFromOverview": true,
  "displayName": "Dropdown Menu Radio Item",
  "description": "DropdownMenuRadioGroup 中的单个选项（role=\"menuitemradio\"）。必须在 DropdownMenuRadioGroup 内使用。",
  "propDescriptions": {
    "value": "此选项在其组内代表的值。组的值与它匹配以确定选中状态。",
    "label": "标识该选项的主标签文本。",
    "description": "显示在标签下方的辅助描述文本。",
    "icon": "显示在标签前的图标。有效语义名称见 `astryx docs icons`。",
    "isDisabled": "是否禁用此单选选项。禁用项仍以禁用状态（aria-disabled）保留在无障碍树中，方向键和输入预选可达，因此键盘用户能找到它。指针高亮会跳过它，选择会被阻止。",
    "endContent": "在标签和描述之后渲染的内容，例如徽标或元数据。",
    "ref": "转发到行根元素的 ref，即承载 role=\"menuitemradio\" 的元素。可使用以元素为键的观察器或覆盖层注册该行。"
  }
};

export const docsDense = {
  name: 'DropdownMenuRadioItem',
  isHiddenFromOverview: true,
  displayName: 'Dropdown Menu Radio Item',
  description: 'one option in a DropdownMenuRadioGroup (menuitemradio)',
  propDescriptions: {
    value: "item's value within the group (matched vs group value)",
    label: 'primary label text',
    description: 'secondary text below label',
    icon: 'icon before label',
    isDisabled:
      'disabled (aria-disabled); reached by arrows/typeahead, focusable, inert',
    endContent: 'content after label+description',
    ref: 'forwarded to the row root (the role="menuitemradio" element)',
  },
};
