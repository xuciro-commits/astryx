// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatDictationButton',
  displayName: 'Chat Dictation Button',
  group: 'Chat',
  category: 'Chat',
  isHiddenFromOverview: true,
  hidden: false,

  keywords: ['dictation', 'microphone', 'voice', 'speech', 'recording', 'stt', 'speech-to-text', 'voice-input', 'mic'],

  usage: {
    description:
      'ChatDictationButton is a toggle button that starts and stops voice dictation inside a chat composer. It pairs with useChatDictation to show a microphone icon when idle and animated frequency bars when listening. Place it in the sendActions slot of ChatComposer.',
    bestPractices: [
      {guidance: true, description: 'Place the dictation button in the sendActions slot of ChatComposer so it sits next to the send button where users expect voice input controls.'},
      {guidance: true, description: 'Pass an inputRef to useChatDictation so interim transcripts appear as ghost text in the composer input while the user speaks.'},
      {guidance: true, description: "Enable hasSounds on useChatDictation to give users audio feedback when dictation starts and stops. This is especially helpful when the button's visual change is subtle."},
      {guidance: false, description: "Don't use the dictation button outside a chat composer context. It's designed for the composer's send-action layout, not as a standalone recording control."},
      {guidance: false, description: "Don't forget to handle the unsupported case. The button hides itself by default when the browser lacks SpeechRecognition, but you should still design the composer to work without it."},
    ],
    anatomy: [
      {name: 'Microphone icon', required: true, description: 'Shown in the idle state. Indicates that tapping will start voice input.'},
      {name: 'Frequency bars', required: false, description: 'Animated equalizer bars that replace the icon during listening. React to real microphone volume.'},
      {name: 'Ghost button', required: true, description: 'The underlying Button with ghost variant and isIconOnly, providing the hit target and focus ring.'},
    ],
  },

  props: [
    {
      name: 'dictation',
      type: 'UseSpeechRecognitionReturn',
      description:
        'The return value from useChatDictation or useSpeechRecognition. Controls all button state: listening, volume, bands, and toggle.',
      required: true,
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      description: 'Button size. Matches ChatComposer density.',
      default: "'md'",
    },
    {
      name: 'isHiddenWhenUnsupported',
      type: 'boolean',
      description:
        'When true, renders nothing if the browser does not support SpeechRecognition. When false, keeps the button visible but disabled.',
      default: 'true',
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible label override. Defaults to "Start dictation" or "Stop dictation" based on state.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
  ],

};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "ChatDictationButton 是一个切换按钮，用于在聊天输入框中开始和停止语音听写。它与 useChatDictation 配合使用，空闲时显示麦克风图标，聆听时显示动画频率条。请将其放在 ChatComposer 的 sendActions 插槽中。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将听写按钮放在 ChatComposer 的 sendActions 插槽中，使其位于发送按钮旁边，也就是用户期望找到语音输入控件的位置。"
      },
      {
        "guidance": true,
        "description": "为 useChatDictation 传入 inputRef，使用户说话时，临时转录文本以幽灵文本的形式显示在输入框中。"
      },
      {
        "guidance": true,
        "description": "在 useChatDictation 上启用 hasSounds，在听写开始和停止时为用户提供音频反馈。当按钮的视觉变化较微妙时，这尤其有帮助。"
      },
      {
        "guidance": false,
        "description": "不要在聊天输入框上下文之外使用听写按钮。它是为输入框的发送操作布局设计的，而不是独立的录音控件。"
      },
      {
        "guidance": false,
        "description": "不要忘记处理不支持的情况。当浏览器缺少 SpeechRecognition 时，按钮默认会隐藏自身，但你仍应设计好不支持该功能时输入框的工作方式。"
      }
    ],
    "anatomy": [
      {
        "name": "麦克风图标",
        "required": true,
        "description": "在空闲状态显示。表示点按将开始语音输入。"
      },
      {
        "name": "频率条",
        "required": false,
        "description": "在聆听时替代图标的动画均衡器条。它们会响应真实的麦克风音量。"
      },
      {
        "name": "幽灵按钮",
        "required": true,
        "description": "底层的 Button，使用 ghost 变体和 isIconOnly，提供点击目标和焦点环。"
      }
    ]
  },
  "propDescriptions": {
    "dictation": "useChatDictation 或 useSpeechRecognition 的返回值。控制按钮的所有状态：聆听、音量、频率条和切换。",
    "size": "按钮尺寸。与 ChatComposer 的密度匹配。",
    "isHiddenWhenUnsupported": "为 true 时，如果浏览器不支持 SpeechRecognition，则不渲染任何内容。为 false 时，按钮保持可见但处于禁用状态。",
    "label": "可访问标签的覆盖值。默认根据状态使用 \"Start dictation\" 或 \"Stop dictation\"。",
    "xstyle": "用于布局自定义（边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值，而不是 style={{}} 这样的内联样式对象。"
  },
  "name": "ChatDictationButton",
  "displayName": "Chat Dictation Button"
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'mic toggle btn for voice input in chat composer; idle=mic icon, listening=freq bars; pairs w/ useChatDictation',
  usage: {
    description:
      'Toggle button for voice dictation in chat composer. Pairs with useChatDictation. Shows mic icon when idle, animated frequency bars when listening. Goes in sendActions slot.',
    bestPractices: [
      {guidance: true, description: 'Place in sendActions slot of ChatComposer next to send button.'},
      {guidance: true, description: 'Pass inputRef to useChatDictation for interim ghost text in input.'},
      {guidance: true, description: 'Enable hasSounds for audio feedback on start/stop.'},
      {guidance: false, description: "Don't use outside chat composer context. Designed for composer send-action layout only."},
      {guidance: false, description: "Don't forget unsupported case. Button auto-hides but composer should work without it."},
    ],
  },
  propDescriptions: {
    dictation: 'return from useChatDictation/useSpeechRecognition; controls state',
    size: 'btn size',
    isHiddenWhenUnsupported: 'hide unsupported dictation; false keeps disabled btn visible',
    label: 'a11y label override',
    xstyle: 'extra StyleX styles',
  },
};
