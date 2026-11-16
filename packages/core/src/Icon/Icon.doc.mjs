// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Glyph',
    required: true,
    description: 'Visual symbol rendered for the selected icon.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Icon',
  displayName: 'Icon',
  category: 'Content',
  keywords: [
    'icon',
    'svg',
    'glyph',
    'symbol',
    'pictogram',
    'graphic',
    'vector',
    'arrow',
    'chevron',
    'caret',
    'checkmark',
    'cross',
    'gear',
    'cog',
    'broom',
    'sparkle',
    'sparkles',
    'star',
    'heart',
    'bell',
    'trash',
    'pencil',
    'magnifyingglass',
    'paperclip',
    'house',
    'flame',
    'rocket',
    'lightning',
    'bolt',
    'globe',
    'sun',
    'moon',
    'bookmark',
    'thumbsup',
    'smiley',
    'emoji',
    'lock',
    'eye',
    'cloud',
    'hourglass',
    'trophy',
    'gift',
    'camera',
  ],
  playground: {
    // `icon` is required and its type can't be auto-generated, so the
    // properties-tab preview showed "Missing: icon". Seed a valid semantic
    // icon name so the interactive preview renders.
    defaults: {
      icon: 'search',
    },
  },
  props: [
    {
      name: 'icon',
      type: 'IconName | NamespacedIconName | ComponentType<SVGProps>',
      description:
        'Semantic icon name or SVG component. Valid semantic names: close, chevronDown, chevronLeft, chevronRight, chevronsLeft, chevronsRight, check, success, error, warning, info, calendar, clock, externalLink, menu, moreHorizontal, search, upload, arrowUp, arrowDown, arrowsUpDown, funnel, eyeSlash, viewColumns, copy, checkDouble, wrench, stop, microphone. A namespaced key such as `richtext:bold` names a glyph that one component or library registers, and a theme can replace it by key; a namespaced key that nothing registers renders nothing. For any icon not in this list, pass an SVG component directly (e.g. import from lucide-react or @heroicons/react). Note: this prop is called `icon`, not `name`.',
      required: true,
    },
    {
      name: 'color',
      type: "'primary' | 'secondary' | 'tertiary' | 'disabled' | 'accent' | 'info' | 'success' | 'error' | 'warning' | 'inherit' | 'blue' | 'red' | 'green' | 'gray' | 'cyan' | 'teal' | 'yellow' | 'orange' | 'pink' | 'purple'",
      description:
        'Color variant mapped to Astryx icon color tokens. Semantic values (primary through warning) follow the role, and inherit uses the surrounding text color. On the web, Icon also accepts the palette values blue, red, green, gray, cyan, teal, yellow, orange, pink, and purple, which pick a non-semantic hue.',
      default: "'inherit'",
    },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg'",
      description:
        "Icon size. xsm, sm, md, and lg are 12, 16, 20, and 24px at a 16px root and scale with the root font size; a theme sets a size's glyph dimension with width and height, in px or rem, on components.icon['size:sm'] (and the other sizes). An explicit value wins. When omitted, Icon uses the nearest default supplied by an owning Astryx component for its icon slot, then falls back to md when no contextual default exists.",
      default: "Contextual; otherwise 'md'",
    },
    {
      name: 'variant',
      type: 'IconVariant',
      description:
        "Requests the active theme's alternate artwork for a semantic icon name, such as 'filled'. Names come from IconVariantMap, which an application augments from @astryxdesign/core/Icon; Astryx defines none. The theme's icon entry receives the variant only when the active theme lists it in iconVariants (and, for an entry the theme inherited, the theme that defined the entry lists it too); otherwise it draws its normal artwork. Ignored by an icon component passed directly. Selects artwork only: it is not written to the DOM and has no theming selector.",
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible name for a MEANINGFUL, standalone icon (a status glyph or icon-only indicator with no adjacent text). Setting it exposes the icon to screen readers as role="img" with this text as the accessible name (aria-label) and removes the default aria-hidden. Omit it (default) for decorative icons and the icon stays hidden from assistive tech (aria-hidden="true"). This is the accessible-name / alt-text prop for icons: one prop instead of manually setting aria-label + role + aria-hidden. An empty string is treated as decorative. Do not set it when an interactive parent (Button, IconButton, link) already names the control.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        "StyleX styles for customization (color, size, opacity). Folded into the icon's own stylex.props() call so it composes with the base color/size styles. Must be a stylex.create() value, not an inline style object like style={{}}.",
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Class name added to the rendered glyph, beside the astryx-icon target class.',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description:
        "Inline styles merged onto the rendered glyph after Icon's own size and color styles.",
    },
    {
      name: 'ref',
      type: 'Ref<SVGSVGElement>',
      description:
        'Ref to the rendered SVG element, for an icon component and for a semantic or namespaced name. For a name, it is the <svg> inside the wrapper, or null when the resolved glyph has no <svg>.',
    },
  ],
  theming: {
    targets: [{className: 'astryx-icon', visualProps: ['color', 'size']}],
    vars: [
      {
        name: '--_icon-width',
        description:
          'Glyph width for the size; set by width on the icon target',
        default: '0.75rem, 1rem, 1.25rem, or 1.5rem by size',
        private: true,
      },
      {
        name: '--_icon-height',
        description:
          'Glyph height for the size; set by height on the icon target',
        default: '0.75rem, 1rem, 1.25rem, or 1.5rem by size',
        private: true,
      },
    ],
    derived: [
      {property: 'width', vars: ['--_icon-width'], replaces: true},
      {property: 'height', vars: ['--_icon-height'], replaces: true},
    ],
  },
  usage: {
    description:
      'Icons are small visual symbols that represent actions, objects, or concepts. They improve scannability and reinforce meaning alongside text. Supports both direct SVG components and semantic icon names that adapt to the active theme.',
    anatomy,
    bestPractices: [
      {
        guidance: true,
        description:
          'Use semantic icon names when available; they adapt to theme changes automatically.',
      },
      {
        guidance: true,
        description:
          "Override icons through the theme, not globally: defineTheme({icons: {close: <XMarkIcon />}}) scopes the swap to the active <Theme>, and extends shallow-merges it into derived themes. registerIcons() mutates a process-wide registry and warns in dev, so keep it for app bootstrap rather than making it a library's theming seam.",
      },
      {
        guidance: true,
        description:
          "To match artwork to the rendered size, make a theme or registered icon entry a pure, synchronous function of {size, variant}: defineTheme({icons: {info: ({size}) => <InfoIcon weight={size === 'sm' ? 'bold' : 'regular'} />}}). Icon passes the size it renders at; getIcon(), useIcon(), getIconRegistry() and theme.icons read the function at size md. A function that returns null draws nothing instead of falling back to the default icon. Do not use hooks, measure the DOM, or read browser or mutable state inside it.",
      },
      {
        guidance: true,
        description:
          'Pair icons with text labels for accessibility; icon-only elements need an accessible label.',
      },
      {
        guidance: true,
        description:
          'For a meaningful standalone icon (no adjacent text), give it an accessible name via the `label` prop: it sets role="img" + aria-label and unhides the icon.',
      },
      {
        guidance: true,
        description:
          'Use color tokens for icon colors, not hardcoded hex values.',
      },
      {
        guidance: true,
        description:
          'Be mindful of context; decorative icons in compact components can distract rather than help.',
      },
      {
        guidance: false,
        description:
          'Use icons as the sole means of conveying meaning; always provide a text alternative.',
      },
      {
        guidance: false,
        description:
          'Resize icons with arbitrary pixel values; use the provided size props.',
      },
      {
        guidance: false,
        description:
          'Mix icon styles (e.g. outline and filled) within the same context.',
      },
      {
        guidance: false,
        description:
          'Render raw SVG elements; always wrap in Icon for consistent sizing and color.',
      },
      {
        guidance: false,
        description:
          'Pass a `name` prop; Icon uses `icon` (not `name`) to specify which icon to render.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Icon",
  "displayName": "Icon",
  "props": [
    {
      "name": "icon",
      "type": "IconName | NamespacedIconName | ComponentType<SVGProps>",
      "description": "语义图标名称或 SVG 组件。有效的语义名称：close、chevronDown、chevronLeft、chevronRight、chevronsLeft、chevronsRight、check、success、error、warning、info、calendar、clock、externalLink、menu、moreHorizontal、search、upload、arrowUp、arrowDown、arrowsUpDown、funnel、eyeSlash、viewColumns、copy、checkDouble、wrench、stop、microphone。像 `richtext:bold` 这样的命名空间键表示某个组件或库注册的字形，主题可以按键替换它；没有任何注册的命名空间键不会渲染任何内容。对于不在此列表中的任何图标，请直接传入 SVG 组件（例如从 lucide-react 或 @heroicons/react 导入）。注意：此属性名为 `icon`，而不是 `name`。",
      "required": true
    },
    {
      "name": "color",
      "type": "'primary' | 'secondary' | 'tertiary' | 'disabled' | 'accent' | 'info' | 'success' | 'error' | 'warning' | 'inherit' | 'blue' | 'red' | 'green' | 'gray' | 'cyan' | 'teal' | 'yellow' | 'orange' | 'pink' | 'purple'",
      "description": "映射到 Astryx 图标颜色令牌的颜色变体。语义值（primary 到 warning）遵循角色，inherit 使用周围文本的颜色。在 Web 上，Icon 还接受调色板值 blue、red、green、gray、cyan、teal、yellow、orange、pink 和 purple，它们会选择非语义的色相。",
      "default": "'inherit'"
    },
    {
      "name": "size",
      "type": "'xsm' | 'sm' | 'md' | 'lg'",
      "description": "图标尺寸。在 16px 根字号下，xsm、sm、md 和 lg 分别为 12、16、20 和 24px，并随根字号缩放；主题通过 components.icon['size:sm']（以及其他尺寸）上的 width 和 height（以 px 或 rem 为单位）设置某个尺寸的字形尺寸。显式值优先。省略时，Icon 先使用拥有该图标插槽的 Astryx 组件提供的最近默认值，若不存在上下文默认值则回退到 md。",
      "default": "上下文默认值；否则为 'md'"
    },
    {
      "name": "variant",
      "type": "IconVariant",
      "description": "为语义图标名称请求活动主题的备用图稿，例如 'filled'。名称来自 IconVariantMap，应用可从 @astryxdesign/core/Icon 扩展它；Astryx 自身不定义任何变体。仅当活动主题在 iconVariants 中列出该变体时，主题的图标条目才会收到该变体（对于主题继承的条目，定义该条目的主题也必须列出它）；否则绘制其常规图稿。直接传入的图标组件会忽略此属性。仅选择图稿：它不会写入 DOM，也没有主题选择器。"
    },
    {
      "name": "label",
      "type": "string",
      "description": "为有意义的独立图标（状态字形或没有相邻文本的仅图标指示器）提供无障碍名称。设置后，图标会作为带 role=\"img\" 的图像暴露给屏幕阅读器，此文本作为无障碍名称（aria-label），并移除默认的 aria-hidden。装饰性图标请省略它（默认），图标会继续对辅助技术隐藏（aria-hidden=\"true\"）。这是图标的无障碍名称/替代文本属性：一个属性即可替代手动设置 aria-label + role + aria-hidden。空字符串视为装饰性。如果交互式父元素（Button、IconButton、链接）已为控件命名，则不要设置它。"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于自定义（颜色、尺寸、不透明度）的 StyleX 样式。会合并到图标自身的 stylex.props() 调用中，以便与基础颜色/尺寸样式组合。必须是 stylex.create() 值，而不是像 style={{}} 这样的内联样式对象。"
    },
    {
      "name": "className",
      "type": "string",
      "description": "添加到渲染字形的类名，位于 astryx-icon 目标类旁边。"
    },
    {
      "name": "style",
      "type": "CSSProperties",
      "description": "在 Icon 自身的尺寸和颜色样式之后合并到渲染字形上的内联样式。"
    },
    {
      "name": "ref",
      "type": "Ref<SVGSVGElement>",
      "description": "指向渲染的 SVG 元素的 ref，适用于图标组件以及语义或命名空间名称。对于名称，它是包装元素内的 <svg>；当解析出的字形没有 <svg> 时为 null。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-icon",
        "visualProps": [
          "color",
          "size"
        ]
      }
    ],
    "vars": [
      {
        "name": "--_icon-width",
        "description": "该尺寸的图标宽度；由 icon 目标上的 width 设置",
        "default": "按尺寸为 0.75rem、1rem、1.25rem 或 1.5rem",
        "private": true
      },
      {
        "name": "--_icon-height",
        "description": "该尺寸的图标高度；由 icon 目标上的 height 设置",
        "default": "按尺寸为 0.75rem、1rem、1.25rem 或 1.5rem",
        "private": true
      }
    ],
    "derived": [
      {
        "property": "width",
        "vars": [
          "--_icon-width"
        ],
        "replaces": true
      },
      {
        "property": "height",
        "vars": [
          "--_icon-height"
        ],
        "replaces": true
      }
    ]
  },
  "usage": {
    "description": "图标是代表操作、对象或概念的小型视觉符号。它们提升可扫读性，并在文字旁强化含义。同时支持直接传入 SVG 组件和会随活动主题适配的语义图标名称。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "尽可能使用语义图标名称；它们会自动适应主题变化。"
      },
      {
        "guidance": true,
        "description": "通过主题而不是全局覆盖图标：defineTheme({icons: {close: <XMarkIcon />}}) 将替换范围限定在活动 <Theme> 内，并会浅合并到派生主题中。registerIcons() 会修改进程级注册表并在开发环境发出警告，因此应保留给应用启动阶段，而不是作为库的主题接缝。"
      },
      {
        "guidance": true,
        "description": "要让图稿匹配渲染尺寸，可让主题或已注册的图标条目成为 {size, variant} 的纯同步函数：defineTheme({icons: {info: ({size}) => <InfoIcon weight={size === 'sm' ? 'bold' : 'regular'} />}})。Icon 会传入其渲染的尺寸；getIcon()、useIcon()、getIconRegistry() 和 theme.icons 以 md 尺寸读取该函数。返回 null 的函数会不绘制任何内容，而不是回退到默认图标。不要在其中使用 Hook、测量 DOM 或读取浏览器或可变状态。"
      },
      {
        "guidance": true,
        "description": "为无障碍考虑，将图标与文本标签配对；仅有图标的元素需要无障碍标签。"
      },
      {
        "guidance": true,
        "description": "对于有意义的独立图标（无相邻文本），通过 `label` 属性为其提供无障碍名称：它会设置 role=\"img\" + aria-label 并取消图标的隐藏。"
      },
      {
        "guidance": true,
        "description": "图标颜色使用颜色令牌，而不是硬编码的十六进制值。"
      },
      {
        "guidance": true,
        "description": "注意上下文；紧凑组件中的装饰性图标可能会分散注意力，而不是提供帮助。"
      },
      {
        "guidance": false,
        "description": "不要将图标作为传达含义的唯一手段；始终提供文本替代。"
      },
      {
        "guidance": false,
        "description": "不要用任意像素值调整图标大小；请使用提供的 size 属性。"
      },
      {
        "guidance": false,
        "description": "不要在同一上下文中混用图标风格（例如轮廓和填充）。"
      },
      {
        "guidance": false,
        "description": "不要直接渲染原始 SVG 元素；始终用 Icon 包裹，以获得一致的尺寸和颜色。"
      },
      {
        "guidance": false,
        "description": "不要传入 `name` 属性；Icon 使用 `icon`（而不是 `name`）来指定要渲染的图标。"
      }
    ],
    "anatomy": [
      {
        "name": "字形",
        "required": true,
        "description": "为所选图标渲染的视觉符号。"
      }
    ]
  },
  "propDescriptions": {
    "icon": "语义图标名称或 SVG 组件。有效的语义名称：close、chevronDown、chevronLeft、chevronRight、chevronsLeft、chevronsRight、check、success、error、warning、info、calendar、clock、externalLink、menu、moreHorizontal、search、upload、arrowUp、arrowDown、arrowsUpDown、funnel、eyeSlash、viewColumns、copy、checkDouble、wrench、stop、microphone。像 `richtext:bold` 这样的命名空间键表示某个组件或库注册的字形，主题可以按键替换它；没有任何注册的命名空间键不会渲染任何内容。对于不在此列表中的任何图标，请直接传入 SVG 组件（例如从 lucide-react 或 @heroicons/react 导入）。注意：此属性名为 `icon`，而不是 `name`。",
    "color": "映射到 Astryx 图标颜色令牌的颜色变体。语义值（primary 到 warning）遵循角色，inherit 使用周围文本的颜色。在 Web 上，Icon 还接受调色板值 blue、red、green、gray、cyan、teal、yellow、orange、pink 和 purple，它们会选择非语义的色相。",
    "size": "图标尺寸。在 16px 根字号下，xsm、sm、md 和 lg 分别为 12、16、20 和 24px，并随根字号缩放；主题通过 components.icon['size:sm']（以及其他尺寸）上的 width 和 height（以 px 或 rem 为单位）设置某个尺寸的字形尺寸。显式值优先。省略时，Icon 先使用拥有该图标插槽的 Astryx 组件提供的最近默认值，若不存在上下文默认值则回退到 md。",
    "variant": "为语义图标名称请求活动主题的备用图稿，例如 'filled'。名称来自 IconVariantMap，应用可从 @astryxdesign/core/Icon 扩展它；Astryx 自身不定义任何变体。仅当活动主题在 iconVariants 中列出该变体时，主题的图标条目才会收到该变体（对于主题继承的条目，定义该条目的主题也必须列出它）；否则绘制其常规图稿。直接传入的图标组件会忽略此属性。仅选择图稿：它不会写入 DOM，也没有主题选择器。",
    "label": "为有意义的独立图标（状态字形或没有相邻文本的仅图标指示器）提供无障碍名称。设置后，图标会作为带 role=\"img\" 的图像暴露给屏幕阅读器，此文本作为无障碍名称（aria-label），并移除默认的 aria-hidden。装饰性图标请省略它（默认），图标会继续对辅助技术隐藏（aria-hidden=\"true\"）。这是图标的无障碍名称/替代文本属性：一个属性即可替代手动设置 aria-label + role + aria-hidden。空字符串视为装饰性。如果交互式父元素（Button、IconButton、链接）已为控件命名，则不要设置它。",
    "xstyle": "用于自定义（颜色、尺寸、不透明度）的 StyleX 样式。会合并到图标自身的 stylex.props() 调用中，以便与基础颜色/尺寸样式组合。必须是 stylex.create() 值，而不是像 style={{}} 这样的内联样式对象。",
    "className": "添加到渲染字形的类名，位于 astryx-icon 目标类旁边。",
    "style": "在 Icon 自身的尺寸和颜色样式之后合并到渲染字形上的内联样式。",
    "ref": "指向渲染的 SVG 元素的 ref，适用于图标组件以及语义或命名空间名称。对于名称，它是包装元素内的 <svg>；当解析出的字形没有 <svg> 时为 null。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Renders icons w/ Astryx design system colors + sizes. Supports direct SVG icon components + semantic icon names that adapt to active theme.',
  usage: {
    description:
      'Icons are small visual symbols that represent actions, objects, or concepts. They improve scannability and reinforce meaning alongside text. Supports both direct SVG components and semantic icon names that adapt to the active theme.',
    anatomy,
    bestPractices: [
      {
        guidance: true,
        description:
          'Use semantic icon names when available; they adapt to theme changes automatically.',
      },
      {
        guidance: true,
        description:
          'Override icons via theme, not globally: defineTheme({icons: {close: <XMarkIcon />}}) scopes the swap to the active <Theme>; extends shallow-merges into derived themes. registerIcons() mutates a global registry and warns in dev: app bootstrap only, not a library theming seam.',
      },
      {
        guidance: true,
        description:
          "Size-aware artwork: a theme/registered entry may be a pure sync function of {size, variant}, e.g. info: ({size}) => <InfoIcon weight={size === 'sm' ? 'bold' : 'regular'} />. Icon passes its rendered size; getIcon/useIcon/getIconRegistry/theme.icons read it at md. A null result draws nothing (no fallback). No hooks, DOM measurement, or browser/mutable state.",
      },
      {
        guidance: true,
        description:
          'Pair icons with text labels for accessibility; icon-only elements need an accessible label.',
      },
      {
        guidance: true,
        description:
          'For a meaningful standalone icon (no adjacent text), set an accessible name via `label`: sets role="img" + aria-label, unhides icon.',
      },
      {
        guidance: true,
        description:
          'Use color tokens for icon colors, not hardcoded hex values.',
      },
      {
        guidance: true,
        description:
          'Be mindful of context; decorative icons in compact components can distract rather than help.',
      },
      {
        guidance: false,
        description:
          'Use icons as the sole means of conveying meaning; always provide a text alternative.',
      },
      {
        guidance: false,
        description:
          'Resize icons with arbitrary pixel values; use the provided size props.',
      },
      {
        guidance: false,
        description:
          'Mix icon styles (e.g. outline and filled) within the same context.',
      },
      {
        guidance: false,
        description:
          'Render raw SVG elements; always wrap in Icon for consistent sizing and color.',
      },
      {
        guidance: false,
        description:
          '`name` prop, which does not exist. Use `icon` to specify which icon to render.',
      },
    ],
  },
  propDescriptions: {
    icon: 'Semantic icon name or SVG component. Valid names: close, chevronDown, chevronLeft, chevronRight, chevronsLeft, chevronsRight, check, success, error, warning, info, calendar, clock, externalLink, menu, moreHorizontal, search, upload, arrowUp, arrowDown, arrowsUpDown, funnel, eyeSlash, viewColumns, copy, checkDouble, wrench, stop, microphone. A namespaced key (`richtext:bold`) names a glyph a component or library registers; an unregistered one renders nothing. For others, pass an SVG component.',
    color:
      'Color variant mapped to Astryx icon color tokens; inherit = surrounding text color. Web also accepts the non-semantic palette: blue, red, green, gray, cyan, teal, yellow, orange, pink, purple.',
    size: "xsm/sm/md/lg = 12/16/20/24px at a 16px root, scale w/ root font size; theme sets a size's glyph dimension via width + height (px or rem) on components.icon['size:sm'] etc. Explicit Icon size; otherwise nearest owning-component default, then 'md' when no contextual default exists",
    variant:
      "Requests the active theme's alternate artwork (e.g. 'filled'); names from augmentable IconVariantMap. Reaches the entry only if the active theme's iconVariants lists it (and an inherited entry's defining theme does too); else normal artwork. Ignored by a directly passed component; never in the DOM; no theming selector.",
    label:
      'Accessible name for a meaningful, standalone icon. Sets role="img" + aria-label and drops the default aria-hidden. Omit (default) for decorative icons (stays aria-hidden). Empty string = decorative. The accessible-name/alt-text prop for icons.',
    xstyle:
      'StyleX styles (color, size, opacity) via stylex.create(); composes with the base color/size styles.',
    className: 'Class added to the rendered glyph beside astryx-icon.',
    style: "Inline styles merged after Icon's size and color styles.",
    ref: 'Reaches the rendered SVG for every icon value; null when a resolved glyph has no <svg>.',
  },
};
