// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'SelectorOption',
  subComponentOf: 'Selector',
  displayName: 'Selector Option',
  isHiddenFromOverview: true,
  description:
    'Helper component for custom item rendering inside an Selector renderOption prop.',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Primary label text for the item.',
      required: true,
    },
    {
      name: 'icon',
      type: 'IconType',
      description:
        'Icon displayed before the label. See `astryx docs icons` for valid semantic names.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Secondary description text displayed below the label.',
    },
    {
      name: 'layout',
      type: "'stacked' | 'inline'",
      description:
        "How the label and description sit together. 'stacked' puts the description on its own line; 'inline' keeps both on one line so the row fits a fixed-height host. Inside a Selector trigger the trigger's padding sizes itself to whichever layout you pick, so both land on the 4px rhythm; an InputGroup pins the row height and forces 'inline'.",
      default: "'stacked'",
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Additional content rendered after the label and description.',
    },
  ],
};

export const docsZh = {
  "name": "SelectorOption",
  "isHiddenFromOverview": true,
  "displayName": "Selector Option",
  "description": "用于在 Selector 的 renderOption 属性中自定义项渲染的辅助组件。",
  "props": [
    {
      "name": "label",
      "type": "ReactNode",
      "description": "该项的主标签文本。",
      "required": true
    },
    {
      "name": "icon",
      "type": "IconType",
      "description": "显示在标签之前的图标。有关有效的语义名称，请参阅 `astryx docs icons`。"
    },
    {
      "name": "description",
      "type": "ReactNode",
      "description": "显示在标签下方的次要描述文本。"
    },
    {
      "name": "endContent",
      "type": "ReactNode",
      "description": "在标签和描述之后渲染的附加内容。"
    }
  ],
  "propDescriptions": {
    "label": "该项的主标签文本。",
    "icon": "显示在标签之前的图标。有关有效的语义名称，请参阅 `astryx docs icons`。",
    "description": "显示在标签下方的次要描述文本。",
    "layout": "标签和描述如何组合在一起。'stacked' 将描述放在单独一行；'inline' 将两者保持在一行，使行适合固定高度的宿主。在 Selector 触发器内部，触发器的内边距会根据你选择的布局自行调整，因此两者都能落在 4px 节奏上；InputGroup 会固定行高并强制使用 'inline'。",
    "endContent": "在标签和描述之后渲染的附加内容。"
  }
};

export const docsDense = {
  name: 'SelectorOption',
  isHiddenFromOverview: true,
  displayName: 'Selector Option',
  description:
    'Helper component for custom item rendering inside Selector renderOption prop.',
  propDescriptions: {
    label: 'Primary label text for item.',
    icon: 'Icon displayed before label.',
    description: 'Secondary description text below label.',
    endContent: 'Additional content after label+description.',
  },
};
