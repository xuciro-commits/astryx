// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useAnnounce',
  displayName: 'useAnnounce',
  keywords: [
    'announce',
    'live region',
    'aria-live',
    'screen reader',
    'accessibility',
    'a11y',
    'status',
    'alert',
    'polite',
    'assertive',
    'visually hidden',
    'wcag',
    'replace',
    'result count',
  ],
  params: [
    {
      name: 'options',
      type: 'UseAnnounceOptions',
      description: 'Configuration object.',
      required: false,
    },
    {
      name: 'options.hasReplace',
      type: 'boolean',
      description:
        "The instance states one current state, such as a search's result count: each message it writes withdraws the instance's previous message while that one has not been spoken yet, whatever their politeness, and is spoken at its own politeness. A message already spoken stays. Messages from other instances, and from instances without hasReplace, still join. Give each state a component reports its own instance, for example one for the result count and one for selection changes.",
      default: 'false',
      required: false,
    },
  ],
  returns: [
    {
      name: 'announce',
      type: '(message: string, politeness?: "polite" | "assertive") => void',
      description:
        'Speaks a message through the live region the caller can be heard from: the shared one on the page body, or, when the calling component is rendered inside an open Astryx modal (Dialog, modal BottomSheet, modal Drawer, Lightbox, MobileNav, CommandPalette), a persistent region inside that modal, since a native modal hides the page-body region from assistive technology. Politeness defaults to "polite"; messages announced in the same frame are joined, in order, into one announcement, and an identical repeat is kept once, except that each message from a hasReplace instance replaces the previous message of that instance not yet spoken. An empty message clears any lingering status, including joined messages not yet spoken, instead of announcing.',
    },
  ],
  usage: {
    description:
      'Imperatively announces a message to screen readers through a visually-hidden live region. Use it for state that is only conveyed visually; search result counts, "no results", loading and saved confirmations, validation errors (WCAG 4.1.3 Status Messages). The polite and assertive regions are created empty on first use and stay mounted, which is what makes announcements reliable: most screen readers ignore a live region that is inserted together with its content. Each message is cleared a couple of seconds after it is announced so stale status does not linger in the accessibility tree. A message is delivered where its caller is: from inside an open Astryx modal it goes to a region inside that modal and is heard there with no change to the calling code; a message sent just as the modal is dismissed is delivered through whatever is exposed afterwards rather than lost. A call made outside the modal, even by the component that renders it, uses the page-body region.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Reach for this instead of hand-rolling an aria-live div; a region rendered with its content usually does not announce at all.',
      },
      {
        guidance: true,
        description:
          'Keep "polite" for status and result counts; reserve "assertive" for errors and time-sensitive alerts, since it interrupts whatever the screen reader is saying.',
      },
      {
        guidance: true,
        description:
          'Announce the outcome, not the interaction; "12 results" rather than "search ran".',
      },
      {
        guidance: true,
        description:
          'Send a value that keeps changing, such as a result count as the user types, through its own useAnnounce({hasReplace: true}) instance, so input faster than a frame says only the latest count.',
      },
      {
        guidance: false,
        description:
          'Announce content that is already visible and correctly labeled in the DOM; that doubles up for screen reader users.',
      },
    ],
  },
  relatedComponents: ['VisuallyHidden', 'Toast'],
  relatedHooks: ['useClipboard'],
  importPath: '@astryxdesign/core/hooks',
  category: 'accessibility',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Imperative screen-reader announcements via a visually-hidden live region: the page-body one, or one inside the open Astryx modal the caller is rendered in (a native modal hides the body region). Polite + assertive regions created empty on first use + kept mounted, so announcements are reliable (most AT ignore a live region inserted together w/ its content). Messages auto-clear after ~2s.',
  paramDescriptions: {
    options: 'config object.',
    'options.hasReplace':
      "instance states one current state (e.g. a search's result count): each message withdraws the instance's previous one not yet spoken, whatever politeness, spoken at its own; spoken messages stay; other instances + instances w/o hasReplace still join. Default false.",
  },
  returnDescriptions: {
    announce:
      'speaks message through the live region the caller is heard from: page body, or inside the open Astryx modal (Dialog, modal BottomSheet/Drawer, Lightbox, MobileNav, CommandPalette) the calling component is rendered in. politeness defaults "polite"; same-frame messages join in order, identical repeat kept once, except a hasReplace instance replaces its own not-yet-spoken message; empty message clears lingering + not-yet-spoken status.',
  },
  usage: {
    description:
      'Announces visual-only state to screen readers: result counts, "no results", loading / saved confirmations, validation errors (WCAG 4.1.3). Regions mounted empty up front, so updates announce; text auto-clears so stale status does not linger in a11y tree.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use instead of hand-rolled aria-live div; region rendered w/ its content usually does not announce.',
      },
      {
        guidance: true,
        description:
          '"polite" for status / counts; "assertive" only for errors + time-sensitive alerts (it interrupts).',
      },
      {
        guidance: true,
        description:
          'Announce outcome, not interaction; "12 results", not "search ran".',
      },
      {
        guidance: true,
        description:
          'Changing value (result count while typing): own useAnnounce({hasReplace: true}) instance, so faster-than-a-frame input says only the latest.',
      },
      {
        guidance: false,
        description:
          'Announce content already visible + labeled in DOM; doubles up for AT users.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useAnnounce",
  "usage": {
    "description": "通过视觉隐藏的 live region 以命令式方式向屏幕阅读器朗读消息。用于仅通过视觉传达的状态：搜索结果计数、“无结果”、加载和已保存确认、验证错误（WCAG 4.1.3 Status Messages）。polite 和 assertive 区域在首次使用时创建为空并保持挂载，这正是朗读可靠的原因：大多数屏幕阅读器会忽略与内容一起插入的 live region。每条消息在朗读后几秒会被清除，以免过期状态留在无障碍树中。消息会送达调用方所在的位置：从打开的 Astryx 模态框内部调用时，它会进入该模态框内的区域并在那里被听到，调用代码无需改动；在模态框关闭时发送的消息会通过之后暴露的任何区域送达，而不会丢失。在模态框之外发起的调用，即使由渲染该模态框的组件发起，也会使用页面主体区域。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "优先使用它，而不是手写 aria-live div；与内容一起渲染的区域通常根本不会朗读。"
      },
      {
        "guidance": true,
        "description": "状态和结果计数使用 “polite”；错误和对时间敏感的警报保留给 “assertive”，因为它会打断屏幕阅读器正在朗读的内容。"
      },
      {
        "guidance": true,
        "description": "朗读结果，而不是交互；“12 results” 而不是 “search ran”。"
      },
      {
        "guidance": true,
        "description": "通过其自己的 useAnnounce({hasReplace: true}) 实例发送持续变化的值（例如用户输入时的结果计数），这样比一帧更快的输入只会朗读最新计数。"
      },
      {
        "guidance": false,
        "description": "不要朗读 DOM 中已经可见且标注正确的内容；这会让屏幕阅读器用户重复听到。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "配置对象。",
    "options.hasReplace": "该实例表示一个当前状态，例如搜索的结果计数：它写入的每条消息都会撤回该实例尚未朗读的上一条消息，无论两者的礼貌级别如何，并以自己的礼貌级别朗读。已经朗读过的消息会保留。来自其他实例以及未设置 hasReplace 的实例的消息仍会加入。为组件上报的每种状态各分配一个实例，例如一个用于结果计数，一个用于选择变化。"
  },
  "returnDescriptions": {
    "announce": "通过调用方能够被听到的 live region 朗读消息：页面主体上的共享区域；或者，当调用组件渲染在打开的 Astryx 模态框（Dialog、模态 BottomSheet、模态 Drawer、Lightbox、MobileNav、CommandPalette）内时，该模态框内的持久区域，因为原生模态框会向辅助技术隐藏页面主体区域。礼貌级别默认为 “polite”；同一帧内朗读的消息会按顺序合并为一次朗读，完全相同的重复只保留一次，但 hasReplace 实例的每条消息会替换该实例尚未朗读的上一条消息。空消息会清除任何残留状态（包括尚未朗读的合并消息），而不是进行朗读。"
  }
};
