// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Shortcut',
    required: true,
    description:
      'Group that presents the complete keyboard shortcut and its accessible name.',
  },
  {
    name: 'Key badge',
    required: true,
    description:
      'Painted key badge rendered once for each key in the shortcut.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentBestPractice[]} */
const bestPractices = [
  {
    guidance: true,
    description:
      'Place shortcuts near the action they trigger: in a tooltip, menu item, or inline instruction.',
  },
  {
    guidance: true,
    description:
      "Use mod instead of ctrl or cmd; it automatically adapts to the user's platform.",
  },
  {
    guidance: true,
    description:
      'Let Kbd name the shortcut: screen readers hear the keys as words, such as "Command + K". Kbd ignores an aria-label you pass; to name it from visible text, use aria-labelledby.',
  },
  {
    guidance: false,
    description:
      'Use Kbd as the only way to discover an action; shortcuts should supplement visible controls, not replace them.',
  },
  {
    guidance: false,
    description:
      'Expect Kbd to handle the key press. It only shows the keys; listen for the shortcut in your own code.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Kbd',
  displayName: 'Kbd',
  category: 'Content',
  keywords: [
    'kbd',
    'keyboard',
    'shortcut',
    'hotkey',
    'keybinding',
    'keystroke',
    'keycombo',
    'modifier',
    'accelerator',
  ],
  props: [
    {
      name: 'keys',
      type: 'string',
      description:
        'Keyboard shortcut string. Use "+" to separate keys. Special keys: mod (⌘ on Apple platforms, Ctrl elsewhere), ctrl, alt and shift (Apple symbols on Apple platforms, Ctrl, Alt and Shift text elsewhere), meta (⌘ on Apple platforms, Win elsewhere and before hydration), enter, backspace, escape, tab, up, down, left, right, plus. Aliases: esc for escape and return for enter.',
      required: true,
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'CSS class name for the root element. Prefer xstyle for styling; className is provided for integration with non-StyleX systems.',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description:
        'Inline styles for the root element. Prefer xstyle for styling; inline styles bypass StyleX optimization.',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLSpanElement>',
      description: 'Ref forwarded to the shortcut group element.',
    },
  ],
  theming: {
    targets: [{className: 'astryx-kbd'}],
  },
  usage: {
    anatomy,
    description:
      'Renders a keyboard shortcut as styled key badges. Use Kbd in tooltips, menus, and help text to show key combinations.',
    bestPractices,
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Kbd",
  "displayName": "Kbd",
  "props": [
    {
      "name": "keys",
      "type": "string",
      "description": "键盘快捷键字符串。使用 \"+\" 分隔按键。特殊按键：mod（Apple 平台为 ⌘，其他平台为 Ctrl）、ctrl、alt 和 shift（Apple 平台显示 Apple 符号，其他平台显示 Ctrl、Alt 和 Shift 文本）、meta（Apple 平台为 ⌘，其他平台及水合前为 Win）、enter、backspace、escape、tab、up、down、left、right、plus。别名：esc 表示 escape，return 表示 enter。",
      "required": true
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的返回值：不能是 style={{}} 这样的内联样式对象。"
    },
    {
      "name": "className",
      "type": "string",
      "description": "根元素的 CSS 类名。样式优先使用 xstyle；className 用于与非 StyleX 系统集成。"
    },
    {
      "name": "style",
      "type": "CSSProperties",
      "description": "根元素的内联样式。样式优先使用 xstyle；内联样式会绕过 StyleX 优化。"
    },
    {
      "name": "ref",
      "type": "React.Ref<HTMLSpanElement>",
      "description": "转发到快捷键分组元素的 ref。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-kbd"
      }
    ]
  },
  "usage": {
    "anatomy": [
      {
        "name": "快捷键",
        "required": true,
        "description": "呈现完整键盘快捷键及其无障碍名称的分组。"
      },
      {
        "name": "按键徽标",
        "required": true,
        "description": "为快捷键中的每个按键各渲染一次的绘制按键徽标。"
      }
    ],
    "description": "将键盘快捷键渲染为带样式的按键徽标。在工具提示、菜单和帮助文本中使用 Kbd 展示组合键。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将快捷键放在其所触发的操作附近：工具提示、菜单项或内联说明中。"
      },
      {
        "guidance": true,
        "description": "使用 mod 而非 ctrl 或 cmd；它会自动适应用户的平台。"
      },
      {
        "guidance": true,
        "description": "让 Kbd 为快捷键命名：屏幕阅读器会把按键读作词语，例如 \"Command + K\"。Kbd 会忽略传入的 aria-label；若要基于可见文本命名，请使用 aria-labelledby。"
      },
      {
        "guidance": false,
        "description": "将 Kbd 作为发现操作的唯一方式；快捷键应补充可见控件，而不是取代它们。"
      },
      {
        "guidance": false,
        "description": "指望 Kbd 处理按键。它只显示按键；请在自有代码中监听快捷键。"
      }
    ]
  },
  "propDescriptions": {
    "keys": "键盘快捷键字符串。使用 \"+\" 分隔按键。特殊按键：mod（Apple 平台为 ⌘，其他平台为 Ctrl）、ctrl、alt 和 shift（Apple 平台显示 Apple 符号，其他平台显示 Ctrl、Alt 和 Shift 文本）、meta（Apple 平台为 ⌘，其他平台及水合前为 Win）、enter、backspace、escape、tab、up、down、left、right、plus。别名：esc 表示 escape，return 表示 enter。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的返回值：不能是 style={{}} 这样的内联样式对象。",
    "className": "根元素的 CSS 类名。样式优先使用 xstyle；className 用于与非 StyleX 系统集成。",
    "style": "根元素的内联样式。样式优先使用 xstyle；内联样式会绕过 StyleX 优化。",
    "ref": "转发到快捷键分组元素的 ref。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Renders keyboard shortcut as styled key badges. Use in tooltips, menus + help text to show key combinations.',
  usage: {
    anatomy,
    description:
      'Renders a keyboard shortcut as styled key badges. Use Kbd in tooltips, menus, and help text to show key combinations.',
    bestPractices,
  },
  propDescriptions: {
    keys: 'Shortcut string. "+" separates keys. Special: mod (⌘ on Apple, Ctrl elsewhere), ctrl, alt, shift (Apple symbols on Apple, text elsewhere), meta (⌘ on Apple platforms, Win elsewhere and before hydration), enter, backspace, escape, tab, up, down, left, right, plus. Aliases: esc for escape, return for enter.',
    xstyle:
      'StyleX styles for layout customization. Must be stylex.create() value.',
    className:
      'CSS class for root element. Prefer xstyle; className for non-StyleX integration.',
    style:
      'Inline styles for root element. Prefer xstyle; inline styles bypass StyleX optimization.',
    ref: 'Ref forwarded to shortcut group element.',
  },
};
