// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Layout container',
    required: true,
    description:
      'General layout primitive that places the header, start, content, end, and footer slots.',
  },
  {
    name: 'Header',
    required: false,
    description:
      'Optional LayoutHeader region supplied by the caller, typically in the header slot.',
  },
  {
    name: 'Panel',
    required: false,
    description:
      'Optional LayoutPanel region supplied by the caller in the start or end slot.',
  },
  {
    name: 'Content area',
    required: false,
    description:
      'Optional LayoutContent region supplied by the caller in the content slot.',
  },
  {
    name: 'Footer',
    required: false,
    description:
      'Optional LayoutFooter region supplied by the caller, typically in the footer slot.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Layout',
  displayName: 'Layout',
  group: 'Layout',
  category: 'Layout',
  keywords: ["layout","container","content","flex","box","wrapper","page","regions"],
  playground: {
    defaults: {
      header: {__element: 'LayoutHeader', props: {}, children: {__element: 'Heading', props: {level: 3}, children: 'Page Title'}},
      content: {__element: 'LayoutContent', props: {}, children: {__element: 'Text', props: {type: 'body', color: 'secondary'}, children: 'Main content area. This is the scrollable center section of the layout.'}},
      footer: {__element: 'LayoutFooter', props: {}, children: {__element: 'Text', props: {type: 'supporting', color: 'secondary'}, children: 'Footer: status bar or actions'}},
    },
  },
  theming: {
    targets: [
      {className: 'astryx-layout', visualProps: ['height']},
      {className: 'astryx-layout-content'},
      {className: 'astryx-layout-footer'},
      {className: 'astryx-layout-header'},
      {className: 'astryx-layout-panel'},
    ],
  },
  description: 'General five-slot layout primitive for arranging header, start, content, end, and footer regions.',
  props: [
    {
      name: 'content',
      type: 'ReactNode',
      description:
        'Content slot (center). Accepts any ReactNode; use LayoutContent when a content region is needed. Children passed to `<Layout>` render here too: `<Layout>{main}</Layout>` is shorthand for `<Layout content={main} />`.',
      slotElements: [
        {
          __element: 'LayoutContent',
          props: {},
          children: 'Content',
        },
      ],
    },
    {
      name: 'header',
      type: 'ReactNode',
      description:
        'Header slot. Accepts any ReactNode; use LayoutHeader when a header region is needed.',
      slotElements: [
        {
          __element: 'LayoutHeader',
          props: {},
          children: 'Header',
        },
      ],
    },
    {
      name: 'footer',
      type: 'ReactNode',
      description:
        'Footer slot. Accepts any ReactNode; use LayoutFooter when a footer region is needed.',
      slotElements: [
        {
          __element: 'LayoutFooter',
          props: {},
          children: 'Footer',
        },
      ],
    },
    {
      name: 'start',
      type: 'ReactNode',
      description:
        'Logical-start slot (left in LTR). Accepts any ReactNode; use LayoutPanel when a panel region is needed.',
      slotElements: [
        {
          __element: 'LayoutPanel',
          props: {},
          children: 'Panel',
        },
      ],
    },
    {
      name: 'end',
      type: 'ReactNode',
      description:
        'Logical-end slot (right in LTR). Accepts any ReactNode; use LayoutPanel when a panel region is needed.',
      slotElements: [
        {
          __element: 'LayoutPanel',
          props: {},
          children: 'Panel',
        },
      ],
    },
    {
      name: 'height',
      type: "'fill' | 'auto'",
      description:
        "Height behavior: fill the container's height or grow with content. Fill needs a container with a set height, such as AppShell's content area; under an app root with no height, the layout grows with its content.",
      default: "'fill'",
    },
    {
      name: 'contentWidth',
      type: 'SizeValue',
      description:
        'Maximum width of the aligned content within each slot (header, content, footer, panels), centered when narrower than the available space. Without panels, LayoutContent spans the available width so its scrollbar stays at the outer edge while its children align internally to contentWidth. With exactly one panel, the panel stays aligned to the contentWidth frame while LayoutContent extends to the opposite open edge. With both panels, contentWidth includes the complete middle composition. Percentage widths—including percentage-bearing calc(), min(), max(), and clamp() values—and intrinsic widths, plus bare var(...) values, retain the constrained composition; use calc(var(...)) for a variable guaranteed to resolve to a length. Dividers stay full-bleed. Numbers are treated as pixels, strings are used as-is (e.g. `60ch`). Common page widths: 640 for forms, settings, and text-focused pages; 960 for content pages and wider layouts.',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        "Padding at the layout's outer edges using the spacing scale. Applies to this Layout's own header, footer, panels, and content. A nested Layout does not inherit it: without `padding`, its regions use the enclosing Card, Section, or Dialog padding, or the default inset (spacing 4). That keeps a page Layout inside AppShell inset even though AppShell's own regions are full bleed.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Shorthand for the content slot: `<Layout>{main}</Layout>` is the same as `<Layout content={main} />`. When both are given, `content` wins.',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLDivElement>',
      description: 'Ref forwarded to the root layout element.',
    },
    {
      name: 'defaultHasDividers',
      type: 'boolean',
      description:
        "Default divider visibility for LayoutHeader and LayoutFooter children. Headers and footers that don't pass `hasDivider` use this value; when unset, nested layouts inherit from their parent context.",
    },
  ],
  components: [
    {name: 'LayoutHeader'},
    {name: 'LayoutContent'},
    {name: 'LayoutFooter'},
    {name: 'LayoutPanel'},
    {name: 'Card'},
    {name: 'Section'},
  ],
  usage: {
    description:
      'Layout is a general five-slot primitive for arranging header, start, content, end, and footer regions within a page or bounded container. AppShell owns the page shell and app-wide navigation behavior; use HStack or VStack for simple directional stacking.',
    bestPractices: [
      { guidance: true, description: 'Use Layout when content needs named header, start, content, end, or footer regions.' },
      { guidance: true, description: 'Use HStack and VStack for simple directional stacking within a content area.' },
      { guidance: true, description: 'Hide a region by passing `false`, `null`, or `undefined` to its slot, for example `isOpen && <LayoutPanel />`. The slot counts as empty, so the neighbouring regions move out to the layout edge.' },
      { guidance: true, description: 'Give a region a landmark role and label on the region component when it is a page landmark, for example `<LayoutPanel role="navigation" label="Sections">`. Layout adds no role or name.' },
      { guidance: false, description: 'Use Layout for simple stacking layouts; use HStack or VStack instead.' },
      { guidance: false, description: 'Use Layout as the page shell or for app-wide navigation; use AppShell for that responsibility.' },
    ],
    anatomy,
  },
  examples: [
    {
      label: 'Page with a details panel inside AppShell',
      code: `
function OrdersPage() {
  return (
    <AppShell
      sideNav={
        <SideNav>
          <SideNavItem label="Orders" isSelected />
          <SideNavItem label="Customers" />
          <SideNavItem label="Settings" />
        </SideNav>
      }>
      {/* No padding props needed: the page Layout's regions keep their
          default inset inside AppShell's full-bleed content area. */}
      <Layout
        header={
          <LayoutHeader hasDivider>
            <Heading level={1}>Orders</Heading>
          </LayoutHeader>
        }
        end={
          <LayoutPanel
            hasDivider
            width={320}
            role="complementary"
            label="Order details">
            <VStack gap={2}>
              <Heading level={2}>Order #1042</Heading>
              <Text type="body" color="secondary">
                Shipped · 3 items · $184.00
              </Text>
            </VStack>
          </LayoutPanel>
        }
        content={
          <LayoutContent>
            <Text type="body">
              Select an order to see its shipping and payment details.
            </Text>
          </LayoutContent>
        }
      />
    </AppShell>
  );
}
`,
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "Layout 是通用的五槽基础组件，用于在页面或受限容器内排列页眉、起始、内容、末端和页脚区域。AppShell 负责页面外壳和应用级导航行为；简单的方向堆叠请使用 HStack 或 VStack。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "当内容需要具名的页眉、起始、内容、末端或页脚区域时，请使用 Layout。"
      },
      {
        "guidance": true,
        "description": "内容区域内的简单方向堆叠请使用 HStack 和 VStack。"
      },
      {
        "guidance": true,
        "description": "向插槽传入 `false`、`null` 或 `undefined` 即可隐藏区域，例如 `isOpen && <LayoutPanel />`。该插槽会被视为空，因此相邻区域会移动到布局边缘。"
      },
      {
        "guidance": true,
        "description": "当某个区域是页面地标时，请在该区域组件上为其设置地标角色和标签，例如 `<LayoutPanel role=\"navigation\" label=\"Sections\">`。Layout 本身不添加任何角色或名称。"
      },
      {
        "guidance": false,
        "description": "不要将 Layout 用于简单的堆叠布局；请改用 HStack 或 VStack。"
      },
      {
        "guidance": false,
        "description": "不要将 Layout 用作页面外壳或应用级导航；该职责请交给 AppShell。"
      }
    ],
    "anatomy": [
      {
        "name": "布局容器",
        "required": true,
        "description": "放置页眉、起始、内容、末端和页脚插槽的通用布局基础组件。"
      },
      {
        "name": "页眉",
        "required": false,
        "description": "由调用方提供的可选 LayoutHeader 区域，通常位于 header 插槽。"
      },
      {
        "name": "面板",
        "required": false,
        "description": "由调用方在 start 或 end 插槽提供的可选 LayoutPanel 区域。"
      },
      {
        "name": "内容区域",
        "required": false,
        "description": "由调用方在 content 插槽提供的可选 LayoutContent 区域。"
      },
      {
        "name": "页脚",
        "required": false,
        "description": "由调用方提供的可选 LayoutFooter 区域，通常位于 footer 插槽。"
      }
    ]
  },
  "name": "Layout",
  "description": "通用五槽布局基础组件，用于排列页眉、起始、内容、末端和页脚区域。",
  "propDescriptions": {
    "content": "内容插槽（中间）。接受任意 ReactNode；需要内容区域时请使用 LayoutContent。传给 `<Layout>` 的子元素也会渲染在这里：`<Layout>{main}</Layout>` 是 `<Layout content={main} />` 的简写。",
    "header": "页眉插槽。接受任意 ReactNode；需要页眉区域时请使用 LayoutHeader。",
    "footer": "页脚插槽。接受任意 ReactNode；需要页脚区域时请使用 LayoutFooter。",
    "start": "逻辑起始插槽（LTR 下为左侧）。接受任意 ReactNode；需要面板区域时请使用 LayoutPanel。",
    "end": "逻辑末端插槽（LTR 下为右侧）。接受任意 ReactNode；需要面板区域时请使用 LayoutPanel。",
    "height": "高度行为：填满容器高度，或随内容增长。填满需要设置了高度的容器，例如 AppShell 的内容区域；在没有高度的应用根节点下，布局会随内容增长。",
    "contentWidth": "每个插槽（页眉、内容、页脚、面板）中对齐内容的最大宽度，在窄于可用空间时居中。没有面板时，LayoutContent 会占满可用宽度，使其滚动条保持在外边缘，同时其子元素在内部按 contentWidth 对齐。恰好有一个面板时，面板保持对齐到 contentWidth 框架，而 LayoutContent 延伸到另一侧开放边缘。有两个面板时，contentWidth 包含完整的中间组合。百分比宽度——包括含百分比的 calc()、min()、max() 和 clamp() 值——以及固有宽度，外加裸 var(...) 值，会保留受约束的布局；对于保证解析为长度的变量，请使用 calc(var(...))。分隔线保持全出血。数字按像素处理，字符串按原样使用（例如 `60ch`）。常见页面宽度：表单、设置和以文本为主的页面用 640；内容页和更宽的布局用 960。",
    "padding": "使用间距刻度设置布局外边缘的内边距。适用于此 Layout 自身的页眉、页脚、面板和内容。嵌套 Layout 不会继承该值：未设置 `padding` 时，其区域使用外层 Card、Section 或 Dialog 的内边距，或默认内缩（spacing 4）。这样即使 AppShell 自身区域是全出血，AppShell 内的页面 Layout 仍能保持内缩。",
    "children": "内容插槽的简写：`<Layout>{main}</Layout>` 等同于 `<Layout content={main} />`。两者同时提供时，以 `content` 为准。",
    "ref": "转发到布局根元素的 ref。",
    "defaultHasDividers": "LayoutHeader 和 LayoutFooter 子元素的默认分隔线可见性。未传入 `hasDivider` 的页眉和页脚会使用该值；未设置时，嵌套布局会从父级上下文继承。"
  },
  "components": [
    {
      "name": "LayoutHeader",
      "description": ""
    },
    {
      "name": "LayoutContent",
      "description": ""
    },
    {
      "name": "LayoutFooter",
      "description": ""
    },
    {
      "name": "LayoutPanel",
      "description": ""
    },
    {
      "name": "Card",
      "description": ""
    },
    {
      "name": "Section",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'General five-slot primitive for arranging header, start, content, end, and footer regions. AppShell owns the page shell.',
  usage: {
    description:
      'Layout is a general five-slot primitive for arranging header, start, content, end, and footer regions within a page or bounded container. AppShell owns the page shell and app-wide navigation behavior; use HStack or VStack for simple directional stacking.',
    bestPractices: [
      { guidance: true, description: 'Use Layout when content needs named header, start, content, end, or footer regions.' },
      { guidance: true, description: 'Use HStack and VStack for simple directional stacking within a content area.' },
      { guidance: true, description: 'Hide a region by passing `false`, `null`, or `undefined` to its slot, for example `isOpen && <LayoutPanel />`. The slot counts as empty, so the neighbouring regions move out to the layout edge.' },
      { guidance: true, description: 'Give a region a landmark role and label on the region component when it is a page landmark, for example `<LayoutPanel role="navigation" label="Sections">`. Layout adds no role or name.' },
      { guidance: false, description: 'Use Layout for simple stacking layouts; use HStack or VStack instead.' },
      { guidance: false, description: 'Use Layout as the page shell or for app-wide navigation; use AppShell for that responsibility.' },
    ],
    anatomy,
  },
};
