// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useTypeahead',
  displayName: 'useTypeahead',
  keywords: [
    'typeahead',
    'type to focus',
    'first character',
    'keyboard',
    'search',
    'jump',
    'menu',
    'listbox',
    'select',
    'apg',
    'accessibility',
    'a11y',
  ],
  params: [
    {
      name: 'options',
      type: 'UseTypeaheadOptions',
      description: 'Configuration object.',
      required: true,
    },
    {
      name: 'options.getItemLabels',
      type: '() => ReadonlyArray<string | null | undefined>',
      description:
        "Returns the item labels in DOM order. A null or empty entry marks a non-matchable slot and keeps indices aligned with the caller's items.",
      required: true,
    },
    {
      name: 'options.onMatch',
      type: '(index: number) => void',
      description:
        "Called with the index of the matched item so the caller can focus or select it; typically useListFocus's focusItem.",
      required: true,
    },
    {
      name: 'options.getCurrentIndex',
      type: '() => number',
      description:
        'The index to search from, usually the focused item, so repeated presses of one letter cycle through matches. A negative value means nothing is current.',
      default: '() => -1',
    },
    {
      name: 'options.resetMs',
      type: 'number',
      description:
        'Milliseconds of inactivity after which the typed buffer resets.',
      default: '750',
    },
    {
      name: 'options.isDisabled',
      type: '(index: number) => boolean',
      description: 'Whether an index should be skipped, e.g. disabled items.',
    },
  ],
  returns: [
    {
      name: 'onKeyDown',
      type: '(e: React.KeyboardEvent | KeyboardEvent) => boolean',
      description:
        'Keydown handler. Returns true when it consumed a printable character, so the caller can stop its own key handling.',
    },
    {
      name: 'reset',
      type: '() => void',
      description:
        'Clears the pending buffer, e.g. when the collection closes.',
    },
  ],
  usage: {
    description:
      "Adds APG type-to-focus search to a collection: printable keystrokes are buffered (resetting after a pause), and the first item whose label starts with the buffer (ignoring case, accents, the stroked letters đ ł ø ħ ŧ ƀ and Turkish ı/İ, the same in every locale; a typed accent prefers the exact match) is reported through onMatch. Pressing the same letter repeatedly cycles through the matches rather than filtering deeper. It moves nothing itself; pair it with the collection's own focus management, most often useListFocus or useGridFocus.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Wire onMatch to the focus manager you already have (useListFocus.focusItem) instead of moving focus yourself.',
      },
      {
        guidance: true,
        description:
          'Let it see the key event first and fall through to arrow-key navigation only when it returns false.',
      },
      {
        guidance: true,
        description:
          'Pass getCurrentIndex so repeated presses of one letter walk through matches instead of sticking on the first.',
      },
      {
        guidance: false,
        description:
          'Use it on a text input; the field already receives the characters, and typeahead would fight the value.',
      },
    ],
  },
  relatedComponents: ['DropdownMenu', 'Selector', 'TreeList'],
  relatedHooks: ['useListFocus', 'useGridFocus', 'useTreeFocus'],
  importPath: '@astryxdesign/core/hooks',
  category: 'focus',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'APG type-to-focus search for a collection. Buffers printable keys (resets after pause), matches labels by prefix ignoring case, accents, stroked letters + Turkish ı/İ in every locale (typed accent prefers exact match), reports index via onMatch. Same letter pressed repeatedly cycles matches. Moves nothing itself; pair w/ useListFocus / useGridFocus.',
  paramDescriptions: {
    options: 'config.',
    'options.getItemLabels':
      'item labels in DOM order; null / empty = non-matchable slot, indices stay aligned.',
    'options.onMatch':
      'called w/ matched index so caller focuses / selects (e.g. useListFocus focusItem).',
    'options.getCurrentIndex':
      'index to search from (usually focused item) so repeat presses cycle. negative = nothing current.',
    'options.resetMs': 'ms of inactivity before typed buffer resets.',
    'options.isDisabled': 'whether an index is skipped (e.g. disabled items).',
  },
  returnDescriptions: {
    onKeyDown:
      'keydown handler; true = consumed a printable char, caller can stop its own handling.',
    reset: 'clears pending buffer (e.g. on close).',
  },
  usage: {
    description:
      'Type-to-jump for menus / listboxes / trees. Buffered prefix match w/ APG same-letter cycling; reports index, caller owns focus.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Wire onMatch to existing focus manager (useListFocus.focusItem), do not move focus yourself.',
      },
      {
        guidance: true,
        description:
          'Give it the key event first; fall through to arrow navigation when it returns false.',
      },
      {
        guidance: true,
        description:
          'Pass getCurrentIndex so repeat presses walk matches instead of sticking on first.',
      },
      {
        guidance: false,
        description: 'Use on a text input; field already gets the characters.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useTypeahead",
  "usage": {
    "description": "为集合添加 APG 的 type-to-focus 搜索：可打印按键会被缓冲（暂停后重置），第一个标签以缓冲区开头的项（忽略大小写、重音符号、带斜线的字母 đ ł ø ħ ŧ ƀ 和土耳其语 ı/İ，在所有区域设置中相同；键入的重音符号优先精确匹配）会通过 onMatch 报告。重复按同一个字母会在匹配项之间循环，而不是进一步过滤。它本身不移动任何东西；请将其与集合自身的焦点管理配对使用，最常见的是 useListFocus 或 useGridFocus。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将 onMatch 连接到已有的焦点管理器（useListFocus.focusItem），而不是自行移动焦点。"
      },
      {
        "guidance": true,
        "description": "让它先查看按键事件，仅在其返回 false 时才继续进行方向键导航。"
      },
      {
        "guidance": true,
        "description": "传递 getCurrentIndex，使重复按同一个字母能在匹配项之间遍历，而不是停留在第一个。"
      },
      {
        "guidance": false,
        "description": "不要在文本输入框上使用它；字段已经接收字符，typeahead 会与值冲突。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "配置对象。",
    "options.getItemLabels": "按 DOM 顺序返回项标签。null 或空条目表示不可匹配的槽位，并保持索引与调用方的项对齐。",
    "options.onMatch": "使用匹配项的索引调用，以便调用方聚焦或选择它；通常是 useListFocus 的 focusItem。",
    "options.getCurrentIndex": "搜索起始索引，通常是当前聚焦的项，因此重复按同一个字母会在匹配项之间循环。负值表示没有当前项。",
    "options.resetMs": "键入缓冲区重置前的无活动毫秒数。",
    "options.isDisabled": "是否应跳过某个索引，例如禁用项。"
  },
  "returnDescriptions": {
    "onKeyDown": "Keydown 处理函数。当它消费了一个可打印字符时返回 true，以便调用方停止自己的按键处理。",
    "reset": "清除待处理的缓冲区，例如集合关闭时。"
  }
};
