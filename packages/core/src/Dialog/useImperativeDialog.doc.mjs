// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'useImperativeDialog',
  subComponentOf: 'Dialog',
  displayName: 'useImperativeDialog',
  description: 'Hook for showing a dialog without managing open state. Call dialog.show(content, options) to open and dialog.hide() to close. Render dialog.element in your JSX tree.',
  props: [
    {
      name: 'show',
      type: '(content: ReactNode, options?: DialogOptions) => void',
      description: 'Show the dialog with the given content. Options are the same as Dialog props minus isOpen/onOpenChange/children.',
    },
    {
      name: 'hide',
      type: '() => void',
      description: 'Hide the dialog.',
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Whether the dialog is currently open.',
    },
    {
      name: 'element',
      type: 'ReactNode',
      description: 'The dialog element: render this in your JSX tree.',
    },
  ],
};

export const docsDense = {
  name: 'useImperativeDialog',
  description: 'hook to show a dialog w/o managing open state; call dialog.show(content, options) to open + dialog.hide() to close; render dialog.element in your JSX tree',
  propDescriptions: {
    show: 'show the dialog with given content; options = Dialog props minus isOpen/onOpenChange/children',
    hide: 'hide the dialog',
    isOpen: 'whether the dialog is currently open',
    element: 'the dialog element: render this in your JSX tree',
  },
};

export const docsZh = {
  "name": "useImperativeDialog",
  "description": "用于在不管理打开状态的情况下显示对话框的 Hook。调用 `dialog.show(content, options)` 打开，调用 `dialog.hide()` 关闭。在 JSX 树中渲染 `dialog.element`。",
  "propDescriptions": {
    "show": "使用给定内容显示对话框。选项与 Dialog 的属性相同，但不包括 isOpen/onOpenChange/children。",
    "hide": "隐藏对话框。",
    "isOpen": "对话框当前是否打开。",
    "element": "对话框元素：在 JSX 树中渲染此项。"
  }
};
