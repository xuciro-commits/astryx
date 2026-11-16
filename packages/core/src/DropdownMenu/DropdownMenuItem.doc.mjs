// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'DropdownMenuItem',
  subComponentOf: 'DropdownMenu',
  displayName: 'Dropdown Menu Item',
  isHiddenFromOverview: true,
  description:
    'One action or destination row in the pointer presentation of DropdownMenu. The parent menu owns keyboard navigation; the row owns activation, disabled state, destination behavior, content layout, and its theme target. Supported host attributes, DOM handlers, className, style, xstyle, and ref reach or compose on the role="menuitem" root.',
  usage: {
    description:
      'Use DropdownMenuItem inside DropdownMenu compound mode for one action or destination. Keep label, description, icon, and endContent non-interactive; controls belong in separate rows or the menu header/footer.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use href for a destination so LinkProvider, modified clicks, middle clicks, and browser link affordances remain available.',
      },
      {
        guidance: true,
        description:
          'Use hasCloseOnSelect=false only when activation reports a result in place on the same row.',
      },
      {
        guidance: false,
        description:
          'Put buttons, links, or other focusable controls inside label, description, or endContent. Each menu row is one interactive target.',
      },
    ],
    anatomy: [
      {
        name: 'Row',
        required: true,
        description:
          'The role="menuitem" root that owns activation, disabled state, destination behavior, and theme state.',
      },
      {
        name: 'Content',
        required: true,
        description:
          'The non-interactive label plus optional icon, description, and end content.',
      },
    ],
  },
  theming: {
    targets: [
      {
        className: 'astryx-dropdown-menu-item',
        visualProps: ['size', 'variant'],
      },
    ],
  },
  playground: {
    // Standalone DropdownMenuItem has no required props, so the properties-tab
    // preview renders an empty row without seeded content. Seed a label and
    // description so the preview is meaningful.
    defaults: {label: 'Edit', description: 'Modify this item'},
  },
  props: [
    {
      name: 'icon',
      type: 'IconType',
      description:
        'Icon to display before the label. See `astryx docs icons` for valid semantic names.',
    },
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Primary label text.',
      required: true,
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Secondary description text displayed below the label.',
    },
    {
      name: 'onClick',
      type: '(event: MouseEvent) => void',
      description:
        "Callback when the item is selected. A keyboard activation arrives as a synthesized click carrying the key's modifiers. On a row with `href` it runs before the browser navigates and is skipped for a modified click (⌘, Ctrl, Shift, Alt, middle button), which is left to the browser.",
    },
    {
      name: 'href',
      type: 'string',
      description:
        'Address the row navigates to. The row then renders as a real anchor with role="menuitem" (through LinkProvider), so a modified click or a middle click keeps the browser\'s meaning — a new tab — instead of running onClick.',
    },
    {
      name: 'target',
      type: "'_blank' | '_self'",
      description: 'Link target. Only used with href.',
    },
    {
      name: 'rel',
      type: 'string',
      description:
        'Link relationship. noopener noreferrer is added for target="_blank". Only used with href.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Whether the row is unavailable. Disabled rows expose aria-disabled, remove link destinations, and suppress activation.',
      default: 'false',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Non-interactive content rendered after the label and description.',
    },
    {
      name: 'hasCloseOnSelect',
      type: 'boolean',
      description:
        'Whether activating the item closes the menu. Set false for an action that reports its result on the item itself.',
      default: 'true',
    },
    {
      name: 'variant',
      type: "'default' | 'destructive'",
      description:
        "Visual variant. 'destructive' renders the label, description, and icon in the error color for dangerous actions (e.g. Delete).",
      default: "'default'",
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLElement>',
      description:
        'Ref forwarded to the row root, the element carrying role="menuitem". Register the row with an element-keyed observer or overlay.',
    },
  ],
};

export const docsZh = {
  "name": "DropdownMenuItem",
  "isHiddenFromOverview": true,
  "displayName": "Dropdown Menu Item",
  "description": "DropdownMenu 指针呈现中的一个操作或目标行。键盘导航由父菜单负责；该行负责激活、禁用状态、目标行为、内容布局及其主题目标。受支持的宿主属性、DOM 处理函数、className、style、xstyle 和 ref 会传递或组合到 role=\"menuitem\" 根元素上。",
  "props": [
    {
      "name": "icon",
      "type": "IconType",
      "description": "显示在标签之前的图标。有效语义名称见 `astryx docs icons`。"
    },
    {
      "name": "label",
      "type": "ReactNode",
      "description": "主标签文本。",
      "required": true
    },
    {
      "name": "description",
      "type": "ReactNode",
      "description": "显示在标签下方的辅助描述文本。"
    },
    {
      "name": "onClick",
      "type": "(event: MouseEvent) => void",
      "description": "选中该项时的回调。键盘激活会以携带按键修饰符的合成点击形式到达。在带 `href` 的行上，它会在浏览器导航前运行，并在带修饰键的点击（⌘、Ctrl、Shift、Alt、中键）时跳过，交由浏览器处理。"
    },
    {
      "name": "href",
      "type": "string",
      "description": "该行导航到的地址。此时该行会（通过 LinkProvider）渲染为带 role=\"menuitem\" 的真实锚点，因此带修饰键的点击或中键点击会保留浏览器的语义——在新标签页打开——而不会运行 onClick。"
    },
    {
      "name": "target",
      "type": "'_blank' | '_self'",
      "description": "链接目标。仅与 href 一起使用。"
    },
    {
      "name": "rel",
      "type": "string",
      "description": "链接关系。当 target=\"_blank\" 时会添加 noopener noreferrer。仅与 href 一起使用。"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "该行是否不可用。禁用的行会暴露 aria-disabled、移除链接目标并抑制激活。",
      "default": "false"
    },
    {
      "name": "endContent",
      "type": "ReactNode",
      "description": "在标签和描述之后渲染的非交互内容。"
    },
    {
      "name": "hasCloseOnSelect",
      "type": "boolean",
      "description": "激活该项是否关闭菜单。对于在项自身就地报告结果的操作，请设为 false。",
      "default": "true"
    },
    {
      "name": "variant",
      "type": "'default' | 'destructive'",
      "description": "视觉变体。'destructive' 会以错误色渲染标签、描述和图标，用于危险操作（例如删除）。",
      "default": "'default'"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 `stylex.create()` 的值：不能是 `style={{}}` 这样的内联样式对象。"
    },
    {
      "name": "ref",
      "type": "React.Ref<HTMLElement>",
      "description": "转发到行根元素的 ref，即携带 role=\"menuitem\" 的元素。可使用以元素为键的观察器或浮层注册该行。"
    }
  ],
  "usage": {
    "description": "在 DropdownMenu 复合模式中使用 DropdownMenuItem 表示一个操作或目标。保持 label、description、icon 和 endContent 非交互；控件应放在单独的行或菜单页眉/页脚中。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "为目标使用 href，以便保留 LinkProvider、带修饰键的点击、中键点击和浏览器链接能力。"
      },
      {
        "guidance": true,
        "description": "仅当激活后在同一行就地报告结果时，才使用 hasCloseOnSelect=false。"
      },
      {
        "guidance": false,
        "description": "不要将按钮、链接或其他可聚焦控件放入 label、description 或 endContent。每个菜单行都是一个交互目标。"
      }
    ],
    "anatomy": [
      {
        "name": "行",
        "required": true,
        "description": "role=\"menuitem\" 根元素，负责激活、禁用状态、目标行为和主题状态。"
      },
      {
        "name": "内容",
        "required": true,
        "description": "非交互标签，以及可选的图标、描述和末端内容。"
      }
    ]
  },
  "propDescriptions": {
    "icon": "显示在标签之前的图标。有效语义名称见 `astryx docs icons`。",
    "label": "主标签文本。",
    "description": "显示在标签下方的辅助描述文本。",
    "onClick": "选中该项时的回调。键盘激活会以携带按键修饰符的合成点击形式到达。在带 `href` 的行上，它会在浏览器导航前运行，并在带修饰键的点击（⌘、Ctrl、Shift、Alt、中键）时跳过，交由浏览器处理。",
    "href": "该行导航到的地址。此时该行会（通过 LinkProvider）渲染为带 role=\"menuitem\" 的真实锚点，因此带修饰键的点击或中键点击会保留浏览器的语义——在新标签页打开——而不会运行 onClick。",
    "target": "链接目标。仅与 href 一起使用。",
    "rel": "链接关系。当 target=\"_blank\" 时会添加 noopener noreferrer。仅与 href 一起使用。",
    "isDisabled": "该行是否不可用。禁用的行会暴露 aria-disabled、移除链接目标并抑制激活。",
    "endContent": "在标签和描述之后渲染的非交互内容。",
    "hasCloseOnSelect": "激活该项是否关闭菜单。对于在项自身就地报告结果的操作，请设为 false。",
    "variant": "视觉变体。'destructive' 会以错误色渲染标签、描述和图标，用于危险操作（例如删除）。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 `stylex.create()` 的值：不能是 `style={{}}` 这样的内联样式对象。",
    "ref": "转发到行根元素的 ref，即携带 role=\"menuitem\" 的元素。可使用以元素为键的观察器或浮层注册该行。"
  }
};

export const docsDense = {
  name: 'DropdownMenuItem',
  displayName: 'Dropdown Menu Item',
  description:
    'one pointer-menu action/destination row; parent owns keyboard, row owns activation, state, destination, content, and root inputs',
  propDescriptions: {
    icon: 'icon before label',
    label: 'primary label text',
    description: 'secondary text below label',
    onClick:
      'selection callback (event); keyboard activation = synthesized click w/ modifiers; skipped for a modified click on an href row',
    href: 'row is a real anchor w/ role=menuitem; modified/middle click keeps browser meaning',
    target: "link target ('_blank' | '_self'), with href",
    rel: 'link rel; noopener noreferrer added for _blank',
    isDisabled: 'unavailable; removes destinations and suppresses activation',
    endContent: 'non-interactive content after label+description',
    hasCloseOnSelect:
      'false keeps the menu open on activation (in-place result on the item)',
    variant:
      "'destructive' renders the item in the error color for dangerous actions",
    xstyle: 'StyleX styles for root container',
    ref: 'forwarded to the row root (the role="menuitem" element)',
  },
};
