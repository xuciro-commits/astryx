// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'FormLayout',
  displayName: 'Form Layout',
  group: 'Layout',
  category: 'Layout',
  keywords: [
    'formlayout',
    'form',
    'fieldset',
    'formgroup',
    'formcontainer',
    'fields',
    'vertical',
    'horizontal',
  ],
  props: [
    {
      name: 'direction',
      type: "'vertical' | 'horizontal' | 'horizontal-labels'",
      description:
        'Controls field arrangement. Vertical stacks top-to-bottom, horizontal uses one fractional grid track per field in logical inline order, and horizontal-labels uses CSS Grid with labels beside inputs on the inline-start side (collapsing to vertical when the viewport is <=480px).',
      default: "'vertical'",
    },
    {
      name: 'defaultOptionality',
      type: "'optional' | 'required'",
      description:
        'The state the form treats as its default, so only the exception shows an optional/required indicator. With "optional", only fields marked isRequired show an indicator; with "required", only fields marked isOptional do. A field that restates the default shows nothing. Under "required" the unmarked fields also expose aria-required so screen readers match the visual default; aria-required only, never the native required attribute. CheckboxInput, Switch and CheckboxList are the exception: an unchecked box, an off switch or an empty group is an answer, so they take no required state from the default. A CheckboxInput or Switch is required only through its own isRequired. Leave unset for today\'s per-field behavior.',
    },
    {
      name: 'defaultEntryErrorBehavior',
      type: "'complete' | 'blur-or-enter'",
      description:
        "When DateInput, DateTimeInput, TimeInput, and NumberInput fields in the layout show their own entry errors: a date, time, or number the field rejects. It sets when the error shows, not when validation runs, so it is not React Aria's validationBehavior (native versus ARIA validation), and it never changes a caller status. 'complete' shows each error at the field's own moment. 'blur-or-enter' holds the message, aria-invalid, the invalid styling, the announcement, and the onEntryErrorChange report until Enter or blur; an edit that makes the entry valid or empty still clears the error at once. NumberInput shows its errors only at Enter or blur under both values. A field's own entryErrorBehavior wins. A nested FormLayout replaces the default for its fields, and unset there means 'complete'. Content in a layer, such as a Dialog opened from the form, starts without it. Leave unset for 'complete'.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Form fields to arrange. Accepts Astryx inputs (TextInput, Selector, etc.) and Field-wrapped custom controls.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
  ],
  theming: {
    targets: [{className: 'astryx-form-layout', visualProps: ['direction']}],
  },
  usage: {
    description:
      'A layout container that arranges form fields with consistent spacing and direction. FormLayout handles where fields go, not state or submission. Wrap it in a native <form> for that; <form> has no Astryx replacement, so it stays a plain element. Supports vertical (default), horizontal, and horizontal-labels directions, and can be nested to mix them.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Stack fields vertically for most forms. It's the easiest to scan top to bottom.",
      },
      {
        guidance: true,
        description:
          'Nest a horizontal FormLayout inside a vertical one when fields naturally pair up, like First Name + Last Name or City + State + ZIP.',
      },
      {
        guidance: true,
        description:
          'Use horizontal-labels for settings pages where labels sit beside their inputs.',
      },
      {
        guidance: false,
        description:
          "Use FormLayout for form state or submission. It's just layout. Wrap it in a native <form> for that.",
      },
      {
        guidance: false,
        description:
          'Put unrelated fields side by side in a horizontal layout. Save it for fields that belong together.',
      },
      {
        guidance: false,
        description:
          'Nest horizontal-labels inside another FormLayout. It uses CSS Grid and needs to be the outermost container.',
      },
    ],
    anatomy: [
      {
        name: 'Layout container',
        required: true,
        description:
          'Owns field arrangement, spacing, direction, and form-level optionality.',
      },
      {
        name: 'Form title',
        required: false,
        description: 'Heading that describes the purpose of the form.',
      },
      {
        name: 'Fields',
        required: true,
        description: 'Input components with labels for collecting user data.',
      },
      {
        name: 'Footer',
        required: false,
        description: 'Contains confirmation buttons such as Submit or Cancel.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "FormLayout",
  "displayName": "Form Layout",
  "props": [
    {
      "name": "direction",
      "type": "'vertical' | 'horizontal' | 'horizontal-labels'",
      "description": "控制字段排列。Vertical 从上到下堆叠；horizontal 按逻辑行内顺序为每个字段使用一条分数网格轨道；horizontal-labels 使用 CSS Grid，标签位于输入框的行内起始侧（视口 <=480px 时折叠为垂直布局）。",
      "default": "'vertical'"
    },
    {
      "name": "defaultOptionality",
      "type": "'optional' | 'required'",
      "description": "表单视为默认的状态，因此只有例外项才显示可选/必填指示。设为 \"optional\" 时，只有标记 isRequired 的字段显示指示；设为 \"required\" 时，只有标记 isOptional 的字段显示指示。与默认状态一致的字段不显示任何指示。在 \"required\" 下，未标记的字段还会暴露 aria-required，使屏幕阅读器的行为与视觉默认值一致；仅使用 aria-required，绝不使用原生的 required 属性。CheckboxInput、Switch 和 CheckboxList 是例外：未勾选的复选框、关闭的开关或空组本身就是一种回答，因此它们不从默认值获得必填状态。CheckboxInput 或 Switch 只能通过自身的 isRequired 设为必填。留空以保持当前的逐字段行为。"
    },
    {
      "name": "defaultEntryErrorBehavior",
      "type": "'complete' | 'blur-or-enter'",
      "description": "控制布局中的 DateInput、DateTimeInput、TimeInput 和 NumberInput 字段何时显示自身的输入错误（字段拒绝的日期、时间或数字）。它设置错误的显示时机，而不是验证的运行时机，因此不是 React Aria 的 validationBehavior（原生验证与 ARIA 验证之别），也绝不会更改调用方的状态。'complete' 在字段自身的时机显示每个错误。'blur-or-enter' 会将消息、aria-invalid、无效样式、播报和 onEntryErrorChange 报告保持到按下 Enter 或失焦为止；使输入变为有效或空的编辑仍会立即清除错误。无论取哪个值，NumberInput 都只在按下 Enter 或失焦时显示错误。字段自身的 entryErrorBehavior 优先。嵌套的 FormLayout 会替换其字段的默认值，其中未设置表示 'complete'。位于图层中的内容（例如从表单打开的 Dialog）初始不继承该设置。留空表示 'complete'。"
    },
    {
      "name": "children",
      "type": "ReactNode",
      "description": "要排列的表单字段。接受 Astryx 输入组件（TextInput、Selector 等）以及用 Field 包裹的自定义控件。"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值，而不是 style={{}} 这样的内联样式对象。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-form-layout",
        "visualProps": [
          "direction"
        ]
      }
    ]
  },
  "usage": {
    "description": "以一致的间距和方向排列表单字段的布局容器。FormLayout 只负责字段的摆放位置，不负责状态或提交。如需状态或提交，请将其包裹在原生 <form> 中；<form> 没有 Astryx 替代品，因此保持为普通元素。支持 vertical（默认）、horizontal 和 horizontal-labels 方向，并可嵌套混用。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "大多数表单采用垂直堆叠字段，这样最容易从上到下浏览。"
      },
      {
        "guidance": true,
        "description": "当字段自然成对时（如 First Name + Last Name 或 City + State + ZIP），在垂直 FormLayout 中嵌套水平 FormLayout。"
      },
      {
        "guidance": true,
        "description": "在标签位于输入框旁的设置页面中使用 horizontal-labels。"
      },
      {
        "guidance": false,
        "description": "将 FormLayout 用于表单状态或提交。它只是布局，状态或提交应改用原生 <form> 包裹。"
      },
      {
        "guidance": false,
        "description": "在水平布局中并排放置不相关的字段。水平布局应留给属于同一组的字段。"
      },
      {
        "guidance": false,
        "description": "将 horizontal-labels 嵌套在另一个 FormLayout 内。它使用 CSS Grid，必须是最外层容器。"
      }
    ],
    "anatomy": [
      {
        "name": "布局容器",
        "required": true,
        "description": "负责字段排列、间距、方向以及表单级的可选性。"
      },
      {
        "name": "表单标题",
        "required": false,
        "description": "描述表单用途的标题。"
      },
      {
        "name": "字段",
        "required": true,
        "description": "带标签、用于收集用户数据的输入组件。"
      },
      {
        "name": "页脚",
        "required": false,
        "description": "包含 Submit 或 Cancel 等确认按钮。"
      }
    ]
  },
  "propDescriptions": {
    "direction": "控制字段排列。Vertical 从上到下堆叠；horizontal 按逻辑行内顺序为每个字段使用一条分数网格轨道；horizontal-labels 使用 CSS Grid，标签位于输入框的行内起始侧（视口 <=480px 时折叠为垂直布局）。",
    "defaultOptionality": "表单视为默认的状态，因此只有例外项才显示可选/必填指示。设为 \"optional\" 时，只有标记 isRequired 的字段显示指示；设为 \"required\" 时，只有标记 isOptional 的字段显示指示。与默认状态一致的字段不显示任何指示。在 \"required\" 下，未标记的字段还会暴露 aria-required，使屏幕阅读器的行为与视觉默认值一致；仅使用 aria-required，绝不使用原生的 required 属性。CheckboxInput、Switch 和 CheckboxList 是例外：未勾选的复选框、关闭的开关或空组本身就是一种回答，因此它们不从默认值获得必填状态。CheckboxInput 或 Switch 只能通过自身的 isRequired 设为必填。留空以保持当前的逐字段行为。",
    "defaultEntryErrorBehavior": "控制布局中的 DateInput、DateTimeInput、TimeInput 和 NumberInput 字段何时显示自身的输入错误（字段拒绝的日期、时间或数字）。它设置错误的显示时机，而不是验证的运行时机，因此不是 React Aria 的 validationBehavior（原生验证与 ARIA 验证之别），也绝不会更改调用方的状态。'complete' 在字段自身的时机显示每个错误。'blur-or-enter' 会将消息、aria-invalid、无效样式、播报和 onEntryErrorChange 报告保持到按下 Enter 或失焦为止；使输入变为有效或空的编辑仍会立即清除错误。无论取哪个值，NumberInput 都只在按下 Enter 或失焦时显示错误。字段自身的 entryErrorBehavior 优先。嵌套的 FormLayout 会替换其字段的默认值，其中未设置表示 'complete'。位于图层中的内容（例如从表单打开的 Dialog）初始不继承该设置。留空表示 'complete'。",
    "children": "要排列的表单字段。接受 Astryx 输入组件（TextInput、Selector 等）以及用 Field 包裹的自定义控件。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值，而不是 style={{}} 这样的内联样式对象。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Layout container for form fields w/ consistent spacing + direction.',
  usage: {
    description:
      'A layout container that arranges form fields with consistent spacing and direction. FormLayout handles where fields go, not state or submission. Wrap it in a native <form> for that; <form> has no Astryx replacement, so it stays a plain element. Supports vertical (default), horizontal, and horizontal-labels directions, and can be nested to mix them.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Stack fields vertically for most forms. It's the easiest to scan top to bottom.",
      },
      {
        guidance: true,
        description:
          'Nest a horizontal FormLayout inside a vertical one when fields naturally pair up, like First Name + Last Name or City + State + ZIP.',
      },
      {
        guidance: true,
        description:
          'Use horizontal-labels for settings pages where labels sit beside their inputs.',
      },
      {
        guidance: false,
        description:
          "Use FormLayout for form state or submission. It's just layout. Wrap it in a native <form> for that.",
      },
      {
        guidance: false,
        description:
          'Put unrelated fields side by side in a horizontal layout. Save it for fields that belong together.',
      },
      {
        guidance: false,
        description:
          'Nest horizontal-labels inside another FormLayout. It uses CSS Grid and needs to be the outermost container.',
      },
    ],
    anatomy: [
      {
        name: 'Layout container',
        required: true,
        description:
          'Owns field arrangement, spacing, direction, and form-level optionality.',
      },
      {
        name: 'Form title',
        required: false,
        description: 'Heading that describes the purpose of the form.',
      },
      {
        name: 'Fields',
        required: true,
        description: 'Input components with labels for collecting user data.',
      },
      {
        name: 'Footer',
        required: false,
        description: 'Contains confirmation buttons such as Submit or Cancel.',
      },
    ],
  },
  propDescriptions: {
    direction:
      'Field arrangement. Vertical stacks top-to-bottom; horizontal uses one fractional grid track per field in logical inline order; horizontal-labels places labels on the inline-start side and collapses when the viewport is <=480px.',
    defaultOptionality:
      'State the form treats as default, so only the exception is marked. "optional" → only isRequired fields show an indicator; "required" → only isOptional fields do. Under "required" unmarked fields also expose aria-required (aria only, not native required), except CheckboxInput, Switch and CheckboxList, which take no required state from it (CheckboxInput and Switch are required only through their own isRequired). Unset = per-field behavior.',
    defaultEntryErrorBehavior:
      "'complete'|'blur-or-enter': when DateInput/DateTimeInput/TimeInput/NumberInput fields show their own rejections (not when validation runs; not React Aria validationBehavior; never changes status). blur-or-enter: message, aria-invalid, styling, announcement, onEntryErrorChange report wait for Enter/blur; valid or empty entry clears at once. NumberInput waits under both. Field prop wins; nested FormLayout replaces it (unset = complete); layers start without it. Unset = complete.",
    children:
      'Form fields to arrange. Accepts Astryx inputs + Field-wrapped custom controls.',
    xstyle:
      'StyleX styles for layout customization. Must be stylex.create() value.',
  },
};
