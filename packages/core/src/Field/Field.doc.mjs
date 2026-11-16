// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Field',
  displayName: 'Field',
  group: 'Field',
  category: 'Form Controls',
  keywords: ["field","formfield","formgroup","formcontrol","label","input","required","optional","helpertext","hint"],
  playground: {
    defaults: {
      label: 'Email address',
      inputID: 'email-input',
      description: 'Use Field for controls that do not already provide field under the hood.',
      descriptionID: 'email-help',
      children: {
        __element: 'input',
        props: {
          id: 'email-input',
          'aria-describedby': 'email-help',
          placeholder: 'you@example.com',
          type: 'email',
        },
      },
    },
  },
  theming: {
    targets: [
      {className: 'astryx-field', visualProps: ['layout']},
      {className: 'astryx-field-label'},
      {className: 'astryx-field-status', visualProps: ['type', 'variant']},
      {
        className: 'astryx-input-status-icon',
        visualProps: ['size', 'status'],
      },
      {className: 'astryx-input-clear-button'},
      {className: 'astryx-input-clear-icon'},
    ],
    vars: [
      {name: '--_field-radius', description: 'Border radius of input fields', default: 'var(--radius-element)', private: true},
      {name: '--_field-status-overlap', description: 'Amount an attached FieldStatus extends behind the lower half of the control. Set from the rendered control size.', default: 'calc(var(--size-element-md) / 2)', private: true},
    ],
    derived: [
      {property: 'borderRadius', vars: ['--_field-radius']},
    ],
  },
  description: 'Low-level form field wrapper for custom controls that need a label, description, and optional/required indicators.',
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Label text for the field (always rendered for accessibility).',
      required: true,
    },
    {
      name: 'inputID',
      type: 'string',
      description: 'ID for the input element (used for the label htmlFor attribute).',
      required: true,
    },
    {
      name: 'labelID',
      type: 'string',
      description: 'ID applied to the label element itself for group accessibility.',
    },
    {
      name: 'isGroupLabel',
      type: 'boolean',
      description: 'Renders the label as a span for control groups (radiogroup, checkbox list).',
      default: 'false',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The input or control to render.',
      required: true,
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Visually hide the label (still accessible to screen readers).',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the associated input is disabled. Propagates disabled styling to the label.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Description text displayed between the label and input.',
    },
    {
      name: 'descriptionID',
      type: 'string',
      description: 'ID for the description element (use for aria-describedby on the input).',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: 'Whether the field is optional (mutually exclusive with isRequired).',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Whether the field is required (mutually exclusive with isOptional).',
      default: 'false',
    },
    {
      name: 'labelIcon',
      type: 'ReactNode | IconType',
      description: 'Icon to display before the label text. See `astryx docs icons` for valid semantic names.',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description:
        'Help text for an info button after the label, named "About {label}". Hover and keyboard focus preview it; a tap, click, Enter, or Space opens it and never focuses or toggles the control.',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string, messageID?: string}",
      description: 'Status indicator with type and optional message. When message is set, displays a colored status box. messageID is for wiring aria-describedby on the input.',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description: 'How status feedback is placed. Attached overlaps an eligible opaque, bordered, fixed-height control; detached renders a message below custom or non-bordered controls; tooltip leaves the visible affordance to the wrapped input and announces its message without a FieldStatus box.',
      default: "'attached'",
    },
    {
      name: 'width',
      type: 'SizeValue',
      description: 'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned. Prefer this over setting width via xstyle/className/style, which only size the inner control box. Without a width, a row can shrink the whole field below the natural width of its control, so filter bars shrink instead of overflowing.',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLDivElement>',
      description: 'Ref forwarded to the root element.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'CSS class name(s) appended to the root element. Prefer xstyle for StyleX deduplication.',
    },
    {
      name: 'style',
      type: 'React.CSSProperties',
      description: 'Inline styles applied to the root element. Takes priority over StyleX inline styles.',
    },
  ],
  components: [
    {name: 'FieldLabel'},
    {name: 'FieldStatus'},
  ],
  usage: {
    description: 'Field is a low-level wrapper for custom, native, or third-party controls that do not already provide field label, description, and status UI. Use it when you need the Field shell around a control you own; use styled Astryx inputs like TextInput, Typeahead, and Select directly when they already expose label, description, and validation props.',
    bestPractices: [
      { guidance: true, description: 'Wrap custom controls, native inputs, or third-party widgets that need labeling, helper text, optional/required indicators, or validation status.' },
      { guidance: true, description: 'Always provide a label for accessibility, even if visually hidden with isLabelHidden.' },
      { guidance: true, description: 'Use inputID and descriptionID to connect the label and description to the inner control with htmlFor and aria-describedby.' },
      { guidance: false, description: 'Nest Field around styled inputs such as TextInput, Typeahead, Select, DateInput, or TextArea; those components already render their own Field shell.' },
      { guidance: true, description: 'Use attached status only when the wrapped control is opaque, bordered, and fixed-height; use detached for custom, tall, translucent, or non-bordered controls.' },
      { guidance: false, description: 'Set both isOptional and isRequired on the same field.' },
      { guidance: false, description: 'Hide the label without providing an alternative way for the user to understand the field purpose.' },
    ],
    anatomy: [
      {name: 'Container', required: true, description: 'Root field box that owns layout, width, and local stacking for the label, control, and status.'},
      {name: 'Label', required: true, description: 'Text identifying the field. Always rendered for accessibility, optionally hidden visually.'},
      {name: 'Ordinary description', required: false, description: 'Helper text under the label in the ordinary field layout.'},
      {name: 'Horizontal-label description', required: false, description: 'Helper text in the control column when FormLayout owns horizontal labels.'},
      {name: 'Control slot', required: true, description: 'A custom, native, or third-party control that does not already render a field shell.'},
      {name: 'Status message', required: false, description: 'Inline validation feedback showing error, warning, or success with a message.'},
      {name: 'Input status icon', required: false, description: 'Shared status affordance used by Field-composed input controls.'},
      {name: 'Input clear button', required: false, description: 'Shared clear action used by Field-composed input controls.'},
      {name: 'Input clear icon', required: false, description: 'Glyph inside the shared input clear action.'},
      {name: 'Optional/Required indicator', required: false, description: 'Badge next to the label showing whether the field is optional or required.'},
      {name: 'Label tooltip trigger', required: false, description: 'Info icon beside the label that opens explanatory content.'},
      {name: 'Label tooltip surface', required: false, description: 'Layer-hosted explanatory content for the label tooltip.'},
    ],
  },
  examples: [
    {
      label: 'Filter bar',
      code: `
import {useState} from 'react';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {Selector} from '@astryxdesign/core/Selector';
import {StackItem} from '@astryxdesign/core/Stack';
import {TextInput} from '@astryxdesign/core/TextInput';

// Every Field-based input (TextInput, Selector, DateInput, ...) can be shrunk
// by its row, so a filter bar never pushes the page sideways. Let the row wrap
// so that on a phone the search box keeps a full line and the selectors move
// below it; on wider screens everything stays on one line, with the search box
// taking the free space.
function OrdersFilterBar() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Awaiting fulfillment');
  const [region, setRegion] = useState('All regions');
  const [sort, setSort] = useState('Newest first');
  return (
    <HStack gap={2} wrap="wrap" vAlign="center">
      <StackItem size="fill">
        <TextInput
          label="Search orders"
          isLabelHidden
          placeholder="Search by order or customer"
          startIcon={<Icon icon="search" />}
          value={query}
          onChange={setQuery}
        />
      </StackItem>
      <Selector
        label="Status"
        isLabelHidden
        options={['All statuses', 'Awaiting fulfillment', 'Shipped', 'Delivered', 'Returned']}
        value={status}
        onChange={setStatus}
      />
      <Selector
        label="Region"
        isLabelHidden
        options={['All regions', 'North America', 'Europe', 'Asia Pacific']}
        value={region}
        onChange={setRegion}
      />
      <Selector
        label="Sort"
        isLabelHidden
        options={['Newest first', 'Oldest first', 'Highest total']}
        value={sort}
        onChange={setSort}
      />
    </HStack>
  );
}
`,
    },
    {
      label: 'Wrap a custom control',
      code: `
function CustomSliderField() {
  return (
    <Field
      label="Confidence"
      inputID="confidence-slider"
      description="Choose how strict the review should be."
      descriptionID="confidence-help"
      status={{type: 'success', message: 'Recommended default'}}
      statusVariant="detached">
      <input
        id="confidence-slider"
        type="range"
        min={0}
        max={100}
        defaultValue={60}
        aria-describedby="confidence-help"
      />
    </Field>
  );
}
`,
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "`Field` 是用于自定义、原生或第三方控件的底层包装组件，这些控件本身不提供字段标签、描述和状态 UI。当你需要为自己掌控的控件套用 `Field` 外壳时使用它；如果 `TextInput`、`Typeahead`、`Select` 等带样式的 Astryx 输入组件已经提供标签、描述和校验属性，请直接使用这些组件。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "包裹需要标签、辅助文本、可选/必填指示器或校验状态的自定义控件、原生输入或第三方组件。"
      },
      {
        "guidance": true,
        "description": "始终提供标签以满足无障碍要求，即使通过 `isLabelHidden` 在视觉上隐藏。"
      },
      {
        "guidance": true,
        "description": "使用 `inputID` 和 `descriptionID`，通过 `htmlFor` 和 `aria-describedby` 将标签和描述关联到内部控件。"
      },
      {
        "guidance": false,
        "description": "在 `TextInput`、`Typeahead`、`Select`、`DateInput` 或 `TextArea` 等带样式的输入组件外再嵌套 `Field`；这些组件已经渲染了自己的 `Field` 外壳。"
      },
      {
        "guidance": true,
        "description": "仅当被包裹控件不透明、有边框且高度固定时使用附着式状态；自定义、较高、半透明或无边框的控件请使用分离式状态。"
      },
      {
        "guidance": false,
        "description": "在同一字段上同时设置 `isOptional` 和 `isRequired`。"
      },
      {
        "guidance": false,
        "description": "隐藏标签，且不提供其他方式让用户理解字段用途。"
      }
    ],
    "anatomy": [
      {
        "name": "容器",
        "required": true,
        "description": "根字段盒，负责标签、控件和状态的布局、宽度及局部层叠。"
      },
      {
        "name": "标签",
        "required": true,
        "description": "标识字段的文本。始终为无障碍而渲染，也可选择在视觉上隐藏。"
      },
      {
        "name": "普通描述",
        "required": false,
        "description": "普通字段布局中位于标签下方的辅助文本。"
      },
      {
        "name": "水平标签描述",
        "required": false,
        "description": "当 `FormLayout` 使用水平标签时，位于控件列中的辅助文本。"
      },
      {
        "name": "控件插槽",
        "required": true,
        "description": "尚未渲染字段外壳的自定义、原生或第三方控件。"
      },
      {
        "name": "状态消息",
        "required": false,
        "description": "内联校验反馈，显示错误、警告或成功状态及消息。"
      },
      {
        "name": "输入状态图标",
        "required": false,
        "description": "由 `Field` 组合的输入控件使用的共享状态提示。"
      },
      {
        "name": "输入清除按钮",
        "required": false,
        "description": "由 `Field` 组合的输入控件使用的共享清除操作。"
      },
      {
        "name": "输入清除图标",
        "required": false,
        "description": "共享输入清除操作内的图标。"
      },
      {
        "name": "可选/必填指示器",
        "required": false,
        "description": "标签旁的徽标，显示字段是可选还是必填。"
      },
      {
        "name": "标签工具提示触发器",
        "required": false,
        "description": "标签旁的信息图标，用于打开说明内容。"
      },
      {
        "name": "标签工具提示表面",
        "required": false,
        "description": "由层承载的标签工具提示说明内容。"
      }
    ]
  },
  "name": "Field",
  "description": "底层表单字段包装组件，用于需要标签、描述以及可选/必填指示器的自定义控件。",
  "propDescriptions": {
    "label": "字段的标签文本（始终为无障碍而渲染）。",
    "inputID": "输入元素的 ID（用于标签的 `htmlFor` 属性）。",
    "labelID": "应用于标签元素本身的 ID，用于分组无障碍。",
    "isGroupLabel": "为控件组（radiogroup、复选框列表）将标签渲染为 `span`。",
    "children": "要渲染的输入或控件。",
    "isLabelHidden": "在视觉上隐藏标签（屏幕阅读器仍可访问）。",
    "isDisabled": "关联输入是否禁用。会将禁用样式传播到标签。",
    "description": "显示在标签和输入之间的描述文本。",
    "descriptionID": "描述元素的 ID（用于输入上的 `aria-describedby`）。",
    "isOptional": "字段是否为可选（与 `isRequired` 互斥）。",
    "isRequired": "字段是否为必填（与 `isOptional` 互斥）。",
    "labelIcon": "显示在标签文本之前的图标。有效语义名称参见 `astryx docs icons`。",
    "labelTooltip": "标签后信息按钮的帮助文本，名称为“关于 {label}”。悬停和键盘聚焦会预览它；点按、点击、Enter 或 Space 会打开它，且绝不会聚焦或切换控件。",
    "status": "包含类型和可选消息的状态指示器。设置 `message` 时，显示带颜色的状态框。`messageID` 用于在输入上关联 `aria-describedby`。",
    "statusVariant": "状态反馈的放置方式。`attached` 叠加在符合条件的不透明、有边框、固定高度控件上；`detached` 在自定义或无边框控件下方渲染消息；`tooltip` 将可见提示留给被包裹的输入，并在没有 `FieldStatus` 框的情况下朗读其消息。",
    "width": "字段宽度（数字表示像素，字符串原样使用，例如 `\"100%\"`）。会调整整个字段（标签、控件和状态）的尺寸，使其保持对齐。优先使用此属性，而不是通过 `xstyle`/`className`/`style` 设置宽度，后者只会调整内部控件盒的尺寸。未设置宽度时，一行可能将整个字段压缩到小于其控件自然宽度，导致筛选栏收缩而不是溢出。",
    "ref": "转发到根元素的 ref。",
    "xstyle": "用于布局定制（外边距、定位、尺寸）的 StyleX 样式。必须是 `stylex.create()` 的值，而不是 `style={{}}` 这类内联样式对象。",
    "className": "追加到根元素的 CSS 类名。优先使用 `xstyle` 以进行 StyleX 去重。",
    "style": "应用于根元素的内联样式。优先于 StyleX 内联样式。"
  },
  "components": [
    {
      "name": "FieldLabel",
      "description": ""
    },
    {
      "name": "FieldStatus",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Low-level field shell for custom controls needing label/description/status.',
  usage: {
    description: 'Field wraps custom/native/third-party controls lacking field UI. Use TextInput, Typeahead, Select, DateInput, or TextArea directly when they already expose label/description/status props.',
    bestPractices: [
      { guidance: true, description: 'Wrap custom controls/widgets that need labeling, helper text, optional/required indicators, or validation status.' },
      { guidance: true, description: 'Always provide a label; visually hide it only when context is clear.' },
      { guidance: true, description: 'Wire inputID/descriptionID to htmlFor and aria-describedby on the inner control.' },
      { guidance: false, description: 'Nest Field around styled inputs; it double-renders labels and status UI.' },
      { guidance: true, description: 'Use attached status only for opaque, bordered, fixed-height controls; use detached for custom, tall, translucent, or non-bordered controls.' },
      { guidance: false, description: 'Set both isOptional and isRequired on the same field.' },
      { guidance: false, description: 'Hide the label without another way to understand field purpose.' },
    ],
  },
};
