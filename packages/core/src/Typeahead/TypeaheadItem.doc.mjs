// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TypeaheadItem',
  subComponentOf: 'Typeahead',
  displayName: 'Typeahead Item',
  description:
    'Default dropdown item renderer for typeahead results. Shows label with optional icon, description, and avatar. Exported for use in custom renderItem implementations.',
  props: [
    {
      name: 'item',
      type: 'SearchableItem',
      description: 'The search result item to render.',
      required: true,
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Icon or avatar to display before the label.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'check',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'string',
      description: 'Description text displayed below the label.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether this item is visually disabled.',
      default: 'false',
    },
    {
      name: 'group',
      type: 'string',
      description:
        'This prop has no effect. Set `item.auxiliaryData.group` on search-source items to group results in Typeahead or BaseTypeahead.',
    },
  ],
};

export const docsZh = {
  "name": "TypeaheadItem",
  "displayName": "Typeahead Item",
  "description": "typeahead 结果的默认下拉项渲染器。显示带可选图标、描述和头像的标签。导出以供自定义 `renderItem` 实现使用。",
  "props": [
    {
      "name": "item",
      "type": "SearchableItem",
      "description": "要渲染的搜索结果项。",
      "required": true
    },
    {
      "name": "icon",
      "type": "ReactNode",
      "description": "显示在标签之前的图标或头像。"
    },
    {
      "name": "description",
      "type": "string",
      "description": "显示在标签下方的描述文本。"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "此项是否在视觉上禁用。",
      "default": "false"
    },
    {
      "name": "group",
      "type": "string",
      "description": "此属性没有效果。在搜索源项上设置 `item.auxiliaryData.group`，以便在 Typeahead 或 BaseTypeahead 中对结果分组。"
    }
  ],
  "propDescriptions": {
    "item": "要渲染的搜索结果项。",
    "icon": "显示在标签之前的图标或头像。",
    "description": "显示在标签下方的描述文本。",
    "isDisabled": "此项是否在视觉上禁用。",
    "group": "此属性没有效果。在搜索源项上设置 `item.auxiliaryData.group`，以便在 Typeahead 或 BaseTypeahead 中对结果分组。"
  }
};

export const docsDense = {
  name: 'TypeaheadItem',
  displayName: 'Typeahead Item',
  description:
    'Default dropdown item renderer. Label w/ optional icon, description, avatar. Exported for custom renderItem.',
  propDescriptions: {
    item: 'Search result item to render.',
    icon: 'Icon/avatar before label.',
    description: 'Text below label.',
    isDisabled: 'Visually disabled.',
    group:
      'No effect. Group results via `item.auxiliaryData.group` in the search source.',
  },
};
