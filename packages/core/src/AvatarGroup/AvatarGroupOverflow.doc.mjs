// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'AvatarGroupOverflow',
  subComponentOf: 'AvatarGroup',
  displayName: 'Avatar Group Overflow',
  isHiddenFromOverview: true,
  description:
    'Overflow indicator for AvatarGroup. Shows a compact count for hidden avatars and can render custom count text or act as a button.',
  props: [
    {
      name: 'count',
      type: 'number',
      description:
        'The number of hidden avatars. Used for the default `+N` label and the accessible label.',
      required: true,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Optional custom count text rendered inside the indicator. Omit to use the default `+N` label.',
    },
    {
      name: 'onClick',
      type: '() => void',
      description:
        'Callback fired when the overflow indicator is clicked. When provided, the indicator renders as a focusable button.',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLElement>',
      description: 'Ref forwarded to the overflow indicator element.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'stylex.create() value — not an inline style object.',
    },
  ],
  playground: {
    defaults: {
      count: 2,
      children: '+2',
    },
  },
  usage: {
    description:
      'AvatarGroupOverflow appears at the end of an AvatarGroup to summarize people who are not shown individually. Use it when a group is sliced to a small number of visible avatars but the hidden count still matters.',
    bestPractices: [
      {guidance: true, description: 'Pass the real hidden count to `count` so the accessible label matches the visible indicator.'},
      {guidance: true, description: 'Use short custom text such as `+12` or `99+`. The indicator is circular for short counts and grows into a pill for wider counts so the number always fits.'},
      {guidance: true, description: 'Provide `onClick` when the overflow opens a member list, popover, or detail view.'},
      {guidance: false, description: 'Do not pass custom text that disagrees with `count`; `count` continues to provide the accessible label.'},
      {guidance: false, description: 'Do not use long labels inside the indicator; place longer participant details next to the group instead.'},
    ],
    anatomy: [
      {name: 'Count label', required: true, description: 'The compact `+N` or custom count text displayed inside the circular indicator.'},
      {name: 'Button behavior', required: false, description: 'When `onClick` is provided, the indicator becomes an interactive button with focus and hover states.'},
    ],
  },
  examples: [
    {
      label: 'Default overflow count',
      code: `
<AvatarGroup size="lg">
  {users.slice(0, 3).map(user => (
    <Avatar key={user.id} src={user.src} name={user.name} />
  ))}
  <AvatarGroupOverflow count={users.length - 3} />
</AvatarGroup>
`,
    },
    {
      label: 'Custom count text',
      code: `
<AvatarGroup size="lg">
  {users.slice(0, 3).map(user => (
    <Avatar key={user.id} src={user.src} name={user.name} />
  ))}
  <AvatarGroupOverflow count={12}>12+</AvatarGroupOverflow>
</AvatarGroup>
`,
    },
  ],
};

export const docsZh = {
  "name": "AvatarGroupOverflow",
  "isHiddenFromOverview": true,
  "displayName": "Avatar Group Overflow",
  "description": "AvatarGroup 的溢出指示器。为隐藏的头像显示紧凑计数，可渲染自定义计数字样或充当按钮。",
  "propDescriptions": {
    "count": "隐藏头像的数量。用于默认的 `+N` 标签和无障碍标签。",
    "children": "在指示器内渲染的可选自定义计数字样。省略时使用默认的 `+N` 标签。",
    "onClick": "点击溢出指示器时触发的回调。提供后，指示器渲染为可聚焦的按钮。",
    "ref": "转发到溢出指示器元素的 ref。",
    "xstyle": "`stylex.create()` 值 — 不是内联样式对象。"
  },
  "usage": {
    "description": "AvatarGroupOverflow 出现在 AvatarGroup 末尾，用于汇总未单独显示的人员。当组被裁剪为少量可见头像、但隐藏数量仍然重要时使用。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将真实的隐藏数量传给 `count`，让无障碍标签与可见指示器一致。"
      },
      {
        "guidance": true,
        "description": "使用 `+12` 或 `99+` 之类的简短自定义文本。指示器在计数较短时呈圆形，计数较长时扩展为胶囊形，因此数字总能容纳。"
      },
      {
        "guidance": true,
        "description": "当溢出内容会打开成员列表、弹出层或详情视图时，提供 `onClick`。"
      },
      {
        "guidance": false,
        "description": "不要传入与 `count` 不一致的自定义文本；`count` 仍会提供无障碍标签。"
      },
      {
        "guidance": false,
        "description": "不要在指示器内使用长标签；请将更详细的参与者信息放在组旁边。"
      }
    ],
    "anatomy": [
      {
        "name": "计数标签",
        "required": true,
        "description": "显示在圆形指示器内的紧凑 `+N` 或自定义计数字样。"
      },
      {
        "name": "按钮行为",
        "required": false,
        "description": "提供 `onClick` 后，指示器变为带焦点和悬停状态的交互式按钮。"
      }
    ]
  }
};

export const docsDense = {
  name: 'AvatarGroupOverflow',
  isHiddenFromOverview: true,
  displayName: 'Avatar Group Overflow',
  description: 'overflow indicator for AvatarGroup; default +N or custom short count text',
  propDescriptions: {
    count: 'hidden avatar count; drives default +N + aria label',
    children: 'optional custom short count text, e.g. +12 or 99+',
    onClick: 'click handler; renders focusable button when set',
    ref: 'forwarded ref',
    xstyle: 'stylex.create() value — not an inline style object',
  },
  usage: {
    description:
      'Use at end of AvatarGroup to summarize hidden people after slicing visible avatars.',
    bestPractices: [
      {guidance: true, description: 'Pass real hidden count to `count` for a11y.'},
      {guidance: true, description: 'Keep custom text short: `+12`, `99+`.'},
      {guidance: true, description: 'Use `onClick` to open member list/popover/details.'},
      {guidance: false, description: "Don't let custom text disagree with `count`; `count` still labels the indicator for accessibility."},
      {guidance: false, description: "Don't use long labels inside avatar-sized circle."},
    ],
  },
};
