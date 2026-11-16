// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatEmojiPicker',
  subComponentOf: 'Chat',
  group: 'Chat',
  category: 'Chat',
  displayName: 'Chat Emoji Picker',
  description: 'Popover emoji grid wrapping a trigger button: a shortname filter input over an 8-column grid with arrow-key roving focus. Picking an emoji calls onSelect and closes the popover, restoring focus to the trigger. Ships with a small default emoji set; override via emojis.',
  props: [
    {
      name: 'onSelect',
      type: '(emoji: string) => void',
      description: 'Called with the picked emoji character. The popover closes itself after selection.',
      required: true,
    },
    {
      name: 'emojis',
      type: 'readonly {emoji: string; name: string}[]',
      description: 'Emoji options rendered in the grid, 8 per row. name drives filtering and accessible labels.',
      default: 'DEFAULT_CHAT_EMOJIS',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the popover dialog.',
      default: "'Pick an emoji'",
    },
    {
      name: 'searchLabel',
      type: 'string',
      description: 'Placeholder and hidden label for the filter input.',
      default: "'Search emoji'",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Trigger element. Must contain a button; the popover wires up click handlers and ARIA automatically.',
      required: true,
    },
  ],
};

export const docsZh = {
  "name": "ChatEmojiPicker",
  "displayName": "Chat Emoji Picker",
  "description": "包裹触发按钮的弹出式表情网格：短名称筛选输入框位于 8 列网格上方，支持方向键漫游焦点。选择表情会调用 onSelect 并关闭弹出层，同时将焦点返回触发器。内置一小套默认表情；可通过 emojis 覆盖。",
  "propDescriptions": {
    "onSelect": "以选中的表情字符调用。选择后弹出层会自动关闭。",
    "emojis": "在网格中渲染的表情选项，每行 8 个。name 用于驱动筛选和可访问标签。",
    "label": "弹出对话框的可访问标签。",
    "searchLabel": "筛选输入框的占位符和隐藏标签。",
    "children": "触发元素。必须包含一个按钮；弹出层会自动接好点击处理程序和 ARIA。"
  }
};

export const docsDense = {
  name: 'ChatEmojiPicker',
  displayName: 'Chat Emoji Picker',
  description: 'popover emoji grid on a trigger button; shortname filter + 8-col arrow-key nav; onSelect closes + restores focus; DEFAULT_CHAT_EMOJIS overridable',
  propDescriptions: {
    onSelect: '(emoji)=>void; closes popover',
    emojis: '{emoji,name}[] grid options, 8/row; name drives filter + aria',
    label: 'popover dialog aria label',
    searchLabel: 'filter input placeholder + hidden label',
    children: 'trigger element containing a button',
  },
};
