// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'RichTextEditorAutoLinkPlugin',
  subComponentOf: 'RichTextEditor',
  description:
    'Turns typed and pasted URLs and email addresses into links, in the plugins slot of RichTextEditor.',
  displayName: 'Rich Text Editor Auto-Link Plugin',
  keywords: ['richtext', 'autolink', 'link', 'url', 'email', 'plugin'],
  props: [
    {
      name: 'matchers',
      type: 'LinkMatcher[]',
      description:
        'Link matchers to use. The default recognizes URLs and email addresses and opens the links in a new tab. Build extra matchers with createLinkMatcherWithRegExp from @lexical/react/LexicalAutoLinkPlugin.',
      default: 'DEFAULT_LINK_MATCHERS',
    },
    {
      name: 'onChange',
      type: '(url: string | null, prevUrl: string | null) => void',
      description:
        'Called when auto-linking creates, updates or removes a link. It gets the new URL, or null when the link is removed, and the previous URL.',
    },
  ],
  usage: {
    description:
      "Turns typed and pasted URLs and email addresses into links. Text inside a code block stays code and is never linked. Render it in RichTextEditor's plugins slot; it reaches the editor through the editor's Lexical composer and uses AutoLinkNode, which the editor registers by default.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Pass it as plugins={<RichTextEditorAutoLinkPlugin />}. Its links open in a new tab, with target="_blank" and rel="noopener noreferrer" in the node.',
      },
      {
        guidance: false,
        description:
          "Render it outside RichTextEditor's plugins slot: it needs the editor's Lexical composer.",
      },
    ],
  },
};

export const docsZh = {
  "name": "RichTextEditorAutoLinkPlugin",
  "displayName": "Rich Text Editor Auto-Link Plugin",
  "description": "在 RichTextEditor 的 plugins 槽中，将输入和粘贴的 URL 及电子邮件地址转换为链接。",
  "usage": {
    "description": "将输入和粘贴的 URL 及电子邮件地址转换为链接。代码块内的文本保持为代码，绝不会转换为链接。在 RichTextEditor 的 plugins 槽中渲染它；它通过编辑器的 Lexical composer 访问编辑器，并使用编辑器默认注册的 AutoLinkNode。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "以 plugins={<RichTextEditorAutoLinkPlugin />} 传入。其链接会在新标签页中打开，节点中包含 target=\"_blank\" 和 rel=\"noopener noreferrer\"。"
      },
      {
        "guidance": false,
        "description": "将其渲染在 RichTextEditor 的 plugins 槽之外：它需要编辑器的 Lexical composer。"
      }
    ]
  },
  "propDescriptions": {
    "matchers": "要使用的链接匹配器。默认匹配器识别 URL 和电子邮件地址，并在新标签页中打开链接。可使用 @lexical/react/LexicalAutoLinkPlugin 中的 createLinkMatcherWithRegExp 构建额外匹配器。",
    "onChange": "自动链接创建、更新或移除链接时调用。它接收新 URL（链接被移除时为 null）和之前的 URL。"
  }
};
