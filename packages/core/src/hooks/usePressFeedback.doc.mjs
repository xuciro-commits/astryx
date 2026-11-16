// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'usePressFeedback',
  displayName: 'usePressFeedback',
  keywords: [
    'press',
    'pressed',
    'active',
    'touch',
    'tap',
    'coarse pointer',
    'pressable',
    'interaction state',
  ],
  params: [],
  returns: [
    {
      name: 'pressableProps',
      type: "{'data-astryx-pressable': ''}",
      description:
        "The marker attribute to spread on the element that paints the press. Compose one of `interactionOverlayStyles` (from `@astryxdesign/core/utils`) on the same element — `backgroundColor` or `backgroundImage` for a surface whose hover and press are the system's overlays, `pressedBackgroundColor` for one whose hover is its own — and it paints the pressed token on the first frame of a press and fades it over the release, keeping `:active` for a mouse on a desktop. On a phone or tablet, where the stylesheet drops `:active`, the controller also paints a mouse, trackpad or Space-key press: at once, held while the button or key is down, faded at the release. A press is themed through `--color-overlay-pressed`.",
    },
  ],
  usage: {
    description:
      'The touch press model every Astryx pressable uses, for a local component that paints its own press. Under a finger, CSS `:active` paints on the touch itself and can outlive the start of a scroll; the press model instead tracks the touch the way UIKit tracks a control: it highlights as the finger lands (after the content-touch delay inside a scroller, where a flick paints nothing), a quick tap answers at the lift, and a scroll that takes the touch cancels it with no fade. One document-level controller does this for every marked element (installed by the first pressable to mount, removed by the last to unmount), so calling the hook adds no listener or state to your element. On a desktop a mouse press is still your `:active` rule: keep it, and drop it under `@media (pointer: coarse)` the way the built-in components do. That query reads the primary pointer, so on a phone or tablet it also drops `:active` for a connected mouse, trackpad or keyboard; the controller paints those presses there (at once, faded at the release), so nothing goes unanswered.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Spread the result on the element whose background paints the press and compose one of `interactionOverlayStyles` on it; the composed style is the instant onset, the hold and the fade, and it is themed through `--color-overlay-pressed`.',
      },
      {
        guidance: true,
        description:
          'Let the composed style own the press on every pointer: it keeps `:active` for a desktop mouse and drops it under `@media (pointer: coarse)`, where the controller paints every press (a finger through the press model, a mouse or Space key at once). A rule of your own that paints `:active` would paint under a finger too, on the touch and through a scroll.',
      },
      {
        guidance: false,
        description:
          'Add a pointer listener or React state to the element to track the press; the controller already writes the attribute, and per-element listeners are what a long list cannot afford.',
      },
      {
        guidance: false,
        description:
          'Call it for a control rendered by an Astryx component; those are marked already, and the innermost marked element takes the press.',
      },
    ],
  },
  relatedComponents: ['Button', 'Item', 'ClickableCard'],
  relatedHooks: ['useLongPress'],
  importPath: '@astryxdesign/core/hooks',
  category: 'motion & gestures',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Marks an element as a pressable surface of the touch press model, tracked like a UIKit control (highlight as the finger lands, 150 ms inside a scroller, fade at the lift), and installs the shared document controller; on a coarse primary pointer it also paints mouse, trackpad and Space-key presses at once. Returns the data-astryx-pressable marker to spread; compose one of interactionOverlayStyles on the same element to paint.',
  paramDescriptions: {},
  returnDescriptions: {
    pressableProps:
      'marker attribute to spread on the painting element; compose one of interactionOverlayStyles (backgroundColor, backgroundImage, pressedBackgroundColor) there, which paints the press on every pointer; themed through --color-overlay-pressed.',
  },
  usage: {
    description:
      'For a local component that paints its own press and must match Astryx under a finger. No per-element listener or state; one controller per document.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Spread on the painting element and compose one of interactionOverlayStyles there; add no :active rule of your own.',
      },
      {
        guidance: false,
        description:
          'Track the press with your own pointer listeners or state, or call it on an Astryx component (already marked).',
      },
    ],
  },
};

export const docsZh = {
  "name": "usePressFeedback",
  "usage": {
    "description": "每个 Astryx 可按压元素都使用的触摸按压模型，适用于自行绘制按压效果的本地组件。在手指下，CSS `:active` 会在触摸时绘制，并且可能持续到滚动开始之后；按压模型则像 UIKit 跟踪控件那样跟踪触摸：手指落下时高亮（在滚动容器内要经过内容触摸延迟，此时快速滑动不会绘制任何内容），快速点按在抬起时响应，而接管触摸的滚动会取消它且不淡出。一个文档级控制器为每个标记元素执行此操作（由第一个挂载的可按压元素安装，由最后一个卸载的移除），因此调用该 Hook 不会为你的元素添加监听器或状态。在桌面上，鼠标按压仍由你的 `:active` 规则负责：保留它，并像内置组件那样在 `@media (pointer: coarse)` 下移除它。该查询读取主指针，因此在手机或平板上，它也会为连接的鼠标、触控板或键盘移除 `:active`；控制器会在那里绘制这些按压（立即绘制，释放时淡出），因此不会有任何操作得不到响应。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将结果展开到绘制按压背景的元素上，并在其上组合一种 `interactionOverlayStyles`；组合后的样式包含即时起始、保持和淡出，并通过 `--color-overlay-pressed` 应用主题。"
      },
      {
        "guidance": true,
        "description": "让组合样式负责所有指针的按压：它为桌面鼠标保留 `:active`，并在 `@media (pointer: coarse)` 下移除它，由控制器绘制每一次按压（手指通过按压模型，鼠标或空格键立即绘制）。你自己的 `:active` 规则也会在手指下绘制，无论是在触摸时还是滚动过程中。"
      },
      {
        "guidance": false,
        "description": "不要为元素添加指针监听器或 React 状态来跟踪按压；控制器已经写入该属性，而每个元素一个监听器是长列表无法承受的。"
      },
      {
        "guidance": false,
        "description": "不要为 Astryx 组件渲染的控件调用它；这些控件已经被标记，并且最内层的标记元素会接管按压。"
      }
    ]
  },
  "paramDescriptions": {},
  "returnDescriptions": {
    "pressableProps": "要展开到绘制按压的元素上的标记属性。在同一元素上组合一种 `interactionOverlayStyles`（来自 `@astryxdesign/core/utils`）——悬停和按压均为系统覆盖层的表面使用 `backgroundColor` 或 `backgroundImage`，悬停为其自身样式的表面使用 `pressedBackgroundColor`——它会在按压的第一帧绘制按下的令牌，并在释放时淡出，同时在桌面上为鼠标保留 `:active`。在手机或平板上，样式表会移除 `:active`，控制器还会绘制鼠标、触控板或空格键按压：立即绘制，在按钮或按键按下期间保持，释放时淡出。按压通过 `--color-overlay-pressed` 应用主题。"
  }
};
