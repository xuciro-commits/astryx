// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Control',
    required: true,
    description: 'Container for the mutually exclusive segment choices.',
  },
  {
    name: 'Segment',
    required: true,
    description: 'Individual choice within the control.',
  },
  {
    name: 'Label',
    required: false,
    description: 'Visible text identifying a segment when its label is not hidden.',
  },
  {
    name: 'Icon',
    required: false,
    description: 'Optional caller-supplied icon shown inside a segment.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'SegmentedControl',
  displayName: 'Segmented Control',
  group: 'SegmentedControl',
  category: 'Action',
  keywords: ['radio', 'tabs', 'toggle', 'toggle-group', 'pill', 'button-group', 'switch', 'segment', 'control'],
  playground: {
    defaults: {
      label: 'Range',
      value: 'option-1',
      children: [
        {__element: 'SegmentedControlItem', props: {value: 'option-1', label: 'Day'}},
        {__element: 'SegmentedControlItem', props: {value: 'option-2', label: 'Week'}},
      ],
    },
  },
  examples: [
    {
      label: 'In a narrow card',
      code: `
import {useState} from 'react';
import {Card} from '@astryxdesign/core/Card';
import {Heading} from '@astryxdesign/core/Heading';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';

const SUMMARY = {
  overview: '4 projects, 2 due this week.',
  activity: '18 updates since Monday.',
  members: '12 members, 3 pending invites.',
  billing: 'Next invoice on October 1.',
};

// Inside a VStack the default hug layout keeps its content width; it does not
// stretch to the card. When the card is narrower than the control (a 320px
// phone column), the control caps at the card width and each label truncates
// with an ellipsis instead of running past the card edge. The full label stays
// each segment's accessible name. Keep labels short for phone widths.
function WorkspaceCard() {
  const [view, setView] = useState('overview');
  return (
    <Card maxWidth={480}>
      <VStack gap={3}>
        <Heading level={3}>Team workspace</Heading>
        <SegmentedControl label="Workspace view" value={view} onChange={setView}>
          <SegmentedControlItem value="overview" label="Overview" />
          <SegmentedControlItem value="activity" label="Activity" />
          <SegmentedControlItem value="members" label="Members" />
          <SegmentedControlItem value="billing" label="Billing" />
        </SegmentedControl>
        <Text color="secondary">{SUMMARY[view]}</Text>
      </VStack>
    </Card>
  );
}
`,
    },
  ],
  theming: {
    targets: [
      {className: 'astryx-segmented-control', visualProps: ['size']},
      {className: 'astryx-segmented-control-item', visualProps: ['size'], states: ['selected', 'disabled']},
    ],
    vars: [
      {name: '--_segmented-control-radius', description: 'Border radius of the segmented control', default: 'var(--radius-element)', private: true},
      {name: '--_segmented-control-padding', description: 'Inner padding of the segmented control', default: 'var(--spacing-0-5)', private: true},
    ],
    derived: [
      {property: 'borderRadius', vars: ['--_segmented-control-radius']},
      {property: 'padding', vars: ['--_segmented-control-padding']},
    ],
  },
  description: 'Container wrapper providing context (value, onChange, size, isDisabled) to SegmentedControlItem children.',
  props: [
    {
      name: 'value',
      type: 'string',
      description: 'The currently selected value (controlled).',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Callback fired when a segment is selected.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the radio group (used as aria-label, never rendered visually).',
      required: true,
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size variant for the control.',
      default: "'md'",
    },
    {
      name: 'layout',
      type: "'hug' | 'fill'",
      description: 'Layout mode. hug (default) sizes segments to content, capped at the container width (segment labels truncate when it is too narrow); fill stretches them equally to fill the container.',
      default: "'hug'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the entire control is disabled. The selected segment keeps the Tab stop, announced as disabled (aria-disabled), and nothing can be selected.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the control is disabled. Applies to the whole-group disabled state (isDisabled), not per segment. With isDisabled, shows a tooltip on hover/keyboard focus, and the reason describes each segment (selection stays blocked). Use this instead of wrapping a disabled SegmentedControl in Tooltip, so the reason is attached to the control itself.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'SegmentedControlItem children.',
      slotElements: [
        {
          __element: 'SegmentedControlItem',
          props: {
            label: 'Option',
            value: 'option',
          },
        },
      ],
      required: true,
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
  ],
  components: [
    {name: 'SegmentedControlItem'},
  ],
  usage: {
    anatomy,
    description:
      'A segmented button group that allows users to make a single selection from a small set of mutually exclusive options. Use SegmentedControl when all options should be visible at once and the selection controls a value or mode, not page navigation. Under a finger, on a touch device (a coarse primary pointer), the selection slides to the new segment, whether a tap, an arrow key or a new value moved it; with Reduce Motion nothing travels: the old selection fades out as the new one fades in. There, pressing the selected segment lifts it, and dragging it carries the selection along with the selected label’s colour following it, and the segment under the finger is chosen when it lets go; a tap selects through the browser’s click; a pressed unselected segment shows the shared pressed overlay, and nothing dims. A drag that drifts off the control still chooses by its position along it. Going back to the selected segment, or Escape, changes nothing. With a mouse or a pen every change, a click included, slides on the theme’s duration and easing, and dragging the selected segment carries it as a finger does.',
    accessibility: [
      {
        name: 'Text label',
        category: 'Color contrast',
        criterion: '1.4.3 Contrast (Minimum)',
        requirement: '4.5:1',
        states: ['Rest', 'Hover', 'Pointer down', 'Selected'],
        description:
          'Each label must have at least 4.5:1 contrast with its segment background. Check unselected, Hover, Pointer down, and selected colors as they appear on screen. For Hover and Pointer down, measure the final background after the overlay is applied. The track is translucent, so label contrast depends on the background behind the control. Check the labels on every background the control sits on, including a custom page color.',
      },
      {
        name: 'Essential icon',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Icon only'],
        description:
          'When a segment has no visible label, its icon must have at least 3:1 contrast with the segment background. An icon beside a visible label does not need its own check.',
      },
      {
        name: 'Selected state indicator',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1 if relied upon',
        states: ['Selected'],
        description:
          'The selected background must reach 3:1 only when users need it to tell selected from unselected. Label color and weight also show selection.',
      },
      {
        name: 'Visible control boundary',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1 if needed',
        states: ['Rest'],
        description:
          'The control edge or segment borders need at least 3:1 contrast when users need them to see the choices.',
      },
      {
        name: 'Keyboard focus indicator',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Focus visible'],
        description:
          'The focus outline must have at least 3:1 contrast with the area around the segment. Check it on the track and selected background.',
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
    bestPractices: [
      {guidance: true, description: 'Use for switching between 2–5 mutually exclusive views or modes where all options should be visible.'},
      {guidance: true, description: 'Provide a descriptive label for the control to ensure the group is accessible to screen readers.'},
      {guidance: false, description: 'Use for page-level navigation; use TabList instead. TabList is a navigation component, while SegmentedControl is an input that always has exactly one selected option.'},
      {guidance: false, description: 'Use for simple on/off states; use ToggleButton instead. ToggleButton can be toggled on or off independently, while SegmentedControl enforces a single selection from a group.'},
      {guidance: false, description: 'Wrap a disabled SegmentedControl in Tooltip to explain why it is disabled; the reason is then not attached to the control or its segments. Use the disabledMessage prop instead.'},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "anatomy": [
      {
        "name": "控件",
        "required": true,
        "description": "互斥分段选项的容器。"
      },
      {
        "name": "分段",
        "required": true,
        "description": "控件中的单个选项。"
      },
      {
        "name": "标签",
        "required": false,
        "description": "当标签未隐藏时，标识分段的可见文本。"
      },
      {
        "name": "图标",
        "required": false,
        "description": "分段内显示的可选、由调用方提供的图标。"
      }
    ],
    "description": "一个分段按钮组，允许用户从少量互斥选项中做出单一选择。当所有选项都应同时可见、且选择控制的是值或模式而非页面导航时，使用 SegmentedControl。在触摸设备上（主指针为粗指针）用手指操作时，无论是点击、方向键还是新值引起的移动，选中项都会滑动到新分段；启用减少动态效果（Reduce Motion）时不会有移动：旧选中项淡出，新选中项淡入。在那里，按下选中分段会将其抬起，拖动它会带着选中项一起移动，选中标签的颜色也随之移动，松开手指时该手指下的分段被选中；点击通过浏览器的 click 选择；按下的未选中分段会显示共享的按下叠加层，且不会有变暗效果。拖出控件范围的拖动仍会按其在控件上的位置进行选择。返回选中分段或按 Escape 不会改变任何内容。使用鼠标或触控笔时，每次变化（包括点击）都按主题的时长和缓动滑动，拖动选中分段会像手指一样带着它移动。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于在 2–5 个互斥视图或模式之间切换，且所有选项都应可见的场景。"
      },
      {
        "guidance": true,
        "description": "为控件提供描述性标签，确保该组对屏幕阅读器可访问。"
      },
      {
        "guidance": false,
        "description": "不要用于页面级导航；请改用 TabList。TabList 是导航组件，而 SegmentedControl 是始终恰好有一个选中选项的输入控件。"
      },
      {
        "guidance": false,
        "description": "不要用于简单的开/关状态；请改用 ToggleButton。ToggleButton 可以独立地打开或关闭，而 SegmentedControl 强制从一组中单选。"
      },
      {
        "guidance": false,
        "description": "不要用 Tooltip 包裹禁用的 SegmentedControl 来解释其禁用原因；这样原因不会附加到控件或其分段上。请改用 `disabledMessage` 属性。"
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
          "指针按下",
          "选中"
        ],
        "description": "每个标签与其分段背景之间必须至少具有 4.5:1 的对比度。请检查未选中、悬停（Hover）、指针按下（Pointer down）和选中状态在屏幕上实际显示的颜色。对于悬停和指针按下，请测量应用叠加层后的最终背景。轨道是半透明的，因此标签对比度取决于控件背后的背景。请检查控件所在的每个背景上的标签，包括自定义页面颜色。"
      },
      {
        "name": "关键图标",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1",
        "states": [
          "仅图标"
        ],
        "description": "当分段没有可见标签时，其图标与分段背景之间必须至少具有 3:1 的对比度。可见标签旁的图标不需要单独检查。"
      },
      {
        "name": "选中状态指示器",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1 if relied upon",
        "states": [
          "选中"
        ],
        "description": "只有当用户需要依靠选中背景来区分选中与未选中时，它才必须达到 3:1。标签颜色和字重也会显示选中状态。"
      },
      {
        "name": "可见控件边界",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1 if needed",
        "states": [
          "静止"
        ],
        "description": "当用户需要借助控件边缘或分段边框来看到选项时，它们必须至少具有 3:1 的对比度。"
      },
      {
        "name": "键盘焦点指示器",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1",
        "states": [
          "焦点可见"
        ],
        "description": "焦点轮廓与分段周围区域之间必须至少具有 3:1 的对比度。请在轨道和选中背景上检查。"
      },
      {
        "name": "禁用外观",
        "category": "Color contrast",
        "criterion": "1.4.3 and 1.4.11 exceptions",
        "requirement": "Not required",
        "states": [
          "禁用"
        ],
        "description": "禁用的控件不需要满足这些对比度比例。"
      }
    ]
  },
  "name": "SegmentedControl",
  "displayName": "Segmented Control",
  "description": "容器包裹层，为 SegmentedControlItem 子项提供上下文（value、onChange、size、isDisabled）。",
  "propDescriptions": {
    "value": "当前选中的值（受控）。",
    "onChange": "选中分段时触发的回调。",
    "label": "单选组的无障碍标签（用作 `aria-label`，从不以视觉方式渲染）。",
    "size": "控件的尺寸变体。",
    "layout": "布局模式。`hug`（默认）让分段按内容调整大小，上限为容器宽度（容器过窄时分段标签会截断）；`fill` 将其等分拉伸以填满容器。",
    "isDisabled": "整个控件是否被禁用。选中的分段保留 Tab 停靠点，并朗读为已禁用（`aria-disabled`），且无法选择任何内容。",
    "disabledMessage": "解释控件为何被禁用。适用于整组禁用状态（`isDisabled`），而非单个分段。与 `isDisabled` 一起使用时，在悬停/键盘聚焦时显示提示，且该原因会描述每个分段（选择仍被阻止）。请使用此属性，而不要用 Tooltip 包裹禁用的 SegmentedControl，使原因附加到控件本身。",
    "children": "SegmentedControlItem 子项。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 `stylex.create()` 的值：不是像 `style={{}}` 这样的内联样式对象。"
  },
  "components": [
    {
      "name": "SegmentedControlItem",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  usage: {
    anatomy,
    description:
      'A segmented button group that allows users to make a single selection from a small set of mutually exclusive options. Use SegmentedControl when all options should be visible at once and the selection controls a value or mode, not page navigation. Under a finger, on a touch device (a coarse primary pointer), the selection slides to the new segment, whether a tap, an arrow key or a new value moved it; with Reduce Motion nothing travels: the old selection fades out as the new one fades in. There, pressing the selected segment lifts it, and dragging it carries the selection along with the selected label’s colour following it, and the segment under the finger is chosen when it lets go; a tap selects through the browser’s click; a pressed unselected segment shows the shared pressed overlay, and nothing dims. A drag that drifts off the control still chooses by its position along it. Going back to the selected segment, or Escape, changes nothing. With a mouse or a pen every change, a click included, slides on the theme’s duration and easing, and dragging the selected segment carries it as a finger does.',
    bestPractices: [
      {guidance: true, description: 'Use for switching between 2–5 mutually exclusive views or modes where all options should be visible.'},
      {guidance: true, description: 'Provide a descriptive label for the control to ensure the group is accessible to screen readers.'},
      {guidance: false, description: 'Use for page-level navigation; use TabList instead. TabList is a navigation component, while SegmentedControl is an input that always has exactly one selected option.'},
      {guidance: false, description: 'Use for simple on/off states; use ToggleButton instead. ToggleButton can be toggled on or off independently, while SegmentedControl enforces a single selection from a group.'},
      {guidance: false, description: 'Wrap a disabled SegmentedControl in Tooltip to explain why it is disabled; the reason is then not attached to the control or its segments. Use the disabledMessage prop instead.'},
    ],
  },
  propDescriptions: {
    value: 'currently selected value (controlled)',
    onChange: 'callback on segment selection',
    label: 'aria-label for radio group (never rendered)',
    size: 'size variant',
    layout: 'hug (default) sizes to content, capped at container; fill stretches equally',
    isDisabled: 'disables entire control',
    children: 'SegmentedControlItem children',
    xstyle: 'additional StyleX styles for container',
  },
};
