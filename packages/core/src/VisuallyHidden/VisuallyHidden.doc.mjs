// Copyright (c) Meta Platforms, Inc. and affiliates.



/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'VisuallyHidden',
  displayName: 'VisuallyHidden',
  category: 'Utility',
  keywords: ["visually hidden","sr-only","screen reader","accessibility","a11y","aria-live","hidden label","assistive technology"],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content exposed to assistive technology while hidden from sight.',
    },
    {
      name: 'as',
      type: 'ElementType',
      description: 'HTML tag to render as. Use a block element for live regions.',
      default: "'span'",
    },
  ],
  usage: {
    description: 'Renders content in the accessibility tree while hiding it visually. Use for accessible names on icon-only controls, aria-live announcement regions, and supplementary screen-reader context. Deliberately has no styling props; the whole point is to stay invisible. `xstyle` is still accepted and ignored, only so code written against 0.7.2 keeps compiling; a planned minor removes it.',
    bestPractices: [
      { guidance: true, description: 'Use to give icon-only buttons and controls an accessible name that screen readers announce.' },
      { guidance: true, description: 'Render as a block element (as="div") with aria-live to announce dynamic updates like drag-and-drop or result counts.' },
      { guidance: false, description: 'Use it to hide content from everyone; it stays in the accessibility tree; use conditional rendering or `hidden` to remove content entirely.' },
      { guidance: false, description: 'Put interactive controls inside it; the content is not visible and cannot receive pointer input.' },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "VisuallyHidden",
  "displayName": "VisuallyHidden",
  "props": [
    {
      "name": "children",
      "type": "ReactNode",
      "description": "暴露给辅助技术但在视觉上隐藏的内容。"
    },
    {
      "name": "as",
      "type": "ElementType",
      "description": "要渲染的 HTML 标签。live region 请使用块级元素。",
      "default": "'span'"
    }
  ],
  "usage": {
    "description": "在无障碍树中渲染内容，同时在视觉上隐藏。用于纯图标控件的无障碍名称、aria-live 朗读区域以及补充的屏幕阅读器上下文。它刻意没有样式属性；其全部意义就是保持不可见。仍接受并忽略 `xstyle`，只是为了针对 0.7.2 编写的代码能继续编译；计划中的次版本将移除它。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于为纯图标按钮和控件提供屏幕阅读器可朗读的无障碍名称。"
      },
      {
        "guidance": true,
        "description": "以块级元素（`as=\"div\"`）配合 `aria-live` 渲染，以朗读拖放或结果计数等动态更新。"
      },
      {
        "guidance": false,
        "description": "不要用它对所有人隐藏内容；它仍留在无障碍树中；请使用条件渲染或 `hidden` 完全移除内容。"
      },
      {
        "guidance": false,
        "description": "不要在其中放置交互控件；内容不可见，也无法接收指针输入。"
      }
    ]
  },
  "propDescriptions": {
    "children": "暴露给辅助技术但在视觉上隐藏的内容。",
    "as": "要渲染的 HTML 标签。live region 请使用块级元素。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'renders content in the a11y tree while hiding it visually (sr-only)',
  usage: {
    description: 'Renders content in the accessibility tree while hiding it visually. Use for accessible names on icon-only controls, aria-live announcement regions, and supplementary screen-reader context.',
    bestPractices: [
      { guidance: true, description: 'Use to give icon-only buttons and controls an accessible name that screen readers announce.' },
      { guidance: true, description: 'Render as a block element (as="div") with aria-live to announce dynamic updates like drag-and-drop or result counts.' },
      { guidance: false, description: 'Use it to hide content from everyone; it stays in the accessibility tree; use conditional rendering or `hidden` to remove content entirely.' },
      { guidance: false, description: 'Put interactive controls inside it; the content is not visible and cannot receive pointer input.' },
    ],
  },
  propDescriptions: {
    children: 'content exposed to AT while visually hidden',
    as: 'HTML tag to render as; block element for live regions',
  },
};
