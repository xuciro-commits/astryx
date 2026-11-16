// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'SideNavCollapseButton',
  subComponentOf: 'SideNav',
  displayName: 'Side Nav Collapse Button',
  isHiddenFromOverview: true,
  description: 'Toggle button for sidenav collapse. Place inside SideNav (reads context automatically) or outside it (hand the same controlled collapsible config to both). Renders as an icon-only ghost button by default.',
  playground: {
    defaults: {
      collapsible: {
        isCollapsed: false,
        onCollapsedChange: undefined,
      },
    },
  },
  props: [
    {
      name: 'collapsible',
      type: '{isCollapsed: boolean, onCollapsedChange: (isCollapsed: boolean) => void, defaultIsCollapsed?: boolean, hasButton?: boolean, buttonLabel?: string}',
      description: 'The same controlled collapsible config passed to SideNav, with all its keys. Only needed when the button is rendered outside the sidenav, where collapse context cannot reach it.',
    },
    {
      name: 'handleRef',
      type: 'RefObject<SideNavImperativeCollapseHandle | null>',
      description: 'Deprecated. Imperative collapse handle from SideNav; pass collapsible instead.',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Custom button label. When provided, renders as a text button with chevron. When omitted, renders icon-only.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: "Button size. Defaults to the size its container cascades ('sm' inside a SideNav footer) and to 'md' with no container. Set it when the button sits outside a sized container and has to match its neighbours.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Custom button content. Overrides the default chevron icon and label.',
    },
  ],
};

export const docsZh = {
  "name": "SideNavCollapseButton",
  "isHiddenFromOverview": true,
  "displayName": "Side Nav Collapse Button",
  "description": "用于侧边导航折叠的切换按钮。可放在 SideNav 内（自动读取 context），也可放在其外（向两者传入相同的受控 collapsible 配置）。默认渲染为纯图标幽灵按钮。",
  "props": [
    {
      "name": "collapsible",
      "type": "{isCollapsed: boolean, onCollapsedChange: (isCollapsed: boolean) => void, defaultIsCollapsed?: boolean, hasButton?: boolean, buttonLabel?: string}",
      "description": "传给 SideNav 的同一个受控 collapsible 配置，包含其全部键。仅在按钮渲染于侧边导航之外、折叠 context 无法触达它时才需要。"
    },
    {
      "name": "handleRef",
      "type": "RefObject<SideNavImperativeCollapseHandle | null>",
      "description": "已废弃。来自 SideNav 的命令式折叠句柄；请改用 collapsible。"
    },
    {
      "name": "label",
      "type": "string",
      "description": "自定义按钮标签。提供时渲染为带箭头的文本按钮；省略时渲染为纯图标按钮。"
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "description": "按钮尺寸。默认使用容器级联的尺寸（SideNav 页脚内为 'sm'），无容器时为 'md'。当按钮位于有尺寸的容器之外且需要与相邻元素匹配时，请显式设置。"
    },
    {
      "name": "children",
      "type": "ReactNode",
      "description": "自定义按钮内容。覆盖默认的箭头图标和标签。"
    }
  ],
  "propDescriptions": {
    "collapsible": "传给 SideNav 的同一个受控 collapsible 配置，包含其全部键。仅在按钮渲染于侧边导航之外、折叠 context 无法触达它时才需要。",
    "handleRef": "已废弃。来自 SideNav 的命令式折叠句柄；请改用 collapsible。",
    "label": "自定义按钮标签。提供时渲染为带箭头的文本按钮；省略时渲染为纯图标按钮。",
    "size": "按钮尺寸。默认使用容器级联的尺寸（SideNav 页脚内为 'sm'），无容器时为 'md'。当按钮位于有尺寸的容器之外且需要与相邻元素匹配时，请显式设置。",
    "children": "自定义按钮内容。覆盖默认的箭头图标和标签。"
  }
};

export const docsDense = {
  name: 'SideNavCollapseButton',
  isHiddenFromOverview: true,
  displayName: 'Side Nav Collapse Button',
  description: 'Toggle button for sidenav collapse. Place inside SideNav (reads context) or outside (pass the same controlled collapsible config both get). Icon-only ghost button by default.',
  propDescriptions: {
    collapsible: 'Controlled collapsible config, same object SideNav gets, all keys allowed. Only needed when button rendered outside sidenav.',
    handleRef: 'Deprecated. Pass collapsible instead.',
    label: 'Custom label. Text button w/ chevron when provided, icon-only when omitted.',
    size: "Button size. Inherits from the container ('sm' in a SideNav footer), else 'md'.",
    children: 'Custom content. Overrides default chevron icon + label.',
  },
};
