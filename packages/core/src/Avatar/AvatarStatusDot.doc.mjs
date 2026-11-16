// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'AvatarStatusDot',
  subComponentOf: 'Avatar',
  displayName: 'Avatar Status Dot',
  isHiddenFromOverview: true,
  description:
    'Size-aware status indicator dot that reads avatar size from context and scales proportionally. Each variant pairs a colour with a distinct built-in shape (filled, ring, minus) so status is never conveyed by colour alone (WCAG 1.4.1).',
  props: [
    {
      name: 'variant',
      type: "'success' | 'neutral' | 'error'",
      description:
        'Semantic variant pairing colour with a distinct shape: success = filled green dot, neutral = grey ring, error = red dot with a minus bar.',
      default: "'success'",
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible label describing the status. Inside an Avatar it is composed into the avatar\'s accessible name (e.g. "Jane Doe, Online"); the Avatar root is role="img", which prunes child semantics, so the composed name is how the status reaches assistive tech. Standalone dots expose role="img" with this label directly.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description:
        'Icon centered inside the dot (hidden at tiny sizes). A rendered icon replaces the built-in shape glyph, so use a different icon per status.',
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
  ],
};

export const docsZh = {
  "name": "AvatarStatusDot",
  "isHiddenFromOverview": true,
  "displayName": "Avatar Status Dot",
  "description": "能感知尺寸的状态指示点，从上下文读取头像尺寸并按比例缩放。每个变体都将颜色与一种内置的独特形状（实心、圆环、减号）配对，因此状态绝不只靠颜色传达（WCAG 1.4.1）。",
  "props": [
    {
      "name": "variant",
      "type": "'success' | 'neutral' | 'error'",
      "description": "语义变体，将颜色与独特形状配对：success = 实心绿点，neutral = 灰色圆环，error = 带减号横条的红色圆点。",
      "default": "'success'"
    },
    {
      "name": "label",
      "type": "string",
      "description": "描述状态的无障碍标签。在 Avatar 内部，它会被组合进头像的无障碍名称（例如 \"Jane Doe, Online\"）；Avatar 根元素为 role=\"img\"，会剪除子元素的语义，因此组合后的名称是状态传达给辅助技术的途径。独立使用状态点时，会直接以该标签暴露 role=\"img\"。"
    },
    {
      "name": "icon",
      "type": "ReactNode",
      "description": "居中显示在圆点内的图标（极小尺寸下隐藏）。渲染的图标会替换内置形状字形，因此请为每种状态使用不同的图标。"
    }
  ],
  "propDescriptions": {
    "variant": "语义变体，将颜色与独特形状配对：success = 实心绿点，neutral = 灰色圆环，error = 带减号横条的红色圆点。",
    "label": "描述状态的无障碍标签。在 Avatar 内部，它会被组合进头像的无障碍名称（例如 \"Jane Doe, Online\"）；Avatar 根元素为 role=\"img\"，会剪除子元素的语义，因此组合后的名称是状态传达给辅助技术的途径。独立使用状态点时，会直接以该标签暴露 role=\"img\"。",
    "icon": "居中显示在圆点内的图标（极小尺寸下隐藏）。渲染的图标会替换内置形状字形，因此请为每种状态使用不同的图标。"
  }
};

export const docsDense = {
  name: 'AvatarStatusDot',
  isHiddenFromOverview: true,
  displayName: 'Avatar Status Dot',
  description:
    'size-aware status dot, reads avatar size from context + scales proportionally; variants pair colour with shape (filled/ring/minus) per WCAG 1.4.1',
  propDescriptions: {
    variant:
      'colour + shape variant: success filled, neutral ring, error minus',
    label:
      'accessible status label; composed into the Avatar accessible name ("Jane Doe, Online"); standalone dots expose role="img" with it directly',
    icon: 'icon centered in dot (hidden at tiny sizes); replaces the built-in shape glyph, so differ it per status',
  },
};
