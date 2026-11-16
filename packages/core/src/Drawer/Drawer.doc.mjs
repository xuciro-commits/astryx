// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file Drawer.doc.mjs
 * @input Drawer props, panel anatomy, DrawerHeader composition, overlay playground config, and story-aligned examples
 * @output Consumer documentation and examples for Drawer
 * @position CLI and docsite metadata; runnable docsite demos live in packages/cli/assets/templates/blocks/components/Drawer
 */

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Panel',
    required: true,
    description:
      'The root <dialog> element: a full-height surface anchored to the inline start or end edge, flush with three viewport edges (square corners).',
  },
  {
    name: 'Content area',
    required: true,
    description:
      'Scrollable container that receives children; compose the header, body, and footer inside it with a Layout, as in Dialog. Inset by --spacing-4 (16px) by default; the padding prop or a theme sets a different container inset.',
  },
  {
    name: 'Header',
    required: false,
    description:
      'DrawerHeader, composed in a Layout header slot as DialogHeader is in Dialog: a title row with optional subtitle and start/end content. Pass it onOpenChange to show a close button, as with DialogHeader.',
  },
  {
    name: 'Scrim',
    required: false,
    description:
      'Backdrop that dims and blocks the page behind a modal drawer (hasScrim, the default); a non-modal drawer renders none.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Drawer',
  displayName: 'Drawer',
  // Keeps the registry route Drawer had as a canary-only Lab component.
  registry: {aliases: ['lab/drawer']},
  group: 'Drawer',
  category: 'Overlay',
  keywords: [
    'drawer',
    'side panel',
    'panel',
    'inspector',
    'detail view',
    'overlay',
    'slide',
    'sidebar',
    'dialog',
    'side drawer',
    'sidesheet',
  ],
  // No isInline docs-preview prop (the drawer has no inline containment), so
  // this is the overlay preview: closed on load with an open trigger, knobs
  // live, and opening renders the real top-layer drawer — see
  // ComponentPlaygroundConfig.overlay (#3657).
  playground: {
    overlay: true,
    defaults: {
      isOpen: false,
      label: 'Details',
      children: {
        __element: 'Section',
        props: {padding: 4},
        children: {
          __element: 'VStack',
          props: {gap: 2},
          children: [
            {__element: 'Heading', props: {level: 3}, children: 'Details'},
            {
              __element: 'Text',
              props: {type: 'body'},
              children: 'Adjust the properties below, then open the preview.',
            },
          ],
        },
      },
    },
  },
  theming: {
    container: true,
    targets: [
      {className: 'astryx-drawer', visualProps: ['side']},
      {className: 'astryx-drawer-header'},
      {className: 'astryx-drawer-header-start-content'},
      {className: 'astryx-drawer-header-title-block'},
      {className: 'astryx-drawer-header-end-content'},
      {className: 'astryx-drawer-header-close-icon'},
    ],
    derived: [{property: 'padding', expand: 'container'}],
  },
  description:
    "Side panel that floats above page content, using the native <dialog> element. Slides in from the inline start or end edge; full height, never reflows the layout underneath. Like Dialog, it is a container: set padding (or a theme's drawer padding) and a lone Section child or bleed children such as Table and Divider align against that inset. The default inset is --spacing-4 (16px), as in Dialog.",
  props: [
    {
      name: 'isOpen',
      type: 'boolean',
      description:
        'Whether the drawer is open. Fully controlled; pair with onOpenChange.',
      required: true,
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description:
        'Called when the drawer requests an open-state change. Escape and a scrim click call it with false as purpose allows; a DrawerHeader given the same callback calls it from its close button. The caller owns the open state. With sibling drawers open, Escape only closes the last-opened one.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible label for the drawer. Required; the drawer has no built-in heading to derive a name from.',
      required: true,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Drawer content, rendered inside a full-height scrollable area. Compose your own header/body/footer; an element with data-autofocus is focused on open. Children stay mounted during the exit animation; keep the last-selected item rendered instead of nulling content on close.',
      required: true,
    },
    {
      name: 'side',
      type: "'start' | 'end'",
      description:
        "Edge the drawer slides from: 'end' is right in LTR (the inspector convention), 'start' is left. Inline axis only; for a bottom sheet use BottomSheet.",
      default: "'end'",
    },
    {
      name: 'width',
      type: 'number | string',
      description:
        "Desktop width budget. A number is pixels; a string is any CSS length ('50%', '32rem'). Below the 640px mobile breakpoint this remains the maximum while the drawer preserves a 56px reveal of the page behind.",
      default: '400',
    },
    {
      name: 'experimental',
      type: '{isFullWidthOnMobile?: boolean}',
      stability: 'experimental',
      description:
        'Experimental options: anything in this object may change or be removed in a patch release, and omitting it keeps the stable behavior. isFullWidthOnMobile (default false) covers the full viewport width below the 640px mobile breakpoint instead of preserving the default 56px reveal of the page behind, which makes the drawer read as an overlay, not a navigation.',
    },
    {
      name: 'hasScrim',
      type: 'boolean',
      description:
        'Modal scrim behind the drawer. true uses showModal() (top layer, focus trap, scroll lock; clicking the scrim closes unless purpose prevents it; modal only); false uses the manual Popover API for a non-modal top-layer overlay that does NOT trap focus and keeps the page behind interactive.',
      default: 'true',
    },
    {
      name: 'purpose',
      type: "'required' | 'form' | 'info'",
      description:
        'Configures implicit dismissal, matching Dialog. info: Escape and a scrim click close. form: Escape closes, a scrim click does not. required: neither closes (Escape is consumed) and a modal drawer is exposed as an alertdialog, so give its content a way out. A non-modal drawer has no scrim, so form and info behave the same.',
      default: "'info'",
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        "Internal padding of the drawer content using the spacing scale, matching Dialog. When omitted, uses the theme default for drawers: --spacing-4 (16px) unless the theme sets padding on drawer. Pass 0 for a full-bleed content area. A lone Section child escapes the padding, bleed children such as Table and Divider compensate against it, and a Layout picks it up for its regions. The content area's block-end edge adds the home-indicator safe area on top in every mode.",
    },
  ],
  usage: {
    anatomy,
    description:
      'A side panel that floats above page content for inspectors and detail views: the "click a table row, see its details" pattern. Unlike a docked panel it overlays the layout instead of reflowing it. Works on desktop and touch: the width budget applies on desktop and the panel preserves a 56px page reveal below 640px without exceeding the width budget. Escape closes the drawer (unless purpose is required) and focus returns to the element that opened it. Entry/exit slide animation respects prefers-reduced-motion. On a phone or tablet (a coarse primary pointer), a tap or a drag that lands while the drawer is still sliding in reaches nothing (for a drawer without a scrim, only one on the panel: the page stays live), and the drawer finishes sliding in; keys and assistive technology stay live, and a mouse or a trackpad still clicks: at once when it was the last pointer used, otherwise once it moves. Stacking contract: sibling drawers stack last-opened on top, Escape closes only the topmost, and closing peels innermost-first; render them as siblings, never nested.\n\nLike Dialog, the drawer is a container: its content area is inset by --spacing-4 (16px) by default, by the padding prop, or by a theme\'s padding on drawer. Compose the header, body, and footer the way Dialog does, with a Layout: DrawerHeader in the header slot (it shows a close button when you pass it onOpenChange, like DialogHeader), the body in LayoutContent, and actions in LayoutFooter. The Layout redistributes the inset to those regions so they line up on one content line, and the header is not inset twice. A lone Section child also escapes the inset. Drawer renders no close button of its own, so give every drawer a visible way to close, especially a non-modal one, which has no scrim to click. Put data-autofocus on the control that should receive focus on open.\n\nChoosing a surface: use Dialog for a centered decision or short form, Drawer for full-height side detail that keeps the page in sight, BottomSheet for block-axis sheets on touch, and a docked panel (a layout column) when content should reflow the page instead of floating over it.\n\nTheming: the panel is the single stable target (astryx-drawer, with data-side reflecting side), and the scrim is the panel\'s native ::backdrop. DrawerHeader exposes astryx-drawer-header targets for its row, slots, and close icon.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for contextual detail views (row inspectors, entity details) where the user should keep the underlying list in sight.',
      },
      {
        guidance: true,
        description:
          'Keep the caller as the source of truth: derive isOpen from selection state and clear the selection in onOpenChange.',
      },
      {
        guidance: true,
        description:
          'Use hasScrim={false} for master-detail flows; non-modal drawers do not trap focus and the page behind stays interactive.',
      },
      {
        guidance: true,
        description:
          'Keep the last-selected item rendered on close: children stay mounted during the exit animation, so nulling content mid-close blanks the panel while it slides out.',
      },
      {
        guidance: true,
        description:
          'Give every drawer a visible close action, usually DrawerHeader with onOpenChange; a non-modal drawer has no scrim to click.',
      },
      {
        guidance: true,
        description:
          'Use purpose="form" when a stray scrim click would discard unsaved input.',
      },
      {
        guidance: false,
        description:
          'Use a Drawer for short confirmations or small forms; use Dialog or AlertDialog instead.',
      },
      {
        guidance: false,
        description:
          'Reach for a Drawer when the content should push the page aside; a Drawer floats over content, so use a docked panel or layout column instead.',
      },
      {
        guidance: false,
        description:
          'Use a Drawer as a bottom or top sheet; it is inline-axis only, so use BottomSheet for block-axis sheets.',
      },
      {
        guidance: false,
        description:
          'Nest a Drawer inside another Drawer; render drawers as siblings; the last-opened stacks on top and Escape closes it first.',
      },
    ],
  },
  // CLI snippets. The docsite renders the paired Drawer blocks in ../../blocks.
  examples: [
    {
      label: 'Basic',
      code: `const [isOpen, setIsOpen] = useState(false);
<>
  <Button label="Open drawer" onClick={() => setIsOpen(true)} />
  <Drawer
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    label="Details"
    width={360}>
    <Layout
      header={<DrawerHeader title="Details" onOpenChange={setIsOpen} />}
      content={
        <LayoutContent>
          <Text type="body">Close with Escape, the scrim, or the close button.</Text>
        </LayoutContent>
      }
    />
  </Drawer>
</>
// Modal by default: the scrim dims the page and focus is trapped. Escape, a
// scrim click, or the header's close button closes it, and focus returns to
// the trigger.`,
    },
    {
      label: 'Modal or non-modal (hasScrim)',
      code: `const [openModal, setOpenModal] = useState(false);
const [openPanel, setOpenPanel] = useState(false);
<>
  {/* Modal (default): the scrim dims the page, focus is trapped, and a
      scrim click closes. */}
  <Drawer isOpen={openModal} onOpenChange={setOpenModal} label="Edit details">
    <EditForm />
  </Drawer>
  {/* Non-modal: no scrim, no focus trap; the page behind stays interactive.
      With no scrim to click, the header's close button is the visible exit. */}
  <Drawer
    isOpen={openPanel}
    onOpenChange={setOpenPanel}
    label="Details"
    hasScrim={false}>
    <Layout
      header={<DrawerHeader title="Details" onOpenChange={setOpenPanel} />}
      content={<LayoutContent><DetailsPanel /></LayoutContent>}
    />
  </Drawer>
</>`,
    },
    {
      label: 'Edit form with footer actions',
      code: `const [isOpen, setIsOpen] = useState(false);
<Drawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  label="Edit host"
  purpose="form">
  <Layout
    header={<DrawerHeader title="Edit host" onOpenChange={setIsOpen} />}
    content={<LayoutContent><HostFields /></LayoutContent>}
    footer={
      <LayoutFooter>
        <HStack gap={2} hAlign="end">
          <Button label="Cancel" variant="secondary" onClick={() => setIsOpen(false)} />
          <Button label="Save" variant="primary" onClick={save} />
        </HStack>
      </LayoutFooter>
    }
  />
</Drawer>
// purpose="form" keeps Escape but ignores scrim clicks, so a stray click
// outside does not discard edits. The footer stays pinned while the fields
// scroll.`,
    },
    {
      label: 'Slide in from the start edge',
      code: `const [isOpen, setIsOpen] = useState(false);
<Drawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  label="Navigation"
  side="start">
  <NavPanel />
</Drawer>
// 'start' is left in LTR and mirrors under RTL; 'end' (the default) is the
// inspector convention.`,
    },
    {
      label: 'Width budget: pixels or any CSS length',
      code: `const [isOpen, setIsOpen] = useState(false);
<Drawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  label="Details"
  width="50%">
  <DetailsPanel />
</Drawer>
// A number is pixels (width={320}); a string is any CSS length ('32rem',
// '50%'). The budget also caps the drawer on mobile.`,
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "anatomy": [
      {
        "name": "面板",
        "required": true,
        "description": "根 <dialog> 元素：锚定在行内起始边或结束边的全高表面，与三个视口边缘齐平（直角）。"
      },
      {
        "name": "内容区域",
        "required": true,
        "description": "接收 children 的可滚动容器；像 Dialog 一样，在其内部用 Layout 组合头部、主体和页脚。默认按 --spacing-4（16px）内缩；padding 属性或主题可设置不同的容器内边距。"
      },
      {
        "name": "头部",
        "required": false,
        "description": "DrawerHeader，像 Dialog 中的 DialogHeader 一样组合在 Layout 的头部槽中：标题行，带可选副标题和起始/结束内容。传入 onOpenChange 即可像 DialogHeader 一样显示关闭按钮。"
      },
      {
        "name": "遮罩",
        "required": false,
        "description": "模态抽屉后方用于压暗并阻挡页面的背景（hasScrim，默认行为）；非模态抽屉不渲染遮罩。"
      }
    ],
    "description": "用于检查器和详情视图的侧面板，浮于页面内容之上，也就是“点击表格行、查看其详情”的模式。与停靠面板不同，它会覆盖布局，而不会重排布局。桌面端和触控设备均可使用：宽度预算在桌面端生效，而在低于 640px 时面板仍会保留 56px 的页面露出，且不超过宽度预算。按 Escape 关闭抽屉（除非 purpose 为 required），焦点会回到打开它的元素。进入和退出的滑动动画遵循 prefers-reduced-motion。在手机或平板（主要指针为粗略指针）上，如果抽屉仍在滑入时发生点击或拖拽，该操作不会命中任何目标（对于没有遮罩的抽屉，只可能命中面板本身：页面保持可交互），抽屉则会完成滑入；键盘和辅助技术保持可用，鼠标或触控板仍可点击：如果它是最后使用的指针则立即生效，否则在移动后生效。堆叠约定：同级抽屉按最后打开的顺序叠在最上层，Escape 只关闭最顶层，关闭时从最内层开始逐层剥离；请将它们渲染为同级，切勿嵌套。\n\n与 Dialog 一样，抽屉是一个容器：其内容区域默认按 --spacing-4（16px）内缩，也可由 padding 属性或主题中 drawer 的 padding 指定。像 Dialog 那样用 Layout 组合头部、主体和页脚：在头部槽中放 DrawerHeader（传入 onOpenChange 时它会像 DialogHeader 一样显示关闭按钮），主体放在 LayoutContent 中，操作放在 LayoutFooter 中。Layout 会把内缩重新分配给这些区域，使它们对齐到同一条内容线上，头部也不会被重复内缩。单独的 Section 子元素同样不受内缩影响。Drawer 自身不渲染关闭按钮，因此请为每个抽屉提供可见的关闭方式，尤其是没有遮罩可点击的非模态抽屉。把 data-autofocus 放在打开时应获得焦点的控件上。\n\n选择表面：居中的决策或短表单使用 Dialog；需要全高度侧边详情且保持页面可见时使用 Drawer；触控设备上的块轴面板使用 BottomSheet；当内容应重排页面而不是浮在其上时，使用停靠面板（布局列）。\n\n主题化：面板是唯一稳定的目标（astryx-drawer，data-side 反映 side），遮罩则是面板原生的 ::backdrop。DrawerHeader 暴露 astryx-drawer-header 目标，用于其行、槽和关闭图标。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于上下文相关的详情视图（行检查器、实体详情），让用户始终能看到底层列表。"
      },
      {
        "guidance": true,
        "description": "让调用方成为唯一事实来源：从选中状态推导 isOpen，并在 onOpenChange 中清除选中状态。"
      },
      {
        "guidance": true,
        "description": "主从流程使用 hasScrim={false}；非模态抽屉不会困住焦点，后方页面保持可交互。"
      },
      {
        "guidance": true,
        "description": "关闭时保持最后选中的项目仍被渲染：children 在退出动画期间保持挂载，因此在关闭过程中将内容置空会让面板在滑出时变空白。"
      },
      {
        "guidance": true,
        "description": "为每个抽屉提供可见的关闭操作，通常使用带 onOpenChange 的 DrawerHeader；非模态抽屉没有可点击的遮罩。"
      },
      {
        "guidance": true,
        "description": "当误点遮罩会丢失未保存的输入时，使用 purpose=\"form\"。"
      },
      {
        "guidance": false,
        "description": "不要用 Drawer 做简短确认或小型表单；请改用 Dialog 或 AlertDialog。"
      },
      {
        "guidance": false,
        "description": "不要在内容应把页面挤开时使用 Drawer；Drawer 浮在内容之上，请改用停靠面板或布局列。"
      },
      {
        "guidance": false,
        "description": "不要把 Drawer 用作底部或顶部面板；它仅支持行内轴，块轴面板请使用 BottomSheet。"
      },
      {
        "guidance": false,
        "description": "不要将一个 Drawer 嵌套在另一个 Drawer 内；请将抽屉渲染为同级；最后打开的叠在最上层，Escape 会先关闭它。"
      }
    ]
  },
  "name": "Drawer",
  "description": "浮在页面内容之上的侧面板，使用原生 <dialog> 元素。从行内起始边或结束边滑入；占满高度，从不重排下方布局。与 Dialog 一样，它是一个容器：设置 padding（或主题的 drawer padding）后，单独的 Section 子元素或 Table、Divider 等出血子元素会按该内边距对齐。默认内边距为 --spacing-4（16px），与 Dialog 相同。",
  "propDescriptions": {
    "isOpen": "抽屉是否打开。完全受控；需与 onOpenChange 配合使用。",
    "onOpenChange": "抽屉请求改变打开状态时调用。按 Escape 和点击遮罩会按 purpose 允许的情况以 false 调用；将同一回调传给 DrawerHeader 时，其关闭按钮也会调用它。打开状态由调用方持有。存在同级抽屉打开时，Escape 只会关闭最后打开的那个。",
    "label": "抽屉的无障碍标签。必填；抽屉没有可用于推导名称的内置标题。",
    "children": "抽屉内容，渲染在全高可滚动区域内。请自行组合头部/主体/页脚；带 data-autofocus 的元素会在打开时获得焦点。children 在退出动画期间保持挂载；关闭时应保留最后选中的项目，而不是将内容置空。",
    "side": "抽屉滑入的边缘：在 LTR 中 'end' 为右侧（检查器惯例），'start' 为左侧。仅支持行内轴；底部面板请使用 BottomSheet。",
    "width": "桌面端宽度预算。数字表示像素；字符串表示任意 CSS 长度（'50%'、'32rem'）。在低于 640px 的移动断点时，这仍是最大值，同时抽屉会保留 56px 的页面露出。",
    "experimental": "实验性选项：此对象中的任何内容都可能在补丁版本中更改或移除，省略它可保持稳定行为。isFullWidthOnMobile（默认 false）会在低于 640px 的移动断点时覆盖整个视口宽度，而不是保留默认的 56px 页面露出，这会让抽屉更像覆盖层而非导航。",
    "hasScrim": "抽屉后的模态遮罩。true 使用 showModal()（顶层、焦点陷阱、滚动锁定；除非 purpose 阻止，否则点击遮罩会关闭；仅限模态）；false 使用手动 Popover API 创建非模态顶层浮层，不会困住焦点，并保持后方页面可交互。",
    "purpose": "配置隐式关闭行为，与 Dialog 一致。info：按 Escape 和点击遮罩都会关闭。form：按 Escape 关闭，点击遮罩不关闭。required：两者都不关闭（Escape 被消费），且模态抽屉会作为 alertdialog 暴露，因此请为其内容提供退出方式。非模态抽屉没有遮罩，因此 form 与 info 的行为相同。",
    "padding": "抽屉内容的内部内边距，使用间距刻度，与 Dialog 一致。省略时使用抽屉的主题默认值：--spacing-4（16px），除非主题为 drawer 设置了 padding。传入 0 可让内容区域通栏。单独的 Section 子元素不受内边距影响，Table 和 Divider 等出血子元素会据此补偿，Layout 也会为其区域采用该内边距。内容区域的块级末端边在任何模式下都会额外加上主屏幕指示条的安全区域。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'side panel floating over content (native <dialog>): start/end edge, full height, Dialog-like container padding (--spacing-4 by default; padding prop or theme drawer padding)',
  usage: {
    anatomy,
    description:
      "Overlay side panel for inspectors and detail views; floats over content, never reflows it. width = desktop budget; 56px page reveal below 640px, capped by width. Escape closes topmost (not when purpose=required); focus restores to the opener. Siblings stack last-opened on top; never nest. Slide animation respects prefers-reduced-motion. Dialog-like container: content area inset = --spacing-4 (16px) by default, or the padding prop / a theme's drawer padding (padding={0} = full bleed). Compose like Dialog: Layout with DrawerHeader in the header slot (close button only when given onOpenChange), LayoutContent, LayoutFooter; Layout redistributes the inset so regions line up and the header is not inset twice; a lone Section escapes the inset. No built-in close button, so every drawer needs a visible exit; data-autofocus picks the focus target. purpose matches Dialog: info = Escape + scrim click, form = Escape only, required = neither (modal → alertdialog). Choose: Dialog for centered decisions/short forms, Drawer for full-height side detail, BottomSheet for block-axis sheets, docked layout column to reflow instead of float. Theming: single target astryx-drawer (data-side); scrim is its ::backdrop; DrawerHeader has astryx-drawer-header targets.",
    bestPractices: [
      {
        guidance: true,
        description: 'Use for row inspectors and entity detail views.',
      },
      {
        guidance: true,
        description:
          'Derive isOpen from selection state; clear it in onOpenChange.',
      },
      {
        guidance: true,
        description:
          'Use hasScrim={false} for non-modal master-detail flows (no focus trap, page stays interactive).',
      },
      {
        guidance: true,
        description:
          'Keep last-selected content rendered on close (children stay mounted during exit).',
      },
      {
        guidance: true,
        description:
          'Give every drawer a visible close action (DrawerHeader + onOpenChange); non-modal has no scrim.',
      },
      {
        guidance: true,
        description:
          'Use purpose="form" when a stray scrim click would lose input.',
      },
      {
        guidance: false,
        description:
          'Use for confirmations or small forms; use Dialog instead.',
      },
      {
        guidance: false,
        description:
          'Use when content should push the page aside (it floats over) or as a bottom sheet (use BottomSheet).',
      },
      {
        guidance: false,
        description:
          'Nest Drawers: render as siblings; Escape closes the last-opened first.',
      },
    ],
  },
};
