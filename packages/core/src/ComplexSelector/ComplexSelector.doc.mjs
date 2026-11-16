// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file ComplexSelector.doc.mjs
 * @input ComplexSelector public API and composition contract
 * @output Exports full and dense component documentation
 * @position Core documentation consumed by CLI and Storybook autodocs
 *
 * SYNC: When modified, update ComplexSelector.tsx, tests, and stories.
 */

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Field',
    required: true,
    description:
      'Field shell that provides the label and optional supporting field content.',
  },
  {
    name: 'Trigger',
    required: true,
    description:
      'Control that displays the current value or placeholder and opens the popup.',
  },
  {
    name: 'Icon-rendered start icon',
    required: false,
    description:
      'Optional leading semantic icon or icon component rendered through Icon.',
  },
  {
    name: 'Caller-rendered start content',
    required: false,
    description:
      'Optional arbitrary React content rendered directly at the start of the trigger.',
  },
  {
    name: 'Indicator icon',
    required: false,
    description:
      'Trailing chevron shown when status presentation does not replace it; rotates to reflect whether the popup is open.',
  },
  {
    name: 'Popup',
    required: true,
    description:
      'Mounted dialog surface that is painted and shown while open and hidden while closed.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ComplexSelector',
  displayName: 'Complex Selector',
  group: 'Selector',
  category: 'Form Controls',
  keywords: [
    'selector',
    'picker',
    'popover',
    'dialog',
    'custom',
    'rich',
    'matrix',
    'grid',
  ],
  theming: {
    targets: [
      {
        className: 'astryx-complex-selector',
        visualProps: ['variant', 'size', 'status'],
      },
      {
        className: 'astryx-complex-selector-indicator-icon',
        states: ['state'],
      },
      {className: 'astryx-complex-selector-popup'},
    ],
  },
  components: [
    {
      name: 'ComplexSelector',
      displayName: 'Complex Selector',
      description:
        'An input or toolbar trigger and dialog-popover shell for custom selector content.',
      props: [
        {
          name: 'label',
          type: 'string',
          description: 'Label text for accessibility and the field label.',
          required: true,
        },
        {
          name: 'value',
          type: 'Value',
          description: 'Current controlled value.',
          required: true,
        },
        {
          name: 'onChange',
          type: '(value: Value) => void',
          description: 'Called when custom content commits a new value.',
        },
        {
          name: 'changeAction',
          type: '(value: Value) => void | Promise<void>',
          description:
            'Async action after onChange. ComplexSelector exposes optimistic value and busy state while pending.',
        },
        {
          name: 'children',
          type: '(value: Value, onChange: (value: Value) => void, close: () => void, state: ComplexSelectorRenderState) => ReactNode',
          description:
            'Custom dialog content. Receives positional value, onChange, close, and state helpers.',
          required: true,
        },
        {
          name: 'triggerLabel',
          type: 'ReactNode',
          description: 'Label/content shown in the closed trigger.',
        },
        {
          name: 'placeholder',
          type: 'ReactNode',
          description: 'Placeholder shown when triggerLabel is omitted.',
          default: "'Select...'",
        },
        {
          name: 'isDisabled',
          type: 'boolean',
          description: 'Disables the selector.',
        },
        {
          name: 'disabledMessage',
          type: 'string',
          description:
            "Explains why the selector is disabled. With isDisabled, shows the reason in a tooltip on hover and keyboard focus, and the reason describes the trigger through aria-describedby. The disabled trigger keeps its tab stop and still cannot open. Works with renderTrigger too: the tooltip and the description go to the control you render; drop the tooltip of that control while disabled, for example tooltip={isDisabled ? undefined : 'Filter'}. Use this instead of wrapping a disabled ComplexSelector in Tooltip, whose text would not describe the trigger.",
        },
        {
          name: 'isLoading',
          type: 'boolean',
          description: 'Shows loading state on the trigger.',
        },
        {
          name: 'status',
          type: "{type: 'warning' | 'error' | 'success', message?: string}",
          description: 'Validation status.',
        },
        {
          name: 'statusVariant',
          type: "'attached' | 'detached' | 'tooltip'",
          description:
            'How the status message is placed relative to the input. attached overlaps directly below the input (bordered treatment; detached when variant is secondary or ghost); detached floats below as a separate element with spacing; tooltip reveals the message in an info-tip button.',
          default:
            "'attached' for input selectors; 'detached' for secondary and ghost selectors",
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          description: 'Exact trigger height: sm 28px, md 32px, or lg 36px.',
          default: "'md'",
        },
        {
          name: 'variant',
          type: "'input' | 'secondary' | 'ghost'",
          description:
            'Visual trigger style. Input is the bordered form treatment; secondary matches the secondary buttons of the active theme (borderless and neutral-filled by default); ghost is borderless and transparent to match ghost buttons.',
          default: "'input'",
        },
        {
          name: 'startIcon',
          type: 'ReactNode | IconType',
          description: 'Icon displayed at the start of the trigger.',
        },
        {
          name: 'width',
          type: 'SizeValue',
          description: 'Width of the field.',
        },
        {
          name: 'placement',
          type: "'above' | 'below' | 'start' | 'end'",
          description: 'Popup placement.',
          default: "'below'",
        },
        {
          name: 'alignment',
          type: "'start' | 'center' | 'end'",
          description: 'Popup alignment along the placement axis.',
          default: "'start'",
        },
        {
          name: 'renderTrigger',
          type: '(props: ComplexSelectorRenderTriggerProps) => ReactNode',
          description:
            "Render the control the popup hangs off — a glyph in a list row, a chip, an icon button — instead of the selector's own field and button. Spread the given props ({ref, id, onClick, onKeyDown, role, aria-haspopup, aria-expanded, aria-controls, aria-busy, aria-required, aria-disabled}) onto it: the control becomes the selector's combobox field, the popup is anchored to it and still labelled by `label`, and a disabled control keeps its tab stop but does not open. The field chrome is not rendered. Pair with handleRef to open from a keystroke elsewhere.",
        },
        {
          name: 'handleRef',
          type: 'React.Ref<ComplexSelectorHandle>',
          description:
            'Imperative handle for programmatic control. Exposes open(), close(), toggle(), and isOpen().',
        },
        {
          name: 'onOpenChange',
          type: '(isOpen: boolean) => void',
          description:
            'Called whenever the surface opens or closes, however it happened — trigger, keyboard, light dismiss, Escape, close(), or the imperative handle.',
        },
        {
          name: 'contentXstyle',
          type: 'StyleXStyles',
          description: 'StyleX styles for the popup content container.',
        },
        {
          name: 'onClick',
          type: '(event: MouseEvent) => void',
          description:
            'Click handler on the trigger. Runs before the popup opens; call preventDefault() to keep it closed. A press elsewhere in the control box goes through the trigger too. With renderTrigger it runs after the built-in toggle and cannot cancel it.',
        },
        {
          name: 'onKeyDown',
          type: '(event: KeyboardEvent) => void',
          description:
            'Key handler on the trigger. Runs after the built-in handling and receives every key, including the ArrowDown that opens the popup. With renderTrigger it is skipped for keys the built-in handling cancels.',
        },
        {
          name: 'containerXstyle',
          type: 'StyleXStyles',
          description:
            'StyleX styles for the field container (label, control, and status together). No effect inside InputGroup (style the InputGroup instead) or in a `horizontal-labels` FormLayout. Root `xstyle`, `className`, and `style` are not accepted.',
        },
        {
          name: 'containerClassName',
          type: 'string',
          description:
            'Class name for the field container. Same targeting as `containerXstyle`.',
        },
        {
          name: 'containerStyle',
          type: 'CSSProperties',
          description:
            'Inline styles for the field container. Same targeting as `containerXstyle`.',
        },
        {
          name: 'controlXstyle',
          type: 'StyleXStyles',
          description:
            'StyleX styles for the visual control box: the element that paints the border and background and holds the value, icons, and end controls. Never the trigger button itself.',
        },
        {
          name: 'controlClassName',
          type: 'string',
          description: 'Class name for the visual control box.',
        },
        {
          name: 'controlStyle',
          type: 'CSSProperties',
          description: 'Inline styles for the visual control box.',
        },
      ],
    },
  ],
  usage: {
    anatomy,
    description:
      'Use ComplexSelector when a selection needs richer custom content than a Selector option row. It is intentionally one component: ComplexSelector owns the field, trigger, popover, focus restore, and changeAction flow, while the content render prop owns the selector-specific accessible structure.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use variant="secondary" beside secondary buttons, or variant="ghost" beside ghost buttons; add a startIcon when it helps identify the trigger. Use alignment="end" when a wide surface should align its end edge to the trigger.',
      },
      {
        guidance: true,
        description:
          'For staged editors, keep draft state in the composed content and call the provided onChange helper only from Apply. Cancel or dismiss without committing.',
      },
      {
        guidance: true,
        description:
          'Compose the dialog content from the appropriate accessible structure for the job: RadioList for a simple choice, Calendar/date inputs for date picking, TreeList or a searchable list for hierarchy, or a custom grid when two-dimensional arrow navigation is useful.',
      },
      {
        guidance: true,
        description:
          'Use the provided onChange helper from children; it already calls both onChange and changeAction and updates optimistic busy state.',
      },
      {
        guidance: true,
        description:
          'Call close() from custom content when a selection should dismiss the popup. Keep it open for multi-step content or freeform entry flows.',
      },
      {
        guidance: true,
        description:
          'Use Astryx focus hooks for custom content: useGridFocus for two-dimensional grids, useTreeFocus through TreeList for hierarchies, and useListFocus for custom linear collections.',
      },
      {
        guidance: true,
        description:
          'Evaluate custom content against WCAG 2.2: keyboard operation, focus visible/not obscured, names and roles, labels/instructions, target size, and contrast/non-text contrast are especially relevant for selector popovers.',
      },
      {
        guidance: false,
        description:
          'Do not rebuild trigger ARIA, popover focus management, or changeAction handling in product code.',
      },
      {
        guidance: false,
        description:
          'Do not use ComplexSelector for a plain single-column text list; use Selector instead.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled ComplexSelector in Tooltip to explain why it is disabled; the text would not describe the trigger. Use the disabledMessage prop instead.',
      },
    ],
  },
};

export const docsDense = {
  name: 'ComplexSelector',
  displayName: 'Complex Selector',
  group: 'Selector',
  category: 'Form Controls',
  description:
    'Input/secondary/ghost trigger + dialog-popover shell for rich custom selectors. Content gets value/onChange/close/state; content owns semantics. Use focus hooks and evaluate custom content against WCAG 2.2.',
  usage: {
    anatomy,
    description:
      'Use when a selection needs richer custom content than a Selector row. One component: it owns field, trigger, popover, focus restore, and changeAction; the render prop owns the selector-specific accessible structure.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use variant="ghost" with a startIcon for a toolbar trigger. Use alignment="end" when a wide surface should align its end edge to the trigger.',
      },
      {
        guidance: true,
        description:
          'For staged editors, keep draft state in the composed content and call the provided onChange helper only from Apply. Cancel or dismiss without committing.',
      },
      {
        guidance: true,
        description:
          'Compose content from the right accessible structure: RadioList for a simple choice, Calendar/date inputs for dates, TreeList or a searchable list for hierarchy, a custom grid for 2D arrow navigation.',
      },
      {
        guidance: true,
        description:
          'Use the onChange helper from children; it calls both onChange and changeAction and updates optimistic busy state.',
      },
      {
        guidance: true,
        description:
          'Call close() from custom content when a selection should dismiss the popup. Keep it open for multi-step or freeform flows.',
      },
      {
        guidance: true,
        description:
          'Use Astryx focus hooks: useGridFocus for 2D grids, useTreeFocus via TreeList for hierarchies, useListFocus for custom linear collections.',
      },
      {
        guidance: true,
        description:
          'Evaluate custom content against WCAG 2.2: keyboard operation, focus visible/not obscured, names and roles, labels/instructions, target size, and contrast.',
      },
      {
        guidance: false,
        description:
          'Do not rebuild trigger ARIA, popover focus management, or changeAction handling in product code.',
      },
      {
        guidance: false,
        description:
          'Do not use ComplexSelector for a plain single-column text list; use Selector instead.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled ComplexSelector in Tooltip to explain why it is disabled; the text would not describe the trigger. Use the disabledMessage prop instead.',
      },
    ],
  },
  propDescriptions: {
    label: 'Accessible field label.',
    value: 'Controlled value.',
    onChange: 'Commit value.',
    changeAction: 'Async action after onChange; drives optimistic value/busy.',
    disabledMessage:
      'why disabled; w/ isDisabled shows tooltip on hover/focus and describes the trigger; use instead of Tooltip wrapper',
    children: 'Render custom dialog content from (value,onChange,close,state).',
    triggerLabel: 'Closed trigger label/content.',
    variant:
      'input for forms; secondary beside secondary buttons; ghost beside ghost buttons.',
    startIcon: 'Leading trigger icon.',
    placement: 'Popup placement.',
    alignment: 'Popup alignment.',
    renderTrigger:
      'Caller-rendered opener replacing the field+button; spread the given props; popup anchored to it, labelled by label.',
    handleRef: 'Imperative open/close/toggle handle.',
    onOpenChange: 'Notified on every open and close, whatever caused it.',
    onClick:
      'Trigger click; runs before opening, preventDefault() keeps the popup closed.',
    onKeyDown:
      'Trigger keys; runs after built-in handling, sees the opening ArrowDown.',
    containerXstyle:
      'StyleX styles for the field container; no effect in InputGroup or horizontal-labels FormLayout. No root xstyle/className/style.',
    containerClassName: 'Class name for the field container.',
    containerStyle: 'Inline styles for the field container.',
    controlXstyle:
      'StyleX styles for the visual control box (border, background, icons); not the trigger button.',
    controlClassName: 'Class name for the visual control box.',
    controlStyle: 'Inline styles for the visual control box.',
    statusVariant:
      'How status message is placed: attached overlaps below input (detached for secondary and ghost); detached floats below w/ spacing; tooltip shows on status icon.',
    accessibility:
      'Custom content must provide its own accessible structure. Use focus hooks and evaluate against WCAG 2.2.',
  },
};

export const docsZh = {
  "name": "ComplexSelector",
  "displayName": "Complex Selector",
  "usage": {
    "description": "当选择需要比 Selector 选项行更丰富的自定义内容时，使用 ComplexSelector。它刻意设计为单个组件：ComplexSelector 负责字段、触发器、弹出层、焦点恢复和 `changeAction` 流程，而内容渲染属性负责选择器特定的无障碍结构。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在 secondary 按钮旁使用 `variant=\"secondary\"`，在 ghost 按钮旁使用 `variant=\"ghost\"`；当有助于识别触发器时添加 `startIcon`。当宽表面应将其结束边缘与触发器对齐时，使用 `alignment=\"end\"`。"
      },
      {
        "guidance": true,
        "description": "对于分阶段编辑器，将草稿状态保留在组合内容中，并仅从 Apply 调用提供的 `onChange` 辅助函数。Cancel 或关闭时不提交。"
      },
      {
        "guidance": true,
        "description": "根据任务从合适的无障碍结构组合对话框内容：简单选择使用 RadioList，日期选择使用 Calendar/日期输入，层级使用 TreeList 或可搜索列表，需要二维方向键导航时使用自定义网格。"
      },
      {
        "guidance": true,
        "description": "从 `children` 中使用提供的 `onChange` 辅助函数；它已经同时调用 `onChange` 和 `changeAction`，并更新乐观的忙碌状态。"
      },
      {
        "guidance": true,
        "description": "当选择后应关闭弹窗时，从自定义内容调用 `close()`。对于多步骤内容或自由输入流程，保持打开。"
      },
      {
        "guidance": true,
        "description": "为自定义内容使用 Astryx 焦点 Hook：二维网格使用 `useGridFocus`，层级通过 TreeList 使用 `useTreeFocus`，自定义线性集合使用 `useListFocus`。"
      },
      {
        "guidance": true,
        "description": "根据 WCAG 2.2 评估自定义内容：键盘操作、焦点可见/未被遮挡、名称和角色、标签/说明、目标尺寸以及对比度/非文本对比度与选择器弹窗尤其相关。"
      },
      {
        "guidance": false,
        "description": "不要在产品代码中重建触发器 ARIA、弹出层焦点管理或 `changeAction` 处理。"
      },
      {
        "guidance": false,
        "description": "不要将 ComplexSelector 用于普通的单列文本列表；请改用 Selector。"
      },
      {
        "guidance": false,
        "description": "不要将禁用的 ComplexSelector 包裹在 Tooltip 中以解释禁用原因；该文本不会描述触发器。请改用 `disabledMessage` 属性。"
      }
    ],
    "anatomy": [
      {
        "name": "字段",
        "required": true,
        "description": "提供标签和可选支持性字段内容的字段外壳。"
      },
      {
        "name": "触发器",
        "required": true,
        "description": "显示当前值或占位符并打开弹出层的控件。"
      },
      {
        "name": "图标渲染的起始图标",
        "required": false,
        "description": "可选的、通过 Icon 渲染的前置语义图标或图标组件。"
      },
      {
        "name": "调用方渲染的起始内容",
        "required": false,
        "description": "可选的在触发器起始处直接渲染的任意 React 内容。"
      },
      {
        "name": "指示器图标",
        "required": false,
        "description": "状态呈现未替换它时显示的尾部箭头；会旋转以反映弹出层是否打开。"
      },
      {
        "name": "弹出层",
        "required": true,
        "description": "已挂载的对话框表面，打开时绘制并显示，关闭时隐藏。"
      }
    ]
  },
  "components": [
    {
      "name": "ComplexSelector",
      "description": "用于自定义选择器内容的输入框或工具栏触发器及对话框弹出层外壳。",
      "propDescriptions": {
        "label": "用于无障碍和字段标签的标签文本。",
        "value": "当前受控值。",
        "onChange": "当自定义内容提交新值时调用。",
        "changeAction": "`onChange` 之后的异步操作。ComplexSelector 在挂起期间暴露乐观值和忙碌状态。",
        "children": "自定义对话框内容。接收位置参数 `value`、`onChange`、`close` 和状态辅助函数。",
        "triggerLabel": "关闭的触发器中显示的标签/内容。",
        "placeholder": "省略 `triggerLabel` 时显示的占位符。",
        "isDisabled": "禁用选择器。",
        "disabledMessage": "解释选择器为何被禁用。与 `isDisabled` 一起使用时，在悬停和键盘焦点时于 Tooltip 中显示原因，且该原因通过 aria-describedby 描述触发器。禁用的触发器保留其 Tab 停靠点，但仍无法打开。也可与 `renderTrigger` 配合使用：Tooltip 和描述会应用到你渲染的控件上；禁用时请移除该控件的 Tooltip，例如 `tooltip={isDisabled ? undefined : 'Filter'}`。请使用此属性，而不是将禁用的 ComplexSelector 包裹在 Tooltip 中，因为后者的文本不会描述触发器。",
        "isLoading": "在触发器上显示加载状态。",
        "status": "校验状态。",
        "statusVariant": "状态消息相对于输入框的放置方式。`attached` 直接重叠在输入框下方（带边框处理；当 `variant` 为 secondary 或 ghost 时脱离）；`detached` 作为独立元素浮动在下方并保留间距；`tooltip` 在信息提示按钮中显示消息。",
        "size": "确切的触发器高度：sm 28px、md 32px 或 lg 36px。",
        "variant": "视觉触发器样式。`input` 是带边框的表单处理；`secondary` 匹配活动主题的 secondary 按钮（默认为无边框且中性填充）；`ghost` 无边框且透明，以匹配 ghost 按钮。",
        "startIcon": "显示在触发器起始处的图标。",
        "width": "字段的宽度。",
        "placement": "弹出层的放置位置。",
        "alignment": "弹出层沿放置轴的对齐方式。",
        "renderTrigger": "渲染弹出层所依附的控件——列表行中的字形、芯片、图标按钮——而不是选择器自带的字段和按钮。将给定的属性（`{ref, id, onClick, onKeyDown, role, aria-haspopup, aria-expanded, aria-controls, aria-busy, aria-required, aria-disabled}`）展开到其上：该控件成为选择器的组合框字段，弹出层锚定到它，并且仍由 `label` 标记，禁用的控件保留其 Tab 停靠点但不会打开。字段外框不会渲染。与 `handleRef` 搭配可从其他位置的按键打开。",
        "handleRef": "用于程序化控制的命令式句柄。暴露 `open()`、`close()`、`toggle()` 和 `isOpen()`。",
        "onOpenChange": "每当表面打开或关闭时调用，无论通过何种方式——触发器、键盘、轻触关闭、Escape、`close()` 或命令式句柄。",
        "contentXstyle": "用于弹出层内容容器的 StyleX 样式。",
        "onClick": "触发器上的点击处理函数。在弹出层打开前运行；调用 `preventDefault()` 可使其保持关闭。控件框内其他位置的按压也会经过触发器。使用 `renderTrigger` 时，它在内置切换之后运行，且无法取消切换。",
        "onKeyDown": "触发器上的按键处理函数。在内置处理之后运行，并接收每个按键，包括打开弹出层的 ArrowDown。使用 `renderTrigger` 时，对于内置处理已取消的按键会跳过。",
        "containerXstyle": "用于字段容器（标签、控件和状态一起）的 StyleX 样式。在 InputGroup 内无效（请改为设置 InputGroup 的样式），在 `horizontal-labels` FormLayout 中也无效。不接受根级 `xstyle`、`className` 和 `style`。",
        "containerClassName": "字段容器的类名。作用域与 `containerXstyle` 相同。",
        "containerStyle": "字段容器的内联样式。作用域与 `containerXstyle` 相同。",
        "controlXstyle": "用于视觉控件框的 StyleX 样式：绘制边框和背景并容纳值、图标和结束控件的元素。绝不是触发器按钮本身。",
        "controlClassName": "视觉控件框的类名。",
        "controlStyle": "视觉控件框的内联样式。"
      }
    }
  ]
};
