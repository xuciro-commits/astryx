// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useGridFocus',
  displayName: 'useGridFocus',
  keywords: [
    'grid',
    'focus',
    'keyboard',
    'navigation',
    'arrow',
    'calendar',
    'a11y',
    'wai-aria',
    'cells',
  ],
  params: [
    {
      name: 'options',
      type: 'UseGridFocusOptions',
      description: 'Configuration object for grid focus behavior.',
      required: true,
    },
    {
      name: 'options.columns',
      type: 'number',
      description:
        'Number of columns in the grid. Used for up/down navigation (moves by this many cells).',
      required: true,
    },
    {
      name: 'options.cellSelector',
      type: 'string',
      description:
        'Selector for cells within the grid. Should match ALL cell positions in DOM order (including disabled/empty) so grid geometry is preserved.',
      default: '\'button:not([disabled]), [tabindex]:not([tabindex="-1"])\'',
      required: false,
    },
    {
      name: 'options.isCellFocusable',
      type: '(cell: HTMLElement) => boolean',
      description:
        'Predicate for whether a matched cell can receive focus. Omit to treat every matched cell as focusable.',
      required: false,
    },
    {
      name: 'options.getFocusTarget',
      type: '(cell: HTMLElement) => HTMLElement | null',
      description:
        'Resolves the element to focus for a cell, e.g. a button inside a role="gridcell" wrapper. Omit to focus the cell itself.',
      required: false,
    },
    {
      name: 'options.onNavigateBefore',
      type: '(column: number, offset: number) => void',
      description:
        'Callback when navigation would go before the first cell. Receives the column index and offset (1 for horizontal, columns for vertical).',
      required: false,
    },
    {
      name: 'options.onNavigateAfter',
      type: '(column: number, offset: number) => void',
      description:
        'Callback when navigation would go after the last cell. Receives the column index and offset.',
      required: false,
    },
    {
      name: 'options.onPageUp',
      type: '(event: React.KeyboardEvent) => void',
      description:
        'Callback for Page Up key (e.g., navigate to previous month in calendars). Receives the key event, so `event.shiftKey` can select a larger step, such as a year.',
      required: false,
    },
    {
      name: 'options.onPageDown',
      type: '(event: React.KeyboardEvent) => void',
      description:
        'Callback for Page Down key (e.g., navigate to next month in calendars). Receives the key event, so `event.shiftKey` can select a larger step, such as a year.',
      required: false,
    },
    {
      name: 'options.hasRovingTabIndex',
      type: 'boolean',
      description:
        'Own a single roving tab stop across the grid: one focusable cell (its resolved focus target) carries tabindex="0", the rest -1. Stamped/repaired on render and moved with arrow navigation. Attach the returned handleFocus to the container onFocus.',
      default: 'false',
      required: false,
    },
  ],
  returns: [
    {
      name: 'gridRef',
      type: 'React.RefObject<HTMLElement | null>',
      description: 'Ref to attach to the grid container element.',
    },
    {
      name: 'handleKeyDown',
      type: '(e: React.KeyboardEvent) => void',
      description: 'Key down handler to attach to the grid container.',
    },
    {
      name: 'handleFocus',
      type: '(e: React.FocusEvent) => void',
      description:
        'Focus handler for the grid container. Keeps the roving tab stop in sync when hasRovingTabIndex is enabled; a no-op otherwise, so always safe to attach.',
    },
    {
      name: 'focusCell',
      type: '(index: number) => void',
      description: 'Focus a specific cell by index (clamped to valid range).',
    },
    {
      name: 'focusFirst',
      type: '() => void',
      description: 'Focus the first focusable cell in the grid.',
    },
    {
      name: 'focusLast',
      type: '() => void',
      description: 'Focus the last focusable cell in the grid.',
    },
  ],
  usage: {
    description:
      'Manages keyboard navigation within a 2D grid following the WAI-ARIA grid pattern. Supports arrow keys for cell-to-cell navigation, Home/End for row boundaries, Ctrl+Home/Ctrl+End for grid boundaries, and Page Up/Down for custom callbacks (e.g., month navigation in calendars). Boundary navigation callbacks allow cross-grid navigation.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for calendar date grids: wire onPageUp/onPageDown to month navigation and onNavigateBefore/onNavigateAfter for cross-month arrow key navigation.',
      },
      {
        guidance: true,
        description:
          'Attach both gridRef and handleKeyDown to the grid container element.',
      },
      {
        guidance: true,
        description:
          'For roving-tabindex grids (e.g. Calendar), set hasRovingTabIndex: true and attach handleFocus to the container onFocus; seed one focus target with tabindex=0 and the hook repairs and moves it.',
      },
      {
        guidance: false,
        description:
          'Use for simple linear lists; prefer useListFocus for 1D navigation.',
      },
    ],
  },
  relatedComponents: ['Calendar'],
  relatedHooks: ['useListFocus', 'useFocusTrap'],
  importPath: '@astryxdesign/core/hooks',
  category: 'focus',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Manages keyboard navigation within 2D grid following WAI-ARIA grid pattern. Supports arrow keys for cell-to-cell navigation, Home/End for row boundaries, Ctrl+Home/Ctrl+End for grid boundaries, Page Up/Down for custom callbacks (e.g. month navigation in calendars). Boundary navigation callbacks allow cross-grid navigation.',
  paramDescriptions: {
    options: 'config for grid focus behavior.',
    'options.columns':
      '# columns in grid. Used for up/down navigation (moves by this many cells).',
    'options.cellSelector':
      'selector for grid cells in DOM order (incl. disabled/empty) so geometry is preserved.',
    'options.isCellFocusable':
      'predicate for whether a matched cell can take focus. Omit = all focusable.',
    'options.getFocusTarget':
      'resolve element to focus for a cell (e.g. button inside gridcell wrapper). Omit = focus the cell.',
    'options.onNavigateBefore':
      'callback when navigation would go before first cell. Receives column index + offset (1 for horizontal, columns for vertical).',
    'options.onNavigateAfter':
      'callback when navigation would go after last cell. Receives column index + offset.',
    'options.onPageUp':
      'callback for Page Up key (e.g. previous month in calendars); receives the key event (shiftKey → e.g. a year).',
    'options.onPageDown':
      'callback for Page Down key (e.g. next month in calendars); receives the key event (shiftKey → e.g. a year).',
    'options.hasRovingTabIndex':
      'own a single roving tab stop across the grid (one focus target tabindex=0, rest -1); repaired on render + moved with arrows. Attach handleFocus to onFocus. default false.',
  },
  returnDescriptions: {
    gridRef: 'ref to attach to grid container element.',
    handleKeyDown: 'key down handler for grid container.',
    handleFocus:
      'focus handler for grid container; syncs roving tab stop when hasRovingTabIndex on, else no-op.',
    focusCell: 'focus specific cell by index (clamped to valid range).',
    focusFirst: 'focus first focusable cell in grid.',
    focusLast: 'focus last focusable cell in grid.',
  },
  usage: {
    description:
      'Manages keyboard navigation within 2D grid following WAI-ARIA grid pattern. Supports arrow keys for cell-to-cell navigation, Home/End for row boundaries, Ctrl+Home/Ctrl+End for grid boundaries, Page Up/Down for custom callbacks (e.g. month navigation in calendars). Boundary navigation callbacks allow cross-grid navigation.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for calendar date grids: wire onPageUp/onPageDown to month navigation + onNavigateBefore/onNavigateAfter for cross-month arrow key navigation.',
      },
      {
        guidance: true,
        description:
          'Attach both gridRef + handleKeyDown to grid container element.',
      },
      {
        guidance: true,
        description:
          'For roving-tabindex grids (e.g. Calendar): hasRovingTabIndex: true + attach handleFocus to onFocus; seed one focus target tabindex=0, hook repairs + moves it.',
      },
      {
        guidance: false,
        description:
          'Use for simple linear lists; prefer useListFocus for 1D navigation.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useGridFocus",
  "usage": {
    "description": "按照 WAI-ARIA 网格模式管理二维网格内的键盘导航。支持用方向键在单元格之间导航、用 Home/End 跳到行边界、用 Ctrl+Home/Ctrl+End 跳到网格边界，以及用 Page Up/Down 触发自定义回调（例如日历中的月份导航）。边界导航回调允许跨网格导航。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于日历日期网格：将 onPageUp/onPageDown 接到月份导航，将 onNavigateBefore/onNavigateAfter 用于跨月份的方向键导航。"
      },
      {
        "guidance": true,
        "description": "同时将 gridRef 和 handleKeyDown 附加到网格容器元素。"
      },
      {
        "guidance": true,
        "description": "对于 roving-tabindex 网格（例如 Calendar），设置 hasRovingTabIndex: true，并将 handleFocus 附加到容器的 onFocus；用一个 tabindex=0 的焦点目标作为种子，Hook 会修复并移动它。"
      },
      {
        "guidance": false,
        "description": "不要用于简单的线性列表；一维导航请优先使用 useListFocus。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "网格焦点行为的配置对象。",
    "options.columns": "网格中的列数。用于上/下导航（按此数量移动单元格）。",
    "options.cellSelector": "网格中单元格的选择器。应匹配 DOM 顺序中的所有单元格位置（包括禁用/空的），以保持网格几何结构。",
    "options.isCellFocusable": "判断匹配的单元格是否可接收焦点的谓词。省略时将每个匹配的单元格视为可聚焦。",
    "options.getFocusTarget": "解析单元格中要聚焦的元素，例如 role=\"gridcell\" 包装器内的按钮。省略时聚焦单元格本身。",
    "options.onNavigateBefore": "导航即将越过第一个单元格时调用的回调。接收列索引和偏移量（水平为 1，垂直为 columns）。",
    "options.onNavigateAfter": "导航即将越过最后一个单元格时调用的回调。接收列索引和偏移量。",
    "options.onPageUp": "Page Up 键的回调（例如在日历中导航到上个月）。接收按键事件，因此 `event.shiftKey` 可以选择更大的步长，例如一年。",
    "options.onPageDown": "Page Down 键的回调（例如在日历中导航到下个月）。接收按键事件，因此 `event.shiftKey` 可以选择更大的步长，例如一年。",
    "options.hasRovingTabIndex": "在整个网格中拥有单个 roving Tab 停靠点：一个可聚焦单元格（其解析后的焦点目标）带有 tabindex=\"0\"，其余为 -1。在渲染时标记/修复，并随方向键导航移动。将返回的 handleFocus 附加到容器的 onFocus。"
  },
  "returnDescriptions": {
    "gridRef": "要附加到网格容器元素的 ref。",
    "handleKeyDown": "要附加到网格容器的按键按下处理程序。",
    "handleFocus": "网格容器的焦点处理程序。在启用 hasRovingTabIndex 时保持 roving Tab 停靠点同步；否则为空操作，因此始终可以安全附加。",
    "focusCell": "按索引聚焦特定单元格（限制在有效范围内）。",
    "focusFirst": "聚焦网格中的第一个可聚焦单元格。",
    "focusLast": "聚焦网格中的最后一个可聚焦单元格。"
  }
};
