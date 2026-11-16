// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file DrawerHeader.doc.mjs
 * @input DrawerHeader props, anatomy, theming targets, and examples
 * @output Consumer documentation for DrawerHeader, a sub-component of Drawer
 * @position CLI and docsite metadata for the Drawer header; runnable docsite demos live in packages/cli/assets/templates/blocks/components/DrawerHeader
 */

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'DrawerHeader',
  subComponentOf: 'Drawer',
  displayName: 'Drawer Header',
  // Keeps the registry route DrawerHeader had as a canary-only Lab component.
  registry: {aliases: ['lab/drawer-header']},
  isHiddenFromOverview: true,
  description:
    'Header for drawers with a title, optional subtitle, close button, and start/end content slots. Same API as DialogHeader.',
  usage: {
    description:
      'Compose DrawerHeader in the header slot of a Layout inside the Drawer, as DialogHeader is composed in Dialog, for a title row and, when you pass onOpenChange, a close button. The Layout keeps the header on the drawer inset instead of padding it twice. Drawer renders no close button of its own. Unlike DialogHeader it does not take focus on open (Drawer uses data-autofocus) and does not name the drawer (Drawer label does).',
    anatomy: [
      {
        name: 'Header row',
        required: true,
        description:
          'Arranges the title block, optional start/end content, and close control.',
      },
      {
        name: 'Start content',
        required: false,
        description: 'Wraps optional leading content.',
      },
      {
        name: 'Title block',
        required: true,
        description: 'Groups the title and optional subtitle.',
      },
      {
        name: 'End content',
        required: false,
        description:
          'Groups optional trailing content with the optional close control.',
      },
      {
        name: 'Close icon',
        required: false,
        description: 'Visual close glyph inside the close button.',
      },
    ],
  },
  props: [
    {
      name: 'title',
      type: 'ReactNode',
      description:
        'Drawer title, rendered as an h2. Keep it inline and non-interactive. It does not name the drawer; pass Drawer a label.',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'ReactNode',
      description:
        'Subtitle below the title. Accepts inline content such as a Link; avoid block elements.',
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => unknown',
      description:
        "Close button callback, called with false (no button if omitted). Pass the Drawer's own onOpenChange.",
    },
    {
      name: 'startContent',
      type: 'ReactNode',
      description: 'Content before the title (e.g., a back button).',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description: 'Content after the title, before the close button.',
    },
    {
      name: 'endContentEdgeCompensation',
      type: "'inline' | 'block' | 'all'",
      description:
        'Selects compensation axes for the end-content slot. Omit to preserve automatic close-action compensation.',
    },
    {
      name: 'hasDivider',
      type: 'boolean',
      description:
        "Adds a border at the bottom edge. Defaults to the parent Layout's defaultHasDividers.",
    },
  ],
  playground: {
    defaults: {
      title: 'Host details',
      subtitle: 'web-prod-04',
      hasDivider: true,
    },
  },
  theming: {
    targets: [
      {className: 'astryx-drawer-header'},
      {className: 'astryx-drawer-header-start-content'},
      {className: 'astryx-drawer-header-title-block'},
      {className: 'astryx-drawer-header-end-content'},
      {className: 'astryx-drawer-header-close-icon'},
    ],
  },
  examples: [
    {
      label: 'With close button',
      code: `
import {useState} from 'react';
import {Drawer, DrawerHeader} from '@astryxdesign/core/Drawer';
import {Layout, LayoutContent} from '@astryxdesign/core/Layout';

function Inspector() {
  const [isOpen, setIsOpen] = useState(true);

  // Passing onOpenChange renders a close button that calls it with false.
  return (
    <Drawer isOpen={isOpen} onOpenChange={setIsOpen} label="Details">
      <Layout
        header={<DrawerHeader title="Details" onOpenChange={setIsOpen} />}
        content={<LayoutContent>Content</LayoutContent>}
      />
    </Drawer>
  );
}
`,
    },
    {
      label: 'With subtitle and end content',
      code: `
import {DrawerHeader} from '@astryxdesign/core/Drawer';
import {Badge} from '@astryxdesign/core/Badge';

<DrawerHeader
  title="web-prod-04"
  subtitle="us-east-1"
  endContent={<Badge label="Healthy" />}
/>;
`,
    },
  ],
};

export const docsZh = {
  "name": "DrawerHeader",
  "isHiddenFromOverview": true,
  "displayName": "Drawer Header",
  "description": "抽屉的头部，包含标题、可选副标题、关闭按钮以及起始/尾部内容插槽。API 与 `DialogHeader` 相同。",
  "usage": {
    "description": "在 `Drawer` 内 `Layout` 的头部插槽中组合 `DrawerHeader`，就像在 `Dialog` 中组合 `DialogHeader` 一样，以获得标题行，并在传入 `onOpenChange` 时获得关闭按钮。`Layout` 会让头部对齐抽屉内边距，避免重复添加内边距。`Drawer` 本身不渲染关闭按钮。与 `DialogHeader` 不同，它不会在打开时获取焦点（`Drawer` 使用 `data-autofocus`），也不会为抽屉命名（由 `Drawer` 的 `label` 完成）。",
    "anatomy": [
      {
        "name": "头部行",
        "required": true,
        "description": "排列标题块、可选的起始/尾部内容以及关闭控件。"
      },
      {
        "name": "起始内容",
        "required": false,
        "description": "包裹可选的前置内容。"
      },
      {
        "name": "标题块",
        "required": true,
        "description": "将标题和可选副标题分组。"
      },
      {
        "name": "尾部内容",
        "required": false,
        "description": "将可选的尾部内容与可选关闭控件分组。"
      },
      {
        "name": "关闭图标",
        "required": false,
        "description": "关闭按钮内的可视关闭图标。"
      }
    ]
  },
  "props": [
    {
      "name": "title",
      "type": "ReactNode",
      "description": "抽屉标题，渲染为 `h2`。保持其为内联且不可交互。它不会为抽屉命名；请为 `Drawer` 传入 `label`。",
      "required": true
    },
    {
      "name": "subtitle",
      "type": "ReactNode",
      "description": "标题下方的副标题。接受 `Link` 等内联内容；避免使用块级元素。"
    },
    {
      "name": "onOpenChange",
      "type": "(isOpen: boolean) => unknown",
      "description": "关闭按钮回调，调用时传入 `false`（省略时不显示按钮）。请传入 `Drawer` 自身的 `onOpenChange`。"
    },
    {
      "name": "startContent",
      "type": "ReactNode",
      "description": "标题之前的内容（例如返回按钮）。"
    },
    {
      "name": "endContent",
      "type": "ReactNode",
      "description": "标题之后、关闭按钮之前的内容。"
    },
    {
      "name": "endContentEdgeCompensation",
      "type": "'inline' | 'block' | 'all'",
      "description": "选择尾部内容插槽的补偿轴。省略时保留自动的关闭操作补偿。"
    },
    {
      "name": "hasDivider",
      "type": "boolean",
      "description": "在底部边缘添加边框。默认使用父级 `Layout` 的 `defaultHasDividers`。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-drawer-header"
      },
      {
        "className": "astryx-drawer-header-start-content"
      },
      {
        "className": "astryx-drawer-header-title-block"
      },
      {
        "className": "astryx-drawer-header-end-content"
      },
      {
        "className": "astryx-drawer-header-close-icon"
      }
    ]
  },
  "propDescriptions": {
    "title": "抽屉标题，渲染为 `h2`。保持其为内联且不可交互。它不会为抽屉命名；请为 `Drawer` 传入 `label`。",
    "subtitle": "标题下方的副标题。接受 `Link` 等内联内容；避免使用块级元素。",
    "onOpenChange": "关闭按钮回调，调用时传入 `false`（省略时不显示按钮）。请传入 `Drawer` 自身的 `onOpenChange`。",
    "startContent": "标题之前的内容（例如返回按钮）。",
    "endContent": "标题之后、关闭按钮之前的内容。",
    "endContentEdgeCompensation": "选择尾部内容插槽的补偿轴。省略时保留自动的关闭操作补偿。",
    "hasDivider": "在底部边缘添加边框。默认使用父级 `Layout` 的 `defaultHasDividers`。"
  }
};

export const docsDense = {
  name: 'DrawerHeader',
  isHiddenFromOverview: true,
  displayName: 'Drawer Header',
  description:
    'drawer header w/ title, optional subtitle, close button, start/end content slots; same API as DialogHeader',
  usage: {
    description:
      'header slot of a Layout inside Drawer, like DialogHeader in Dialog; close button only when given onOpenChange (Drawer has none built in); no focus on open (Drawer uses data-autofocus); does not name the drawer (Drawer label does)',
    anatomy: [
      {
        name: 'Header row',
        required: true,
        description:
          'arranges title block, optional start/end content, close control',
      },
      {
        name: 'Start content',
        required: false,
        description: 'wraps optional leading content',
      },
      {
        name: 'Title block',
        required: true,
        description: 'groups title + optional subtitle',
      },
      {
        name: 'End content',
        required: false,
        description:
          'groups optional trailing content + optional close control',
      },
      {
        name: 'Close icon',
        required: false,
        description: 'close glyph inside close button',
      },
    ],
  },
  propDescriptions: {
    title:
      'drawer title node, rendered as h2; inline, non-interactive; does not name the drawer',
    subtitle:
      'subtitle node below title; inline content ok (e.g. Link), no block elements',
    onOpenChange:
      "close button callback, called with false (omit=no button); pass the Drawer's onOpenChange",
    startContent: 'content before title (e.g. back button)',
    endContent: 'content after title, before close button',
    endContentEdgeCompensation:
      'end-content slot axes: inline | block | all; omit=automatic close-action compensation',
    hasDivider: 'bottom border; default = parent Layout defaultHasDividers',
  },
};
