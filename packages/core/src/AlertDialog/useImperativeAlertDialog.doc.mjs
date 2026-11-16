// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'useImperativeAlertDialog',
  subComponentOf: 'AlertDialog',
  displayName: 'useImperativeAlertDialog',
  description: 'Hook for showing an alert dialog without managing open state. Call alert.show(options) to open and alert.hide() to close. Render alert.element in your JSX tree.',
  props: [
    {
      name: 'show',
      type: '(options: AlertDialogOptions) => void',
      description: 'Show the alert dialog with the given options. Options are the same as AlertDialog props minus isOpen/onOpenChange.',
    },
    {
      name: 'hide',
      type: '() => void',
      description: 'Hide the alert dialog.',
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
  name: 'useImperativeAlertDialog',
  description: 'Hook to show alert dialog w/o managing open state. Call alert.show(options) to open, alert.hide() to close; render alert.element in JSX tree.',
  propDescriptions: {
    show: 'show dialog w/ options; same as AlertDialog props minus isOpen/onOpenChange',
    hide: 'hide dialog',
    isOpen: 'dialog currently open?',
    element: 'dialog element: render in JSX tree',
  },
};

export const docsZh = {
  "name": "useImperativeAlertDialog",
  "description": "用于显示警告对话框而无需管理打开状态的 Hook。调用 alert.show(options) 打开，调用 alert.hide() 关闭。在 JSX 树中渲染 alert.element。",
  "propDescriptions": {
    "show": "使用给定选项显示警告对话框。选项与 AlertDialog 的属性相同，但去掉 isOpen/onOpenChange。",
    "hide": "隐藏警告对话框。",
    "isOpen": "对话框当前是否打开。",
    "element": "对话框元素：在 JSX 树中渲染它。"
  }
};
