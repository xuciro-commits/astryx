// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatLayout',
  subComponentOf: 'Chat',
  displayName: 'Chat Layout',
  description: 'Layout shell for full chat interfaces. Messages flow in normal page flow, composer is fixed to the bottom with a frosted glass dock. Set density (compact/balanced/spacious) to control spacing, message max-width, and blur layer sizing. Includes built-in auto-scroll, a "New messages" scroll-to-bottom button, and a frosted glass blur layer behind the composer. By default the layout root is the scroll container; pass scrollRef to delegate scrolling to a parent element or the document body. Where the visual viewport shrinks for the software keyboard, the composer stays on top of the keyboard, and a conversation at its newest message stays there. In Chrome on Android the composer rides Gboard\u2019s slides in step with them. In Safari on iOS (in the browser and as a home-screen app) and in Firefox for Android, it moves above the keyboard once the browser reports it. On a touch screen, in a top-level page, every way into the composer\u2019s text (a tap, the keyboard\u2019s previous and next buttons, Tab, the input\u2019s focus()) focuses it without scrolling the page; under a mouse or inside an iframe the browser\u2019s own focus applies. Where your page sets interactive-widget=resizes-content, Chrome on Android shrinks the page for the keyboard itself and the composer stays above it without moving (see the browser-support guide).',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Message content: typically ChatMessageList. Flows naturally in the page and scrolls with the container.',
      required: true,
    },
    {
      name: 'composer',
      type: 'ReactNode',
      description: 'Composer element: typically ChatComposer. Fixed to the bottom with a frosted glass dock.',
      required: true,
      slotElements: [
        {
          __element: 'TextInput',
          props: {
            label: 'Input',
            placeholder: 'Type here...',
          },
        },
      ],
    },
    {
      name: 'emptyState',
      type: 'ReactNode',
      description: 'Content shown when children is empty. Centered vertically in the message area.',
      slotElements: [
        {
          __element: 'EmptyState',
          props: {
            title: 'No items',
            description: 'Nothing to show.',
          },
        },
      ],
    },
    {
      name: 'scrollButton',
      type: 'ReactNode | null',
      description: 'Scroll-to-bottom button rendered above the composer. Defaults to ChatLayoutScrollButton with auto-scroll integration. Pass null to hide.',
    },
    {
      name: 'scrollRef',
      type: 'React.RefObject<HTMLElement | null>',
      description: 'External scroll container ref. When provided, auto-scroll and scroll-to-bottom target this element instead of the layout root. Use when the chat is embedded in a page where a parent element or the document body scrolls.',
    },
    {
      name: 'density',
      type: "'compact' | 'balanced' | 'spacious'",
      description: 'Visual density: controls dock padding, message-area max-width and inline padding, and the height of the frosted glass blur layer.',
      default: "'balanced'",
    },
  ],
  usage: {
    description: 'ChatLayout is the layout shell for full-page chat interfaces. It renders messages in normal page flow and docks the composer to the bottom with a frosted glass blur layer. Set the density prop to control spacing; it defaults to balanced. Use it to wrap ChatMessageList and ChatComposer for a complete chat experience with built-in auto-scroll and a scroll-to-bottom button.',
    bestPractices: [
      {
        guidance: true,
        description: 'Pass ChatMessageList as children and ChatComposer as the composer prop for a complete chat interface.',
      },
      {
        guidance: true,
        description: 'Provide an emptyState so new conversations show a prompt instead of a blank screen.',
      },
      {
        guidance: true,
        description: 'Use scrollRef when the chat is embedded in a page where a parent element handles scrolling.',
      },
      {
        guidance: true,
        description: "Give a full-page ChatLayout a container 100dvh tall, not 100vh: where a phone browser's toolbar collapses, 100vh is the viewport with the toolbar hidden, so the composer would start below the screen's edge.",
      },
      {
        guidance: true,
        description: 'Markdown prose keeps its 680px measure, while code blocks and tables span the message column. To give a reply one right edge, pass contentWidth="100%" to its Markdown.',
      },
      {
        guidance: false,
        description: "Don't apply a fixed height on the layout; let it fill its container with flex: 1.",
      },
      {
        guidance: false,
        description: "Don't render multiple ChatLayout instances in the same scroll container; each expects to own its scroll context.",
      },
    ],
    anatomy: [
      {
        name: 'Message area',
        required: true,
        description: 'Scrollable region for messages. Renders children (typically ChatMessageList) in a flex column that pushes content to the bottom when the list is short.',
      },
      {
        name: 'Frosted glass dock',
        required: true,
        description: 'Sticky or fixed container at the bottom with a backdrop-blur layer. Houses the scroll button and composer. While a software keyboard is up it sits on top of the keyboard, and the message area gets room to scroll above it.',
      },
      {
        name: 'Scroll-to-bottom button',
        required: false,
        description: 'Appears when the user scrolls up or new messages arrive. Defaults to ChatLayoutScrollButton; pass null to hide or a custom element to override.',
      },
      {
        name: 'Composer',
        required: true,
        description: 'The input area for sending messages, typically ChatComposer. Docked at the bottom inside the frosted glass layer. In a top-level page on a touch screen, its wrapper (without the scroll button) is a group with no name. When the keyboard\u2019s Done ends typing, focus rests on that group (it is no tab stop), so the next tap or Tab starts from the composer. It shows the focus ring after keyboard input only. Under a mouse or inside an iframe, the wrapper is a plain container.',
      },
      {
        name: 'Empty state',
        required: false,
        description: 'Centered placeholder shown when no messages exist. Use EmptyState for a consistent look.',
      },
    ],
  },
};

export const docsZh = {
  "name": "ChatLayout",
  "displayName": "Chat Layout",
  "description": "用于完整聊天界面的布局外壳。消息按正常页面流排列，输入区固定于底部，并带有毛玻璃停靠区。设置 density（compact/balanced/spacious）可控制间距、消息最大宽度和模糊层尺寸。内置自动滚动、“新消息”滚动到底部按钮，以及输入区后方的毛玻璃模糊层。默认情况下布局根元素就是滚动容器；传入 scrollRef 可将滚动委托给父元素或文档 body。当软件键盘使可视视口缩小时，输入区保持在键盘上方，位于最新消息处的对话也停留在原处。在 Android 的 Chrome 中，输入区会随 Gboard 的滑动同步移动。在 iOS 的 Safari（浏览器内及主屏幕应用）和 Android 的 Firefox 中，浏览器报告键盘出现后，输入区会移动到键盘上方。在触摸屏的顶层页面中，进入输入区文本的每种方式（点按、键盘的上一个或下一个按钮、Tab、输入框的 focus()）都会聚焦它而不滚动页面；在鼠标环境下或 iframe 内则应用浏览器自身的聚焦行为。当页面设置 interactive-widget=resizes-content 时，Android 的 Chrome 会自行按键盘缩小页面，输入区无需移动即可保持在键盘上方（参见浏览器支持指南）。",
  "propDescriptions": {
    "children": "消息内容：通常是 ChatMessageList。在页面中自然流动，并随容器滚动。",
    "composer": "输入区元素：通常是 ChatComposer。通过毛玻璃停靠区固定于底部。",
    "emptyState": "children 为空时显示的内容。在消息区域中垂直居中。",
    "scrollButton": "渲染在输入区上方的滚动到底部按钮。默认为带自动滚动集成的 ChatLayoutScrollButton。传入 null 可隐藏。",
    "scrollRef": "外部滚动容器 ref。提供后，自动滚动和滚动到底部会以该元素而不是布局根元素为目标。当聊天嵌入到由父元素或文档 body 滚动的页面时使用。",
    "density": "视觉密度：控制停靠区内边距、消息区域最大宽度与行内内边距，以及毛玻璃模糊层的高度。"
  },
  "usage": {
    "description": "ChatLayout 是整页聊天界面的布局外壳。它按正常页面流渲染消息，并通过毛玻璃模糊层将输入区停靠到底部。用 density 属性控制间距，默认为 balanced。用它包裹 ChatMessageList 和 ChatComposer，即可获得带内置自动滚动和滚动到底部按钮的完整聊天体验。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将 ChatMessageList 作为 children、ChatComposer 作为 composer 属性传入，构成完整的聊天界面。"
      },
      {
        "guidance": true,
        "description": "提供 emptyState，让新对话显示引导提示，而不是空白屏幕。"
      },
      {
        "guidance": true,
        "description": "当聊天嵌入到由父元素负责滚动的页面时，使用 scrollRef。"
      },
      {
        "guidance": true,
        "description": "将整页 ChatLayout 的容器高度设为 100dvh 而不是 100vh：手机浏览器工具栏收起时，100vh 是工具栏隐藏后的视口高度，输入区会从屏幕边缘之外开始。"
      },
      {
        "guidance": true,
        "description": "Markdown 正文保持 680px 的排版宽度，而代码块和表格横跨消息列。若要让回复只有一条右边界，可给其 Markdown 传入 contentWidth=\"100%\"。"
      },
      {
        "guidance": false,
        "description": "不要在布局上应用固定高度；用 flex: 1 让它填满容器。"
      },
      {
        "guidance": false,
        "description": "不要在同一个滚动容器中渲染多个 ChatLayout 实例；每个实例都期望独占其滚动上下文。"
      }
    ],
    "anatomy": [
      {
        "name": "消息区域",
        "required": true,
        "description": "消息的可滚动区域。以 flex 列渲染 children（通常是 ChatMessageList），列表较短时将内容推到底部。"
      },
      {
        "name": "毛玻璃停靠区",
        "required": true,
        "description": "位于底部的粘性定位或固定容器，带有背景模糊层。容纳滚动按钮和输入区。软件键盘弹出时，它位于键盘上方，消息区域也获得在其上方滚动的空间。"
      },
      {
        "name": "滚动到底部按钮",
        "required": false,
        "description": "当用户向上滚动或有新消息到达时出现。默认为 ChatLayoutScrollButton；传入 null 可隐藏，或传入自定义元素以覆盖。"
      },
      {
        "name": "输入区",
        "required": true,
        "description": "用于发送消息的输入区域，通常是 ChatComposer。停靠在毛玻璃层内的底部。在触摸屏的顶层页面中，其包装元素（不含滚动按钮）是一个无名称的分组。当键盘的“完成”结束输入后，焦点停在该分组上（它不是 Tab 停靠点），因此下一次点按或按 Tab 会从输入区开始。它仅在键盘输入后显示焦点环。在鼠标环境下或 iframe 内，包装元素是普通容器。"
      },
      {
        "name": "空状态",
        "required": false,
        "description": "没有消息时显示的居中占位内容。使用 EmptyState 以获得一致的外观。"
      }
    ]
  }
};

export const docsDense = {
  name: 'ChatLayout',
  displayName: 'Chat Layout',
  description: 'layout shell for full chat; msgs in page flow, composer fixed bottom w/ frosted glass dock; density prop (default balanced); scrollRef delegates to parent/body; in Chrome on Android (Gboard) the composer rides the software keyboard in step; in Safari on iOS and Firefox for Android it moves above the keyboard once reported (Chrome with interactive-widget=resizes-content: the page resizes, no move); transcript stays at newest msg, on a touch screen in a top-level page every focus route (tap, prev/next, Tab, focus()) w/o page scroll and Done rests focus on the composer group (no name, ring after keyboard input only, no tab stop); under a mouse or in an iframe: plain wrapper, browser focus',
  usage: {
    bestPractices: [
      {guidance: true, description: 'Pass ChatMessageList as children and ChatComposer as composer prop for complete chat.'},
      {guidance: true, description: 'Provide emptyState so new conversations show a prompt, not blank screen.'},
      {guidance: true, description: 'Use scrollRef when chat is embedded in a page where a parent element handles scrolling.'},
      {guidance: true, description: 'full-page: container 100dvh not 100vh (100vh = viewport w/ phone toolbar hidden; composer starts below screen edge)'},
      {guidance: true, description: 'Markdown prose keeps 680px measure; code/tables span column. One right edge: pass contentWidth="100%" to Markdown.'},
      {guidance: false, description: 'Apply fixed height on layout; let it fill container with flex: 1.'},
      {guidance: false, description: 'Render multiple ChatLayout instances in same scroll container; each expects to own its scroll context.'},
    ],
  },
  propDescriptions: {
    children: 'msg content; typically ChatMessageList',
    composer: 'composer element; typically ChatComposer; fixed bottom w/ frosted glass',
    emptyState: 'content when children empty',
    scrollButton: 'scroll-to-bottom btn; defaults to ChatLayoutScrollButton; pass null to hide',
    scrollRef: 'external scroll container ref; targets parent/body instead of layout root',
    density: 'visual density; dock padding, message max-width, blur height',
  },
};
