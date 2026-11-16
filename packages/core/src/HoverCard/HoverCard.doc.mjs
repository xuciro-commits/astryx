// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'HoverCard',
  displayName: 'Hover Card',
  group: 'HoverCard',
  category: 'Overlay',
  keywords: [
    'hovercard',
    'hover card',
    'popover',
    'tooltip',
    'preview card',
    'flyout',
    'overlay',
    'hover popup',
  ],
  playground: {
    defaults: {
      content: {
        __element: 'Text',
        props: {type: 'body'},
        children: 'Additional details shown on hover.',
      },
      children: {
        __element: 'Link',
        props: {href: '#'},
        children: 'Hover for details',
      },
    },
  },
  theming: {
    targets: [{className: 'astryx-hover-card'}],
    vars: [
      {
        name: '--_hovercard-radius',
        description: 'Border radius of the hover card',
        default: 'var(--radius-container)',
        private: true,
      },
    ],
    derived: [{property: 'borderRadius', vars: ['--_hovercard-radius']}],
  },
  components: [
    {
      name: 'HoverCard',
      displayName: 'Hover Card',
      description:
        'Component wrapper for hover card display: a richer, larger overlay triggered on hover or focus.',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description:
            'The trigger. Text children, a string or number or text written around an expression such as `Edited {when}`, are wrapped in a focusable inline span; holes such as `false` and `null` are ignored. With element children, HoverCard wires the first element, so that element does not need to accept a ref.',
        },
        {
          name: 'content',
          type: 'ReactNode',
          description: 'Hover card content.',
          required: true,
          slotElements: [
            {
              __element: 'Text',
              props: {type: 'body'},
              children: 'Content text',
            },
          ],
        },
        {
          name: 'placement',
          type: "'above' | 'below' | 'start' | 'end'",
          description:
            "Position relative to the anchor element. Logical: start/end resolve against the popover\'s own inherited direction (RTL mirrors in pure CSS).",
          default: "'above'",
        },
        {
          name: 'alignment',
          type: "'start' | 'center' | 'end'",
          description:
            "Alignment along the placement axis. Logical: start/end resolve against the popover\'s own inherited direction (RTL mirrors in pure CSS).",
          default: "'center'",
        },
        {
          name: 'delay',
          type: 'number',
          description: 'Show delay in milliseconds.',
          default: '300',
        },
        {
          name: 'hideDelay',
          type: 'number',
          description: 'Hide delay in milliseconds.',
          default: '200',
        },
        {
          name: 'focusTrigger',
          type: "'auto' | 'always' | 'never'",
          description:
            'When focus should open the hover card. auto opens when the trigger itself takes focus, or focus lands inside a trigger that is focusable at that moment, so a roving-tabindex member opens when the arrow keys reach it.',
          default: "'auto'",
        },
        {
          name: 'touchTrigger',
          type: "'auto' | 'tap' | 'none'",
          description:
            'What a tap does where there is no hover. auto opens on tap unless the trigger performs an action of its own (a button, link, or form control), whose tap belongs to the control; an aria-disabled control performs none, so a tap on it opens its reason. tap always opens. none never opens on touch. A tap-opened card is dismissed by a tap outside it.',
          default: "'auto'",
        },
        {
          name: 'isEnabled',
          type: 'boolean',
          description: 'Enables or disables the hover and focus triggers.',
          default: 'true',
        },
        {
          name: 'label',
          type: 'string',
          description:
            'Accessible name for the hover card popup. When provided, the popup is exposed as a named role="dialog"; when omitted, it falls back to role="group" (a group may validly be unnamed).',
        },
        {
          name: 'onOpenChange',
          type: '(isOpen: boolean) => void',
          description:
            'Callback fired when hover card visibility changes. Called with true when shown and false when hidden.',
        },
        {
          name: 'hasHoverIndication',
          type: "'auto' | boolean",
          description:
            'Shows a dashed underline on a text trigger. auto shows it when children is text: strings and numbers, such as `Edited {when}`, with holes such as `false` and `null` ignored. It has no effect on an element trigger, which keeps its own styling.',
          default: "'auto'",
        },
        {
          name: 'isDefaultOpen',
          type: 'boolean',
          description:
            'Whether the hover card should be shown on mount. Still dismissible.',
        },
        {
          name: 'isOpen',
          type: 'boolean',
          description:
            'Controlled open state. true holds the card open. false holds it closed against hover and focus. A controlled card answers Escape by calling onOpenChange(false) without closing; it closes when you set isOpen to false, and focus inside the card then returns to the trigger.',
        },
        {
          name: 'xstyle',
          type: 'StyleXStyles',
          description:
            'StyleX styles for the card surface, the element that carries the hover-card theme target.',
        },
        {
          name: 'className',
          type: 'string',
          description:
            'Class name added to the card surface, beside the hover-card target class.',
        },
        {
          name: 'style',
          type: 'CSSProperties',
          description: 'Inline styles for the card surface.',
        },
      ],
    },
  ],
  usage: {
    description:
      'HoverCard shows additional information when the user hovers or focuses a trigger element. Use it for profile cards, link summaries, or inline definitions where the user needs more context without navigating away.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep content supplementary; hover cards should enhance understanding without blocking the primary workflow.',
      },
      {
        guidance: true,
        description:
          'Provide a dashed underline on text triggers so users know the element is hoverable.',
      },
      {
        guidance: true,
        description:
          'Use the hook API (useHoverCard) when you need more control over timing or placement.',
      },
      {
        guidance: true,
        description:
          'Leave touchTrigger on auto so a tap opens the card on triggers that do nothing else, and stays out of the way on triggers that perform an action.',
      },
      {
        guidance: false,
        description:
          'Place critical actions or required information inside a hover card; users may miss content that only appears on hover.',
      },
      {
        guidance: false,
        description:
          'Use a hover card when a simple Tooltip or Popover would suffice.',
      },
      {
        guidance: false,
        description:
          'Use a HoverCard for content the user must interact with; it disappears when the cursor leaves.',
      },
      {
        guidance: false,
        description:
          'Put the trigger inside SVG <foreignObject>. In Chromium it cannot be a CSS anchor, so the card opens at the viewport corner. Render the trigger in an HTML layer positioned over the SVG node instead, and keep the SVG for shapes, edges and labels.',
      },
      {
        guidance: true,
        description:
          'Prefer placing HoverCard in a block context rather than directly in a <p>, heading, or link. Those placements are supported when necessary through a corrective portal, but the DOM and tab order may differ.',
      },
    ],
    anatomy: [
      {
        name: 'Trigger',
        required: true,
        description:
          'The element that opens the hover card on hover or focus: a button, link, or inline text.',
      },
      {
        name: 'Card',
        required: true,
        description:
          'The floating overlay with the preview content, anchored to the trigger.',
      },
      {
        name: 'Body',
        required: true,
        description:
          'The main content area: profile info, link summary, or any rich content.',
      },
      {
        name: 'Actions',
        required: false,
        description:
          'Optional buttons inside the card for follow-up actions like Follow or Message.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "HoverCard",
  "displayName": "Hover Card",
  "theming": {
    "targets": [
      {
        "className": "astryx-hover-card"
      }
    ],
    "vars": [
      {
        "name": "--_hovercard-radius",
        "description": "Border radius of the hover card",
        "default": "var(--radius-container)",
        "private": true
      }
    ],
    "derived": [
      {
        "property": "borderRadius",
        "vars": [
          "--_hovercard-radius"
        ]
      }
    ]
  },
  "components": [
    {
      "name": "HoverCard",
      "displayName": "Hover Card",
      "description": "用于悬停卡显示的组件包装器：在悬停或聚焦时触发的更丰富、更大的覆盖层。",
      "props": [
        {
          "name": "children",
          "type": "ReactNode",
          "description": "触发元素。文本子元素（字符串或数字，或围绕表达式书写的文本，例如 `Edited {when}`）会被包裹在可聚焦的内联 span 中；`false`、`null` 等空位会被忽略。传入元素时，HoverCard 连接第一个元素，因此该元素无需接受 ref。"
        },
        {
          "name": "content",
          "type": "ReactNode",
          "description": "悬浮卡片内容。",
          "required": true
        },
        {
          "name": "placement",
          "type": "'above' | 'below' | 'start' | 'end'",
          "description": "相对于锚点元素的位置。逻辑值：start/end 根据弹出层自身继承的方向解析（RTL 镜像）。",
          "default": "'above'"
        },
        {
          "name": "alignment",
          "type": "'start' | 'center' | 'end'",
          "description": "沿放置轴的对齐方式。逻辑值：start/end 根据弹出层自身继承的方向解析（RTL 镜像）。",
          "default": "'center'"
        },
        {
          "name": "delay",
          "type": "number",
          "description": "显示延迟（毫秒）。",
          "default": "300"
        },
        {
          "name": "hideDelay",
          "type": "number",
          "description": "隐藏延迟（毫秒）。",
          "default": "200"
        },
        {
          "name": "focusTrigger",
          "type": "'auto' | 'always' | 'never'",
          "description": "焦点何时打开悬浮卡片。auto 在触发元素自身获得焦点，或焦点落在当时可聚焦的触发元素内部时打开，因此方向键到达漫游 tabindex 成员时也会打开。",
          "default": "'auto'"
        },
        {
          "name": "touchTrigger",
          "type": "'auto' | 'tap' | 'none'",
          "description": "在没有悬停的触摸设备上，轻点的行为。auto：轻点即打开，除非触发元素本身会执行操作（按钮、链接、表单控件），此时轻点归该控件所有；设置了 aria-disabled 的控件不执行操作，因此轻点它会显示其原因。tap：始终轻点打开。none：触摸永不打开。轻点打开的卡片可通过点击卡片外部关闭。",
          "default": "'auto'"
        },
        {
          "name": "isEnabled",
          "type": "boolean",
          "description": "启用或禁用悬停和聚焦触发器。",
          "default": "true"
        },
        {
          "name": "label",
          "type": "string",
          "description": "悬浮卡片弹出层的无障碍名称。提供时，弹出层以具名的 role=\"dialog\" 暴露；省略时，回退为 role=\"group\"（group 可以合法地没有名称）。"
        },
        {
          "name": "onOpenChange",
          "type": "(isOpen: boolean) => void",
          "description": "悬浮卡片可见性变化时触发的回调。显示时传入 true，隐藏时传入 false。"
        },
        {
          "name": "hasHoverIndication",
          "type": "'auto' | boolean",
          "description": "在文本触发元素上显示虚线下划线。auto：当 children 是文本（字符串和数字，例如 `Edited {when}`，忽略 `false`、`null` 等空位）时显示。对元素触发器无效，元素保留自身样式。",
          "default": "'auto'"
        },
        {
          "name": "isDefaultOpen",
          "type": "boolean",
          "description": "是否在挂载时显示悬浮卡片。仍然可以关闭。"
        },
        {
          "name": "isOpen",
          "type": "boolean",
          "description": "受控的打开状态。true 保持卡片打开。false 使悬停和焦点都无法打开卡片。受控卡片响应 Escape 时调用 onOpenChange(false) 而不关闭；将 isOpen 设为 false 时关闭，此时卡片内的焦点返回触发元素。"
        },
        {
          "name": "xstyle",
          "type": "StyleXStyles",
          "description": "卡片表面（带有 hover-card 主题目标的元素）的 StyleX 样式。"
        },
        {
          "name": "className",
          "type": "string",
          "description": "添加到卡片表面的类名，与 hover-card 目标类名并列。"
        },
        {
          "name": "style",
          "type": "CSSProperties",
          "description": "卡片表面的内联样式。"
        }
      ],
      "propDescriptions": {
        "children": "触发元素。文本子元素（字符串、数字或围绕 `Edited {when}` 这类表达式书写的文本）会包裹在可聚焦的行内 span 中；`false` 和 `null` 等空位会被忽略。对于元素子元素，HoverCard 会连接第一个元素，因此该元素无需接受 ref。",
        "content": "悬停卡内容。",
        "placement": "相对于锚点元素的位置。逻辑值：start/end 依据弹出层自身继承的方向解析（RTL 在纯 CSS 中镜像）。",
        "alignment": "沿放置轴的对齐方式。逻辑值：start/end 依据弹出层自身继承的方向解析（RTL 在纯 CSS 中镜像）。",
        "delay": "显示延迟，单位为毫秒。",
        "hideDelay": "隐藏延迟，单位为毫秒。",
        "focusTrigger": "何时应由聚焦打开悬停卡。auto 在触发元素本身获得焦点时打开，或在焦点落入当时可聚焦的触发元素内部时打开，因此 roving-tabindex 成员在方向键到达时会打开。",
        "touchTrigger": "在没有悬停的情况下轻触会执行什么。auto 在轻触时打开，除非触发元素自身执行操作（按钮、链接或表单控件），此时轻触属于该控件；aria-disabled 控件不执行任何操作，因此轻触它会打开其原因。tap 始终打开。none 在触摸时从不打开。轻触打开的卡片可通过在其外部轻触来关闭。",
        "isEnabled": "启用或禁用悬停和聚焦触发。",
        "label": "悬停卡弹出层的可访问名称。提供时，弹出层会暴露为具名的 role=\"dialog\"；省略时，回退为 role=\"group\"（组可以合法地不命名）。",
        "onOpenChange": "悬停卡可见性变化时触发的回调。显示时以 true 调用，隐藏时以 false 调用。",
        "hasHoverIndication": "在文本触发元素上显示虚线下划线。auto 在 children 为文本时显示：字符串和数字，例如 `Edited {when}`，其中 `false` 和 `null` 等空位会被忽略。它对元素触发元素没有效果，后者保留自己的样式。",
        "isDefaultOpen": "悬停卡是否应在挂载时显示。仍可关闭。",
        "isOpen": "受控的打开状态。true 保持卡片打开。false 使其对悬停和聚焦保持关闭。受控卡片响应 Escape 时会调用 onOpenChange(false) 而不关闭；当你将 isOpen 设为 false 时它才关闭，随后卡片内的焦点返回触发元素。",
        "xstyle": "卡片表面的 StyleX 样式，该元素承载悬停卡主题目标。",
        "className": "添加到卡片表面的类名，与悬停卡目标类并列。",
        "style": "卡片表面的内联样式。"
      }
    }
  ],
  "usage": {
    "description": "HoverCard 在用户悬停或聚焦触发元素时显示附加信息。适用于个人资料卡、链接摘要或行内定义等场景，让用户无需离开当前页面即可获得更多上下文。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "保持内容为补充性；悬停卡应增强理解，而不应阻塞主要工作流程。"
      },
      {
        "guidance": true,
        "description": "在文本触发元素上提供虚线下划线，让用户知道该元素可悬停。"
      },
      {
        "guidance": true,
        "description": "当需要更精细地控制时机或位置时，使用 Hook API（useHoverCard）。"
      },
      {
        "guidance": true,
        "description": "将 touchTrigger 保持为 auto，这样在无其他作用的触发元素上轻触会打开卡片，而在会执行操作的触发元素上则不会干扰。"
      },
      {
        "guidance": false,
        "description": "将关键操作或必需信息放在悬停卡中；用户可能会错过仅在悬停时出现的内容。"
      },
      {
        "guidance": false,
        "description": "当简单的 Tooltip 或 Popover 就足够时使用悬停卡。"
      },
      {
        "guidance": false,
        "description": "将 HoverCard 用于用户必须交互的内容；光标离开时它会消失。"
      },
      {
        "guidance": false,
        "description": "将触发元素放在 SVG <foreignObject> 中。在 Chromium 中它不能作为 CSS 锚点，因此卡片会在视口角落打开。请改为在覆盖于 SVG 节点之上的 HTML 层中渲染触发元素，并让 SVG 只负责形状、边和标签。"
      },
      {
        "guidance": true,
        "description": "优先将 HoverCard 放在块级上下文中，而不是直接放在 <p>、标题或链接内。必要时会通过校正 portal 支持这些放置方式，但 DOM 和 Tab 顺序可能有所不同。"
      }
    ],
    "anatomy": [
      {
        "name": "触发元素",
        "required": true,
        "description": "在悬停或聚焦时打开悬停卡的元素：按钮、链接或行内文本。"
      },
      {
        "name": "卡片",
        "required": true,
        "description": "带有预览内容的浮动覆盖层，锚定到触发元素。"
      },
      {
        "name": "主体",
        "required": true,
        "description": "主内容区域：个人资料信息、链接摘要或任何富内容。"
      },
      {
        "name": "操作区",
        "required": false,
        "description": "卡片内用于后续操作（如 Follow 或 Message）的可选按钮。"
      }
    ]
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Hover/focus triggered overlay for displaying rich, interactive content anchored to trigger element.',
  usage: {
    description:
      'HoverCard shows additional info on hover/focus. Use for profile cards, link summaries, inline definitions.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep content supplementary; hover cards should enhance understanding without blocking the primary workflow.',
      },
      {
        guidance: true,
        description:
          'Provide a dashed underline on text triggers so users know the element is hoverable.',
      },
      {
        guidance: true,
        description:
          'Use the hook API (useHoverCard) when you need more control over timing or placement.',
      },
      {
        guidance: true,
        description:
          'Leave touchTrigger on auto so a tap opens the card on triggers that do nothing else, and stays out of the way on triggers that perform an action.',
      },
      {
        guidance: false,
        description:
          'Place critical actions or required information inside a hover card; users may miss content that only appears on hover.',
      },
      {
        guidance: false,
        description:
          'Use a hover card when a simple Tooltip or Popover would suffice.',
      },
      {
        guidance: false,
        description:
          'Use a HoverCard for content the user must interact with; it disappears when the cursor leaves.',
      },
      {
        guidance: false,
        description:
          'Put the trigger inside SVG <foreignObject>: Chromium cannot anchor to it, so the card opens at the viewport corner. Use an HTML trigger positioned over the SVG node.',
      },
      {
        guidance: true,
        description:
          'Prefer a block context over a direct <p>, heading, or link placement. Those placements work when necessary through a corrective portal, but DOM/tab order may differ.',
      },
    ],
  },
  components: [
    {
      name: 'HoverCard',
      displayName: 'Hover Card',
      description:
        'Component wrapper for hover card overlay; richer overlay triggered on hover/focus.',
      propDescriptions: {
        children:
          'Trigger. Text children (strings/numbers, incl. `Edited {when}`; holes like false/null ignored) are wrapped in a focusable inline span. With elements, the first element is wired (no ref needed).',
        content: 'Hover card content.',
        placement:
          "Position relative to anchor element. Logical: start/end follow the popover's inherited direction (RTL mirrors).",
        alignment:
          "Alignment along placement axis. Logical: start/end follow the popover's inherited direction (RTL mirrors).",
        delay: 'Show delay in ms.',
        hideDelay: 'Hide delay in ms.',
        focusTrigger: 'Controls when focus events trigger hover card.',
        touchTrigger:
          'Tap behavior where there is no hover. auto = tap opens unless the trigger acts (button/link/control; an aria-disabled control does not act); tap = always opens; none = never on touch. Tap-opened cards close on a tap outside.',
        isEnabled: 'Enable/disable hover + focus triggers.',
        label:
          'Accessible name for the popup. With label: named role="dialog"; without: role="group".',
        onOpenChange:
          'Callback when visibility changes; true=shown, false=hidden.',
        hasHoverIndication:
          'Dashed underline on a text trigger. auto = text children (strings/numbers, holes ignored); no effect on element triggers.',
        isDefaultOpen: 'Show hover card on mount. Still dismissible.',
        isOpen:
          'Controlled open state. true holds open; false holds closed against hover and focus. Escape calls onOpenChange(false) without closing; setting false returns focus inside the card to the trigger.',
        xstyle: 'StyleX styles for the card surface (hover-card target).',
        className: 'Class added to the card surface.',
        style: 'Inline styles for the card surface.',
      },
    },
  ],
};
