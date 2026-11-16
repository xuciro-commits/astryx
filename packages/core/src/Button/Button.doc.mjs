// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Button',
  displayName: 'Button',
  group: 'Button',
  category: 'Action',

  keywords: ["button","btn","cta","submit","action","loading","primary","secondary","ghost","destructive","danger"],

  usage: {
    description:
      'Button triggers an action when clicked. Use it for form submissions, confirmations, navigation, or any interaction that needs a clear call to action.',
    bestPractices: [
      {guidance: true, description: 'Reserve primary for the single most important action in the view. Use secondary or ghost for everything else based on emphasis.'},
      {guidance: true, description: 'Write labels that describe the action ("Save changes", "Delete account", "Send invite"), not vague labels like "OK" or "Click here".'},
      {guidance: true, description: 'Show a loading state for actions that take time, like saving or submitting, so the user knows it is working.'},
      {guidance: true, description: 'Always provide a label for icon-only buttons so screen readers can announce what the button does. Add a tooltip for sighted users.'},
      {guidance: true, description: 'For a dedicated icon-only button, use IconButton from \'@astryxdesign/core/IconButton\'. It is a separate component, not exported from \'@astryxdesign/core/Button\'.'},
      {guidance: false, description: 'Place more than one primary button in the same view; this dilutes the visual hierarchy.'},
      {guidance: false, description: 'Use the destructive variant without a confirmation step for irreversible actions like deleting data.'},
      {guidance: false, description: 'Use a button for navigation. If it only takes the user to another page, use a link instead. Buttons are for actions like saving, deleting, or submitting.'},
      {guidance: false, description: "Restyle Button's `::before` (through `xstyle` or a `className` rule) and expect it to hold through a touch press: under a coarse primary pointer, while a press is on or fading, Button paints the press on that pseudo-element (`z-index: -1`, its opacity animated), so your styles merge into the press layer for that moment. At rest Button adds nothing there. Style a child element instead."},
    ],
    accessibility: [
      {
        name: 'Text label',
        category: 'Color contrast',
        criterion: '1.4.3 Contrast (Minimum)',
        requirement: '4.5:1',
        states: ['Rest', 'Hover', 'Pointer down'],
        description:
          'Button text must have at least 4.5:1 contrast with the button background in every state. For Hover and Pointer down, measure the final background after the overlay is applied.',
      },
      {
        name: 'Essential icon or spinner arc',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Icon only', 'Loading'],
        description:
          'An icon used instead of text must have at least 3:1 contrast with the button background. The moving spinner arc must also meet 3:1. An icon beside a visible label does not need its own check.',
      },
      {
        name: 'Badge text',
        category: 'Color contrast',
        criterion: '1.4.3 Contrast (Minimum)',
        requirement: '4.5:1',
        states: ['Rest', 'Hover', 'Pointer down'],
        description:
          'Badge text inside a button must have at least 4.5:1 contrast with the Badge background. Check all 14 built-in Badge colors in Rest, Hover, and Pointer down on page and surface backgrounds. This covers 336 pairs per mode. Check custom end content separately.',
      },
      {
        name: 'Visible control boundary',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1 if needed',
        states: ['Rest'],
        description:
          'The button edge needs 3:1 contrast only when users need it to see the control. A text-only button can rely on its label.',
      },
      {
        name: 'Keyboard focus indicator',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Focus visible'],
        description:
          'The focus outline needs at least 3:1 contrast with the area around the button. Check every style. Destructive buttons use a red outline.',
      },
      {
        name: 'Disabled appearance',
        category: 'Color contrast',
        criterion: '1.4.3 and 1.4.11 exceptions',
        requirement: 'Not required',
        states: ['Disabled'],
        description:
          'Disabled controls do not need to meet these contrast ratios.',
      },
    ],
    anatomy: [
      {name: 'Icon', required: false, description: 'A leading icon that reinforces the label, like a trash icon on a Delete button.'},
      {name: 'Label', required: true, description: 'The visible text describing the action. Also used as the accessible name.'},
      {name: 'End content', required: false, description: 'A trailing badge or icon after the label, like a notification count or dropdown arrow.'},
      {name: 'Spinner', required: false, description: 'Replaces the icon during loading to show the action is in progress.'},
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible label. Rendered as visible text by default; used as aria-label when isIconOnly is true.',
      required: true,
    },
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'ghost' | 'destructive'",
      description: 'Visual style variant.',
      default: "'secondary'",
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size variant.',
      default: "'md'",
    },
    {
      name: 'elevation',
      type: "'none' | 'low' | 'med' | 'high'",
      description:
        'Resting shadow depth for floating buttons (e.g. a FAB). `none` is the default flat button; `low`/`med`/`high` map to the shadow token scale. Ignored inside a ButtonGroup, where elevation is owned by the group.',
      default: "'none'",
    },
    {
      name: 'type',
      type: "'button' | 'submit' | 'reset'",
      description: 'HTML button type attribute.',
      default: "'button'",
    },
    {
      name: 'name',
      type: 'string',
      description: 'HTML name attribute for form submission.',
    },
    {
      name: 'value',
      type: 'string | number | readonly string[]',
      description: 'HTML value attribute for form submission.',
    },
    {
      name: 'form',
      type: 'string',
      description: 'Associates the button with a form element by ID.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description: 'Shows a loading spinner and blocks re-activation while staying focusable (aria-busy + aria-disabled, not native disabled, so keyboard focus is never dropped mid-action). Announces "Loading" via a live region.',
      default: 'false',
    },
    {
      name: 'isInterruptible',
      type: 'boolean',
      description: 'Keep the button clickable while a clickAction is pending: the spinner and aria-busy still show, but the button is not disabled and the action is not deduped, so a re-click lands and interrupts the in-flight action with a fresh one.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disables the button. Uses aria-disabled instead of native disabled so the button stays focusable.',
      default: 'false',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description:
        'Icon element rendered before the label text. An Astryx Icon with no explicit size defaults to sm for sm/md buttons and md for lg buttons.',
      slotElements: [{__element: 'Icon', props: {icon: 'check'}}],
    },
    {
      name: 'isIconOnly',
      type: 'boolean',
      description:
        'When true, renders as a square icon-only button with label as aria-label. Requires icon. Tip: for a dedicated icon-only button component, use IconButton from \'@astryxdesign/core/IconButton\' instead.',
      default: 'false',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        "Width of the button. Numbers are treated as pixels, strings are used as-is (e.g., '100%' for a full-width button). By default the button sizes to its content, never grows past its container, and truncates its label with an ellipsis when a row is too narrow; icon-only buttons stay square.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Optional override for visible text. When provided, displayed instead of label, but label is still required (it provides the accessible name). For most cases, just use label alone: <Button label="Save" />.',
    },
    {
      name: 'endContent',
      type: 'ReactElement<IconProps> | ReactElement<BadgeProps>',
      description:
        'Trailing icon or badge rendered after the label. Ignored when isIconOnly is true. Color is inherited from the button variant.',
      slotElements: [
        {__element: 'Icon', props: {icon: 'chevronDown', size: 'sm'}},
        {__element: 'Badge', props: {label: '3'}},
      ],
    },
    {
      name: 'tooltip',
      type: 'string',
      description: 'Tooltip text shown on hover.',
    },
    {
      name: 'onClick',
      type: '(e: MouseEvent) => void',
      description:
        'Standard click handler (passed through from ButtonHTMLAttributes).',
    },
    {
      name: 'clickAction',
      type: '(e: MouseEvent) => void | Promise<void>',
      description:
        'Async click handler. Shows loading state while the returned promise is pending.',
    },
    {
      name: 'href',
      type: 'string',
      description:
        'When provided, renders the button as a link element (<a> or custom link component). The destination follows the shared navigation rule described on the Link `href` prop.',
    },
    {
      name: 'as',
      type: 'ComponentType',
      description:
        'Custom link component to use when href is provided (e.g. Next.js Link).',
    },
    {
      name: 'target',
      type: 'string',
      description: 'HTML target attribute when rendered as a link (e.g. "_blank").',
    },
    {
      name: 'rel',
      type: 'string',
      description: 'HTML rel attribute when rendered as a link (e.g. "noopener noreferrer").',
    },
  ],
  examples: [
    {
      label: 'Actions in narrow rows',
      code: `
import {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {StackItem} from '@astryxdesign/core/Stack';
import {TextInput} from '@astryxdesign/core/TextInput';
import {VStack} from '@astryxdesign/core/VStack';

// On a phone (or any card narrower than its actions), a labelled Button
// shrinks with its row and truncates its label with an ellipsis instead of
// overflowing or being clipped by the card. The full label stays the
// accessible name. Icon-only buttons keep their square size.
function ReviewersCard() {
  const [emails, setEmails] = useState('');
  return (
    <Card maxWidth={560}>
      <VStack gap={4}>
        <HStack gap={2} vAlign="center">
          <StackItem size="fill">
            <Heading level={3} maxLines={1}>
              Design review
            </Heading>
          </StackItem>
          <Button label="Request review from the design team" size="sm" />
          <IconButton
            label="More review options"
            icon={<Icon icon="moreHorizontal" />}
            variant="ghost"
            size="sm"
          />
        </HStack>
        <TextInput
          label="Reviewer emails"
          placeholder="name@example.com"
          value={emails}
          onChange={setEmails}
        />
        {/* In a 320px form footer the long primary action truncates.
            StackItem size="static" keeps the short Cancel label whole. */}
        <HStack gap={2} hAlign="end">
          <StackItem size="static">
            <Button label="Cancel" variant="secondary" />
          </StackItem>
          <Button label="Send invitations to all 12 reviewers" variant="primary" />
        </HStack>
      </VStack>
    </Card>
  );
}
`,
    },
  ],
  playground: {
    defaults: {
      label: 'Click me',
      variant: 'primary',
    },
  },
  theming: {
    targets: [
      {className: 'astryx-button', visualProps: ['size', 'variant', 'elevation']},
    ],
    vars: [
      {name: '--_button-radius', description: 'Border radius', default: 'var(--radius-element)', private: true},
      {name: '--button-focus-offset', description: 'Focus ring outline offset', default: 'var(--focus-outline-offset)'},
      {name: '--button-icon-only-aspect', description: 'Aspect ratio for icon-only buttons', default: '1 / 1'},
    ],
    derived: [
      {property: 'borderRadius', vars: ['--_button-radius']},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Button",
  "displayName": "Button",
  "usage": {
    "description": "Button 在点击时触发操作。用于表单提交、确认、导航，或任何需要明确行动号召的交互。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将 primary 保留给视图中唯一最重要的操作。其他操作根据强调程度使用 secondary 或 ghost。"
      },
      {
        "guidance": true,
        "description": "编写能描述操作的标签（\"Save changes\"、\"Delete account\"、\"Send invite\"），而不要用 \"OK\" 或 \"Click here\" 这类含糊的标签。"
      },
      {
        "guidance": true,
        "description": "对耗时操作（如保存或提交）显示加载状态，让用户知道操作正在进行。"
      },
      {
        "guidance": true,
        "description": "始终为纯图标按钮提供标签，以便屏幕阅读器播报按钮的作用。为视力正常的用户添加 Tooltip。"
      },
      {
        "guidance": true,
        "description": "如需专用的纯图标按钮，请使用来自 '@astryxdesign/core/IconButton' 的 IconButton。它是独立组件，不从 '@astryxdesign/core/Button' 导出。"
      },
      {
        "guidance": false,
        "description": "在同一视图中放置多个 primary 按钮；这会削弱视觉层级。"
      },
      {
        "guidance": false,
        "description": "对删除数据等不可逆操作，使用 destructive 变体却不加确认步骤。"
      },
      {
        "guidance": false,
        "description": "用按钮进行导航。如果它只是把用户带到另一个页面，请改用链接。按钮用于保存、删除或提交之类的操作。"
      },
      {
        "guidance": false,
        "description": "重新设置 Button 的 `::before` 样式（通过 `xstyle` 或 `className` 规则）并指望它在触摸按压期间保持：在主指针为粗糙指针时，按压进行中或淡出时，Button 会在该伪元素上绘制按压效果（`z-index: -1`，其透明度有动画），因此你的样式会在那一刻合并进按压层。静止时 Button 不在那里添加任何内容。请改为给子元素设置样式。"
      }
    ],
    "anatomy": [
      {
        "name": "图标",
        "required": false,
        "description": "强化标签的前置图标，例如 Delete 按钮上的垃圾桶图标。"
      },
      {
        "name": "标签",
        "required": true,
        "description": "描述操作的可见文本。同时用作无障碍名称。"
      },
      {
        "name": "结束内容",
        "required": false,
        "description": "标签后渲染的尾部 Badge 或图标，例如通知计数或下拉箭头。"
      },
      {
        "name": "加载指示器",
        "required": false,
        "description": "加载期间替代图标，表示操作正在进行。"
      }
    ],
    "accessibility": [
      {
        "name": "文本标签",
        "category": "Color contrast",
        "criterion": "1.4.3 Contrast (Minimum)",
        "requirement": "4.5:1",
        "states": [
          "静止",
          "悬停",
          "指针按下"
        ],
        "description": "在所有状态下，Button 文本与按钮背景的对比度必须至少为 4.5:1。对于悬停和指针按下，应在应用叠加层后测量最终背景。"
      },
      {
        "name": "必要图标或加载弧线",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1",
        "states": [
          "仅图标",
          "加载中"
        ],
        "description": "替代文本使用的图标与按钮背景的对比度必须至少为 3:1。旋转的加载弧线也必须达到 3:1。可见标签旁的图标无需单独检查。"
      },
      {
        "name": "Badge 文本",
        "category": "Color contrast",
        "criterion": "1.4.3 Contrast (Minimum)",
        "requirement": "4.5:1",
        "states": [
          "静止",
          "悬停",
          "指针按下"
        ],
        "description": "按钮内的 Badge 文本与 Badge 背景的对比度必须至少为 4.5:1。在页面和表面背景上检查所有 14 种内置 Badge 颜色在静止、悬停和指针按下状态下的表现。每种模式覆盖 336 组。请单独检查自定义结束内容。"
      },
      {
        "name": "可见控件边界",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1 if needed",
        "states": [
          "静止"
        ],
        "description": "只有当用户需要靠按钮边缘识别控件时，边缘才需要 3:1 的对比度。仅文本按钮可以依靠其标签。"
      },
      {
        "name": "键盘焦点指示器",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1",
        "states": [
          "焦点可见"
        ],
        "description": "焦点轮廓与按钮周围区域的对比度必须至少为 3:1。检查每一种样式。destructive 按钮使用红色轮廓。"
      },
      {
        "name": "禁用外观",
        "category": "Color contrast",
        "criterion": "1.4.3 and 1.4.11 exceptions",
        "requirement": "Not required",
        "states": [
          "禁用"
        ],
        "description": "禁用控件无需满足这些对比度比例。"
      }
    ]
  },
  "props": [
    {
      "name": "label",
      "type": "string",
      "description": "无障碍标签。默认渲染为可见文本；当 isIconOnly 为 true 时用作 aria-label。",
      "required": true
    },
    {
      "name": "variant",
      "type": "'primary' | 'secondary' | 'ghost' | 'destructive'",
      "description": "视觉样式变体。",
      "default": "'secondary'"
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "description": "尺寸变体。",
      "default": "'md'"
    },
    {
      "name": "elevation",
      "type": "'none' | 'low' | 'med' | 'high'",
      "description": "浮动按钮（如 FAB）的静止阴影深度。`none` 是默认的扁平按钮；`low`/`med`/`high` 映射到阴影令牌刻度。在 ButtonGroup 内会被忽略，此时高度由组负责。",
      "default": "'none'"
    },
    {
      "name": "type",
      "type": "'button' | 'submit' | 'reset'",
      "description": "HTML button 的 type 属性。",
      "default": "'button'"
    },
    {
      "name": "name",
      "type": "string",
      "description": "用于表单提交的 HTML name 属性。"
    },
    {
      "name": "value",
      "type": "string | number | readonly string[]",
      "description": "用于表单提交的 HTML value 属性。"
    },
    {
      "name": "form",
      "type": "string",
      "description": "通过 ID 将按钮与 form 元素关联。"
    },
    {
      "name": "isLoading",
      "type": "boolean",
      "description": "显示加载转圈并阻止重复激活，同时保持可聚焦（使用 aria-busy + aria-disabled，而非原生 disabled，因此操作过程中键盘焦点不会丢失）。通过实时区域播报 \"Loading\"。",
      "default": "false"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "禁用按钮。使用 aria-disabled 而非原生 disabled，使按钮保持可聚焦。",
      "default": "false"
    },
    {
      "name": "icon",
      "type": "ReactNode",
      "description": "在标签文本前渲染的图标元素。未指定尺寸的 Astryx Icon 在 sm/md 按钮中默认为 sm，在 lg 按钮中默认为 md。"
    },
    {
      "name": "width",
      "type": "SizeValue",
      "description": "按钮的宽度。数字按像素处理，字符串按原样使用（例如 '100%' 表示全宽按钮）。默认情况下按钮按内容调整尺寸，不会超出容器，并在行宽不足时用省略号截断标签；纯图标按钮保持方形。"
    },
    {
      "name": "children",
      "type": "ReactNode",
      "description": "可见文本的可选覆盖项。提供后替代 label 显示，但 label 仍为必填（它提供无障碍名称）。大多数情况下只使用 label 即可：<Button label=\"Save\" />。"
    },
    {
      "name": "endContent",
      "type": "ReactElement<IconProps> | ReactElement<BadgeProps>",
      "description": "标签后渲染的尾部图标或 Badge。当 isIconOnly 为 true 时忽略。颜色继承自按钮变体。"
    },
    {
      "name": "tooltip",
      "type": "string",
      "description": "悬停时显示的 Tooltip 文本。"
    },
    {
      "name": "onClick",
      "type": "(e: MouseEvent) => void",
      "description": "标准点击处理函数（从 ButtonHTMLAttributes 透传）。"
    },
    {
      "name": "clickAction",
      "type": "(e: MouseEvent) => void | Promise<void>",
      "description": "异步点击处理函数。返回的 Promise 挂起期间显示加载状态。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-button",
        "visualProps": [
          "size",
          "variant",
          "elevation"
        ]
      }
    ],
    "vars": [
      {
        "name": "--_button-radius",
        "description": "圆角半径",
        "default": "var(--radius-element)",
        "private": true
      },
      {
        "name": "--button-focus-offset",
        "description": "焦点环轮廓偏移",
        "default": "var(--focus-outline-offset)"
      },
      {
        "name": "--button-icon-only-aspect",
        "description": "纯图标按钮的宽高比",
        "default": "1 / 1"
      }
    ],
    "derived": [
      {
        "property": "borderRadius",
        "vars": [
          "--_button-radius"
        ]
      }
    ]
  },
  "propDescriptions": {
    "label": "无障碍标签。默认渲染为可见文本；当 isIconOnly 为 true 时用作 aria-label。",
    "variant": "视觉样式变体。",
    "size": "尺寸变体。",
    "elevation": "浮动按钮（如 FAB）的静止阴影深度。`none` 是默认的扁平按钮；`low`/`med`/`high` 映射到阴影令牌刻度。在 ButtonGroup 内会被忽略，此时高度由组负责。",
    "type": "HTML button 的 type 属性。",
    "name": "用于表单提交的 HTML name 属性。",
    "value": "用于表单提交的 HTML value 属性。",
    "form": "通过 ID 将按钮与 form 元素关联。",
    "isLoading": "显示加载转圈并阻止重复激活，同时保持可聚焦（使用 aria-busy + aria-disabled，而非原生 disabled，因此操作过程中键盘焦点不会丢失）。通过实时区域播报 \"Loading\"。",
    "isInterruptible": "在 clickAction 挂起期间保持按钮可点击：仍显示加载转圈和 aria-busy，但按钮不会被禁用，操作也不会被去重，因此再次点击会生效，并用新操作中断正在进行的操作。",
    "isDisabled": "禁用按钮。使用 aria-disabled 而非原生 disabled，使按钮保持可聚焦。",
    "icon": "在标签文本前渲染的图标元素。未指定尺寸的 Astryx Icon 在 sm/md 按钮中默认为 sm，在 lg 按钮中默认为 md。",
    "isIconOnly": "为 true 时，渲染为方形纯图标按钮，并将 label 用作 aria-label。需要提供 icon。提示：如需专用的纯图标按钮组件，请改用来自 '@astryxdesign/core/IconButton' 的 IconButton。",
    "width": "按钮的宽度。数字按像素处理，字符串按原样使用（例如 '100%' 表示全宽按钮）。默认情况下按钮按内容调整尺寸，不会超出容器，并在行宽不足时用省略号截断标签；纯图标按钮保持方形。",
    "children": "可见文本的可选覆盖项。提供后替代 label 显示，但 label 仍为必填（它提供无障碍名称）。大多数情况下只使用 label 即可：<Button label=\"Save\" />。",
    "endContent": "标签后渲染的尾部图标或 Badge。当 isIconOnly 为 true 时忽略。颜色继承自按钮变体。",
    "tooltip": "悬停时显示的 Tooltip 文本。",
    "onClick": "标准点击处理函数（从 ButtonHTMLAttributes 透传）。",
    "clickAction": "异步点击处理函数。返回的 Promise 挂起期间显示加载状态。",
    "href": "提供后，将按钮渲染为链接元素（<a> 或自定义链接组件）。目标地址遵循 Link 组件 `href` 属性所述的共享导航规则。",
    "as": "提供 href 时使用的自定义链接组件（例如 Next.js Link）。",
    "target": "作为链接渲染时的 HTML target 属性（例如 \"_blank\"）。",
    "rel": "作为链接渲染时的 HTML rel 属性（例如 \"noopener noreferrer\"）。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'action trigger w/ 4 variants, 3 sizes, loading state',
  usage: {
    description:
      'Button triggers an action when clicked. Use for form submissions, confirmations, navigation, or any interaction needing a clear CTA.',
    bestPractices: [
      {guidance: true, description: 'Primary for the single most important action. Secondary or ghost for the rest.'},
      {guidance: true, description: 'Labels that describe the action: "Save changes" not "OK" or "Click here".'},
      {guidance: true, description: 'Show loading state for async actions so the user knows it is working.'},
      {guidance: true, description: 'Icon-only buttons need a label for screen readers and a tooltip for sighted users.'},
      {guidance: true, description: 'For dedicated icon-only buttons, use IconButton from @astryxdesign/core/IconButton. Separate component, not exported from @astryxdesign/core/Button.'},
      {guidance: false, description: 'Multiple primary buttons in one view; dilutes hierarchy.'},
      {guidance: false, description: 'Destructive without confirmation for irreversible actions.'},
      {guidance: false, description: 'Button for navigation; use a link if it only takes the user to another page.'},
      {guidance: false, description: 'xstyle or className on ::before: under a coarse primary pointer it is the touch press layer while a press is on or fading (z-index -1, opacity animated); nothing at rest.'},
    ],
  },
  propDescriptions: {
    label: 'accessible label; visible text by default, aria-label when isIconOnly',
    variant: 'visual style variant',
    size: 'size variant',
    elevation: 'resting shadow depth for floating buttons/FABs: none|low|med|high; ignored inside ButtonGroup',
    type: 'HTML button type; defaults to "button"',
    name: 'HTML name for form submission',
    displayName: 'HTML name for form submission',
    value: 'HTML value for form submission',
    form: 'associates button with form element by ID',
    isLoading: 'shows spinner, blocks re-activation but stays focusable (aria-disabled, not native disabled); announces via live region',
    icon: 'icon element rendered before label text; unsized Astryx Icon defaults to sm for sm/md buttons and md for lg',
    isIconOnly: 'when true, renders square icon-only button; label becomes aria-label',
    width: "Width of button. Numbers=pixels, strings=as-is (e.g. '100%' for full-width). Default: content width, capped at the container; label truncates w/ ellipsis in a narrow row; icon-only stays square.",
    children: 'optional visible override; label is still required for a11y. Prefer <Button label="Save" /> over using children',
    endContent: 'trailing icon/badge after label; ignored when isIconOnly; color inherited',
    tooltip: 'tooltip on hover',
    onClick: 'standard click handler; fires before clickAction',
    clickAction: 'async click handler; shows loading while promise pending',
    isDisabled: 'disables button; uses aria-disabled instead of native disabled',
  },
};
