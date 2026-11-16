// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Pagination',
    required: true,
    description:
      'Navigation landmark containing the current paging controls and optional page-size selector.',
  },
  {
    name: 'Page-size selector',
    required: false,
    description: 'Optional Selector for choosing how many items appear per page.',
  },
  {
    name: 'First/last buttons',
    required: false,
    description:
      'Optional Button controls that jump to the first or last known page.',
  },
  {
    name: 'Previous/next buttons',
    required: true,
    description:
      'Button controls that move backward or forward through the pages.',
  },
  {
    name: 'Page number button',
    required: false,
    description:
      'Button for one directly selectable page in the numbered presentation.',
  },
  {
    name: 'Ellipsis',
    required: false,
    description:
      'Visual omission marker between non-adjacent page-number buttons.',
  },
  {
    name: 'Count readout',
    required: false,
    description:
      'Text showing the current item range and total item count.',
  },
  {
    name: 'Compact readout',
    required: false,
    description: 'Text showing the current page and total page count.',
  },
  {
    name: 'Dot',
    required: false,
    description:
      'Page indicator control that reflects and changes the active page.',
  },
  {
    name: 'Page input label',
    required: false,
    description: 'Leading visible label for the editable page-number field.',
  },
  {
    name: 'Page input',
    required: false,
    description: 'NumberInput used to enter a page directly.',
  },
  {
    name: 'Page input total',
    required: false,
    description: 'Trailing text showing the known total page count.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Pagination',
  displayName: 'Pagination',
  category: 'Navigation',
  keywords: ["pagination","pager","paginator","pagenavigation","paging","paginate","pages","pagecontrol"],
  props: [
    {
      name: 'page',
      type: 'number',
      description: 'Current page number (1-based). Page 1 is the first page.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(page: number) => void',
      description:
        'Called when the page changes. With getPageHref it also runs when a page link is activated: use it there for state or analytics, and do not navigate in it, because the link navigates.',
      required: true,
    },
    {
      name: 'changeAction',
      type: '(page: number) => void | Promise<void>',
      description:
        'Async action on page change. Fires after onChange and uses React transitions for built-in loading state.',
    },
    {
      name: 'getPageHref',
      type: '(page: number, pageSize?: number) => string',
      description:
        "Returns the URL of a page. When set, the page number, previous, next, first and last controls render as links to it, so a page opens in a new tab, its address can be copied, and it works before scripts load. onChange still runs when a link is activated. pageSize is the current page size when pageSize or pageSizeOptions is set. The dots, the page box and the page-size selector are not links. For a page-size choice, navigate in onPageSizeChange to the URL of page 1 with the new size, not in the onChange(1) that follows. When onChange navigates for the dots or the page box, leave getPageHref unset in the dots and input variants, or their arrow links navigate twice. In cursor pagination, map the page before or after the current one to the cursor's URL. The destination follows the shared navigation rule described on the Link `href` prop.",
    },
    {
      name: 'as',
      type: 'ComponentType',
      description:
        'Custom link component for the links getPageHref makes (e.g. Next.js Link). Overrides the LinkProvider default.',
    },
    {
      name: 'totalItems',
      type: 'number',
      description:
        'Total number of items. Used to calculate page count. Takes precedence over totalPages if both provided.',
    },
    {
      name: 'totalPages',
      type: 'number',
      description:
        'Total number of pages. Use when you know page count but not item count.',
    },
    {
      name: 'hasMore',
      type: 'boolean',
      description:
        'Whether more pages exist after the current one. Use for cursor-based pagination where total is unknown.',
    },
    {
      name: 'pageSize',
      type: 'number',
      description: 'Number of items per page. Coerced to a positive integer; non-finite values fall back to the default.',
      default: '10',
    },
    {
      name: 'pageSizeOptions',
      type: 'number[]',
      description:
        'Available page size options. Shows a page size selector dropdown when provided.',
    },
    {
      name: 'onPageSizeChange',
      type: '(pageSize: number) => void',
      description:
        'Called when the page size changes. Automatically resets to page 1.',
    },
    {
      name: 'variant',
      type: "'pages' | 'count' | 'compact' | 'dots' | 'input' | 'none'",
      description:
        "Visual variant controlling what appears between prev/next buttons. 'pages' shows page number buttons with ellipsis, 'count' shows 'X-Y of Z' text, 'compact' shows 'Page X of Y' (add first/last buttons with hasFirstLast), 'dots' shows dot indicators, 'input' shows an editable page-number box with a leading label ('Page [ n ] / N') flanked by first/last buttons by default (the box needs a known total to clamp against, so it is disabled in cursor/hasMore mode), 'none' shows just prev/next buttons.",
      default: "'pages'",
    },
    {
      name: 'pageLabel',
      type: 'string',
      description:
        "The noun rendered before the editable box in the 'input' variant, e.g. 'Page' or 'Row'. Navigation is always page-based (via onChange); this only relabels the box. Defaults to the localized 'Page'.",
    },
    {
      name: 'hasFirstLast',
      type: 'boolean',
      description:
        "Whether to show first/last («/») double-chevron buttons flanking prev/next. Applies to the 'input' variant (shown unless false) and the 'compact' variant (shown only when true); other variants ignore it. Omitted when the page count is unknown (cursor/hasMore pagination).",
      default: "true for 'input'; false for 'compact'",
    },
    {
      name: 'step',
      type: 'number',
      description:
        'Number of pages the previous/next buttons advance per click. Clamped to the valid page range, so a step that would overshoot lands on the first/last page. When greater than 1, the buttons\' accessible names reflect the stride. Non-integer or values < 1 fall back to 1.',
      default: '1',
    },
    {
      name: 'siblingCount',
      type: 'number',
      description:
        "Number of page buttons to show on each side of the current page. Only applies when variant='pages'.",
      default: '1',
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      description: 'Size of the pagination controls.',
      default: "'md'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the component is disabled.',
      default: 'false',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the navigation landmark.',
      default: "'Pagination'",
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
  ],
  theming: {
    targets: [
      {className: 'astryx-pagination', visualProps: ['size', 'variant']},
      {className: 'astryx-pagination-dot', visualProps: ['size'], states: ['active']},
      {className: 'astryx-pagination-input-label', visualProps: ['size']},
      {className: 'astryx-pagination-input-total', visualProps: ['size']},
    ],
  },
  playground: {
    defaults: {
      page: 1,
      totalItems: 100,
      pageSize: 10,
      variant: 'pages',
    },
  },
  usage: {
    anatomy,
    description:
      'Pagination lets users step through pages of content. Place it below a table, list, or card grid so users can move forward and backward through results. Pick a variant to match the context: numbered pages for data tables, a count for large lists, compact for tight spaces, or dots for carousels.',
    bestPractices: [
      { guidance: true, description: 'Place pagination below the content it controls so users see results before navigating.' },
      { guidance: true, description: 'Use the pages variant for data tables where users need to jump to a specific page.' },
      { guidance: true, description: 'Use the count variant with a page size selector when users need to control how many items they see at once.' },
      { guidance: true, description: 'Use the dots variant for carousels and walkthroughs where the total is small and position matters more than a number.' },
      { guidance: true, description: 'Pass totalItems when the total is known so users can see how much content remains.' },
      { guidance: true, description: 'Pass getPageHref when each page has its own URL, so a page opens in a new tab and its address can be copied.' },
      { guidance: false, description: 'Show pagination when all items fit on a single page; there is nothing to paginate.' },
      { guidance: false, description: 'Use the dots variant for more than about 10 pages; the dots become too small to be useful.' },
      { guidance: false, description: 'Place pagination above the content; users expect it at the bottom.' },
      { guidance: false, description: 'Navigate in onChange when getPageHref is set; the link navigates, so keep onChange for state or analytics.' },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Pagination",
  "displayName": "Pagination",
  "props": [
    {
      "name": "page",
      "type": "number",
      "description": "当前页码（从 1 开始）。第 1 页为第一页。",
      "required": true
    },
    {
      "name": "onChange",
      "type": "(page: number) => void",
      "description": "页码变化时调用。设置 getPageHref 后，激活页面链接时也会运行：此时应将其用于状态或分析，不要在其中导航，因为链接会导航。",
      "required": true
    },
    {
      "name": "changeAction",
      "type": "(page: number) => void | Promise<void>",
      "description": "页码变化时的异步操作。在 onChange 之后触发，并使用 React transitions 提供内置加载状态。"
    },
    {
      "name": "getPageHref",
      "type": "(page: number, pageSize?: number) => string",
      "description": "返回页面的 URL。设置后，页码、上一页、下一页、首页和末页控件都会渲染为指向该 URL 的链接，使页面可在新标签页中打开、复制地址，并在脚本加载前即可使用。激活链接时 onChange 仍会运行。设置 pageSize 或 pageSizeOptions 时，pageSize 为当前每页条数。圆点、页码框和每页条数选择器不是链接。选择每页条数时，请在 onPageSizeChange 中导航到使用新条数的第 1 页 URL，而不是在随后的 onChange(1) 中导航。当 onChange 为圆点或页码框执行导航时，请勿在 dots 和 input 变体中设置 getPageHref，否则其箭头链接会导航两次。在游标分页中，将当前页之前或之后的页映射到游标的 URL。目标遵循 Link `href` 属性所述的共享导航规则。"
    },
    {
      "name": "as",
      "type": "ComponentType",
      "description": "为 getPageHref 生成的链接使用的自定义链接组件（例如 Next.js Link）。覆盖 LinkProvider 的默认值。"
    },
    {
      "name": "totalItems",
      "type": "number",
      "description": "项目总数。用于计算页数。同时提供时优先于 totalPages。"
    },
    {
      "name": "totalPages",
      "type": "number",
      "description": "总页数。已知页数但不知道项目数时使用。"
    },
    {
      "name": "hasMore",
      "type": "boolean",
      "description": "当前页之后是否还有更多页。用于总数未知的基于游标的分页。"
    },
    {
      "name": "pageSize",
      "type": "number",
      "description": "每页项目数。会被强制转换为正整数；非有限值回退到默认值。",
      "default": "10"
    },
    {
      "name": "pageSizeOptions",
      "type": "number[]",
      "description": "可用的每页条数选项。提供时显示每页条数选择器下拉菜单。"
    },
    {
      "name": "onPageSizeChange",
      "type": "(pageSize: number) => void",
      "description": "每页条数变化时调用。会自动重置到第 1 页。"
    },
    {
      "name": "variant",
      "type": "'pages' | 'count' | 'compact' | 'dots' | 'input' | 'none'",
      "description": "控制上一页/下一页按钮之间显示内容的视觉变体。'pages' 显示带省略号的页码按钮，'count' 显示 'X-Y of Z' 文本，'compact' 显示 'Page X of Y'（可通过 hasFirstLast 添加首页/末页按钮），'dots' 显示圆点指示器，'input' 显示带前置标签的可编辑页码框（'Page [ n ] / N'），默认两侧带首页/末页按钮（该框需要已知总数才能限制范围，因此在游标/hasMore 模式下禁用），'none' 仅显示上一页/下一页按钮。",
      "default": "'pages'"
    },
    {
      "name": "pageLabel",
      "type": "string",
      "description": "在 'input' 变体中渲染在可编辑框之前的名词，例如 'Page' 或 'Row'。导航始终基于分页（通过 onChange）；此属性仅更改该框的标签。默认使用本地化的 'Page'。"
    },
    {
      "name": "hasFirstLast",
      "type": "boolean",
      "description": "是否显示位于上一页/下一页两侧的首页/末页（«/»）双箭头按钮。适用于 'input' 变体（除非为 false 否则显示）和 'compact' 变体（仅在为 true 时显示）；其他变体忽略此属性。页数未知（游标/hasMore 分页）时省略。",
      "default": "'input' 为 true；'compact' 为 false"
    },
    {
      "name": "step",
      "type": "number",
      "description": "上一页/下一页按钮每次点击前进的页数。会限制在有效页码范围，因此会越过边界的步进会落在首页/末页。当大于 1 时，按钮的可访问名称会反映该步幅。非整数或小于 1 的值回退到 1。",
      "default": "1"
    },
    {
      "name": "siblingCount",
      "type": "number",
      "description": "当前页两侧显示的页码按钮数量。仅在 variant='pages' 时适用。",
      "default": "1"
    },
    {
      "name": "size",
      "type": "'sm' | 'md'",
      "description": "分页控件的尺寸。",
      "default": "'md'"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "组件是否禁用。",
      "default": "false"
    },
    {
      "name": "label",
      "type": "string",
      "description": "导航地标的可访问标签。",
      "default": "'Pagination'"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值，而不是 style={{}} 这样的内联样式对象。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-pagination",
        "visualProps": [
          "size",
          "variant"
        ]
      },
      {
        "className": "astryx-pagination-dot",
        "visualProps": [
          "size"
        ],
        "states": [
          "active"
        ]
      },
      {
        "className": "astryx-pagination-input-label",
        "visualProps": [
          "size"
        ]
      },
      {
        "className": "astryx-pagination-input-total",
        "visualProps": [
          "size"
        ]
      }
    ]
  },
  "usage": {
    "anatomy": [
      {
        "name": "分页",
        "required": true,
        "description": "包含当前分页控件和可选每页条数选择器的导航地标。"
      },
      {
        "name": "每页条数选择器",
        "required": false,
        "description": "用于选择每页显示多少项的可选 Selector。"
      },
      {
        "name": "首页/末页按钮",
        "required": false,
        "description": "跳转到已知首页或末页的可选 Button 控件。"
      },
      {
        "name": "上一页/下一页按钮",
        "required": true,
        "description": "用于在页面间前后移动的 Button 控件。"
      },
      {
        "name": "页码按钮",
        "required": false,
        "description": "编号呈现中用于直接选择某一页的按钮。"
      },
      {
        "name": "省略号",
        "required": false,
        "description": "不相邻页码按钮之间的视觉省略标记。"
      },
      {
        "name": "计数读数",
        "required": false,
        "description": "显示当前项目范围和项目总数的文本。"
      },
      {
        "name": "紧凑读数",
        "required": false,
        "description": "显示当前页码和总页数的文本。"
      },
      {
        "name": "圆点",
        "required": false,
        "description": "反映并更改活动页面的页面指示控件。"
      },
      {
        "name": "页码输入标签",
        "required": false,
        "description": "可编辑页码字段的前置可见标签。"
      },
      {
        "name": "页码输入",
        "required": false,
        "description": "用于直接输入页码的 NumberInput。"
      },
      {
        "name": "页码输入总数",
        "required": false,
        "description": "显示已知总页数的尾随文本。"
      }
    ],
    "description": "Pagination 让用户逐页浏览内容。将其放在表格、列表或卡片网格下方，便于用户前后翻阅结果。根据场景选择变体：数据表格使用编号页码，大型列表使用计数，紧凑空间使用 compact，轮播使用圆点。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将分页放在其控制的内容下方，让用户在导航前先看到结果。"
      },
      {
        "guidance": true,
        "description": "用户需要跳转到特定页面的数据表格使用 pages 变体。"
      },
      {
        "guidance": true,
        "description": "用户需要控制一次看到多少项时，使用 count 变体并配合每页条数选择器。"
      },
      {
        "guidance": true,
        "description": "轮播和引导流程中，总数较少且位置比数字更重要时使用 dots 变体。"
      },
      {
        "guidance": true,
        "description": "已知总数时传入 totalItems，让用户看到还剩多少内容。"
      },
      {
        "guidance": true,
        "description": "每个页面有独立 URL 时传入 getPageHref，使页面可在新标签页中打开并复制地址。"
      },
      {
        "guidance": false,
        "description": "所有项目都能放在单页时仍显示分页；此时没有可翻页的内容。"
      },
      {
        "guidance": false,
        "description": "超过约 10 页时使用 dots 变体；此时圆点会小到不再好用。"
      },
      {
        "guidance": false,
        "description": "将分页放在内容上方；用户预期它位于底部。"
      },
      {
        "guidance": false,
        "description": "设置 getPageHref 后在 onChange 中执行导航；链接本身会导航，因此 onChange 应仅用于状态或分析。"
      }
    ]
  },
  "propDescriptions": {
    "page": "当前页码（从 1 开始）。第 1 页为第一页。",
    "onChange": "页码变化时调用。设置 getPageHref 后，激活页面链接时也会运行：此时应将其用于状态或分析，不要在其中导航，因为链接会导航。",
    "changeAction": "页码变化时的异步操作。在 onChange 之后触发，并使用 React transitions 提供内置加载状态。",
    "getPageHref": "返回页面的 URL。设置后，页码、上一页、下一页、首页和末页控件都会渲染为指向该 URL 的链接，使页面可在新标签页中打开、复制地址，并在脚本加载前即可使用。激活链接时 onChange 仍会运行。设置 pageSize 或 pageSizeOptions 时，pageSize 为当前每页条数。圆点、页码框和每页条数选择器不是链接。选择每页条数时，请在 onPageSizeChange 中导航到使用新条数的第 1 页 URL，而不是在随后的 onChange(1) 中导航。当 onChange 为圆点或页码框执行导航时，请勿在 dots 和 input 变体中设置 getPageHref，否则其箭头链接会导航两次。在游标分页中，将当前页之前或之后的页映射到游标的 URL。目标遵循 Link `href` 属性所述的共享导航规则。",
    "as": "为 getPageHref 生成的链接使用的自定义链接组件（例如 Next.js Link）。覆盖 LinkProvider 的默认值。",
    "totalItems": "项目总数。用于计算页数。同时提供时优先于 totalPages。",
    "totalPages": "总页数。已知页数但不知道项目数时使用。",
    "hasMore": "当前页之后是否还有更多页。用于总数未知的基于游标的分页。",
    "pageSize": "每页项目数。会被强制转换为正整数；非有限值回退到默认值。",
    "pageSizeOptions": "可用的每页条数选项。提供时显示每页条数选择器下拉菜单。",
    "onPageSizeChange": "每页条数变化时调用。会自动重置到第 1 页。",
    "variant": "控制上一页/下一页按钮之间显示内容的视觉变体。'pages' 显示带省略号的页码按钮，'count' 显示 'X-Y of Z' 文本，'compact' 显示 'Page X of Y'（可通过 hasFirstLast 添加首页/末页按钮），'dots' 显示圆点指示器，'input' 显示带前置标签的可编辑页码框（'Page [ n ] / N'），默认两侧带首页/末页按钮（该框需要已知总数才能限制范围，因此在游标/hasMore 模式下禁用），'none' 仅显示上一页/下一页按钮。",
    "pageLabel": "在 'input' 变体中渲染在可编辑框之前的名词，例如 'Page' 或 'Row'。导航始终基于分页（通过 onChange）；此属性仅更改该框的标签。默认使用本地化的 'Page'。",
    "hasFirstLast": "是否显示位于上一页/下一页两侧的首页/末页（«/»）双箭头按钮。适用于 'input' 变体（除非为 false 否则显示）和 'compact' 变体（仅在为 true 时显示）；其他变体忽略此属性。页数未知（游标/hasMore 分页）时省略。",
    "step": "上一页/下一页按钮每次点击前进的页数。会限制在有效页码范围，因此会越过边界的步进会落在首页/末页。当大于 1 时，按钮的可访问名称会反映该步幅。非整数或小于 1 的值回退到 1。",
    "siblingCount": "当前页两侧显示的页码按钮数量。仅在 variant='pages' 时适用。",
    "size": "分页控件的尺寸。",
    "isDisabled": "组件是否禁用。",
    "label": "导航地标的可访问标签。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值，而不是 style={{}} 这样的内联样式对象。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Standalone pagination controls for navigating content pages. Supports multiple display variants + works w/ known totals or cursor-based pagination.',
  usage: {
    anatomy,
    description:
      'Pagination lets users step through pages of content. Place it below a table, list, or card grid so users can move forward and backward through results. Pick a variant to match the context: numbered pages for data tables, a count for large lists, compact for tight spaces, or dots for carousels.',
    bestPractices: [
      { guidance: true, description: 'Place pagination below the content it controls so users see results before navigating.' },
      { guidance: true, description: 'Use the pages variant for data tables where users need to jump to a specific page.' },
      { guidance: true, description: 'Use the count variant with a page size selector when users need to control how many items they see at once.' },
      { guidance: true, description: 'Use the dots variant for carousels and walkthroughs where the total is small and position matters more than a number.' },
      { guidance: true, description: 'Pass totalItems when the total is known so users can see how much content remains.' },
      { guidance: true, description: 'Pass getPageHref when each page has its own URL, so a page opens in a new tab and its address can be copied.' },
      { guidance: false, description: 'Show pagination when all items fit on a single page; there is nothing to paginate.' },
      { guidance: false, description: 'Use the dots variant for more than about 10 pages; the dots become too small to be useful.' },
      { guidance: false, description: 'Place pagination above the content; users expect it at the bottom.' },
      { guidance: false, description: 'Navigate in onChange when getPageHref is set; the link navigates, so keep onChange for state or analytics.' },
    ],
  },
  propDescriptions: {
    page: 'Current page number (1-based).',
    onChange:
      'Called on page change. w/ getPageHref also runs when a page link is activated: use for state/analytics; do not navigate in it (the link navigates).',
    changeAction:
      'Async action on page change. Fires after onChange; uses React transitions for loading.',
    getPageHref:
      'URL of a page. Page number/prev/next/first/last render as links; onChange still runs on activation. pageSize = current size when pageSize or pageSizeOptions set. Dots, page box + page-size selector are not links. Page-size choice: navigate in onPageSizeChange, not in the onChange(1) that follows. If onChange navigates for dots/page box, leave unset in dots + input variants (arrow links would navigate twice). Cursor pagination: map the page before/after current to the cursor URL.',
    as: 'Custom link component for getPageHref links (e.g. Next.js Link). Overrides LinkProvider.',
    totalItems: 'Total items. Calculates page count. Precedence over totalPages.',
    totalPages: 'Total pages. Use when page count known but not item count.',
    hasMore: 'More pages exist after current. For cursor-based pagination.',
    pageSize: 'Items per page; coerced to positive integer, non-finite falls back to default',
    pageSizeOptions: 'Page size options. Shows selector dropdown when provided.',
    onPageSizeChange: 'Called on page size change. Auto resets to page 1.',
    variant: "Display between prev/next. 'input' = 'Page [n] / N' + first/last.",
    pageLabel: "Noun before the 'input' box (e.g. 'Page' or 'Row'). Navigation stays page-based. Default localized 'Page'.",
    hasFirstLast: "Show first/last («/») buttons. 'input' default true; 'compact' default false (opt in). Other variants ignore. Omitted when total unknown.",
    step: 'Pages the prev/next buttons advance per click. Clamped to range; < 1 or non-integer falls back to 1.',
    siblingCount: "Page buttons each side of current; only variant='pages'.",
    size: 'Control size.',
    isDisabled: 'Component disabled.',
    label: 'Accessible label for nav landmark.',
    xstyle:
      'StyleX styles for layout customization (margins, positioning, sizing). Must be stylex.create() value.',
  },
};
