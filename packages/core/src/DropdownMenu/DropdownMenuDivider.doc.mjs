// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'DropdownMenuDivider',
  subComponentOf: 'DropdownMenu',
  displayName: 'Dropdown Menu Divider',
  isHiddenFromOverview: true,
  description:
    'A horizontal rule separating groups of rows in a compound menu. Renders role="separator", so it is never a stop in the arrow-key order. The data-driven equivalent is the `{type: "divider"}` entry in `items`; both modes render this component, so they look and theme identically. Host attributes and DOM handlers (id, data-*, aria-*) reach the separator; its role and orientation stay component-owned.',
  props: [
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles applied after the menu spacing. Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
  ],
  theming: {
    targets: [{className: 'astryx-dropdown-menu-divider'}],
  },
};

export const docsDense = {
  name: 'DropdownMenuDivider',
  isHiddenFromOverview: true,
  displayName: 'Dropdown Menu Divider',
  description:
    'separator row for compound menus; compound peer of the data API\'s {type: "divider"}; host attributes reach the separator, role/orientation stay owned',
  propDescriptions: {
    xstyle: 'StyleX styles applied after the menu spacing',
  },
};

export const docsZh = {
  "name": "DropdownMenuDivider",
  "displayName": "Dropdown Menu Divider",
  "description": "复合菜单中用于分隔行组的水平分隔线。渲染为 role=\"separator\"，因此永远不会成为方向键顺序中的停靠点。数据驱动模式的等价写法是 `items` 中的 `{type: \"divider\"}` 条目；两种模式渲染的都是此组件，因此外观和主题表现完全一致。宿主属性与 DOM 处理函数（id、data-*、aria-*）会传到该分隔线；其 role 和方向由组件自身掌控。",
  "propDescriptions": {
    "xstyle": "在菜单间距之后应用的 StyleX 样式。必须是 `stylex.create()` 的值：不能是 `style={{}}` 这样的内联样式对象。"
  }
};
