// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'CircleCheckIndicator',
  displayName: 'Circle Check Indicator',
  category: 'Form Controls',
  keywords: [
    'indicator',
    'checkbox',
    'circle',
    'check',
    'multiselect',
    'selection',
    'edit mode',
    'ios',
    'mark',
  ],
  description:
    'The iOS multiple-selection mark: an empty circle, a filled circle with a checkmark, or a filled circle with a bar for the partial state. A checkbox-family indicator: map it to `checkbox` with defineTheme({indicators}) and every CheckboxInput and CheckboxList draws it. Decorative (aria-hidden); the owning control keeps the input, role, accessible name, focus, and keyboard behavior. Its colors fade over the theme duration on every pointer and change at once under Reduce Motion.',
  props: [
    {
      name: 'state',
      type: "'unchecked' | 'checked' | 'indeterminate'",
      description:
        'Which state to draw. The unchecked circle is an empty ring, not nothing.',
      required: true,
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      description:
        'Control size. The circle draws at UIKit’s diameters, 18px (sm) or 21.8px (md), centred in the host’s 20px or 24px slot.',
      default: "'md'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Draws the disabled look. Purely visual; the owning control keeps the disabled semantics.',
      default: 'false',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Content drawn inside the circle instead of the mark, e.g. the loading Spinner CheckboxInput passes while a change is pending.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
  ],
  theming: {
    targets: [
      {
        className: 'astryx-circle-check-indicator',
        visualProps: ['size', 'checked', 'disabled'],
      },
      {className: 'astryx-circle-check-indicator-check', visualProps: ['size']},
      {className: 'astryx-circle-check-indicator-dash', visualProps: ['size']},
    ],
  },
  usage: {
    description:
      'Use it where iOS shows a selection circle: the rows of a list in edit mode, and multiple-choice sets whose product follows iOS. Map it to `checkbox` in a theme to change every checkbox at once, or render it in a row you lay out yourself.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Map it with defineTheme({indicators: {checkbox: CircleCheckIndicator}}) so CheckboxInput and CheckboxList keep their semantics and focus ring.',
      },
      {
        guidance: true,
        description:
          'Map it only in a theme meant for iOS. It draws the circle on every platform, and Android marks multiple choice with a square box.',
      },
      {
        guidance: true,
        description:
          'Keep a visible label beside it; the circle is decorative and announces nothing.',
      },
      {
        guidance: false,
        description:
          'Use it for a single choice; a radio, or a checkmark on the chosen row, says "one of these".',
      },
      {
        guidance: false,
        description:
          'Give it a role, a label or a tab stop; the owning control has those.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "CircleCheckIndicator",
  "displayName": "Circle Check Indicator",
  "description": "iOS 的多选标记：空心圆圈、带对勾的实心圆圈，或用于部分选中状态的带横条实心圆圈。它属于复选框族指示器：通过 defineTheme({indicators}) 将其映射到 `checkbox`，所有 CheckboxInput 和 CheckboxList 都会绘制它。装饰性（aria-hidden）；所属控件保留 input、角色、无障碍名称、焦点和键盘行为。其颜色会在每次指针操作时按主题时长渐变，并在“减少动态效果”下立即变化。",
  "usage": {
    "description": "在 iOS 显示选择圆圈的地方使用：编辑模式下列表的行，以及产品遵循 iOS 风格的多选题组。在主题中将其映射到 `checkbox` 可一次性改变所有复选框，也可在你自行布局的行中渲染它。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "使用 defineTheme({indicators: {checkbox: CircleCheckIndicator}}) 进行映射，使 CheckboxInput 和 CheckboxList 保留其语义和焦点环。"
      },
      {
        "guidance": true,
        "description": "仅在面向 iOS 的主题中映射它。它在所有平台都会绘制圆圈，而 Android 用方形方框表示多选。"
      },
      {
        "guidance": true,
        "description": "在其旁边保留可见标签；圆圈是装饰性的，不会朗读任何内容。"
      },
      {
        "guidance": false,
        "description": "不要将其用于单选；单选按钮或选中行上的对勾才表示“其中选一”。"
      },
      {
        "guidance": false,
        "description": "不要为它设置角色、标签或 Tab 停靠点；所属控件已拥有这些。"
      }
    ]
  },
  "propDescriptions": {
    "state": "要绘制的状态。未选中的圆圈是空心圆环，而不是什么都没有。",
    "size": "控件尺寸。圆圈按 UIKit 的直径绘制：18px（sm）或 21.8px（md），居中于宿主的 20px 或 24px 槽位。",
    "isDisabled": "绘制禁用外观。纯视觉；所属控件保留禁用语义。",
    "children": "在圆圈内绘制以替代标记的内容，例如 CheckboxInput 在变更待处理时传入的加载 Spinner。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值，不能是 style={{}} 这样的内联样式对象。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'iOS multiselect circle: empty ring / filled circle + check / filled circle + bar. Checkbox-family indicator; map to `checkbox` via defineTheme({indicators}).',
  usage: {
    description:
      'For iOS-style selection circles: edit-mode list rows and multiple-choice sets. Map it to `checkbox` in a theme, or render it in your own row.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Map via defineTheme({indicators: {checkbox: CircleCheckIndicator}}); hosts keep semantics + focus ring.',
      },
      {
        guidance: true,
        description: 'Keep a visible label; the circle is decorative.',
      },
      {
        guidance: false,
        description:
          'Use for a single choice (radio or row checkmark instead).',
      },
      {
        guidance: false,
        description:
          'Add role, label or tabIndex; the owning control has them.',
      },
    ],
  },
  propDescriptions: {
    state:
      "'unchecked' (empty ring) | 'checked' (check) | 'indeterminate' (bar).",
    size: "'sm' an 18px circle | 'md' a 21.8px circle (in a 20px or 24px slot).",
    isDisabled: 'Disabled look only; owner keeps semantics.',
    children: 'Drawn inside the circle instead of the mark (e.g. Spinner).',
    xstyle: 'StyleX layout styles; must be stylex.create() value.',
  },
};
