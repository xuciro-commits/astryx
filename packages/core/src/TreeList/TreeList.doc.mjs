// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Tree list',
    required: true,
    description: 'Container that presents the hierarchical tree.',
  },
  {
    name: 'Header',
    required: false,
    description: 'Caller-provided content that visibly names the tree.',
  },
  {
    name: 'Item',
    required: true,
    description: 'Painted row for one node in the hierarchy.',
  },
  {
    name: 'Chevron',
    required: false,
    description:
      'Expand and collapse control rendered for an Item with children.',
  },
  {
    name: 'Chevron glyph',
    required: false,
    description: 'Directional symbol rendered by Icon inside a Chevron.',
  },
  {
    name: 'Item label',
    required: true,
    description: 'Primary content that identifies an Item.',
  },
  {
    name: 'Item description',
    required: false,
    description: 'Secondary text rendered below an Item label.',
  },
  {
    name: 'Start content',
    required: false,
    description: 'Caller-provided content rendered before an Item label.',
  },
  {
    name: 'End content',
    required: false,
    description: 'Caller-provided content rendered after an Item label.',
  },
  {
    name: 'Guide',
    required: false,
    description: 'Connector line that shows parent-child relationships.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TreeList',
  displayName: 'Tree List',
  group: 'TreeList',
  category: 'Table & List',
  keywords: ['tree', 'hierarchy', 'nested', 'accordion', 'folder', 'expand', 'collapse', 'treeview', 'outline'],
  playground: {
    defaults: {
      items: [
        {id: '1', label: 'Documents', children: [
          {id: '1a', label: 'Report.pdf'},
          {id: '1b', label: 'Notes.md'},
        ]},
        {id: '2', label: 'Images', children: [
          {id: '2a', label: 'Photo.jpg'},
        ]},
        {id: '3', label: 'README.md'},
      ],
    },
  },
  theming: {
    targets: [
      {className: 'astryx-tree-list', visualProps: ['density', 'variant']},
      {className: 'astryx-tree-list-item', visualProps: ['density'], states: ['selected', 'disabled']},
      {className: 'astryx-tree-list-chevron', states: ['state']},
      {className: 'astryx-tree-list-item-label', states: ['selected']},
      {className: 'astryx-tree-list-guide'},
    ],
    vars: [
      {name: '--tree-list-indent', description: 'Per-level indentation step. Each nesting level indents its rows by this distance, and the guide lines follow it so they stay aligned. Set it on the `tree-list` target to retune the metric (e.g. `var(--spacing-5)` for a wider indent).', default: 'var(--spacing-4)'},
      {name: '--tree-list-row-gap', description: 'Vertical gap between adjacent rows. Default `2px` (var(--spacing-0-5)) gives a subtle separation; set it on the `tree-list` target to widen or close the gap. The connector guides span the gap automatically (the line stays continuous) and do not overhang the last row, so no guide-height tuning is needed.', default: 'var(--spacing-0-5)'},
      {name: '--_tree-indent', description: 'Distance one row is indented, computed per row from --tree-list-indent and the row depth. Set --tree-list-indent to retune indentation; this is the resolved value.', default: '0px', private: true},
      {name: '--_tree-focus-z', description: 'Stacking order of a row while its treeitem has keyboard focus, published by each treeitem so its focused row paints above the guide lines. Not a theming lever.', default: 'auto', private: true},
    ],
  },
  components: [
    {
      name: 'TreeList',
      displayName: 'Tree List',
      description:
        'Tree list container. Accepts items data and rendering configuration. Expansion state is managed internally.',      props: [
        {
          name: 'items',
          type: 'TreeListItemData[]',
          description:
            'Recursive tree item data with id, label, optional children and isExpanded, plus optional xstyle, className, and style applied to that item row.',
          required: true,
        },
        {
          name: 'density',
          type: "'compact' | 'balanced' | 'spacious'",
          description: 'Spacing density for items.',
          default: "'balanced'",
        },
        {
          name: 'variant',
          type: "'lineGuides' | 'noGuides'",
          description:
            'Visual treatment of the hierarchy guide lines. lineGuides shows connector lines; noGuides hides them, keeping indentation. Orthogonal to density.',
          default: "'lineGuides'",
        },
        {
          name: 'animatedLayout',
          type: 'AnimatedLayout',
          description:
            'The handle from useAnimatedLayout({containerRef}). With it, expanding or collapsing a row glides the rows and content after it, up to that container, on one shared motion role instead of jumping, and the shown rows and the chevron move on the same motion. Without it, the content after the row takes its place at once.',
        },
        {
          name: 'header',
          type: 'ReactNode',
          description:
            'Header content, associated with the tree via aria-labelledby.',
          slotElements: [{__element: 'Text', props: {type: 'body'}, children: 'Header'}],
        },
        {
          name: 'xstyle',
          type: 'StyleXStyles',
          description:
            'StyleX styles for layout customization. Must be a stylex.create() value.',
        },
      ],
    },
  ],
  usage: {
    anatomy,
    description:
      'An expandable tree structure for displaying hierarchical data with branch connector lines. Use it for file explorers, nested category browsers, or any interface that visualizes parent-child relationships. Under a finger, expanding a row glides the rows below it while its children fade in on the same timing, and a collapse plays it back; pass an `animatedLayout` handle for content after the tree to glide too.',
    bestPractices: [
      {guidance: true, description: 'Provide meaningful labels and icons for each node to make the hierarchy easy to scan.'},
      {guidance: true, description: 'Pre-expand important branches so users see key content immediately.'},
      {guidance: true, description: 'Leaf rows reserve space for a chevron column whenever the tree has any expandable item to line up under; only a fully flat tree (no expandable items at all) renders its rows flush. Rely on this rather than nudging indentation with custom CSS.'},
      {guidance: false, description: 'Nest more than 4–5 levels deep; flatten the structure or use a different pattern.'},
      {guidance: false, description: 'Use a tree for flat, non-hierarchical data; use a List instead.'},
    ],
  },
};

// -------------------------------------------------------
// Auto-generated translations below. Do not edit manually.
// Regenerate with the dense compression protocol.
// See .context/decisions/dense-compression-protocol.md
// -------------------------------------------------------

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "TreeList",
  "displayName": "Tree List",
  "group": "TreeList",
  "theming": {
    "targets": [
      {
        "className": "astryx-tree-list",
        "visualProps": [
          "density",
          "variant"
        ]
      },
      {
        "className": "astryx-tree-list-item",
        "visualProps": [
          "density"
        ],
        "states": [
          "selected",
          "disabled"
        ]
      },
      {
        "className": "astryx-tree-list-chevron",
        "states": [
          "state"
        ]
      },
      {
        "className": "astryx-tree-list-item-label",
        "states": [
          "selected"
        ]
      },
      {
        "className": "astryx-tree-list-guide"
      }
    ],
    "vars": [
      {
        "name": "--tree-list-indent",
        "description": "每级缩进步长。每个嵌套层级的行按此距离缩进，引导线随之对齐。在 `tree-list` 目标上设置以调整该度量（例如用 `var(--spacing-5)` 获得更宽的缩进）。",
        "default": "var(--spacing-4)"
      },
      {
        "name": "--tree-list-row-gap",
        "description": "相邻行之间的垂直间距。默认 `2px`（var(--spacing-0-5)）提供细微的分隔；在 `tree-list` 目标上设置以加宽或关闭间距。连接引导线会自动跨越该间距（线保持连续）且不会超出最后一行，因此无需调整引导线高度。",
        "default": "var(--spacing-0-5)"
      }
    ]
  },
  "components": [
    {
      "name": "TreeList",
      "displayName": "Tree List",
      "description": "树列表容器。接受 items 数据和渲染配置。展开状态在内部管理。",
      "props": [
        {
          "name": "items",
          "type": "TreeListItemData[]",
          "description": "递归树项数据。每项有 id、label、可选 children 数组和可选 isExpanded 布尔值用于设置初始状态。",
          "required": true
        },
        {
          "name": "density",
          "type": "'compact' | 'balanced' | 'spacious'",
          "description": "项目的间距密度。",
          "default": "'balanced'"
        },
        {
          "name": "variant",
          "type": "'lineGuides' | 'noGuides'",
          "description": "层级引导线的视觉呈现。lineGuides 显示连接线；noGuides 隐藏连接线并保留缩进。与 density 正交。",
          "default": "'lineGuides'"
        },
        {
          "name": "animatedLayout",
          "type": "AnimatedLayout",
          "description": "useAnimatedLayout({containerRef}) 返回的句柄。传入后，展开或收起一行时，该行之后直到该容器内的行和内容会以同一个共享动效角色平滑移动，而不是跳动；新显示的行和箭头也使用同一动效。不传时，该行之后的内容会立即就位。"
        },
        {
          "name": "header",
          "type": "ReactNode",
          "description": "标题内容，通过 aria-labelledby 与树关联。"
        },
        {
          "name": "xstyle",
          "type": "StyleXStyles",
          "description": "用于布局自定义的 StyleX 样式。必须是 stylex.create() 值。"
        }
      ],
      "propDescriptions": {
        "items": "递归的树项数据，包含 id、label、可选的 children 和 isExpanded，以及应用于该项行的可选 xstyle、className 和 style。",
        "density": "项的间距密度。",
        "variant": "层级引导线的视觉处理方式。lineGuides 显示连接线；noGuides 隐藏连接线但保留缩进。与 density 正交。",
        "animatedLayout": "来自 useAnimatedLayout({containerRef}) 的句柄。提供后，展开或折叠一行会让其后的行和内容在该容器范围内以同一共享动态角色平滑移动而不是跳跃，显示的行和尖角符号也以相同的动态效果移动。不提供时，该行之后的内容会立即占据其位置。",
        "header": "页头内容，通过 aria-labelledby 与树关联。",
        "xstyle": "用于布局自定义的 StyleX 样式。必须是 stylex.create() 值。"
      }
    }
  ],
  "usage": {
    "anatomy": [
      {
        "name": "树列表",
        "required": true,
        "description": "呈现层级树的容器。"
      },
      {
        "name": "页头",
        "required": false,
        "description": "由调用方提供、用于在视觉上命名该树的内容。"
      },
      {
        "name": "项",
        "required": true,
        "description": "为层级中的一个节点绘制的行。"
      },
      {
        "name": "尖角符号",
        "required": false,
        "description": "为有子项的 Item 渲染的展开和折叠控件。"
      },
      {
        "name": "尖角字形",
        "required": false,
        "description": "由 Icon 在 Chevron 内渲染的方向符号。"
      },
      {
        "name": "项标签",
        "required": true,
        "description": "标识 Item 的主要内容。"
      },
      {
        "name": "项描述",
        "required": false,
        "description": "在 Item 标签下方渲染的次要文本。"
      },
      {
        "name": "起始内容",
        "required": false,
        "description": "在 Item 标签前渲染的调用方内容。"
      },
      {
        "name": "结束内容",
        "required": false,
        "description": "在 Item 标签后渲染的调用方内容。"
      },
      {
        "name": "引导线",
        "required": false,
        "description": "显示父子关系的连接线。"
      }
    ],
    "description": "带分支连接线的可展开树结构，用于显示层级数据。适用于文件浏览器、嵌套分类浏览器或任何可视化父子关系的界面。在手指操作下，展开一行会让其下方的行平滑移动，同时其子项以相同的时序淡入，折叠时反向播放；为树之后的内容传入 `animatedLayout` 句柄，使其也平滑移动。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "为每个节点提供有意义的标签和图标，使层级易于浏览。"
      },
      {
        "guidance": true,
        "description": "预展开重要分支，让用户立即看到关键内容。"
      },
      {
        "guidance": true,
        "description": "只要树中有任何可展开项可供对齐，叶子行就会为尖角列预留空间；只有完全扁平的树（完全没有可展开项）才会让行贴边渲染。请依赖这一行为，而不是用自定义 CSS 微调缩进。"
      },
      {
        "guidance": false,
        "description": "不要嵌套超过 4–5 层；请扁平化结构或使用其他模式。"
      },
      {
        "guidance": false,
        "description": "不要将树用于扁平的、非层级的数据；请改用 List。"
      }
    ]
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Data-driven tree list for hierarchical data w/ expand/collapse, branch lines, interactive items. Flat items array w/ recursive children, no composition, no cloneElement.',
  usage: {
    anatomy,
    description:
      'An expandable tree structure for displaying hierarchical data with branch connector lines. Use it for file explorers, nested category browsers, or any interface that visualizes parent-child relationships.',
    bestPractices: [
      {guidance: true, description: 'Provide meaningful labels and icons for each node to make the hierarchy easy to scan.'},
      {guidance: true, description: 'Pre-expand important branches so users see key content immediately.'},
      {guidance: true, description: 'Leaf rows reserve space for a chevron column whenever the tree has any expandable item to line up under; only a fully flat tree (no expandable items at all) renders its rows flush. Rely on this rather than nudging indentation with custom CSS.'},
      {guidance: false, description: 'Nest more than 4–5 levels deep; flatten the structure or use a different pattern.'},
      {guidance: false, description: 'Use a tree for flat, non-hierarchical data; use a List instead.'},
    ],
  },
  propDescriptions: {
    items: 'Recursive tree item data w/ id, label, optional children + isExpanded, plus optional xstyle/className/style on its row.',
    density: 'Spacing density for items.',
    variant: 'Guide-line treatment: lineGuides shows connectors, noGuides hides them (indent kept). Orthogonal to density.',
    animatedLayout: 'handle from useAnimatedLayout({containerRef}); expand/collapse glides the content after the row inside that container on one shared motion role. Omit: content after the row snaps.',
    header: 'Header content, linked to tree via aria-labelledby.',
    xstyle: 'StyleX styles for layout. Must be stylex.create() value.',
  },
  components: [
    {
      name: 'TreeList',
      displayName: 'Tree List',
      description: 'Tree list container. Accepts items data + rendering config. Expansion managed internally.',
      propDescriptions: {
        items: 'Recursive tree item data w/ id, label, optional children + isExpanded, plus optional xstyle/className/style on its row.',
        density: 'Spacing density for items.',
        variant: 'Guide-line treatment: lineGuides shows connectors, noGuides hides them (indent kept). Orthogonal to density.',
        header: 'Header content, linked to tree via aria-labelledby.',
        xstyle: 'StyleX styles for layout. Must be stylex.create() value.',
      },
    },
  ],
};
