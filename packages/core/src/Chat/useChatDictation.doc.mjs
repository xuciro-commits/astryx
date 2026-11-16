// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useChatDictation',
  displayName: 'useChatDictation',
  keywords: ['chat', 'dictation', 'speech', 'voice', 'microphone', 'composer'],
  params: [
    {
      name: 'options',
      type: 'UseChatDictationOptions',
      description:
        'Speech and composer options. Omit them to listen in the provider locale until stop is called.',
      required: false,
    },
    {
      name: 'options.lang',
      type: 'string',
      description: 'BCP-47 language tag for recognition.',
      required: false,
    },
    {
      name: 'options.continuous',
      type: 'boolean',
      description: 'Whether recognition continues until stop or abort.',
      default: 'true',
      required: false,
    },
    {
      name: 'options.interimResults',
      type: 'boolean',
      description:
        'Whether partial transcripts are reported before the final one.',
      default: 'true',
      required: false,
    },
    {
      name: 'options.audioContext',
      type: 'AudioContext',
      description:
        "A shared audio context for the microphone level and cues. Omit it to use the hook's own context.",
      required: false,
    },
    {
      name: 'options.transformTranscript',
      type: '(transcript: string) => string',
      description:
        'Rewrites each transcript before it is reported, before the upper-case rule for loud speech.',
      required: false,
    },
    {
      name: 'options.inputRef',
      type: 'React.RefObject<ChatComposerInputHandle | null>',
      description:
        'The composer handle. When set, the hook focuses that composer, shows each partial transcript there, and inserts each final transcript. onResult still runs, so do not insert that text again.',
      required: false,
    },
    {
      name: 'options.hasSounds',
      type: 'boolean',
      description: 'Play a short cue when recognition starts and stops.',
      default: 'false',
      required: false,
    },
    {
      name: 'options.onResult',
      type: '(transcript: string) => void',
      description: 'Called with each final transcript.',
      required: false,
    },
    {
      name: 'options.onTranscript',
      type: '(transcript: string, isFinal: boolean) => void',
      description: 'Called for each partial transcript and each final one.',
      required: false,
    },
    {
      name: 'options.onError',
      type: '(error: {error: string, message?: string}) => void',
      description:
        'Called when recognition fails, including when microphone permission is refused.',
      required: false,
    },
    {
      name: 'options.onStart',
      type: '() => void',
      description: 'Called when recognition starts.',
      required: false,
    },
    {
      name: 'options.onEnd',
      type: '() => void',
      description: 'Called when recognition ends.',
      required: false,
    },
  ],
  returns: [
    {
      name: 'isSupported',
      type: 'boolean',
      description: 'Whether this browser provides speech recognition.',
    },
    {
      name: 'isListening',
      type: 'boolean',
      description: 'Whether recognition is active.',
    },
    {
      name: 'isSpeaking',
      type: 'boolean',
      description: 'Whether the microphone currently hears speech.',
    },
    {
      name: 'interimTranscript',
      type: 'string',
      description: 'The partial transcript, empty when none is pending.',
    },
    {
      name: 'volume',
      type: 'number',
      description: 'Microphone level from 0 to 1 while listening.',
    },
    {
      name: 'bands',
      type: 'number[]',
      description: 'Frequency band levels from low to high, each from 0 to 1.',
    },
    {
      name: 'rawBands',
      type: 'number[]',
      description: 'The same bands before calibration.',
    },
    {
      name: 'start',
      type: '() => void',
      description: 'Start recognition.',
    },
    {
      name: 'stop',
      type: '() => void',
      description: 'Stop recognition and wait for the final transcript.',
    },
    {
      name: 'abort',
      type: '() => void',
      description: 'Stop recognition immediately.',
    },
    {
      name: 'toggle',
      type: '() => void',
      description: 'Start when idle, and stop when listening.',
    },
  ],
  usage: {
    description:
      'Voice input for a chat composer. It wraps speech recognition with microphone level, start and stop cues, and optional interim text in a ChatComposerInput. Check isSupported before offering the control. A browser without speech recognition reports false and does not listen. Sustained loud speech turns the transcript to upper case.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pass inputRef when the words should appear in the composer. The hook inserts each final transcript there and still calls onResult.',
      },
      {
        guidance: true,
        description:
          'Disable the control when isSupported is false, and say that this browser cannot take voice input.',
      },
      {
        guidance: true,
        description:
          'Handle onError. It is the only signal that microphone permission was refused.',
      },
      {
        guidance: false,
        description:
          'Call the browser SpeechRecognition API beside this hook. Use useSpeechRecognition only when the composer behavior is not wanted.',
      },
    ],
  },
  relatedComponents: ['ChatComposerInput'],
  relatedHooks: ['useSpeechRecognition'],
  importPath: '@astryxdesign/core/Chat',
  category: 'Chat',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Voice input for a chat composer, with microphone level and optional interim text in the input.',
  paramDescriptions: {
    options: 'speech and composer options. Omit for the provider locale.',
    'options.lang': 'BCP-47 recognition language.',
    'options.continuous': 'keep listening until stop or abort.',
    'options.interimResults': 'report partial transcripts.',
    'options.audioContext': 'shared audio context for level and cues.',
    'options.transformTranscript':
      'rewrites each transcript before the loud-speech upper-case rule.',
    'options.inputRef':
      'composer handle. Focuses it, shows partial text, and inserts each final transcript. onResult still runs.',
    'options.hasSounds': 'play a cue on start and stop.',
    'options.onResult': 'called with each final transcript.',
    'options.onTranscript':
      'called for each partial and each final transcript.',
    'options.onError':
      'called when recognition fails, including refused microphone permission.',
    'options.onStart': 'called when recognition starts.',
    'options.onEnd': 'called when recognition ends.',
  },
  returnDescriptions: {
    isSupported: 'whether the browser has speech recognition.',
    isListening: 'whether recognition is active.',
    isSpeaking: 'whether speech is currently heard.',
    interimTranscript: 'the partial transcript.',
    volume: 'microphone level from 0 to 1.',
    bands: 'frequency band levels, each from 0 to 1.',
    rawBands: 'band levels before calibration.',
    start: 'start recognition.',
    stop: 'stop and wait for the final transcript.',
    abort: 'stop immediately.',
    toggle: 'start or stop.',
  },
  usage: {
    description:
      'Voice input for a composer. Check isSupported first. False means this browser cannot listen. Loud speech turns the transcript to upper case.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pass inputRef to put the words in the composer. Do not insert onResult as well.',
      },
      {
        guidance: true,
        description: 'Disable the control when isSupported is false.',
      },
      {
        guidance: true,
        description: 'Handle onError to learn that the microphone was refused.',
      },
      {
        guidance: false,
        description:
          'Call SpeechRecognition beside this hook. useSpeechRecognition is the headless wrapper.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useChatDictation",
  "usage": {
    "description": "聊天输入框的语音输入。它封装语音识别，提供麦克风音量、开始与停止提示，以及 ChatComposerInput 中的可选临时文本。在提供控件前先检查 isSupported。不支持语音识别的浏览器会返回 false 并且不会监听。持续大声说话会使转录文本变为大写。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "当词语应出现在输入框中时传入 inputRef。该 Hook 会在其中插入每一段最终转录，同时仍调用 onResult。"
      },
      {
        "guidance": true,
        "description": "当 isSupported 为 false 时禁用控件，并说明此浏览器无法接受语音输入。"
      },
      {
        "guidance": true,
        "description": "处理 onError。它是麦克风权限被拒绝的唯一信号。"
      },
      {
        "guidance": false,
        "description": "在此 Hook 旁调用浏览器的 SpeechRecognition API。仅在不需要输入框行为时使用 useSpeechRecognition。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "语音与输入框选项。省略时按提供方区域设置监听，直到调用 stop。",
    "options.lang": "用于识别的 BCP-47 语言标签。",
    "options.continuous": "识别是否持续到 stop 或 abort。",
    "options.interimResults": "是否在最终转录之前报告部分转录。",
    "options.audioContext": "用于麦克风音量和提示音的共享音频上下文。省略时使用该 Hook 自带的上下文。",
    "options.transformTranscript": "在报告每段转录之前重写它，先于针对大声说话的转大写规则。",
    "options.inputRef": "输入框句柄。设置后，该 Hook 会聚焦该输入框，在其中显示每段部分转录，并插入每段最终转录。onResult 仍会运行，因此不要再次插入该文本。",
    "options.hasSounds": "在识别开始和停止时播放简短提示音。",
    "options.onResult": "每段最终转录调用一次。",
    "options.onTranscript": "每段部分转录和每段最终转录都会调用。",
    "options.onError": "识别失败时调用，包括麦克风权限被拒绝的情况。",
    "options.onStart": "识别开始时调用。",
    "options.onEnd": "识别结束时调用。"
  },
  "returnDescriptions": {
    "isSupported": "此浏览器是否提供语音识别。",
    "isListening": "识别是否处于活动状态。",
    "isSpeaking": "麦克风当前是否听到语音。",
    "interimTranscript": "部分转录，无待处理内容时为空。",
    "volume": "监听期间麦克风音量，从 0 到 1。",
    "bands": "从低频到高频的频段音量，每个值从 0 到 1。",
    "rawBands": "校准前的相同频段。",
    "start": "开始识别。",
    "stop": "停止识别并等待最终转录。",
    "abort": "立即停止识别。",
    "toggle": "空闲时开始，监听时停止。"
  }
};
