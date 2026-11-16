// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Breadcrumbs',
  displayName: 'Breadcrumbs',
  group: 'Breadcrumbs',
  category: 'Navigation',
  keywords: ["breadcrumbs","breadcrumb","navigation","nav","crumbs","trail","path","hierarchy","wayfinding","steps"],
  usage: {
    description:
      'Breadcrumbs show a trail of links from the root to the current page. Use them at the top of detail pages, settings panels, or anywhere the user needs to see where they are and navigate back up.',
    bestPractices: [
      {guidance: true, description: 'Place breadcrumbs above the page heading so the user sees their location before reading the content.'},
      {guidance: true, description: 'Keep labels short and match the page titles they link to: "Settings" not "Application Settings Page".'},
      {guidance: true, description: 'Use the supporting variant in dense UIs like admin panels or sidebars where the breadcrumb should be subtle.'},
      {guidance: true, description: 'Make the last item plain text, not a link; it represents the current page. The component does this automatically when you set isCurrent.'},
      {guidance: true, description: 'The component implements the WAI-ARIA APG Breadcrumb pattern: a labelled nav landmark wrapping an ordered list, with aria-current="page" on the current item. A crumb with a menu additionally implements the APG Menu Button pattern, opening on Enter, Space or ArrowDown and closing on Escape.'},
      {guidance: true, description: 'Give each trail its own label when a page renders more than one, so the nav landmarks stay distinguishable in a screen reader landmark list.'},
      {guidance: false, description: 'Use breadcrumbs as the primary navigation. They supplement a sidebar or top nav, not replace it.'},
      {guidance: false, description: 'Show breadcrumbs on top-level pages that have no parent; they add clutter without helping the user.'},
      {guidance: false, description: 'Let the trail grow beyond 5 levels. If you need more, consider simplifying the page hierarchy instead.'},
      {guidance: true, description: 'The built-in slash separator mirrors automatically in RTL. For a custom separator, leave Unicode-mirrored angle quotes such as › alone; mirror arrows and Icon separators once with rtlStyles.mirror.'},
      {guidance: false, description: 'Mirror a separator the bidi algorithm already mirrors. An angle-quote glyph such as › is Bidi_Mirrored, so it flips under RTL on its own and rtlStyles.mirror would flip it back. An arrow glyph such as → and any Icon separator are not, so those do need rtlStyles.mirror through xstyle.'},
    ],
    anatomy: [
      {name: 'Trail', required: true, description: 'The ordered list of links from root to current page.'},
      {name: 'Item', required: true, description: 'A single step in the trail. Renders as a link or plain text for the current page.'},
      {name: 'Separator', required: true, description: 'The character between items. Defaults to "/" but can be customized.'},
      {name: 'Icon', required: false, description: 'An optional icon before an item label, like a home icon on the first item.'},
    ],
  },
  theming: {
    targets: [
      {className: 'astryx-breadcrumb-item', visualProps: ['variant']},
      {
        className: 'astryx-breadcrumb-item-menu-trigger',
        visualProps: ['variant'],
      },
      {className: 'astryx-breadcrumb-menu'},
      {className: 'astryx-breadcrumbs', visualProps: ['variant']},
    ],
  },
  description: 'Navigation container that renders a <nav> with an ordered list of breadcrumb items.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'BreadcrumbItem elements to render inside the breadcrumb trail.',
      slotElements: [
        {
          __element: 'BreadcrumbItem',
          props: {
            href: '#',
          },
          children: 'Page',
        },
      ],
      required: true,
    },
    {
      name: 'separator',
      type: 'ReactNode',
      description: 'Separator rendered between breadcrumb items. The built-in slash mirrors automatically in RTL.',
      default: "'/'",
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'chevronRight',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'variant',
      type: "'default' | 'supporting'",
      description: 'Visual variant: supporting is smaller with secondary text styling.',
      default: "'default'",
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the nav landmark (aria-label).',
      default: "'Breadcrumb'",
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
  ],
  components: [
    {
      name: 'BreadcrumbItem',
      displayName: 'Breadcrumb Item',
      description: 'Individual breadcrumb item. Renders as a link when href is provided, or as plain text for the current page.',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Label content for the breadcrumb item.',
          required: true,
        },
        {
          name: 'href',
          type: 'string',
          description: 'URL the breadcrumb links to; omit for non-navigable items.',
        },
        {
          name: 'onClick',
          type: '(e: MouseEvent) => void',
          description: 'Click handler for the breadcrumb item.',
        },
        {
          name: 'isCurrent',
          type: 'boolean',
          description:
            'Marks this item as the current page, applying aria-current="page". When omitted, the last item is auto-detected if no item is explicitly current; pass false to opt out.',
        },
        {
          name: 'startIcon',
          type: 'ReactNode',
          description: 'Icon rendered before the item label.',
        },
        {
          name: 'as',
          type: 'LinkComponentType',
          description: 'Custom link component to render instead of <a>. Overrides the provider-level default from LinkProvider. Only applies to non-current items.',
        },
        {
          name: 'menu',
          type: 'DropdownMenuOption[] | ReactNode',
          description:
            'Menu opened when the item is activated, using the same item API as DropdownMenu/MoreMenu/ContextMenu (a DropdownMenuOption[] array or composed DropdownMenuItem children). Renders a link-styled menu trigger with a chevron and aria-haspopup="menu". Takes precedence over href/onClick.',
        },
        {
          name: 'menuSize',
          type: "'sm' | 'md' | 'lg'",
          description:
            "Size passed to the menu items. Defaults from the breadcrumb variant ('supporting' → 'sm', otherwise 'md').",
        },
      ],
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "面包屑显示从根级到当前页面的链接路径。将其放在详情页、设置面板的顶部，或任何用户需要了解当前位置并向上返回的地方。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将面包屑放在页面标题上方，让用户在阅读内容前先看到自己的位置。"
      },
      {
        "guidance": true,
        "description": "保持标签简短，并与链接目标的页面标题一致：用 \"Settings\"，而不是 \"Application Settings Page\"。"
      },
      {
        "guidance": true,
        "description": "在管理面板或侧边栏等密集界面中，当面包屑应保持低调时，使用 supporting 变体。"
      },
      {
        "guidance": true,
        "description": "将最后一项设为纯文本而非链接；它表示当前页面。设置 isCurrent 时组件会自动这样处理。"
      },
      {
        "guidance": true,
        "description": "该组件实现了 WAI-ARIA APG 面包屑模式：一个带标签的 nav 地标包裹有序列表，当前项带有 aria-current=\"page\"。带菜单的面包屑项还实现了 APG 菜单按钮模式，按 Enter、Space 或 ArrowDown 打开，按 Escape 关闭。"
      },
      {
        "guidance": true,
        "description": "当页面渲染多条面包屑路径时，为每条路径提供各自的标签，以便屏幕阅读器的地标列表能区分各个 nav 地标。"
      },
      {
        "guidance": false,
        "description": "将面包屑用作主导航。它们是对侧边栏或顶部导航的补充，而不是替代。"
      },
      {
        "guidance": false,
        "description": "在没有父级的顶层页面上显示面包屑；这只会增加杂乱，对用户没有帮助。"
      },
      {
        "guidance": false,
        "description": "让面包屑路径超过 5 层。如果需要更多层级，应考虑简化页面层级结构。"
      },
      {
        "guidance": true,
        "description": "内置的斜杠分隔符在 RTL 中会自动镜像。对于自定义分隔符，Unicode 镜像的尖引号（如 ›）应保持原样；箭头和 Icon 分隔符需通过 rtlStyles.mirror 镜像一次。"
      },
      {
        "guidance": false,
        "description": "镜像一个双向算法已经镜像的分隔符。像 › 这样的尖引号字形是 Bidi_Mirrored，在 RTL 下会自动翻转，而 rtlStyles.mirror 会把它翻转回去。像 → 这样的箭头字形和任何 Icon 分隔符则不是，因此这些确实需要通过 xstyle 应用 rtlStyles.mirror。"
      }
    ],
    "anatomy": [
      {
        "name": "路径",
        "required": true,
        "description": "从根级到当前页面的有序链接列表。"
      },
      {
        "name": "项",
        "required": true,
        "description": "路径中的单个步骤。对于当前页面，渲染为链接或纯文本。"
      },
      {
        "name": "分隔符",
        "required": true,
        "description": "项之间的字符。默认为 \"/\"，但可以自定义。"
      },
      {
        "name": "图标",
        "required": false,
        "description": "项标签前的可选图标，例如第一项上的主页图标。"
      }
    ]
  },
  "name": "Breadcrumbs",
  "description": "导航容器，渲染一个包含有序面包屑项列表的 <nav>。",
  "propDescriptions": {
    "children": "要在面包屑路径内渲染的 BreadcrumbItem 元素。",
    "separator": "在面包屑项之间渲染的分隔符。内置斜杠在 RTL 中会自动镜像。",
    "variant": "视觉变体：supporting 更小，使用次要文本样式。",
    "label": "nav 地标的无障碍标签（aria-label）。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值，而不是像 style={{}} 这样的内联样式对象。"
  },
  "components": [
    {
      "name": "BreadcrumbItem",
      "description": "单个面包屑项。提供 href 时渲染为链接，否则对当前页面渲染为纯文本。",
      "propDescriptions": {
        "children": "面包屑项的标签内容。",
        "href": "面包屑链接指向的 URL；不可导航的项可省略。",
        "onClick": "面包屑项的点击处理函数。",
        "isCurrent": "将此项标记为当前页面，并应用 aria-current=\"page\"。省略时，如果没有项被显式标记为当前项，会自动检测最后一项；传入 false 可退出该行为。",
        "startIcon": "在项标签前渲染的图标。",
        "as": "用于替代 <a> 渲染的自定义链接组件。覆盖 LinkProvider 提供的提供者级默认值。仅适用于非当前项。",
        "menu": "项被激活时打开的菜单，使用与 DropdownMenu/MoreMenu/ContextMenu 相同的项 API（DropdownMenuOption[] 数组或组合的 DropdownMenuItem 子元素）。渲染一个链接样式的菜单触发器，带一个尖角符号和 aria-haspopup=\"menu\"。优先于 href/onClick。",
        "menuSize": "传递给菜单项的尺寸。默认取自面包屑变体（'supporting' → 'sm'，否则为 'md'）。"
      }
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'link trail from root to current page for wayfinding',
  usage: {
    description:
      'Breadcrumbs show a trail of links from root to current page. Use at the top of detail pages, settings, or nested content.',
    bestPractices: [
      {guidance: true, description: 'Place above the page heading so user sees location before reading content.'},
      {guidance: true, description: 'Keep labels short + matching page titles they link to: "Settings" not "Application Settings Page".'},
      {guidance: true, description: 'Use supporting variant in dense UIs where the breadcrumb should be subtle.'},
      {guidance: true, description: 'Last item plain text, not a link; represents current page; done automatically when you set isCurrent.'},
      {guidance: true, description: 'Implements APG Breadcrumb: labelled nav landmark + ol + aria-current="page". A menu crumb also implements APG Menu Button (Enter/Space/ArrowDown to open, Escape to close).'},
      {guidance: true, description: 'Give each trail its own label when a page renders more than one.'},
      {guidance: false, description: 'Use as primary navigation; breadcrumbs supplement, not replace, a main nav.'},
      {guidance: false, description: 'Show on top-level pages with no parent.'},
      {guidance: false, description: 'Let the trail exceed 5 levels; simplify the hierarchy instead.'},
      {guidance: true, description: 'Built-in / mirrors automatically in RTL. Leave bidi-mirrored › alone; mirror custom arrows and Icons once.'},
      {guidance: false, description: 'Mirror a separator that already mirrors itself: › is Bidi_Mirrored and flips under RTL on its own. → and Icon separators are not, so those need rtlStyles.mirror via xstyle.'},
    ],
  },
};
