// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'LayoutPanel',
  subComponentOf: 'Layout',
  displayName: 'Layout Panel',
  isHiddenFromOverview: true,
  description: 'Sidebar for navigation, settings, or inspector panels.',
  playground: {
    defaults: {
      children: 'Panel Content',
      hasDivider: true,
      width: 200,
    },
    wrapper: {
      component: 'Layout',
      slotProp: 'start',
      props: {
        content: {
          __element: 'LayoutContent',
          props: {},
          children: 'Main content area',
        },
      },
    },
  },
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Panel content.',
    },
    {
      name: 'hasDivider',
      type: 'boolean',
      description:
        "Line on the edge that faces the content: the inline end in the start slot, the inline start in the end slot. Without it and without padding, the panel and the content share one gap. The Layout's defaultHasDividers does not apply. Beside a ResizeHandle that draws its own line, leave it false.",
      default: 'false',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Internal padding on every edge, using the spacing scale. Replaces the automatic inset and the gap shared with the content. 0 is full bleed.',
    },
    {
      name: 'isScrollable',
      type: 'boolean',
      description: 'Enable scrollable overflow.',
      default: 'true',
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible label for the landmark element. While the region scrolls, it also names the scrolling region, which otherwise takes a translated "Content".',
    },
    {
      name: 'role',
      type: 'AriaRole',
      description: 'ARIA landmark role.',
    },
    {
      name: 'width',
      type: 'number | string',
      description:
        "Width of the panel. Numbers are treated as pixels, strings are used as-is. Ignored when resizable is provided; the hook controls width. Beside a ResizeHandle given a useResizable region's props, a panel at width={region.size} is inert while the region is collapsed, and focus inside it moves to the handle as it collapses.",
    },
    {
      name: 'resizable',
      type: 'ResizableRegion | ResizableProps',
      description:
        "The output of useResizable(), or its props. When provided, the hook drives the panel width and a ResizeHandle should be placed adjacent to the panel. Carries the region's axis ('horizontal' | 'vertical'), which must match the adjacent ResizeHandle's direction. With the hook's own value, the panel slides closed and open from the edge facing its ResizeHandle; a hand-built object does not slide. Either way, focus inside the panel moves to its ResizeHandle as it collapses, and the panel is inert while collapsed.",
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLDivElement>',
      description: 'Ref forwarded to the panel element.',
    },
  ],
};

export const docsZh = {
  "name": "LayoutPanel",
  "isHiddenFromOverview": true,
  "displayName": "Layout Panel",
  "description": "用于导航、设置或检查器面板的侧栏。",
  "props": [
    {
      "name": "children",
      "type": "ReactNode",
      "description": "面板内容。"
    },
    {
      "name": "hasDivider",
      "type": "boolean",
      "description": "朝向内容一侧的边缘线：在起始槽中为行内末端，在结束槽中为行内起始端。若没有此线且没有内边距，面板与内容共享一个间隙。Layout 的 `defaultHasDividers` 不适用。在带有自带线条的 ResizeHandle 旁边时，请保持为 `false`。",
      "default": "false"
    },
    {
      "name": "padding",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "使用间距比例设置各边的内部内边距。它会替代自动内缩以及与内容共享的间隙。`0` 表示通栏。"
    },
    {
      "name": "isScrollable",
      "type": "boolean",
      "description": "启用可滚动溢出。",
      "default": "true"
    },
    {
      "name": "label",
      "type": "string",
      "description": "地标元素的无障碍标签。当区域滚动时，它也为滚动区域命名，否则该区域会采用翻译后的“Content”。"
    },
    {
      "name": "role",
      "type": "AriaRole",
      "description": "ARIA 地标角色。"
    },
    {
      "name": "width",
      "type": "number | string",
      "description": "面板宽度。数字按像素处理，字符串按原样使用。提供 `resizable` 时忽略此项；由 Hook 控制宽度。在带有 `useResizable` 区域属性的 ResizeHandle 旁边，`width={region.size}` 的面板在区域折叠时处于惰性状态，折叠时其内部焦点会移到句柄上。"
    },
    {
      "name": "resizable",
      "type": "ResizableRegion | ResizableProps",
      "description": "`useResizable()` 的输出或其属性。提供时，Hook 驱动面板宽度，并且应将 ResizeHandle 放在面板旁边。它携带区域的轴向（`'horizontal'` | `'vertical'`），必须与相邻 ResizeHandle 的方向匹配。使用 Hook 自身的值时，面板会从朝向其 ResizeHandle 的边缘滑入滑出；手动构造的对象不会滑动。无论哪种方式，面板折叠时其内部焦点都会移到对应的 ResizeHandle，且折叠期间面板处于惰性状态。"
    },
    {
      "name": "ref",
      "type": "React.Ref<HTMLDivElement>",
      "description": "转发到面板元素的 ref。"
    }
  ],
  "propDescriptions": {
    "children": "面板内容。",
    "hasDivider": "朝向内容一侧的边缘线：在起始槽中为行内末端，在结束槽中为行内起始端。若没有此线且没有内边距，面板与内容共享一个间隙。Layout 的 `defaultHasDividers` 不适用。在带有自带线条的 ResizeHandle 旁边时，请保持为 `false`。",
    "padding": "使用间距比例设置各边的内部内边距。它会替代自动内缩以及与内容共享的间隙。`0` 表示通栏。",
    "isScrollable": "启用可滚动溢出。",
    "label": "地标元素的无障碍标签。当区域滚动时，它也为滚动区域命名，否则该区域会采用翻译后的“Content”。",
    "role": "ARIA 地标角色。",
    "width": "面板宽度。数字按像素处理，字符串按原样使用。提供 `resizable` 时忽略此项；由 Hook 控制宽度。在带有 `useResizable` 区域属性的 ResizeHandle 旁边，`width={region.size}` 的面板在区域折叠时处于惰性状态，折叠时其内部焦点会移到句柄上。",
    "resizable": "`useResizable()` 的输出或其属性。提供时，Hook 驱动面板宽度，并且应将 ResizeHandle 放在面板旁边。它携带区域的轴向（`'horizontal'` | `'vertical'`），必须与相邻 ResizeHandle 的方向匹配。使用 Hook 自身的值时，面板会从朝向其 ResizeHandle 的边缘滑入滑出；手动构造的对象不会滑动。无论哪种方式，面板折叠时其内部焦点都会移到对应的 ResizeHandle，且折叠期间面板处于惰性状态。",
    "ref": "转发到面板元素的 ref。"
  }
};

export const docsDense = {
  name: 'LayoutPanel',
  isHiddenFromOverview: true,
  displayName: 'Layout Panel',
  description: 'Sidebar for navigation, settings, inspector panels.',
  propDescriptions: {
    children: 'Panel content.',
    hasDivider:
      'Line on the content-facing edge (start slot: inline end; end slot: inline start); without it or padding, panel and content share one gap. Layout defaultHasDividers does not apply. False beside a ResizeHandle with its own line.',
    padding:
      'Padding on every edge; replaces the automatic inset and the shared gap. 0 is full bleed.',
    isScrollable: 'Enable scrollable overflow.',
    label:
      'Accessible label for landmark element; also names the region while it scrolls (default "Content").',
    role: 'ARIA landmark role.',
    width:
      'Panel width. Numbers = pixels, strings as-is. Ignored when resizable provided; hook controls width. width={region.size} beside a ResizeHandle given the region props: inert while collapsed; focus inside moves to the handle on collapse.',
    resizable:
      'useResizable() output or its props. Hook drives panel width; place ResizeHandle adjacent. Hook values slide; hand-built ones do not. Focus inside moves to the handle on collapse; inert while collapsed.',
    ref: 'Ref forwarded to the panel element.',
  },
};
