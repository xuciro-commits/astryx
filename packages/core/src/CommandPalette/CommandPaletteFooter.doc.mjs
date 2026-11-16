// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'CommandPaletteFooter',
  subComponentOf: 'CommandPalette',
  displayName: 'Command Palette Footer',
  isHiddenFromOverview: true,
  description:
    'Footer with keyboard guidance. CommandPalette renders the default arrow, Enter, and Escape hints automatically.',
  usage: {
    description:
      'CommandPalette renders CommandPaletteFooter automatically. Pass a CommandPaletteFooter to the footer slot only when replacing the default guidance.',
    anatomy: [
      {
        name: 'Footer',
        required: true,
        description:
          'Supporting region that presents default guidance or caller-provided footer content.',
      },
      {
        name: 'Keyboard shortcut',
        required: false,
        description:
          'Default Kbd badges for navigation, selection, and dismissal.',
      },
    ],
  },
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Custom footer content. When omitted, renders default keyboard hints via Kbd.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization. Must be a stylex.create() value.',
    },
  ],
  theming: {
    targets: [{className: 'astryx-command-palette-footer'}],
  },
};

export const docsZh = {
  "name": "CommandPaletteFooter",
  "isHiddenFromOverview": true,
  "displayName": "Command Palette Footer",
  "description": "带键盘操作指引的页脚。CommandPalette 会自动渲染默认的方向键、Enter 和 Escape 提示。",
  "propDescriptions": {
    "children": "自定义页脚内容。省略时，通过 Kbd 渲染默认键盘提示。",
    "xstyle": "用于布局自定义的 StyleX 样式。必须是 stylex.create() 的值。"
  },
  "usage": {
    "description": "CommandPalette 会自动渲染 CommandPaletteFooter。只有在需要替换默认指引时，才向 footer 插槽传入 CommandPaletteFooter。",
    "anatomy": [
      {
        "name": "页脚",
        "required": true,
        "description": "呈现默认指引或调用方提供的页脚内容的辅助区域。"
      },
      {
        "name": "键盘快捷键",
        "required": false,
        "description": "用于导航、选择和关闭的默认 Kbd 徽标。"
      }
    ]
  }
};

export const docsDense = {
  name: 'CommandPaletteFooter',
  isHiddenFromOverview: true,
  displayName: 'Command Palette Footer',
  description: 'footer w/ kbd hints; default=arrow/Enter/Escape hints via Kbd',
  propDescriptions: {
    children: 'custom content; default renders kbd hints',
    xstyle: 'StyleX layout styles; must be stylex.create() value',
  },
};
