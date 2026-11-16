// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Overlay',
  displayName: 'Overlay',
  group: 'Overlay',
  category: 'Overlay',

  keywords: ['overlay', 'scrim', 'media', 'hover', 'focus', 'image', 'card'],

  usage: {
    description:
      'Overlay layers action or supporting content over media, cards, video, or other bounded surfaces with an optional scrim and reveal behavior. Host attributes and DOM handlers (id, data-*, aria-*) reach the root element.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use overlays for short, contextual actions or labels that belong directly to the underlying media or surface.',
      },
      {
        guidance: true,
        description:
          'Keep overlay content compact so it remains legible over the scrim and does not obscure important visual information.',
      },
      {
        guidance: false,
        description:
          'Do not use Overlay for floating content anchored outside the surface. Use Popover, Tooltip, or Dialog for those patterns.',
      },
    ],
    anatomy: [
      {
        name: 'Base content',
        required: false,
        description: 'The media, card, or bounded surface that the overlay sits on top of.',
      },
      {
        name: 'Scrim',
        required: false,
        description: 'Optional dark or light overlay background that improves content contrast.',
      },
      {
        name: 'Overlay content',
        required: true,
        description: 'Actions, labels, or supporting content rendered above the base surface.',
      },
    ],
  },

  playground: {
    defaults: {
      content: {
        __element: 'Button',
        props: {label: 'Quick view', variant: 'secondary', size: 'sm'},
      },
      children: [
        {
          __element: 'AspectRatio',
          props: {
            ratio: 1.7777777777777777,
            style: {
              width: 320,
              borderRadius: 12,
              overflow: 'clip',
            },
          },
          children: {
            __element: 'div',
            props: {
              style: {
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(135deg, #172554 0%, #2563eb 55%, #67e8f9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 600,
              },
            },
            children: 'Media preview',
          },
        },
      ],
    },
  },

  props: [
    {
      name: 'content',
      type: 'ReactNode',
      description: 'Content rendered inside the overlay scrim.',
      required: true,
      slotElements: [
        {
          __element: 'Button',
          props: {label: 'Quick view', variant: 'secondary', size: 'sm'},
        },
        {
          __element: 'Text',
          props: {type: 'body', weight: 'bold'},
          children: 'Overlay content',
        },
      ],
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Base content such as an image, video, card, or media surface that the overlay sits on top of.',
      slotElements: [
        {
          __element: 'AspectRatio',
          props: {ratio: 1.7777777777777777, style: {width: 320}},
          children: {
            __element: 'div',
            props: {
              style: {
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(135deg, #172554 0%, #2563eb 55%, #67e8f9 100%)',
              },
            },
          },
        },
      ],
    },
    {
      name: 'showOn',
      type: "'hover' | 'always' | 'focus' | 'hover-or-focus'",
      description:
        'Visibility trigger. Hover mode also reveals on focus for keyboard accessibility; hover-or-focus is an alias for hover.',
      default: "'always'",
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Controlled visibility override. When set, this takes precedence over showOn and touch toggle behavior.',
    },
    {
      name: 'scrim',
      type: "'dark' | 'light' | false",
      description: 'Scrim background mode. Set to false to render overlay content without a scrim background.',
      default: "'dark'",
    },
    {
      name: 'position',
      type: "'fill' | 'bottom' | 'top'",
      description: 'Where the scrim appears within the base surface.',
      default: "'fill'",
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end'",
      description: 'Alignment of the overlay content within the scrim.',
      default: "'end'",
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'CSS class name(s) appended to the root element. Prefer xstyle for styling when possible.',
    },
    {
      name: 'style',
      type: 'React.CSSProperties',
      description: 'Inline styles applied to the root element. Prefer xstyle for design-system styling.',
    },
    {
      name: 'ref',
      type: 'Ref<HTMLDivElement>',
      description: 'Ref forwarded to the overlay root element.',
    },
  ],
  theming: {
    targets: [
      {className: 'astryx-overlay'},
      {className: 'astryx-overlay-scrim', visualProps: ['position']},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'layered content over media/card surfaces with scrim + hover/focus/controlled reveal',
  usage: {
    description:
      'Overlay layers compact actions or supporting content over media, cards, or bounded surfaces with optional dark/light scrim and hover/focus/controlled reveal. Host attributes and DOM handlers reach the root element.',
    bestPractices: [
      {guidance: true, description: 'Use for short contextual actions/labels tied to the underlying surface.'},
      {guidance: true, description: 'Keep content compact and legible over the scrim.'},
      {guidance: false, description: 'Do not use for floating anchored surfaces; use Popover, Tooltip, or Dialog.'},
    ],
  },
  propDescriptions: {
    content: 'overlay content inside scrim; required',
    children: 'base media/card/surface beneath overlay',
    showOn: 'visibility trigger; hover also focus-visible; default always',
    isOpen: 'controlled visibility override',
    scrim: 'dark/light scrim or false for no scrim; default dark',
    position: 'scrim placement: fill, bottom strip, or top strip',
    align: 'content alignment inside scrim',
    xstyle: 'StyleX layout styles; must be stylex.create() value',
    className: 'additional root class names',
    style: 'inline root styles; prefer xstyle',
    ref: 'forwarded root div ref',
  },
};

export const docsZh = {
  "name": "Overlay",
  "usage": {
    "description": "Overlay 将操作或辅助内容叠加在媒体、卡片、视频或其他有界表面之上，支持可选遮罩和揭示行为。宿主属性与 DOM 处理器（`id`、`data-*`、`aria-*`）会到达根元素。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将叠加层用于属于底层媒体或表面的简短、上下文相关操作或标签。"
      },
      {
        "guidance": true,
        "description": "保持叠加内容紧凑，使其在遮罩上仍然清晰可读，并且不会遮挡重要的视觉信息。"
      },
      {
        "guidance": false,
        "description": "不要将 Overlay 用于锚定在表面外部的浮动内容。这些模式请使用 Popover、Tooltip 或 Dialog。"
      }
    ],
    "anatomy": [
      {
        "name": "基础内容",
        "required": false,
        "description": "叠加层所覆盖的媒体、卡片或有界表面。"
      },
      {
        "name": "遮罩",
        "required": false,
        "description": "可选的深色或浅色叠加背景，用于提高内容对比度。"
      },
      {
        "name": "叠加内容",
        "required": true,
        "description": "渲染在基础表面之上的操作、标签或辅助内容。"
      }
    ]
  },
  "propDescriptions": {
    "content": "在叠加遮罩内渲染的内容。",
    "children": "基础内容，例如图片、视频、卡片或媒体表面，叠加层位于其上方。",
    "showOn": "可见性触发方式。`hover` 模式也会在聚焦时显示，以支持键盘无障碍；`hover-or-focus` 是 `hover` 的别名。",
    "isOpen": "受控的可见性覆盖。设置后，它会优先于 `showOn` 和触摸切换行为。",
    "scrim": "遮罩背景模式。设置为 `false` 可在没有遮罩背景的情况下渲染叠加内容。",
    "position": "遮罩在基础表面内的显示位置。",
    "align": "叠加内容在遮罩内的对齐方式。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 `stylex.create()` 的值，而不是像 `style={{}}` 这样的内联样式对象。",
    "className": "追加到根元素的 CSS 类名。尽可能优先使用 `xstyle` 设置样式。",
    "style": "应用于根元素的内联样式。设计系统样式请优先使用 `xstyle`。",
    "ref": "转发到叠加层根元素的 ref。"
  }
};
