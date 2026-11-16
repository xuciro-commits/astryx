// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'AlertDialog',
  displayName: 'Alert Dialog',
  group: 'Dialog',
  category: 'Overlay',
  isHiddenFromOverview: true,
  keywords: [
    'alert',
    'alertdialog',
    'confirm',
    'confirmation',
    'destructive',
    'delete',
    'modal',
    'dialog',
    'imperative',
  ],
  usage: {
    description:
      'AlertDialog asks the user to confirm a destructive or irreversible action before it happens. Use it for things like deleting content, revoking access, or discarding unsaved changes.\n\nIt implements the WAI-ARIA APG [Alert Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/): `role="alertdialog"`, a title linked by `aria-labelledby`, a consequence description linked by `aria-describedby`, focus moved into the dialog on open and returned to the trigger on close, and no dismissal by clicking outside. Escape cancels.\n\nAlertDialog passes its requested width through to Dialog, which clamps the surface to the container and dynamic viewport with token gutters. Generic Dialog footers should wrap, but Dialog does not own action semantics or order; consumer composition controls that. AlertDialog owns its confirmation semantics: above 640px, actions render horizontally and may move onto another row; at 640px and below, the destructive action appears above Cancel and both buttons fill the footer width. Button labels retain their standard single-line behavior. The breakpoint follows available width, not pointer or hover capability. The body scrolls when block space is constrained.\n\nThe two actions are tracked as one group under every pointer, the way iOS tracks the actions of an alert: the action under the pointer highlights as soon as it is pressed, the highlight follows the pointer from one action to the other, and the release runs the action under it. Releasing off both actions runs nothing. The keyboard and assistive technology keep the click of each button.\n\nFor cases where you want to show an alert without managing open state, use the `useImperativeAlertDialog` hook: call `alert.show(options)` and render `alert.element` in your tree.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Make the action button label specific: "Delete project" is better than "OK" or "Confirm".',
      },
      {
        guidance: true,
        description:
          'Describe what will happen in the description so the user knows the consequences before confirming.',
      },
      {
        guidance: true,
        description:
          'Keep the cancel button as the least-destructive focus target. On narrow screens the destructive action is visually and structurally above Cancel, but Cancel still receives initial focus.',
      },
      {
        guidance: true,
        description:
          'Use concise, specific action labels. Above 640px, complete buttons may move onto another row; at 640px and below, the destructive action appears above Cancel and both buttons fill the footer width.',
      },
      {
        guidance: false,
        description:
          'Use AlertDialog for non-destructive actions; use a standard Dialog instead.',
      },
      {
        guidance: false,
        description:
          'Rely on color alone to signal danger; the action label itself should say what will happen.',
      },
      {
        guidance: false,
        description:
          'Close the dialog from onAction before the work finishes; hold it open with isActionLoading and call onOpenChange(false) when the action settles.',
      },
    ],
    anatomy: [
      {
        name: 'Title',
        required: true,
        description:
          'The question being asked. Renders as a level-2 heading and labels the dialog via aria-labelledby.',
      },
      {
        name: 'Description',
        required: true,
        description:
          'What will happen if the user confirms. Linked to the dialog via aria-describedby.',
      },
      {
        name: 'Cancel button',
        required: true,
        description:
          'Ghost button that dismisses without acting. Takes initial focus, and Escape does the same thing.',
      },
      {
        name: 'Action button',
        required: true,
        description:
          'The confirming action. Destructive by default; shows a spinner while isActionLoading is set.',
      },
      {
        name: 'Backdrop',
        required: true,
        description:
          'Overlay behind the dialog that blocks page interaction. Clicking it does not dismiss.',
      },
      {
        name: 'Dialog surface',
        required: true,
        description:
          'The modal panel that holds the title, description, and buttons.',
      },
    ],
  },
  // Intentionally a contained isInline preview, not playground.overlay: the
  // component stays visible on load and knobs stay live, whereas a real
  // showModal() overlay makes the page inert — see ComponentPlaygroundConfig.overlay
  // in docs-types.ts (#3657).
  playground: {
    defaults: {
      isOpen: true,
      isInline: true,
      onOpenChange: undefined,
      title: 'Delete item?',
      description:
        'This action cannot be undone. The item and all its data will be permanently removed.',
      actionLabel: 'Delete',
    },
  },
  description:
    'A modal dialog that asks the user to confirm a destructive action.',
  props: [
    {
      name: 'isOpen',
      type: 'boolean',
      required: true,
      description: 'Whether the dialog is open.',
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => unknown',
      required: true,
      description: 'Visibility change callback.',
    },
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Dialog title. Linked via aria-labelledby.',
    },
    {
      name: 'description',
      type: 'string',
      required: true,
      description: 'Consequence description. Linked via aria-describedby.',
    },
    {
      name: 'actionLabel',
      type: 'string',
      required: true,
      description: 'Action button label.',
    },
    {
      name: 'onAction',
      type: '() => unknown',
      required: true,
      description: 'Called when action button is clicked. Does NOT auto-close.',
    },
    {
      name: 'cancelLabel',
      type: 'string',
      default: "'Cancel'",
      description: 'Cancel button label.',
    },
    {
      name: 'actionVariant',
      type: 'ButtonVariant',
      default: "'destructive'",
      description: 'Action button variant.',
    },
    {
      name: 'isActionLoading',
      type: 'boolean',
      description: 'Shows loading spinner on the action button.',
    },
    {
      name: 'width',
      type: 'number | string',
      default: '400',
      description:
        'Requested dialog width. Dialog preserves this preferred width and clamps it to the container and dynamic viewport with token gutters.',
    },
    {
      name: 'isInline',
      type: 'boolean',
      default: 'false',
      description:
        'Renders alert dialog content inline without modal behavior. For documentation previews and showcases only. Not being a modal, the inline path renders role="group" instead of role="alertdialog".',
    },
  ],
  components: [{name: 'useImperativeAlertDialog'}],
  theming: {
    targets: [{className: 'astryx-alert-dialog'}],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Confirms destructive/irreversible action before it happens (delete, revoke access, discard unsaved changes).',
  usage: {
    description:
      'AlertDialog confirms destructive/irreversible action (delete, revoke access, discard changes). Implements WAI-ARIA APG Alert Dialog pattern (https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/): role="alertdialog", aria-labelledby title, aria-describedby description, focus into dialog on open + back to trigger on close, no outside-click dismissal, Escape cancels. Dialog preserves requested width + clamps it to container/dynamic viewport gutters. Generic Dialog footers wrap while consumers own action order. AlertDialog owns confirmation action layout: >640px horizontal buttons may move to another row; <=640px puts the destructive action above Cancel and makes both buttons full width regardless of pointer/hover capability. Button labels remain single-line. Body scrolls when height constrained. Every pointer: both actions tracked as one group like iOS alerts (action under pointer highlights at once, highlight follows pointer between actions, release runs action under pointer, release off both runs nothing); keyboard/AT keep each button click. To show w/o managing open state, use useImperativeAlertDialog hook: call alert.show(options) + render alert.element in tree.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Make action button label specific: "Delete project" > "OK"/"Confirm".',
      },
      {
        guidance: true,
        description:
          'Describe consequences in description so user knows outcome before confirming.',
      },
      {
        guidance: true,
        description:
          'Keep cancel as initial focus: least destructive choice is preselected even when narrow visual/DOM order places it after the destructive action.',
      },
      {
        guidance: true,
        description:
          'Use concise action labels; >640px complete buttons may move to another row, and <=640px puts the destructive action above Cancel with both buttons full width regardless of pointer type.',
      },
      {
        guidance: false,
        description:
          'Use AlertDialog for non-destructive actions; use standard Dialog instead.',
      },
      {
        guidance: false,
        description:
          'Rely on color alone for danger; the action label should say what happens.',
      },
      {
        guidance: false,
        description:
          'Close from onAction before work finishes; hold open w/ isActionLoading, call onOpenChange(false) when it settles.',
      },
    ],
  },
};

export const docsZh = {
  "name": "AlertDialog",
  "displayName": "Alert Dialog",
  "description": "一个模态对话框，要求用户确认破坏性操作。",
  "usage": {
    "description": "AlertDialog 要求用户在执行破坏性或不可逆操作之前进行确认。用于删除内容、撤销访问权限或放弃未保存的更改等场景。\n\n它实现了 WAI-ARIA APG 的 [Alert Dialog 模式](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)：`role=\"alertdialog\"`、通过 `aria-labelledby` 关联的标题、通过 `aria-describedby` 关联的后果说明；打开时焦点移入对话框，关闭时返回触发元素；点击外部不会关闭对话框。按 Escape 键取消。\n\nAlertDialog 将请求的宽度传递给 Dialog，后者使用令牌间距将表面限制在容器和动态视口内。通用 Dialog 页脚应换行，但 Dialog 不负责操作语义或顺序，这些由使用方的组合方式控制。AlertDialog 负责其确认语义：在 640px 以上，操作按钮水平排列，可能移到另一行；在 640px 及以下，破坏性操作显示在 Cancel 上方，两个按钮填满页脚宽度。按钮标签保持标准的单行行为。断点取决于可用宽度，而不是指针或悬停能力。块级空间受限时，主体区域滚动。\n\n两个操作在任何指针下都作为一个组进行跟踪，就像 iOS 跟踪警告框的操作一样：指针下的操作一经按下便高亮，高亮会随指针从一个操作移动到另一个操作，松开时执行指针下的操作。在两个操作之外松开不会执行任何操作。键盘和辅助技术仍保留每个按钮的点击行为。\n\n如果希望在不管理打开状态的情况下显示警告框，可使用 `useImperativeAlertDialog` Hook：调用 `alert.show(options)`，并在组件树中渲染 `alert.element`。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "让操作按钮的标签具体明确：\"Delete project\" 比 \"OK\" 或 \"Confirm\" 更好。"
      },
      {
        "guidance": true,
        "description": "在描述中说明将会发生什么，让用户在确认前了解后果。"
      },
      {
        "guidance": true,
        "description": "让取消按钮作为破坏性最小的焦点目标。在窄屏上，破坏性操作在视觉和结构上都位于 Cancel 上方，但初始焦点仍落在 Cancel 上。"
      },
      {
        "guidance": true,
        "description": "使用简洁、具体的操作标签。在 640px 以上，完整的按钮可能移到另一行；在 640px 及以下，破坏性操作显示在 Cancel 上方，两个按钮填满页脚宽度。"
      },
      {
        "guidance": false,
        "description": "将 AlertDialog 用于非破坏性操作；此类场景应改用标准 Dialog。"
      },
      {
        "guidance": false,
        "description": "仅依靠颜色来提示危险；操作标签本身应说明将会发生什么。"
      },
      {
        "guidance": false,
        "description": "在工作完成前就从 onAction 关闭对话框；应使用 isActionLoading 让对话框保持打开，并在操作完成后调用 onOpenChange(false)。"
      }
    ],
    "anatomy": [
      {
        "name": "标题",
        "required": true,
        "description": "正在询问的问题。渲染为 2 级标题，并通过 aria-labelledby 标记对话框。"
      },
      {
        "name": "描述",
        "required": true,
        "description": "用户确认后会发生什么。通过 aria-describedby 关联到对话框。"
      },
      {
        "name": "取消按钮",
        "required": true,
        "description": "不作任何操作即关闭的 Ghost 按钮。获得初始焦点，Escape 键的效果相同。"
      },
      {
        "name": "操作按钮",
        "required": true,
        "description": "确认操作。默认为破坏性；设置 isActionLoading 时显示加载指示器。"
      },
      {
        "name": "背景遮罩",
        "required": true,
        "description": "对话框后方阻止页面交互的覆盖层。点击它不会关闭对话框。"
      },
      {
        "name": "对话框表面",
        "required": true,
        "description": "承载标题、描述和按钮的模态面板。"
      }
    ]
  },
  "propDescriptions": {
    "isOpen": "对话框是否打开。",
    "onOpenChange": "可见性变化时的回调。",
    "title": "对话框标题。通过 aria-labelledby 关联。",
    "description": "后果说明。通过 aria-describedby 关联。",
    "actionLabel": "操作按钮标签。",
    "onAction": "点击操作按钮时调用。不会自动关闭。",
    "cancelLabel": "取消按钮标签。",
    "actionVariant": "操作按钮变体。",
    "isActionLoading": "在操作按钮上显示加载指示器。",
    "width": "请求的对话框宽度。Dialog 会保留此首选宽度，并使用令牌间距将其限制在容器和动态视口内。",
    "isInline": "以内联方式渲染警告框内容，不采用模态行为。仅用于文档预览和展示。由于不是模态框，内联路径渲染 role=\"group\" 而不是 role=\"alertdialog\"。"
  },
  "components": [
    {
      "name": "useImperativeAlertDialog",
      "description": ""
    }
  ]
};
