// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Step',
  subComponentOf: 'Stepper',
  displayName: 'Step',
  group: 'Stepper',
  category: 'Navigation',
  isHiddenFromOverview: true,
  description:
    "Individual step within a Stepper. Renders a progress-bar segment, an indicator, and a label with optional description. Progress (completed/active/not-started) is derived from the parent Stepper's activeStep and this step's step index.",
  props: [
    {
      name: 'step',
      type: 'number',
      description:
        'Zero-based index of this step. Used to derive progress (completed/active/not-started) relative to the parent activeStep.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Step label text. Kept to a single line and ellipsized when the step is narrower than the label, so a row of horizontal steps stays the same height and the track under them stays straight. The full string is still read out as part of the step, so a truncated label costs nothing in the accessible name — but short labels survive narrow layouts better.',
      required: true,
    },
    {
      name: 'description',
      type: 'string',
      description:
        'Optional description shown below the label for additional context.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Content rendered below the label and description. Useful in vertical steppers for form fields or detailed step content. In a compact horizontal Stepper, the content remains mounted to preserve local state while it is hidden with the expanded step details.',
    },
    {
      name: 'status',
      type: "'accent' | 'success' | 'warning' | 'error'",
      description:
        'Semantic color for the step. Controls color only and maps to the global Astryx semantic tokens. Leave unset for the progress-derived default coloring.',
    },
    {
      name: 'indicator',
      type: "'auto' | 'number' | 'none' | ReactNode",
      description:
        "What to show as the step indicator. 'auto' shows a number until completed then a check, 'number' always shows a numbered badge, 'none' hides it, or pass any ReactNode (e.g. an Icon) for a fully custom indicator.",
      slotElements: [{__element: 'Icon', props: {icon: 'check', size: 'sm'}}],
      default: "'auto'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Disables interaction and dims the step indicator and label.',
      default: 'false',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description:
        'Marks the step as optional, appending an "Optional" affordance after the label.',
      default: 'false',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description: 'Trailing content rendered at the end of the label row.',
    },
    {
      name: 'density',
      type: "'compact' | 'balanced' | 'spacious'",
      description:
        'Controls vertical padding of the step. Falls back to the stepper-level density when unset.',
    },
  ],
  // A Step reads its progress from the parent Stepper's context and throws
  // without one, so the preview needs a real Stepper around it. Without this
  // block Step inherits Stepper's playground, which renders it bare and hands
  // it the parent's `activeStep`. The wrapper is vertical because that is the
  // orientation where one step shows its whole anatomy — indicator, label, and
  // description stacked — and `step` matches the wrapper's `activeStep` so the
  // preview opens on the current step rather than an inert upcoming one.
  playground: {
    wrapper: {
      component: 'Stepper',
      props: {activeStep: 1, orientation: 'vertical'},
    },
    defaults: {
      step: 1,
      label: 'Billing address',
      description: 'Used for invoices and tax',
    },
  },
};

export const docsZh = {
  "name": "Step",
  "description": "Stepper 中的单个步骤。渲染进度条片段、指示符和带可选描述的标签。进度（已完成/活动/未开始）根据父级 Stepper 的 `activeStep` 和此步骤的索引推导。",
  "propDescriptions": {
    "step": "此步骤的从零开始的索引。用于相对于父级 `activeStep` 推导进度（已完成/活动/未开始）。",
    "label": "步骤标签文本。保持单行；当步骤比标签窄时以省略号截断，因此一行水平步骤保持相同高度，其下方轨道保持笔直。完整字符串仍会作为步骤的一部分被读出，因此截断标签不会损失无障碍名称——但较短的标签在窄布局中更耐用。",
    "description": "显示在标签下方的可选描述，用于提供额外上下文。",
    "children": "渲染在标签和描述下方的内容。在垂直 Stepper 中适合放置表单字段或详细步骤内容。在紧凑水平 Stepper 中，内容保持挂载以保留本地状态，同时随展开的步骤详情一起隐藏。",
    "status": "步骤的语义颜色。仅控制颜色，并映射到全局 Astryx 语义令牌。留空则使用由进度推导的默认着色。",
    "indicator": "步骤指示符显示的内容。`'auto'` 在完成前显示数字，完成后显示对勾；`'number'` 始终显示数字徽章；`'none'` 隐藏指示符；也可以传入任意 ReactNode（例如 Icon）以实现完全自定义的指示符。",
    "isDisabled": "禁用交互，并使步骤指示符和标签变暗。",
    "isOptional": "将步骤标记为可选，在标签后附加“可选”提示。",
    "endContent": "渲染在标签行末端的尾部内容。",
    "density": "控制步骤的垂直内边距。未设置时回退到 Stepper 级别的密度。"
  }
};
