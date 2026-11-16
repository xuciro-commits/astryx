// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Label',
    required: true,
    description:
      'Text identifying the numeric setting controlled by the slider.',
  },
  {
    name: 'Description',
    required: false,
    description: 'Helper text between the label and the slider control.',
  },
  {
    name: 'Slider',
    required: true,
    description:
      'Control row containing the track, thumb or thumbs, and optional text value.',
  },
  {
    name: 'Interactive control',
    required: true,
    description:
      'Pointer and keyboard interaction surface containing the rail, fill, marks, and thumbs.',
  },
  {
    name: 'Track',
    required: true,
    description: 'Background rail representing the available numeric range.',
  },
  {
    name: 'Filled range',
    required: true,
    description:
      'Accent segment from the minimum to a single value, or between two range values.',
  },
  {
    name: 'Tick mark',
    required: false,
    description: 'Position marker supplied through the marks collection.',
  },
  {
    name: 'Mark label',
    required: false,
    description: 'Optional text displayed beside a tick mark.',
  },
  {
    name: 'Thumb',
    required: true,
    description:
      'Draggable value indicator; range mode renders a minimum and maximum thumb.',
  },
  {
    name: 'Value display',
    required: false,
    description:
      'Formatted current value shown beside the slider when valueDisplay is text.',
  },
  {
    name: 'Value tooltip',
    required: false,
    description:
      'Formatted current value shown in a tooltip when valueDisplay is tooltip.',
  },
  {
    name: 'Status message',
    required: false,
    description: 'Error, warning, or success message below the slider.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Slider',
  displayName: 'Slider',
  category: 'Form Controls',
  keywords: [
    'slider',
    'range',
    'slidebar',
    'trackbar',
    'scrubber',
    'knob',
    'thumb',
    'rangeslider',
  ],
  playground: {
    defaults: {
      label: 'Volume',
      value: 50,
      // Give the properties-tab preview a defined width so the track has room
      // to render and stays draggable/interactive (the slider track grows to
      // fill its container, which can collapse without an explicit width).
      width: 300,
    },
  },
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Label text (always rendered for accessibility).',
      required: true,
    },
    {
      name: 'value',
      type: 'number | [number, number]',
      description:
        'Current value: a `number` for single thumb mode or `[number, number]` for range mode.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: number) => void | (value: [number, number]) => void',
      description: 'Callback fired on value change during drag.',
    },
    {
      name: 'onChangeEnd',
      type: '(value: number) => void | (value: [number, number]) => void',
      description: 'Callback fired when drag ends.',
    },
    {
      name: 'min',
      type: 'number',
      description: 'Minimum value.',
      default: '0',
    },
    {
      name: 'max',
      type: 'number',
      description: 'Maximum value.',
      default: '100',
    },
    {
      name: 'step',
      type: 'number',
      description: 'Step increment.',
      default: '1',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      description: 'Orientation of the slider.',
      default: "'horizontal'",
    },
    {
      name: 'formatValue',
      type: '(value: number) => string',
      description:
        'Custom value formatting function used for display and `aria-valuetext`.',
    },
    {
      name: 'valueDisplay',
      type: "'tooltip' | 'text' | 'none'",
      description: 'How the current value is displayed.',
      default: "'tooltip'",
    },
    {
      name: 'marks',
      type: 'Array<{ value: number; label?: string }>',
      description:
        'Tick marks at specified positions with optional labels. Unfilled marks use the track color; marks inside the filled region (at or behind the thumb, or between the thumbs in range mode) use the fill color.',
    },
    {
      name: 'minStepsBetweenThumbs',
      type: 'number',
      description:
        'Minimum number of steps between thumbs in range mode; prevents thumbs from overlapping.',
      default: '0',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the slider is disabled.',
      default: 'false',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        'The HTML name attribute for form submissions. Renders hidden inputs carrying the current value (two entries in range mode).',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the slider is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the thumb focusable via aria-disabled (value changes stay blocked). Use this instead of wrapping a disabled Slider in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: 'Whether the field is optional.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Whether the field is required.',
      default: 'false',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Whether to visually hide the label.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Description text rendered below the label.',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description:
        'Status indicator object (`{ type, message }`) for validation feedback.',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: 'Tooltip text for an info icon displayed next to the label.',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
    },
    {
      name: 'containerXstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for the field container (label, control, and status together). No effect inside InputGroup (style the InputGroup instead) or in a `horizontal-labels` FormLayout. Root `xstyle`, `className`, and `style` are not accepted.',
    },
    {
      name: 'containerClassName',
      type: 'string',
      description:
        'Class name for the field container. Same targeting as `containerXstyle`.',
    },
    {
      name: 'containerStyle',
      type: 'CSSProperties',
      description:
        'Inline styles for the field container. Same targeting as `containerXstyle`.',
    },
    {
      name: 'controlXstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for the visual control box: the element that paints the border and background and holds icons and end controls. Never the native input.',
    },
    {
      name: 'controlClassName',
      type: 'string',
      description: 'Class name for the visual control box.',
    },
    {
      name: 'controlStyle',
      type: 'CSSProperties',
      description: 'Inline styles for the visual control box.',
    },
  ],
  theming: {
    targets: [
      {
        className: 'astryx-slider',
        visualProps: ['orientation'],
        states: ['disabled'],
      },
      {
        className: 'astryx-slider-control',
        visualProps: ['orientation'],
        states: ['disabled'],
      },
      {className: 'astryx-slider-track', visualProps: ['orientation']},
      {
        className: 'astryx-slider-thumb',
        visualProps: ['orientation'],
        states: ['disabled'],
      },
    ],
  },
  usage: {
    accessibility: [
      {
        name: 'Thumb',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Rest', 'Hover', 'Pointer down'],
        description:
          'The thumb must have at least 3:1 contrast with the track and the surface behind it. Pointer down is the whole drag: measure the thumb with the pressed overlay applied.',
      },
    ],
    anatomy,
    description:
      'A draggable control for selecting a numeric value or range within defined bounds. Supports single value and range selection, tick marks, custom value formatting, and vertical orientation. Use it when users need to explore a continuous range, such as volume, price, or percentage. Under a finger, on any touch device, it tracks as UISlider does: only the thumb takes a drag, through a target larger than it, the value follows the finger’s travel rather than jumping to it, a release coasts on before `onChangeEnd`, a swipe from the track scrolls the page, and a tap on the track or a mark sets the value when the finger lifts (the thumb springs there). A mouse drag on a thumb tracks the same way, past the same 10 px in any direction, with no lift or coast; a mouse press on the track moves the thumb there, and only a primary click presses. A pen drags as a finger does, claiming only along the track, and its drag ends at the release with no coast. A wheel or a trackpad scroll over the slider goes to whatever scrolls under it.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Always provide a label, even if visually hidden, so the slider is accessible to screen readers.',
      },
      {
        guidance: true,
        description:
          'Format values with meaningful units like "$50" or "75%" instead of raw numbers.',
      },
      {
        guidance: false,
        description:
          'Use for precise numeric entry; pair with a text input or use NumberInput instead.',
      },
      {
        guidance: false,
        description:
          'Set a step size so large that only a few positions are possible; use SegmentedControl or radio buttons instead.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled slider in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Slider",
  "displayName": "Slider",
  "props": [
    {
      "name": "label",
      "type": "string",
      "description": "标签文本（始终为无障碍而渲染）。",
      "required": true
    },
    {
      "name": "value",
      "type": "number | [number, number]",
      "description": "当前值：单滑块模式为 `number`，范围模式为 `[number, number]`。",
      "required": true
    },
    {
      "name": "onChange",
      "type": "(value: number) => void | (value: [number, number]) => void",
      "description": "拖动过程中值变化时触发的回调。"
    },
    {
      "name": "onChangeEnd",
      "type": "(value: number) => void | (value: [number, number]) => void",
      "description": "拖动结束时触发的回调。"
    },
    {
      "name": "min",
      "type": "number",
      "description": "最小值。",
      "default": "0"
    },
    {
      "name": "max",
      "type": "number",
      "description": "最大值。",
      "default": "100"
    },
    {
      "name": "step",
      "type": "number",
      "description": "步进增量。",
      "default": "1"
    },
    {
      "name": "orientation",
      "type": "'horizontal' | 'vertical'",
      "description": "滑块的方向。",
      "default": "'horizontal'"
    },
    {
      "name": "formatValue",
      "type": "(value: number) => string",
      "description": "用于显示和 `aria-valuetext` 的自定义值格式化函数。"
    },
    {
      "name": "valueDisplay",
      "type": "'tooltip' | 'text' | 'none'",
      "description": "当前值的显示方式。",
      "default": "'tooltip'"
    },
    {
      "name": "marks",
      "type": "Array<{ value: number; label?: string }>",
      "description": "指定位置上的刻度标记，可带标签。未填充的标记使用轨道颜色；填充区域内的标记（位于滑块处或其后，或范围模式中两个滑块之间）使用填充颜色。"
    },
    {
      "name": "minStepsBetweenThumbs",
      "type": "number",
      "description": "范围模式中滑块之间的最小步数；防止滑块重叠。",
      "default": "0"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "滑块是否禁用。",
      "default": "false"
    },
    {
      "name": "htmlName",
      "type": "string",
      "description": "用于表单提交的 HTML name 属性。渲染携带当前值的隐藏输入框（范围模式为两个条目）。"
    },
    {
      "name": "disabledMessage",
      "type": "string",
      "description": "解释滑块为何被禁用。与 isDisabled 搭配时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持滑块可聚焦（值更改仍被阻止）。请使用此属性，而不是用 Tooltip 包裹禁用的 Slider。禁用控件会吞掉外部 Tooltip 所需的悬停事件。"
    },
    {
      "name": "isOptional",
      "type": "boolean",
      "description": "字段是否可选。",
      "default": "false"
    },
    {
      "name": "isRequired",
      "type": "boolean",
      "description": "字段是否必填。",
      "default": "false"
    },
    {
      "name": "isLabelHidden",
      "type": "boolean",
      "description": "是否在视觉上隐藏标签。",
      "default": "false"
    },
    {
      "name": "description",
      "type": "string",
      "description": "在标签下方渲染的描述文本。"
    },
    {
      "name": "status",
      "type": "{type: 'warning' | 'error' | 'success', message?: string}",
      "description": "用于校验反馈的状态指示器对象（`{ type, message }`）。"
    },
    {
      "name": "labelTooltip",
      "type": "string",
      "description": "显示在标签旁信息图标上的工具提示文本。"
    },
    {
      "name": "containerXstyle",
      "type": "StyleXStyles",
      "description": "字段容器（标签、控件和状态一起）的 StyleX 样式。在 InputGroup 内无效（请改为设置 InputGroup 样式），在 `horizontal-labels` FormLayout 中也无效。不接受根级 `xstyle`、`className` 和 `style`。"
    },
    {
      "name": "containerClassName",
      "type": "string",
      "description": "字段容器的类名。定位方式与 `containerXstyle` 相同。"
    },
    {
      "name": "containerStyle",
      "type": "CSSProperties",
      "description": "字段容器的内联样式。定位方式与 `containerXstyle` 相同。"
    },
    {
      "name": "controlXstyle",
      "type": "StyleXStyles",
      "description": "可视控件框的 StyleX 样式：绘制边框和背景并容纳图标和结束控件的元素。绝不是原生输入框。"
    },
    {
      "name": "controlClassName",
      "type": "string",
      "description": "可视控件框的类名。"
    },
    {
      "name": "controlStyle",
      "type": "CSSProperties",
      "description": "可视控件框的内联样式。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-slider",
        "visualProps": [
          "orientation"
        ],
        "states": [
          "disabled"
        ]
      },
      {
        "className": "astryx-slider-control",
        "visualProps": [
          "orientation"
        ],
        "states": [
          "disabled"
        ]
      },
      {
        "className": "astryx-slider-track",
        "visualProps": [
          "orientation"
        ]
      },
      {
        "className": "astryx-slider-thumb",
        "visualProps": [
          "orientation"
        ],
        "states": [
          "disabled"
        ]
      }
    ]
  },
  "usage": {
    "anatomy": [
      {
        "name": "标签",
        "required": true,
        "description": "标识滑块所控制数值设置的文本。"
      },
      {
        "name": "描述",
        "required": false,
        "description": "标签和滑块控件之间的辅助文本。"
      },
      {
        "name": "滑块",
        "required": true,
        "description": "包含轨道、一个或多个滑块以及可选文本值的控件行。"
      },
      {
        "name": "交互控件",
        "required": true,
        "description": "包含轨道、填充、标记和滑块的指针与键盘交互表面。"
      },
      {
        "name": "轨道",
        "required": true,
        "description": "表示可用数值范围的背景轨道。"
      },
      {
        "name": "填充范围",
        "required": true,
        "description": "从最小值到单值、或两个范围值之间的强调段。"
      },
      {
        "name": "刻度标记",
        "required": false,
        "description": "通过 marks 集合提供的位置标记。"
      },
      {
        "name": "标记标签",
        "required": false,
        "description": "显示在刻度标记旁的可选文本。"
      },
      {
        "name": "滑块手柄",
        "required": true,
        "description": "可拖动的值指示器；范围模式会渲染最小值和最大值滑块。"
      },
      {
        "name": "值显示",
        "required": false,
        "description": "当 valueDisplay 为 text 时，显示在滑块旁的格式化当前值。"
      },
      {
        "name": "值工具提示",
        "required": false,
        "description": "当 valueDisplay 为 tooltip 时，在工具提示中显示的格式化当前值。"
      },
      {
        "name": "状态消息",
        "required": false,
        "description": "滑块下方的错误、警告或成功消息。"
      }
    ],
    "description": "用于在限定范围内选择数值或范围的可拖动控件。支持单值和范围选择、刻度标记、自定义值格式以及垂直方向。当用户需要探索连续范围（如音量、价格或百分比）时使用。在任何触摸设备上用手指操作时，它的行为与 UISlider 一致：只有滑块可拖动，通过比它更大的目标区域；值跟随手指移动而不是跳到手指位置；释放后会继续滑行，然后触发 `onChangeEnd`；从轨道上滑动会滚动页面；轻触轨道或标记会在手指抬起时设置值（滑块弹到该处）。用鼠标拖动滑块时跟踪方式相同，同样超过任意方向的 10 px，但没有抬起或滑行；在轨道上按下鼠标会将滑块移到该处，且只有主键点击才会按下。笔的拖动与手指相同，仅沿轨道声明，拖动在释放时结束，没有滑行。在滑块上滚动滚轮或触控板会传递给其下方可滚动的任何内容。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "始终提供标签，即使视觉上隐藏，以便滑块对屏幕阅读器可访问。"
      },
      {
        "guidance": true,
        "description": "使用有意义的单位（如 \"$50\" 或 \"75%\"）格式化值，而不是原始数字。"
      },
      {
        "guidance": false,
        "description": "将其用于精确数值输入；请搭配文本输入框或改用 NumberInput。"
      },
      {
        "guidance": false,
        "description": "将步长设置得过大以致只有少数位置可选；请改用 SegmentedControl 或单选按钮。"
      },
      {
        "guidance": false,
        "description": "用 Tooltip 包裹禁用的滑块来解释其禁用原因；禁用控件会吞掉包装器所需的悬停事件。请改用 disabledMessage 属性。"
      }
    ],
    "accessibility": [
      {
        "name": "滑块手柄",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1",
        "states": [
          "静止",
          "悬停",
          "指针按下"
        ],
        "description": "滑块与轨道及其背后表面的对比度必须至少为 3:1。指针按下指整个拖动过程：测量时应用按下叠加层后的滑块。"
      }
    ]
  },
  "propDescriptions": {
    "label": "标签文本（始终为无障碍而渲染）。",
    "value": "当前值：单滑块模式为 `number`，范围模式为 `[number, number]`。",
    "onChange": "拖动过程中值变化时触发的回调。",
    "onChangeEnd": "拖动结束时触发的回调。",
    "min": "最小值。",
    "max": "最大值。",
    "step": "步进增量。",
    "orientation": "滑块的方向。",
    "formatValue": "用于显示和 `aria-valuetext` 的自定义值格式化函数。",
    "valueDisplay": "当前值的显示方式。",
    "marks": "指定位置上的刻度标记，可带标签。未填充的标记使用轨道颜色；填充区域内的标记（位于滑块处或其后，或范围模式中两个滑块之间）使用填充颜色。",
    "minStepsBetweenThumbs": "范围模式中滑块之间的最小步数；防止滑块重叠。",
    "isDisabled": "滑块是否禁用。",
    "htmlName": "用于表单提交的 HTML name 属性。渲染携带当前值的隐藏输入框（范围模式为两个条目）。",
    "disabledMessage": "解释滑块为何被禁用。与 isDisabled 搭配时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持滑块可聚焦（值更改仍被阻止）。请使用此属性，而不是用 Tooltip 包裹禁用的 Slider。禁用控件会吞掉外部 Tooltip 所需的悬停事件。",
    "isOptional": "字段是否可选。",
    "isRequired": "字段是否必填。",
    "isLabelHidden": "是否在视觉上隐藏标签。",
    "description": "在标签下方渲染的描述文本。",
    "status": "用于校验反馈的状态指示器对象（`{ type, message }`）。",
    "labelTooltip": "显示在标签旁信息图标上的工具提示文本。",
    "width": "字段宽度（数字 = 像素，字符串按原样使用，例如 \"100%\"）。设置整个字段（标签、控件和状态）的尺寸，使它们保持对齐。",
    "containerXstyle": "字段容器（标签、控件和状态一起）的 StyleX 样式。在 InputGroup 内无效（请改为设置 InputGroup 样式），在 `horizontal-labels` FormLayout 中也无效。不接受根级 `xstyle`、`className` 和 `style`。",
    "containerClassName": "字段容器的类名。定位方式与 `containerXstyle` 相同。",
    "containerStyle": "字段容器的内联样式。定位方式与 `containerXstyle` 相同。",
    "controlXstyle": "可视控件框的 StyleX 样式：绘制边框和背景并容纳图标和结束控件的元素。绝不是原生输入框。",
    "controlClassName": "可视控件框的类名。",
    "controlStyle": "可视控件框的内联样式。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  usage: {
    anatomy,
    description:
      'A draggable control for selecting a numeric value or range within defined bounds. Supports single value and range selection, tick marks, custom value formatting, and vertical orientation. Use it when users need to explore a continuous range, such as volume, price, or percentage. Under a finger, on any touch device, it tracks as UISlider does: only the thumb takes a drag, through a target larger than it, the value follows the finger’s travel rather than jumping to it, a release coasts on before `onChangeEnd`, a swipe from the track scrolls the page, and a tap on the track or a mark sets the value when the finger lifts (the thumb springs there). A mouse drag on a thumb tracks the same way, past the same 10 px in any direction, with no lift or coast; a mouse press on the track moves the thumb there, and only a primary click presses. A pen drags as a finger does, claiming only along the track, and its drag ends at the release with no coast. A wheel or a trackpad scroll over the slider goes to whatever scrolls under it.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Always provide a label, even if visually hidden, so the slider is accessible to screen readers.',
      },
      {
        guidance: true,
        description:
          'Format values with meaningful units like "$50" or "75%" instead of raw numbers.',
      },
      {
        guidance: false,
        description:
          'Use for precise numeric entry; pair with a text input or use NumberInput instead.',
      },
      {
        guidance: false,
        description:
          'Set a step size so large that only a few positions are possible; use SegmentedControl or radio buttons instead.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled slider in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
  propDescriptions: {
    containerXstyle:
      'StyleX styles for the field container; no effect in InputGroup or horizontal-labels FormLayout. No root xstyle/className/style.',
    containerClassName: 'Class name for the field container.',
    containerStyle: 'Inline styles for the field container.',
    controlXstyle:
      'StyleX styles for the visual control box (border, background, icons); not the native input.',
    controlClassName: 'Class name for the visual control box.',
    controlStyle: 'Inline styles for the visual control box.',
    label: 'Label text (always rendered for a11y).',
    value:
      'Current value; number for single thumb, [number, number] for range.',
    onChange: 'Fired on value change during drag.',
    onChangeEnd: 'Fired when drag ends.',
    min: 'Minimum value.',
    max: 'Maximum value.',
    step: 'Step increment.',
    orientation: 'Slider orientation.',
    formatValue: 'Custom value formatting fn for display + aria-valuetext.',
    valueDisplay: 'How current value is displayed.',
    marks:
      'Tick marks at specified positions w/ optional labels. Unfilled marks use the track color; filled marks use the accent color.',
    minStepsBetweenThumbs:
      'Min steps between thumbs in range mode; prevents overlap.',
    isDisabled: 'Whether slider is disabled.',
    htmlName:
      'HTML name attr; hidden inputs carry the value (two in range mode).',
    isOptional: 'Whether field is optional.',
    isRequired: 'Whether field is required.',
    isLabelHidden: 'Visually hide label.',
    description: 'Description text below label.',
    status: 'Status indicator ({type, message}) for validation feedback.',
    labelTooltip: 'Tooltip text for info icon next to label.',
  },
};
