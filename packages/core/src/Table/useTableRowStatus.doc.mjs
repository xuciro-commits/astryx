// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'useTableRowStatus',
  subComponentOf: 'Table',
  displayName: 'useTableRowStatus',
  description:
    'Hook that returns a TablePlugin which prepends a narrow column signaling per-row status. Return {status, label} for a semantic success, warning, or error: Table resolves the matching glyph and tone through the active theme. Return {color, icon?, label} for a custom marker: every color is paint-only, an omitted icon renders the stable 8px dot, and an explicit icon renders that caller-selected glyph. Named custom icons keep their released Icon color mapping; raw CSS custom icons inherit the caller\'s exact paint instead of the previous primary fallback. Existing callers require no source migration. label is required and becomes the accessible image name plus supplemental hover tooltip; return null for no indicator. The column header is visually blank but carries a screen-reader-only localized name ("Row status", i18n key @astryx.table.rowStatus.columnHeader). Memoize getStatus with useCallback for a stable plugin identity.',
  props: [
    {
      name: 'getStatus',
      type: "(item: T) => ({ status: 'success' | 'warning' | 'error'; color?: never; icon?: never; label: string } | { status?: never; color: 'accent' | 'success' | 'error' | 'warning' | 'red' | 'orange' | 'green' | 'yellow' | 'blue' | 'gray' | string; icon?: IconName; label: string }) | null",
      description:
        'Derive either a semantic outcome or a custom marker. {status, label} accepts the closed success/error/warning vocabulary and resolves its glyph and tone through the active theme. {color, icon?, label} preserves the stable custom-marker path: color always selects paint, no icon renders an 8px dot, and icon renders the explicit caller glyph. Even color values named success/error/warning remain dots without icon. Valid icon names: close, chevronDown, chevronLeft, chevronRight, chevronsLeft, chevronsRight, check, success, error, warning, info, calendar, clock, externalLink, menu, moreHorizontal, search, upload, arrowUp, arrowDown, arrowsUpDown, funnel, eyeSlash, viewColumns, copy, checkDouble, wrench, stop, microphone. The branches are exclusive, label is required and announced via role="img", and null leaves the row status cell empty. Memoize with useCallback for a stable plugin identity.',
      required: true,
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Returns a TablePlugin with a narrow per-row status column. {status,label} resolves themed success/error/warning glyph + tone. Stable {color,icon?,label} stays custom: color is paint-only, no icon = 8px dot, icon = caller glyph. label is required; null leaves the cell empty. Memoize getStatus.',
  propDescriptions: {
    getStatus:
      'Map a row to semantic {status,label}, custom {color,icon?,label}, or null. Semantic status owns themed glyph + tone. Custom color always owns paint; omitted icon = dot, explicit icon = caller glyph. Branches are exclusive and label is required.',
  },
};

export const docsZh = {
  "name": "useTableRowStatus",
  "description": "返回 TablePlugin 的 Hook，该插件会前置一个窄列以指示每行状态。为语义化的 success、warning 或 error 返回 {status, label}：Table 会通过活动主题解析匹配的字形和色调。为自定义标记返回 {color, icon?, label}：每种颜色都仅用于绘制，省略 icon 时渲染稳定的 8px 圆点，显式 icon 则渲染调用方选择的字形。命名自定义图标保留其已发布的 Icon 颜色映射；原始 CSS 自定义图标继承调用方的精确绘制，而不是之前的 primary 回退。现有调用方无需源代码迁移。label 是必需的，会成为无障碍图像名称以及补充的悬停工具提示；返回 null 表示不显示指示器。列页眉视觉上为空，但带有仅供屏幕阅读器使用的本地化名称（\"Row status\"，i18n 键 @astryx.table.rowStatus.columnHeader）。使用 useCallback 记忆化 getStatus 以获得稳定的插件标识。",
  "propDescriptions": {
    "getStatus": "派生语义化结果或自定义标记。{status, label} 接受封闭的 success/error/warning 词汇，并通过活动主题解析其字形和色调。{color, icon?, label} 保留稳定的自定义标记路径：color 始终选择绘制，没有 icon 时渲染 8px 圆点，icon 渲染显式的调用方字形。即使颜色值名为 success/error/warning，没有 icon 时仍保持为圆点。有效图标名称：close、chevronDown、chevronLeft、chevronRight、chevronsLeft、chevronsRight、check、success、error、warning、info、calendar、clock、externalLink、menu、moreHorizontal、search、upload、arrowUp、arrowDown、arrowsUpDown、funnel、eyeSlash、viewColumns、copy、checkDouble、wrench、stop、microphone。各分支互斥，label 是必需的并通过 role=\"img\" 宣布，null 使行状态单元格为空。使用 useCallback 记忆化以获得稳定的插件标识。"
  }
};
