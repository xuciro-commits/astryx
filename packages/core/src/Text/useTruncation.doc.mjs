// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useTruncation',
  displayName: 'useTruncation',
  group: 'Text',
  keywords: [
    'truncation',
    'truncate',
    'ellipsis',
    'overflow',
    'line-clamp',
    'clamp',
    'tooltip',
    'full text',
    'text cut off',
    'table cell',
  ],
  params: [
    {
      name: 'options',
      type: 'UseTruncationOptions',
      description: 'Configuration object.',
      required: true,
    },
    {
      name: 'options.maxLines',
      type: 'number',
      description:
        'Maximum number of lines before truncation. 1 detects single-line overflow (scrollWidth against offsetWidth); values above 1 detect a -webkit-line-clamp cut by measuring the real content height with a Range, bypassing the clamped scrollHeight. 0 disables detection: isTruncated stays false and fullText stays empty.',
      required: true,
    },
    {
      name: 'options.isExpanded',
      type: 'boolean',
      description:
        'Pass true while the text is shown in full; the hook keeps reporting whether it is cut off when clamped.',
      default: 'false',
      required: false,
    },
  ],
  returns: [
    {
      name: 'ref',
      type: 'RefCallback<HTMLElement>',
      description:
        'Ref callback to attach to the text element being measured. Re-attaching to another element re-observes it and cleans up the previous observation.',
    },
    {
      name: 'isTruncated',
      type: 'boolean',
      description:
        'Whether the text is currently cut off. Drives composing a Tooltip with the full text: render the tooltip only when this is true, so a cell that fits shows none.',
    },
    {
      name: 'fullText',
      type: 'string',
      description:
        "The element's current text content, captured on every measurement, for the tooltip a truncated cell shows. Follows content changes that resize nothing (a fixed-width status line whose text swaps).",
    },
  ],
  usage: {
    description:
      "Detects whether an element's text is cut off — single-line overflow or clamped to several lines — and gives back the full text, updating when the size or the content changes. Built on a shared ResizeObserver and a shared MutationObserver, so hundreds of table cells create one observer of each kind, and a first measurement runs batched in a microtask after the commit instead of forcing a layout pass per text during mount. Use it wherever a truncated cell should show its full content only when it is actually truncated: compose a Tooltip off isTruncated and fullText instead of always rendering one. Text and Heading build their truncation tooltips on it; reach for it directly when composing truncation feedback into your own component.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Render the full-content Tooltip only when isTruncated is true, and read the tooltip text from fullText: a cell that fits shows no tooltip, and the text always matches what was measured.',
      },
      {
        guidance: true,
        description:
          'Apply the matching clamp yourself next to the hook — white-space: nowrap for maxLines 1, -webkit-line-clamp for more — so what the user sees and what the hook measures stay the same shape.',
      },
      {
        guidance: true,
        description:
          'Reuse one useTruncation instance per measured element; the ref callback cleans up its own observers, so swapping elements is safe.',
      },
      {
        guidance: false,
        description:
          'Compare scrollHeight to offsetHeight yourself for clamped text: with -webkit-line-clamp active browsers report the clamped size, which is exactly the case the Range measurement exists for.',
      },
    ],
  },
  relatedComponents: ['Text', 'Heading', 'Tooltip'],
  importPath: '@astryxdesign/core/Text',
  category: 'text',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Detects whether text is cut off (single-line overflow or -webkit-line-clamp) and returns the full text, updating on size and content changes. Shared Resize/Mutation observers keep hundreds of cells at one observer each; first measurement batches in a microtask after commit.',
  paramDescriptions: {
    options: 'config object.',
    'options.maxLines':
      'lines allowed before truncation; 1 = single-line overflow check, >1 = clamp detection via Range measurement, 0 = off.',
    'options.isExpanded':
      'true while the text is shown in full; keeps reporting whether it is cut off when clamped.',
  },
  returnDescriptions: {
    ref: 'ref callback for the measured text element; swapping elements re-observes and cleans up.',
    isTruncated:
      'true while the text is cut off; gate the full-content Tooltip on it.',
    fullText:
      'current text content for the tooltip; follows content changes that resize nothing.',
  },
  usage: {
    description:
      'Truncation detection + full text for tooltips. Gate a Tooltip on isTruncated and read its text from fullText so only actually-cut cells show one. Shared observers; batched first measurement. Text/Heading build their truncation tooltips on it; use directly when composing truncation feedback yourself.',
    bestPractices: [
      {
        guidance: true,
        description: 'Tooltip only when isTruncated; text from fullText.',
      },
      {
        guidance: true,
        description:
          'Apply the matching clamp (nowrap / line-clamp) next to the hook so view and measurement agree.',
      },
      {
        guidance: true,
        description:
          'One hook instance per measured element; the ref cleans up after itself.',
      },
      {
        guidance: false,
        description:
          'Manual scrollHeight checks on clamped text — browsers report the clamped size.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useTruncation",
  "usage": {
    "description": "检测元素的文本是否被截断——单行溢出或被限制为多行——并返回完整文本，在尺寸或内容变化时更新。基于共享的 ResizeObserver 和共享的 MutationObserver，因此数百个表格单元格每种只创建一个观察器；首次测量在提交后的微任务中批量执行，而不是在挂载期间为每段文本强制一次布局。凡是在被截断的单元格才应显示完整内容的场景都可用它：基于 `isTruncated` 和 `fullText` 组合 Tooltip，而不是始终渲染。Text 和 Heading 的截断 Tooltip 就构建在它之上；在将自己的截断反馈组合进组件时，可直接使用它。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "仅当 `isTruncated` 为 true 时渲染显示完整内容的 Tooltip，并从 `fullText` 读取工具提示文本：放得下的单元格不显示 Tooltip，文本也始终与测量结果一致。"
      },
      {
        "guidance": true,
        "description": "在 Hook 旁边自行应用匹配的截断——`maxLines` 为 1 时用 `white-space: nowrap`，更多行时用 `-webkit-line-clamp`——使用户看到的内容与 Hook 测量的内容保持相同形状。"
      },
      {
        "guidance": true,
        "description": "每个被测量元素复用一个 `useTruncation` 实例；ref 回调会清理自己的观察器，因此替换元素是安全的。"
      },
      {
        "guidance": false,
        "description": "对受限文本自行比较 `scrollHeight` 与 `offsetHeight`：当 `-webkit-line-clamp` 生效时，浏览器报告的是截断后的尺寸，而这正是 Range 测量存在的场景。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "配置对象。",
    "options.maxLines": "截断前的最大行数。1 检测单行溢出（`scrollWidth` 对比 `offsetWidth`）；大于 1 的值通过 Range 测量真实内容高度来检测 `-webkit-line-clamp` 的截断，绕过被截断的 `scrollHeight`。0 禁用检测：`isTruncated` 始终为 false，`fullText` 始终为空。",
    "options.isExpanded": "当文本完整显示时传入 true；被截断时 Hook 仍会继续报告是否被截断。"
  },
  "returnDescriptions": {
    "ref": "附加到被测量文本元素的 ref 回调。附加到另一个元素会重新观察它，并清理之前的观察。",
    "isTruncated": "文本当前是否被截断。用于组合显示完整文本的 Tooltip：仅当它为 true 时渲染工具提示，使放得下的单元格不显示。",
    "fullText": "元素当前的文本内容，在每次测量时捕获，供被截断单元格的 Tooltip 使用。会跟随不改变尺寸的内容变化（例如固定宽度状态行中文字切换）。"
  }
};
