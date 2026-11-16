// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'CodeEditor',
  displayName: 'Code Editor',
  group: 'CodeEditor',
  category: 'Form Controls',
  keywords: ['code', 'editor', 'syntax', 'highlight', 'input', 'textarea'],

  usage: {
    description:
      'Editable code component with real-time syntax highlighting using the CSS Custom Highlight API. Supports line numbers, read-only state, placeholder text, and custom tokenizers.',
  },

  props: [
    {
      name: 'value',
      type: 'string',
      description: 'Controlled string value for the editor.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Callback fired when the code content changes.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the editable region (aria-label).',
      required: true,
    },
    {
      name: 'language',
      type: 'string',
      description: 'Programming language for syntax highlighting.',
      default: "'plaintext'",
    },
    {
      name: 'hasLineNumbers',
      type: 'boolean',
      description: 'Display line number gutter on the left.',
      default: 'false',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description: 'Renders the editor in a read-only state.',
      default: 'false',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text displayed when value is empty.',
    },
    {
      name: 'maxHeight',
      type: 'number | string',
      description: 'Maximum container height before internal scrolling.',
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      description: 'Font size variant for the code text.',
      default: "'md'",
    },
    {
      name: 'tokenizer',
      type: '(code: string, language: string) => TokenLine[]',
      description: 'Custom tokenizer function override for language parsing.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization.',
    },
  ],
};

export const docsZh = {
  "name": "CodeEditor",
  "displayName": "Code Editor",
  "usage": {
    "description": "可编辑的代码组件，使用 CSS Custom Highlight API 实现实时语法高亮。支持行号、只读状态、占位文本和自定义分词器。"
  },
  "propDescriptions": {
    "value": "编辑器的受控字符串值。",
    "onChange": "代码内容变化时触发的回调。",
    "label": "可编辑区域的无障碍标签（aria-label）。",
    "language": "用于语法高亮的编程语言。",
    "hasLineNumbers": "在左侧显示行号栏。",
    "isReadOnly": "以只读状态渲染编辑器。",
    "placeholder": "当值为空时显示的占位文本。",
    "maxHeight": "内部滚动前的最大容器高度。",
    "size": "代码文本的字号变体。",
    "tokenizer": "用于语言解析的自定义分词器函数覆盖。",
    "xstyle": "用于布局自定义的 StyleX 样式。"
  }
};
