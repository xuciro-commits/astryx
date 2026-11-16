// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useStreamingText',
  displayName: 'useStreamingText',
  keywords: ['streaming', 'text', 'typewriter', 'animation', 'ai', 'chat', 'markdown', 'reveal', 'llm', 'chunked'],
  params: [
    {
      name: 'targetText',
      type: 'string',
      description: 'The full target text to reveal. As new chunks arrive, update this value with the accumulated text.',
      required: true,
    },
    {
      name: 'isStreaming',
      type: 'boolean',
      description: 'Whether text is currently being streamed. When false, the hook returns the full targetText immediately.',
      required: true,
    },
    {
      name: 'options',
      type: 'UseStreamingTextOptions',
      description: 'Optional configuration for streaming behavior.',
      required: false,
    },
    {
      name: 'options.speed',
      type: "'natural' | 'fast' | 'instant'",
      description: "Speed preset for text reveal. 'natural' is steady ~2 chars/frame, 'fast' scales with backlog ~4 chars/frame, 'instant' returns full text with no animation.",
      default: "'natural'",
      required: false,
    },
  ],
  returns: [
    {
      name: 'displayedText',
      type: 'string',
      description: 'The portion of targetText to render. Grows steadily toward the full targetText during streaming, or equals targetText when not streaming.',
    },
  ],
  usage: {
    description:
      'Smooths bursty streamed text into a steady character-by-character reveal using requestAnimationFrame. Decouples arrival rate from display rate. Advances on word and syntax boundaries to avoid slicing mid-markdown or mid-word, preventing visual glitches with markdown renderers. Animation timing derives from Astryx motion tokens via useTheme when available, with sensible fallbacks outside a theme provider. Snaps to full text when isStreaming becomes false.',
    bestPractices: [
      { guidance: true, description: 'Pass the accumulated text (not individual chunks) as targetText; the hook handles incremental reveal internally.' },
      { guidance: true, description: 'Set isStreaming to false when the stream completes to snap to the final text.' },
      { guidance: true, description: "Use speed='instant' for non-animated contexts like search results or when reduced motion is preferred." },
      { guidance: false, description: 'Use for static text that does not change; the hook adds unnecessary overhead for non-streaming content.' },
    ],
  },
  relatedComponents: ['Markdown'],
  relatedHooks: [],
  importPath: '@astryxdesign/core/hooks',
  category: 'streaming',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Smooths bursty streamed text into steady character-by-character reveal using requestAnimationFrame. Decouples arrival rate from display rate. Advances on word + syntax boundaries to avoid slicing mid-markdown / mid-word, preventing visual glitches w/ markdown renderers. Animation timing derives from Astryx motion tokens via useTheme when available, w/ sensible fallbacks outside theme provider. Snaps to full text when isStreaming becomes false.',
  paramDescriptions: {
    targetText: 'full target text to reveal. As new chunks arrive, update this value w/ accumulated text.',
    isStreaming: 'whether text currently being streamed. When false, hook returns full targetText immediately.',
    options: 'optional config for streaming behavior.',
    'options.speed': "speed preset for text reveal. 'natural' is steady ~2 chars/frame, 'fast' scales w/ backlog ~4 chars/frame, 'instant' returns full text w/ no animation.",
  },
  returnDescriptions: {
    displayedText: 'portion of targetText to render. Grows steadily toward full targetText during streaming / equals targetText when not streaming.',
  },
  usage: {
    description:
      'Smooths bursty streamed text into steady character-by-character reveal using requestAnimationFrame. Decouples arrival rate from display rate. Advances on word + syntax boundaries to avoid slicing mid-markdown / mid-word, preventing visual glitches w/ markdown renderers. Animation timing derives from Astryx motion tokens via useTheme when available, w/ sensible fallbacks outside theme provider. Snaps to full text when isStreaming becomes false.',
    bestPractices: [
      { guidance: true, description: 'Pass accumulated text (not individual chunks) as targetText; hook handles incremental reveal internally.' },
      { guidance: true, description: 'Set isStreaming to false when stream completes to snap to final text.' },
      { guidance: true, description: "Use speed='instant' for non-animated contexts like search results / when reduced motion preferred." },
      { guidance: false, description: 'Use for static text that does not change; hook adds unnecessary overhead for non-streaming content.' },
    ],
  },
};

export const docsZh = {
  "name": "useStreamingText",
  "usage": {
    "description": "使用 requestAnimationFrame 将突发式流式文本平滑为稳定的逐字符显示。将到达速率与显示速率解耦。按单词和语法边界推进，避免在 Markdown 或单词中间截断，从而防止 Markdown 渲染器出现视觉故障。动画时序在可用时通过 useTheme 从 Astryx 动效令牌派生，在主题 Provider 之外则使用合理回退。当 isStreaming 变为 false 时直接跳到完整文本。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将累积文本（而非单个块）作为 targetText 传入；该 Hook 在内部处理增量显示。"
      },
      {
        "guidance": true,
        "description": "流完成时将 isStreaming 设置为 false，以直接跳到最终文本。"
      },
      {
        "guidance": true,
        "description": "对于搜索结果等非动画场景或偏好减少动效时，使用 speed='instant'。"
      },
      {
        "guidance": false,
        "description": "不要用于不会变化的静态文本；该 Hook 会为非流式内容增加不必要的开销。"
      }
    ]
  },
  "paramDescriptions": {
    "targetText": "要显示的完整目标文本。随着新块到达，用累积文本更新此值。",
    "isStreaming": "文本当前是否正在流式传输。为 false 时，该 Hook 立即返回完整的 targetText。",
    "options": "流式行为的可选配置。",
    "options.speed": "文本显示的速度预设。'natural' 稳定约 2 字符/帧，'fast' 随积压量扩展约 4 字符/帧，'instant' 返回完整文本且无动画。"
  },
  "returnDescriptions": {
    "displayedText": "要渲染的 targetText 部分。流式传输期间稳步增长至完整 targetText，非流式传输时等于 targetText。"
  }
};
