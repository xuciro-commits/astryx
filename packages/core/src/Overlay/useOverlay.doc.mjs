// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useOverlay',
  displayName: 'useOverlay',
  group: 'Overlay',
  keywords: [
    'overlay',
    'scrim',
    'hover reveal',
    'focus-within',
    'quick view',
    'card actions',
    'media overlay',
  ],
  params: [
    {
      name: 'options',
      type: 'UseOverlayOptions',
      description: 'Overlay configuration. Every field is optional.',
      required: false,
    },
    {
      name: 'options.content',
      type: 'ReactNode',
      description:
        'Content to render inside the scrim. When set, the hook returns it pre-rendered as element.',
      required: false,
    },
    {
      name: 'options.showOn',
      type: "'hover' | 'always' | 'focus' | 'hover-or-focus'",
      description:
        "Visibility trigger, read with CSS from the container. 'hover' also reveals on focus within the container for keyboard users; 'hover-or-focus' is an alias for it. On a touch device (hover: none), a hover overlay toggles on a tap on the container instead.",
      default: "'always'",
      required: false,
    },
    {
      name: 'options.isOpen',
      type: 'boolean',
      description:
        'Controlled visibility. When set, it takes precedence over showOn and the touch toggle.',
      required: false,
    },
    {
      name: 'options.scrim',
      type: "'dark' | 'light' | false",
      description:
        'Scrim background. false renders the content with no scrim background.',
      default: "'dark'",
      required: false,
    },
    {
      name: 'options.position',
      type: "'fill' | 'bottom' | 'top'",
      description:
        'Where the scrim sits: over the whole positioned area, or as a strip along its bottom or top edge.',
      default: "'fill'",
      required: false,
    },
    {
      name: 'options.align',
      type: "'start' | 'center' | 'end'",
      description: 'Alignment of the content within the scrim.',
      default: "'end'",
      required: false,
    },
  ],
  returns: [
    {
      name: 'containerRef',
      type: 'RefObject<HTMLElement | null>',
      description: 'Attach to the container element.',
    },
    {
      name: 'containerProps',
      type: 'OverlayContainerProps',
      description:
        'Spread on the same container: className and style mark it as the overlay scope (positioned, clipped), and on a touch device with a hover overlay onClick and onMouseUp toggle it on a tap.',
    },
    {
      name: 'element',
      type: 'ReactElement | null',
      description:
        'The scrim with options.content, ready to render once inside the container. null when content is not set.',
    },
    {
      name: 'renderOverlay',
      type: '(children: ReactNode) => ReactElement',
      description:
        'Renders the scrim around the children you pass, for content that changes or a scrim you mount yourself. Use it or element, not both.',
    },
  ],
  usage: {
    description:
      "Adds overlay behavior to a container you already render, such as a Card or a custom media frame, without the wrapper Overlay adds. Spread containerRef and containerProps on the container, then render element (or renderOverlay(children)) once inside it. The scrim is absolutely positioned, so it covers the nearest positioned ancestor: the container itself, or a positioned section inside it such as an image area. Visibility is CSS-driven from the container's :hover and :focus-within, so with showOn 'hover' a keyboard user reveals the content by moving focus into the container. Hidden content is not focusable, so the container needs a focusable element before the overlay content in tab order. A revealed scrim takes pointer input over the area it covers, so put that element outside the scrim, or use a top or bottom strip and keep it in the part the strip leaves uncovered.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Use showOn 'hover' for actions on media cards: it also reveals on keyboard focus within the container.",
      },
      {
        guidance: true,
        description:
          'Put a focusable element (a link or the card title) before the overlay content in the container, so Tab reveals the content and the next Tab reaches it.',
      },
      {
        guidance: true,
        description:
          'Use the Overlay component when you do not already have a container element to attach to.',
      },
      {
        guidance: false,
        description:
          'Put the only way to reach an action behind hover with nothing focusable before it; keyboard users cannot focus content that is hidden.',
      },
    ],
  },
  relatedComponents: ['Overlay', 'Card', 'AspectRatio'],
  relatedHooks: ['useClickableContainer'],
  importPath: '@astryxdesign/core/Overlay',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    "Overlay behavior on a container you already render (Card, media frame) w/o Overlay's wrapper. Spread containerRef + containerProps on it, render element / renderOverlay(children) once inside. CSS-driven via container :hover/:focus-within; hover mode also reveals on keyboard focus. Hidden content is not focusable, so put a focusable element before it, outside the area a revealed scrim covers (the scrim takes pointer input).",
  paramDescriptions: {
    options: 'overlay config; all fields optional.',
    'options.content':
      'content inside the scrim; returned pre-rendered as element.',
    'options.showOn':
      "CSS visibility trigger. 'hover' also reveals on focus-within; 'hover-or-focus' = alias. Touch (hover: none): hover overlays toggle on tap.",
    'options.isOpen': 'controlled visibility; wins over showOn + touch toggle.',
    'options.scrim': 'scrim background; false = no background.',
    'options.position': "scrim placement: 'fill', or a 'bottom' / 'top' strip.",
    'options.align': 'content alignment in the scrim.',
  },
  returnDescriptions: {
    containerRef: 'attach to the container.',
    containerProps:
      'spread on the container: overlay scope className/style (positioned, clipped) + tap toggle handlers for hover overlays on touch devices.',
    element:
      'scrim with content, render once inside the container; null w/o content.',
    renderOverlay:
      '(children) => scrim; for dynamic content or self-mounted scrim. Use it or element.',
  },
  usage: {
    description:
      'Overlay behavior on an existing container: spread containerRef + containerProps, render element once inside. Scrim covers nearest positioned ancestor. CSS :hover/:focus-within; hover mode reveals on keyboard focus too. Put a focusable element before hidden content.',
    bestPractices: [
      {
        guidance: true,
        description:
          "showOn 'hover' for media card actions; also reveals on keyboard focus.",
      },
      {
        guidance: true,
        description:
          'Put a focusable element before the overlay content so Tab reveals it, next Tab reaches it.',
      },
      {
        guidance: true,
        description: 'Use Overlay when there is no container to attach to.',
      },
      {
        guidance: false,
        description:
          'Hide the only route to an action behind hover with nothing focusable before it.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useOverlay",
  "usage": {
    "description": "为已经渲染的容器（例如 Card 或自定义媒体框架）添加覆盖层行为，而无需 Overlay 所添加的包装器。将 containerRef 和 containerProps 展开到容器上，然后在容器内渲染一次 element（或 renderOverlay(children)）。遮罩采用绝对定位，因此会覆盖最近的已定位祖先：容器本身，或其中已定位的区域（如图像区域）。可见性由容器的 :hover 和 :focus-within 通过 CSS 驱动，因此在 showOn 为 'hover' 时，键盘用户将焦点移入容器即可显示内容。隐藏内容不可聚焦，因此容器需要在 Tab 顺序中位于覆盖层内容之前有一个可聚焦元素。已显示的遮罩会接管其覆盖区域的指针输入，因此请将该元素放在遮罩之外，或使用顶部或底部条带，并将其保留在条带未覆盖的部分中。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "对媒体卡片上的操作使用 showOn 'hover'：它也会在容器内获得键盘焦点时显示。"
      },
      {
        "guidance": true,
        "description": "在容器中把可聚焦元素（链接或卡片标题）放在覆盖层内容之前，这样 Tab 会显示内容，下一次 Tab 会到达内容。"
      },
      {
        "guidance": true,
        "description": "当你还没有可附加的容器元素时，使用 Overlay 组件。"
      },
      {
        "guidance": false,
        "description": "不要把到达某个操作的唯一途径放在悬停之后且其前没有可聚焦元素；键盘用户无法聚焦隐藏的内容。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "Overlay 配置。每个字段都是可选的。",
    "options.content": "在遮罩内渲染的内容。设置后，Hook 会将其预渲染为 element 返回。",
    "options.showOn": "可见性触发方式，通过 CSS 从容器读取。'hover' 也会在容器内获得焦点时为键盘用户显示；'hover-or-focus' 是它的别名。在触摸设备（hover: none）上，悬停覆盖层改为在点击容器时切换。",
    "options.isOpen": "受控可见性。设置后，它优先于 showOn 和触摸切换。",
    "options.scrim": "遮罩背景。false 渲染内容且不带遮罩背景。",
    "options.position": "遮罩的位置：覆盖整个已定位区域，或作为沿其底部或顶部边缘的条带。",
    "options.align": "内容在遮罩内的对齐方式。"
  },
  "returnDescriptions": {
    "containerRef": "附加到容器元素。",
    "containerProps": "展开到同一容器：className 和 style 将其标记为覆盖层作用域（已定位、已裁剪），在带悬停覆盖层的触摸设备上，onClick 和 onMouseUp 会在点击时切换它。",
    "element": "带有 options.content 的遮罩，可在容器内渲染一次。未设置 content 时为 null。",
    "renderOverlay": "围绕传入的子元素渲染遮罩，适用于内容会变化或你自行挂载遮罩的情况。使用它或 element，不要同时使用两者。"
  }
};
