// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useTreeFocus',
  displayName: 'useTreeFocus',
  keywords: ['tree', 'treeview', 'focus', 'keyboard', 'navigation', 'arrow', 'expand', 'collapse', 'roving', 'tabindex', 'a11y', 'wai-aria', 'apg'],
  params: [
    {
      name: 'options',
      type: 'UseTreeFocusOptions',
      description: 'Configuration object for tree focus behavior.',
      required: false,
    },
    {
      name: 'options.itemSelector',
      type: 'string',
      description: 'Selector for visible treeitems within the tree, in DOM order.',
      default: "'[role=\"treeitem\"]'",
      required: false,
    },
    {
      name: 'options.isItemDisabled',
      type: '(item: HTMLElement) => boolean',
      description: 'Predicate for whether a treeitem is disabled and must be skipped during navigation. Defaults to reading `data-tree-disabled` / `aria-disabled`.',
      required: false,
    },
    {
      name: 'options.getLevel',
      type: '(item: HTMLElement) => number',
      description: 'Reads the 1-based nesting level of a treeitem. Defaults to the `aria-level` attribute.',
      required: false,
    },
    {
      name: 'options.onToggleExpand',
      type: '(id: string) => void',
      description: 'Called to expand/collapse the treeitem with the given id (ArrowRight on a collapsed parent, ArrowLeft on an expanded parent, Enter/Space on a parent without its own action).',
      required: false,
    },
    {
      name: 'options.onActivate',
      type: '(item: HTMLElement, id: string | undefined) => boolean | void',
      description: 'Called when Enter/Space activates a treeitem. Return true when handled; return false/undefined to let the hook fall back to toggling expansion.',
      required: false,
    },
    {
      name: 'options.onActiveChange',
      type: '(id: string | undefined) => void',
      description: 'Notified when the hook moves focus to a treeitem. Consumers use this to move a single roving tab stop.',
      required: false,
    },
    {
      name: 'options.hasRovingTabIndex',
      type: 'boolean',
      description: 'When true, the hook owns a single roving tab stop across the visible treeitems (stamps tabindex 0/-1, repairs on mount, moves with navigation). Preserves an existing tabindex="0" seed on mount. Attach the returned `handleFocus` to keep the stop in sync after clicks.',
      default: 'false',
      required: false,
    },
    {
      name: 'options.typeahead',
      type: 'boolean',
      description: 'Whether typeahead (jump to next item whose text starts with the typed characters, ignoring case, accents, the stroked letters đ ł ø ħ ŧ ƀ and Turkish ı/İ in every locale) is enabled.',
      default: 'true',
      required: false,
    },
  ],
  returns: [
    {
      name: 'treeRef',
      type: 'React.RefObject<HTMLElement | null>',
      description: 'Ref to attach to the tree container element (role="tree").',
    },
    {
      name: 'handleKeyDown',
      type: '(e: React.KeyboardEvent) => void',
      description: 'Key down handler to attach to the tree container.',
    },
    {
      name: 'handleFocus',
      type: '(e: React.FocusEvent) => void',
      description: 'Focus handler to attach to the container\'s onFocus. Keeps the roving tab stop in sync when hasRovingTabIndex is enabled; a no-op otherwise, so always safe to attach.',
    },
    {
      name: 'focusFirst',
      type: '() => void',
      description: 'Focus the first enabled visible treeitem.',
    },
    {
      name: 'focusLast',
      type: '() => void',
      description: 'Focus the last enabled visible treeitem.',
    },
  ],
  usage: {
    description:
      'Manages roving-tabindex focus and the WAI-ARIA tree keyboard model. ArrowUp/ArrowDown/Home/End roam linearly over the visible treeitems (skipping disabled ones), while ArrowRight/ArrowLeft carry tree semantics (expand/collapse, move to first-child/parent). Enter/Space activate, and printable characters trigger typeahead.',
    bestPractices: [
      { guidance: true, description: 'Use for hierarchical tree widgets: wire onToggleExpand to your expansion state and onActiveChange to a single roving tab stop.' },
      { guidance: true, description: 'Attach both treeRef and handleKeyDown to the role="tree" container element.' },
      { guidance: false, description: 'Use for linear lists (prefer useListFocus) or 2D grids (prefer useGridFocus); those traversals differ from a tree.' },
    ],
  },
  relatedComponents: ['TreeList'],
  relatedHooks: ['useListFocus', 'useGridFocus', 'useFocusTrap'],
  importPath: '@astryxdesign/core/hooks',
  category: 'focus',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Manages roving-tabindex focus + WAI-ARIA tree keyboard model. ArrowUp/Down/Home/End roam linearly over visible treeitems (skip disabled); ArrowRight/Left carry tree semantics (expand/collapse, move to first-child/parent). Enter/Space activate; printable chars trigger typeahead.',
  paramDescriptions: {
    options: 'config for tree focus behavior.',
    'options.itemSelector': 'selector for visible treeitems in DOM order.',
    'options.isItemDisabled': 'predicate: is treeitem disabled (skipped in nav). Defaults to data-tree-disabled / aria-disabled.',
    'options.getLevel': 'reads 1-based nesting level. Defaults to aria-level attr.',
    'options.onToggleExpand': 'expand/collapse treeitem by id (ArrowRight collapsed parent, ArrowLeft expanded parent, Enter/Space parent w/o own action).',
    'options.onActivate': 'called on Enter/Space activation. Return true when handled; else hook falls back to toggling expansion.',
    'options.onActiveChange': 'notified when focus moves to a treeitem. Use to move a single roving tab stop.',
    'options.hasRovingTabIndex': 'hook owns a single roving tab stop (stamps tabindex 0/-1, repairs on mount, moves w/ nav). Preserves an existing tabindex="0" seed. Attach handleFocus to sync after clicks.',
    'options.typeahead': 'enable typeahead (jump to next item whose text starts with typed chars, ignoring case, accents, stroked letters + Turkish ı/İ).',
  },
  returnDescriptions: {
    treeRef: 'ref to attach to tree container (role="tree").',
    handleKeyDown: 'key down handler for tree container.',
    handleFocus: 'onFocus handler; keeps roving tab stop in sync when hasRovingTabIndex on (no-op otherwise).',
    focusFirst: 'focus first enabled visible treeitem.',
    focusLast: 'focus last enabled visible treeitem.',
  },
  usage: {
    description:
      'Manages roving-tabindex focus + WAI-ARIA tree keyboard model. ArrowUp/Down/Home/End roam linearly over visible treeitems (skip disabled); ArrowRight/Left carry tree semantics (expand/collapse, move to first-child/parent). Enter/Space activate; printable chars trigger typeahead.',
    bestPractices: [
      { guidance: true, description: 'Use for hierarchical tree widgets: wire onToggleExpand to expansion state + onActiveChange to a single roving tab stop.' },
      { guidance: true, description: 'Attach both treeRef + handleKeyDown to role="tree" container.' },
      { guidance: false, description: 'Use for linear lists (prefer useListFocus) or 2D grids (prefer useGridFocus).' },
    ],
  },
};

export const docsZh = {
  "name": "useTreeFocus",
  "usage": {
    "description": "管理 roving tabindex 焦点和 WAI-ARIA tree 键盘模型。ArrowUp/ArrowDown/Home/End 在可见 treeitem 上线性移动（跳过禁用的项），而 ArrowRight/ArrowLeft 承担树语义（展开/折叠、移到第一个子项/父项）。Enter/Space 激活，可打印字符触发 typeahead。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于层级树组件：将 `onToggleExpand` 接到展开状态，将 `onActiveChange` 接到单个 roving tab stop。"
      },
      {
        "guidance": true,
        "description": "将 `treeRef` 和 `handleKeyDown` 都附加到 `role=\"tree\"` 容器元素上。"
      },
      {
        "guidance": false,
        "description": "不要用于线性列表（优先使用 useListFocus）或二维网格（优先使用 useGridFocus）；这些遍历方式与树不同。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "树焦点行为的配置对象。",
    "options.itemSelector": "树内可见 treeitem 的选择器，按 DOM 顺序。",
    "options.isItemDisabled": "判断 treeitem 是否被禁用、必须在导航中跳过的谓词。默认读取 `data-tree-disabled` / `aria-disabled`。",
    "options.getLevel": "读取 treeitem 的从 1 开始的嵌套层级。默认使用 `aria-level` 属性。",
    "options.onToggleExpand": "用于展开/折叠指定 id 的 treeitem（在折叠的父项上按 ArrowRight、在展开的父项上按 ArrowLeft、在没有自身操作的父项上按 Enter/Space）。",
    "options.onActivate": "当 Enter/Space 激活 treeitem 时调用。已处理则返回 true；返回 false/undefined 让 Hook 回退为切换展开。",
    "options.onActiveChange": "当 Hook 将焦点移到某个 treeitem 时通知。使用者借此移动单个 roving tab stop。",
    "options.hasRovingTabIndex": "为 true 时，Hook 在可见 treeitem 上拥有单个 roving tab stop（写入 tabindex 0/-1，挂载时修复，随导航移动）。挂载时保留已有的 `tabindex=\"0\"` 种子。附加返回的 `handleFocus`，以便点击后保持 tab stop 同步。",
    "options.typeahead": "是否启用 typeahead（跳到下一个文本以键入字符开头的项，忽略大小写、重音符号，以及所有语言环境中的带横线字母 đ ł ø ħ ŧ ƀ 和土耳其语 ı/İ）。"
  },
  "returnDescriptions": {
    "treeRef": "附加到树容器元素（`role=\"tree\"`）的 ref。",
    "handleKeyDown": "附加到树容器的按键按下处理器。",
    "handleFocus": "附加到容器 `onFocus` 的焦点处理器。启用 `hasRovingTabIndex` 时保持 roving tab stop 同步；否则为空操作，因此始终可以安全附加。",
    "focusFirst": "聚焦第一个启用且可见的 treeitem。",
    "focusLast": "聚焦最后一个启用且可见的 treeitem。"
  }
};
