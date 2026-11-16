// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useResizable',
  displayName: 'useResizable',
  group: 'Resizable',
  keywords: [
    'resize',
    'resizable',
    'drag',
    'split',
    'panel',
    'sidebar',
    'divider',
    'splitter',
    'splitpane',
    'resizablepanels',
  ],
  params: [
    {
      name: 'defaultSize',
      type: 'SizeValue | ResizableSize',
      description:
        'Initial size. Numbers, exact "Npx", and pixel(value) are pixels. Exact "N%" has no additional pixel bound. percent(value, {min: pixel(value)}) or percent(value, {max: pixel(value)}) adds one pixel floor or ceiling. A percentage resolves ONCE into pixels — against containerRef when supplied, against the viewport otherwise — and does not track its basis afterwards. The released broad number | string type remains compatible; runtime validation is authoritative.',
      default: '250',
    },
    {
      name: 'minSize',
      type: 'ResizableSize',
      description:
        'Minimum size. Numbers, exact "Npx", and pixel(value) remain pixels; exact "N%" has no additional pixel bound; percent(value, {min: pixel(value)}) or percent(value, {max: pixel(value)}) adds exactly one. Percentage minimums re-resolve when their basis changes and clamp the current pixel selection.',
      default: '50',
    },
    {
      name: 'maxSize',
      type: 'ResizableSize',
      description:
        'Maximum size. Numbers, exact "Npx", and pixel(value) remain pixels; exact "N%" has no additional pixel bound; percent(value, {min: pixel(value)}) or percent(value, {max: pixel(value)}) adds exactly one. Percentage maximums re-resolve when their basis changes and clamp the current pixel selection.',
      default: 'Infinity',
    },
    {
      name: 'containerRef',
      type: 'RefObject<HTMLElement | null>',
      description:
        'The element a percentage is a share of. Caller-owned: the hook never infers one. Omitted, percentages use the viewport, which is the released behaviour. The ref may point at a different element over time — the basis follows it. Until that element is actually laid out (not yet mounted, display:none, detached) percentages use a temporary 1200px basis rather than its zero measurement, and nothing is persisted from it.',
    },
    {
      name: 'direction',
      type: "'horizontal' | 'vertical'",
      description:
        "Which axis this region resizes along. Selects the container's inline or block content-box size as the percentage basis, and must match the direction given to ResizeHandle.",
      default: "'horizontal'",
    },
    {
      name: 'collapsible',
      type: 'boolean',
      description:
        'Whether a lift or a key step below the collapsed threshold collapses the region to zero.',
      default: 'false',
    },
    {
      name: 'snaps',
      type: 'number[]',
      description: 'Pixel values to snap to during drag.',
    },
    {
      name: 'autoSaveId',
      type: 'string',
      description:
        'Key for localStorage persistence of size and collapse state across sessions.',
    },
    {
      name: 'defaultIsCollapsed',
      type: 'boolean',
      description:
        'Initial collapse state (uncontrolled). A persisted entry wins over it.',
      default: 'false',
    },
    {
      name: 'isCollapsed',
      type: 'boolean',
      description:
        'Controlled collapse state. collapse(), expand(), a lift or a key step past the threshold, and a drag that reopens the region then report through onCollapseChange instead of changing state internally.',
    },
    {
      name: 'onCollapseChange',
      type: '(isCollapsed: boolean) => void',
      description:
        'Called once per collapse state change: a lift or a key step that closes the region, a drag or a key that reopens it, Enter, a double-click, or a call to collapse(), expand() or resize().',
    },
  ],
  returns: [
    {
      name: 'size',
      type: 'number',
      description: 'Current size in pixels.',
    },
    {
      name: 'isCollapsed',
      type: 'boolean',
      description: 'Whether the region is currently collapsed.',
    },
    {
      name: 'collapse',
      type: '() => void',
      description: 'Programmatically collapse the region.',
    },
    {
      name: 'expand',
      type: '() => void',
      description: 'Expand from collapsed state.',
    },
    {
      name: 'resize',
      type: '(size: number) => void',
      description: 'Resize to a specific pixel value.',
    },
    {
      name: 'props',
      type: 'ResizableProps',
      description:
        'Props to spread on the resizable component or pass to ResizeHandle.',
    },
  ],
  usage: {
    description:
      'Hook for adding drag-to-resize behavior to layout regions. Supports single-region and multi-region configurations with snap points, collapsible panels, localStorage persistence, and cascade resize ordering.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use percent(40, {min: pixel(333)}) for a 40% size with a 333px floor, or percent(10, {max: pixel(400)}) for a 10% size with a 400px ceiling. The options argument is required and carries a floor XOR a ceiling.',
      },
      {
        guidance: true,
        description:
          'A structured default is an initial choice only; a structured minSize or maxSize remains live. State, persistence, callbacks, resize(), paint, and ARIA all use resolved pixel numbers.',
      },
      {
        guidance: true,
        description:
          'Import percent and Table’s same pixel binding from @astryxdesign/core/Resizable/utils when constructing configuration in a Server Component; the root package exposes one pixel symbol and one percent symbol without collision.',
      },
      {
        guidance: true,
        description:
          'Use with Layout or AppShell sidebar for resizable navigation panels.',
      },
      {
        guidance: true,
        description:
          'Set autoSaveId to persist user-chosen sizes across page reloads.',
      },
      {
        guidance: false,
        description:
          'Set minSize too small; content becomes unreadable. Prefer collapsible for panels that can hide entirely.',
      },
    ],
  },
  relatedComponents: ['Resizable', 'AppShell', 'Layout', 'SideNav'],
  relatedHooks: ['useCollapsible'],
  importPath: '@astryxdesign/core/Resizable',
  category: 'layout',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Adds drag-to-resize behavior to layout regions. Supports single-/multi-region configs w/ snap points, collapsible panels, localStorage persistence, cascade resize ordering.',
  paramDescriptions: {
    defaultSize:
      'initial pixels, exact N%, or percent(value, {min: pixel(value)}) / percent(value, {max: pixel(value)}); resolves once.',
    minSize:
      'live minimum: pixels, exact N%, or percent(value, {min: pixel(value)}) / percent(value, {max: pixel(value)}).',
    maxSize:
      'live maximum: pixels, exact N%, or percent(value, {min: pixel(value)}) / percent(value, {max: pixel(value)}).',
    containerRef: 'the element a percentage is a share of.',
    direction: 'which axis to resize along.',
    collapsible:
      'whether a lift or key step below collapsed threshold collapses region to zero.',
    snaps: 'px values to snap to during drag.',
    autoSaveId:
      'key for localStorage persistence of size + collapse state across sessions.',
    defaultIsCollapsed:
      'initial collapse state (uncontrolled); persisted entry wins.',
    isCollapsed:
      'controlled collapse state; collapse()/expand()/lift/key step/reopening drag report instead of mutating.',
    onCollapseChange: 'called once per collapse state change.',
  },
  returnDescriptions: {
    size: 'current size in px.',
    isCollapsed: 'whether region currently collapsed.',
    collapse: 'programmatically collapse region.',
    expand: 'expand from collapsed state.',
    resize: 'resize to specific px value.',
    props: 'props to spread on resizable component / pass to ResizeHandle.',
  },
  usage: {
    description:
      'Adds drag-to-resize behavior to layout regions. Supports single-/multi-region configs w/ snap points, collapsible panels, localStorage persistence, cascade resize ordering.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use w/ Layout / AppShell sidebar for resizable navigation panels.',
      },
      {
        guidance: true,
        description:
          'Set autoSaveId to persist user-chosen sizes across page reloads.',
      },
      {
        guidance: false,
        description:
          'Set minSize too small; content becomes unreadable. Prefer collapsible for panels that can hide entirely.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useResizable",
  "usage": {
    "description": "用于为布局区域添加拖动调整大小行为的 Hook。支持单区域和多区域配置，以及吸附点、可折叠面板、localStorage 持久化和级联调整大小顺序。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "使用 percent(40, {min: pixel(333)}) 表示带 333px 下限的 40% 尺寸，或使用 percent(10, {max: pixel(400)}) 表示带 400px 上限的 10% 尺寸。options 参数是必需的，并携带下限 XOR 上限。"
      },
      {
        "guidance": true,
        "description": "结构化默认值只是初始选择；结构化的 minSize 或 maxSize 仍然有效。状态、持久化、回调、resize()、绘制和 ARIA 都使用解析后的像素数字。"
      },
      {
        "guidance": true,
        "description": "在 Server Component 中构建配置时，从 @astryxdesign/core/Resizable/utils 导入 percent 和 Table 的同一 pixel 绑定；根包导出一个 pixel 符号和一个 percent 符号，不会冲突。"
      },
      {
        "guidance": true,
        "description": "与 Layout 或 AppShell 侧边栏一起使用，以获得可调整大小的导航面板。"
      },
      {
        "guidance": true,
        "description": "设置 autoSaveId，以便在页面重新加载之间保留用户选择的尺寸。"
      },
      {
        "guidance": false,
        "description": "不要将 minSize 设置得太小；内容会变得难以阅读。对于可以完全隐藏的面板，优先使用 collapsible。"
      }
    ]
  },
  "paramDescriptions": {
    "defaultSize": "初始尺寸。数字、精确的 \"Npx\" 和 pixel(value) 都是像素。精确的 \"N%\" 没有额外的像素边界。percent(value, {min: pixel(value)}) 或 percent(value, {max: pixel(value)}) 会添加一个像素下限或上限。百分比只解析一次为像素——提供 containerRef 时相对它解析，否则相对视口——之后不再跟踪其基准。已发布的宽泛 number | string 类型保持兼容；运行时校验是权威依据。",
    "minSize": "最小尺寸。数字、精确的 \"Npx\" 和 pixel(value) 保持为像素；精确的 \"N%\" 没有额外的像素边界；percent(value, {min: pixel(value)}) 或 percent(value, {max: pixel(value)}) 会恰好添加一个。百分比最小值在基准变化时会重新解析，并限制当前像素选择。",
    "maxSize": "最大尺寸。数字、精确的 \"Npx\" 和 pixel(value) 保持为像素；精确的 \"N%\" 没有额外的像素边界；percent(value, {min: pixel(value)}) 或 percent(value, {max: pixel(value)}) 会恰好添加一个。百分比最大值在基准变化时会重新解析，并限制当前像素选择。",
    "containerRef": "百分比所代表的元素份额。由调用方持有：Hook 从不推断。省略时，百分比使用视口，这是已发布的行为。ref 可能随时间指向不同的元素——基准会跟随它。在该元素实际布局之前（尚未挂载、display:none、已分离），百分比使用临时的 1200px 基准而不是其零测量值，并且不会从中持久化任何内容。",
    "direction": "此区域沿哪个轴调整大小。选择容器的行内或块级内容盒尺寸作为百分比基准，并且必须与传给 ResizeHandle 的方向一致。",
    "collapsible": "低于折叠阈值的上提或按键步进是否将区域折叠为零。",
    "snaps": "拖动时要吸附到的像素值。",
    "autoSaveId": "用于跨会话持久化尺寸和折叠状态的 localStorage 键。",
    "defaultIsCollapsed": "初始折叠状态（非受控）。已持久化的条目优先于它。",
    "isCollapsed": "受控的折叠状态。collapse()、expand()、上提或超过阈值的按键步进，以及重新打开区域的拖动，都会通过 onCollapseChange 报告，而不是在内部更改状态。",
    "onCollapseChange": "每次折叠状态变化时调用一次：关闭区域的上提或按键步进、重新打开它的拖动或按键、Enter、双击，或调用 collapse()、expand() 或 resize()。"
  },
  "returnDescriptions": {
    "size": "当前尺寸（像素）。",
    "isCollapsed": "区域当前是否已折叠。",
    "collapse": "以编程方式折叠区域。",
    "expand": "从折叠状态展开。",
    "resize": "调整为指定的像素值。",
    "props": "要展开到可调整大小组件上或传给 ResizeHandle 的属性。"
  }
};
