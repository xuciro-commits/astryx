// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'AppShell',
  displayName: 'App Shell',
  group: 'AppShell',
  category: 'Layout',
  keywords: [
    'appshell',
    'layout',
    'scaffold',
    'sidebar',
    'sidenav',
    'topnav',
    'header',
    'navigation',
    'dashboard',
    'shell',
    'page',
    'frame',
  ],
  usage: {
    description:
      'AppShell is the page shell for an application. It provides slots for top navigation, side navigation, banners, and main content. Use it as the root wrapper for every page. It handles responsive mobile navigation and skip-to-content automatically. Configure side nav collapse on SideNav with its collapsible prop.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Choose the right height: use "fill" for dashboards with internal scrolling and "auto" for pages that grow with content.',
      },
      {
        guidance: true,
        description:
          'Set `contentPadding` based on content type: 4 for forms and settings, 0 for tables and dashboards.',
      },
      {
        guidance: true,
        description:
          'Give every nav slot an accessible name. AppShell renders TopNav and SideNav as separate navigation landmarks, and a screen reader lists them by name. Pass `label` to TopNav. SideNav has a translated default name; pass `aria-label` to rename it.',
      },
      {
        guidance: true,
        description:
          'Start the page heading inside `children`. AppShell owns the skip link, the banner landmark and the main landmark, but it renders no heading, so the first heading in the content area is the page h1.',
      },
      {
        guidance: true,
        description:
          'On phones, opt the page into the full screen with `viewport-fit=cover` in the viewport meta tag (`width=device-width, initial-scale=1, viewport-fit=cover`). AppShell then extends its header under the status bar and out to the screen sides, and keeps the header\'s items and the end of the content inside the device\'s safe area. An installed web app can also draw under the status bar with `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`. In landscape only the header is inset: an inline SideNav and the content\'s sides still reach under a notch, so keep content padding there. A shell with no header region or phone top bar keeps no top inset; keep top padding there.',
      },
      {
        guidance: false,
        description:
          "Nest one AppShell inside another; it's the outermost layout frame.",
      },
      {
        guidance: false,
        description:
          'Use for sub-page layouts; use Layout for content areas within AppShell.',
      },
      {
        guidance: false,
        description:
          'Add your own skip link or <main> element. AppShell already renders both, and a second main landmark makes the first ambiguous.',
      },
    ],
    anatomy: [
      {
        name: 'Page shell',
        required: true,
        description:
          'Outermost application frame that owns page-level navigation, responsive shell behavior, and the main content landmark.',
      },
      {
        name: 'Skip link',
        required: true,
        description:
          'First focusable element on the page. Visually hidden until focused, then moves focus to the main content area.',
      },
      {
        name: 'Banner',
        required: false,
        description:
          'The banner slot, for system-wide announcements. Renders above the top nav, inside the banner landmark.',
      },
      {
        name: 'Top navigation',
        required: false,
        description:
          'The topNav slot, typically TopNav. Below the mobile breakpoint it becomes a compact bar carrying the nav toggle.',
      },
      {
        name: 'Side navigation',
        required: false,
        description:
          'The sideNav slot, typically SideNav. Inline above the breakpoint, moved into the mobile drawer below it.',
      },
      {
        name: 'Main content',
        required: true,
        description:
          'children, rendered in the main landmark. Scrolls internally when height is fill, and with the page when it is auto. While it scrolls content that overflows, it is a stop in the tab order; Tab entry moves on when its first focusable element is a plain link or button, and otherwise main is one stop before it.',
      },
      {
        name: 'Mobile nav drawer',
        required: false,
        description:
          'Generated below the breakpoint from the nav slots unless mobileNav disables or replaces it. A modal dialog: it traps focus and returns focus to the toggle on close.',
      },
    ],
  },
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Main content area, rendered inside a <main> element.',
    },
    {
      name: 'contentPadding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Padding for the main content area. Set based on the dominant content pattern: 4 (16px) for forms/settings/text, 0 for dashboards/maps/tables. Override individual sections with Section.',
      default: '0',
    },
    {
      name: 'topNav',
      type: 'ReactNode',
      description: 'Top navigation slot, typically TopNav.',
      slotElements: [{__element: 'TopNav', props: {label: 'Navigation'}}],
    },
    {
      name: 'sideNav',
      type: 'ReactNode',
      description: 'Side navigation slot, typically SideNav.',
      slotElements: [{__element: 'SideNav', props: {}}],
    },
    {
      name: 'mobileNav',
      // Kept as the bare `ReactNode`, not widened to the true
      // `false | MobileNavConfig | ReactNode`: the docsite playground hides a
      // prop by exact-matching the type string against UNSUPPORTED_PROP_TYPES,
      // and widening drops that match. This prop's slotElements happen to hide
      // it a second way today, but the hide should not rest on that
      // coincidence. The legal values live in the description instead (#1645).
      type: 'ReactNode',
      description:
        "Mobile navigation configuration. Accepts false (disable), a config object (tune auto behavior), or ReactNode (full custom drawer). The config object is {hasToggle?: boolean, isOpen?: boolean, onOpenChange?: (isOpen: boolean) => void, content?: ReactNode, breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none', defaultIsMobile?: boolean}; breakpoint defaults to 'md', resolves through the nearest Theme's widthBreakpoints, and switches to the wider layout at equality. 'none' is always non-mobile and ignores defaultIsMobile.",
      slotElements: [{__element: 'MobileNav', props: {}}],
    },
    {
      name: 'banner',
      type: 'ReactNode',
      description:
        'Banner slot for system-wide announcements, placed above the topNav.',
      slotElements: [
        {
          __element: 'Banner',
          props: {title: 'Info', status: 'info', container: 'section'},
        },
      ],
    },
    {
      name: 'height',
      type: "'fill' | 'auto'",
      description:
        "Height behavior: 'fill' makes the shell fill the viewport (100dvh) with independent scroll containers; 'auto' lets the shell grow with content and uses sticky positioning for nav.",
      default: "'fill'",
    },
    {
      name: 'variant',
      type: "'wash' | 'surface' | 'section' | 'elevated'",
      description:
        "Navigation background style controlling how nav areas contrast with content. 'wash' uses wash background, 'surface' uses surface background, 'section' adds dividers between nav and content, 'elevated' uses wash nav with elevated surface content and border radius.",
      default: "'elevated'",
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
  ],
  playground: {
    defaults: {
      variant: 'surface',
      contentPadding: 4,
      topNav: {
        __element: 'TopNav',
        props: {
          label: 'Navigation',
          heading: {__element: 'TopNavHeading', props: {heading: 'My App'}},
        },
      },
      sideNav: {
        __element: 'SideNav',
        props: {},
        children: [
          {
            __element: 'SideNavItem',
            props: {label: 'Dashboard', isSelected: true},
          },
          {__element: 'SideNavItem', props: {label: 'Settings'}},
          {__element: 'SideNavItem', props: {label: 'Help'}},
        ],
      },
      children: {
        __element: 'VStack',
        props: {gap: 3},
        children: [
          {__element: 'Heading', props: {level: 2}, children: 'Dashboard'},
          {
            __element: 'Text',
            props: {type: 'body', color: 'secondary'},
            children: 'Welcome back. Here is an overview of your workspace.',
          },
        ],
      },
    },
  },
  theming: {
    targets: [
      {className: 'astryx-app-shell', visualProps: ['variant']},
      {className: 'astryx-app-shell-header', visualProps: ['variant']},
      {className: 'astryx-app-shell-sidenav', visualProps: ['variant']},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "AppShell",
  "displayName": "App Shell",
  "usage": {
    "description": "AppShell 是应用程序的页面外壳。它为顶部导航、侧边导航、横幅和主内容提供插槽。请将其用作每个页面的根包装器。它会自动处理响应式移动导航和跳转到主要内容。使用 SideNav 的 collapsible 属性配置侧边导航折叠。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "选择合适的高度：带有内部滚动的仪表盘使用 \"fill\"，随内容增长的页面使用 \"auto\"。"
      },
      {
        "guidance": true,
        "description": "根据内容类型设置 `contentPadding`：表单和设置页用 4，表格和仪表盘用 0。"
      },
      {
        "guidance": true,
        "description": "为每个导航插槽设置可访问名称。AppShell 将 TopNav 和 SideNav 渲染为独立的导航地标，屏幕阅读器会按名称列出它们。为 TopNav 传入 `label`。SideNav 有已翻译的默认名称；传入 `aria-label` 可将其重命名。"
      },
      {
        "guidance": true,
        "description": "页面标题应放在 `children` 中。AppShell 拥有跳转链接、横幅地标和主地标，但不渲染任何标题，因此内容区域中的第一个标题就是页面的 h1。"
      },
      {
        "guidance": true,
        "description": "在手机上，通过在 viewport meta 标签中设置 `viewport-fit=cover`（`width=device-width, initial-scale=1, viewport-fit=cover`）让页面进入全屏。AppShell 随后会将页眉延伸到状态栏下方并延伸到屏幕两侧，同时让页眉中的项目和内容末端保持在设备的安全区域内。已安装的 Web 应用也可以通过 `<meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\">` 绘制到状态栏下方。在横屏下只有页眉内缩：内联 SideNav 和内容两侧仍会延伸到刘海下方，因此请在那里保留内容内边距。没有页眉区域或手机顶部栏的外壳不保留顶部内缩；请在那里保留顶部内边距。"
      },
      {
        "guidance": false,
        "description": "不要将一个 AppShell 嵌套在另一个 AppShell 内；它是最外层的布局框架。"
      },
      {
        "guidance": false,
        "description": "不要用于子页面布局；AppShell 内的内容区域请使用 Layout。"
      },
      {
        "guidance": false,
        "description": "不要添加你自己的跳转链接或 <main> 元素。AppShell 已经渲染了这两者，第二个主地标会让第一个变得有歧义。"
      }
    ],
    "anatomy": [
      {
        "name": "页面外壳",
        "required": true,
        "description": "最外层的应用框架，负责页面级导航、响应式外壳行为和主内容地标。"
      },
      {
        "name": "跳转链接",
        "required": true,
        "description": "页面上的第一个可聚焦元素。聚焦前在视觉上隐藏，聚焦后将焦点移动到主内容区域。"
      },
      {
        "name": "横幅",
        "required": false,
        "description": "横幅插槽，用于系统级公告。渲染在顶部导航上方、横幅地标内。"
      },
      {
        "name": "顶部导航",
        "required": false,
        "description": "topNav 插槽，通常为 TopNav。在移动断点以下变为承载导航切换按钮的紧凑栏。"
      },
      {
        "name": "侧边导航",
        "required": false,
        "description": "sideNav 插槽，通常为 SideNav。在断点以上内联显示，在断点以下移入移动抽屉。"
      },
      {
        "name": "主内容",
        "required": true,
        "description": "children，渲染在主地标中。当 height 为 fill 时在内部滚动，为 auto 时随页面滚动。当它滚动溢出的内容时，它是 Tab 顺序中的一个停靠点；当其第一个可聚焦元素是普通链接或按钮时，Tab 进入会继续前进，否则 main 是其前面的一个停靠点。"
      },
      {
        "name": "移动端导航抽屉",
        "required": false,
        "description": "在断点以下由导航插槽生成，除非 mobileNav 禁用或替换它。一个模态对话框：它捕获焦点，并在关闭时将焦点返回切换按钮。"
      }
    ]
  },
  "props": [
    {
      "name": "children",
      "type": "ReactNode",
      "description": "主内容区域，渲染在 <main> 元素内。"
    },
    {
      "name": "contentPadding",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "主内容区域的内边距。根据主要的内容模式设置：表单/设置/文本用 4（16px），仪表盘/地图/表格用 0。可使用 Section 覆盖个别区块。",
      "default": "0"
    },
    {
      "name": "topNav",
      "type": "ReactNode",
      "description": "顶部导航插槽，通常为 TopNav。"
    },
    {
      "name": "sideNav",
      "type": "ReactNode",
      "description": "侧边导航插槽，通常为 SideNav。"
    },
    {
      "name": "mobileNav",
      "type": "ReactNode",
      "description": "移动导航配置。接受 false（禁用）、配置对象（调整自动行为）或 ReactNode（完全自定义抽屉）。配置对象为 {hasToggle?: boolean, isOpen?: boolean, onOpenChange?: (isOpen: boolean) => void, content?: ReactNode, breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none', defaultIsMobile?: boolean}；breakpoint 默认为 'md'，通过最近的 Theme 的 widthBreakpoints 解析，并在相等时切换到更宽的布局。'none' 始终为非移动，并忽略 defaultIsMobile。"
    },
    {
      "name": "banner",
      "type": "ReactNode",
      "description": "横幅插槽，用于系统级公告，放置在 topNav 上方。"
    },
    {
      "name": "height",
      "type": "'fill' | 'auto'",
      "description": "高度行为：'fill' 使外壳填满视口（100dvh）并使用独立的滚动容器；'auto' 让外壳随内容增长，并对导航使用粘性定位。",
      "default": "'fill'"
    },
    {
      "name": "variant",
      "type": "'wash' | 'surface' | 'section' | 'elevated'",
      "description": "导航背景样式，控制导航区域与内容的对比方式。'wash' 使用 wash 背景，'surface' 使用 surface 背景，'section' 在导航与内容之间添加分隔线，'elevated' 使用 wash 导航并搭配带圆角的 elevated surface 内容。",
      "default": "'elevated'"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义（边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值，而不是 style={{}} 这样的内联样式对象。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-app-shell",
        "visualProps": [
          "variant"
        ]
      },
      {
        "className": "astryx-app-shell-header",
        "visualProps": [
          "variant"
        ]
      },
      {
        "className": "astryx-app-shell-sidenav",
        "visualProps": [
          "variant"
        ]
      }
    ]
  },
  "propDescriptions": {
    "children": "主内容区域，渲染在 <main> 元素内。",
    "contentPadding": "主内容区域的内边距。根据主要的内容模式设置：表单/设置/文本用 4（16px），仪表盘/地图/表格用 0。可使用 Section 覆盖个别区块。",
    "topNav": "顶部导航插槽，通常为 TopNav。",
    "sideNav": "侧边导航插槽，通常为 SideNav。",
    "mobileNav": "移动导航配置。接受 false（禁用）、配置对象（调整自动行为）或 ReactNode（完全自定义抽屉）。配置对象为 {hasToggle?: boolean, isOpen?: boolean, onOpenChange?: (isOpen: boolean) => void, content?: ReactNode, breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none', defaultIsMobile?: boolean}；breakpoint 默认为 'md'，通过最近的 Theme 的 widthBreakpoints 解析，并在相等时切换到更宽的布局。'none' 始终为非移动，并忽略 defaultIsMobile。",
    "banner": "横幅插槽，用于系统级公告，放置在 topNav 上方。",
    "height": "高度行为：'fill' 使外壳填满视口（100dvh）并使用独立的滚动容器；'auto' 让外壳随内容增长，并对导航使用粘性定位。",
    "variant": "导航背景样式，控制导航区域与内容的对比方式。'wash' 使用 wash 背景，'surface' 使用 surface 背景，'section' 在导航与内容之间添加分隔线，'elevated' 使用 wash 导航并搭配带圆角的 elevated surface 内容。",
    "xstyle": "用于布局自定义（边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值，而不是 style={{}} 这样的内联样式对象。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'app-level layout shell w/ header, side nav, main content; composes Layout internally, replaces Page+PageLayout',
  usage: {
    description:
      'AppShell is the page shell for an application. It provides slots for top navigation, side navigation, banners, and main content. Use it as the root wrapper for every page. It handles responsive mobile navigation and skip-to-content automatically. Configure side nav collapse on SideNav with its collapsible prop.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Choose the right height: use "fill" for dashboards with internal scrolling and "auto" for pages that grow with content.',
      },
      {
        guidance: true,
        description:
          'Set `contentPadding` based on content type: 4 for forms and settings, 0 for tables and dashboards.',
      },
      {
        guidance: true,
        description:
          'Give every nav slot an accessible name: TopNav and SideNav are separate navigation landmarks. Pass `label` to TopNav; SideNav has a translated default name, and `aria-label` renames it.',
      },
      {
        guidance: true,
        description:
          'Phones: add `viewport-fit=cover` to the viewport meta; the header then reaches under the status bar while its items and the content end stay in the safe area. Landscape: only the header is inset (not an inline SideNav or the content sides). No header region or phone top bar: no top inset, so keep top padding. Installed web apps: `apple-mobile-web-app-status-bar-style` `black-translucent`.',
      },
      {
        guidance: true,
        description:
          'Start the page heading inside `children`: AppShell owns the skip link, banner, and main landmarks but renders no heading, so the first content heading is the page h1.',
      },
      {
        guidance: false,
        description:
          "Nest one AppShell inside another; it's the outermost layout frame.",
      },
      {
        guidance: false,
        description:
          'Use for sub-page layouts; use Layout for content areas within AppShell.',
      },
      {
        guidance: false,
        description:
          'Add your own skip link or <main>; AppShell renders both, and a second main landmark makes the first ambiguous.',
      },
    ],
  },
  propDescriptions: {
    children: 'main content area, rendered inside <main>',
    topNav: 'top nav slot, typically TopNav',
    sideNav: 'side nav slot, typically SideNav',
    mobileNav:
      'mobile nav config: false | ReactNode | config with theme-resolved sm|md|lg|xl|2xl|none breakpoint (exclusive upper edge); none is always non-mobile and ignores defaultIsMobile',
    banner: 'slot for system-wide announcements above topNav',
    height:
      'fill=viewport 100dvh w/ independent scroll; auto=content-driven w/ sticky nav',
    variant:
      'nav bg style: wash=wash bg, surface=surface bg, section=dividers, elevated=wash nav w/ elevated surface content+radius',
    contentPadding:
      'main content area padding. 4 (16px) for forms/settings/text, 0 for dashboards/maps/tables. Override per-section via Section.',
    xstyle: 'StyleX layout customization via stylex.create()',
  },
};
