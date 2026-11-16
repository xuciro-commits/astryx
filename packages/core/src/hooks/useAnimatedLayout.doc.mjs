// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useAnimatedLayout',
  displayName: 'useAnimatedLayout',
  keywords: [
    'animated layout',
    'layout shift',
    'glide',
    'expand',
    'collapse',
    'disclosure',
    'reflow',
    'jump',
    'motion',
    'transition',
  ],
  params: [
    {
      name: 'options.containerRef',
      type: 'RefObject<HTMLElement | null>',
      description:
        'The area the glide stays inside: the ref you already give your scroll container or panel. A ScrollableArea ref reaches its native scroll viewport, so pass that.',
      required: true,
    },
  ],
  returns: [
    {
      name: 'animatedLayout',
      type: 'AnimatedLayout',
      description:
        'An opaque handle with no public members. Pass it to the animatedLayout prop of a component whose size changes, such as TreeList or Collapsible.',
    },
  ],
  usage: {
    description:
      'Returns a handle to pass to a component whose size changes, such as TreeList or Collapsible. When that component changes size, it and the content after it inside `containerRef` animate together on one shared motion role. Fixed and stuck sticky elements stay put, the glide never scrolls the area, and Reduce Motion is respected. It applies under every pointer, a mouse included. Without the handle a component keeps its jump: content after it takes its place at once. Content after the change may mix Astryx components and your own elements; none of it opts in.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Create one handle per scroll container or panel and pass the same handle to every component in it whose size changes.',
      },
      {
        guidance: true,
        description:
          'Pass the ref you already give ScrollableArea as containerRef; ScrollableArea does not register itself.',
      },
      {
        guidance: false,
        description:
          'Wrap the content after a disclosure in an extra element to make it move; everything after the change inside the container moves on its own.',
      },
      {
        guidance: false,
        description:
          'Animate height yourself alongside it; the glide moves content with a compositor translate and never animates height.',
      },
    ],
  },
  relatedComponents: ['TreeList', 'Collapsible', 'ScrollableArea'],
  importPath: '@astryxdesign/core/hooks',
  category: 'motion & gestures',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Handle for a component whose size changes (TreeList, Collapsible): it + content after it inside containerRef glide on one shared motion role. Fixed/stuck sticky stay; never scrolls the area; Reduce Motion respected; every pointer. No handle = snap.',
  paramDescriptions: {
    'options.containerRef':
      'area the glide stays inside; pass the ref you give your scroll container (a ScrollableArea ref reaches its viewport).',
  },
  returnDescriptions: {
    animatedLayout:
      "opaque handle, no members; pass to a component's animatedLayout prop.",
  },
  usage: {
    description:
      'One handle per scroll container/panel, passed to every component in it whose size changes. Content after a change (Astryx or app elements) glides; no opt-in per element. Omit the handle to keep the jump.',
    bestPractices: [
      {
        guidance: true,
        description:
          'One handle per area, shared by its size-changing components.',
      },
      {
        guidance: true,
        description:
          'Pass the ScrollableArea ref as containerRef; it does not register itself.',
      },
      {
        guidance: false,
        description:
          'Wrap following content in an extra element to make it move.',
      },
      {guidance: false, description: 'Animate height yourself alongside it.'},
    ],
  },
};

export const docsZh = {
  "name": "useAnimatedLayout",
  "usage": {
    "description": "返回一个句柄，传给尺寸会变化的组件（例如 TreeList 或 Collapsible）。当该组件改变尺寸时，它和 `containerRef` 内其后的内容会以一个共享的动态角色一起动画。固定和粘性元素保持不动，滑动永远不会滚动该区域，并遵循减少动态效果。它在所有指针下都生效，包括鼠标。没有该句柄时，组件保持跳跃：其后的内容立即占据位置。变化后的内容可以混合 Astryx 组件和你自己的元素；它们都无需选择加入。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "每个滚动容器或面板创建一个句柄，并将同一个句柄传给其中每个尺寸会变化的组件。"
      },
      {
        "guidance": true,
        "description": "将你已提供给 ScrollableArea 的 ref 作为 containerRef 传入；ScrollableArea 不会自行注册。"
      },
      {
        "guidance": false,
        "description": "将披露内容后的内容包裹在额外元素中使其移动；容器内变化后的所有内容都会自行移动。"
      },
      {
        "guidance": false,
        "description": "自行同时为高度做动画；滑动使用合成器 translate 移动内容，从不为高度做动画。"
      }
    ]
  },
  "paramDescriptions": {
    "options.containerRef": "滑动保持在其内的区域：你已提供给滚动容器或面板的 ref。ScrollableArea 的 ref 会到达其原生滚动视口，因此传入那个。"
  },
  "returnDescriptions": {
    "animatedLayout": "一个不透明句柄，没有公开成员。将其传给尺寸会变化的组件的 animatedLayout 属性，例如 TreeList 或 Collapsible。"
  }
};
