// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useListFocus',
  displayName: 'useListFocus',
  keywords: [
    'list',
    'focus',
    'keyboard',
    'navigation',
    'menu',
    'toolbar',
    'roving',
    'tabindex',
    'a11y',
    'arrow',
    'wai-aria',
  ],
  params: [
    {
      name: 'options',
      type: 'UseListFocusOptions',
      description:
        'Configuration object for list focus behavior. All fields are optional.',
      required: false,
    },
    {
      name: 'options.itemSelector',
      type: 'string',
      description: 'Selector for focusable items within the list.',
      default: '\'[role="menuitem"]\'',
      required: false,
    },
    {
      name: 'options.boundarySelector',
      type: 'string',
      description:
        "Selector identifying a list boundary, for lists that contain nested lists of the same kind (e.g. a menu with submenu flyouts). When set, item collection and key handling are scoped to this level's own container. Typically '[role=\"menu\"]'.",
      required: false,
    },
    {
      name: 'options.wrap',
      type: 'boolean',
      description: 'Whether arrow navigation wraps around at the ends.',
      default: 'true',
      required: false,
    },
    {
      name: 'options.onEscape',
      type: '() => void',
      description:
        'Callback when Escape key is pressed (e.g., close menu). Supplying it also consumes the key (preventDefault); without it Escape passes through to the surrounding layer.',
      required: false,
    },
    {
      name: 'options.orientation',
      type: "'horizontal' | 'vertical' | 'both'",
      description:
        "Navigation orientation. 'horizontal' uses ArrowLeft/ArrowRight, 'vertical' uses ArrowUp/ArrowDown, 'both' accepts all four arrows.",
      default: "'vertical'",
      required: false,
    },
    {
      name: 'options.hasHomeEnd',
      type: 'boolean',
      description: 'Whether Home/End jump to the first/last enabled item.',
      default: 'true',
      required: false,
    },
    {
      name: 'options.hasPaging',
      type: 'boolean',
      description:
        'Whether PageDown/PageUp page through a scrolling list: PageDown moves to the last enabled item fully visible in the container, and pressed there again one viewport further; PageUp mirrors it. Neither wraps; in a list that does not scroll they act as End/Home.',
      default: 'false',
      required: false,
    },
    {
      name: 'options.hasRovingTabIndex',
      type: 'boolean',
      description:
        'Opt into roving-tabindex ownership: the hook stamps a single tab stop (one item tabindex="0", the rest -1), repairs it as items mount/unmount or toggle disabled, and moves it with arrow navigation. When false, the hook only moves focus and never touches tabindex.',
      default: 'false',
      required: false,
    },
    {
      name: 'options.hasCaretGuard',
      type: 'boolean',
      description:
        'When true, arrow keys are not stolen from a nested text input/textarea whose caret is not at the boundary in the direction of travel (or that has a selection), and are never stolen from a nested contenteditable (rich-text editor / chat composer). Preserves inline text editing within the list.',
      default: 'false',
      required: false,
    },
  ],
  returns: [
    {
      name: 'listRef',
      type: 'React.RefObject<HTMLElement | null>',
      description: 'Ref to attach to the list container element.',
    },
    {
      name: 'handleKeyDown',
      type: '(e: React.KeyboardEvent) => void',
      description: 'Key down handler to attach to the list container.',
    },
    {
      name: 'handleFocus',
      type: '(e: React.FocusEvent) => void',
      description:
        'Focus handler for the container. Keeps the roving tab stop in sync when hasRovingTabIndex is enabled; a no-op otherwise, so it is always safe to attach.',
    },
    {
      name: 'focusItem',
      type: '(index: number) => void',
      description: 'Focus a specific item by index (clamped to valid range).',
    },
    {
      name: 'focusFirst',
      type: '() => boolean',
      description:
        'Focus the first enabled item. Returns true when an item was focused.',
    },
    {
      name: 'focusLast',
      type: '() => boolean',
      description:
        'Focus the last enabled item. Returns true when an item was focused.',
    },
    {
      name: 'ownsEvent',
      type: '(e: React.KeyboardEvent) => boolean',
      description:
        'Whether a key event belongs to this list level rather than a nested list sharing the same boundarySelector. Always true when no boundarySelector is set. Use to guard consumer-added key handling (Enter/Space, typeahead).',
    },
    {
      name: 'getItems',
      type: '() => HTMLElement[]',
      description:
        "This level's focusable items in DOM order (already scoped by boundarySelector). Build typeahead targets from this instead of re-querying.",
    },
  ],
  usage: {
    description:
      'Manages keyboard navigation within a linear list following WAI-ARIA menu/listbox/toolbar patterns. Supports arrow key navigation (vertical, horizontal, or both), Home/End for boundaries, optional wrap-around, RTL, and Escape to close. Opt into hasRovingTabIndex for composite widgets (toolbars, segmented controls, tab strips) that own a single tab stop. Suitable for dropdown menus, toolbars, and any 1D focusable list.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Set orientation to 'horizontal' for toolbars and tab bars, 'vertical' for dropdown menus.",
      },
      {
        guidance: true,
        description:
          'Provide an onEscape callback for menus/dropdowns to return focus to the trigger.',
      },
      {
        guidance: true,
        description:
          'Enable hasRovingTabIndex (and hasCaretGuard when the widget can contain text inputs) for toolbar-style composites that should be a single tab stop.',
      },
      {
        guidance: false,
        description:
          'Use for 2D grid navigation; prefer useGridFocus for grids and calendars.',
      },
    ],
  },
  relatedComponents: ['TabMenu', 'Toolbar'],
  relatedHooks: ['useGridFocus', 'useFocusTrap'],
  importPath: '@astryxdesign/core/hooks',
  category: 'focus',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Manages keyboard navigation within linear list following WAI-ARIA menu/listbox/toolbar patterns. Supports arrow key navigation (vertical / horizontal), Home/End for boundaries, optional wrap-around, Escape to close. Suitable for dropdown menus, toolbars, any 1D focusable list.',
  paramDescriptions: {
    options: 'config for list focus behavior. All fields optional.',
    'options.itemSelector': 'selector for focusable items in list.',
    'options.boundarySelector':
      'boundary selector for lists that contain nested lists (e.g. submenu flyouts); scopes items + key handling to this level.',
    'options.wrap': 'whether arrow navigation wraps around at ends.',
    'options.onEscape':
      'callback when Escape key pressed (e.g. close menu). Also consumes the key; without it Escape passes through to the surrounding layer.',
    'options.orientation':
      "navigation orientation. 'horizontal' uses ArrowLeft/ArrowRight, 'vertical' uses ArrowUp/ArrowDown, 'both' accepts all four arrows.",
    'options.hasHomeEnd': 'whether Home/End jump to first/last enabled item.',
    'options.hasPaging':
      'whether PageDown/PageUp page through a scrolling list (last/first fully visible item, then one viewport further; never wraps).',
    'options.hasRovingTabIndex':
      'opt into roving-tabindex ownership: hook stamps + repairs a single tab stop across items.',
    'options.hasCaretGuard':
      "when true, don't steal arrow keys from a nested text input/textarea mid-line or from a contenteditable.",
  },
  returnDescriptions: {
    listRef: 'ref to attach to list container element.',
    handleKeyDown: 'key down handler for list container.',
    handleFocus:
      'focus handler; keeps roving tab stop in sync when hasRovingTabIndex is on (else no-op).',
    focusItem: 'focus specific item by index (clamped to valid range).',
    focusFirst: 'focus first enabled item; returns true when focused.',
    focusLast: 'focus last enabled item; returns true when focused.',
    ownsEvent:
      "whether a key event is this level's vs a nested list's (boundarySelector); always true without one.",
    getItems:
      "this level's focusable items in DOM order, scoped by boundarySelector.",
  },
  usage: {
    description:
      'Manages keyboard navigation within linear list following WAI-ARIA menu/listbox/toolbar patterns. Supports arrow key navigation (vertical / horizontal), Home/End for boundaries, optional wrap-around, Escape to close. Suitable for dropdown menus, toolbars, any 1D focusable list.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Set orientation to 'horizontal' for toolbars + tab bars, 'vertical' for dropdown menus.",
      },
      {
        guidance: true,
        description:
          'Provide onEscape callback for menus/dropdowns to return focus to trigger.',
      },
      {
        guidance: true,
        description:
          'Enable hasRovingTabIndex (+ hasCaretGuard when widget can contain text inputs) for toolbar-style composites that should be a single tab stop.',
      },
      {
        guidance: false,
        description:
          'Use for 2D grid navigation; prefer useGridFocus for grids + calendars.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useListFocus",
  "usage": {
    "description": "按照 WAI-ARIA menu/listbox/toolbar 模式管理线性列表内的键盘导航。支持方向键导航（垂直、水平或两者）、Home/End 边界、可选环绕、RTL 以及 Escape 关闭。为拥有单个 Tab 停靠点的复合组件（工具栏、分段控件、标签条）启用 hasRovingTabIndex。适用于下拉菜单、工具栏以及任何一维可聚焦列表。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "对于工具栏和标签栏，将 orientation 设为 'horizontal'；对于下拉菜单，设为 'vertical'。"
      },
      {
        "guidance": true,
        "description": "为菜单/下拉菜单提供 onEscape 回调，将焦点返回触发器。"
      },
      {
        "guidance": true,
        "description": "对于应作为单个 Tab 停靠点的工具栏式复合组件，启用 hasRovingTabIndex（当组件可能包含文本输入时，同时启用 hasCaretGuard）。"
      },
      {
        "guidance": false,
        "description": "不要用它进行二维网格导航；网格和日历请优先使用 useGridFocus。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "列表聚焦行为的配置对象。所有字段都是可选的。",
    "options.itemSelector": "列表中可聚焦项的选择器。",
    "options.boundarySelector": "标识列表边界的选择器，适用于包含同类型嵌套列表的列表（例如带子菜单浮层的菜单）。设置后，项收集和按键处理会限定在此层级自己的容器内。通常为 '[role=\"menu\"]'。",
    "options.wrap": "方向键导航是否在两端环绕。",
    "options.onEscape": "按下 Escape 键时的回调（例如关闭菜单）。提供它同时会消费该按键（preventDefault）；没有它时，Escape 会传递给外层。",
    "options.orientation": "导航方向。'horizontal' 使用 ArrowLeft/ArrowRight，'vertical' 使用 ArrowUp/ArrowDown，'both' 接受全部四个方向键。",
    "options.hasHomeEnd": "Home/End 是否跳转到第一个/最后一个已启用项。",
    "options.hasPaging": "PageDown/PageUp 是否在可滚动列表中翻页：PageDown 移动到容器中完全可见的最后一个已启用项，再次按下则再移动一个视口；PageUp 与之对应。两者都不环绕；在不滚动的列表中，它们的作用相当于 End/Home。",
    "options.hasRovingTabIndex": "启用 roving-tabindex 所有权：该 Hook 会打上单个 Tab 停靠点（一个项 tabindex=\"0\"，其余为 -1），在项挂载/卸载或切换禁用时修复它，并随方向键导航移动它。为 false 时，该 Hook 只移动焦点，绝不触碰 tabindex。",
    "options.hasCaretGuard": "为 true 时，如果嵌套的文本输入框/文本域的光标不在行进方向的边界上（或存在选区），方向键不会被抢占；也永远不会从嵌套的 contenteditable（富文本编辑器/聊天编辑器）中抢占。保留列表内的行内文本编辑。"
  },
  "returnDescriptions": {
    "listRef": "附加到列表容器元素的 ref。",
    "handleKeyDown": "附加到列表容器的按键处理函数。",
    "handleFocus": "容器的聚焦处理函数。启用 hasRovingTabIndex 时保持 roving Tab 停靠点同步；否则为无操作，因此始终可以安全附加。",
    "focusItem": "按索引聚焦特定项（会钳制到有效范围）。",
    "focusFirst": "聚焦第一个已启用项。当有项被聚焦时返回 true。",
    "focusLast": "聚焦最后一个已启用项。当有项被聚焦时返回 true。",
    "ownsEvent": "某个按键事件是否属于此列表层级，而不是共享同一 boundarySelector 的嵌套列表。未设置 boundarySelector 时始终为 true。用于保护消费方添加的按键处理（Enter/Space、typeahead）。",
    "getItems": "此层级的可聚焦项，按 DOM 顺序（已按 boundarySelector 限定）。从这里构建 typeahead 目标，而不是重新查询。"
  }
};
