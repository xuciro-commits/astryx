// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Navigation overlay',
    required: true,
    description:
      'Full-viewport dialog overlay that hosts the mobile navigation drawer.',
  },
  {
    name: 'Drawer',
    required: true,
    description:
      'Painted panel that slides in from the resolved viewport edge.',
  },
  {
    name: 'Header',
    required: true,
    description:
      'Fixed row containing optional header content and the close button.',
  },
  {
    name: 'Content',
    required: true,
    description: 'Scrollable region containing the navigation content.',
  },
  {
    name: 'Close button',
    required: true,
    description: 'Button that closes the navigation drawer.',
  },
  {
    name: 'Toggle button',
    required: false,
    description:
      'AppShell-aware Button that opens or closes the drawer on mobile viewports.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'MobileNav',
  displayName: 'Mobile Nav',
  group: 'Navigation',
  category: 'Navigation',
  isHiddenFromOverview: true,
  keywords: [
    'mobilenav',
    'drawer',
    'sidebar',
    'navigation',
    'hamburger',
    'menu',
    'offcanvas',
    'slideout',
    'navdrawer',
    'toggle',
  ],
  components: [
    {
      name: 'MobileNav',
      displayName: 'Mobile Nav',
      description:
        'A slide-out drawer for mobile navigation. Accepts SideNav children.',
      // The drawer opens via showModal() and renders nothing while closed —
      // overlay mode gives the Properties preview an open trigger instead of
      // an empty stage (#2706). Declared on this entry (not the directory
      // doc) so MobileNavToggle does not inherit it.
      playground: {
        overlay: true,
        defaults: {
          isOpen: false,
          header: 'Navigation',
          children: {
            __element: 'SideNavSection',
            props: {title: 'Main'},
            children: [
              {
                __element: 'SideNavItem',
                props: {label: 'Dashboard', isSelected: true},
              },
              {__element: 'SideNavItem', props: {label: 'Projects'}},
              {__element: 'SideNavItem', props: {label: 'Settings'}},
            ],
          },
        },
      },
      props: [
        {
          name: 'isOpen',
          type: 'boolean',
          description:
            'Whether the drawer is open. Inside AppShell, this is managed automatically via context. Outside AppShell, provide this prop to control the drawer yourself.',
        },
        {
          name: 'onOpenChange',
          type: '(isOpen: boolean) => void',
          description:
            'Called when the drawer visibility changes (backdrop click, Escape key, or close button). Inside AppShell, this is managed automatically via context. On a phone or tablet (a coarse primary pointer), the drawer takes no tap or drag while it slides in; keys and assistive technology still act. After a close, focus returns to the element that opened it once its dialog closes.',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description:
            'Drawer content: typically SideNavSection/SideNavItem, or any ReactNode.',
          required: true,
        },
        {
          name: 'header',
          type: 'ReactNode',
          description:
            'Header content for the drawer. Rendered next to the close button. Pass a string for a simple text heading, or a ReactNode for custom content (logo, search bar, etc.).',
        },
        {
          name: 'width',
          type: 'number',
          description:
            'Drawer width in pixels. Capped at 85vw to prevent overflow on small screens.',
          default: '320',
        },
        {
          name: 'side',
          type: "'start' | 'end' | 'auto'",
          description:
            'Which side the drawer slides from. Start is left in LTR, right in RTL. Auto picks a side based on the trigger position.',
          default: "'auto'",
        },
      ],
    },
    {
      name: 'MobileNavToggle',
      displayName: 'Mobile Nav Toggle',
      description:
        'Hamburger button that opens/closes the mobile nav drawer. Reads open state from AppShell context automatically: does NOT accept isOpen or onOpenChange props. Renders nothing above the mobile breakpoint. Host attributes and DOM handlers (id, data-*, aria-*) reach the button; its aria-expanded and aria-controls stay component-owned, and a caller onClick runs after the toggle.',
      // The toggle renders null unless AppShell mobile context reports an
      // enabled mobile viewport — the default context outside AppShell never
      // does, so the Properties preview was an empty stage. appShellMobile
      // has the preview simulate that context instead (#4983).
      playground: {
        appShellMobile: true,
      },
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description:
            'Custom content to render instead of the default hamburger icon.',
        },
        {
          name: 'label',
          type: 'string',
          description: 'Accessible label for the toggle button.',
          default: "'Open navigation'",
        },
      ],
    },
  ],
  theming: {
    targets: [{className: 'astryx-mobile-nav', visualProps: ['side']}],
  },
  usage: {
    anatomy,
    description:
      'A slide-out drawer for mobile navigation. MobileNav is the mobile counterpart to SideNav and accepts the same children. Use it on narrow viewports where a persistent sidebar is not practical. Inside AppShell, use MobileNavToggle as the trigger; it reads state from context automatically.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Share the same nav items between MobileNav and SideNav by extracting them into a variable.',
      },
      {
        guidance: true,
        description:
          "Provide a header when the drawer's purpose is not obvious from its content.",
      },
      {
        guidance: true,
        description:
          'Inside AppShell, use MobileNavToggle to open the drawer; it reads state from context. Do not pass isOpen/onOpenChange to the toggle.',
      },
      {
        guidance: false,
        description:
          'Use MobileNav on desktop: use a persistent SideNav instead.',
      },
    ],
  },
};
/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "MobileNav",
  "displayName": "Mobile Nav",
  "props": [
    {
      "name": "isOpen",
      "type": "boolean",
      "description": "抽屉是否打开。",
      "required": true
    },
    {
      "name": "onOpenChange",
      "type": "(isOpen: boolean) => void",
      "description": "当抽屉可见性变化时调用（点击背景遮罩、按 Escape 键或点击关闭按钮）。在手机或平板上（主指针为粗指针时），抽屉滑入期间不接受点按或拖动；键盘和辅助技术仍可操作。关闭后，焦点会在对话框关闭时回到打开它的元素。",
      "required": true
    },
    {
      "name": "children",
      "type": "ReactNode",
      "description": "抽屉内容，通常是 SideNavSection/SideNavItem 或任何 ReactNode。",
      "required": true
    },
    {
      "name": "header",
      "type": "ReactNode",
      "description": "抽屉的头部内容。渲染在关闭按钮旁边。传入字符串作为简单文本标题，或传入 ReactNode 作为自定义内容。"
    },
    {
      "name": "width",
      "type": "number",
      "description": "抽屉宽度（像素）。上限为 85vw 以防止在小屏幕上溢出。",
      "default": "320"
    },
    {
      "name": "side",
      "type": "'start' | 'end' | 'auto'",
      "description": "抽屉滑出的方向。在 LTR 布局中 start 为左侧，在 RTL 布局中为右侧。auto 根据触发元素的位置自动选择方向。",
      "default": "'auto'"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-mobile-nav",
        "visualProps": [
          "side"
        ]
      }
    ]
  },
  "usage": {
    "anatomy": [
      {
        "name": "导航浮层",
        "required": true,
        "description": "承载移动端导航抽屉的全视口对话框浮层。"
      },
      {
        "name": "抽屉",
        "required": true,
        "description": "从解析后的视口边缘滑入的绘制面板。"
      },
      {
        "name": "页眉",
        "required": true,
        "description": "包含可选页眉内容和关闭按钮的固定行。"
      },
      {
        "name": "内容",
        "required": true,
        "description": "包含导航内容的可滚动区域。"
      },
      {
        "name": "关闭按钮",
        "required": true,
        "description": "关闭导航抽屉的按钮。"
      },
      {
        "name": "切换按钮",
        "required": false,
        "description": "感知 AppShell 的 Button，在移动端视口打开或关闭抽屉。"
      }
    ],
    "description": "移动端导航的滑出式抽屉。MobileNav 是 SideNav 的移动端对应组件，接受相同的子元素。在持久侧边栏不实用的窄视口上使用它。在 AppShell 内，请使用 MobileNavToggle 作为触发器；它会自动从上下文读取状态。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "通过将导航项提取为变量，在 MobileNav 和 SideNav 之间共享同一组导航项。"
      },
      {
        "guidance": true,
        "description": "当抽屉的用途无法从内容中明显看出时，请提供页眉。"
      },
      {
        "guidance": true,
        "description": "在 AppShell 内，请使用 MobileNavToggle 打开抽屉；它会从上下文读取状态。不要向该切换按钮传递 isOpen/onOpenChange。"
      },
      {
        "guidance": false,
        "description": "不要在桌面端使用 MobileNav：请改用持久 SideNav。"
      }
    ]
  },
  "components": [
    {
      "name": "MobileNav",
      "description": "移动端导航的滑出式抽屉。接受 SideNav 子元素。",
      "propDescriptions": {
        "isOpen": "抽屉是否打开。在 AppShell 内，此项通过上下文自动管理。在 AppShell 外，请提供此属性自行控制抽屉。",
        "onOpenChange": "当抽屉可见性变化时调用（背景点击、Escape 键或关闭按钮）。在 AppShell 内，此项通过上下文自动管理。在手机或平板（粗粒度主指针）上，抽屉滑入期间不接受点击或拖动；按键和辅助技术仍可操作。关闭后，焦点会在其对话框关闭时返回到打开它的元素。",
        "children": "抽屉内容：通常是 SideNavSection/SideNavItem，或任意 ReactNode。",
        "header": "抽屉的页眉内容。渲染在关闭按钮旁。传入字符串可获得简单的文本标题，或传入 ReactNode 以获得自定义内容（Logo、搜索栏等）。",
        "width": "抽屉宽度（像素）。上限为 85vw，以防小屏幕溢出。",
        "side": "抽屉从哪一侧滑入。Start 在 LTR 下为左侧，在 RTL 下为右侧。Auto 会根据触发器位置选择一侧。"
      }
    },
    {
      "name": "MobileNavToggle",
      "description": "打开/关闭移动端导航抽屉的汉堡按钮。会自动从 AppShell 上下文读取打开状态：不接受 isOpen 或 onOpenChange 属性。在移动端断点以上不渲染任何内容。宿主属性和 DOM 处理函数（id、data-*、aria-*）会到达按钮；其 aria-expanded 和 aria-controls 由组件管理，调用方的 onClick 会在切换之后运行。",
      "propDescriptions": {
        "children": "替代默认汉堡图标渲染的自定义内容。",
        "label": "切换按钮的无障碍标签。"
      }
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Slide-out drawer overlay for mobile navigation. Mobile counterpart to SideNav; accepts same children (SideNavSection, SideNavItem, or any ReactNode).',
  usage: {
    anatomy,
    description:
      'A slide-out drawer for mobile navigation. MobileNav is the mobile counterpart to SideNav and accepts the same children. Use it on narrow viewports where a persistent sidebar is not practical.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Share nav items between MobileNav and SideNav by extracting into a variable.',
      },
      {
        guidance: true,
        description:
          'Provide a header when the drawer purpose is not obvious from content.',
      },
      {
        guidance: true,
        description:
          'Inside AppShell, use MobileNavToggle to open the drawer; it reads state from context. Do not pass isOpen/onOpenChange to the toggle.',
      },
      {
        guidance: false,
        description:
          'Use MobileNav on desktop; use a persistent SideNav instead.',
      },
    ],
  },
  components: [
    {
      name: 'MobileNav',
      description:
        'Slide-out drawer for mobile navigation. Accepts SideNav children.',
    },
    {
      name: 'MobileNavToggle',
      description:
        'Hamburger button that opens/closes mobile nav drawer. Reads open state from AppShell context automatically. Renders nothing above mobile breakpoint. Host attributes and handlers reach the button; aria-expanded/aria-controls stay owned.',
    },
  ],
  propDescriptions: {
    isOpen: 'whether drawer is open',
    onOpenChange:
      'called when drawer visibility changes (backdrop click, Escape, close button); under a coarse primary pointer the drawer takes no tap or drag while it slides in (keys still act)',
    children:
      'drawer content; typically SideNavSection/SideNavItem or any ReactNode',
    header:
      'header content (string or ReactNode), rendered next to close button',
    width:
      'drawer width px; capped at 85vw to prevent overflow on small screens',
    side: 'slide direction; start=left LTR, right RTL',
  },
};
