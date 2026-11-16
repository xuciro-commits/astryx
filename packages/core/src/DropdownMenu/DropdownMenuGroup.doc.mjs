// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'DropdownMenuGroup',
  subComponentOf: 'DropdownMenu',
  displayName: 'Dropdown Menu Group',
  isHiddenFromOverview: true,
  playground: {
    // A standalone group has no required props, so the properties-tab preview
    // would render an empty box. Seed a title so the heading shows.
    defaults: {title: 'Version history'},
  },
  description:
    'A group of rows in a compound menu. A visible title names role="group" through aria-labelledby; an omitted title leaves the group unnamed. The heading is not a menuitem, so arrow keys and typeahead skip it. Keep title content non-interactive and place controls in DropdownMenu header or footer. The data-driven equivalent is the `{type: "section", title, items}` entry in `items`; both forms share the heading treatment and theme target. Host attributes and DOM handlers (id, data-*, aria-*) reach the group element; its role, and its name while it has a title, stay component-owned.',
  usage: {
    description:
      'Use DropdownMenuGroup to give related compound-menu rows one visible and programmatic name. Use an untitled group only when a separate name would not help people understand the rows.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use short, descriptive title content that explains what the grouped rows have in common.',
      },
      {
        guidance: true,
        description:
          'Keep the title non-interactive so every available action remains in the menu arrow-key order.',
      },
      {
        guidance: false,
        description:
          'Place buttons, links, fields, or other controls in title. Put them in DropdownMenu header or footer instead.',
      },
      {
        guidance: false,
        description:
          'Wrap rows that do not form a meaningful set; a group adds structure only when its relationship helps users.',
      },
    ],
    anatomy: [
      {
        name: 'Group',
        required: true,
        description:
          'The role="group" wrapper containing the heading and menu rows.',
      },
      {
        name: 'Heading',
        required: false,
        description:
          'Visible non-interactive title content that names the group and carries the dropdown-menu-section-heading theme target.',
      },
      {
        name: 'Rows',
        required: false,
        description:
          'Menu items, selectable items, radio groups, or submenus owned by DropdownMenu.',
      },
    ],
  },
  props: [
    {
      name: 'title',
      type: 'ReactNode',
      description:
        "Non-interactive heading content shown above the rows and used as the group's accessible name. Omit for an unnamed group; place controls in DropdownMenu header or footer.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'The grouped rows: DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, or DropdownMenuSubMenu.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles applied to the role="group" wrapper. Must be a stylex.create() value, not an inline style object.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'CSS class name applied to the role="group" wrapper.',
    },
    {
      name: 'style',
      type: 'React.CSSProperties',
      description: 'Inline styles applied to the role="group" wrapper.',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLDivElement>',
      description: 'Ref forwarded to the role="group" wrapper.',
    },
  ],
  theming: {
    targets: [{className: 'astryx-dropdown-menu-section-heading'}],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "DropdownMenuGroup",
  "subComponentOf": "DropdownMenu",
  "displayName": "Dropdown Menu Group",
  "isHiddenFromOverview": true,
  "description": "复合菜单中的一组行。可见的 title 通过 aria-labelledby 命名 role=\"group\"；省略 title 则分组无名称。标题不是 menuitem，因此方向键和类型搜索会跳过它。保持 title 内容非交互，将控件放在 DropdownMenu 的 header 或 footer 中。数据驱动形式是 items 中的 `{type: \"section\", title, items}` 条目；两种形式共享标题处理和主题目标。宿主属性与 DOM 处理函数（id、data-*、aria-*）会到达分组元素；其角色以及有标题时的名称仍由组件拥有。",
  "usage": {
    "description": "使用 DropdownMenuGroup 为相关的复合菜单行提供一个可见且可编程的名称。仅当单独的名称无助于用户理解这些行时，才使用无标题分组。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "使用简短、描述性的标题内容，说明分组行之间的共同点。"
      },
      {
        "guidance": true,
        "description": "保持标题非交互，使每个可用操作都保留在菜单的方向键顺序中。"
      },
      {
        "guidance": false,
        "description": "不要在 title 中放置按钮、链接、字段或其他控件。请将它们放在 DropdownMenu 的 header 或 footer 中。"
      },
      {
        "guidance": false,
        "description": "不要包裹不构成有意义集合的行；只有当分组关系对用户有帮助时，分组才增加结构。"
      }
    ],
    "anatomy": [
      {
        "name": "分组",
        "required": true,
        "description": "包含标题和菜单行的 role=\"group\" 包装元素。"
      },
      {
        "name": "标题",
        "required": false,
        "description": "可见的非交互标题内容，用于命名分组并带有 dropdown-menu-section-heading 主题目标。"
      },
      {
        "name": "行",
        "required": false,
        "description": "由 DropdownMenu 拥有的菜单项、可选择项、单选组或子菜单。"
      }
    ]
  },
  "props": [
    {
      "name": "title",
      "type": "ReactNode",
      "description": "显示在行上方的非交互标题内容，并用作分组的无障碍名称。省略则为无名称分组；请将控件放在 DropdownMenu 的 header 或 footer 中。"
    },
    {
      "name": "children",
      "type": "ReactNode",
      "description": "分组的行：DropdownMenuItem、DropdownMenuCheckboxItem、DropdownMenuRadioGroup 或 DropdownMenuSubMenu。"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "应用于 role=\"group\" 包装元素的 StyleX 样式。必须是 stylex.create() 值，而不是内联样式对象。"
    },
    {
      "name": "className",
      "type": "string",
      "description": "应用于 role=\"group\" 包装元素的 CSS 类名。"
    },
    {
      "name": "style",
      "type": "React.CSSProperties",
      "description": "应用于 role=\"group\" 包装元素的内联样式。"
    },
    {
      "name": "ref",
      "type": "React.Ref<HTMLDivElement>",
      "description": "转发到 role=\"group\" 包装元素的 ref。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-dropdown-menu-section-heading"
      }
    ]
  },
  "propDescriptions": {
    "title": "显示在行上方的非交互标题内容，并用作分组的无障碍名称。省略则为无名称分组；请将控件放在 DropdownMenu 的 header 或 footer 中。",
    "children": "分组的行：DropdownMenuItem、DropdownMenuCheckboxItem、DropdownMenuRadioGroup 或 DropdownMenuSubMenu。",
    "xstyle": "应用于 role=\"group\" 包装元素的 StyleX 样式。必须是 stylex.create() 值，而不是内联样式对象。",
    "className": "应用于 role=\"group\" 包装元素的 CSS 类名。",
    "style": "应用于 role=\"group\" 包装元素的内联样式。",
    "ref": "转发到 role=\"group\" 包装元素的 ref。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'named role="group" of compound-menu rows; compound peer of the data API\'s {type: "section"}',
  usage: {
    description:
      'Use to give related compound-menu rows one visible and programmatic name.',
    bestPractices: [
      {
        guidance: true,
        description: "Short title that explains the rows' relationship.",
      },
      {
        guidance: true,
        description:
          'Non-interactive title keeps every action in menu arrow navigation.',
      },
      {
        guidance: false,
        description:
          'Controls in title. Put them in DropdownMenu header or footer instead.',
      },
      {guidance: false, description: 'Group unrelated rows.'},
    ],
  },
  propDescriptions: {
    title: 'non-interactive heading above the rows; names the group',
    children: 'the grouped menu rows',
    xstyle: 'StyleX styles on the role="group" wrapper',
    className: 'CSS class on the role="group" wrapper',
    style: 'inline styles on the role="group" wrapper',
    ref: 'ref forwarded to the role="group" wrapper',
  },
};
