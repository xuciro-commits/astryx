// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useScrollLock',
  displayName: 'useScrollLock',
  keywords: [
    'scroll',
    'lock',
    'modal',
    'dialog',
    'page',
    'prevent',
    'background',
    'ios',
    'safari',
    'touch',
    'scrollbar',
    'gutter',
    'layout shift',
    'reflow',
  ],
  params: [
    {
      name: 'isLocked',
      type: 'boolean',
      description: 'whether page scroll should be locked.',
      required: true,
    },
  ],
  returns: [],
  usage: {
    description:
      'Locks page scroll while active and keeps the page where it is. The page gets overflow: hidden (on the root, or on body when its own overflow is the one the viewport uses), which stops wheel, keyboard and scrollbar scrolling, and overscroll-behavior-y: none on the root and body, which stops the overscroll bounce while the lock holds. Where the primary pointer is coarse (phones and tablets), a one-finger pan that would scroll the page is cancelled, because iOS Safari scrolls an overflow: hidden page under a finger; pans that a scroller inside the overlay can take, drags on a native range input, pinch-zoom, and one-finger drags on a pinch-zoomed page (which pan the zoomed view) still work. The scroll offset never changes, so nothing jumps when the lock starts or ends, and iOS Safari keeps its toolbar as it was. Where the hidden scrollbar takes layout space (desktop), the hook holds its gutter open with scrollbar-gutter: stable, so the page, including any position: fixed chrome, does not shift sideways.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use when opening full-screen modals or dialogs to prevent background content from scrolling.',
      },
      {
        guidance: true,
        description:
          'Pass the same boolean that controls dialog visibility (e.g., isOpen) as the isLocked parameter.',
      },
      {
        guidance: false,
        description:
          'Use for non-modal overlays like popovers or tooltips; users should be able to scroll away from those.',
      },
    ],
  },
  relatedComponents: ['Dialog'],
  relatedHooks: ['useFocusTrap'],
  importPath: '@astryxdesign/core/hooks',
  category: 'layout',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    "Locks page scroll while active, page stays where it is: overflow: hidden on the root, or on body when its own overflow propagates (wheel, keyboard, scrollbar) + overscroll-behavior-y: none on root and body (no overscroll bounce while locked) + cancels 1-finger pans that would scroll the page (iOS Safari scrolls overflow: hidden pages under a finger); overlay scrollers, range inputs, pinch-zoom + drags on a zoomed page still work. Offset never changes: no jump, iOS toolbar unchanged. Holds the hidden scrollbar's gutter open (scrollbar-gutter: stable) so the page (incl. position: fixed chrome) does not shift sideways.",
  paramDescriptions: {
    isLocked: 'whether page scroll should be locked.',
  },
  usage: {
    description:
      "Locks page scroll while active, page stays where it is: overflow: hidden on the root, or on body when its own overflow propagates (wheel, keyboard, scrollbar) + overscroll-behavior-y: none on root and body (no overscroll bounce while locked) + cancels 1-finger pans that would scroll the page (iOS Safari scrolls overflow: hidden pages under a finger); overlay scrollers, range inputs, pinch-zoom + drags on a zoomed page still work. Offset never changes: no jump, iOS toolbar unchanged. Holds the hidden scrollbar's gutter open (scrollbar-gutter: stable) so the page (incl. position: fixed chrome) does not shift sideways.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Use when opening full-screen modals / dialogs to prevent background content from scrolling.',
      },
      {
        guidance: true,
        description:
          'Pass same boolean that controls dialog visibility (e.g. isOpen) as isLocked parameter.',
      },
      {
        guidance: false,
        description:
          'Use for non-modal overlays like popovers / tooltips; users should be able to scroll away from those.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useScrollLock",
  "usage": {
    "description": "激活时锁定页面滚动，并让页面保持原位。页面会设置 `overflow: hidden`（在根元素上，或当视口使用 `body` 自身的 overflow 时设置在 `body` 上），从而阻止滚轮、键盘和滚动条滚动；同时在根元素和 `body` 上设置 `overscroll-behavior-y: none`，在锁定期间阻止过度滚动回弹。当主指针为粗糙指针（手机和平板）时，会取消可能滚动页面的一指平移，因为 iOS Safari 会在手指下滚动 `overflow: hidden` 的页面；覆盖层内部滚动容器可接受的平移、原生范围输入上的拖拽、双指缩放，以及双指缩放页面上的一指拖拽（用于平移缩放后的视图）仍然有效。滚动偏移永远不会改变，因此锁定开始或结束时页面不会跳动，iOS Safari 也会保持其工具栏原状。当隐藏的滚动条占用布局空间（桌面端）时，该 Hook 通过 `scrollbar-gutter: stable` 保持其槽位，因此页面（包括任何 `position: fixed` 的界面元素）不会横向移动。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "打开全屏模态框或对话框时使用，以防止背景内容滚动。"
      },
      {
        "guidance": true,
        "description": "将控制对话框可见性的同一个布尔值（例如 `isOpen`）作为 `isLocked` 参数传入。"
      },
      {
        "guidance": false,
        "description": "用于弹出框或工具提示等非模态覆盖层；用户应能滚动离开这些内容。"
      }
    ]
  },
  "paramDescriptions": {
    "isLocked": "是否应锁定页面滚动。"
  },
  "returnDescriptions": {}
};
