// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatComposer',
  subComponentOf: 'Chat',
  displayName: 'Chat Composer',
  description:
    'Layout shell for a chat composer. Arranges named slots (drawer, header, input, footer, send) with page-radius container, elevation, a keyboard-only editor focus ring, and concentric inner radius for child elements.',
  usage: {
    description:
      'ChatComposer is the message-entry shell for a chat surface. It coordinates a controlled or uncontrolled draft, provides a default token-capable input and send/stop action, and arranges optional drawer, header, footer, and status content. Custom inputs and send controls can join the same value, submission, disabled, stop, and focus contract through useChatComposerContext().',
    anatomy: [
      {name: 'Composer frame', required: true, description: 'Outer composition root that groups the body with an optional status message above or below it.'},
      {name: 'Composer body', required: true, description: 'Rounded, elevated surface containing the header, input, and footer.'},
      {name: 'Drawer', required: false, description: 'Content before the body for attachments or other expandable context, typically ChatComposerDrawer.'},
      {name: 'Header', required: false, description: 'Row for start-aligned actions and end-aligned contextual information.'},
      {name: 'Input', required: true, description: 'Default ChatComposerInput or a custom editor connected through useChatComposerContext().'},
      {name: 'Footer', required: true, description: 'Row for caller-supplied footer and send actions plus the primary action.'},
      {name: 'Send or stop action', required: true, description: 'Default ChatSendButton or a custom sendButton; it submits the current draft or requests interruption.'},
      {name: 'Status message', required: false, description: 'Error or warning feedback rendered before or after the composer body.'},
    ],
  },
  playground: {
    wrapper: {component: 'Stack', props: {width: 480}},
  },
  props: [
    {
      name: 'onSubmit',
      type: '(value: string) => void',
      description: 'Called when the user submits a message.',
      required: true,
    },
    {
      name: 'onStop',
      type: '() => void',
      description: 'Called when the user requests to stop generation.',
    },
    {
      name: 'isStopShown',
      type: 'boolean',
      description: 'Whether the stop button is shown instead of the send button.',
      default: 'false',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Controlled input value.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Change handler for controlled mode.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text shown when the input is empty.',
      default: "'Type a message...'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disables the composer.',
      default: 'false',
    },
    {
      name: 'density',
      type: "'compact' | 'balanced' | 'spacious'",
      description: 'Visual density.',
      default: "'balanced'",
    },
    {
      name: 'elevation',
      type: "'none' | 'low'",
      description:
        "Resting elevation of the composer body. `low` (the default) keeps today's raised look: low at rest, bumping to med on hover / focus. `none` flattens it and draws a border. Keyboard focus in the editor adds the shared focus ring in either presentation; pointer focus does not add that ring.",
      default: "'low'",
    },
    {
      name: 'drawer',
      type: 'ReactNode',
      description: 'Slot: collapsible drawer above the input: attachments, context chips, etc. Use ChatComposerDrawer.',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Drawer content',
        },
      ],
    },
    {
      name: 'headerActions',
      type: 'ReactNode',
      description: 'Slot: left-aligned header actions (attach, mention buttons). Use icon-only size="sm" buttons.',
      slotElements: [
        {
          __element: 'Button',
          props: {
            label: 'Action',
            variant: 'ghost',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'headerContext',
      type: 'ReactNode',
      description: 'Slot: right-aligned contextual info in the header (context window usage, ProgressBar, supporting text).',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Context',
        },
      ],
    },
    {
      name: 'input',
      type: 'ReactNode',
      description: 'Slot: custom input element. Replaces the default input. Use ChatComposerInput for trigger menus/tokens, or wire any input (plain textarea, rich editor) to the composition contract via useChatComposerContext(): read value/onChange/onSubmit/canSend and register a focus control on inputControlRef so body-click-to-focus works.',
      slotElements: [
        {
          __element: 'TextInput',
          props: {
            label: 'Input',
            placeholder: 'Type here...',
          },
        },
      ],
    },
    {
      name: 'footerActions',
      type: 'ReactNode',
      description: 'Slot: left-aligned footer actions (model selector, etc).',
      slotElements: [
        {
          __element: 'Button',
          props: {
            label: 'Action',
            variant: 'ghost',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'sendActions',
      type: 'ReactNode',
      description: 'Slot: actions to the left of the send button.',
      slotElements: [
        {
          __element: 'Button',
          props: {
            label: 'Action',
            variant: 'ghost',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'sendButton',
      type: 'ReactNode',
      description: 'Slot: custom send button. Replaces the default send/stop button.',
      slotElements: [
        {
          __element: 'Button',
          props: {
            label: 'Action',
            variant: 'ghost',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'status',
      type: "{ type: 'error' | 'warning'; message?: string }",
      description: 'Status message rendered below (or above) the composer.',
    },
    {
      name: 'statusPosition',
      type: "'top' | 'bottom'",
      description: 'Where to render the status.',
      default: "'bottom'",
    },
  ],
};

export const docsZh = {
  "name": "ChatComposer",
  "displayName": "Chat Composer",
  "description": "聊天输入区的布局外壳。以页面圆角容器、浮起效果、仅键盘操作时显示的编辑器焦点环，以及为子元素设置同心内圆角来排列具名插槽（drawer、header、input、footer、send）。",
  "propDescriptions": {
    "onSubmit": "当用户提交消息时调用。",
    "onStop": "当用户请求停止生成时调用。",
    "isStopShown": "是否显示停止按钮而非发送按钮。",
    "value": "受控的输入值。",
    "onChange": "受控模式下的变更处理函数。",
    "placeholder": "输入框为空时显示的占位文本。",
    "isDisabled": "禁用输入区。",
    "density": "视觉密度。",
    "elevation": "输入区主体的静止浮起高度。`low`（默认值）保持当前的浮起外观：静止时为 low，悬停/聚焦时升至 med。`none` 会压平并绘制边框。无论采用哪种呈现，编辑器中的键盘焦点都会添加共享焦点环；指针焦点不会添加该焦点环。",
    "drawer": "插槽：输入框上方的可折叠抽屉，用于附件、上下文标签等。请使用 ChatComposerDrawer。",
    "headerActions": "插槽：左对齐的页眉操作（附件、提及按钮）。请使用仅图标的 size=\"sm\" 按钮。",
    "headerContext": "插槽：页眉中右对齐的上下文信息（上下文窗口用量、ProgressBar、辅助文本）。",
    "input": "插槽：自定义输入元素，会替换默认输入框。触发菜单/令牌请使用 ChatComposerInput；也可以将任意输入框（纯 textarea、富文本编辑器）通过 useChatComposerContext() 接入组合约定：读取 value/onChange/onSubmit/canSend，并在 inputControlRef 上注册焦点控件，使点击主体即可聚焦。",
    "footerActions": "插槽：左对齐的页脚操作（模型选择器等）。",
    "sendActions": "插槽：发送按钮左侧的操作。",
    "sendButton": "插槽：自定义发送按钮，会替换默认的发送/停止按钮。",
    "status": "在输入区下方（或上方）渲染的状态消息。",
    "statusPosition": "状态消息的渲染位置。"
  },
  "usage": {
    "description": "ChatComposer 是聊天界面的消息输入外壳。它协调受控或非受控草稿，提供默认的、支持令牌的输入框以及发送/停止操作，并排列可选的抽屉、页眉、页脚和状态内容。自定义输入框和发送控件可以通过 useChatComposerContext() 接入同一套值、提交、禁用、停止和焦点约定。",
    "anatomy": [
      {
        "name": "输入区框架",
        "required": true,
        "description": "外层组合根，将主体与其上方或下方的可选状态消息组合在一起。"
      },
      {
        "name": "输入区主体",
        "required": true,
        "description": "包含页眉、输入框和页脚的圆角浮起表面。"
      },
      {
        "name": "抽屉",
        "required": false,
        "description": "位于主体之前的内容，用于附件或其他可展开上下文，通常是 ChatComposerDrawer。"
      },
      {
        "name": "页眉",
        "required": false,
        "description": "用于起始对齐操作和末端对齐上下文信息的行。"
      },
      {
        "name": "输入框",
        "required": true,
        "description": "默认的 ChatComposerInput，或通过 useChatComposerContext() 接入的自定义编辑器。"
      },
      {
        "name": "页脚",
        "required": true,
        "description": "用于调用方提供的页脚和发送操作以及主要操作的行。"
      },
      {
        "name": "发送或停止操作",
        "required": true,
        "description": "默认的 ChatSendButton 或自定义 sendButton；它提交当前草稿或请求中断。"
      },
      {
        "name": "状态消息",
        "required": false,
        "description": "在输入区主体之前或之后渲染的错误或警告反馈。"
      }
    ]
  }
};

export const docsDense = {
  name: 'ChatComposer',
  displayName: 'Chat Composer',
  description: 'composer layout shell; named slots (drawer/header/input/footer/send) w/ page-radius + concentric inner radius',
  propDescriptions: {
    onSubmit: 'submit msg handler',
    onStop: 'stop generation handler',
    isStopShown: 'whether the stop button is shown',
    value: 'controlled input value',
    onChange: 'controlled change handler',
    placeholder: 'placeholder when empty',
    isDisabled: 'disabled; use during streaming or unmet prereqs',
    density: 'visual density',
    elevation:
      'resting elevation of composer body: low (default; low→med on hover/focus) | none (flat with border); keyboard-focused editor gets the shared ring in either mode; pointer focus does not',
    drawer: 'slot: collapsible drawer above input: attachments, context chips, etc.; use ChatComposerDrawer',
    headerActions: 'slot: left header actions (attach, mention); icon-only sm buttons',
    headerContext: 'slot: right header context info (window usage, ProgressBar, text)',
    input: 'slot: custom input; replaces default. use ChatComposerInput for triggers/tokens, or wire any input via useChatComposerContext() (value/onChange/onSubmit/canSend + register focus on inputControlRef)',
    footerActions: 'slot: left footer actions (model selector etc)',
    sendActions: 'slot: actions left of send btn',
    sendButton: 'slot: custom send btn; replaces default',
    status: 'status msg below/above composer',
    statusPosition: 'status render position',
  },
};
