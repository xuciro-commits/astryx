// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'SideNav',
  displayName: 'Side Nav',
  group: 'Navigation',
  category: 'Navigation',
  keywords: ["sidenav","sidebar","navigation","drawer","menu","nav","aside","sidemenu","navmenu","sider","treeview"],
  playground: {
    defaults: {
      children: [
        {__element: 'SideNavItem', props: {label: 'Dashboard', isSelected: true}},
        {__element: 'SideNavItem', props: {label: 'Projects'}},
        {__element: 'SideNavItem', props: {label: 'Settings'}},
      ],
    },
  },
  theming: {
    targets: [
      {className: 'astryx-side-nav', visualProps: ['mode']},
      {className: 'astryx-side-nav-heading'},
      {className: 'astryx-side-nav-item', visualProps: ['size'], states: ['selected', 'disabled']},
      {className: 'astryx-side-nav-section'},
    ],
  },
  description: 'Container with five zones: header, topContent, children (scrollable), footer, and footerIcons. Supports collapsible and resizable modes.',
  props: [
    {
      name: 'header',
      type: 'ReactNode',
      description: 'Header area (typically SideNavHeading). Sticky.',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Header',
        },
      ],
    },
    {
      name: 'topContent',
      type: 'ReactNode',
      description: 'Content below the header, e.g., a create button.',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Top content',
        },
      ],
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Navigation sections and items. Scrollable.',
      slotElements: [
        {
          __element: 'SideNavItem',
          props: {
            label: 'Nav Item',
          },
        },
      ],
    },
    {
      name: 'footer',
      type: 'ReactNode',
      description: 'Footer area above the icon bar.',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Footer content',
        },
      ],
    },
    {
      name: 'footerIcons',
      type: 'ReactNode',
      description: "Footer icon bar. The row cascades a 'sm' size to the interactive children it contains, so its icons and the built-in collapse button come out one height; pass an explicit size on a child to opt out.",
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
      name: 'collapsible',
      type: 'boolean | { defaultIsCollapsed?: boolean; isCollapsed?: boolean; onCollapsedChange?: (isCollapsed: boolean) => void; hasButton?: boolean; buttonLabel?: string }',
      description: 'Enables collapse behavior. true for uncontrolled with default toggle button, or an object for controlled mode and advanced config (defaultIsCollapsed, isCollapsed + onCollapsedChange, hasButton, buttonLabel). A controlled config can also be passed to a SideNavCollapseButton rendered outside this SideNav, so both share one state.',
      default: 'false',
    },
    {
      name: 'resizable',
      type: 'boolean | { defaultWidth?: number; minWidth?: number; maxWidth?: number; autoSaveId?: string; onWidthChange?: (width: number) => void; defaultIsCollapsed?: boolean; isCollapsed?: boolean; onCollapseChange?: (isCollapsed: boolean) => void } | ResizableRegion',
      description: 'Enables a resize handle at the inline-end edge. true for defaults (260px initial, 180-480px range), or a ResizableConfig object (defaultWidth, minWidth, maxWidth, autoSaveId for localStorage persistence of width and collapse state, onWidthChange). It can also own collapse state (defaultIsCollapsed, isCollapsed + onCollapseChange); when both props carry collapse state, resizable wins and a dev warning names the conflicting keys. It also takes the output of useResizable(), whose axis (\'horizontal\' | \'vertical\') must be \'horizontal\': that region then owns the width and the collapse state, so the rail follows its isCollapsed, the toggle calls its collapse and expand, and its autoSaveId saves the width. With the hook\'s output, the region\'s own collapsible option also decides whether the rail collapses; a collapsible prop that disagrees, or the collapse state it sets, is ignored, with a dev warning. The handle is hidden while collapsed.',
      default: 'false',
    },
    {
      name: 'handleRef',
      type: 'Ref<SideNavImperativeCollapseHandle>',
      description: 'Deprecated. Imperative collapse handle for SideNavCollapseButton instances rendered outside this SideNav; hand both the same controlled collapsible config instead. Separate from `ref`, which continues to expose the root HTMLElement.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
  ],
  components: [
    {name: 'SideNavHeading'},
    {name: 'SideNavItem'},
    {name: 'SideNavSection'},
    {name: 'SideNavCollapseButton'},
  ],
  usage: {
    description:
      'A sidebar navigation component for organizing application pages with sections, nested items, and icons. Use SideNav as the primary navigation when an app has 5 or more destinations or requires hierarchical grouping.',
    bestPractices: [
      {guidance: true, description: 'Use sections to group related navigation items and help users scan for their destination.'},
      {guidance: true, description: 'Pair outline and filled icon variants so the selected state is visually distinct.'},
      {guidance: true, description: 'Mark the current page with isSelected: it sets aria-current="page", so the current destination is announced rather than carried by color alone.'},
      {guidance: true, description: 'SideNav renders a navigation landmark, and a collapsible item follows the WAI-ARIA APG Disclosure pattern (https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/): the toggle carries aria-expanded and aria-controls, and the group it owns is inert while collapsed. Keep item labels short; they name icon-only items unless a meaningful aria-label supplies more context.'},
      {guidance: true, description: 'While the nav is collapsed, an item with children shows them in a submenu flyout. On a device that can hover, pointing at the item opens it after a short delay and moving away closes it; a flyout opened by clicking stays open until it is dismissed. On touch, it opens on tap. Do not put an action in there that has no other route to it.'},
      {guidance: false, description: 'Include a SideNavHeading when a TopNav is already providing app identity; this duplicates branding.'},
      {guidance: false, description: 'Use for filtering content; use tabs or filter buttons instead.'},
    ],
    anatomy: [
      {name: 'Product icon and name', required: false, description: 'Branding area at the top of the nav.'},
      {name: 'Navigation items', required: true, description: 'Sections and groups of navigable links.'},
      {name: 'Collapse/expand toggle', required: false, description: 'Toggle to collapse or expand the side nav.'},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "用于通过分区、嵌套项和图标组织应用页面的侧边栏导航组件。当应用有 5 个或更多目的地，或需要层级分组时，将 SideNav 用作主导航。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "使用分区将相关导航项分组，帮助用户快速找到目标。"
      },
      {
        "guidance": true,
        "description": "搭配使用轮廓和实心图标变体，使选中状态在视觉上清晰可辨。"
      },
      {
        "guidance": true,
        "description": "用 isSelected 标记当前页面：它会设置 aria-current=\"page\"，因此当前目的地会被朗读，而不是仅靠颜色传达。"
      },
      {
        "guidance": true,
        "description": "SideNav 渲染导航地标，可折叠项遵循 WAI-ARIA APG Disclosure 模式（https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/）：切换按钮带有 aria-expanded 和 aria-controls，其拥有的分组在折叠时为 inert。保持项标签简短；它们为纯图标项提供名称，除非有意义的 aria-label 提供更多上下文。"
      },
      {
        "guidance": true,
        "description": "导航折叠时，含子项的项会在子菜单浮层中显示子项。在支持悬停的设备上，指向该项会在短暂延迟后打开，移开即关闭；通过点击打开的浮层会保持打开，直到被关闭。在触控设备上，点击即打开。不要在其中放置没有其他访问途径的操作。"
      },
      {
        "guidance": false,
        "description": "当 TopNav 已提供应用标识时，不要再包含 SideNavHeading；这会重复品牌信息。"
      },
      {
        "guidance": false,
        "description": "不要用于筛选内容；请改用标签页或筛选按钮。"
      }
    ],
    "anatomy": [
      {
        "name": "产品图标和名称",
        "required": false,
        "description": "导航顶部的品牌区域。"
      },
      {
        "name": "导航项",
        "required": true,
        "description": "可导航链接的分区和分组。"
      },
      {
        "name": "折叠/展开切换按钮",
        "required": false,
        "description": "用于折叠或展开侧边导航的切换按钮。"
      }
    ]
  },
  "name": "SideNav",
  "displayName": "Side Nav",
  "description": "包含五个区域的容器：header、topContent、children（可滚动）、footer 和 footerIcons。支持可折叠和可调整大小的模式。",
  "propDescriptions": {
    "header": "头部区域（通常是 SideNavHeading）。固定显示。",
    "topContent": "头部下方的内容，例如创建按钮。",
    "children": "导航分区和项目。可滚动。",
    "footer": "图标栏上方的页脚区域。",
    "footerIcons": "页脚图标栏。该行会向其中的可交互子元素级联 'sm' 尺寸，因此其图标和内置折叠按钮高度一致；在子元素上传入显式尺寸可退出该级联。",
    "collapsible": "启用折叠行为。true 表示非受控并使用默认切换按钮；对象表示受控模式和高级配置（defaultIsCollapsed、isCollapsed + onCollapsedChange、hasButton、buttonLabel）。也可将受控配置传给渲染在此 SideNav 之外的 SideNavCollapseButton，使两者共享同一状态。",
    "resizable": "在行内结束边启用调整大小手柄。true 表示默认值（初始 260px，范围 180-480px），或传入 ResizableConfig 对象（defaultWidth、minWidth、maxWidth、autoSaveId 用于将宽度和折叠状态持久化到 localStorage、onWidthChange）。它也可以拥有折叠状态（defaultIsCollapsed、isCollapsed + onCollapseChange）；当两个属性都携带折叠状态时，resizable 优先，开发警告会指出冲突的键。它还接受 useResizable() 的输出，其 axis（'horizontal' | 'vertical'）必须为 'horizontal'：此时该区域拥有宽度和折叠状态，轨道跟随其 isCollapsed，切换按钮调用其 collapse 和 expand，其 autoSaveId 保存宽度。使用该 Hook 的输出时，区域自身的 collapsible 选项也决定轨道是否折叠；与之不一致的 collapsible 属性或其设置的折叠状态会被忽略，并给出开发警告。折叠时手柄会隐藏。",
    "handleRef": "已废弃。用于渲染在此 SideNav 之外的 SideNavCollapseButton 实例的命令式折叠句柄；请改为向两者传入相同的受控 collapsible 配置。与 `ref` 分开，`ref` 仍会暴露根 HTMLElement。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值：不能是 style={{}} 这样的内联样式对象。"
  },
  "components": [
    {
      "name": "SideNavHeading",
      "description": ""
    },
    {
      "name": "SideNavItem",
      "description": ""
    },
    {
      "name": "SideNavSection",
      "description": ""
    },
    {
      "name": "SideNavCollapseButton",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  usage: {
    description:
      'A sidebar navigation component for organizing application pages with sections, nested items, and icons. Use SideNav as the primary navigation when an app has 5 or more destinations or requires hierarchical grouping.',
    bestPractices: [
      {guidance: true, description: 'Use sections to group related navigation items and help users scan for their destination.'},
      {guidance: true, description: 'Pair outline and filled icon variants so the selected state is visually distinct.'},
      {guidance: true, description: 'Mark the current page with isSelected: it sets aria-current="page", so the current destination is announced rather than carried by color alone.'},
      {guidance: true, description: 'SideNav renders a navigation landmark, and a collapsible item follows the WAI-ARIA APG Disclosure pattern (https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/): the toggle carries aria-expanded and aria-controls, and the group it owns is inert while collapsed. Keep item labels short; they name icon-only items unless a meaningful aria-label supplies more context.'},
      {guidance: true, description: 'While the nav is collapsed, an item with children shows them in a submenu flyout. On a device that can hover, pointing at the item opens it after a short delay and moving away closes it; a flyout opened by clicking stays open until it is dismissed. On touch, it opens on tap. Do not put an action in there that has no other route to it.'},
      {guidance: false, description: 'Include a SideNavHeading when a TopNav is already providing app identity; this duplicates branding.'},
      {guidance: false, description: 'Use for filtering content; use tabs or filter buttons instead.'},
    ],
    anatomy: [
      {name: 'Product icon and name', required: false, description: 'Branding area at the top of the nav.'},
      {name: 'Navigation items', required: true, description: 'Sections and groups of navigable links.'},
      {name: 'Collapse/expand toggle', required: false, description: 'Toggle to collapse or expand the side nav.'},
    ],
  },
};
