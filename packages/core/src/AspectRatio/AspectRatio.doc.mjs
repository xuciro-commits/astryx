// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'AspectRatio',
  displayName: 'Aspect Ratio',
  category: 'Layout',
  keywords: ["aspect-ratio","ratio","proportion","responsive","embed","container","widescreen","thumbnail","letterbox","crop"],
  usage: {
    description:
      'Maintains a fixed width-to-height ratio for its children as its container resizes. Use it for media containers like videos, images, thumbnails, or any content that needs consistent proportions. It takes its width from the container and derives its height from the ratio, so it needs an ancestor with a definite width.',
    bestPractices: [
      {guidance: true, description: 'Express the ratio as a fraction for readability — `ratio={16 / 9}` rather than `ratio={1.78}`. It is a number, so the string form `ratio="16/9"` is a type error.'},
      {guidance: true, description: 'Use for media that needs consistent proportions across screen sizes.'},
      {guidance: true, description: 'Use `fit="cover"` for images and video so the component sizes the child; the child should not repeat `width`/`height`/`objectFit` styles.'},
      {guidance: true, description: 'Pass one child. With `fit` set, every direct child is stretched to fill the box, so put an overlay or caption inside a single wrapper child rather than passing it as a second child.'},
      {guidance: true, description: 'Describe media children with `alt`, or `alt=""` when the image is decorative. AspectRatio adds no role and no accessible name of its own, so the child carries the whole accessible description.'},
      {guidance: true, description: 'For a breakpoint-dependent ratio, override the ratio responsively: pass an `aspectRatio` rule via `xstyle` (StyleX), or override `aspect-ratio` from your own unlayered CSS under a `@media`/`@container` rule; component styles live in the `astryx-base` cascade layer, so unlayered consumer CSS wins. Give an `xstyle` rule a `default` branch alongside the conditional one (`{default: 3, \'@container ...\': \'3 / 2\'}`); with only the conditional branch the ratio is unset outside the query and the box collapses.'},
      {guidance: false, description: 'Use for general layout containers; use standard layout components instead.'},
      {guidance: false, description: 'Nest AspectRatio containers; one level is sufficient.'},
      {guidance: false, description: 'Constrain the height on its own. The width comes from the container, so a `height` or `maxHeight` by itself clamps the box off ratio; pair it with `width: "auto"` to size from the height instead.'},
      {guidance: false, description: 'Place it in a shrink-to-fit parent such as `inline-flex`, `width: fit-content` or a floated box. It contributes no intrinsic width there and collapses to zero.'},
    ],
    anatomy: [
      {name: 'Ratio box', required: true, description: 'The outer element that holds the aspect ratio and clips overflow. Carries the `astryx-aspect-ratio` theme target, and the elliptical clip when `shape` is `ellipse`.'},
      {name: 'Content slot', required: true, description: 'A wrapper that fills the ratio box and positions the child. With `fit` set it also sizes the child; without it the child styles itself.'},
    ],
  },
  props: [
    {
      name: 'ratio',
      type: 'number',
      description: 'Aspect ratio as width/height (e.g. 16/9, 1). Emitted as a class-level declaration (never inline), so `xstyle` rules or unlayered consumer CSS can override it responsively.',
      required: true,
    },
    {
      name: 'shape',
      type: "'rectangle' | 'ellipse'",
      description: 'Container shape. Both respect the `ratio`. `ellipse` clips to an oval (a circle when `ratio={1}`).',
      default: "'rectangle'",
    },
    {
      name: 'fit',
      type: "'cover' | 'contain' | 'center'",
      description: 'How the child is sized inside the ratio box. `cover` fills and crops media, `contain` fills and letterboxes, `center` keeps the natural size centered. When omitted, the child styles itself.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content positioned absolutely to fill the container.',
      required: true,
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
  ],
  playground: {
    defaults: {
      ratio: 16 / 9,
      children: {__element: 'Center', props: {height: '100%'}, children: {__element: 'Text', props: {color: 'secondary'}, children: '16:9'}},
    },
  },
  theming: {
    targets: [
      {className: 'astryx-aspect-ratio', visualProps: ['shape']},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "AspectRatio",
  "displayName": "Aspect Ratio",
  "usage": {
    "description": "在容器尺寸变化时为其子元素保持固定的宽高比。用于视频、图片、缩略图等媒体容器，或任何需要一致比例的内容。它的宽度取自容器，高度由比例推导得出，因此需要一个具有确定宽度的祖先元素。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "为便于阅读，用分数形式表达比例——写成 `ratio={16 / 9}`，而不是 `ratio={1.78}`。该值是数字，因此字符串形式 `ratio=\"16/9\"` 会导致类型错误。"
      },
      {
        "guidance": true,
        "description": "用于在不同屏幕尺寸下需要保持一致比例的媒体。"
      },
      {
        "guidance": true,
        "description": "对图片和视频使用 `fit=\"cover\"`，由组件负责子元素的尺寸；子元素不应重复设置 `width`/`height`/`objectFit` 样式。"
      },
      {
        "guidance": true,
        "description": "只传入一个子元素。设置 `fit` 后，每个直接子元素都会被拉伸以填满盒子，因此请把叠加层或说明文字放进同一个包裹子元素中，而不要作为第二个子元素传入。"
      },
      {
        "guidance": true,
        "description": "用 `alt` 描述媒体子元素；图片为装饰性时使用 `alt=\"\"`。AspectRatio 本身不添加 role，也不提供可访问名称，因此整个无障碍描述都由子元素承担。"
      },
      {
        "guidance": true,
        "description": "若比例需要随断点变化，可响应式地覆盖比例：通过 `xstyle`（StyleX）传入 `aspectRatio` 规则，或在 `@media`/`@container` 规则下用自己未分层（unlayered）的 CSS 覆盖 `aspect-ratio`；组件样式位于 `astryx-base` 级联层，因此未分层的使用方 CSS 会胜出。给 `xstyle` 规则同时提供 `default` 分支和条件分支（`{default: 3, '@container ...': '3 / 2'}`）；若只有条件分支，查询之外的比例将未设置，盒子会塌陷。"
      },
      {
        "guidance": false,
        "description": "用于一般布局容器；请改用标准布局组件。"
      },
      {
        "guidance": false,
        "description": "嵌套 AspectRatio 容器；一层就足够。"
      },
      {
        "guidance": false,
        "description": "单独约束高度。宽度来自容器，因此仅设置 `height` 或 `maxHeight` 会让盒子偏离比例；请搭配 `width: \"auto\"`，改为按高度确定尺寸。"
      },
      {
        "guidance": false,
        "description": "将它放入收缩适应（shrink-to-fit）的父元素，如 `inline-flex`、`width: fit-content` 或浮动盒子。在这种环境中它不贡献固有宽度，会塌缩为零。"
      }
    ],
    "anatomy": [
      {
        "name": "比例盒",
        "required": true,
        "description": "承载宽高比并裁剪溢出内容的外层元素。带有 `astryx-aspect-ratio` 主题目标，并在 `shape` 为 `ellipse` 时提供椭圆裁剪。"
      },
      {
        "name": "内容槽",
        "required": true,
        "description": "填满比例盒并定位子元素的包裹层。设置 `fit` 时它也负责子元素的尺寸；未设置时由子元素自行设置样式。"
      }
    ]
  },
  "props": [
    {
      "name": "ratio",
      "type": "number",
      "description": "宽高比，形式为宽/高（例如 16/9、1）。以类级声明输出（绝不内联），因此 `xstyle` 规则或未分层的使用方 CSS 可以响应式地覆盖它。",
      "required": true
    },
    {
      "name": "shape",
      "type": "'rectangle' | 'ellipse'",
      "description": "容器形状。两种取值都遵循 `ratio`。`ellipse` 会裁剪为椭圆（`ratio={1}` 时为圆形）。",
      "default": "'rectangle'"
    },
    {
      "name": "fit",
      "type": "'cover' | 'contain' | 'center'",
      "description": "子元素在比例盒内的尺寸处理方式。`cover` 填满并裁剪媒体，`contain` 填满并留边，`center` 按自然尺寸居中。省略时，子元素自行设置样式。"
    },
    {
      "name": "children",
      "type": "ReactNode",
      "description": "以绝对定位填满容器的内容。",
      "required": true
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 `stylex.create()` 的值，而不是 `style={{}}` 这样的内联样式对象。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-aspect-ratio",
        "visualProps": [
          "shape"
        ]
      }
    ]
  },
  "propDescriptions": {
    "ratio": "宽高比，形式为宽/高（例如 16/9、1）。以类级声明输出（绝不内联），因此 `xstyle` 规则或未分层的使用方 CSS 可以响应式地覆盖它。",
    "shape": "容器形状。两种取值都遵循 `ratio`。`ellipse` 会裁剪为椭圆（`ratio={1}` 时为圆形）。",
    "fit": "子元素在比例盒内的尺寸处理方式。`cover` 填满并裁剪媒体，`contain` 填满并留边，`center` 按自然尺寸居中。省略时，子元素自行设置样式。",
    "children": "以绝对定位填满容器的内容。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 `stylex.create()` 的值，而不是 `style={{}}` 这样的内联样式对象。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'maintains specific aspect ratio for children',
  usage: {
    description:
      'Maintains a fixed width-to-height ratio for its children as its container resizes. Use it for media containers like videos, images, thumbnails, or any content that needs consistent proportions. It takes its width from the container and derives its height from the ratio, so it needs an ancestor with a definite width.',
    bestPractices: [
      {guidance: true, description: 'Express the ratio as a fraction for readability — `ratio={16 / 9}` rather than `ratio={1.78}`. It is a number, so the string form `ratio="16/9"` is a type error.'},
      {guidance: true, description: 'Use for media that needs consistent proportions across screen sizes.'},
      {guidance: true, description: 'Use `fit="cover"` for images and video so the component sizes the child; the child should not repeat `width`/`height`/`objectFit` styles.'},
      {guidance: true, description: 'Pass one child. With `fit` set, every direct child is stretched to fill the box, so put an overlay or caption inside a single wrapper child rather than passing it as a second child.'},
      {guidance: true, description: 'Describe media children with `alt`, or `alt=""` when the image is decorative. AspectRatio adds no role and no accessible name of its own, so the child carries the whole accessible description.'},
      {guidance: true, description: 'For a breakpoint-dependent ratio, override the ratio responsively: pass an `aspectRatio` rule via `xstyle` (StyleX), or override `aspect-ratio` from your own unlayered CSS under a `@media`/`@container` rule; component styles live in the `astryx-base` cascade layer, so unlayered consumer CSS wins. Give an `xstyle` rule a `default` branch alongside the conditional one (`{default: 3, \'@container ...\': \'3 / 2\'}`); with only the conditional branch the ratio is unset outside the query and the box collapses.'},
      {guidance: false, description: 'Use for general layout containers; use standard layout components instead.'},
      {guidance: false, description: 'Nest AspectRatio containers; one level is sufficient.'},
      {guidance: false, description: 'Constrain the height on its own. The width comes from the container, so a `height` or `maxHeight` by itself clamps the box off ratio; pair it with `width: "auto"` to size from the height instead.'},
      {guidance: false, description: 'Place it in a shrink-to-fit parent such as `inline-flex`, `width: fit-content` or a floated box. It contributes no intrinsic width there and collapses to zero.'},
    ],
    anatomy: [
      {name: 'Ratio box', required: true, description: 'The outer element that holds the aspect ratio and clips overflow. Carries the `astryx-aspect-ratio` theme target, and the elliptical clip when `shape` is `ellipse`.'},
      {name: 'Content slot', required: true, description: 'A wrapper that fills the ratio box and positions the child. With `fit` set it also sizes the child; without it the child styles itself.'},
    ],
  },
  propDescriptions: {
    ratio: 'width/height ratio (e.g. 16/9, 1); class-level declaration (never inline) so xstyle/unlayered-CSS @container overrides win',
    shape: "container shape: 'rectangle' (default) | 'ellipse' (circle at ratio 1)",
    fit: "child layout: 'cover' fill+crop | 'contain' fill+letterbox | 'center' natural size; omitted = child styles itself",
    children: 'content positioned absolutely to fill container',
    xstyle: 'StyleX layout customization via stylex.create()',
  },
};
