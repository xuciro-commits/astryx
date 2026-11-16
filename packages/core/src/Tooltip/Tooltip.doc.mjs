// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Tooltip surface',
    required: true,
    description: 'Painted overlay surface that presents the tooltip.',
  },
  {
    name: 'Tooltip text',
    required: true,
    description: 'Tooltip content rendered within the surface.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Tooltip',
  displayName: 'Tooltip',
  group: 'Tooltip',
  category: 'Overlay',
  playground: {
    defaults: {
      content: 'Helpful tooltip text',
      children: {
        __element: 'Button',
        props: {label: 'Hover me', variant: 'secondary'},
      },
    },
  },
  keywords: [
    'tooltip',
    'hint',
    'infotip',
    'title',
    'hover',
    'flyout',
    'balloon',
    'helpertext',
  ],
  components: [
    {
      name: 'Tooltip',
      displayName: 'Tooltip',
      description:
        'Component wrapper for tooltip display triggered on hover or focus.',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description: 'Trigger element(s) that activate the tooltip.',
        },
        {
          name: 'anchorRef',
          type: 'RefObject<HTMLElement>',
          description: 'External anchor ref for sibling mode.',
        },
        {
          name: 'content',
          type: 'ReactNode',
          description: 'Tooltip content, typically short text.',
          slotElements: [
            {
              __element: 'Text',
              props: {type: 'body'},
              children: 'Content text',
            },
          ],
        },
        {
          name: 'placement',
          type: "'above' | 'below' | 'start' | 'end'",
          description:
            "Position relative to the anchor element. Logical: start/end resolve against the popover\'s own inherited direction (RTL mirrors in pure CSS).",
          default: "'above'",
        },
        {
          name: 'alignment',
          type: "'start' | 'center' | 'end'",
          description:
            "Alignment along the placement axis. Logical: start/end resolve against the popover\'s own inherited direction (RTL mirrors in pure CSS).",
          default: "'center'",
        },
        {
          name: 'delay',
          type: 'number',
          description: 'Show delay in milliseconds.',
          default: '200',
        },
        {
          name: 'hideDelay',
          type: 'number',
          description: 'Hide delay in milliseconds.',
          default: '0',
        },
        {
          name: 'focusTrigger',
          type: "'auto' | 'always' | 'never'",
          description: 'Controls when focus events trigger the tooltip.',
          default: "'auto'",
        },
        {
          name: 'touchTrigger',
          type: "'auto' | 'tap' | 'none'",
          description:
            'What a tap does where there is no hover. auto opens on tap unless the trigger performs an action of its own (a button, link, or form control), whose tap belongs to the control; an aria-disabled control performs none, so a tap on it opens its reason. tap always opens, for a button whose only job is to reveal the tooltip; for an info icon, use InfoTip. none never opens on touch.',
          default: "'auto'",
        },
        {
          name: 'isEnabled',
          type: 'boolean',
          description: 'Enables or disables the tooltip triggers.',
          default: 'true',
        },
        {
          name: 'onOpenChange',
          type: '(isOpen: boolean) => void',
          description:
            'Callback fired when tooltip visibility changes. Called with true when shown and false when hidden.',
        },
        {
          name: 'hasHoverIndication',
          type: "'auto' | boolean",
          description: 'Shows a dashed underline on the trigger element.',
          default: "'auto'",
        },
        {
          name: 'isDefaultOpen',
          type: 'boolean',
          description:
            'Whether the tooltip should be shown on mount. Still dismissible.',
        },
        {
          name: 'isOpen',
          type: 'boolean',
          description:
            'Controlled open state for the tooltip. Held closed, focus that would open it calls onOpenChange(true) and shows nothing; held open, Escape calls onOpenChange(false) and it stays.',
        },
      ],
    },
  ],
  theming: {
    targets: [{className: 'astryx-tooltip'}],
  },
  usage: {
    anatomy,
    description:
      'A short text hint that appears on hover or focus, anchored to a trigger element. Use it to describe icon-only buttons, show the full text of truncated labels, or provide supplementary context without cluttering the UI.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep tooltip content concise: aim for under 140 characters of plain text.',
      },
      {
        guidance: true,
        description:
          'Add a tooltip to icon-only buttons and controls that lack a visible label.',
      },
      {
        guidance: true,
        description:
          'Set touchTrigger to tap when the trigger is a button whose only job is revealing the tooltip: touch has no hover, and auto keeps the tap for triggers that perform an action. For an info icon, use InfoTip, which also pins its help on a press.',
      },
      {
        guidance: false,
        description:
          'Place interactive elements like links or buttons inside a tooltip; use HoverCard or Popover instead.',
      },
      {
        guidance: false,
        description:
          'Use tooltips for essential information that users must see to complete a task.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Tooltip",
  "displayName": "Tooltip",
  "components": [
    {
      "name": "Tooltip",
      "displayName": "Tooltip",
      "description": "用于在悬停或聚焦时触发 Tooltip 显示的组件包装器。",
      "props": [
        {
          "name": "children",
          "type": "ReactNode",
          "description": "激活工具提示的触发元素。"
        },
        {
          "name": "anchorRef",
          "type": "RefObject<HTMLElement>",
          "description": "兄弟模式的外部锚点引用。"
        },
        {
          "name": "content",
          "type": "ReactNode",
          "description": "工具提示内容，通常是简短文本。"
        },
        {
          "name": "placement",
          "type": "'above' | 'below' | 'start' | 'end'",
          "description": "相对于锚点元素的位置。逻辑值：start/end 根据弹出层自身继承的方向解析（RTL 镜像）。",
          "default": "'above'"
        },
        {
          "name": "alignment",
          "type": "'start' | 'center' | 'end'",
          "description": "沿放置轴的对齐方式。逻辑值：start/end 根据弹出层自身继承的方向解析（RTL 镜像）。",
          "default": "'center'"
        },
        {
          "name": "delay",
          "type": "number",
          "description": "显示延迟（毫秒）。",
          "default": "200"
        },
        {
          "name": "hideDelay",
          "type": "number",
          "description": "隐藏延迟（毫秒）。",
          "default": "0"
        },
        {
          "name": "focusTrigger",
          "type": "'auto' | 'always' | 'never'",
          "description": "控制聚焦事件何时触发工具提示。",
          "default": "'auto'"
        },
        {
          "name": "touchTrigger",
          "type": "'auto' | 'tap' | 'none'",
          "description": "在没有悬停的触摸设备上，轻点的行为。auto：轻点即打开，除非触发元素本身会执行操作（按钮、链接、表单控件），此时轻点归该控件所有；设置了 aria-disabled 的控件不执行操作，因此轻点它会显示其原因。tap：始终轻点打开，适用于唯一作用是显示工具提示的按钮；信息图标请使用 InfoTip。none：触摸永不打开。",
          "default": "'auto'"
        },
        {
          "name": "isEnabled",
          "type": "boolean",
          "description": "启用或禁用工具提示触发器。",
          "default": "true"
        },
        {
          "name": "onOpenChange",
          "type": "(isOpen: boolean) => void",
          "description": "工具提示可见性变化时触发的回调。显示时传入 true，隐藏时传入 false。"
        },
        {
          "name": "hasHoverIndication",
          "type": "'auto' | boolean",
          "description": "在触发元素上显示虚线下划线。",
          "default": "'auto'"
        },
        {
          "name": "isDefaultOpen",
          "type": "boolean",
          "description": "是否在挂载时显示工具提示。仍然可以关闭。"
        }
      ],
      "propDescriptions": {
        "children": "激活 Tooltip 的触发元素。",
        "anchorRef": "兄弟模式下使用的外部锚点 ref。",
        "content": "Tooltip 内容，通常是简短文本。",
        "placement": "相对于锚点元素的位置。逻辑值：start/end 根据 Popover 自身继承的方向解析（RTL 在纯 CSS 中镜像）。",
        "alignment": "沿 placement 轴的对齐方式。逻辑值：start/end 根据 Popover 自身继承的方向解析（RTL 在纯 CSS 中镜像）。",
        "delay": "显示延迟（毫秒）。",
        "hideDelay": "隐藏延迟（毫秒）。",
        "focusTrigger": "控制聚焦事件何时触发 Tooltip。",
        "touchTrigger": "在没有悬停的情况下，点击会做什么。auto 在点击时打开，除非触发元素本身执行操作（按钮、链接或表单控件），此时点击属于该控件；aria-disabled 控件不执行任何操作，因此点击它会打开其原因说明。tap 始终打开，适用于唯一职责是显示 Tooltip 的按钮；对于信息图标，请使用 InfoTip。none 在触摸时从不打开。",
        "isEnabled": "启用或禁用 Tooltip 的触发。",
        "onOpenChange": "Tooltip 可见性变化时触发的回调。显示时以 true 调用，隐藏时以 false 调用。",
        "hasHoverIndication": "在触发元素上显示虚线下划线。",
        "isDefaultOpen": "挂载时是否显示 Tooltip。仍可关闭。",
        "isOpen": "Tooltip 的受控打开状态。强制关闭时，本应打开它的聚焦会调用 onOpenChange(true) 但不显示任何内容；强制打开时，按 Escape 会调用 onOpenChange(false)，但仍保持显示。"
      }
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-tooltip"
      }
    ]
  },
  "usage": {
    "anatomy": [
      {
        "name": "Tooltip 表面",
        "required": true,
        "description": "呈现 Tooltip 的绘制浮层表面。"
      },
      {
        "name": "Tooltip 文本",
        "required": true,
        "description": "在表面内渲染的 Tooltip 内容。"
      }
    ],
    "description": "悬停或聚焦时出现的简短文本提示，锚定到触发元素。用于描述纯图标按钮、显示被截断标签的完整文本，或在不使界面杂乱的情况下提供补充上下文。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "保持 Tooltip 内容简洁：目标是不超过 140 个字符的纯文本。"
      },
      {
        "guidance": true,
        "description": "为纯图标按钮和缺少可见标签的控件添加 Tooltip。"
      },
      {
        "guidance": true,
        "description": "当触发元素是仅用于显示 Tooltip 的按钮时，将 touchTrigger 设为 tap：触摸没有悬停，而 auto 会把点击留给执行操作的触发元素。对于信息图标，请使用 InfoTip，它还会在按压时固定其帮助信息。"
      },
      {
        "guidance": false,
        "description": "不要在 Tooltip 内放置链接或按钮等交互元素；请改用 HoverCard 或 Popover。"
      },
      {
        "guidance": false,
        "description": "不要将 Tooltip 用于用户完成任务所必须看到的关键信息。"
      }
    ]
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Hover/focus triggered tooltip for displaying short, non-interactive text anchored to trigger element.',
  usage: {
    anatomy,
    description:
      'A short text hint that appears on hover or focus, anchored to a trigger element. Use it to describe icon-only buttons, show the full text of truncated labels, or provide supplementary context without cluttering the UI.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep tooltip content concise: aim for under 140 characters of plain text.',
      },
      {
        guidance: true,
        description:
          'Add a tooltip to icon-only buttons and controls that lack a visible label.',
      },
      {
        guidance: true,
        description:
          'Set touchTrigger to tap when the trigger is a button whose only job is revealing the tooltip: touch has no hover, and auto keeps the tap for triggers that perform an action. For an info icon, use InfoTip, which also pins its help on a press.',
      },
      {
        guidance: false,
        description:
          'Place interactive elements like links or buttons inside a tooltip; use HoverCard or Popover instead.',
      },
      {
        guidance: false,
        description:
          'Use tooltips for essential information that users must see to complete a task.',
      },
    ],
  },
  components: [
    {
      name: 'Tooltip',
      displayName: 'Tooltip',
      description: 'Component wrapper for tooltip display on hover/focus.',
      propDescriptions: {
        children: 'Trigger element(s) that activate tooltip.',
        anchorRef: 'External anchor ref for sibling mode.',
        content: 'Tooltip content, typically short text.',
        placement:
          "Position relative to anchor. Logical: start/end follow the popover's inherited direction (RTL mirrors).",
        alignment:
          "Alignment along placement axis. Logical: start/end follow the popover's inherited direction (RTL mirrors).",
        delay: 'Show delay in ms.',
        hideDelay: 'Hide delay in ms.',
        focusTrigger: 'Controls when focus events trigger tooltip.',
        touchTrigger:
          'Tap behavior where there is no hover. auto = tap opens unless the trigger acts (button/link/control; an aria-disabled control does not act); tap = always opens (a button whose only job is the tooltip; for an info icon use InfoTip); none = never on touch.',
        isEnabled: 'Enables/disables tooltip triggers.',
        onOpenChange:
          'Callback when visibility changes; true=shown, false=hidden.',
        hasHoverIndication: 'Dashed underline on trigger element.',
        isDefaultOpen: 'Show tooltip on mount. Still dismissible.',
      },
    },
  ],
};
