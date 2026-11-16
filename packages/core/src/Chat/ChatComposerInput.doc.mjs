// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatComposerInput',
  subComponentOf: 'Chat',
  displayName: 'Chat Composer Input',
  isHiddenFromOverview: true,
  description:
    "Rich text input for the chat composer. Supports trigger menus (type @ or / to open a typeahead), inline tokens rendered as badges, message history recall with ArrowUp/Down, paste/drop file handling, and a 16px iOS font-size floor to prevent input zoom. Pass it to ChatComposer's input slot when you need more than a plain textarea.",
  usage: {
    description:
      "Pass ChatComposerInput to ChatComposer's input slot when the draft needs trigger menus, inline tokens, history recall, dictation insertion, or file intake.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Use handleRef for programmatic text or token insertion; inserted text follows the same onChange pipeline as typing.',
      },
      {
        guidance: true,
        description:
          'Use onFiles for files pasted or dropped onto the editor, and keep file validation and upload progress in the product layer.',
      },
      {
        guidance: false,
        description:
          'Use custom token rendering for ordinary mentions or commands; prefer the structured badge form so tokens remain predictable and themeable.',
      },
    ],
    anatomy: [
      {
        name: 'Input root',
        required: true,
        description:
          'The themed container that forwards the root ref and BaseProps styling seams.',
      },
      {
        name: 'Editable surface',
        required: true,
        description:
          'The labeled contenteditable textbox or combobox that owns text, selection, keyboard, paste, and drop behavior.',
      },
      {
        name: 'Placeholder',
        required: false,
        description:
          'Visual guidance shown only while the serialized draft is empty.',
      },
      {
        name: 'Trigger menu',
        required: false,
        description:
          'The suggestion popup rendered while a configured trigger is active.',
      },
      {
        name: 'Inline token',
        required: false,
        description:
          'A non-editable badge or custom rendering with a stable serialized value.',
      },
    ],
  },
  props: [
    {
      name: 'handleRef',
      type: 'React.Ref<ChatComposerInputHandle>',
      description:
        'Imperative handle for programmatic control: insertToken, expandToken, insertText, focus, and getValue.',
    },
    {
      name: 'value',
      type: 'string',
      description:
        'Controlled input value. Pair with onChange for two-way binding.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description:
        'Called when the input value changes. The serialized string includes token placeholders.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text shown when the input is empty.',
      default: "'Type a message...'",
    },
    {
      name: 'maxRows',
      type: 'number',
      description:
        'Maximum visible rows before the input scrolls. Use a lower value in compact layouts.',
      default: '8',
    },
    {
      name: 'triggers',
      type: 'ChatComposerTrigger[]',
      description:
        'Trigger definitions for typeahead menus. Each trigger specifies a character (@ or /), a search source, and an onSelect handler that returns the token to insert. Set hasMultiWordQuery: true when suggestions contain spaces (people, topics): the query then runs to a line break or about 64 characters instead of ending at the first space. Per-trigger emptySearchText (ReactNode) is the message when the query matched nothing.',
    },
    {
      name: 'debounceMs',
      type: 'number',
      description:
        'Debounce delay for async search sources to avoid excessive network requests.',
      default: '150',
    },
    {
      name: 'hasHistory',
      type: 'boolean',
      description:
        'Enable ArrowUp/Down to recall previously submitted messages.',
      default: 'true',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label announced by screen readers.',
      default: "'Message input'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Disables the input. Use during streaming or when a prerequisite is unmet.',
      default: 'false',
    },
    {
      name: 'onPaste',
      type: '(event, text) => boolean | void',
      description:
        'Called when plain text is pasted. Return true after handling the text yourself; otherwise ChatComposerInput inserts it or applies paste-as-token behavior.',
    },
    {
      name: 'pasteAsToken',
      type: 'UseChatPasteAsTokenReturn | false',
      description:
        'Paste-as-token behavior. By default, plain-text pastes over 200 characters become expandable tokens. Pass false to keep every text paste inline, or provide useChatPasteAsToken() to customize the conversion.',
    },
    {
      name: 'onFiles',
      type: '(files: File[]) => void',
      description:
        'Called when files are pasted or dropped onto the input. Use to handle attachments.',
    },
    {
      name: 'onSubmit',
      type: '(value: string) => void',
      description:
        'Called when the user presses Enter without Shift. The serialized value includes token placeholders.',
    },
    {
      name: 'onKeyDown',
      type: '(event) => void',
      description:
        'Key-down handler invoked before the built-in Enter/history behavior (after any open trigger menu). The seam for platform-specific keys: call event.preventDefault() to suppress the default submit (e.g. newline on a touch keyboard), or act on the event yourself to add behavior (e.g. submit on Cmd/Ctrl+Enter). IME composition is always respected; Enter never submits mid-composition.',
    },
    {
      name: 'enterKeyHint',
      type: "'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'",
      description:
        'What the Return key of a touch keyboard says (the native enterkeyhint). Enter sends the message, so it defaults to send and iOS shows its Send key. When onKeyDown makes Enter insert a line break on touch keyboards, pass enter so the key shows Return again.',
      default: "'send'",
    },
  ],
};

export const docsZh = {
  "name": "ChatComposerInput",
  "isHiddenFromOverview": true,
  "displayName": "Chat Composer Input",
  "description": "聊天输入区（composer）的富文本输入框。支持触发菜单（输入 @ 或 / 打开 typeahead）、以内联徽标渲染的令牌、用 ArrowUp/Down 回溯消息历史、粘贴/拖放文件处理，以及 16px 的 iOS 字号下限以防止输入时缩放。当你需要的功能超出普通 textarea 时，将它传入 ChatComposer 的 input 插槽。",
  "propDescriptions": {
    "handleRef": "用于编程控制的命令式句柄：insertToken、expandToken、insertText、focus 和 getValue。",
    "value": "受控的输入值。与 onChange 搭配实现双向绑定。",
    "onChange": "输入值变化时调用。序列化字符串包含令牌占位符。",
    "placeholder": "输入为空时显示的占位文本。",
    "maxRows": "输入框滚动前最多可见的行数。在紧凑布局中使用较小的值。",
    "triggers": "typeahead 菜单的触发器定义。每个触发器指定一个字符（@ 或 /）、一个搜索源，以及返回待插入令牌的 onSelect 处理器。当建议项包含空格（人名、主题）时，设置 `hasMultiWordQuery: true`：此时查询会一直延伸到换行或约 64 个字符，而不是在第一个空格处结束。每个触发器可设置 `emptySearchText`（ReactNode），作为查询无匹配时的提示消息。",
    "debounceMs": "异步搜索源的防抖延迟，用于避免过多的网络请求。",
    "hasHistory": "启用 ArrowUp/Down 回溯此前提交的消息。",
    "label": "由屏幕阅读器朗读的可访问标签。",
    "isDisabled": "禁用输入框。在流式传输期间或前提条件未满足时使用。",
    "onPaste": "粘贴纯文本时调用。自行处理文本后返回 true；否则由 ChatComposerInput 插入文本或应用“粘贴为令牌”行为。",
    "pasteAsToken": "“粘贴为令牌”行为。默认情况下，超过 200 个字符的纯文本粘贴会变为可展开令牌。传入 false 可让所有文本粘贴保持内联，或提供 `useChatPasteAsToken()` 自定义转换。",
    "onFiles": "文件被粘贴或拖放到输入框时调用。用于处理附件。",
    "onSubmit": "用户按下不带 Shift 的 Enter 时调用。序列化值包含令牌占位符。",
    "onKeyDown": "在内置 Enter/历史行为之前（任何打开的触发菜单之后）调用的按键处理函数。这是处理平台特定按键的接缝：调用 `event.preventDefault()` 可抑制默认提交（例如触摸键盘上的换行），或自行处理事件以添加行为（例如按 Cmd/Ctrl+Enter 提交）。始终尊重 IME 组合输入；组合过程中 Enter 绝不会提交。",
    "enterKeyHint": "触摸键盘上 Return 键的显示文案（原生 enterkeyhint）。Enter 用于发送消息，因此默认值为 `send`，iOS 会显示其 Send 键。当 onKeyDown 让 Enter 在触摸键盘上插入换行时，传入 `enter`，使该键重新显示 Return。"
  },
  "usage": {
    "description": "当草稿需要触发菜单、内联令牌、历史回溯、听写插入或文件接收时，将 ChatComposerInput 传入 ChatComposer 的 input 插槽。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "使用 `handleRef` 以编程方式插入文本或令牌；插入的文本与手动输入走相同的 onChange 流程。"
      },
      {
        "guidance": true,
        "description": "使用 `onFiles` 处理粘贴或拖放到编辑器上的文件，并把文件校验与上传进度保留在产品层。"
      },
      {
        "guidance": false,
        "description": "不要对普通提及或命令使用自定义令牌渲染；优先使用结构化徽标形式，使令牌保持可预期且可主题化。"
      }
    ],
    "anatomy": [
      {
        "name": "输入根元素",
        "required": true,
        "description": "应用主题的容器，转发根 ref 和 BaseProps 样式接缝。"
      },
      {
        "name": "可编辑表面",
        "required": true,
        "description": "带标签的 contenteditable 文本框或组合框，负责文本、选区、键盘、粘贴和拖放行为。"
      },
      {
        "name": "占位符",
        "required": false,
        "description": "仅在序列化草稿为空时显示的视觉提示。"
      },
      {
        "name": "触发菜单",
        "required": false,
        "description": "配置的触发器激活时渲染的建议弹窗。"
      },
      {
        "name": "内联令牌",
        "required": false,
        "description": "不可编辑的徽标或自定义渲染，具有稳定的序列化值。"
      }
    ]
  }
};

export const docsDense = {
  name: 'ChatComposerInput',
  isHiddenFromOverview: true,
  displayName: 'Chat Composer Input',
  description:
    'rich input for composer; trigger menus (@/commands), inline tokens, msg history, paste/drop files, 16px iOS font-size floor to prevent zoom. Use in ChatComposer input slot when you need more than plain textarea.',
  propDescriptions: {
    handleRef:
      'imperative handle (insertToken/expandToken/insertText/focus/getValue)',
    value: 'controlled value; pair w/ onChange for two-way binding',
    onChange:
      'value change handler; serialized string includes token placeholders',
    placeholder: 'placeholder when empty',
    maxRows: 'max visible rows before scroll; lower for compact layouts',
    triggers:
      'typeahead trigger defs; character(@/)+searchSource+onSelect returning token; emptySearchText (ReactNode) for no matches',
    debounceMs: 'debounce for async search to avoid excess requests',
    hasHistory: 'ArrowUp/Down to recall previous submissions',
    label: 'a11y label for screen readers',
    isDisabled: 'disabled; use during streaming or unmet prereqs',
    onPaste:
      'plain-text paste callback; return true when handled, otherwise built-in token/plain insertion runs',
    pasteAsToken:
      'paste-as-token behavior; >200 chars by default, false for inline-only, or custom useChatPasteAsToken() result',
    onFiles: 'file paste/drop handler; use for attachments',
    onSubmit:
      'Enter w/o Shift handler; serialized value includes token placeholders',
    onKeyDown:
      'keydown handler before built-in Enter/history (after trigger menu); preventDefault() to suppress default submit (touch newline) or act on event to add behavior (Cmd/Ctrl+Enter). IME composition always respected',
    enterKeyHint:
      'touch keyboard Return key label (enterkeyhint); default send since Enter sends; pass enter when onKeyDown makes Enter a newline on touch',
  },
};
