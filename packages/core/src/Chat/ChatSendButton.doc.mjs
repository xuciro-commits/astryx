// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatSendButton',
  subComponentOf: 'Chat',
  displayName: 'Chat Send Button',
  isHiddenFromOverview: true,
  description: 'Circular send/stop toggle button for the chat composer. Place it inside ChatComposer where it reads context automatically: no wiring needed. When streaming starts, the button switches from a primary send icon to a secondary stop icon. Override any context value via props for standalone or custom usage.',
  props: [
    {
      name: 'isStopShown',
      type: 'boolean',
      description: 'Whether the stop button is shown. Defaults to context value.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the send button is disabled. Defaults to !canSend from context.',
    },
    {
      name: 'onSend',
      type: '() => void',
      description: 'Called when the user clicks send. Defaults to context onSubmit.',
    },
    {
      name: 'onStop',
      type: '() => void',
      description: 'Called when the user clicks stop during streaming. Defaults to context onStop.',
    },
    {
      name: 'sendIcon',
      type: 'ReactNode',
      description: 'Custom icon for the send state. Defaults to arrowUp from icon registry.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'check',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'stopIcon',
      type: 'ReactNode',
      description: 'Custom icon for the stop state. Defaults to stop from icon registry.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'check',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      description: 'Button size.',
      default: "'md'",
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
  ],
  usage: {
    description: 'Use ChatSendButton as ChatComposer’s send control when the action should switch between sending and stopping. Inside ChatComposer it reads readiness, streaming state, and action callbacks from context; standalone usage supplies those values explicitly.',
    bestPractices: [
      {
        guidance: true,
        description: 'Place ChatSendButton inside ChatComposer when its readiness and send or stop lifecycle should follow composer context.',
      },
      {
        guidance: true,
        description: 'For standalone use, provide the state and matching onSend or onStop callback explicitly.',
      },
      {
        guidance: true,
        description: 'Keep the translated Send or Stop accessible name intact when supplying custom icon artwork; the icon is decorative and must not be the only name source.',
      },
      {
        guidance: false,
        description: 'Do not render the stop state without a working onStop callback from props or ChatComposer context.',
      },
      {
        guidance: false,
        description: 'Do not expect isDisabled to disable the stop action; it applies only to the send state.',
      },
    ],
    anatomy: [
      {
        name: 'Action button',
        required: true,
        description: 'Circular icon-only Button that exposes the translated Send or Stop name and carries the chat-send-button theme target.',
      },
    ],
  },
};

export const docsZh = {
  "name": "ChatSendButton",
  "isHiddenFromOverview": true,
  "displayName": "Chat Send Button",
  "description": "用于聊天输入框的圆形发送/停止切换按钮。将其放在 ChatComposer 内即可自动读取上下文：无需额外接线。流式传输开始时，按钮从主色的发送图标切换为次色的停止图标。独立或自定义用法可通过属性覆盖任何上下文值。",
  "propDescriptions": {
    "isStopShown": "是否显示停止按钮。默认取上下文值。",
    "isDisabled": "发送按钮是否禁用。默认取上下文中的 !canSend。",
    "onSend": "用户点击发送时调用。默认取上下文 onSubmit。",
    "onStop": "流式传输期间用户点击停止时调用。默认取上下文 onStop。",
    "sendIcon": "发送状态的自定义图标。默认取图标注册表中的 arrowUp。",
    "stopIcon": "停止状态的自定义图标。默认取图标注册表中的 stop。",
    "size": "按钮尺寸。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值：不能是 style={{}} 这样的内联样式对象。"
  },
  "usage": {
    "description": "当操作需要在发送与停止之间切换时，将 ChatSendButton 用作 ChatComposer 的发送控件。在 ChatComposer 内，它从上下文读取就绪状态、流式状态和操作回调；独立使用时需显式提供这些值。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "当就绪状态以及发送或停止生命周期应遵循输入框上下文时，将 ChatSendButton 放在 ChatComposer 内。"
      },
      {
        "guidance": true,
        "description": "独立使用时，显式提供状态以及匹配的 onSend 或 onStop 回调。"
      },
      {
        "guidance": true,
        "description": "提供自定义图标素材时，保留翻译后的“发送”或“停止”无障碍名称；图标是装饰性的，不得作为唯一的名称来源。"
      },
      {
        "guidance": false,
        "description": "不要在未提供可用的 onStop 回调（来自属性或 ChatComposer 上下文）时渲染停止状态。"
      },
      {
        "guidance": false,
        "description": "不要指望 isDisabled 禁用停止操作；它仅适用于发送状态。"
      }
    ],
    "anatomy": [
      {
        "name": "操作按钮",
        "required": true,
        "description": "圆形纯图标 Button，暴露翻译后的“发送”或“停止”名称，并带有 chat-send-button 主题目标。"
      }
    ]
  }
};

export const docsDense = {
  name: 'ChatSendButton',
  isHiddenFromOverview: true,
  displayName: 'Chat Send Button',
  description: 'circular send/stop toggle btn for composer; reads ChatComposerContext; all context vals overridable via props',
  propDescriptions: {
    isStopShown: 'stop button visibility; defaults to context',
    isDisabled: 'disabled; defaults to !canSend from context',
    onSend: 'send click handler; defaults to context onSubmit',
    onStop: 'stop click handler; defaults to context onStop',
    sendIcon: 'custom send icon; default arrowUp from registry',
    stopIcon: 'custom stop icon; default stop from registry',
    size: 'btn size',
    xstyle: 'additional StyleX styles',
  },
};
