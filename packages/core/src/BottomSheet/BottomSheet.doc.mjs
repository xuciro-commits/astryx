// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file BottomSheet.doc.mjs
 * @input BottomSheet props, sheet anatomy, and focus-time keyboard scrolling behavior
 * @output Consumer documentation and examples for BottomSheet
 * @position CLI and rendered component documentation
 */

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Sheet panel',
    required: true,
    description:
      'Painted surface that rises from the bottom edge and contains the sheet.',
  },
  {
    name: 'Content area',
    required: true,
    description:
      'Padded, scrollable container that presents the caller-provided sheet content.',
  },
  {
    name: 'Handle',
    required: true,
    description:
      'Decorative grab affordance and drag region at the top of the panel.',
  },
  {
    name: 'Scrim',
    required: false,
    description:
      'Backdrop that dims and blocks the page in a scrim-backed presentation.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'BottomSheet',
  displayName: 'Bottom Sheet',
  group: 'BottomSheet',
  category: 'Overlay',
  keywords: [
    'bottom sheet',
    'sheet',
    'mobile',
    'touch',
    'drag',
    'swipe',
    'snap point',
    'detent',
    'resize',
    'dismiss',
    'grab handle',
    'dialog',
    'overlay',
    'modal',
    'form',
    'mobile keyboard',
    'visual viewport',
  ],
  playground: {
    overlay: true,
    defaults: {
      isOpen: false,
      label: 'Filters',
      height: 'hug',
      children: {
        __element: 'Section',
        props: {padding: 4},
        children: {
          __element: 'VStack',
          props: {gap: 2},
          children: [
            {
              __element: 'Heading',
              props: {level: 3},
              children: 'Filters',
            },
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
    targets: [{className: 'astryx-bottom-sheet', visualProps: []}],
    derived: [{property: 'padding', expand: 'container'}],
  },
  description:
    "A mobile touch sheet that rises from the bottom edge, with animated entrance and exit, a grab handle, optional drag-to-resize snap points, and purpose-controlled dismissal. Like Dialog, it is a padded container: content starts at the theme's bottom-sheet padding (--spacing-4 by default), and a lone Section child or bleed children such as Table and Divider align against it. At the top the content always starts below the grab bar's 24px band, which is not padding a child escapes, so the first row never sits under the bar; scrolled content passes beneath it. A sheet always owns a native <dialog>; inside the deprecated BottomSheetSwitcher the switcher presents and closes that dialog as the flow moves between steps. In both modes, ref and shared DOM props target the visual panel <div>. Sheets stack: a sheet opened while another is open sits on top of it, the covered sheet stays mounted and recedes, and one scrim covers the page. A sheet that closes as another opens in the same update is replaced by it, with the step-to-step handoff a multi-step flow needs.",
  props: [
    {
      name: 'isOpen',
      type: 'boolean',
      description:
        'Whether a standalone sheet is open. Fully controlled; pair with onOpenChange. Omitted only inside the deprecated BottomSheetSwitcher, which drives its steps itself.',
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description:
        'For a standalone sheet, called when it requests an open-state change. Automatic calls follow purpose: info dismisses on Escape, scrim click, or swipe; form dismisses on Escape only; required never dismisses implicitly. Omitted only inside the deprecated BottomSheetSwitcher, which drives its steps itself.',
    },
    {
      name: 'finalFocusRef',
      type: 'RefObject<HTMLElement | null>',
      description:
        'Optional explicit focus-return target for a standalone sheet. Use when the opener can remount or the active element is not a reliable trigger, such as an adaptive presentation switch. Always focused when the sheet closes on its own or last; when a modal sheet is still open beneath, focus returns into that sheet (to this element if it is inside it, else the revealed panel). Omitted only inside the deprecated BottomSheetSwitcher, which drives its steps itself.',
    },
    {
      name: 'purpose',
      type: "'required' | 'form' | 'info'",
      description:
        "Controls implicit dismissal behavior, matching Dialog. info allows Escape, scrim click, and swipe-to-dismiss. form protects entered data by blocking scrim click and swipe while allowing Escape. required blocks every implicit dismissal path and uses role='alertdialog'. Explicit controls may still update the controlled state. Works for standalone and BottomSheetSwitcher-managed sheets.",
      default: "'info'",
    },
    {
      name: 'sheetId',
      type: 'string',
      description:
        'Deprecated with BottomSheetSwitcher: give each step its own standalone sheet with isOpen instead. Still works as released: the unique ID of this sheet inside a BottomSheetSwitcher, which opens it when activeSheet matches; omit isOpen and onOpenChange when sheetId is used.',
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible label for the sheet. Required; the sheet has no built-in heading to derive a name from.',
      required: true,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        "Sheet content in a scrollable area. The named body is keyboard reachable while overflowing. Forward Tab entry may move directly to the first native link or button; input controls, composite widgets, and nested scroll areas retain the body stop. Shift+Tab from a delegated first child skips the body. Fitting content adds no body stop. The internal observed content box preserves block flow and percentage heights. If it includes a text-entry control that can bring up the mobile keyboard, use height='tall' and keep the sheet fully expanded while editing.",
      required: true,
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        "Internal padding of the sheet content using the spacing scale, matching Dialog. When omitted, uses the theme default for bottom sheets (--spacing-4 unless the theme sets padding on bottom-sheet). A lone Section child escapes the padding, and bleed children such as Table and Divider compensate against it. Use 0 for edge-to-edge content that supplies its own inset. Whatever the padding, the block-start inset is never less than the grab bar's height (--spacing-6), so resting content starts below the bar.",
    },
    {
      name: 'height',
      type: "'hug' | 'capped' | 'tall' | number | string",
      description:
        "How tall the sheet is. Named budgets: 'hug' fits its content up to 92% of the viewport, 'capped' is a scrolling mid-height panel (~62%), and 'tall' is a pinned near-full panel (~92%) for content that streams in. Or pass a number (px) / CSS length for a custom budget. Give snapPoints to let the user drag between heights. On shorter viewports the sheet fills the available height. Only a fully expanded 'tall' sheet provides mobile-keyboard accommodation: it stays put and scrolls each focused control above the keyboard. Hug, Capped, numeric and CSS-length heights never do, and a Tall sheet stops doing it the moment the user drags it to a shorter detent, resuming when they drag it back. Outside that state the sheet neither moves nor adds keyboard scroll space, and the browser's own focus reveal is left in place; on iOS that reveal can shift the whole page. This accommodation applies where the visual viewport shrinks for the keyboard, as in Safari on iOS, Firefox for Android and Chrome on Android, where the sheet places the focused control just above the keyboard as it comes up, and the control rides the rest of Gboard\u2019s slide up, and the slide down after it loses focus; a hide Chrome reports late, such as Back, rides down from Chrome\u2019s report (`astryx docs browser-support`).",
      default: "'capped'",
    },
    {
      name: 'snapPoints',
      type: 'ReadonlyArray<number | string>',
      description:
        "Extra heights the sheet can rest at when dragged; its own height is always the tallest stop, and omitting this gives a sheet that only opens and closes. Each stop is the sheet's visible height: a number is a viewport fraction (0.5 is half the screen), '50%' the same in CSS, '320px' an absolute length. A stop of a quarter of the sheet or less is a peek: it slides away instead of reflowing, and thins the scrim.",
    },
    {
      name: 'hasScrim',
      type: 'boolean',
      description:
        "For a standalone BottomSheet, whether to render a scrim, the semi-transparent overlay that covers and blocks the background. true (default) uses showModal(): top layer, native focus containment, ::backdrop scrim, body scroll lock, and tap-scrim-to-dismiss when purpose='info', with the background inert. A scrim sheet also takes part in stacking (see Stacking below). false presents the sheet in the top layer as a manual popover (below the Popover API support floor, show() in page stacking order as a reduced fallback) with no scrim, no focus trap and no scroll lock, leaving the page behind interactive and scrollable; a no-scrim sheet neither stacks nor is stacked on, but no-scrim steps replace each other with the same handoff. A no-scrim sheet shown while a modal (a scrim sheet or a Dialog) that does not contain it is open is inert under that modal and stays beneath it (show(), no page-level z-index) until that modal has gone, then enters the top layer; a modal mid-exit counts as gone, and rendered inside the modal the sheet enters the top layer at once. In a multi-step flow, set hasScrim the same on every step.",
      default: 'true',
    },
  ],
  usage: {
    anatomy,
    description:
      "A mobile touch surface for filters, actions, forms, and detail views that should rise from the bottom of the viewport. For a multi-step flow, give each step its own sheet and one state value that names the open step (see Replacing a sheet); open a second sheet over the first when a step should stay visible beneath it.\n\nStacking. Every sheet keeps its own isOpen. Open a sheet while another scrim sheet is open and it stacks on top: the sheet beneath stays mounted with its scroll position and inputs, recedes behind the new one (the nearest covered sheet shrinks to 0.96 and lifts 8px, deeper ones to 0.92 and 16px), and is blocked from pointer, keyboard, and assistive technology by the top sheet's modal dialog. The sheets can be siblings, live in separate components, sit inside another sheet's content, or sit inside a BottomSheetSwitcher step; a whole switcher is one level, and switching its step in place does not change its position. Nothing moves in the DOM: each sheet's dialog stays where it is written, and no wrapper component is needed.\n\nOrder is open order. The top sheet is the one presented most recently that is still open; a sheet that closes and reopens comes back on top. When several sheets open in one update (a deep link into a flow), there is no open order between them, so tree order decides: a sheet below the sheets rendered in its content, siblings in the order they are written. That order is right in the first painted frame.\n\nOne scrim. Only the bottom sheet's backdrop dims the page; the backdrops of the sheets above it are transparent, so a stack never darkens per level. The dim holds steady while sheets push and pop, and if the bottom sheet closes while sheets remain above it, the next sheet's backdrop takes over in the same frame.\n\nDismissal. Escape, a tap on the scrim, a downward swipe, and a platform close request (Android back, a close watcher) reach only the top sheet, through that sheet's own onOpenChange, and that sheet's purpose applies: required blocks all of them, form blocks the scrim and the swipe. Nothing closes a whole stack at once; set every sheet closed in one update when a flow is done and they leave together.\n\nClosing a covered sheet from code. Sheets rendered inside the closing sheet's content are part of it: they are presented only while it is open and leave with it. Their isOpen stays yours, as with a Dialog rendered in a closed Dialog: nothing is written to it, and a nested sheet that is still open when its host reopens is presented again, on top. Set it closed yourself when the flow is done. Sheets above the closing sheet that are not in its content stay open and keep their order; the closing sheet slides out from beneath them, and if it owned the scrim, the sheet above takes it over.\n\nReplacing a sheet. Close the top sheet and open another in the same update (one state value that names the open step does this) and the new sheet replaces it instead of stacking on it: the new sheet rises above the one it replaces; if the replaced sheet is taller it moves down to meet the new sheet's top edge at the same time; the replaced sheet fades only after both motions finish, and is inert and hidden from assistive technology from the start. The scrim holds steady throughout, with no dip; focus moves into the new sheet; and when the flow closes, focus returns to the element that opened its first sheet, whichever sheet closed last. This is the handoff the deprecated BottomSheetSwitcher ran between its steps; a multi-step flow needs no switcher: give each step its own BottomSheet and one state value. A replace happens only when exactly one sheet closes and one opens in the update, the closing sheet was the top sheet of its stack, and the move was made from inside it (the control last pressed, or with no recent press the focused element, was in the closing sheet, as a step's own Continue or Back button is); a covered sheet closing while a sheet opens, a close and an open in different updates, or a close and an open driven from a control outside the closing sheet (two unrelated owners acting at once) keep the ordinary push and pop motion and their own focus return. A replace over an open stack runs one level up and leaves the sheets beneath covered. Non-modal sheets (hasScrim={false}) replace each other the same way, with no scrim: they are hosted in the browser top layer as manual popovers, so the entering step orders above the retained one with no page-level z-index, and toasts raised before or while the sheet is open stay above it. Below the Popover API support floor (Tier 2 in the browser support guide) the sheet falls back to show() in page stacking order: usable, but with no promise over later page content. A non-modal sheet returns focus to its opener on close only while focus is still inside it; focus taken elsewhere on the live page stays there.\n\nFocus. Opening a sheet, modal or not, focuses its data-autofocus field (a TextInput with hasAutoFocus) in every browser. Without one, focus goes wherever the engine's native dialog focusing steps land: the panel in Chromium, the first focusable control in Firefox. A step entering as a replacement also focuses a data-autofocus descendant first, so a flow that opens on a field keeps the keyboard on it. Closing the top sheet returns focus into the sheet it reveals: to the control that opened it when that control is still there, otherwise to the revealed sheet's panel. When the last sheet closes, the standalone rules apply: finalFocusRef, else the element that opened the sheet, with a focus ring only after keyboard input. When every sheet of a stack closes in one update, focus returns once, to the bottom sheet's finalFocusRef or opener, after the last dialog has closed.\n\nCaveats. A Dialog, AlertDialog, or Popover opened from a sheet paints above the sheet and does not make it recede; a sheet opened from inside that Dialog paints above the Dialog and stacks over the sheet beneath. Sheets with hasScrim={false} stay out of the stack entirely (they replace each other, but never stack, recede, or take the scrim). A sheet React hides (a suspended Suspense boundary, Activity mode=\"hidden\") leaves the stack and closes its dialog; when it is shown again it is presented again, on top. Only sheets rendered in the same document stack; a sheet inside an iframe is its own stack.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for mobile-first surfaces (filters, share sheets, quick actions) where the content should rise from the bottom edge.',
      },
      {
        guidance: true,
        description:
          "For a drill-in, open the next sheet over the current one and keep each sheet's isOpen where its data lives; a detail sheet can sit inside the list sheet that opens it, right next to the row. Close every sheet in one update to close the whole flow.",
      },
      {
        guidance: true,
        description:
          "Pick the starting height that fits the content: 'hug' for short bounded content, 'capped' for lists, and 'tall' for forms or streaming/resizing content.",
      },
      {
        guidance: true,
        description:
          "Use purpose='form' to protect entered data from scrim clicks and swipes while keeping Escape available; reserve purpose='required' for flows that must end through an explicit action.",
      },
      {
        guidance: false,
        description:
          "Don't make the sheet content overly long. Break it into steps, each its own sheet, with one state value naming the open step; moving on replaces one with the next.",
      },
      {
        guidance: false,
        description:
          "Don't stack more than two or three sheets: deeper sheets share the second recede step and the user has to pop them one at a time. Replace steps instead (close one, open the next in one update) when they do not need to stay visible.",
      },
    ],
  },
  examples: [
    {
      label: 'Basic',
      code: `const [isOpen, setIsOpen] = useState(false);
<BottomSheet
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  label="Filters">
  <FilterControls />
</BottomSheet>`,
    },
    {
      label: 'Tall sheet (a list)',
      code: `const [isOpen, setIsOpen] = useState(false);
<BottomSheet
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  label="Nearby places"
  height="tall">
  <PlaceList />
</BottomSheet>`,
    },
    {
      label: 'Collapsible to half the screen',
      code: `const [isOpen, setIsOpen] = useState(false);
<BottomSheet
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  label="Nearby places"
  height="tall"
  snapPoints={[0.5]}>
  <PlaceList />
</BottomSheet>`,
    },
    {
      label: 'A peek, a working height, and full',
      code: `const [isOpen, setIsOpen] = useState(false);
<BottomSheet
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  label="Route"
  height="tall"
  snapPoints={['96px', '50%']}>
  <RouteDetails />
</BottomSheet>`,
    },
    {
      label: 'Hug height (fits content)',
      code: `const [isOpen, setIsOpen] = useState(false);
<BottomSheet
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  label="Share"
  height="hug">
  <ShareActions />
</BottomSheet>`,
    },
    {
      label: 'Long scrolling content',
      code: `const [isOpen, setIsOpen] = useState(false);
<BottomSheet
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  label="Release notes"
  height="hug">
  <ReleaseNotes />
</BottomSheet>`,
    },
    {
      label:
        'Multi-step flow (one sheet at a time, each step replaces the last)',
      code: `// One value names the open step. Moving on closes one sheet and opens the
// next in the same update: the next step rises above the current one, which
// fades once it has arrived. A dismissed step closes the flow.
const [step, setStep] = useState(null);
const stepProps = own => ({
  isOpen: step === own,
  onOpenChange: isOpen => !isOpen && setStep(current => (current === own ? null : current)),
});
<>
  <Button label="Start" onClick={() => setStep('details')} />
  <BottomSheet {...stepProps('details')} label="Details">
    <Button label="Continue" onClick={() => setStep('confirm')} />
  </BottomSheet>
  <BottomSheet {...stepProps('confirm')} label="Confirm">
    <Button label="Back" onClick={() => setStep('details')} />
    <Button label="Done" onClick={() => setStep(null)} />
  </BottomSheet>
</>`,
    },
    {
      label: 'Stacked sheets (drill-in: list, order, edit)',
      code: `const [isListOpen, setIsListOpen] = useState(false);
const [orderId, setOrderId] = useState(null);
const [isEditing, setIsEditing] = useState(false);
const closeAll = () => {
  setIsListOpen(false);
  setOrderId(null);
  setIsEditing(false);
};
<>
  <Button label="Orders" onClick={() => setIsListOpen(true)} />
  <BottomSheet isOpen={isListOpen} onOpenChange={setIsListOpen} label="Orders">
    {orders.map(order => (
      <Button key={order.id} label={order.title} onClick={() => setOrderId(order.id)} />
    ))}
  </BottomSheet>
  {/* Opens over the list; the list recedes and stays mounted. */}
  <BottomSheet
    isOpen={orderId != null}
    onOpenChange={open => !open && setOrderId(null)}
    label="Order">
    <Button label="Edit" onClick={() => setIsEditing(true)} />
    <Button label="Close all" onClick={closeAll} />
  </BottomSheet>
  <BottomSheet isOpen={isEditing} onOpenChange={setIsEditing} label="Edit order">
    <Button label="Save" onClick={() => setIsEditing(false)} />
  </BottomSheet>
</>`,
    },
    {
      label: 'Detail sheet inside the list sheet that opens it',
      code: `function PlaceRow({place}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button label={place.name} onClick={() => setIsOpen(true)} />
      {/* Rendered in the list sheet's content: stacks above it, leaves with it, and comes back with it while still open. */}
      <BottomSheet isOpen={isOpen} onOpenChange={setIsOpen} label={place.name}>
        <PlaceDetail place={place} />
      </BottomSheet>
    </>
  );
}

<BottomSheet isOpen={isListOpen} onOpenChange={setIsListOpen} label="Places">
  {places.map(place => <PlaceRow key={place.id} place={place} />)}
</BottomSheet>`,
    },
    {
      label: 'Deep link into a stack (several sheets open in one update)',
      code: `// From a URL: list, order and editor open together. With no open order
// between them, tree order decides: the list is at the bottom, the editor on top.
const [isListOpen, setIsListOpen] = useState(() => route.list);
const [orderId, setOrderId] = useState(() => route.orderId);
const [isEditing, setIsEditing] = useState(() => route.edit);
<>
  <BottomSheet isOpen={isListOpen} onOpenChange={setIsListOpen} label="Orders">…</BottomSheet>
  <BottomSheet isOpen={orderId != null} onOpenChange={open => !open && setOrderId(null)} label="Order">…</BottomSheet>
  <BottomSheet isOpen={isEditing} onOpenChange={setIsEditing} label="Edit order">…</BottomSheet>
</>`,
    },
    {
      label: 'Mobile keyboard',
      code: `const [isOpen, setIsOpen] = useState(false);
<BottomSheet
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  label="Add a comment"
  height="tall">
  <LongCommentForm />
</BottomSheet>`,
    },
    {
      label: 'No scrim',
      code: `const [isOpen, setIsOpen] = useState(true);
<BottomSheet
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  label="Nearby places"
  hasScrim={false}>
  <PlaceList />
</BottomSheet>`,
    },
    {
      label: 'Protect form input',
      code: `const [isOpen, setIsOpen] = useState(false);
<BottomSheet
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  purpose="form"
  label="Edit profile">
  <ProfileForm onSave={() => setIsOpen(false)} />
</BottomSheet>`,
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'mobile touch sheet rising from the bottom edge (native <dialog>): grab handle, opt-in transform-based drag-to-resize snap points (snapPoints: viewport fraction, percent or px length), scrolling area resizes to the snapped visible height on release (a peek stop, a quarter of the sheet or less, keeps the full height and slides instead), Dialog-aligned dismissal purpose (info/form/required), purpose-gated swipe-to-dismiss, fully-expanded Tall visual-viewport mobile-keyboard handling, named height scale, Dialog-like container padding (padding prop, theme bottom-sheet padding, default --spacing-4), modal (default) or non-modal (hasScrim={false}) presentation; modal sheets stack in open order (covered sheet stays mounted, recedes 0.96/−8px then 0.92/−16px, blocked; one scrim; same-update opens ordered by tree; Escape/scrim/swipe pop the top sheet only; a sheet inside a closing sheet leaves with it and returns with it while still open)',
  usage: {
    anatomy,
    description:
      "Mobile touch surface for filters, actions, forms, and detail views that should rise from the bottom of the viewport; for a multi-step flow give each step its own sheet and one state value naming the open step: a same-update close and open is a replace handoff (entering sheet above, retained sheet aligns then fades, one steady scrim, focus back to the flow's opener on close). Open a sheet over another to stack: each sheet keeps its own isOpen, the top sheet is the most recently opened one, the covered sheet recedes and is blocked, one scrim dims the page, and dismissal pops only the top sheet. Sheets rendered in a closing sheet's content leave with it (their isOpen stays yours; they return with the host while still open); siblings above it stay open.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for mobile-first surfaces (filters, share sheets, quick actions) where the content should rise from the bottom edge.',
      },
      {
        guidance: true,
        description:
          "Pick the starting height that fits the content: 'hug' for short bounded content, 'capped' for lists, and 'tall' for forms or streaming/resizing content.",
      },
      {
        guidance: true,
        description:
          "Use purpose='form' to protect entered data from scrim clicks and swipes while keeping Escape available; reserve purpose='required' for flows that must end through an explicit action.",
      },
      {
        guidance: false,
        description:
          "Don't make the sheet content overly long. Break it into steps, each its own sheet, with one state value naming the open step; moving on replaces one with the next.",
      },
      {
        guidance: false,
        description:
          "Don't stack more than two or three sheets; replace steps (close one, open the next in one update) when they need not stay visible.",
      },
    ],
  },
};

export const docsZh = {
  "name": "BottomSheet",
  "displayName": "Bottom Sheet",
  "description": "一种从屏幕底部边缘升起的移动端触摸抽屉，具有进入和退出动画、抓取手柄、可选的拖动调整大小吸附点，以及由 `purpose` 控制的关闭行为。与 `Dialog` 一样，它是一个带内边距的容器：内容从主题的底部抽屉内边距（默认 `--spacing-4`）开始，作为唯一子元素的 `Section` 或 `Table`、`Divider` 等出血子元素会与其对齐。顶部内容始终从抓取条 24px 区域下方开始，该区域不是子元素可以逃逸的内边距，因此第一行绝不会位于抓取条下方；滚动内容会从它下方经过。抽屉始终拥有一个原生 `<dialog>`；在已弃用的 `BottomSheetSwitcher` 内，切换器会在流程步骤间移动时呈现和关闭该对话框。两种模式下，`ref` 和共享 DOM 属性都指向可视面板 `<div>`。抽屉可以堆叠：在另一个抽屉打开时打开的抽屉会位于其上，被覆盖的抽屉保持挂载并后退，一个遮罩覆盖页面。在同一次更新中关闭一个抽屉并打开另一个时，后者会替换前者，实现多步骤流程所需的步骤间交接。",
  "usage": {
    "description": "用于筛选、操作、表单和详情视图的移动端触摸表面，应从视口底部升起。对于多步骤流程，为每个步骤提供自己的抽屉，并用一个状态值命名当前打开的步骤（参见“替换抽屉”）；当某个步骤需要在其下方保持可见时，在该抽屉之上打开第二个抽屉。\n\n**堆叠。** 每个抽屉都保留自己的 `isOpen`。在另一个带遮罩的抽屉打开时打开一个抽屉，它会堆叠在顶部：下方的抽屉保持挂载并保留其滚动位置和输入值，在新抽屉后方后退（最近的被覆盖抽屉缩小到 0.96 并上移 8px，更深的抽屉缩小到 0.92 并上移 16px），并被顶部抽屉的模态对话框阻止指针、键盘和辅助技术访问。这些抽屉可以是兄弟节点、位于不同组件中、位于另一个抽屉的内容中，或位于 `BottomSheetSwitcher` 的步骤中；整个切换器是一个层级，就地切换其步骤不会改变其位置。DOM 中没有任何移动：每个抽屉的对话框都留在其书写位置，无需包装组件。\n\n**顺序即打开顺序。** 顶部抽屉是最近呈现且仍处于打开状态的抽屉；关闭后重新打开的抽屉会回到顶部。当多个抽屉在同一次更新中打开时（例如深链接进入流程），它们之间没有打开顺序，因此由树顺序决定：在内容中渲染的抽屉位于其自身内容中的抽屉下方，兄弟节点按书写顺序排列。该顺序在第一个绘制帧中就是正确的。\n\n**一个遮罩。** 只有最底部抽屉的背景会调暗页面；其上方抽屉的背景是透明的，因此堆栈不会逐层变暗。抽屉推入和弹出时，暗度保持稳定；如果底部抽屉关闭而上方仍有抽屉，下一个抽屉的背景会在同一帧接管。\n\n**关闭。** Escape、点按遮罩、向下滑动和平台关闭请求（Android 返回、关闭监视器）只会到达顶部抽屉，并通过该抽屉自己的 `onOpenChange` 处理，且该抽屉的 `purpose` 会生效：`required` 阻止所有这些方式，`form` 阻止遮罩和滑动。任何操作都不会一次关闭整个堆栈；流程完成时在同一次更新中将所有抽屉设为关闭，它们会一起离开。\n\n**从代码关闭被覆盖的抽屉。** 在正在关闭的抽屉内容中渲染的抽屉属于它的一部分：仅在其打开时呈现，并随其一起离开。它们的 `isOpen` 仍由你控制，就像在已关闭的 `Dialog` 中渲染的 `Dialog` 一样：不会向它写入任何内容，嵌套抽屉在宿主重新打开时如果仍处于打开状态，会再次呈现在顶部。流程完成时请自行将其设为关闭。正在关闭的抽屉上方且不在其内容中的抽屉保持打开并保留其顺序；正在关闭的抽屉会从其下方滑出，如果它拥有遮罩，上方的抽屉会接管。\n\n**替换抽屉。** 在同一次更新中关闭顶部抽屉并打开另一个（用一个状态值命名当前打开步骤即可做到），新抽屉会替换它，而不是堆叠在其上：新抽屉在被替换抽屉的上方升起；如果被替换的抽屉更高，它会同时下移以与新抽屉的顶边相接；被替换的抽屉仅在两个运动都完成后淡出，并且从一开始就不可交互且对辅助技术隐藏。遮罩在整个过程中保持稳定，没有下沉；焦点移入新抽屉；流程关闭时，焦点返回到打开其第一个抽屉的元素，无论最后关闭的是哪个抽屉。这就是已弃用的 `BottomSheetSwitcher` 在其步骤间执行的交接；多步骤流程无需切换器：为每个步骤提供自己的 `BottomSheet` 和一个状态值。仅当本次更新中恰好一个抽屉关闭且一个抽屉打开、关闭的抽屉是其堆栈的顶部抽屉，并且该移动是从其内部发起时（最后按下的控件，或没有最近按下时聚焦的元素，位于正在关闭的抽屉中，正如步骤自己的“继续”或“返回”按钮），才会发生替换；被覆盖的抽屉在另一个抽屉打开时关闭、关闭和打开发生在不同更新中，或由正在关闭抽屉外部的控件驱动关闭和打开（两个无关的所有者同时操作），都会保持普通的推入和弹出动效及其各自的焦点返回。在打开的堆栈上执行替换会上升一个层级，并让下方的抽屉保持被覆盖。非模态抽屉（`hasScrim={false}`）以相同方式互相替换，但没有遮罩：它们作为手动弹出层托管在浏览器顶层，因此进入的步骤会在保留的步骤上方排序，无需页面级 `z-index`，并且在抽屉打开前或打开期间弹出的 toast 会保持在其上方。低于 Popover API 支持基线（浏览器支持指南中的 Tier 2）时，抽屉会回退为按页面堆叠顺序调用 `show()`：可用，但无法保证位于后续页面内容之上。非模态抽屉仅在焦点仍位于其内部时，才会在关闭时将焦点返回给其打开者；焦点被移到活动页面其他地方时会留在那里。\n\n**焦点。** 打开抽屉（无论是否模态）会在所有浏览器中聚焦其 `data-autofocus` 字段（带有 `hasAutoFocus` 的 `TextInput`）。没有该字段时，焦点会落在引擎原生对话框聚焦步骤所到之处：Chromium 中为面板，Firefox 中为第一个可聚焦控件。作为替换进入的步骤也会先聚焦 `data-autofocus` 后代，因此以字段打开的流程会保持键盘在其上。关闭顶部抽屉会将焦点返回到其揭示的抽屉：如果打开它的控件仍然存在，则返回该控件，否则返回被揭示抽屉的面板。最后一个抽屉关闭时，适用独立抽屉规则：`finalFocusRef`，否则打开该抽屉的元素，且仅在键盘输入后显示焦点环。当堆栈中的所有抽屉在同一次更新中关闭时，焦点会在最后一个对话框关闭后返回一次，返回到底部抽屉的 `finalFocusRef` 或打开者。\n\n**注意事项。** 从抽屉中打开的 `Dialog`、`AlertDialog` 或 `Popover` 会绘制在抽屉上方，且不会使抽屉后退；从该 `Dialog` 内部打开的抽屉会绘制在 `Dialog` 上方，并堆叠在下方的抽屉之上。`hasScrim={false}` 的抽屉完全不参与堆叠（它们互相替换，但绝不会堆叠、后退或占用遮罩）。React 隐藏的抽屉（挂起的 Suspense 边界、`Activity mode=\"hidden\"`）会离开堆栈并关闭其对话框；再次显示时会重新呈现并位于顶部。只有渲染在同一文档中的抽屉才会堆叠；iframe 中的抽屉是独立的堆栈。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于移动优先的表面（筛选、分享面板、快捷操作），内容应从底部边缘升起。"
      },
      {
        "guidance": true,
        "description": "对于下钻场景，在当前抽屉之上打开下一个抽屉，并将每个抽屉的 `isOpen` 保存在其数据所在处；详情抽屉可以放在打开它的列表抽屉内，紧挨着对应行。要在一次更新中关闭每个抽屉以关闭整个流程。"
      },
      {
        "guidance": true,
        "description": "选择适合内容的起始高度：`'hug'` 用于简短且有界的内容，`'capped'` 用于列表，`'tall'` 用于表单或流式/调整大小的内容。"
      },
      {
        "guidance": true,
        "description": "使用 `purpose='form'` 保护已输入的数据免受遮罩点按和滑动影响，同时保留 Escape；`purpose='required'` 仅用于必须通过明确操作结束的流程。"
      },
      {
        "guidance": false,
        "description": "不要让抽屉内容过长。将其拆分为多个步骤，每个步骤一个抽屉，并用一个状态值命名当前打开的步骤；继续前进时用下一个替换当前抽屉。"
      },
      {
        "guidance": false,
        "description": "不要堆叠超过两个或三个抽屉：更深的抽屉共享第二级后退，用户必须逐个弹出。当步骤无需保持可见时，请改为替换步骤（在一次更新中关闭一个并打开下一个）。"
      }
    ],
    "anatomy": [
      {
        "name": "抽屉面板",
        "required": true,
        "description": "从底部边缘升起并包含抽屉的绘制表面。"
      },
      {
        "name": "内容区域",
        "required": true,
        "description": "带内边距的可滚动容器，用于呈现调用方提供的抽屉内容。"
      },
      {
        "name": "手柄",
        "required": true,
        "description": "面板顶部的装饰性抓取提示和拖拽区域。"
      },
      {
        "name": "遮罩",
        "required": false,
        "description": "在带遮罩的呈现中调暗并阻止页面交互的背景。"
      }
    ]
  },
  "propDescriptions": {
    "isOpen": "独立抽屉是否打开。完全受控；需与 `onOpenChange` 配合使用。仅在已弃用的 `BottomSheetSwitcher` 内省略，由切换器自行驱动其步骤。",
    "onOpenChange": "对于独立抽屉，在其请求更改打开状态时调用。自动调用遵循 `purpose`：`info` 在 Escape、遮罩点按或滑动时关闭；`form` 仅在 Escape 时关闭；`required` 从不隐式关闭。仅在已弃用的 `BottomSheetSwitcher` 内省略，由切换器自行驱动其步骤。",
    "finalFocusRef": "独立抽屉可选的显式焦点返回目标。当打开者可能重新挂载，或活动元素不是可靠的触发器（例如自适应呈现切换）时使用。抽屉自行关闭或最后关闭时始终聚焦此目标；当下方仍有模态抽屉打开时，焦点会返回到该抽屉中（如果此元素在其内部则返回此元素，否则返回被揭示的面板）。仅在已弃用的 `BottomSheetSwitcher` 内省略，由切换器自行驱动其步骤。",
    "purpose": "控制隐式关闭行为，与 `Dialog` 一致。`info` 允许 Escape、遮罩点按和滑动关闭。`form` 通过阻止遮罩点按和滑动来保护已输入的数据，同时允许 Escape。`required` 阻止所有隐式关闭路径，并使用 `role='alertdialog'`。显式控件仍可更新受控状态。适用于独立抽屉和由 `BottomSheetSwitcher` 管理的抽屉。",
    "sheetId": "随 `BottomSheetSwitcher` 一起弃用：请改为让每个步骤使用带 `isOpen` 的独立抽屉。仍可按发布版行为工作：此抽屉在 `BottomSheetSwitcher` 内的唯一 ID，当 `activeSheet` 匹配时会打开它；使用 `sheetId` 时请省略 `isOpen` 和 `onOpenChange`。",
    "label": "抽屉的无障碍标签。必填；抽屉没有可用于派生名称的内置标题。",
    "children": "可滚动区域中的抽屉内容。命名主体在溢出时可通过键盘到达。正向 Tab 进入可能会直接移到第一个原生链接或按钮；输入控件、复合组件和嵌套滚动区域会保留主体停留点。从委托的第一个子元素按 Shift+Tab 会跳过主体。内容适配时不会添加主体停留点。内部观察的内容盒会保留块级流和百分比高度。如果其中包含可能唤起移动键盘的文本输入控件，请使用 `height='tall'`，并在编辑时保持抽屉完全展开。",
    "padding": "抽屉内容的内部内边距，使用间距比例，与 `Dialog` 一致。省略时使用主题的底部抽屉默认值（除非主题为 bottom-sheet 设置了 padding，否则为 `--spacing-4`）。作为唯一子元素的 `Section` 会逃逸内边距，`Table` 和 `Divider` 等出血子元素会进行补偿。对于自带内缩的贴边内容使用 0。无论内边距为何，块起始方向的内缩都不会小于抓取条高度（`--spacing-6`），因此静止内容会从抓取条下方开始。",
    "height": "抽屉的高度。命名预算：`'hug'` 适应其内容，最高为视口的 92%；`'capped'` 是可滚动的中等高度面板（约 62%）；`'tall'` 是固定的接近全屏面板（约 92%），用于流式加载的内容。也可传入数字（px）/ CSS 长度作为自定义预算。提供 `snapPoints` 让用户可在高度之间拖动。在较矮的视口中，抽屉会填满可用高度。只有完全展开的 `'tall'` 抽屉才提供移动键盘适配：它会保持原位，并将每个聚焦控件滚动到键盘上方。`'hug'`、`'capped'`、数字和 CSS 长度高度从不提供此行为；`'tall'` 抽屉在用户将其拖动到较矮档位时立即停止提供，拖回后恢复。在该状态之外，抽屉既不移动也不增加键盘滚动空间，浏览器自身的焦点显示会保留；在 iOS 上，该显示可能会移动整个页面。此适配适用于视觉视口因键盘而缩小的场景，例如 iOS 上的 Safari、Android 上的 Firefox 和 Android 上的 Chrome；抽屉会在键盘升起时将聚焦控件放在键盘正上方，控件会随 Gboard 剩余的上升过程移动，并在失焦后随下降过程移动；Chrome 延迟报告的隐藏（例如返回）会从 Chrome 报告时开始下降（`astryx docs browser-support`）。",
    "snapPoints": "抽屉在拖动时可停留的额外高度；其自身高度始终是最高的停靠点，省略此项会得到一个只能打开和关闭的抽屉。每个停靠点是抽屉的可见高度：数字表示视口比例（0.5 为屏幕的一半），`'50%'` 是相同的 CSS 值，`'320px'` 是绝对长度。小于或等于抽屉高度四分之一的停靠点是窥视状态：它会滑走而不是重排，并减淡遮罩。",
    "hasScrim": "对于独立的 `BottomSheet`，是否渲染遮罩，即覆盖并阻止背景的半透明覆盖层。`true`（默认）使用 `showModal()`：顶层、原生焦点约束、`::backdrop` 遮罩、`body` 滚动锁，以及当 `purpose='info'` 时点按遮罩关闭，背景不可交互。带遮罩的抽屉也参与堆叠（参见下文“堆叠”）。`false` 会将抽屉作为手动弹出层呈现在顶层（低于 Popover API 支持基线时，回退为按页面堆叠顺序调用 `show()`），没有遮罩、没有焦点陷阱、没有滚动锁，后方页面保持可交互和可滚动；无遮罩抽屉既不堆叠在其他抽屉上，也不会被堆叠，但无遮罩步骤会以相同的交接互相替换。在不包含它的模态（带遮罩的抽屉或 `Dialog`）打开时显示的无遮罩抽屉，会在该模态下方不可交互并保持在其下方（`show()`，无页面级 `z-index`），直到该模态消失，然后进入顶层；正在退出的模态视为已消失，而在模态内部渲染的抽屉会立即进入顶层。在多步骤流程中，请在每个步骤上设置相同的 `hasScrim`。"
  }
};
