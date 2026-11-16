// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TabBarMoreList',
  displayName: 'Tab Bar More List',
  category: 'Navigation',
  keywords: ['more tab', 'more list', 'overflow tabs', 'tab bar', 'more'],
  description:
    "The More tab's screen, as on iOS: one row per tab past the fourth, with its icon, its label and a disclosure chevron. Give it the same TabBarItem children as TabBar, and render it while TabBar's value is its moreValue. A disabled tab's row is disabled too. Rearranging the tabs (iOS's Edit) is not available yet. Experimental: lands in lab first.",
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The same TabBarItem elements given to TabBar.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description:
        "Called with a row's value when it is chosen: show that section inside More, which stays selected in the bar.",
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: "The selected tab's value: its row reads as selected.",
    },
  ],
  usage: {
    description:
      "Render TabBarMoreList as the More tab's screen while TabBar's value is its moreValue, with the same TabBarItem children. Show a section chosen there inside More's own navigation stack.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Give it the same tabs, in the same order, as the TabBar it belongs to.',
      },
      {
        guidance: false,
        description:
          "Don't use it as a general menu or list; use List for those.",
      },
    ],
  },
};

export const docsZh = {
  "name": "TabBarMoreList",
  "displayName": "Tab Bar More List",
  "description": "iOS 风格“更多”标签页的屏幕：第四个之后的每个标签各占一行，包含图标、标签和展开箭头。给它传入与 TabBar 相同的 TabBarItem 子元素，并在 TabBar 的 value 为其 moreValue 时渲染。禁用的标签对应的行也会禁用。暂不支持重新排列标签（iOS 的“编辑”功能）。实验性功能：先在 lab 中发布。",
  "usage": {
    "description": "在 TabBar 的 value 为其 moreValue 时，将 TabBarMoreList 渲染为“更多”标签页的屏幕，并传入相同的 TabBarItem 子元素。在此处选择的栏目应显示在“更多”自己的导航栈内。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "传入与其所属 TabBar 相同的标签，并保持相同顺序。"
      },
      {
        "guidance": false,
        "description": "不要将其用作通用菜单或列表；这些场景请使用 List。"
      }
    ]
  },
  "propDescriptions": {
    "children": "传给 TabBar 的相同 TabBarItem 元素。",
    "onChange": "选择某行时以其 value 调用：在“更多”中显示该栏目，而“更多”在标签栏中保持选中。",
    "value": "所选标签的 value：对应行会显示为选中状态。"
  }
};
