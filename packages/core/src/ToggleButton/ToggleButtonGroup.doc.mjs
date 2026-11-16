// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ToggleButtonGroup',
  subComponentOf: 'ToggleButton',
  displayName: 'Toggle Button Group',
  keywords: [
    'togglegroup',
    'buttontogglegroup',
  ],
  description: 'Groups toggle buttons for exclusive (single) or multi-select behavior. Uses discriminated union on type for type-safe value/onChange. Under the touch presentation a press tracks like a menu: press a toggle and slide across the others, and the highlight follows. Only the toggle you lift on toggles, and lifting outside the group toggles nothing. With a finger, each toggle\'s target grows toward 44 px, up to half the gap to a neighbour, without the toggles growing.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'ToggleButton children. Give each member a value; the group owns its pressed state and ignores its isPressed, onPressedChange, and pressedChangeAction props. Member activation calls the group’s onChange without starting a member Action transition.',
      required: true,
      slotElements: [
        {
          __element: 'ToggleButton',
          props: {
            label: 'Option',
            value: 'option',
          },
        },
      ],
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the group (aria-label).',
      required: true,
    },
    {
      name: 'type',
      type: "'single' | 'multiple'",
      description: 'Selection mode. Single allows one active button, multiple allows many.',
      default: "'single'",
    },
    {
      name: 'value',
      type: 'string | null | string[]',
      description: 'Currently selected value(s). Type depends on selection mode.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string | null | string[]) => void',
      description: 'Called when selection changes.',
      required: true,
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      description: 'Layout direction of the button group.',
      default: "'horizontal'",
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Default size for buttons in the group. Individual buttons can override.',
      default: "'md'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether all buttons in the group are disabled.',
      default: 'false',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value.',
    },
    {
      name: 'data-testid',
      type: 'string',
      description: 'Test selector for automated testing frameworks.',
    },
  ],
};

export const docsZh = {
  "name": "ToggleButtonGroup",
  "displayName": "Toggle Button Group",
  "description": "将切换按钮分组，以实现互斥（单选）或多选行为。基于 type 的可辨识联合实现类型安全的 value/onChange。在触摸呈现下，按压的跟踪方式类似菜单：按住一个切换按钮并滑过其他按钮，高亮会跟随。只有抬起时所在的切换按钮会切换，在组外抬起则不会切换任何内容。使用手指时，每个切换按钮的点击目标会向 44 px 增长，最大为与相邻按钮间距的一半，而按钮本身不增大。",
  "propDescriptions": {
    "children": "ToggleButton 子元素。为每个成员提供 value；组负责其按下状态，并忽略其 isPressed、onPressedChange 和 pressedChangeAction 属性。成员激活会调用组的 onChange，但不启动成员的 Action 过渡。",
    "label": "组的无障碍标签（aria-label）。",
    "type": "选择模式。Single 允许一个活动按钮，multiple 允许多个。",
    "value": "当前选中的值。类型取决于选择模式。",
    "onChange": "选择变化时调用。",
    "orientation": "按钮组的布局方向。",
    "size": "组中按钮的默认尺寸。单个按钮可以覆盖。",
    "isDisabled": "组中所有按钮是否都禁用。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值。",
    "data-testid": "供自动化测试框架使用的测试选择器。"
  }
};

export const docsDense = {
  name: 'ToggleButtonGroup',
  displayName: 'Toggle Button Group',
  description: 'groups toggle btns for exclusive/multi-select; discriminated union on type; on touch a press slides across toggles like a menu and only the one lifted on toggles; a mouse press stays native; finger targets grow toward 44 px, up to half the gap to a neighbour',
  propDescriptions: {
    children: 'ToggleButton children; each member needs a value. Group owns pressed state; member isPressed/onPressedChange/pressedChangeAction are ignored. Selection uses group onChange, with no member Action transition.',
    label: 'a11y label (aria-label)',
    type: 'selection mode: single or multiple',
    value: 'selected value(s); type depends on mode',
    onChange: 'selection change cb',
    orientation: 'layout direction',
    size: 'default btn size; individual btns override',
    isDisabled: 'all btns disabled',
    xstyle: 'StyleX layout styles; must be stylex.create() value',
    "data-testid": 'test selector',
  },
};
