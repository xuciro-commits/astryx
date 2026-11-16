// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'CollapsibleGroup',
  subComponentOf: 'Collapsible',
  displayName: 'Collapsible Group',
  isHiddenFromOverview: true,
  description: 'Coordinates multiple Collapsible instances so only one (single mode) or any number (multiple mode) can be open at a time. Renders no wrapper DOM element unless dividers are enabled.',
  props: [
    {
      name: 'type',
      type: "'single' | 'multiple'",
      description: 'Whether one or many items can be open simultaneously.',
      default: "'single'",
    },
    {
      name: 'defaultValue',
      type: 'string | string[]',
      description: 'Default open item(s) for uncontrolled usage. Use a string for single mode and an array for multiple mode.',
    },
    {
      name: 'value',
      type: 'string | string[]',
      description: 'Controlled open item(s).',
    },
    {
      name: 'onChange',
      type: '(value: string | string[]) => void',
      description: 'Callback invoked when the set of open items changes.',
    },
    {
      name: 'hasDividers',
      type: 'boolean',
      description: "Whether to draw hairline dividers between the group's items. When set, the group renders a wrapper div and items default to 'balanced' density. Pair with bare Collapsible children; Card-wrapped items provide their own separation.",
      default: 'false',
    },
    {
      name: 'density',
      type: "'compact' | 'balanced' | 'spacious'",
      description: "Row density controlling trigger and content block padding on the group's items. Defaults to 'balanced' when dividers are shown; otherwise items keep their default unpadded look.",
    },
    {
      name: 'chevronPosition',
      type: "'start' | 'end'",
      description: "Logical position shared by the group's direct Collapsible items. `end` is the default trailing indicator; `start` is a leading disclosure arrow that points inward when collapsed (mirrored under RTL) and down when expanded. An individual Collapsible can still override it.",
      default: "'end'",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Collapsible instances to coordinate.',
      required: true,
      slotElements: [
        {
          __element: 'Collapsible',
          props: {
            trigger: 'Section',
          },
          children: 'Content',
        },
      ],
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLElement>',
      description:
        'Ref forwarded to the group wrapper when hasDividers renders one.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for the group wrapper when hasDividers renders one. Must be a stylex.create() value.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'CSS class name for the group wrapper when hasDividers renders one. Prefer xstyle for styling.',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description:
        'Inline styles for the group wrapper when hasDividers renders one. Prefer xstyle for StyleX-optimized styling.',
    },
    {
      name: 'data-testid',
      type: 'string',
      description:
        'Test selector forwarded to the group wrapper when hasDividers renders one.',
    },
  ],
};

export const docsZh = {
  "name": "CollapsibleGroup",
  "isHiddenFromOverview": true,
  "displayName": "Collapsible Group",
  "description": "协调多个 `Collapsible` 实例，使同一时间只能打开一个（单例模式）或任意数量（多例模式）。除非启用分隔线，否则不渲染包装 DOM 元素。",
  "props": [
    {
      "name": "type",
      "type": "'single' | 'multiple'",
      "description": "是否可以同时打开一个或多个项目。",
      "default": "'single'"
    },
    {
      "name": "defaultValue",
      "type": "string | string[]",
      "description": "非受控用法下的默认打开项。单例模式使用字符串，多例模式使用数组。"
    },
    {
      "name": "value",
      "type": "string | string[]",
      "description": "受控的打开项。"
    },
    {
      "name": "onChange",
      "type": "(value: string | string[]) => void",
      "description": "打开项集合发生变化时调用的回调。"
    },
    {
      "name": "hasDividers",
      "type": "boolean",
      "description": "是否在分组的项目之间绘制细线分隔线。设置后，分组会渲染一个包装 `div`，项目默认使用 `'balanced'` 密度。请搭配未包裹的 `Collapsible` 子元素；用 `Card` 包裹的项目自带分隔。",
      "default": "false"
    },
    {
      "name": "density",
      "type": "'compact' | 'balanced' | 'spacious'",
      "description": "控制分组内项目触发器与内容块内边距的行密度。显示分隔线时默认为 `'balanced'`；否则项目保持默认的无内边距外观。"
    },
    {
      "name": "chevronPosition",
      "type": "'start' | 'end'",
      "description": "分组直属 `Collapsible` 项目共享的逻辑位置。`end` 是默认的尾部指示器；`start` 是前导展开箭头，折叠时朝内（RTL 下镜像），展开时朝下。单个 `Collapsible` 仍可覆盖此设置。",
      "default": "'end'"
    },
    {
      "name": "children",
      "type": "ReactNode",
      "description": "要协调的 `Collapsible` 实例。",
      "required": true
    }
  ],
  "propDescriptions": {
    "type": "是否可以同时打开一个或多个项目。",
    "defaultValue": "非受控用法下的默认打开项。单例模式使用字符串，多例模式使用数组。",
    "value": "受控的打开项。",
    "onChange": "打开项集合发生变化时调用的回调。",
    "hasDividers": "是否在分组的项目之间绘制细线分隔线。设置后，分组会渲染一个包装 `div`，项目默认使用 `'balanced'` 密度。请搭配未包裹的 `Collapsible` 子元素；用 `Card` 包裹的项目自带分隔。",
    "density": "控制分组内项目触发器与内容块内边距的行密度。显示分隔线时默认为 `'balanced'`；否则项目保持默认的无内边距外观。",
    "chevronPosition": "分组直属 `Collapsible` 项目共享的逻辑位置。`end` 是默认的尾部指示器；`start` 是前导展开箭头，折叠时朝内（RTL 下镜像），展开时朝下。单个 `Collapsible` 仍可覆盖此设置。",
    "children": "要协调的 `Collapsible` 实例。",
    "ref": "当 `hasDividers` 渲染包装元素时，转发给该包装元素的 ref。",
    "xstyle": "当 `hasDividers` 渲染包装元素时，用于该包装元素的 StyleX 样式。必须是 `stylex.create()` 的值。",
    "className": "当 `hasDividers` 渲染包装元素时，用于该包装元素的 CSS 类名。样式优先使用 `xstyle`。",
    "style": "当 `hasDividers` 渲染包装元素时，用于该包装元素的内联样式。优先使用 `xstyle` 以获得经过 StyleX 优化的样式。",
    "data-testid": "当 `hasDividers` 渲染包装元素时，转发给该包装元素的测试选择器。"
  }
};

export const docsDense = {
  name: 'CollapsibleGroup',
  isHiddenFromOverview: true,
  displayName: 'Collapsible Group',
  description: 'coordinates multiple Collapsible instances; single or multiple open. no wrapper DOM unless dividers enabled.',
  propDescriptions: {
    type: 'one or many items open simultaneously',
    defaultValue: 'default open item(s) (uncontrolled); string for single, array for multiple',
    value: 'controlled open item(s)',
    onChange: 'callback on open items change',
    hasDividers: "draw hairline dividers between items; enables wrapper div + 'balanced' density; use bare Collapsible children",
    density: "row padding 'compact' | 'balanced' | 'spacious'; defaults 'balanced' with dividers, else unpadded",
    chevronPosition: "logical chevron position for direct items: 'end' (default trailing, down/up) | 'start' (leading, inward/down with RTL mirroring); per-item prop wins",
    children: 'Collapsible instances to coordinate',
  },
};
