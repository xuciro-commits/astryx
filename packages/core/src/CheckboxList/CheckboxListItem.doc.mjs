// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'CheckboxListItem',
  subComponentOf: 'CheckboxList',
  displayName: 'Checkbox List Item',
  isHiddenFromOverview: true,
  description:
    'Individual checkbox item with label, description, and end content slot. Works in collection mode (inside a CheckboxList with a value array) or standalone mode (inside List, or inside a CheckboxList without value, such as a select-all item). On a touch screen (a coarse primary pointer), a toggleable row is one press target: a touch on the label, the description or the box itself shows the pressed state on the row and its checkbox together. Where the primary pointer is fine, the box keeps its own press.',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description:
        'Primary text label for the item. Rich labels may contain links or buttons, which keep their own behavior without toggling the item. A ReactNode label names the checkbox from its visible text; pass aria-label only when that text is absent, or include all visible label words in the override.',
      required: true,
    },
    {
      name: 'aria-label',
      type: 'string',
      description:
        'Plain-text accessible name for the checkbox, replacing the one derived from label. Applied to the checkbox control. Use it when a rich label has no visible text; otherwise the value must retain every visible label word.',
    },
    {
      name: 'value',
      type: 'string',
      description:
        'Identity key. Required when the parent CheckboxList has a value array; the item throws without it there.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description:
        "Secondary content below the label. String or ReactNode. Exposed as the checkbox's accessible description through aria-describedby, so assistive technology can tell it is the explanation for that choice.",
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description: 'Content rendered after the label area.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'chevronDown',
            size: 'sm',
          },
        },
        {
          __element: 'Badge',
          props: {
            label: '3',
          },
        },
      ],
    },
    {
      name: 'align',
      type: "'center' | 'start' | 'first-line'",
      description:
        'Vertical alignment of the start and end content against the label, passed through to Item unchanged. `first-line` keeps a small mark (a checkbox) level with the first line of a wrapped label. See Item.align.',
      default: "'center'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether this individual item is disabled.',
      default: 'false',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Whether this item is loading. Shows a spinner inside the checkbox and blocks interaction on this item. In collection mode, the toggled item also shows this automatically while the parent changeAction is pending.',
      default: 'false',
    },
    {
      name: 'isChecked',
      type: "boolean | 'indeterminate'",
      description:
        'Direct checked state in standalone mode: inside List, or inside a CheckboxList without value (for example, a select-all item). Ignored when the parent CheckboxList has a value array.',
    },
    {
      name: 'onCheck',
      type: '(checked: boolean) => void',
      description:
        "Direct check handler in standalone mode: inside List, or inside a CheckboxList without value. Ignored when the parent CheckboxList has a value array; that list's onChange receives the change.",
    },
  ],
  examples: [
    {
      label: 'Rich label with an overriding aria-label',
      code: `<CheckboxListItem
  label={<span>Pro plan <Badge label="Recommended" /></span>}
  aria-label="Pro plan Recommended option"
  value="pro"
/>`,
    },
  ],
};

export const docsZh = {
  "name": "CheckboxListItem",
  "isHiddenFromOverview": true,
  "displayName": "Checkbox List Item",
  "description": "单个复选框项目，包含标签、描述和尾部内容插槽。可用于集合模式（位于带 `value` 数组的 `CheckboxList` 内）或独立模式（位于 `List` 内，或位于不带 `value` 的 `CheckboxList` 内，例如全选项）。在触摸屏（粗略主指针）上，可切换行是一个按压目标：触摸标签、描述或复选框本身时，行及其复选框会一起显示按压状态。主指针为精细指针时，复选框保留自己的按压行为。",
  "props": [
    {
      "name": "label",
      "type": "ReactNode",
      "description": "项目的主文本标签。富标签可以包含链接或按钮，它们会保留自身行为，不会切换该项目。`ReactNode` 标签会根据其可见文本为复选框命名；仅当没有可见文本时才传入 `aria-label`，或者让覆盖值包含所有可见的标签文字。",
      "required": true
    },
    {
      "name": "aria-label",
      "type": "string",
      "description": "复选框的纯文本无障碍名称，替代根据 `label` 推导的名称。应用于复选框控件。当富标签没有可见文本时使用；否则该值必须保留所有可见的标签文字。"
    },
    {
      "name": "value",
      "type": "string",
      "description": "标识键。父级 `CheckboxList` 带有 `value` 数组时为必填；此时缺少该键会抛出异常。"
    },
    {
      "name": "description",
      "type": "ReactNode",
      "description": "标签下方的次要内容。字符串或 `ReactNode`。通过 `aria-describedby` 作为复选框的无障碍描述暴露，使辅助技术能够识别它是对该选项的说明。"
    },
    {
      "name": "endContent",
      "type": "ReactNode",
      "description": "在标签区域之后渲染的内容。"
    },
    {
      "name": "align",
      "type": "'center' | 'start' | 'first-line'",
      "description": "起始和尾部内容相对于标签的垂直对齐方式，原样传递给 `Item`。`first-line` 使小标记（复选框）与换行标签的第一行保持水平。参见 `Item.align`。",
      "default": "'center'"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "此单个项目是否禁用。",
      "default": "false"
    },
    {
      "name": "isLoading",
      "type": "boolean",
      "description": "此项目是否处于加载状态。在复选框内显示加载指示器，并阻止与此项目交互。在集合模式下，当父级 `changeAction` 处于待处理状态时，被切换的项目也会自动显示此状态。",
      "default": "false"
    },
    {
      "name": "isChecked",
      "type": "boolean | 'indeterminate'",
      "description": "独立模式下的直接选中状态：位于 `List` 内，或位于不带 `value` 的 `CheckboxList` 内（例如全选项）。当父级 `CheckboxList` 带有 `value` 数组时忽略。"
    },
    {
      "name": "onCheck",
      "type": "(checked: boolean) => void",
      "description": "独立模式下的直接选中处理函数：位于 `List` 内，或位于不带 `value` 的 `CheckboxList` 内。当父级 `CheckboxList` 带有 `value` 数组时忽略；变化由该列表的 `onChange` 接收。"
    }
  ],
  "propDescriptions": {
    "label": "项目的主文本标签。富标签可以包含链接或按钮，它们会保留自身行为，不会切换该项目。`ReactNode` 标签会根据其可见文本为复选框命名；仅当没有可见文本时才传入 `aria-label`，或者让覆盖值包含所有可见的标签文字。",
    "aria-label": "复选框的纯文本无障碍名称，替代根据 `label` 推导的名称。应用于复选框控件。当富标签没有可见文本时使用；否则该值必须保留所有可见的标签文字。",
    "value": "标识键。父级 `CheckboxList` 带有 `value` 数组时为必填；此时缺少该键会抛出异常。",
    "description": "标签下方的次要内容。字符串或 `ReactNode`。通过 `aria-describedby` 作为复选框的无障碍描述暴露，使辅助技术能够识别它是对该选项的说明。",
    "endContent": "在标签区域之后渲染的内容。",
    "align": "起始和尾部内容相对于标签的垂直对齐方式，原样传递给 `Item`。`first-line` 使小标记（复选框）与换行标签的第一行保持水平。参见 `Item.align`。",
    "isDisabled": "此单个项目是否禁用。",
    "isLoading": "此项目是否处于加载状态。在复选框内显示加载指示器，并阻止与此项目交互。在集合模式下，当父级 `changeAction` 处于待处理状态时，被切换的项目也会自动显示此状态。",
    "isChecked": "独立模式下的直接选中状态：位于 `List` 内，或位于不带 `value` 的 `CheckboxList` 内（例如全选项）。当父级 `CheckboxList` 带有 `value` 数组时忽略。",
    "onCheck": "独立模式下的直接选中处理函数：位于 `List` 内，或位于不带 `value` 的 `CheckboxList` 内。当父级 `CheckboxList` 带有 `value` 数组时忽略；变化由该列表的 `onChange` 接收。"
  }
};

export const docsDense = {
  name: 'CheckboxListItem',
  isHiddenFromOverview: true,
  displayName: 'Checkbox List Item',
  description:
    'Individual checkbox item w/ label, description, end content slot. Collection mode inside CheckboxList with value; standalone inside List or CheckboxList without value. On a touch screen a toggleable row presses as one target, box included; with a fine primary pointer the box keeps its own press.',
  propDescriptions: {
    align:
      "Start/end content alignment, passed to Item: 'center' (default), 'start', or 'first-line' (centered on the label's first line).",
    label:
      'Primary label. String or ReactNode; nested controls keep their behavior. A ReactNode names the checkbox from its visible text.',
    'aria-label':
      'Plain-text checkbox name replacing the one derived from label. Use when visible text is absent; otherwise retain every visible label word.',
    value:
      'Identity key. Required when parent CheckboxList has a value array (throws without it).',
    description:
      "Secondary content below label. String or ReactNode. Exposed as the checkbox's accessible description via aria-describedby.",
    endContent: 'Content rendered after label area.',
    isDisabled: 'Whether this individual item is disabled.',
    isLoading:
      'Item loading: spinner inside checkbox + blocks interaction. Auto-set on toggled item while parent changeAction pending.',
    isChecked:
      'Direct checked state in standalone mode (inside List, or CheckboxList without value). Ignored when parent CheckboxList has a value array.',
    onCheck:
      'Direct check handler in standalone mode (inside List, or CheckboxList without value). Ignored when parent CheckboxList has a value array; its onChange gets the change.',
  },
};
