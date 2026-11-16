// Copyright (c) Meta Platforms, Inc. and affiliates.
/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */

const anatomy = [
  {
    name: 'Sheet dialogs',
    required: true,
    description:
      "One native dialog per child sheet, presented and closed by the switcher; the dialog hosting the active sheet carries the flow's ref, id, modality, and dismissal.",
  },
  {
    name: 'Sheet panels',
    required: true,
    description:
      'Direct BottomSheet children; exactly one is interactive while a previous panel may remain visible and inert during a handoff.',
  },
  {
    name: 'Scrim',
    required: false,
    description:
      'Native dialog backdrop shown by the default scrim-backed modal presentation; one sheet dialog paints it at a time, so a handoff never dims the page twice.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'BottomSheetSwitcher',
  displayName: 'Bottom Sheet Switcher',
  group: 'BottomSheet',
  category: 'Overlay',
  keywords: ['bottom sheet', 'switcher', 'multi-step', 'flow', 'wizard'],
  deprecated: {
    replacement: 'BottomSheet',
    description:
      'Write each step as its own BottomSheet with isOpen, controlled by one state value that names the open step; moving on from inside the open step replaces it in place (see BottomSheet, Replacing a sheet). BottomSheetSwitcher keeps working until a future minor release removes it.',
  },
  playground: {
    overlay: true,
    overlayControl: {
      stateProp: 'activeSheet',
      openValue: 'details',
    },
    defaults: {
      activeSheet: null,
      children: [
        {
          __element: 'BottomSheet',
          props: {
            sheetId: 'details',
            label: 'Setup details',
            height: 'hug',
          },
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
                  children: 'Setup details',
                },
                {
                  __element: 'Text',
                  props: {type: 'body'},
                  children: 'Add the essential information for this setup.',
                },
                {
                  __element: 'Text',
                  props: {type: 'supporting'},
                  children: 'You can review these details before saving.',
                },
              ],
            },
          },
        },
        {
          __element: 'BottomSheet',
          props: {
            sheetId: 'preferences',
            label: 'Choose preferences',
            height: 'hug',
          },
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
                  children: 'Choose preferences',
                },
                {
                  __element: 'Text',
                  props: {type: 'body'},
                  children: 'Select how this setup should behave.',
                },
                {
                  __element: 'Text',
                  props: {type: 'supporting'},
                  children:
                    'Notifications can be sent immediately, daily, or weekly.',
                },
                {
                  __element: 'Text',
                  props: {type: 'supporting'},
                  children: 'You can update these preferences later.',
                },
              ],
            },
          },
        },
        {
          __element: 'BottomSheet',
          props: {
            sheetId: 'confirm',
            label: 'Confirm setup',
            height: 'hug',
          },
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
                  children: 'Confirm setup',
                },
                {
                  __element: 'Text',
                  props: {type: 'body'},
                  children: 'Everything is ready to save.',
                },
              ],
            },
          },
        },
      ],
    },
  },
  description:
    'Deprecated: write each step as its own BottomSheet with isOpen, controlled by one state value that names the open step. Closing the top sheet and opening the next in the same update, from a control inside the open step, runs the same replace handoff (see BottomSheet, Replacing a sheet), with no sheetId and no switcher; a step changed from a control outside the flow (a page control, or code after focus left the step) closes and opens with ordinary push and pop motion. BottomSheetSwitcher keeps working until a future minor release removes it: a flow used on its own behaves as released (with three fixes: a toast raised from a step renders above the flow and can be pressed, under reduced motion its steps follow the reduced-motion rule, and a step with a hasAutoFocus field opens on that field in every browser), and a flow stacked with other sheets is one level of the stack (it recedes and is blocked when covered, shares the one scrim, and stands down from dismissal while covered). Modal and hasScrim={false} flows migrate the same way. Coordinates multiple BottomSheets as a mutually exclusive flow. One activeSheet ID selects the only interactive sheet; during a handoff, the new sheet enters above the inert previous sheet. If the new sheet is shorter, the previous sheet simultaneously moves down until their top edges align, then fades after both transforms complete. Each child sheet renders its own native <dialog>: a modal flow presents each sheet with showModal(), as a standalone modal sheet does, so the browser supplies modality (the page is inert and focus stays in the top-layer dialog, so both hold across a handoff) and the switcher holds the shared body scroll lock once for the whole modal flow. A no-scrim flow presents each sheet with show() inside the isolated flow wrapper of the switcher, which orders the step dialogs with local values; this differs from a standalone hasScrim={false} sheet, which is hosted in the top layer as a manual popover with no page-level z-index, and it is one reason to migrate. The switcher coordinates the rest: one scrim paints at a time, focus returns to the element that opened the flow, its ref, id, and data-testid resolve to the dialog hosting the active sheet, and its other dialog props and handlers apply to every sheet dialog.',
  props: [
    {
      name: 'ref',
      type: 'Ref<HTMLDialogElement>',
      description:
        "Ref resolved to the native dialog hosting the flow: the active sheet's dialog, which changes to the next sheet's on a handoff; the exiting sheet's through its exit; and, while the flow is closed, the dialog that hosted it last (or the first mounted sheet's). It is never null while a sheet is mounted, from the first commit on. id and data-testid render on this dialog only: a flow that mounts open carries them on the active sheet's dialog in server markup too; a flow that mounts closed carries them from the first commit's synchronous re-render on, and its server markup carries them on no element. Other dialog props apply to every sheet dialog.",
    },
    {
      name: 'onCancel',
      type: '(event: SyntheticEvent<HTMLDialogElement>) => void',
      description:
        "Called before the switcher handles a native cancel request (Escape or the platform close). Attached to every sheet dialog; the browser raises cancel on the dialog it is presenting, the active sheet's. Calling preventDefault() keeps the controlled flow open.",
    },
    {
      name: 'activeSheet',
      type: 'string | null',
      description:
        "ID of the interactive BottomSheet, or null when the flow should close. Match a nested BottomSheet's unique sheetId; the previous sheet may remain visually present and inert while the new sheet enters, simultaneously align downward behind a shorter step, then fade away.",
      required: true,
    },
    {
      name: 'onActiveSheetChange',
      type: '(activeSheet: string | null) => void',
      description:
        "Called with null when the active sheet dismisses according to its purpose. Child BottomSheets may use purpose='form' or purpose='required' to limit implicit dismissal while flow controls can still use the same state setter to switch sheets or close the flow.",
      required: true,
    },
    {
      name: 'hasScrim',
      type: 'boolean',
      description:
        "Whether the sheet dialogs are modal. true presents each sheet with showModal() for a native ::backdrop, native focus containment, one body scroll lock held for the whole flow, and click-to-dismiss when the active BottomSheet has purpose='info'; only one backdrop paints at a time. false uses show() with no backdrop and leaves the page interactive; avoid transformed, contained, or clipping ancestors because a non-modal dialog remains in its containing context.",
      default: 'true',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'BottomSheets identified by unique sheetId values.',
      required: true,
    },
  ],
  usage: {
    anatomy,
    description:
      "Deprecated: write each step as its own BottomSheet with isOpen, controlled by one state value that names the open step. Closing the top sheet and opening the next in the same update, from a control inside the open step, runs the same replace handoff (see BottomSheet, Replacing a sheet), with no sheetId and no switcher; a step changed from a control outside the flow (a page control, or code after focus left the step) closes and opens with ordinary push and pop motion. BottomSheetSwitcher keeps working until a future minor release removes it: a flow used on its own behaves as released (with three fixes: a toast raised from a step renders above the flow and can be pressed, under reduced motion its steps follow the reduced-motion rule, and a step with a hasAutoFocus field opens on that field in every browser), and a flow stacked with other sheets is one level of the stack (it recedes and is blocked when covered, shares the one scrim, and stands down from dismissal while covered). Modal and hasScrim={false} flows migrate the same way. Set activeSheet to a nested BottomSheet's sheetId to open or switch steps, and to null to close.\n\nStacking. A scrim flow is one level in the stack of open sheets (see BottomSheet, Stacking). Open it while a standalone sheet is open and the flow sits on top of that sheet, which recedes and is blocked; open a standalone sheet while the flow is open, from a step's content or from anywhere else, and that sheet sits on top while the whole flow recedes as one. Switching the step in place never changes the flow's position. Escape, the scrim, a swipe, and a platform close request reach only the top level: the flow's onActiveSheetChange(null) when the flow is on top, the standalone sheet's onOpenChange(false) when that sheet is. A standalone sheet rendered inside a step's content is presented only while that step is the active one: it leaves when the flow switches step or closes, its isOpen stays yours, and it is presented again, on top, if the step returns while it is still open. Only the bottom level's backdrop dims the page. A no-scrim flow stays out of the stack.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Prefer one standalone BottomSheet per step with one state value naming the open step; the replace handoff is the same and nothing has to be nested under a switcher.',
      },
      {
        guidance: true,
        description:
          'Migrate an existing flow in place: replace activeSheet / onActiveSheetChange with one step value, give each step isOpen={step === id} and a guarded onOpenChange (clear the step only if it is still the open one) in place of sheetId, remove the wrapper and move its hasScrim onto every step. Map the other switcher props: onCancel becomes a guarded onOpenChange on each step (ignore false while the flow must stay open) — a standalone sheet reports Escape, the platform close, the scrim tap and the swipe all as onOpenChange(false) with no reason, so the guard holds the step against all of them while it applies, and a veto of Escape alone has no equivalent; the only per-path lever is purpose (form keeps Escape and blocks the scrim tap and the swipe; required blocks all three and exposes the step as an alertdialog). A consumer aria-label or aria-labelledby becomes each step label, which names its dialog. ref, id, data-testid, className, style, xstyle and the other dialog props have no dialog-level equivalent: a standalone sheet sends its ref and base props to the panel div and its dialog is implementation, so a test or anchor that needs the dialog queries the panel closest("dialog"), and dialog-level styling is dropped.',
      },
      {
        guidance: false,
        description:
          "Don't split information across sheets when people need to compare it; use a full-page layout that keeps the relevant content visible together instead.",
      },
      {
        guidance: false,
        description:
          "Don't use a step flow when multiple panels must stay interactive or visible together; a flow intentionally selects one interactive step.",
      },
    ],
  },
  examples: [
    {
      label: 'Replacement: the same three-step flow as standalone sheets',
      code: `const [step, setStep] = useState(null);

<>
  <Button label="Start" onClick={() => setStep('details')} />
  <BottomSheet isOpen={step === 'details'} onOpenChange={o => !o && setStep(c => (c === 'details' ? null : c))} label="Details" height="hug">
    <SetupDetails />
    <Button label="Continue" onClick={() => setStep('preferences')} />
  </BottomSheet>
  <BottomSheet isOpen={step === 'preferences'} onOpenChange={o => !o && setStep(c => (c === 'preferences' ? null : c))} label="Preferences" height="hug">
    <Preferences />
    <Button label="Back" onClick={() => setStep('details')} />
    <Button label="Continue" onClick={() => setStep('confirm')} />
  </BottomSheet>
  <BottomSheet isOpen={step === 'confirm'} onOpenChange={o => !o && setStep(c => (c === 'confirm' ? null : c))} label="Confirm" height="hug">
    <Confirmation />
    <Button label="Back" onClick={() => setStep('preferences')} />
    <Button label="Done" onClick={() => setStep(null)} />
  </BottomSheet>
</>`,
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'deprecated: use one standalone BottomSheet per step with one state value naming the open step (same replace handoff when stepped from inside the open step, no sheetId); keeps working until a future minor removes it. controller for mutually exclusive multi-step BottomSheets, one native dialog per sheet; a scrim flow is one level of the bottom-sheet stack (stacks over or under standalone sheets in open order, recedes as a whole, switching steps keeps its place)',
  usage: {
    anatomy,
    description:
      "Deprecated: write each step as a standalone BottomSheet with isOpen driven by one state value; a same-update close and open from inside the open step is the same replace handoff. Still works: set activeSheet to a nested BottomSheet's sheetId to open or switch steps, and to null to close. A scrim flow stacks with standalone sheets as one level; a standalone sheet inside a step leaves when the step is left and returns with it while still open.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Prefer one standalone BottomSheet per step with one state value naming the open step; the replace handoff is the same and nothing has to be nested under a switcher.',
      },
      {
        guidance: true,
        description:
          'Migrate an existing flow in place: replace activeSheet / onActiveSheetChange with one step value, give each step isOpen={step === id} and a guarded onOpenChange (clear the step only if it is still the open one) in place of sheetId, remove the wrapper and move its hasScrim onto every step. Map the other switcher props: onCancel becomes a guarded onOpenChange on each step (ignore false while the flow must stay open) — a standalone sheet reports Escape, the platform close, the scrim tap and the swipe all as onOpenChange(false) with no reason, so the guard holds the step against all of them while it applies, and a veto of Escape alone has no equivalent; the only per-path lever is purpose (form keeps Escape and blocks the scrim tap and the swipe; required blocks all three and exposes the step as an alertdialog). A consumer aria-label or aria-labelledby becomes each step label, which names its dialog. ref, id, data-testid, className, style, xstyle and the other dialog props have no dialog-level equivalent: a standalone sheet sends its ref and base props to the panel div and its dialog is implementation, so a test or anchor that needs the dialog queries the panel closest("dialog"), and dialog-level styling is dropped.',
      },
      {
        guidance: false,
        description:
          "Don't split information across sheets when people need to compare it; use a full-page layout that keeps the relevant content visible together instead.",
      },
      {
        guidance: false,
        description:
          "Don't use a step flow when multiple panels must stay interactive or visible together; a flow intentionally selects one interactive step.",
      },
    ],
  },
};

export const docsZh = {
  "name": "BottomSheetSwitcher",
  "displayName": "Bottom Sheet Switcher",
  "description": "已弃用：请将每个步骤写为独立的 `BottomSheet`，通过 `isOpen` 控制，并由一个命名当前打开步骤的状态值统一管理。在打开的步骤内部控件中，于同一次更新中关闭顶层抽屉并打开下一个，会执行相同的替换式交接（参见 `BottomSheet` 的“替换抽屉”），无需 `sheetId`，也无需切换器；若从流程外部的控件（页面控件，或焦点离开步骤后执行的代码）更改步骤，则会以普通的推入和弹出动效关闭并打开。`BottomSheetSwitcher` 会继续工作，直到未来的次要版本将其移除：单独使用的流程行为与发布版一致（另有三项修复：从步骤中弹出的 toast 会渲染在流程上方并可按下；在减少动态效果下，其步骤遵循减少动态效果规则；带有 `hasAutoFocus` 字段的步骤在所有浏览器中都会在该字段上打开），与其他抽屉堆叠的流程则作为堆栈中的一个层级（被覆盖时会后退并受阻，共享同一个遮罩，且在覆盖期间退出关闭处理）。模态流程和 `hasScrim={false}` 流程也以相同方式迁移。将多个 `BottomSheet` 协调为互斥流程。一个 `activeSheet` ID 会选择唯一可交互的抽屉；交接期间，新抽屉进入并位于不可交互的旧抽屉上方。如果新抽屉较矮，旧抽屉会同时下移，直到两者的顶边对齐，然后在两个变换都完成后淡出。每个子抽屉渲染自己的原生 `<dialog>`：模态流程会像独立的模态抽屉一样用 `showModal()` 呈现每个抽屉，因此浏览器提供模态性（页面不可交互，焦点保留在顶层对话框中，两者在交接期间都保持），并且切换器为整个模态流程只持有一次共享的 `body` 滚动锁。无遮罩流程会在切换器隔离的流程包装器内用 `show()` 呈现每个抽屉，以局部值排序步骤对话框；这与独立的 `hasScrim={false}` 抽屉不同——后者作为手动弹出层托管在顶层，没有页面级 `z-index`——这也是需要迁移的原因之一。切换器负责其余协调：一次只绘制一个遮罩，焦点返回到打开流程的元素，其 `ref`、`id` 和 `data-testid` 解析为承载活动抽屉的对话框，其他对话框属性和处理器则应用到每个抽屉对话框。",
  "usage": {
    "description": "已弃用：请将每个步骤写为独立的 `BottomSheet`，通过 `isOpen` 控制，并由一个命名当前打开步骤的状态值统一管理。在打开的步骤内部控件中，于同一次更新中关闭顶层抽屉并打开下一个，会执行相同的替换式交接（参见 `BottomSheet` 的“替换抽屉”），无需 `sheetId`，也无需切换器；若从流程外部的控件（页面控件，或焦点离开步骤后执行的代码）更改步骤，则会以普通的推入和弹出动效关闭并打开。`BottomSheetSwitcher` 会继续工作，直到未来的次要版本将其移除：单独使用的流程行为与发布版一致（另有三项修复：从步骤中弹出的 toast 会渲染在流程上方并可按下；在减少动态效果下，其步骤遵循减少动态效果规则；带有 `hasAutoFocus` 字段的步骤在所有浏览器中都会在该字段上打开），与其他抽屉堆叠的流程则作为堆栈中的一个层级（被覆盖时会后退并受阻，共享同一个遮罩，且在覆盖期间退出关闭处理）。模态流程和 `hasScrim={false}` 流程也以相同方式迁移。将 `activeSheet` 设置为嵌套 `BottomSheet` 的 `sheetId` 以打开或切换步骤，设置为 `null` 以关闭。\n\n**堆叠。** 带遮罩的流程是打开抽屉堆栈中的一个层级（参见 `BottomSheet` 的“堆叠”）。在独立抽屉已打开时打开它，流程会位于该抽屉之上，后者后退并受阻；在流程打开时从步骤内容或任何其他位置打开独立抽屉，该抽屉会位于顶部，而整个流程作为一个整体后退。就地切换步骤绝不会改变流程的位置。Escape、遮罩、滑动和平台关闭请求只会到达顶层：流程位于顶层时为流程的 `onActiveSheetChange(null)`，独立抽屉位于顶层时为该抽屉的 `onOpenChange(false)`。渲染在步骤内容中的独立抽屉仅在该步骤为活动步骤时呈现：当流程切换步骤或关闭时它会离开，其 `isOpen` 仍由你控制，如果步骤在其仍打开时返回，它会再次呈现在顶部。只有最底层的背景遮罩会调暗页面。无遮罩流程不参与堆叠。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "优先为每个步骤使用一个独立的 `BottomSheet`，并用一个状态值命名当前打开的步骤；替换式交接完全相同，且无需嵌套在切换器下。"
      },
      {
        "guidance": true,
        "description": "就地迁移现有流程：用一个步骤值替换 `activeSheet` / `onActiveSheetChange`，为每个步骤设置 `isOpen={step === id}`，并用带守卫的 `onOpenChange`（仅当该步骤仍为打开步骤时才清除）替代 `sheetId`，移除包装器并将其 `hasScrim` 移到每个步骤上。映射其他切换器属性：`onCancel` 变为每个步骤上带守卫的 `onOpenChange`（当流程必须保持打开时忽略 `false`）——独立抽屉会将 Escape、平台关闭、遮罩点按和滑动都报告为不带原因的 `onOpenChange(false)`，因此守卫会在其适用时对所有这些保持步骤，而单独否决 Escape 没有等效方式；唯一的按路径控制手段是 `purpose`（`form` 保留 Escape 并阻止遮罩点按和滑动；`required` 阻止全部三种，并将步骤暴露为 `alertdialog`）。使用方的 `aria-label` 或 `aria-labelledby` 变为每个步骤的 `label`，用于命名其对话框。`ref`、`id`、`data-testid`、`className`、`style`、`xstyle` 及其他对话框属性没有对话框级等效项：独立抽屉会将其 `ref` 和基础属性发送到面板 `div`，其对话框属于实现细节，因此需要对话框的测试或锚点应查询面板的 `closest(\"dialog\")`，而对话框级样式会被丢弃。"
      },
      {
        "guidance": false,
        "description": "当用户需要对比信息时，不要将其分散到多个抽屉中；请改用能让相关内容同时可见的整页布局。"
      },
      {
        "guidance": false,
        "description": "当多个面板必须同时保持可交互或同时可见时，不要使用步骤流程；流程有意只选择一个可交互步骤。"
      }
    ],
    "anatomy": [
      {
        "name": "抽屉对话框",
        "required": true,
        "description": "每个子抽屉一个原生对话框，由切换器呈现和关闭；承载活动抽屉的对话框带有流程的 `ref`、`id`、模态性和关闭处理。"
      },
      {
        "name": "抽屉面板",
        "required": true,
        "description": "直接的 `BottomSheet` 子元素；恰好一个可交互，交接期间前一个面板可能仍可见但不可交互。"
      },
      {
        "name": "遮罩",
        "required": false,
        "description": "由默认带遮罩的模态呈现显示的原生对话框背景；一次只有一个抽屉对话框绘制它，因此交接绝不会让页面变暗两次。"
      }
    ]
  },
  "propDescriptions": {
    "ref": "解析为承载流程的原生对话框的 `ref`：活动抽屉的对话框，交接时会变为下一个抽屉的对话框；退出抽屉在其退出期间的对话框；流程关闭期间为最后承载它的对话框（或第一个挂载的抽屉的对话框）。从首次提交开始，只要有抽屉挂载，它就绝不会是 `null`。`id` 和 `data-testid` 仅渲染在此对话框上：以打开状态挂载的流程在服务器标记中也会将其放在活动抽屉的对话框上；以关闭状态挂载的流程从首次提交的同步重新渲染起才带有它们，其服务器标记中不会有任何元素带有它们。其他对话框属性会应用到每个抽屉对话框。",
    "onCancel": "在切换器处理原生取消请求（Escape 或平台关闭）之前调用。附加到每个抽屉对话框；浏览器会在其呈现的对话框（活动抽屉的对话框）上触发取消。调用 `preventDefault()` 会保持受控流程打开。",
    "activeSheet": "可交互 `BottomSheet` 的 ID，或在流程应关闭时为 `null`。与嵌套 `BottomSheet` 的唯一 `sheetId` 匹配；新抽屉进入时，前一个抽屉可能仍可见但不可交互，同时会下移到较矮步骤的后方对齐，然后淡出。",
    "onActiveSheetChange": "当活动抽屉根据其 `purpose` 关闭时以 `null` 调用。子 `BottomSheet` 可使用 `purpose='form'` 或 `purpose='required'` 限制隐式关闭，同时流程控件仍可使用同一个状态设置函数切换抽屉或关闭流程。",
    "hasScrim": "抽屉对话框是否为模态。`true` 会用 `showModal()` 呈现每个抽屉，以获得原生 `::backdrop`、原生焦点约束、在整个流程期间保持一次的 `body` 滚动锁，以及当活动 `BottomSheet` 的 `purpose='info'` 时点击关闭；一次只绘制一个背景。`false` 使用 `show()`，无背景，并保持页面可交互；请避免变换、包含块或裁剪祖先，因为非模态对话框仍留在其包含上下文中。",
    "children": "通过唯一 `sheetId` 值标识的 `BottomSheet`。"
  }
};
