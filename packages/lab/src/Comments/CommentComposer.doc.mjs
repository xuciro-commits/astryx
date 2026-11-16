// Copyright (c) Meta Platforms, Inc. and affiliates.

// @ts-check

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'CommentComposer',
  displayName: 'Comment Composer',
  group: 'Comments',
  category: 'Chat',
  keywords: ['comment box', 'comment input', 'reply box', 'composer'],
  description:
    'A comment composer: an input that grows to five lines, with typeahead triggers and pasted or dropped images, above attach and emoji buttons and Post. Controlled: your app owns the draft.',
  usage: {
    description:
      'A comment composer writes a new comment. Use it where comments start outside a Comments panel, such as a new margin comment on a text selection. Comments and CommentThread use it for new comments, replies, and edits.',
    anatomy: [
      {
        name: 'Quoted passage',
        required: false,
        description:
          'The passage a new inline comment attaches to, in a muted card above the input.',
      },
      {
        name: 'Input',
        required: true,
        description:
          'Grows with its text to five lines. Enter posts; Shift+Enter adds a line.',
      },
      {
        name: 'Footer',
        required: true,
        description:
          'Attach images (with `onUploadImages`), Add emoji, your `controls`, then Post at the end.',
      },
    ],
    bestPractices: [
      {
        guidance: true,
        description:
          'Clear the draft once the comment posts, and keep it when posting fails: show `error` with `onRetry`.',
      },
      {
        guidance: true,
        description:
          'Name the input for its context with `label` when the placeholder alone would be vague, such as "Reply to Maya Chen".',
      },
      {
        guidance: false,
        description:
          'Disable the composer while posting. Pass `isSubmitting`: the input keeps focus, and Post stays focusable but refuses a second press.',
      },
      {
        guidance: false,
        description:
          'Put long instructions in the placeholder. It disappears as the viewer types; keep guidance in surrounding text.',
      },
    ],
  },
  props: [
    {
      name: 'value',
      type: 'string',
      required: true,
      description: 'The draft, controlled.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      required: true,
      description:
        'Called with the new draft as the viewer types, picks an emoji, or uploads an image.',
    },
    {
      name: 'onSubmit',
      type: '(value: string) => void',
      required: true,
      description:
        'Posts the draft from Enter or Post. Empty drafts never post.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description:
        'Placeholder, and the input’s accessible name unless `label` is set. Defaults to the localized "Write a comment…".',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible name of the input.',
    },
    {
      name: 'isSubmitting',
      type: 'boolean',
      default: 'false',
      description:
        'Holds the attach and emoji buttons while a post is in flight, and makes Post refuse a second press. The composer reports busy.',
    },
    {
      name: 'error',
      type: 'string',
      description: 'Shows an error Banner above the composer.',
    },
    {
      name: 'onRetry',
      type: '() => void',
      description: 'Adds Retry to the `error` Banner.',
    },
    {
      name: 'anchor',
      type: 'CommentAnchor',
      description:
        'The passage a new inline comment attaches to, quoted above the input.',
    },
    {
      name: 'onAnchorDismiss',
      type: '() => void',
      description:
        'Adds Remove quoted text to the quoted passage; clear `anchor` when it is called.',
    },
    {
      name: 'highlightColor',
      type: "'blue' | 'cyan' | 'gray' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow'",
      default: "'yellow'",
      description:
        'The palette color your app highlights passages in; the quote draws its rule in it.',
    },
    {
      name: 'onUploadImages',
      type: '(files: readonly File[]) => CommentUploadedImage[] | Promise<CommentUploadedImage[]>',
      description:
        'Uploads attached, pasted, or dropped images and appends them to the draft as Markdown. Adds the attach button.',
    },
    {
      name: 'triggers',
      type: 'readonly ChatComposerTrigger[]',
      description: 'Typeahead triggers, such as an `@` people search.',
    },
    {
      name: 'agentCommands',
      type: 'readonly CommentAgentCommand[]',
      description: 'Agents the comment can address: typing `/` lists them.',
    },
    {
      name: 'hasEmojiPicker',
      type: 'boolean',
      default: 'true',
      description: 'Whether the Add emoji button shows.',
    },
    {
      name: 'controls',
      type: 'ReactNode',
      description: 'Product-owned controls after the attach and emoji buttons.',
    },
  ],
  examples: [
    {
      label: 'New comment',
      code: `import {useState} from 'react';
import {CommentComposer} from '@astryxdesign/lab';

export default function Example() {
  const [draft, setDraft] = useState('');
  return (
    <CommentComposer
      value={draft}
      onChange={setDraft}
      onSubmit={body => {
        post(body);
        setDraft('');
      }}
    />
  );
}`,
    },
  ],
};

export const docsZh = {
  "name": "CommentComposer",
  "displayName": "Comment Composer",
  "description": "评论撰写器：一个最多增长到五行的输入框，支持输入联想触发器和粘贴或拖放的图片，下方是附件和表情按钮以及 Post。受控：草稿由你的应用持有。",
  "usage": {
    "description": "评论撰写器用于撰写新评论。当评论在 Comments 面板之外开始（例如在文本选区上新建行内评论）时使用它。Comments 和 CommentThread 会用它处理新评论、回复和编辑。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "评论发布后清除草稿，发布失败时保留草稿：显示 `error` 并提供 `onRetry`。"
      },
      {
        "guidance": true,
        "description": "当仅靠 placeholder 会含义不清时，用 `label` 为输入框按上下文命名，例如 “Reply to Maya Chen”。"
      },
      {
        "guidance": false,
        "description": "不要在发布期间禁用撰写器。传入 `isSubmitting`：输入框保持焦点，Post 仍可聚焦但会拒绝第二次按下。"
      },
      {
        "guidance": false,
        "description": "不要把长说明放在 placeholder 中。它会随着查看者输入而消失；请将指引放在周围文本中。"
      }
    ],
    "anatomy": [
      {
        "name": "引用段落",
        "required": false,
        "description": "新行内评论所附加的段落，显示在输入框上方的弱化卡片中。"
      },
      {
        "name": "输入框",
        "required": true,
        "description": "随文本增长到五行。按 Enter 发布；Shift+Enter 换行。"
      },
      {
        "name": "页脚",
        "required": true,
        "description": "附加图片（使用 `onUploadImages`）、Add emoji、你的 `controls`，最后是 Post。"
      }
    ]
  },
  "propDescriptions": {
    "value": "受控的草稿。",
    "onChange": "当查看者输入、选择表情或上传图片时，以新草稿调用。",
    "onSubmit": "通过 Enter 或 Post 发布草稿。空草稿永远不会发布。",
    "placeholder": "占位文本，也是输入框的无障碍名称（除非设置了 `label`）。默认为本地化的 “Write a comment…”。",
    "label": "输入框的无障碍名称。",
    "isSubmitting": "在发布请求进行期间保持附件和表情按钮，并让 Post 拒绝第二次按下。撰写器会报告繁忙状态。",
    "error": "在撰写器上方显示错误 Banner。",
    "onRetry": "为 `error` Banner 添加 Retry。",
    "anchor": "新行内评论所附加的段落，会引用在输入框上方。",
    "onAnchorDismiss": "为引用段落添加 Remove quoted text；调用时应清除 `anchor`。",
    "highlightColor": "你的应用用于高亮段落的调色板颜色；引用会用它来绘制其标线。",
    "onUploadImages": "上传附加、粘贴或拖放的图片，并将其作为 Markdown 追加到草稿中。会添加附件按钮。",
    "triggers": "输入联想触发器，例如 `@` 人员搜索。",
    "agentCommands": "评论可以面向的代理：输入 `/` 会列出它们。",
    "hasEmojiPicker": "是否显示 Add emoji 按钮。",
    "controls": "附件和表情按钮之后由产品拥有的控件。"
  }
};
