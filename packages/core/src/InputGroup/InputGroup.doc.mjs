// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'InputGroup',
  displayName: 'Input Group',
  group: 'Field',
  category: 'Form Controls',
  isHiddenFromOverview: true,
  keywords: [
    'inputgroup',
    'addon',
    'prefix',
    'suffix',
    'connected',
    'grouped',
    'input',
  ],
  theming: {
    targets: [
      {className: 'astryx-input-group', visualProps: ['size', 'status']},
      {className: 'astryx-input-group-text'},
    ],
  },
  description:
    'Groups an input with prefix and suffix addons in one connected row. A focused member stays above its neighbours, so its focus ring shows in full.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'InputGroupText, Button addons, and compatible input children: TextInput, NumberInput, TimeInput, DateInput, Typeahead, Tokenizer, Selector, or MultiSelector.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the group.',
      required: true,
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Visually hide the label.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Helper text between label and input group.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disable the entire group.',
      default: 'false',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: 'Show the "Optional" indicator after the label.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Mark the field as required.',
      default: 'false',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Default size for inputs in the group.',
      default: "'md'",
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description:
        'Validation status. Its message shows below the group. The group border does not change; a theme can style the row from `data-status`.',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: 'Tooltip text at the end of the label.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization.',
    },
    {
      name: 'data-testid',
      type: 'string',
      description: 'Test selector.',
    },
  ],
  components: [{name: 'InputGroupText'}],
  usage: {
    description:
      'InputGroup connects an input with prefix/suffix addons in a single visual unit. Use it for URL fields, currency inputs, search fields with action buttons, or any input that needs contextual decorations.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use text addons to show units, prefixes, or suffixes that clarify the input format (e.g., "$", "kg", "https://").',
      },
      {
        guidance: true,
        description:
          'Use InputGroupText for static prefixes/suffixes like "$", "kg", or "https://".',
      },
      {
        guidance: true,
        description:
          'Use Button for an action attached to the input; InputGroup connects its corners automatically.',
      },
      {
        guidance: true,
        description:
          'Use InputGroup with compatible single-line inputs: TextInput, NumberInput, TimeInput, DateInput, Typeahead, Tokenizer, Selector, and MultiSelector.',
      },
      {
        guidance: true,
        description:
          "Keep each inner input's label specific; grouped inputs automatically combine the group label with their own label and inherit the group description/status context.",
      },
      {
        guidance: true,
        description:
          'Keep multi-value controls (Tokenizer, MultiSelector) short inside a group — the group is a fixed-height single-line surface, so cap or summarize selections instead of letting them fill the row.',
      },
      {
        guidance: false,
        description:
          "Don't put multiple text inputs in one group; use separate fields instead.",
      },
      {
        guidance: false,
        description:
          "Don't use InputGroup for unrelated inputs; it's for a single input with decorations.",
      },
      {
        guidance: false,
        description:
          "Don't use InputGroup with TextArea, Slider, Switch, CheckboxInput, or RadioList.",
      },
    ],
    anatomy: [
      {name: 'Label', required: true, description: 'Text above the group.'},
      {
        name: 'Prefix addon',
        required: false,
        description: 'Content before the input (text, icon, or button).',
      },
      {
        name: 'Input',
        required: true,
        description:
          'The main input element (TextInput, NumberInput, TimeInput, DateInput, Typeahead, Tokenizer, Selector, or MultiSelector).',
      },
      {
        name: 'Suffix addon',
        required: false,
        description: 'Content after the input (text, icon, or button).',
      },
      {
        name: 'Status message',
        required: false,
        description: 'An error, warning, or success message below the group.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'groups input with prefix/suffix addons in a connected container',
  usage: {
    description:
      'InputGroup connects an input with addons. Use for URL fields, currency inputs, search with actions.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use text addons to show units, prefixes, or suffixes that clarify input format (e.g. "$", "kg", "https://").',
      },
      {
        guidance: true,
        description:
          'Use InputGroupText for static prefixes/suffixes like "$", "kg", or "https://".',
      },
      {
        guidance: true,
        description:
          'Use Button for an action attached to the input; InputGroup connects its corners automatically.',
      },
      {
        guidance: true,
        description:
          'Use InputGroup with compatible single-line inputs: TextInput, NumberInput, TimeInput, DateInput, Typeahead, Tokenizer, Selector, and MultiSelector.',
      },
      {
        guidance: true,
        description:
          "Keep each inner input's label specific; grouped inputs combine the group label with their own label and inherit group description/status.",
      },
      {
        guidance: true,
        description:
          'Keep multi-value controls (Tokenizer, MultiSelector) short inside a group; the group row is fixed-height and single-line.',
      },
      {
        guidance: false,
        description:
          "Don't put multiple text inputs in one group; use separate fields instead.",
      },
      {
        guidance: false,
        description:
          "Don't use InputGroup for unrelated inputs; it's for a single input with decorations.",
      },
      {
        guidance: false,
        description:
          "Don't use InputGroup with TextArea, Slider, Switch, CheckboxInput, or RadioList.",
      },
    ],
  },
};

export const docsZh = {
  "name": "InputGroup",
  "displayName": "Input Group",
  "description": "将输入框与前缀、后缀附加内容组合成一行相连的整体。获得焦点的成员会显示在相邻元素之上，因此其焦点环可以完整显示。",
  "usage": {
    "description": "InputGroup 将输入框与前缀/后缀附加内容连接为单一的视觉单元。用于 URL 字段、货币输入、带操作按钮的搜索字段，或任何需要上下文装饰的输入框。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "使用文本附加内容显示单位、前缀或后缀，以说明输入格式（例如 `\"$\"`、`\"kg\"`、`\"https://\"`）。"
      },
      {
        "guidance": true,
        "description": "对于 `\"$\"`、`\"kg\"` 或 `\"https://\"` 等静态前缀/后缀，请使用 InputGroupText。"
      },
      {
        "guidance": true,
        "description": "需要附加到输入框的操作时使用 Button；InputGroup 会自动连接其圆角。"
      },
      {
        "guidance": true,
        "description": "将 InputGroup 与兼容的单行输入框搭配使用：TextInput、NumberInput、TimeInput、DateInput、Typeahead、Tokenizer、Selector 和 MultiSelector。"
      },
      {
        "guidance": true,
        "description": "让每个内部输入框的标签保持具体；分组输入框会自动将组标签与自身标签组合，并继承组的描述/状态上下文。"
      },
      {
        "guidance": true,
        "description": "在组内保持多值控件（Tokenizer、MultiSelector）简短——组是固定高度的单行表面，因此应限制或汇总已选项，而不是让它们填满整行。"
      },
      {
        "guidance": false,
        "description": "不要在一个组中放入多个文本输入框；请改用独立字段。"
      },
      {
        "guidance": false,
        "description": "不要将 InputGroup 用于互不相关的输入框；它适用于带装饰的单个输入框。"
      },
      {
        "guidance": false,
        "description": "不要将 InputGroup 与 TextArea、Slider、Switch、CheckboxInput 或 RadioList 搭配使用。"
      }
    ],
    "anatomy": [
      {
        "name": "标签",
        "required": true,
        "description": "组上方的文本。"
      },
      {
        "name": "前缀附加内容",
        "required": false,
        "description": "输入框之前的内容（文本、图标或按钮）。"
      },
      {
        "name": "输入框",
        "required": true,
        "description": "主输入元素（TextInput、NumberInput、TimeInput、DateInput、Typeahead、Tokenizer、Selector 或 MultiSelector）。"
      },
      {
        "name": "后缀附加内容",
        "required": false,
        "description": "输入框之后的内容（文本、图标或按钮）。"
      },
      {
        "name": "状态消息",
        "required": false,
        "description": "组下方的错误、警告或成功消息。"
      }
    ]
  },
  "propDescriptions": {
    "children": "InputGroupText、Button 附加内容，以及兼容的输入子元素：TextInput、NumberInput、TimeInput、DateInput、Typeahead、Tokenizer、Selector 或 MultiSelector。",
    "label": "组的无障碍标签。",
    "isLabelHidden": "在视觉上隐藏标签。",
    "description": "标签与输入组之间的辅助文本。",
    "isDisabled": "禁用整个组。",
    "isOptional": "在标签后显示“可选”指示符。",
    "isRequired": "将字段标记为必填。",
    "size": "组内输入框的默认尺寸。",
    "status": "校验状态。其消息显示在组下方。组边框不会变化；主题可以根据 `data-status` 为该行设置样式。",
    "labelTooltip": "标签末尾的提示文本。",
    "xstyle": "用于布局自定义的 StyleX 样式。",
    "data-testid": "测试选择器。"
  },
  "components": [
    {
      "name": "InputGroupText",
      "description": ""
    }
  ]
};
