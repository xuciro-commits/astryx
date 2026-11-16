// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Item',
  displayName: 'Item',
  group: 'Item',
  category: 'Table & List',
  isHiddenFromOverview: true,
  keywords: [
    'item',
    'list-item',
    'media-object',
    'row',
    'cell',
    'entity',
    'contact',
    'notification',
    'preview',
  ],
  playground: {
    defaults: {
      label: 'Item label',
      description: 'Supporting text',
    },
  },
  theming: {
    targets: [
      {
        className: 'astryx-item',
        visualProps: ['density', 'align'],
        states: ['highlighted', 'selected', 'disabled'],
      },
      {className: 'astryx-item-swipe-panel', visualProps: ['side']},
      {className: 'astryx-item-swipe-action', visualProps: ['variant']},
    ],
    vars: [
      {
        name: '--_item-label-color',
        description:
          'Color of the label line. Unset by default (the label uses the primary text token); a parent sets it to recolor the label it renders, as the destructive dropdown/context menu item does.',
        default: 'var(--color-text-primary)',
        private: true,
      },
      {
        name: '--_item-description-color',
        description:
          'Companion to --_item-label-color for the secondary description line.',
        default: 'var(--color-text-secondary)',
        private: true,
      },
      {
        name: '--_item-inset-inline',
        description:
          'Inline inset of the row. Item derives its paddingInline from this variable, and List reads it to place rows for its edge treatments (edge="flush", "outset", and "bleed"). Set paddingInline on `item` in a theme and both stay in sync.',
        default: 'var(--spacing-2) (var(--spacing-3) for density="spacious")',
        private: true,
      },
    ],
    derived: [{property: 'paddingInline', vars: ['--_item-inset-inline']}],
  },
  components: [
    {
      name: 'Item',
      displayName: 'Item',
      description:
        'A universal item primitive that unifies the "start content + label + description + end content" layout pattern. Use as a building block for list items, menu items, contact rows, notifications, and more.',
      props: [
        {
          name: 'label',
          type: 'ReactNode',
          description:
            'Primary text identifying this item. Accepts string (auto-truncated) or ReactNode (for rich content).',
          required: true,
        },
        {
          name: 'marker',
          type: 'ReactNode',
          description:
            'Marker rendered before startContent as a direct flex child. Use for list bullets/counters that need custom baseline alignment.',
        },
        {
          name: 'startContent',
          type: 'ReactNode',
          description:
            'Content rendered before the label/description area, such as an icon, avatar, or checkbox.',
          slotElements: [
            {__element: 'Avatar', props: {name: 'Ada Lovelace', size: 'sm'}},
            {
              __element: 'Icon',
              props: {icon: 'info', size: 'sm', color: 'secondary'},
            },
          ],
        },
        {
          name: 'description',
          type: 'ReactNode',
          description:
            'Secondary text: subtitle, description, or supporting info.',
        },
        {
          name: 'endContent',
          type: 'ReactNode',
          description:
            'Content rendered after the label/description area, such as badges, metadata, timestamps, or action buttons.',
          slotElements: [
            {__element: 'Badge', props: {label: 3}},
            {
              __element: 'Text',
              props: {color: 'secondary'},
              children: '2h ago',
            },
          ],
        },
        {
          name: 'as',
          type: "'div' | 'li' | 'span' | ElementType",
          description:
            "What the root renders as: an HTML element, or a component for a caller that needs the root to be something else. A menu row that navigates passes the application's link component here, so the row's root IS the anchor. Give a component only when the row carries a role, and only when no interactive node sits in startContent or endContent.",
          default: "'div'",
        },
        {
          name: 'align',
          type: "'center' | 'start' | 'first-line'",
          description:
            "Vertical alignment of start/end content slots. 'center' centers each slot on the whole text block; 'start' lines up slot tops with the text's top; 'first-line' centers each slot on the label's first line, so a small mark stays level with the first line of a wrapped label. A slot taller than that line moves the text down. The `item` theme target reflects the value as `align`.",
          default: "'center'",
        },
        {
          name: 'density',
          type: "'compact' | 'balanced' | 'spacious'",
          description:
            'Spacing density. "compact" uses 4px block padding, "balanced" uses 8px, and "spacious" uses 12px block and inline padding.',
          default: "'balanced'",
        },
        {
          name: 'labelLines',
          type: 'number',
          description: 'Max lines before label truncates with ellipsis.',
        },
        {
          name: 'descriptionLines',
          type: 'number',
          description: 'Max lines before description truncates with ellipsis.',
        },
        {
          name: 'layout',
          type: "'stacked' | 'inline'",
          description:
            'How the label and description sit together. stacked puts the description on its own line below the label; inline keeps both on one line, description ellipsizing first, so the row fits a fixed-height host.',
          default: "'stacked'",
        },
        {
          name: 'onClick',
          type: '(event: MouseEvent) => void',
          description:
            'Click handler. Makes the item clickable with button semantics.',
        },
        {
          name: 'interactiveRef',
          type: 'RefObject<HTMLElement | null>',
          description:
            "Ref to a nested control (e.g. a checkbox in startContent) that owns the item's keyboard access and action. The row becomes an enlarged click/tap target that delegates surface clicks to it (useClickableContainer) and renders no invisible button/anchor, so the row adds no second tab stop (WCAG 4.1.2). Mutually exclusive with onClick/href; those are ignored when set.",
        },
        {
          name: 'href',
          type: 'string',
          description:
            'Link URL. Makes the item a link via an invisible anchor element. A row whose root is already a link component (see `as`) carries the address on that root instead, and no invisible anchor is rendered.',
        },
        {
          name: 'target',
          type: "'_blank' | '_self'",
          description:
            'Link target. Only used with href. target="_blank" automatically adds noopener noreferrer.',
        },
        {
          name: 'rel',
          type: 'string',
          description:
            'Link relationship tokens. noopener noreferrer are merged automatically for target="_blank".',
        },
        {
          name: 'isHighlighted',
          type: 'boolean',
          description: 'Highlighted state (hover/keyboard focus appearance).',
          default: 'false',
        },
        {
          name: 'isSelected',
          type: 'boolean',
          description: 'Selected state.',
          default: 'false',
        },
        {
          name: 'isDisabled',
          type: 'boolean',
          description:
            'Disabled state. Interactive rows stay keyboard-reachable but cannot activate.',
          default: 'false',
        },
        {
          name: 'swipe',
          type: 'Swipe',
          description:
            "Swipe actions for touch, made by createSwipe({leading?, trailing?, swipeBehavior?}): the verbs a sideways drag uncovers on each side, outermost last, each `{id, label, icon?, onActivate({id, itemKey}), isDisabled?, variant?: ItemSwipeActionVariant, hasRemoval?}`; `itemKey` is the `ListItem`'s, `undefined` on a plain `Item`. `leading` is uncovered by a drag toward the inline end, `trailing` toward the inline start. A finger, a pen or a trackpad's two-finger swipe drags the row; a mouse drag and a mouse wheel's notches never do, and a mostly vertical drag stays the scroller's. An open row closes on a touch tap on its own content, which activates nothing and paints no press, on a press elsewhere, when the list or page scrolls with focus outside it, and on Escape. The gesture is a touch accelerator and never a row's only path to a verb: a verb reachable only by swipe is unreachable by keyboard and by mouse, so every entry must also be reachable through the row's own content. Served on a row whose role permits interactive descendants (a listitem, a row with no role) and not on an option, a menu item, or a row that is the enlarged target of a native radio. The element containing the rows clips in the inline axis with overflow-inline: clip — List does; any other host does it once. `hasRemoval` only says the row holds out after the action fires instead of springing back. The swipe is the same on every device: a finger or a pen swipes the row whatever the primary pointer, a touchscreen laptop's included, and so does a trackpad's two-finger swipe, which moves the row with the fingers and lets it go at their speed; a mouse never does. The swipe's code comes with createSwipe, so a row given swipe is swipeable at its first paint and an app that never imports createSwipe ships none of it. Define the swipe once at module scope, or in useMemo when its handlers need component state. A new value with the same ids neither closes an open row nor restarts its settle; one with other ids closes it.",
        },
        {
          name: 'swipeActions',
          type: '{leading?: ItemSwipeAction[]; trailing?: ItemSwipeAction[]}',
          description:
            "Deprecated (DEP-0017): pass swipe={createSwipe({leading, trailing})} instead. Each entry is `{id?, label, icon?, onActivate, isDisabled?, variant?: 'neutral' | 'accent' | 'destructive', hasRemoval?}`. Still works, with the swipe's current behavior, loading the swipe the first time a row has it, and is ignored when swipe is set; astryx upgrade rewrites static uses.",
        },
        {
          name: 'swipeBehavior',
          type: "'reveal' | 'commit'",
          description:
            "Deprecated (DEP-0017): pass swipeBehavior in createSwipe's options instead. Still works beside swipeActions, with the swipe's current behavior, and is ignored when swipe is set; astryx upgrade rewrites static uses.",
          default: "'reveal'",
        },
        {
          name: 'ref',
          type: 'React.Ref<HTMLElement>',
          description:
            'Ref forwarded to the root element, whose type follows `as`.',
        },
        {
          name: 'xstyle',
          type: 'StyleXStyles',
          description:
            'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value: not an inline style object like style={{}}.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'CSS class name(s) for the root element.',
        },
        {
          name: 'style',
          type: 'React.CSSProperties',
          description: 'Inline styles for the root element.',
        },
        {
          name: 'data-testid',
          type: 'string',
          description: 'Test selector for automated testing frameworks.',
        },
      ],
    },
  ],
  usage: {
    description:
      'A single, flexible item primitive that unifies the "start content + label + description + end content" pattern across Astryx. Use it wherever you need a structured row: dropdown menus, selectors, contact lists, notifications, file browsers, and activity feeds.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use named slots (startContent, label, description, endContent) for the common layout. These cover the 80% case.',
      },
      {
        guidance: true,
        description:
          'Use density="compact" for menus and dense lists, "balanced" for standard rows, and "spacious" for roomier layouts.',
      },
      {
        guidance: true,
        description:
          'Set labelLines and descriptionLines to control truncation when content length varies.',
      },
      {
        guidance: true,
        description:
          'Use align="first-line" when a wrapping label sits beside a small mark (a status dot, a radio, a timestamp) that belongs to its first line. Use align="start" to line up the tops of a tall slot and the text.',
      },
      {
        guidance: true,
        description:
          'Give a swipe action a second home in the row (a menu or a button in endContent): the swipe is a touch accelerator, and a verb reachable only by swipe is unreachable by keyboard and by mouse.',
      },
      {
        guidance: false,
        description:
          "Don't nest interactive elements (buttons, links) inside an interactive Item; it creates confusing focus and click targets.",
      },
      {
        guidance: false,
        description:
          "Don't use Item for navigation between views; use proper navigation components instead.",
      },
      {
        guidance: false,
        description:
          "Don't add read/unread or inbox-specific behavior directly; compose a thin wrapper like PreviewItem instead.",
      },
    ],
    anatomy: [
      {
        name: 'Marker',
        required: false,
        description:
          'Optional list bullet/counter rendered before start content.',
      },
      {
        name: 'Start content',
        required: false,
        description: 'Leading visual: avatar, icon, image, or checkbox.',
      },
      {
        name: 'Label',
        required: true,
        description: 'Primary text identifying the item.',
      },
      {
        name: 'Description',
        required: false,
        description: 'Secondary supporting text below the label.',
      },
      {
        name: 'End content',
        required: false,
        description:
          'End-aligned content: badges, timestamps, or action buttons.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "components": [
    {
      "name": "Item",
      "displayName": "Item",
      "description": "一个通用项目原语，统一了“起始内容 + 标签 + 描述 + 末尾内容”的布局模式。用作列表项、菜单项、联系人行、通知等的构建块。",
      "propDescriptions": {
        "label": "标识该项的主要文本。接受字符串（自动截断）或 ReactNode（用于富内容）。",
        "marker": "作为直接 flex 子元素渲染在 startContent 之前的标记。用于需要自定义基线对齐的列表项目符号/计数器。",
        "startContent": "渲染在标签/描述区域之前的内容，例如图标、头像或复选框。",
        "description": "次要文本：副标题、描述或支持信息。",
        "endContent": "渲染在标签/描述区域之后的内容，例如徽标、元数据、时间戳或操作按钮。",
        "as": "根元素渲染为什么：一个 HTML 元素，或为需要根元素为其他内容的调用方提供的组件。导航的菜单行会在此传入应用中的链接组件，因此该行的根元素就是锚点。仅当行带有 role 时才提供组件，并且仅当 startContent 或 endContent 中没有可交互节点时。",
        "align": "起始/末尾内容插槽的垂直对齐方式。'center' 将每个插槽在整个文本块上居中；'start' 使插槽顶部与文本顶部对齐；'first-line' 将每个插槽在标签的第一行上居中，使小标记与换行标签的第一行保持齐平。比该行更高的插槽会将文本下移。`item` 主题目标以 `align` 反映该值。",
        "density": "间距密度。\"compact\" 使用 4px 块内边距，\"balanced\" 使用 8px，\"spacious\" 使用 12px 块和内联内边距。",
        "labelLines": "标签被省略号截断前的最大行数。",
        "descriptionLines": "描述被省略号截断前的最大行数。",
        "onClick": "点击处理函数。使项目可点击并具有按钮语义。",
        "interactiveRef": "指向嵌套控件（例如 startContent 中的复选框）的 ref，该控件负责项目的键盘访问和操作。该行会成为放大的点击/轻点目标，将表面点击委托给它（useClickableContainer），且不渲染不可见的按钮/锚点，因此该行不会增加第二个 Tab 停靠点（WCAG 4.1.2）。与 onClick/href 互斥；设置后它们会被忽略。",
        "href": "链接 URL。通过不可见的锚点元素使项目成为链接。根元素已经是链接组件的行（参见 `as`）改在该根元素上携带地址，且不会渲染不可见的锚点。",
        "target": "链接目标。仅与 href 一起使用。target=\"_blank\" 会自动添加 noopener noreferrer。",
        "rel": "链接关系令牌。对于 target=\"_blank\"，会自动合并 noopener noreferrer。",
        "isHighlighted": "高亮状态（悬停/键盘聚焦外观）。",
        "isSelected": "选中状态。",
        "isDisabled": "禁用状态。可交互行仍可通过键盘到达，但无法激活。",
        "ref": "转发到根元素的 ref，其类型跟随 `as`。",
        "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值：不是像 style={{}} 这样的内联样式对象。",
        "data-testid": "用于自动化测试框架的测试选择器。",
        "layout": "标签和描述如何放在一起。stacked 将描述放在标签下方的单独一行；inline 将两者保持在一行，描述先被省略号截断，使行适合固定高度的宿主。",
        "swipe": "用于触摸的滑动操作，由 createSwipe({leading?, trailing?, swipeBehavior?}) 创建：横向拖动在每侧揭示的动词，最外侧的排在最后，每个为 `{id, label, icon?, onActivate({id, itemKey}), isDisabled?, variant?: ItemSwipeActionVariant, hasRemoval?}`；`itemKey` 是 `ListItem` 的，在普通 `Item` 上为 `undefined`。`leading` 通过向行内末端拖动来揭示，`trailing` 通过向行内起始方向拖动来揭示。手指、笔或触控板的双指滑动会拖动该行；鼠标拖动和鼠标滚轮的刻度永远不会，而且主要是垂直的拖动仍属于滚动容器。打开的行会在以下情况关闭：触摸轻点其自身内容（不会激活任何内容，也不绘制按下态）、在别处按下、列表或页面在其外部聚焦时滚动，以及按 Escape。该手势是触摸加速器，绝不是行访问动词的唯一路径：只能通过滑动触达的动词，键盘和鼠标都无法触达，因此每个条目也必须能通过行自身的内容触达。仅在 role 允许可交互后代的行动上提供（listitem、没有 role 的行），而不在 option、菜单项或作为原生单选按钮放大目标的行上提供。包含这些行的元素会在内联轴上以 overflow-inline: clip 裁剪——List 会这样做；任何其他宿主只需做一次。`hasRemoval` 仅表示操作触发后行会保持移出状态，而不是弹回。滑动在所有设备上相同：无论主指针是什么，手指或笔都会滑动该行，包括触摸屏笔记本电脑，触控板的双指滑动也是如此，它会随手指移动该行并以手指的速度松开；鼠标永远不会。Swipe 的代码随 createSwipe 一起加载，因此设置了 swipe 的行在首次绘制时即可滑动，而从不导入 createSwipe 的应用不会携带任何相关代码。在模块作用域中定义一次 swipe，或在其处理函数需要组件状态时在 useMemo 中定义。具有相同 id 的新值既不会关闭已打开的行，也不会重新开始其稳定过程；具有其他 id 的值会关闭它。",
        "swipeActions": "已弃用（DEP-0017）：请改为传入 swipe={createSwipe({leading, trailing})}。每个条目为 `{id?, label, icon?, onActivate, isDisabled?, variant?: 'neutral' | 'accent' | 'destructive', hasRemoval?}`。仍可工作，采用滑动当前的行为，在行首次拥有它时加载滑动，并在设置了 swipe 时被忽略；astryx upgrade 会重写静态用法。",
        "swipeBehavior": "已弃用（DEP-0017）：请改为在 createSwipe 的选项中传入 swipeBehavior。仍可与 swipeActions 一起工作，采用滑动当前的行为，并在设置了 swipe 时被忽略；astryx upgrade 会重写静态用法。",
        "className": "根元素的 CSS 类名。",
        "style": "根元素的内联样式。"
      }
    }
  ],
  "usage": {
    "description": "一个单一、灵活的项目原语，统一了 Astryx 中“起始内容 + 标签 + 描述 + 末尾内容”的模式。在需要结构化行的任何地方使用它：下拉菜单、选择器、联系人列表、通知、文件浏览器和活动源。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "对于常见布局使用命名插槽（startContent、label、description、endContent）。它们覆盖 80% 的用例。"
      },
      {
        "guidance": true,
        "description": "菜单和密集列表使用 density=\"compact\"，标准行使用 \"balanced\"，更宽敞的布局使用 \"spacious\"。"
      },
      {
        "guidance": true,
        "description": "当内容长度变化时，设置 labelLines 和 descriptionLines 控制截断。"
      },
      {
        "guidance": true,
        "description": "当换行的标签旁边有一个属于其第一行的小标记（状态点、单选按钮、时间戳）时，使用 align=\"first-line\"。使用 align=\"start\" 使高插槽的顶部与文本的顶部对齐。"
      },
      {
        "guidance": true,
        "description": "为滑动操作在行中提供第二个入口（菜单或 endContent 中的按钮）：滑动是触摸加速器，只能通过滑动触达的动词，键盘和鼠标都无法触达。"
      },
      {
        "guidance": false,
        "description": "不要在可交互的 Item 内嵌套可交互元素（按钮、链接）；这会造成混乱的焦点和点击目标。"
      },
      {
        "guidance": false,
        "description": "不要使用 Item 在视图之间导航；请改用适当的导航组件。"
      },
      {
        "guidance": false,
        "description": "不要直接添加已读/未读或收件箱特定的行为；请改为组合一个薄包装（如 PreviewItem）。"
      }
    ],
    "anatomy": [
      {
        "name": "标记",
        "required": false,
        "description": "可选列表项目符号/计数器，渲染在起始内容之前。"
      },
      {
        "name": "起始内容",
        "required": false,
        "description": "前置视觉元素：头像、图标、图片或复选框。"
      },
      {
        "name": "标签",
        "required": true,
        "description": "标识该项的主要文本。"
      },
      {
        "name": "描述",
        "required": false,
        "description": "标签下方的次要支持文本。"
      },
      {
        "name": "末尾内容",
        "required": false,
        "description": "末尾对齐的内容：徽标、时间戳或操作按钮。"
      }
    ]
  },
  "name": "Item"
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'universal item primitive w/ startContent+label+description+endContent layout. building block for list items, menu items, contacts, notifications',
  usage: {
    description:
      'Flexible item primitive unifying the "start content + label + description + end content" pattern. Use for structured rows in menus, lists, contacts, notifications, file browsers.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Named slots (startContent, label, description, endContent) for the 80% case.',
      },
      {
        guidance: true,
        description:
          'density="compact" for menus/dense lists, "balanced" for standard rows, "spacious" for roomier layouts.',
      },
      {
        guidance: true,
        description: 'labelLines/descriptionLines for truncation control.',
      },
      {
        guidance: true,
        description:
          'align="first-line" for a small mark beside a wrapping label; align="start" to top-align a tall slot with the text.',
      },
      {
        guidance: false,
        description: "Don't nest interactive elements inside interactive Item.",
      },
      {
        guidance: false,
        description: "Don't use for view navigation; use nav components.",
      },
      {
        guidance: false,
        description: "Don't add inbox-specific behavior; compose a wrapper.",
      },
    ],
  },
  components: [
    {
      name: 'Item',
      displayName: 'Item',
      description:
        'universal item primitive w/ startContent+label+description+endContent layout',
      propDescriptions: {
        label:
          'Primary text. String auto-truncates; ReactNode for rich content.',
        marker: 'List bullet/counter before startContent as direct flex child.',
        startContent:
          'Content before label/description: avatar, icon, checkbox, ReactNode.',
        description: 'Secondary text below label.',
        endContent:
          'Content after label/description: badges, timestamps, actions.',
        as: 'Root HTML element.',
        align:
          "Start/end slot alignment: 'center' (default), 'start' (tops), or 'first-line' (centered on the label's first line).",
        density:
          'Spacing: "compact" (4px), "balanced" (8px), or "spacious" (12px).',
        labelLines: 'Max label lines before truncation.',
        descriptionLines: 'Max description lines before truncation.',
        onClick: 'Click handler; enables button semantics.',
        interactiveRef:
          "Ref to a nested control that owns the item's keyboard access/action; row delegates surface clicks to it (useClickableContainer), no invisible button/anchor, no second tab stop (WCAG 4.1.2). Mutually exclusive with onClick/href.",
        href: 'Link URL; enables anchor semantics. Follows the shared navigation rule (see Link href).',
        target:
          'Link target, only with href. target="_blank" auto-adds noopener noreferrer.',
        rel: 'Link relationship tokens. noopener noreferrer are merged for target="_blank".',
        isHighlighted: 'Highlighted state.',
        isSelected: 'Selected state.',
        isDisabled: 'Disabled state.',
        xstyle: 'StyleX layout styles; must be stylex.create() value.',
        'data-testid': 'Test selector.',
      },
    },
  ],
};
