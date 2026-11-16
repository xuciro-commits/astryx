// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useAppShellMobile',
  displayName: 'useAppShellMobile',
  group: 'AppShell',
  category: 'layout',
  keywords: [
    'appshell',
    'mobile nav',
    'mobile drawer',
    'hamburger',
    'navigation toggle',
    'responsive navigation',
    'drawer state',
  ],
  params: [
    // useAppShellMobile takes no arguments; it reads AppShell context.
  ],
  returns: [
    {
      name: 'isMobile',
      type: 'boolean',
      description:
        'Whether the current viewport is below the AppShell mobile navigation breakpoint. Use this to synchronize AppShell-adjacent mobile UI with the same breakpoint as mobile nav.',
    },
    {
      name: 'isMobileNavOpen',
      type: 'boolean',
      description:
        'Whether the AppShell-managed mobile navigation drawer is open.',
    },
    {
      name: 'mobileNavId',
      type: 'string | undefined',
      description:
        'DOM id of the mobile navigation drawer, set by AppShell. Point aria-controls of a custom toggle at this so screen-reader users know which element the toggle expands. Undefined outside an AppShell that manages the drawer.',
    },
    {
      name: 'toggleMobileNav',
      type: '() => void',
      description:
        'Toggle the AppShell-managed mobile navigation drawer. No-ops when mobile nav is disabled.',
    },
    {
      name: 'openMobileNav',
      type: '() => void',
      description:
        'Open the AppShell-managed mobile navigation drawer. No-ops when mobile nav is disabled.',
    },
    {
      name: 'closeMobileNav',
      type: '() => void',
      description: 'Close the AppShell-managed mobile navigation drawer.',
    },
    {
      name: 'isMobileNavEnabled',
      type: 'boolean',
      description:
        'Whether AppShell mobile navigation is enabled and managed by AppShell. False when mobileNav is false, there is no nav content, or a fully custom mobileNav ReactNode owns the drawer.',
    },
    {
      name: 'hasAutoToggle',
      type: 'boolean',
      description:
        'Whether AppShell auto-toggle behavior is enabled. False when mobileNav hasToggle is set to false; combine with isMobile and isMobileNavEnabled before rendering custom toggles.',
    },
  ],
  usage: {
    description:
      'Hook for reading and controlling AppShell mobile navigation state from descendants of AppShell. Use it for custom mobile nav triggers, closing the drawer after route changes, or coordinating AppShell-adjacent mobile experiences with the same breakpoint used by mobile nav.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use inside the AppShell tree when building custom mobile navigation controls, route-aware nav items, or UI that should update at the same breakpoint as AppShell mobile nav.',
      },
      {
        guidance: true,
        description:
          'Prefer MobileNavToggle for the standard hamburger trigger: use this hook when you need custom placement, styling, or extra behavior.',
      },
      {
        guidance: true,
        description:
          'Call closeMobileNav after a custom mobile nav item changes route so the drawer dismisses cleanly.',
      },
      {
        guidance: false,
        description:
          'Use as a general responsive primitive when the UI is not inside AppShell or does not need to align with AppShell mobile nav: use useMediaQuery instead.',
      },
      {
        guidance: false,
        description:
          'Assume it throws outside AppShell. The hook returns safe defaults and no-op callbacks when no provider is present.',
      },
    ],
  },
  relatedComponents: [
    'AppShell',
    'MobileNav',
    'MobileNavToggle',
    'TopNav',
    'SideNav',
  ],
  relatedHooks: ['useMediaQuery'],
  importPath: '@astryxdesign/core/AppShell',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Reads/controls AppShell mobile nav context. Use for custom triggers, closing drawer after route changes, or syncing AppShell-adjacent mobile UI to the same breakpoint as mobile nav.',
  returnDescriptions: {
    isMobile:
      'viewport below AppShell mobile nav breakpoint? Use to sync AppShell-adjacent mobile UI',
    isMobileNavOpen: 'AppShell-managed mobile nav drawer open?',
    mobileNavId:
      'DOM id of the drawer; point custom toggle aria-controls at it',
    toggleMobileNav: 'toggle drawer; no-op when mobile nav disabled',
    openMobileNav: 'open drawer; no-op when mobile nav disabled',
    closeMobileNav: 'close drawer',
    isMobileNavEnabled:
      'AppShell owns mobile nav? false when mobileNav=false, no nav content, or custom ReactNode owns drawer',
    hasAutoToggle:
      'auto-toggle enabled? false when mobileNav.hasToggle=false; combine w/ isMobile + isMobileNavEnabled before custom toggle render',
  },
  usage: {
    description:
      'Reads/controls AppShell mobile nav context. Use for custom triggers, closing drawer after route changes, or syncing AppShell-adjacent mobile UI to the same breakpoint as mobile nav.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use inside AppShell tree for custom nav controls, route-aware nav items, or UI that should update at AppShell mobile nav breakpoint.',
      },
      {
        guidance: true,
        description:
          'Prefer MobileNavToggle for standard hamburger; use hook for custom placement, styling, or extra behavior.',
      },
      {
        guidance: true,
        description:
          'Call closeMobileNav after custom mobile nav item changes route so drawer dismisses.',
      },
      {
        guidance: false,
        description:
          'Use as general responsive primitive when not inside AppShell / not aligning to AppShell mobile nav: use useMediaQuery instead.',
      },
      {
        guidance: false,
        description:
          'Assume it throws outside AppShell. Hook returns safe defaults + no-op callbacks without provider.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useAppShellMobile",
  "usage": {
    "description": "用于从 AppShell 的后代组件中读取和控制 AppShell 移动端导航状态的 Hook。适用于自定义移动端导航触发器、在路由变化后关闭抽屉，或使用与移动端导航相同的断点来协调与 AppShell 相邻的移动端体验。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在构建自定义移动端导航控件、感知路由的导航项，或需要与 AppShell 移动端导航在同一断点更新的 UI 时，请在 AppShell 树内使用。"
      },
      {
        "guidance": true,
        "description": "标准汉堡菜单触发器请优先使用 MobileNavToggle：仅在需要自定义位置、样式或额外行为时使用此 Hook。"
      },
      {
        "guidance": true,
        "description": "自定义移动端导航项切换路由后调用 closeMobileNav，以便抽屉正常关闭。"
      },
      {
        "guidance": false,
        "description": "在 UI 不在 AppShell 内，或不需要与 AppShell 移动端导航对齐时，将其作为通用响应式原语使用；此类场景应改用 useMediaQuery。"
      },
      {
        "guidance": false,
        "description": "假设它在 AppShell 外部会抛出错误。没有 Provider 时，该 Hook 返回安全的默认值和空操作回调。"
      }
    ]
  },
  "paramDescriptions": {},
  "returnDescriptions": {
    "isMobile": "当前视口是否低于 AppShell 移动端导航断点。用于让与 AppShell 相邻的移动端 UI 与移动端导航保持相同断点。",
    "isMobileNavOpen": "AppShell 管理的移动端导航抽屉是否打开。",
    "mobileNavId": "移动端导航抽屉的 DOM id，由 AppShell 设置。将自定义触发器的 aria-controls 指向它，以便屏幕阅读器用户知道该触发器展开的是哪个元素。在未管理抽屉的 AppShell 外部为 undefined。",
    "toggleMobileNav": "切换 AppShell 管理的移动端导航抽屉。移动端导航禁用时为空操作。",
    "openMobileNav": "打开 AppShell 管理的移动端导航抽屉。移动端导航禁用时为空操作。",
    "closeMobileNav": "关闭 AppShell 管理的移动端导航抽屉。",
    "isMobileNavEnabled": "AppShell 移动端导航是否已启用并由 AppShell 管理。当 mobileNav 为 false、没有导航内容，或完全自定义的 mobileNav ReactNode 接管抽屉时为 false。",
    "hasAutoToggle": "AppShell 自动切换行为是否已启用。当 mobileNav 的 hasToggle 设为 false 时为 false；渲染自定义触发器前，请结合 isMobile 和 isMobileNavEnabled 判断。"
  }
};
