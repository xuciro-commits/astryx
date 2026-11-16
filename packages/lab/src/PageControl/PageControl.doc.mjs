// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'PageControl',
  displayName: 'Page Control',
  category: 'Navigation',
  keywords: [
    'page control',
    'page indicator',
    'pager dots',
    'dots',
    'carousel dots',
    'onboarding',
    'paging',
  ],
  description:
    'A row of page indicators under a paging view, as on iOS: one dot per page, the current one highlighted. A tap or a click to either side of the current dot moves one page that way, and sliding a finger or dragging the mouse across the dots scrubs straight to the page under it. Under a finger (any touch device, iOS and Android alike), with more than ten pages the row is a window whose edge dots shrink to show there is more, and a held finger shows a platter behind the dots; with a mouse a long row is cropped to the control. Experimental: lands in lab first.',
  props: [
    {
      name: 'totalPages',
      type: 'number',
      description: 'Number of pages.',
      required: true,
    },
    {
      name: 'page',
      type: 'number',
      description: 'Current page number (1-based). Page 1 is the first page.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(page: number) => void',
      description:
        'Called with the page, 1-based, that a tap, a click, a scrub, an arrow key, Home, End or an assistive technology asks for; a scrub calls it each time the page under the pointer changes, so a quick sweep can skip a page. Update the paging view and page together.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Names the control for assistive technology. Defaults to "Page indicators", localized.',
    },
    {
      name: 'hidesForSinglePage',
      type: 'boolean',
      description: 'Render nothing when there is only one page.',
      default: 'false',
    },
  ],
  usage: {
    description:
      'Use PageControl below a paging view, such as a Carousel with `hasSnap` or onboarding screens, to show how many pages there are and which one is showing. Keep its page in step with the view in both directions.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pair it with a view that pages by swipe: the control is a secondary way to move and the main way to see where you are.',
      },
      {
        guidance: true,
        description:
          'Keep pages few enough to count at a glance; past ten the row stays a fixed width, shows a window of them and scrolls as the page changes.',
      },
      {
        guidance: false,
        description:
          "Don't use it for long lists of results (use Pagination) or for choosing between views (use SegmentedControl or TabList).",
      },
    ],
  },
};

export const docsZh = {
  "name": "PageControl",
  "displayName": "Page Control",
  "description": "分页视图下方的一行页面指示器，类似 iOS：每页一个圆点，当前页高亮。点按或点击当前圆点任一侧会向该方向移动一页；在圆点上滑动手指或拖动鼠标会直接擦洗到指针下方的页面。在手指触摸下（任何触摸设备，iOS 和 Android 均如此），当页数超过十个时，该行会变成一个窗口，边缘圆点缩小以表示还有更多页面，按住手指会在圆点后方显示托盘；使用鼠标时，过长的一行会被裁剪到控件范围内。实验性功能：先在 lab 中发布。",
  "usage": {
    "description": "将 PageControl 放在分页视图下方，例如带 `hasSnap` 的 Carousel 或引导页，以显示共有多少页以及当前显示哪一页。让它的页码与视图双向保持同步。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将其与通过滑动分页的视图搭配使用：该控件是移动的次要方式，也是查看当前位置的主要方式。"
      },
      {
        "guidance": true,
        "description": "页数应少到一眼可数；超过十个后，该行保持固定宽度，只显示其中一段窗口，并随页面变化滚动。"
      },
      {
        "guidance": false,
        "description": "不要将其用于较长的结果列表（请使用 Pagination），也不要用于在视图之间选择（请使用 SegmentedControl 或 TabList）。"
      }
    ]
  },
  "propDescriptions": {
    "totalPages": "页面数量。",
    "page": "当前页码（从 1 开始）。第 1 页即第一页。",
    "onChange": "当点按、点击、擦洗、方向键、Home、End 或辅助技术请求某一页（从 1 开始）时调用；擦洗时，指针下方页面每次变化都会调用，因此快速掠过可能跳过某一页。请同时更新分页视图和 page。",
    "label": "为辅助技术命名该控件。默认值为本地化的 \"Page indicators\"。",
    "hidesForSinglePage": "只有一页时不渲染任何内容。"
  }
};
