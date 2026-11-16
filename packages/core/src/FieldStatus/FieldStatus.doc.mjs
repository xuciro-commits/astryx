// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Message box',
    required: true,
    description: 'Painted container for the validation feedback.',
  },
  {
    name: 'Detached icon',
    required: false,
    description: 'Leading status glyph shown only by the detached variant.',
  },
  {
    name: 'Message text',
    required: true,
    description: 'Text describing the validation status.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'FieldStatus',
  displayName: 'Field Status',
  group: 'Field',
  category: 'Form Controls',
  isHiddenFromOverview: true,
  description:
    'Status message component for form field validation feedback. Messages are announced to screen readers through persistent live regions (assertive for errors, polite otherwise), so conditional mounting is safe.',
  theming: {
    targets: [
      {className: 'astryx-field-status', visualProps: ['type', 'variant']},
      {className: 'astryx-field-status-icon', visualProps: ['type']},
    ],
  },
  props: [
    {
      name: 'type',
      type: "'error' | 'warning' | 'success'",
      description: 'Status type.',
      required: true,
    },
    {
      name: 'message',
      type: 'string',
      description: 'Status message text.',
      required: true,
    },
    {
      name: 'id',
      type: 'string',
      description: 'ID for aria-describedby association.',
    },
    {
      name: 'variant',
      type: "'attached' | 'detached'",
      description:
        'Visual variant: attached overlaps the input, detached floats below.',
      default: "'attached'",
    },
  ],
  usage: {
    description:
      'FieldStatus renders validation feedback for fields and field-like controls. Use it directly for custom controls that need the same error, warning, or success presentation as Field.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use attached status below bordered inputs when the message belongs to that input.',
      },
      {
        guidance: true,
        description:
          'Use detached status for controls like checkboxes, switches, and custom controls where overlap would be visually awkward.',
      },
      {
        guidance: false,
        description:
          'Use FieldStatus for general alerts or page-level notices; use Banner or Toast instead.',
      },
      {
        guidance: true,
        description:
          "A field's status is announced when it first appears and when its message or type changes, not again when a repeated submit fails with the same errors. On such a repeated submit, with the errors unchanged, announce it once from the form with useAnnounce, for example announce(`${errors.length} errors. ${errors[0]}`, 'assertive'), and move focus to the first invalid field. On a first failed submit the fields announce their own errors, so the form adds no announcement.",
      },
    ],
    anatomy,
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Validation feedback message for fields/custom controls. Supports error, warning, success and attached/detached variants. Announced via persistent live regions (assertive for errors, polite otherwise).',
  usage: {
    bestPractices: [
      {
        guidance: true,
        description:
          'Use attached status below bordered inputs when message belongs to that input.',
      },
      {
        guidance: true,
        description:
          'Use detached status for checkboxes, switches, and custom controls where overlap is visually awkward.',
      },
      {
        guidance: false,
        description:
          'Use FieldStatus for general alerts or page-level notices; use Banner or Toast instead.',
      },
      {
        guidance: true,
        description:
          'Status announces when it appears and on message/type change only. On a repeated submit with unchanged errors, the form announces once via useAnnounce (error count + first error) and focuses the first invalid field.',
      },
    ],
    anatomy,
  },
  propDescriptions: {
    type: 'error/warning/success status tone',
    message: 'visible validation feedback text',
    id: 'id for aria-describedby association',
    variant: 'attached overlaps input; detached floats below',
  },
};

export const docsZh = {
  "name": "FieldStatus",
  "displayName": "Field Status",
  "description": "用于表单字段验证反馈的状态消息组件。消息通过常驻 live region 向屏幕阅读器朗读（错误为 assertive，其他为 polite），因此条件挂载是安全的。",
  "usage": {
    "description": "FieldStatus 为字段和类字段控件渲染验证反馈。对于需要与 Field 相同的错误、警告或成功呈现的自定义控件，可直接使用它。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "当消息属于带边框输入时，使用紧贴（attached）状态。"
      },
      {
        "guidance": true,
        "description": "对于复选框、开关和自定义控件等重叠会在视觉上显得尴尬的控件，使用分离（detached）状态。"
      },
      {
        "guidance": false,
        "description": "不要将 FieldStatus 用于一般警报或页面级通知；请改用 Banner 或 Toast。"
      },
      {
        "guidance": true,
        "description": "字段的状态在首次出现时以及消息或类型变化时朗读，重复提交失败且错误相同时不会再次朗读。对于错误未变的重复提交，请通过表单使用 `useAnnounce` 朗读一次，例如 `announce(`${errors.length} errors. ${errors[0]}`, 'assertive')`，并将焦点移到第一个无效字段。首次提交失败时，字段会自行朗读错误，因此表单不再添加朗读。"
      }
    ],
    "anatomy": [
      {
        "name": "消息框",
        "required": true,
        "description": "验证反馈的绘制容器。"
      },
      {
        "name": "分离图标",
        "required": false,
        "description": "仅分离变体显示的前置状态字形。"
      },
      {
        "name": "消息文本",
        "required": true,
        "description": "描述验证状态的文本。"
      }
    ]
  },
  "propDescriptions": {
    "type": "状态类型。",
    "message": "状态消息文本。",
    "id": "用于 aria-describedby 关联的 ID。",
    "variant": "视觉变体：attached 与输入重叠，detached 浮动在下方。"
  }
};
