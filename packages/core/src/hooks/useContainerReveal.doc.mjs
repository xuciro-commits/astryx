// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useContainerReveal',
  displayName: 'useContainerReveal',
  keywords: ['reveal', 'hover', 'focus', 'container', 'row', 'actions', 'overlay', 'conceal', 'hidden', 'show'],
  params: [
    {
      name: 'options',
      type: 'UseContainerRevealOptions',
      description: 'Configuration object for the reveal container. Optional.',
      required: false,
    },
    {
      name: 'options.isEnabled',
      type: 'boolean',
      description: 'When false the hook is inert: the container gets no styles and content getters return no styles, so content is always shown. Read on every render, so a component can flip it after mount (e.g. revealOn === "hover").',
      default: 'true',
      required: false,
    },
  ],
  returns: [
    {
      name: 'getContainerProps',
      type: '(options?: ContainerRevealOptions) => {className?: string; style?: CSSProperties}',
      description: 'Spread onto the container whose hover/focus-within drives the reveal. Accepts hoverDelay (ms the pointer must dwell before the reveal starts: a hover-intent gate like Tooltip\'s and HoverCard\'s delay, so a cursor sweeping across a list leaves nothing painted behind it) and forceState ("active" | "inactive") to pin the trigger state when a caller owns it: a motion gate, a scroll, or a row whose menu is open. "inactive" still yields to keyboard focus and coarse pointers.',
    },
    {
      name: 'getContentRevealProps',
      type: '(options?: ContentRevealOptions) => {className?: string; style?: CSSProperties}',
      description: 'Spread onto each revealed / concealed child. Accepts isRevealInverted to conceal-on-hover instead of reveal-on-hover, isLayoutPreserved to reserve the layout box while hidden (opacity-only) and avoid layout shift, and forceVisibility ("shown" | "hidden") to pin this one element\'s appearance whatever the container is doing. "hidden" yields to focus.',
    },
  ],
  usage: {
    description:
      'A headless hover/focus reveal primitive. Gives a container a scoped trigger that reveals (or conceals) content inside it when the container is hovered or receives keyboard focus: the classic "row actions appear on hover" pattern. The reveal is CSS-only: no hover state lives in React and hovering never triggers a re-render. The caller authors no StyleX for the reveal itself; the hook hands out the container and content styles, and a nested container shadows its ancestor, so nested containers never leak hover/focus into one another. Accessible by construction: revealed content is visually hidden at rest with position and opacity (never display:none), so it stays mounted, keeps its place in the tab order, and is announced to assistive technology; it reveals on :focus-within so keyboard users see it when tabbing in, stays visible under a coarse primary pointer (never gated behind hover there), and honors prefers-reduced-motion.',
    bestPractices: [
      { guidance: true, description: 'Destructure getContainerProps and getContentRevealProps; spread getContainerProps() on the container (via mergeProps with your own stylex.props) and getContentRevealProps() on the content to reveal.' },
      { guidance: true, description: 'Use for secondary affordances: reveal-on-hover row actions (edit/copy/remove on list or table rows) and overlay controls on a card or media tile (e.g. Thumbnail\'s remove button).' },
      { guidance: true, description: 'Gate the reveal with isEnabled when a consumer prop decides whether content is revealed on hover or always shown; it can change at any time.' },
      { guidance: true, description: 'Pass isLayoutPreserved for absolutely-positioned or overlay content to reserve its box and avoid layout shift when it appears.' },
      { guidance: true, description: 'Set a hoverDelay (100-250ms) on rows in a long list, so a cursor travelling across the list does not light up every row it passes; keyboard and touch still reveal immediately.' },
      { guidance: true, description: 'Reach for forceState when something other than the pointer owns the interaction (a drag, a scroll or motion gate, an open row menu), and forceVisibility when just one element should ignore the container.' },
      { guidance: false, description: 'Reach past the API into the hook\'s private custom properties (--_reveal-opacity and friends) to suppress a reveal; use forceState / forceVisibility, which survive a rename.' },
      { guidance: false, description: 'Use it to hide content that must always be discoverable; keep essential actions visible instead of gating them behind hover.' },
    ],
  },
  relatedComponents: ['Thumbnail'],
  relatedHooks: ['useClickableContainer'],
  importPath: '@astryxdesign/core/hooks',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Headless hover/focus reveal primitive. Gives a container a scoped trigger that reveals (or conceals) content inside it on hover / keyboard focus: the "row actions appear on hover" pattern. CSS-only: no hover state in React, no re-render on hover. Caller authors no StyleX; hook hands out container + content styles; a nested container shadows its ancestor, so nested containers never leak hover/focus. Accessible: revealed content visually hidden at rest via position + opacity (never display:none), stays mounted + in tab order + announced; reveals on :focus-within, stays visible under a coarse primary pointer, honors prefers-reduced-motion.',
  paramDescriptions: {
    options: 'config for reveal container. optional.',
    'options.isEnabled': 'when false hook is inert: no container styles, content getters return no styles, content always shown. Read every render, so it can flip after mount.',
  },
  returnDescriptions: {
    getContainerProps: 'spread onto container whose hover/focus-within drives reveal. Accepts hoverDelay (ms dwell before reveal starts: hover-intent gate like Tooltip / HoverCard delay) + forceState ("active" | "inactive") to pin trigger state when a caller owns it. "inactive" yields to keyboard focus + coarse pointers.',
    getContentRevealProps: 'spread onto each revealed / concealed child. Accepts isRevealInverted (conceal-on-hover), isLayoutPreserved (reserve layout box while hidden) + forceVisibility ("shown" | "hidden") to pin this element regardless of container. "hidden" yields to focus.',
  },
  usage: {
    description:
      'Headless hover/focus reveal primitive. Gives a container a scoped trigger that reveals (or conceals) content inside it on hover / keyboard focus: the "row actions appear on hover" pattern. CSS-only: no hover state in React, no re-render on hover. Caller authors no StyleX; hook hands out container + content styles; a nested container shadows its ancestor, so nested containers never leak hover/focus. Accessible: revealed content visually hidden at rest via position + opacity (never display:none), stays mounted + in tab order + announced; reveals on :focus-within, stays visible under a coarse primary pointer, honors prefers-reduced-motion.',
    bestPractices: [
      { guidance: true, description: 'Destructure getContainerProps + getContentRevealProps; spread getContainerProps() on container (via mergeProps w/ your stylex.props) + getContentRevealProps() on content to reveal.' },
      { guidance: true, description: 'Use for secondary affordances: reveal-on-hover row actions (edit/copy/remove on list / table rows) + overlay controls on card / media tile (e.g. Thumbnail remove button).' },
      { guidance: true, description: 'Gate reveal w/ isEnabled when a consumer prop decides revealed-on-hover vs always shown; can change at any time.' },
      { guidance: true, description: 'Pass isLayoutPreserved for absolutely-positioned / overlay content to reserve its box + avoid layout shift.' },
      { guidance: true, description: 'Set hoverDelay (100-250ms) on rows in a long list so a travelling cursor does not light up every row; keyboard + touch still reveal immediately.' },
      { guidance: true, description: 'forceState when something else owns the interaction (drag, scroll / motion gate, open row menu); forceVisibility when one element should ignore the container.' },
      { guidance: false, description: 'Reach past the API into private custom properties (--_reveal-opacity etc) to suppress a reveal; use forceState / forceVisibility.' },
      { guidance: false, description: 'Use to hide content that must always be discoverable; keep essential actions visible instead of gating behind hover.' },
    ],
  },
};

export const docsZh = {
  "name": "useContainerReveal",
  "usage": {
    "description": "一个无头的悬停/聚焦显示原语。为容器提供一个作用域触发器，当容器被悬停或获得键盘焦点时，显示（或隐藏）其中的内容：经典的“悬停时行操作出现”模式。显示完全由 CSS 实现：React 中没有悬停状态，悬停永远不会触发重新渲染。调用方不需要为显示本身编写任何 StyleX；该 Hook 会提供容器和内容样式，且嵌套容器会遮蔽其祖先，因此嵌套容器之间永远不会泄漏悬停/焦点。从设计上即可访问：被显示的内容在静止时通过 position 和 opacity 视觉隐藏（从不使用 display:none），因此它保持挂载、保留其在 Tab 顺序中的位置，并被辅助技术宣布；它在 :focus-within 时显示，因此键盘用户 Tab 进入时能看到它；在粗粒度主指针下保持可见（在那里永远不会被悬停门控），并遵循 prefers-reduced-motion。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "解构 getContainerProps 和 getContentRevealProps；将 getContainerProps() 展开到容器上（通过 mergeProps 与你自己的 stylex.props），并将 getContentRevealProps() 展开到要显示的内容上。"
      },
      {
        "guidance": true,
        "description": "用于次要可操作项：悬停时显示的行操作（列表或表格行上的编辑/复制/移除）以及卡片或媒体图块上的覆盖控件（例如 Thumbnail 的移除按钮）。"
      },
      {
        "guidance": true,
        "description": "当消费方属性决定内容是悬停显示还是始终显示时，用 isEnabled 对显示进行门控；它可以随时变化。"
      },
      {
        "guidance": true,
        "description": "对于绝对定位或覆盖内容，传入 isLayoutPreserved 以预留其盒子并避免出现时的布局偏移。"
      },
      {
        "guidance": true,
        "description": "在长列表的行上设置 hoverDelay（100-250ms），这样光标穿过列表时不会点亮经过的每一行；键盘和触摸仍会立即显示。"
      },
      {
        "guidance": true,
        "description": "当指针以外的因素拥有交互时（拖拽、滚动或运动门控、打开的行菜单），使用 forceState；当只有单个元素应忽略容器时，使用 forceVisibility。"
      },
      {
        "guidance": false,
        "description": "不要越过 API 使用该 Hook 的私有自定义属性（--_reveal-opacity 等）来抑制显示；请使用 forceState / forceVisibility，它们能在重命名后继续工作。"
      },
      {
        "guidance": false,
        "description": "不要用它隐藏必须始终可发现的内容；请保持关键操作可见，而不是把它们门控在悬停之后。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "显示容器的配置对象。可选。",
    "options.isEnabled": "为 false 时该 Hook 不生效：容器不获得样式，内容 getter 返回空样式，因此内容始终显示。每次渲染都会读取，因此组件可以在挂载后切换它（例如 revealOn === \"hover\"）。"
  },
  "returnDescriptions": {
    "getContainerProps": "展开到容器上，其悬停/聚焦内部会驱动显示。接受 hoverDelay（指针在显示开始前必须停留的毫秒数：类似 Tooltip 和 HoverCard 延迟的悬停意图门控，因此光标扫过列表时不会留下任何绘制）和 forceState（\"active\" | \"inactive\"），在调用方拥有触发器状态时将其固定：运动门控、滚动，或菜单打开的行。\"inactive\" 仍会让位于键盘焦点和粗指针。",
    "getContentRevealProps": "展开到每个被显示/隐藏的子元素上。接受 isRevealInverted 以改为悬停隐藏而不是悬停显示，isLayoutPreserved 以在隐藏时（仅透明度）预留布局盒并避免布局偏移，以及 forceVisibility（\"shown\" | \"hidden\"）不管容器在做什么都将这一个元素的外观固定。\"hidden\" 会让位于焦点。"
  }
};
