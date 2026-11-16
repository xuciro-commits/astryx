// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useInteractiveRole',
  displayName: 'useInteractiveRole',
  keywords: [
    'role',
    'polymorphic',
    'link',
    'button',
    'inert',
    'href',
    'onClick',
    'element type',
    'as',
    'trigger',
    'semantics',
    'accessibility',
    'a11y',
  ],
  params: [
    {
      name: 'options',
      type: 'UseInteractiveRoleOptions',
      description: 'The interactivity inputs the component received.',
      required: true,
    },
    {
      name: 'options.href',
      type: 'string',
      description:
        'URL for navigation. Highest priority: with an href the component is a link.',
    },
    {
      name: 'options.onClick',
      type: '((...args: never[]) => unknown) | null',
      description:
        'Click handler. Resolves to a button, ahead of any context-provided role.',
    },
    {
      name: 'options.isDisabled',
      type: 'boolean',
      description:
        'When true, href is ignored for role resolution (a disabled link is an anti-pattern), so the role comes from onClick, then context, then inert.',
      default: 'false',
    },
  ],
  returns: [
    {
      name: 'role',
      type: "'link' | 'button' | 'inert'",
      description:
        'The element the component should render: an anchor, a button, or a non-interactive span/div.',
    },
  ],
  usage: {
    description:
      'Resolves what a polymorphic component should render as, in one place: href wins, then onClick, then an interactive trigger context supplied by a parent (Popover, DropdownMenu and friends), then inert. Use it in any component that is sometimes a link, sometimes a button, and sometimes plain content; Token, Thumbnail, Item and ClickableCard all do. Because context is part of the resolution, a component built on it becomes a valid trigger for new surfaces without changing.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Switch on the returned role to pick the element, and render an anchor only for "link" so keyboard and middle-click behavior come from the platform.',
      },
      {
        guidance: true,
        description:
          'Pass isDisabled through rather than dropping the href yourself; the hook already keeps disabled links out of the tab order.',
      },
      {
        guidance: false,
        description:
          'Add another ad-hoc href/onClick precedence check in a component; new trigger contexts are added here so every consumer inherits them.',
      },
    ],
  },
  relatedComponents: ['Token', 'Thumbnail', 'Item', 'ClickableCard'],
  relatedHooks: ['useClickableContainer'],
  importPath: '@astryxdesign/core/hooks',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Resolves what a polymorphic component renders as: href -> link, onClick -> button, interactive trigger context -> its role, else inert. Single place the precedence lives.',
  paramDescriptions: {
    options: 'interactivity inputs the component received.',
    'options.href': 'navigation URL; highest priority.',
    'options.onClick': 'click handler; button, ahead of context role.',
    'options.isDisabled':
      'true = href ignored for resolution (disabled link is anti-pattern); falls to onClick / context / inert.',
  },
  returnDescriptions: {
    role: "element to render: 'link' (anchor), 'button', or 'inert' (span/div).",
  },
  usage: {
    description:
      'For components that are sometimes link, sometimes button, sometimes plain content (Token, Thumbnail, Item, ClickableCard). Context-aware, so consumers become valid triggers for new surfaces w/o changing.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Switch on returned role; render a real anchor for "link" so platform keyboard / middle-click behavior applies.',
      },
      {
        guidance: true,
        description:
          'Pass isDisabled through instead of dropping href yourself.',
      },
      {
        guidance: false,
        description:
          'Re-implement href/onClick precedence per component; new trigger contexts are added here.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useInteractiveRole",
  "usage": {
    "description": "在一个地方解析多态组件应渲染成什么：`href` 优先，其次是 `onClick`，然后是父级（Popover、DropdownMenu 等）提供的交互式触发上下文，最后是惰性内容。凡是时而作为链接、时而作为按钮、时而作为普通内容的组件都可以使用它；Token、Thumbnail、Item 和 ClickableCard 都是如此。由于上下文是解析的一部分，基于它构建的组件无需改动即可成为新浮层的有效触发器。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "根据返回的 role 选择元素，并且只为 \"link\" 渲染锚点，这样键盘和中键点击行为都由平台提供。"
      },
      {
        "guidance": true,
        "description": "直接传递 isDisabled，而不要自行丢弃 href；该 Hook 已经会让禁用的链接脱离 Tab 顺序。"
      },
      {
        "guidance": false,
        "description": "不要在组件中再添加临时的 href/onClick 优先级判断；新的触发上下文会在这里添加，以便所有使用方都能继承。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "组件收到的交互性输入。",
    "options.href": "用于导航的 URL。优先级最高：提供 href 时组件即为链接。",
    "options.onClick": "点击处理函数。会解析为按钮，优先于任何由上下文提供的角色。",
    "options.isDisabled": "为 true 时，角色解析会忽略 href（禁用的链接是一种反模式），因此角色依次由 onClick、上下文、惰性内容决定。"
  },
  "returnDescriptions": {
    "role": "组件应渲染的元素：锚点、按钮，或非交互的 span/div。"
  }
};
