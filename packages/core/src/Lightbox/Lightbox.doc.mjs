// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Viewer overlay',
    required: true,
    description:
      'Full-viewport dialog overlay that contains the active media and controls.',
  },
  {
    name: 'Media',
    required: true,
    description: 'Active image or video presented inside the viewer.',
  },
  {
    name: 'Close button',
    required: true,
    description: 'Button that closes the viewer.',
  },
  {
    name: 'Previous button',
    required: false,
    description: 'Gallery button that moves to the previous media item.',
  },
  {
    name: 'Next button',
    required: false,
    description: 'Gallery button that moves to the next media item.',
  },
  {
    name: 'Caption',
    required: false,
    description:
      'Caller-provided caption displayed below the active media, in a band at the bottom of the viewer. It shows at most two lines, for a single photo as for a gallery; a longer caption ends in an inline "more" link that opens it in full over the photo.',
  },
  {
    name: 'Counter',
    required: false,
    description: 'Current position and total shown in gallery mode.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Lightbox',
  displayName: 'Lightbox',
  category: 'Overlay',
  keywords: [
    'lightbox',
    'image',
    'video',
    'viewer',
    'gallery',
    'zoom',
    'fullscreen',
    'media',
    'photo',
    'preview',
  ],
  props: [
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Whether the lightbox is open.',
      required: true,
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description:
        'Callback when the lightbox open state changes: the Close button, Escape, a tap beside the media, or, on a phone or tablet, dragging a photo down from its fitted size.',
      required: true,
    },
    {
      name: 'media',
      // Left as the named type on purpose: the shape carries `caption?:
      // ReactNode`, so spelling it out makes the docsite playground parse the
      // whole prop as an editable *string*, which would feed the preview text
      // where a media object belongs. The shape and its legal values live in
      // the description instead (#1645).
      type: 'LightboxMedia | LightboxMedia[]',
      description:
        "Media to display. Pass a single object for one item, or an array for gallery mode with prev/next navigation (on a phone or tablet, a swipe moves between items too). Each item is {src: string, alt: string, caption?: ReactNode, type?: 'image' | 'video'}; type defaults to 'image', and zoom/pan is disabled for 'video'.",
      required: true,
    },
    {
      name: 'index',
      type: 'number',
      description: 'Current index in gallery mode (when media is an array).',
    },
    {
      name: 'onIndexChange',
      type: '(index: number) => void',
      description:
        'Callback when the gallery index changes: prev/next, the arrow keys, or a swipe.',
    },
    {
      name: 'hasZoom',
      type: 'boolean',
      description:
        'Enable zoom (images only): pinch (or ctrl-wheel), or double-tap or double-click to zoom in at that point and back; Enter/Space/+/- zoom 2× about the centre and back, and 0 returns to the fitted size. When zoomed, drag or scroll a trackpad to pan, or use arrow keys; on a phone or a tablet, the pan has momentum.',
      default: 'false',
    },
    {
      name: 'defaultIndex',
      type: 'number',
      description:
        'Initial image index in gallery mode for uncontrolled usage.',
      default: '0',
    },
    {
      name: 'hasAutoPlay',
      type: 'boolean',
      description:
        'Automatically start video playback when a video media item is shown.',
      default: 'false',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization. Must be stylex.create() value.',
    },
  ],
  theming: {
    targets: [{className: 'astryx-lightbox', visualProps: []}],
  },
  usage: {
    anatomy,
    description:
      'A fullscreen overlay for viewing images and videos at full resolution. Supports single-item and gallery modes with prev/next navigation and swiping, optional zoom and pan for images, and native video controls.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Always provide alt text for every image for screen reader accessibility.',
      },
      {
        guidance: true,
        description:
          'Use gallery mode with onIndexChange for multi-image sets.',
      },
      {
        guidance: true,
        description:
          'Enable hasZoom only when viewing high-resolution images that benefit from close inspection.',
      },
      {
        guidance: false,
        description:
          'Use the lightbox for content other than images and videos; it shows one media item at a time.',
      },
      {
        guidance: false,
        description:
          'Nest interactive content inside captions; keep them plain text.',
      },
    ],
  },
  // The lightbox opens via showModal() and renders nothing while closed —
  // overlay mode gives the Properties preview an open trigger instead of an
  // empty stage, mirroring MobileNav (#3616).
  playground: {
    overlay: true,
    defaults: {
      isOpen: false,
      media: {
        src: '/template-assets/light-scene-horizontal-1.png',
        alt: 'Coastal shoreline with ocean waves',
        caption:
          'A scenic coastline with waves rolling onto a sandy beach beneath a clear sky.',
      },
    },
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Lightbox",
  "displayName": "Lightbox",
  "props": [
    {
      "name": "isOpen",
      "type": "boolean",
      "description": "灯箱是否打开。",
      "required": true
    },
    {
      "name": "onOpenChange",
      "type": "(isOpen: boolean) => void",
      "description": "灯箱打开状态变化时的回调：关闭按钮、Escape、点击媒体旁区域，或在手机/平板上下拉照片离开其适配尺寸。",
      "required": true
    },
    {
      "name": "media",
      "type": "LightboxMedia | LightboxMedia[]",
      "description": "要显示的媒体。传入单个对象表示一项，或传入数组启用带上一项/下一项导航的画廊模式（在手机或平板上也可滑动切换项）。每项为 {src: string, alt: string, caption?: ReactNode, type?: 'image' | 'video'}；type 默认为 'image'，'video' 禁用缩放/平移。",
      "required": true
    },
    {
      "name": "index",
      "type": "number",
      "description": "画廊模式下的当前索引（当 media 为数组时）。"
    },
    {
      "name": "onIndexChange",
      "type": "(index: number) => void",
      "description": "画廊索引变化时的回调：上一项/下一项、方向键或滑动。"
    },
    {
      "name": "hasZoom",
      "type": "boolean",
      "description": "启用缩放（仅图像）：双指捏合（或 Ctrl+滚轮），或双击在该点放大并返回；Enter/Space/+/- 以中心为基准缩放 2× 并返回，0 恢复适配尺寸。放大后，拖动或滚动触控板可平移，也可使用方向键；在手机或平板上，平移带有惯性。",
      "default": "false"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义的 StyleX 样式。必须是 stylex.create() 的返回值。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-lightbox",
        "visualProps": []
      }
    ]
  },
  "usage": {
    "anatomy": [
      {
        "name": "查看器浮层",
        "required": true,
        "description": "包含活动媒体和控件的全视口对话框浮层。"
      },
      {
        "name": "媒体",
        "required": true,
        "description": "查看器中呈现的活动图像或视频。"
      },
      {
        "name": "关闭按钮",
        "required": true,
        "description": "关闭查看器的按钮。"
      },
      {
        "name": "上一项按钮",
        "required": false,
        "description": "画廊中移动到上一媒体项的按钮。"
      },
      {
        "name": "下一项按钮",
        "required": false,
        "description": "画廊中移动到下一媒体项的按钮。"
      },
      {
        "name": "说明文字",
        "required": false,
        "description": "调用方提供的说明文字，显示在活动媒体下方、查看器底部的横带中。无论单张照片还是画廊，最多显示两行；较长的说明以行内“更多”链接结尾，点击后会在照片上方完整展开。"
      },
      {
        "name": "计数器",
        "required": false,
        "description": "画廊模式中显示的当前位置和总数。"
      }
    ],
    "description": "用于以全分辨率查看图像和视频的全屏浮层。支持单项和画廊模式，带上一项/下一项导航和滑动操作，图像可选缩放和平移，视频使用原生控件。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "始终为每张图像提供替代文本，以满足屏幕阅读器无障碍要求。"
      },
      {
        "guidance": true,
        "description": "多图像集合请使用带 onIndexChange 的画廊模式。"
      },
      {
        "guidance": true,
        "description": "仅在查看高分辨率图像且需要近距离查看时启用 hasZoom。"
      },
      {
        "guidance": false,
        "description": "将灯箱用于图像和视频之外的内容；它一次只显示一个媒体项。"
      },
      {
        "guidance": false,
        "description": "在说明文字中嵌套交互内容；请保持纯文本。"
      }
    ]
  },
  "propDescriptions": {
    "isOpen": "灯箱是否打开。",
    "onOpenChange": "灯箱打开状态变化时的回调：关闭按钮、Escape、点击媒体旁区域，或在手机/平板上下拉照片离开其适配尺寸。",
    "media": "要显示的媒体。传入单个对象表示一项，或传入数组启用带上一项/下一项导航的画廊模式（在手机或平板上也可滑动切换项）。每项为 {src: string, alt: string, caption?: ReactNode, type?: 'image' | 'video'}；type 默认为 'image'，'video' 禁用缩放/平移。",
    "index": "画廊模式下的当前索引（当 media 为数组时）。",
    "onIndexChange": "画廊索引变化时的回调：上一项/下一项、方向键或滑动。",
    "hasZoom": "启用缩放（仅图像）：双指捏合（或 Ctrl+滚轮），或双击在该点放大并返回；Enter/Space/+/- 以中心为基准缩放 2× 并返回，0 恢复适配尺寸。放大后，拖动或滚动触控板可平移，也可使用方向键；在手机或平板上，平移带有惯性。",
    "defaultIndex": "非受控使用时画廊模式的初始图像索引。",
    "hasAutoPlay": "显示视频媒体项时自动开始播放。",
    "xstyle": "用于布局自定义的 StyleX 样式。必须是 stylex.create() 的返回值。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Fullscreen overlay for viewing images and videos at full resolution with gallery navigation and zoom.',
  usage: {
    anatomy,
    description:
      'A fullscreen overlay for viewing images and videos at full resolution. Supports single-item and gallery modes with prev/next navigation and swiping, optional zoom and pan for images, and native video controls.',
    bestPractices: [
      {guidance: true, description: 'Always provide alt text for every image.'},
      {
        guidance: true,
        description:
          'Use gallery mode with onIndexChange for multi-image sets.',
      },
      {
        guidance: true,
        description:
          'Enable hasZoom only when viewing high-resolution images that benefit from close inspection.',
      },
      {
        guidance: false,
        description:
          'Use for content other than images and videos; one media item at a time.',
      },
      {
        guidance: false,
        description:
          'Nest interactive content inside captions; keep them plain text.',
      },
    ],
  },
  propDescriptions: {
    isOpen: 'Whether the lightbox is open.',
    onOpenChange:
      'Callback when open state changes (including a photo dragged down).',
    media: 'Single media object or array for gallery mode.',
    index: 'Current index in gallery mode.',
    onIndexChange:
      'Callback when gallery index changes (buttons, keys or a swipe).',
    hasZoom:
      'Enable zoom (pinch or ctrl-wheel, double-tap or double-click, Enter/Space, or +/-; 0 resets) and pan (drag, trackpad scroll, or arrow keys) for images.',
    xstyle: 'StyleX styles for layout customization.',
  },
};
