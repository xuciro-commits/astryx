// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Thumbnail',
  displayName: 'Thumbnail',
  category: 'Content',
  keywords: ["thumbnail","attachment","preview","image","upload","dismiss","remove","loading"],
  props: [
    {
      name: 'src',
      type: 'string',
      description: 'Image source URL.',
    },
    {
      name: 'alt',
      type: 'string',
      description: 'Alt text for the image. When omitted, the image is explicitly decorative (alt="", role="presentation", aria-hidden) and hidden from screen readers; a dev warning fires if neither alt nor label is set.',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label (e.g. file name). Shown as tooltip on hover.',
    },
    {
      name: 'onRemove',
      type: '(e: React.MouseEvent) => void',
      description: 'Callback for the overlaid remove button.',
    },
    {
      name: 'onClick',
      type: '(e: React.MouseEvent) => void',
      description: 'Click handler. Adds button semantics and a hover overlay.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description: 'Shows skeleton (no src) or upload overlay (with src).',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the thumbnail is disabled.',
      default: 'false',
    },
    {
      name: 'showRemoveOn',
      type: "'always' | 'hover'",
      description:
        'When the remove button is visible. `hover` (the default) reveals it on hover and on keyboard focus, and keeps it visible under a coarse primary pointer (a phone or tablet); `always` shows it at rest. Only applies when `onRemove` is set.',
      default: "'hover'",
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'CSS class name for the root element. Prefer xstyle for styling; className is provided for integration with non-StyleX systems.',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description: 'Inline styles for the root element. Prefer xstyle for styling; inline styles bypass StyleX optimization.',
    },
    {
      name: 'data-testid',
      type: 'string',
      description: 'Test selector for automated testing frameworks.',
    },
  ],
  theming: {
    targets: [
      {className: 'astryx-thumbnail'},
    ],
    vars: [
      {name: '--_thumbnail-hit-inset', description: 'Outset of the remove button\'s invisible hit area, applied to a ::after overlay. 0 on a fine pointer; negative on a coarse one, which grows the 20px button to the 24px touch target without changing what is drawn.', default: '0px', private: true},
      {name: '--_press-overlay', description: 'Colour of the ::after interaction overlay for the hover and mouse states: transparent at rest, the hover overlay token on hover (hover-capable pointers), the pressed overlay token while a mouse holds `:active`. A press the touch press controller paints (`data-astryx-press`) is the overlay\'s image instead, at the press\'s strength, and the colour yields to it. Set on the card element by its own interaction arms.', default: 'transparent', private: true},
    ],
  },
  usage: {
    description:
      'Thumbnail displays a compact, square preview of an image attachment. It shows a shimmer effect while uploading, the image on success, and a placeholder icon when no source is set. Use it in chat composers, file upload lists, or anywhere you need a small image preview with optional remove and click actions.',
    bestPractices: [
      {guidance: true, description: 'Always provide a label prop with the file name so the thumbnail and its remove button are accessible to screen readers and show a tooltip on hover.'},
      {guidance: true, description: 'Use isLoading without a src to show a skeleton during initial upload, and isLoading with a src to show a spinner overlay once a preview URL is available.'},
      {guidance: true, description: 'Pair onClick with a lightbox or detail view so users can inspect the full image; the thumbnail adds button semantics and a hover overlay automatically.'},
      {guidance: false, description: "Don't use Thumbnail for non-image file types like PDFs or spreadsheets; use a file attachment component with an appropriate icon instead."},
      {guidance: false, description: "Don't omit alt text when a src is provided; screen readers need a description of the image content, not just the file name from label."},
    ],
    anatomy: [
      {name: 'Image', required: false, description: 'The preview image, displayed as a square with cover fit.'},
      {name: 'Placeholder', required: false, description: 'An image silhouette icon shown when no src is provided.'},
      {name: 'Remove button', required: false, description: 'An overlaid close button in the top-right corner. Appears when onRemove is set. Sits on a fixed --color-overlay scrim with an --color-on-dark icon to stay visible on any image.'},
      {name: 'Upload overlay', required: false, description: 'A semi-transparent overlay with a spinner, shown when isLoading is true and a src preview is available.'},
      {name: 'Skeleton', required: false, description: 'A shimmer animation shown when isLoading is true and no src is set.'},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "propDescriptions": {
    "src": "图片源 URL。",
    "alt": "图片的替代文本。省略时，图片被明确视为装饰性内容（alt=\"\"、role=\"presentation\"、aria-hidden），并从屏幕阅读器中隐藏；如果既未设置 alt 也未设置 label，开发环境会发出警告。",
    "label": "可访问标签（例如文件名）。悬停时作为工具提示显示。",
    "onRemove": "覆盖式移除按钮的回调。",
    "onClick": "点击处理函数。添加按钮语义和悬停覆盖层。",
    "isLoading": "显示骨架屏（无 src）或上传覆盖层（有 src）。",
    "isDisabled": "缩略图是否已禁用。",
    "showRemoveOn": "移除按钮何时可见。`hover`（默认值）在悬停和键盘聚焦时显示，并在粗指针主输入设备（手机或平板）上保持可见；`always` 在静止时显示。仅在设置了 `onRemove` 时适用。",
    "xstyle": "用于布局自定义（边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值，而不是 style={{}} 这样的内联样式对象。",
    "className": "根元素的 CSS 类名。优先使用 xstyle 进行样式设置；className 是为了与非 StyleX 系统集成而提供的。",
    "style": "根元素的内联样式。优先使用 xstyle 进行样式设置；内联样式会绕过 StyleX 优化。",
    "data-testid": "用于自动化测试框架的测试选择器。"
  },
  "usage": {
    "description": "Thumbnail 显示图片附件的紧凑方形预览。上传时显示微光效果，成功时显示图片，未设置来源时显示占位图标。用于聊天输入框、文件上传列表或任何需要小型图片预览并可选移除和点击操作的地方。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "始终提供带文件名的 label 属性，使缩略图及其移除按钮对屏幕阅读器可访问，并在悬停时显示工具提示。"
      },
      {
        "guidance": true,
        "description": "在没有 src 时使用 isLoading 以在初始上传期间显示骨架屏；在有 src 时使用 isLoading 以在预览 URL 可用后显示加载指示器覆盖层。"
      },
      {
        "guidance": true,
        "description": "将 onClick 与灯箱或详情视图配合使用，让用户可以查看完整图片；缩略图会自动添加按钮语义和悬停覆盖层。"
      },
      {
        "guidance": false,
        "description": "不要将 Thumbnail 用于 PDF 或电子表格等非图片文件类型；请改用带合适图标的文件附件组件。"
      },
      {
        "guidance": false,
        "description": "提供 src 时不要省略 alt 文本；屏幕阅读器需要图片内容的描述，而不仅仅是来自 label 的文件名。"
      }
    ],
    "anatomy": [
      {
        "name": "图片",
        "required": false,
        "description": "预览图片，以 cover 填充方式显示为方形。"
      },
      {
        "name": "占位符",
        "required": false,
        "description": "未提供 src 时显示的图片轮廓图标。"
      },
      {
        "name": "移除按钮",
        "required": false,
        "description": "右上角的覆盖式关闭按钮。设置 onRemove 时出现。它位于固定的 --color-overlay 遮罩上，使用 --color-on-dark 图标，以便在任何图片上都保持可见。"
      },
      {
        "name": "上传覆盖层",
        "required": false,
        "description": "带有加载指示器的半透明覆盖层，当 isLoading 为 true 且存在 src 预览时显示。"
      },
      {
        "name": "骨架屏",
        "required": false,
        "description": "当 isLoading 为 true 且未设置 src 时显示的微光动画。"
      }
    ]
  },
  "name": "Thumbnail"
};

export const docsDense = {
  description:
    'Square preview card for image attachments. Skeleton shimmer on upload, image on success, placeholder when no src.',
  usage: {
    description:
      'Compact square image preview. Shimmer while uploading, image on success, placeholder when empty. Use in chat composers, file lists, or small media previews.',
    bestPractices: [
      {guidance: true, description: 'Always set label (file name) for a11y; powers screen reader announce + hover tooltip.'},
      {guidance: true, description: 'isLoading w/o src \u2192 skeleton; isLoading w/ src \u2192 spinner overlay. Two distinct loading states.'},
      {guidance: true, description: 'onClick adds button semantics + hover overlay; pair with lightbox for full preview.'},
      {guidance: false, description: "Don't use for non-image files (PDF, xlsx); use file attachment component with icon instead."},
      {guidance: false, description: "Don't omit alt when src present; screen readers need image content description, not just label."},
    ],
  },
  propDescriptions: {
    src: 'Image source URL.',
    alt: 'Alt text for image. Omitted → explicitly decorative (alt="" + role="presentation" + aria-hidden); dev warn when src set with no alt and no label.',
    label: 'Accessible label (file name). Tooltip on hover, aria-label.',
    onRemove: '(e) => void. Overlaid remove button callback.',
    onClick: '(e) => void. Adds button semantics + hover overlay.',
    isLoading: 'Skeleton (no src) or upload overlay (with src). Default: false.',
    isDisabled: 'Disabled state. Default: false.',
    showRemoveOn: "When remove button shows: hover (default: reveal on hover/focus, stays visible under coarse primary pointer, e.g. phone/tablet) | always. Only when onRemove set.",
    xstyle: 'stylex.create() for layout.',
    className: 'CSS class. Prefer xstyle.',
    style: 'Inline styles. Prefer xstyle.',
    'data-testid': 'Test selector.',
  },
};
