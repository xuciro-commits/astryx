// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'MediaTheme',
  displayName: 'Media Theme',
  group: 'Utilities',
  category: 'Utility',
  isHiddenFromOverview: true,
  keywords: [
    'theme',
    'dark-mode',
    'light-mode',
    'media',
    'inverted',
    'overlay',
    'scrim',
    'toast',
    'tooltip',
  ],
  playground: {
    defaults: {
      mode: 'auto',
      children: {
        __element: 'Section',
        props: {
          variant: 'transparent',
          padding: 4,
          style: {
            maxWidth: 360,
            backgroundColor: 'var(--color-background-inverted)',
            borderRadius: 'var(--radius-container)',
          },
        },
        children: {
          __element: 'VStack',
          props: {gap: 2},
          children: [
            {
              __element: 'Text',
              props: {type: 'body', weight: 'bold'},
              children: 'Media overlay',
            },
            {
              __element: 'Text',
              props: {type: 'supporting', color: 'secondary'},
              children: 'Text and actions adapt to the dark media surface.',
            },
            {
              __element: 'Button',
              props: {label: 'Watch now', variant: 'secondary', size: 'sm'},
            },
          ],
        },
      },
    },
  },
  usage: {
    description:
      'Provides token overrides for content rendered on inverted surfaces: media overlays, scrims, toasts, and tooltips. The base behavior flips color-scheme so all light-dark() tokens resolve to the correct side. Only a small set of tokens need explicit overrides beyond that. Themes can further customize component appearance on media surfaces via onDark/onLight in defineTheme(), with both token overrides (e.g. "--color-accent": "#90CAF9") and component overrides (e.g. ghost buttons get a border on dark surfaces).',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for any content placed over a dark background (image overlays, video scrims, dark cards) or other inverted surfaces like toasts and tooltips.',
      },
      {
        guidance: true,
        description:
          'Prefer mode="auto" when the surface color comes from a theme token. A token named "inverted" is not guaranteed to be inverted, and auto measures what was actually painted instead of trusting the name. It can even decide that a surface needs no media context at all.',
      },
      {
        guidance: true,
        description:
          'Pair with a background color: MediaTheme flips the token context but does not add a background. Set backgroundColor on the parent element.',
      },
      {
        guidance: true,
        description:
          'Themes can customize components on media surfaces via onDark.components and onLight.components in defineTheme(). For example, add a border to ghost buttons on dark surfaces.',
      },
      {
        guidance: false,
        description:
          'Use MediaTheme for app-level dark mode: use Theme with mode="dark" or mode="system" instead. MediaTheme is for local surface inversions, not page-wide color scheme.',
      },
    ],
  },
  props: [
    {
      name: 'mode',
      type: "'dark' | 'light' | 'auto' | 'off'",
      required: true,
      description:
        'Surface luminance context: dark for content over dark backgrounds (light text, white-tinted interactions), light for content over light backgrounds (dark text, black-tinted interactions), auto to decide from the painted surface (no media context when the ambient text already reads on the surface at 3:1, otherwise the side that reads better), and off to turn it off explicitly. The element renders either way, so a surface can switch contexts without remounting children.',
    },
    {
      name: 'fallback',
      type: "'dark' | 'light'",
      default: "'dark'",
      description:
        'Which side auto uses when the surface cannot be measured: during SSR, on the first client frame, and whenever the backdrop is not knowable from CSS, most often a background-image, whose pixels need sampling (useImageMode) rather than a computed style. Ignored unless mode is auto.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description:
        'Content to render with inverted token context. Components inherit the correct colors automatically.',
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  usage: {
    description:
      'Token overrides for content on inverted surfaces: media overlays, scrims, toasts, tooltips. Base behavior flips color-scheme so all light-dark() tokens resolve to correct side; only a small set of tokens need explicit overrides beyond that. Themes can further customize component appearance on media surfaces via onDark/onLight in defineTheme(), w/ token overrides (e.g. "--color-accent": "#90CAF9") + component overrides (e.g. ghost buttons get border on dark surfaces).',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for any content over dark background (image overlays, video scrims, dark cards) or other inverted surfaces like toasts/tooltips.',
      },
      {
        guidance: true,
        description:
          'Prefer mode="auto" when surface color comes from a theme token; a token named "inverted" is not guaranteed to be; auto measures what was painted.',
      },
      {
        guidance: true,
        description:
          'Pair w/ background color: MediaTheme flips token context but does NOT add background. Set backgroundColor on parent element.',
      },
      {
        guidance: true,
        description:
          'Themes can customize components on media surfaces via onDark.components + onLight.components in defineTheme(). E.g. add border to ghost buttons on dark surfaces.',
      },
      {
        guidance: false,
        description:
          'Use MediaTheme for app-level dark mode: use Theme w/ mode="dark"/mode="system" instead. MediaTheme is for local surface inversions, not page-wide color scheme.',
      },
    ],
  },
  propDescriptions: {
    mode: 'surface luminance context: dark for content over dark backgrounds (light text, white-tinted interactions), light for content over light backgrounds (dark text, black-tinted interactions), auto to decide from painted surface (none if ambient text already reads at 3:1, else better-reading side), off to turn off explicitly (element still renders, so children never remount)',
    fallback:
      'side auto uses when surface is unmeasurable (SSR, first frame, background-image, which needs useImageMode sampling); ignored unless mode is auto',
  },
};

export const docsZh = {
  "name": "MediaTheme",
  "displayName": "Media Theme",
  "usage": {
    "description": "为在反转表面上渲染的内容提供令牌覆盖：媒体浮层、遮罩、Toast 和 Tooltip。基础行为会翻转 color-scheme，使所有 light-dark() 令牌解析到正确的一侧。除此之外只有少量令牌需要显式覆盖。主题可以通过 defineTheme() 中的 onDark/onLight 进一步自定义媒体表面上的组件外观，既支持令牌覆盖（例如 \"--color-accent\": \"#90CAF9\"），也支持组件覆盖（例如 ghost 按钮在深色表面上获得边框）。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于放置在深色背景（图像浮层、视频遮罩、深色卡片）或其他反转表面（如 Toast 和 Tooltip）上的任何内容。"
      },
      {
        "guidance": true,
        "description": "当表面颜色来自主题令牌时，优先使用 mode=\"auto\"。名为 \"inverted\" 的令牌并不保证是反转的，auto 会测量实际绘制的内容，而不是相信名称。它甚至可以判定某个表面完全不需要媒体上下文。"
      },
      {
        "guidance": true,
        "description": "搭配背景色使用：MediaTheme 会翻转令牌上下文，但不会添加背景。请在父元素上设置 backgroundColor。"
      },
      {
        "guidance": true,
        "description": "主题可以通过 defineTheme() 中的 onDark.components 和 onLight.components 自定义媒体表面上的组件。例如，在深色表面上为 ghost 按钮添加边框。"
      },
      {
        "guidance": false,
        "description": "不要将 MediaTheme 用于应用级深色模式：请改用 mode=\"dark\" 或 mode=\"system\" 的 Theme。MediaTheme 用于局部表面反转，而不是页面级配色方案。"
      }
    ]
  },
  "propDescriptions": {
    "mode": "表面亮度上下文：dark 用于深色背景上的内容（浅色文本、白色调交互）；light 用于浅色背景上的内容（深色文本、黑色调交互）；auto 根据绘制的表面决定（当环境文本在表面上的对比度已达到 3:1 时不使用媒体上下文，否则选择可读性更好的一侧）；off 显式关闭。无论哪种模式元素都会渲染，因此表面可以切换上下文而无需重新挂载子项。",
    "fallback": "当表面无法测量时 auto 使用哪一侧：SSR 期间、客户端首帧，以及背景无法从 CSS 得知时（最常见的是 background-image，需要对像素采样（useImageMode）而不是读取计算样式）。除非 mode 为 auto，否则忽略。",
    "children": "使用反转令牌上下文渲染的内容。组件会自动继承正确的颜色。"
  }
};
