// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useClipboard',
  displayName: 'useClipboard',
  keywords: [
    'clipboard', 'copy', 'copied', 'paste', 'writeText', 'copy-to-clipboard',
    'copy button', 'announce', 'a11y',
  ],
  params: [
    {
      name: 'options',
      type: 'UseClipboardOptions',
      description: 'Configuration object.',
      required: false,
    },
    {
      name: 'options.announce',
      type: 'string',
      description:
        'Message announced to a polite live region on a successful copy. A swapped aria-label alone is not reliably announced, so pass the localized confirmation (e.g. "Copied") to have it spoken. Omit to skip the announcement.',
      required: false,
    },
    {
      name: 'options.resetAfterMs',
      type: 'number',
      description:
        'Milliseconds isCopied stays true after a successful copy before reverting.',
      default: '2000',
      required: false,
    },
  ],
  returns: [
    {
      name: 'copy',
      type: '(text: string) => Promise<boolean>',
      description:
        'Writes text to the clipboard. On success flips isCopied to true, announces the configured message, restarts the reset timer, and resolves true. A clipboard rejection is a silent no-op that leaves the copied state unchanged and resolves false.',
    },
    {
      name: 'isCopied',
      type: 'boolean',
      description:
        'True for resetAfterMs after the most recent successful copy, then reverts. Drive the copied confirmation (e.g. a copy → check icon flip) off this.',
    },
  ],
  usage: {
    description:
      'Copy-to-clipboard behavior: the clipboard write, a transient isCopied flag with its own reset timer, and an optional polite screen-reader announcement. Extracted so every copy affordance is a thin control over one implementation instead of re-deriving the timer and announcement. Rapid re-copies restart the reset timer so the confirmation always lasts the full duration, and the timer is cleaned up on unmount. CodeBlock and Timestamp build their built-in copy buttons on it; reach for it directly when building a copy affordance that is not a plain icon button (a menu item, a labeled text button, a copy-on-click value chip).',
    bestPractices: [
      { guidance: true, description: 'Drive the copied confirmation (copy → check icon, label swap) off the returned isCopied flag rather than tracking your own state.' },
      { guidance: true, description: 'Pass a localized announce message so the copy is spoken by screen readers; swapping the button aria-label alone is not reliably announced.' },
      { guidance: true, description: 'For the common compact icon copy button, render a ghost IconButton with a "Copy" tooltip and wire onClick to copy(); the tooltip stays "Copy" and the icon flip is the confirmation.' },
      { guidance: false, description: 'Track a separate copied useState alongside the hook; isCopied already reflects the copied window and resets itself.' },
    ],
  },
  relatedComponents: ['CodeBlock', 'Timestamp', 'IconButton'],
  relatedHooks: ['useAnnounce'],
  importPath: '@astryxdesign/core/hooks',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Copy-to-clipboard behavior: clipboard write + transient isCopied flag with reset timer + optional polite SR announcement. One implementation shared by copy affordances instead of re-deriving timer/announce. Rapid re-copies restart the timer; timer cleaned up on unmount. CodeBlock/Timestamp build their copy buttons on it.',
  paramDescriptions: {
    options: 'config object.',
    'options.announce': 'polite live-region message on successful copy (e.g. "Copied"); aria-label swap alone is not reliably announced. Omit to skip.',
    'options.resetAfterMs': 'ms isCopied stays true after a copy before reverting.',
  },
  returnDescriptions: {
    copy: '(text) => Promise<boolean>: writes text, flips isCopied, announces, restarts reset timer, resolves true; silent no-op resolving false on rejection.',
    isCopied: 'true for resetAfterMs after the last successful copy; drive the copy → check confirmation off it.',
  },
  usage: {
    description:
      'Copy-to-clipboard behavior (write + isCopied flag with reset timer + optional polite SR announce). Thin controls over one implementation. Rapid re-copies restart the timer; cleaned up on unmount. Use directly for copy affordances that are not plain icon buttons (menu item, labeled text button, value chip).',
    bestPractices: [
      { guidance: true, description: 'Drive the copy → check confirmation off the returned isCopied, not your own state.' },
      { guidance: true, description: 'Pass a localized announce so the copy is spoken (aria-label swap alone is not reliably announced).' },
      { guidance: true, description: 'For a compact icon copy button, use a ghost IconButton with a "Copy" tooltip and wire onClick to copy(); the tooltip stays "Copy" and the icon flip is the confirmation.' },
      { guidance: false, description: 'Track a separate copied useState alongside the hook.' },
    ],
  },
};

export const docsZh = {
  "name": "useClipboard",
  "usage": {
    "description": "复制到剪贴板的行为：剪贴板写入、带有自身重置计时器的瞬态 isCopied 标志，以及可选的礼貌屏幕阅读器播报。将其提取出来，使每个复制功能都成为同一实现的轻量控件，而不必重新推导计时器和播报逻辑。快速重复复制会重启重置计时器，因此确认提示始终持续完整时长，并且计时器会在卸载时清理。CodeBlock 和 Timestamp 基于它构建内置复制按钮；当构建不是普通图标按钮的复制功能（菜单项、带标签的文本按钮、点击即复制的值标签）时，可直接使用它。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "根据返回的 isCopied 标志驱动复制确认（复制 → 勾选图标、标签切换），而不是自行跟踪状态。"
      },
      {
        "guidance": true,
        "description": "传入本地化的播报消息，让屏幕阅读器读出复制结果；仅切换按钮 aria-label 并不能可靠地播报。"
      },
      {
        "guidance": true,
        "description": "对于常见的紧凑图标复制按钮，渲染一个带“Copy”工具提示的 ghost IconButton，并将 onClick 连接到 copy()；工具提示保持“Copy”，图标翻转即是确认。"
      },
      {
        "guidance": false,
        "description": "不要在 Hook 之外另行跟踪 copied useState；isCopied 已经反映复制窗口并会自行重置。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "配置对象。",
    "options.announce": "成功复制后向礼貌实时区域播报的消息。仅切换 aria-label 并不能可靠播报，因此请传入本地化的确认文本（例如“Copied”）以便朗读。省略则跳过播报。",
    "options.resetAfterMs": "成功复制后 isCopied 保持为 true 的毫秒数，之后恢复。"
  },
  "returnDescriptions": {
    "copy": "将文本写入剪贴板。成功时将 isCopied 翻转为 true，播报配置的消息，重启重置计时器，并 resolve 为 true。剪贴板拒绝时会静默无操作，保持复制状态不变，并 resolve 为 false。",
    "isCopied": "在最近一次成功复制后 resetAfterMs 期间为 true，之后恢复。据此驱动复制确认（例如复制 → 勾选图标翻转）。"
  }
};
