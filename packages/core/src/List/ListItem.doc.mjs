// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ListItem',
  subComponentOf: 'List',
  displayName: 'List Item',
  isHiddenFromOverview: true,
  description:
    'List item with label, description, start/end content slots, and interactive patterns.',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description:
        'Primary content. A plain string gets single-line truncation automatically; a ReactNode renders as given, so child components control their own text behavior.',
      required: true,
    },
    {
      name: 'description',
      type: 'ReactNode',
      description:
        'Secondary content below the label. A plain string gets single-line truncation automatically; a ReactNode lets child components control their own wrapping and line-clamp behavior.',
    },
    {
      name: 'startContent',
      type: 'ReactNode',
      description:
        'Content rendered before the label area (e.g. icon, avatar).',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'check',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Content rendered after the label area (e.g. badge, chevron).',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'chevronDown',
            size: 'sm',
          },
        },
        {
          __element: 'Badge',
          props: {
            label: '3',
          },
        },
      ],
    },
    {
      name: 'onClick',
      type: '(e: MouseEvent) => void',
      description: 'Click handler; enables the invisible button pattern.',
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
        'Link URL; enables the invisible anchor pattern. The destination follows the shared navigation rule described on the Link `href` prop.',
    },
    {
      name: 'target',
      type: 'string',
      description:
        'Link target attribute, only applicable when href is provided. target="_blank" automatically adds noopener noreferrer.',
    },
    {
      name: 'rel',
      type: 'string',
      description:
        'Link relationship tokens. noopener noreferrer are merged automatically for target="_blank".',
    },
    {
      name: 'align',
      type: "'center' | 'start' | 'first-line'",
      description:
        'Vertical alignment of the start and end content against the label, passed through to Item unchanged. `first-line` keeps a small mark (a status dot, an icon) level with the first line of a wrapped label. See Item.align.',
      default: "'center'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Disabled state; interactive rows stay keyboard-reachable, expose aria-disabled, and cannot activate.',
      default: 'false',
    },
    {
      name: 'isSelected',
      type: 'boolean',
      description:
        'Selected state; marks the item as the current one with aria-current="true" (a list item cannot carry aria-selected).',
      default: 'false',
    },
    {
      name: 'itemKey',
      type: 'string | number',
      description: "The row's item key, a string or a number from the data (the shape Table's idKey returns). It is the row's identity for the list's animated layout (List animatedLayout): with a handle, the list matches rows by it to animate inserts, removals and moves, and a row without one changes at once. In a reorderable List (List reorderable), it is the key the reorderable object's onReorder reports and isReorderable is asked about, and a row without one has no reorder handle and keeps its place. Separate from React's key.",
    },
    {
      name: 'swipe',
      type: 'Swipe',
      description:
        "Swipe actions for touch, made by createSwipe({leading?, trailing?, swipeBehavior?}) and passed to Item with this row's itemKey added: the verbs a sideways drag uncovers on each side, each `{id, label, icon?, onActivate({id, itemKey}), isDisabled?, variant?: ItemSwipeActionVariant, hasRemoval?}`, where `itemKey` is this row's. One definition at module scope serves every row. See Item.swipe; List clips its rows in the inline axis for them. A verb reachable only by swipe is unreachable by keyboard and by mouse, so give each entry a second home in the row.",
    },
    {
      name: 'swipeActions',
      type: '{leading?: ItemSwipeAction[]; trailing?: ItemSwipeAction[]}',
      description:
        "Deprecated (DEP-0017): pass swipe={createSwipe({leading, trailing})} instead. Each entry is `{id?, label, icon?, onActivate, isDisabled?, variant?: 'neutral' | 'accent' | 'destructive', hasRemoval?}`. Passed through to Item unchanged; astryx upgrade rewrites static uses.",
    },
    {
      name: 'swipeBehavior',
      type: "'reveal' | 'commit'",
      description:
        "Deprecated (DEP-0017): pass swipeBehavior in createSwipe's options instead. Passed through to Item unchanged; astryx upgrade rewrites static uses.",
      default: "'reveal'",
    },
  ],
};

export const docsZh = {
  "name": "ListItem",
  "isHiddenFromOverview": true,
  "displayName": "List Item",
  "description": "带有标签、描述、起始/结束内容插槽和交互模式的列表条目。",
  "props": [
    {
      "name": "label",
      "type": "ReactNode",
      "description": "主要内容。纯字符串会自动进行单行截断；ReactNode 按原样渲染，因此子组件控制自己的文本行为。",
      "required": true
    },
    {
      "name": "description",
      "type": "ReactNode",
      "description": "标签下方的次要内容。纯字符串会自动进行单行截断；ReactNode 允许子组件控制自己的换行和行数限制行为。"
    },
    {
      "name": "startContent",
      "type": "ReactNode",
      "description": "渲染在标签区域之前的内容（例如图标、头像）。"
    },
    {
      "name": "endContent",
      "type": "ReactNode",
      "description": "渲染在标签区域之后的内容（例如徽章、尖角符号）。"
    },
    {
      "name": "onClick",
      "type": "(e: MouseEvent) => void",
      "description": "点击处理函数；启用隐形按钮模式。"
    },
    {
      "name": "interactiveRef",
      "type": "RefObject<HTMLElement | null>",
      "description": "指向嵌套控件（例如 startContent 中的复选框）的 ref，该控件拥有条目的键盘访问和操作。行会成为放大的点击/点按目标，将表面点击委托给它（useClickableContainer），并且不渲染隐形按钮/锚点，因此行不会增加第二个 Tab 停靠点（WCAG 4.1.2）。与 onClick/href 互斥；设置后它们会被忽略。"
    },
    {
      "name": "href",
      "type": "string",
      "description": "链接 URL；启用隐形锚点模式。目标遵循 Link `href` 属性上描述的共享导航规则。"
    },
    {
      "name": "target",
      "type": "string",
      "description": "链接 target 属性，仅在提供 href 时适用。target=\"_blank\" 会自动添加 noopener noreferrer。"
    },
    {
      "name": "rel",
      "type": "string",
      "description": "链接关系令牌。target=\"_blank\" 时会自动合并 noopener noreferrer。"
    },
    {
      "name": "align",
      "type": "'center' | 'start' | 'first-line'",
      "description": "起始和结束内容相对于标签的垂直对齐方式，原样传递给 Item。`first-line` 使小标记（状态点、图标）与换行标签的第一行保持水平对齐。参见 Item.align。",
      "default": "'center'"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "禁用状态；交互行仍可通过键盘到达，暴露 aria-disabled，且无法激活。",
      "default": "false"
    },
    {
      "name": "isSelected",
      "type": "boolean",
      "description": "选中状态；用 aria-current=\"true\" 将条目标记为当前项（列表条目不能携带 aria-selected）。",
      "default": "false"
    },
    {
      "name": "itemKey",
      "type": "string | number",
      "description": "行的条目键，来自数据的字符串或数字（Table 的 idKey 返回的形状）。它是行的标识，用于列表的动态布局（List 的 animatedLayout）：提供句柄时，列表按它匹配行以对插入、删除和移动进行动画，没有 itemKey 的行会立即变化。在可重排的 List（List 的 reorderable）中，它是可重排对象的 onReorder 报告并用于查询 isReorderable 的键，没有该键的行没有重排手柄并保持原位。与 React 的 key 无关。"
    },
    {
      "name": "swipe",
      "type": "Swipe",
      "description": "用于触摸的滑动操作，由 createSwipe({leading?, trailing?, swipeBehavior?}) 创建，并添加此行的 itemKey 后传给 Item：向侧边拖动时在每侧显露的动词，每个为 `{id, label, icon?, onActivate({id, itemKey}), isDisabled?, variant?: ItemSwipeActionVariant, hasRemoval?}`，其中 `itemKey` 是此行的。模块作用域中的一份定义即可服务于每一行。参见 Item.swipe；List 会为它们在行内轴上裁剪行。只能通过滑动触达的动词无法通过键盘和鼠标触达，因此请为每个条目在行中提供第二个入口。"
    },
    {
      "name": "swipeActions",
      "type": "{leading?: ItemSwipeAction[]; trailing?: ItemSwipeAction[]}",
      "description": "已弃用（DEP-0017）：请改为传入 swipe={createSwipe({leading, trailing})}。每个条目为 `{id?, label, icon?, onActivate, isDisabled?, variant?: 'neutral' | 'accent' | 'destructive', hasRemoval?}`。原样传递给 Item；astryx upgrade 会重写静态用法。"
    },
    {
      "name": "swipeBehavior",
      "type": "'reveal' | 'commit'",
      "description": "已弃用（DEP-0017）：请改为在 createSwipe 的选项中传入 swipeBehavior。原样传递给 Item；astryx upgrade 会重写静态用法。",
      "default": "'reveal'"
    }
  ],
  "propDescriptions": {
    "label": "主要内容。纯字符串会自动进行单行截断；ReactNode 按原样渲染，因此子组件控制自己的文本行为。",
    "description": "标签下方的次要内容。纯字符串会自动进行单行截断；ReactNode 允许子组件控制自己的换行和行数限制行为。",
    "startContent": "渲染在标签区域之前的内容（例如图标、头像）。",
    "endContent": "渲染在标签区域之后的内容（例如徽章、尖角符号）。",
    "onClick": "点击处理函数；启用隐形按钮模式。",
    "interactiveRef": "指向嵌套控件（例如 startContent 中的复选框）的 ref，该控件拥有条目的键盘访问和操作。行会成为放大的点击/点按目标，将表面点击委托给它（useClickableContainer），并且不渲染隐形按钮/锚点，因此行不会增加第二个 Tab 停靠点（WCAG 4.1.2）。与 onClick/href 互斥；设置后它们会被忽略。",
    "href": "链接 URL；启用隐形锚点模式。目标遵循 Link `href` 属性上描述的共享导航规则。",
    "target": "链接 target 属性，仅在提供 href 时适用。target=\"_blank\" 会自动添加 noopener noreferrer。",
    "rel": "链接关系令牌。target=\"_blank\" 时会自动合并 noopener noreferrer。",
    "align": "起始和结束内容相对于标签的垂直对齐方式，原样传递给 Item。`first-line` 使小标记（状态点、图标）与换行标签的第一行保持水平对齐。参见 Item.align。",
    "isDisabled": "禁用状态；交互行仍可通过键盘到达，暴露 aria-disabled，且无法激活。",
    "isSelected": "选中状态；用 aria-current=\"true\" 将条目标记为当前项（列表条目不能携带 aria-selected）。",
    "itemKey": "行的条目键，来自数据的字符串或数字（Table 的 idKey 返回的形状）。它是行的标识，用于列表的动态布局（List 的 animatedLayout）：提供句柄时，列表按它匹配行以对插入、删除和移动进行动画，没有 itemKey 的行会立即变化。在可重排的 List（List 的 reorderable）中，它是可重排对象的 onReorder 报告并用于查询 isReorderable 的键，没有该键的行没有重排手柄并保持原位。与 React 的 key 无关。",
    "swipe": "用于触摸的滑动操作，由 createSwipe({leading?, trailing?, swipeBehavior?}) 创建，并添加此行的 itemKey 后传给 Item：向侧边拖动时在每侧显露的动词，每个为 `{id, label, icon?, onActivate({id, itemKey}), isDisabled?, variant?: ItemSwipeActionVariant, hasRemoval?}`，其中 `itemKey` 是此行的。模块作用域中的一份定义即可服务于每一行。参见 Item.swipe；List 会为它们在行内轴上裁剪行。只能通过滑动触达的动词无法通过键盘和鼠标触达，因此请为每个条目在行中提供第二个入口。",
    "swipeActions": "已弃用（DEP-0017）：请改为传入 swipe={createSwipe({leading, trailing})}。每个条目为 `{id?, label, icon?, onActivate, isDisabled?, variant?: 'neutral' | 'accent' | 'destructive', hasRemoval?}`。原样传递给 Item；astryx upgrade 会重写静态用法。",
    "swipeBehavior": "已弃用（DEP-0017）：请改为在 createSwipe 的选项中传入 swipeBehavior。原样传递给 Item；astryx upgrade 会重写静态用法。"
  }
};

export const docsDense = {
  name: 'ListItem',
  isHiddenFromOverview: true,
  displayName: 'List Item',
  description:
    'List item w/ label, description, start/end content slots, interactive patterns.',
  propDescriptions: {
    align:
      "Start/end content alignment, passed to Item: 'center' (default), 'start', or 'first-line' (centered on the label's first line).",
    label:
      'Primary content. String auto-truncates; ReactNode renders as given.',
    description: 'Secondary text below label.',
    startContent: 'Content before label area (e.g. icon, avatar).',
    endContent: 'Content after label area (e.g. badge, chevron).',
    onClick: 'Click handler; enables invisible button pattern.',
    interactiveRef:
      "Ref to a nested control that owns the item's keyboard access/action; row delegates surface clicks to it (useClickableContainer), no invisible button/anchor, no second tab stop (WCAG 4.1.2). Mutually exclusive with onClick/href.",
    href: 'Link URL; enables invisible anchor pattern. Follows the shared navigation rule (see Link href).',
    target:
      'Link target attribute, only when href provided. target="_blank" auto-adds noopener noreferrer.',
    rel: 'Link relationship tokens. noopener noreferrer are merged for target="_blank".',
    isDisabled:
      'Disabled state; interactive rows stay keyboard-reachable and cannot activate.',
    isSelected: 'Selected state; sets aria-current="true".',
    itemKey: "The row's identity for List animatedLayout and the key a reorderable List's onReorder reports; a row without one changes at once and has no reorder handle.",
  },
};
