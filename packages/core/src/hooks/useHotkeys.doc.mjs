// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useHotkeys',
  displayName: 'useHotkeys',
  keywords: ['hotkey', 'shortcut', 'keyboard', 'keydown', 'command', 'palette', 'mod', 'cmd', 'ctrl', 'kbd'],
  params: [
    {
      name: 'hotkeys',
      type: 'Hotkey[]',
      description:
        'Shortcut registrations. Each entry: `{ keys, onPress, allowInInputs?, isDisabled? }`. `keys` is a "+"-separated combo like "mod+k", "?", "escape"; "mod" is ⌘ on macOS and Ctrl elsewhere. Register a punctuation key that shift changes as the character it produces: "?", not "shift+/", because the final key is compared against `event.key`. `onPress` receives the KeyboardEvent after preventDefault(). `allowInInputs` (default false) lets the hotkey fire while typing in inputs/textareas/selects/contenteditable. `isDisabled` temporarily disables the entry.',
      required: true,
    },
  ],
  returns: [],
  usage: {
    description:
      'Registers global keyboard shortcuts with a single window keydown listener per hook instance. Handlers live in a ref, so re-renders never re-subscribe. Skips events from typing targets (input, textarea, select, contenteditable) unless allowInInputs, skips defaultPrevented events, and calls preventDefault() on match. SSR-safe.',
    bestPractices: [
      { guidance: true, description: 'Use for app-level shortcuts like command palettes (mod+k), help overlays ("?"), and navigation keys.' },
      { guidance: true, description: 'Pair with the Kbd component to display the same combo you register; both resolve "mod" per platform identically.' },
      { guidance: true, description: 'Use isDisabled to suspend shortcuts while a modal or wizard owns the keyboard, instead of unmounting the hook.' },
      { guidance: false, description: 'Use for focus-scoped keyboard navigation inside a widget; use useListFocus or useGridFocus instead.' },
    ],
  },
  relatedComponents: ['Kbd'],
  relatedHooks: ['useListFocus', 'useGridFocus'],
  importPath: '@astryxdesign/core/hooks',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Global keyboard shortcuts w/ one window keydown listener per hook instance. Handlers kept in ref; re-renders never re-subscribe. Skips typing targets (input/textarea/select/contenteditable) unless allowInInputs, skips defaultPrevented and IME key events (even with allowInInputs), preventDefault() on match. "mod" = ⌘ on macOS, Ctrl elsewhere. SSR-safe.',
  paramDescriptions: {
    hotkeys:
      'array of { keys, onPress, allowInInputs?, isDisabled? }. keys = "+"-separated combo ("mod+k", "?", "escape"). Shifted punctuation = produced char ("?", not "shift+/"); final key compared vs event.key.',
  },
  usage: {
    description:
      'Global keyboard shortcuts w/ one window keydown listener per hook instance. Handlers kept in ref; re-renders never re-subscribe. Skips typing targets unless allowInInputs, skips defaultPrevented and IME key events (even with allowInInputs), preventDefault() on match. SSR-safe.',
    bestPractices: [
      { guidance: true, description: 'Use for app-level shortcuts: command palettes (mod+k), help overlays ("?"), navigation keys.' },
      { guidance: true, description: 'Pair w/ Kbd component to display same combo registered; both resolve "mod" per platform identically.' },
      { guidance: true, description: 'Use isDisabled to suspend shortcuts while modal/wizard owns keyboard, instead of unmounting hook.' },
      { guidance: false, description: 'Use for focus-scoped keyboard nav inside widget; use useListFocus / useGridFocus instead.' },
    ],
  },
};

export const docsZh = {
  "name": "useHotkeys",
  "usage": {
    "description": "注册全局键盘快捷键，每个 Hook 实例使用一个 window keydown 监听器。处理程序存放在 ref 中，因此重新渲染不会重新订阅。默认跳过来自输入目标（input、textarea、select、contenteditable）的事件，除非设置 allowInInputs；跳过 defaultPrevented 的事件，并在匹配时调用 preventDefault()。SSR 安全。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于应用级快捷键，例如命令面板（mod+k）、帮助覆盖层（\"?\"）和导航键。"
      },
      {
        "guidance": true,
        "description": "与 Kbd 组件配合使用，显示与所注册相同的组合键；两者在各平台上解析 \"mod\" 的方式一致。"
      },
      {
        "guidance": true,
        "description": "当模态框或向导占用键盘时，使用 isDisabled 暂停快捷键，而不是卸载 Hook。"
      },
      {
        "guidance": false,
        "description": "不要用于小部件内受焦点限制的键盘导航；请改用 useListFocus 或 useGridFocus。"
      }
    ]
  },
  "paramDescriptions": {
    "hotkeys": "快捷键注册。每个条目：`{ keys, onPress, allowInInputs?, isDisabled? }`。`keys` 是用 \"+\" 分隔的组合键，例如 \"mod+k\"、\"?\"、\"escape\"；\"mod\" 在 macOS 上是 ⌘，在其他平台上是 Ctrl。对于按下 shift 后会改变输出的标点键，请按它产生的字符注册：\"?\"，而不是 \"shift+/\"，因为最后一个键会与 `event.key` 比较。`onPress` 在 preventDefault() 之后接收 KeyboardEvent。`allowInInputs`（默认 false）允许在 input/textarea/select/contenteditable 中输入时触发快捷键。`isDisabled` 临时禁用该条目。"
  },
  "returnDescriptions": {}
};
