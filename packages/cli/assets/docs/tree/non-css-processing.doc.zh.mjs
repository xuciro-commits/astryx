// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for non-css-processing.doc.mjs.
export const docsZh = {
  "title": "非 CSS 处理",
  "description": "使用 resolveThemeTokens() 和 useTheme() 为图表、canvas、SVG 和配置对象解析 DOM 之外的令牌值。",
  "sections": [
    {
      "section": "Non-CSS Processing",
      "title": "非 CSS 处理",
      "content": [
        {
          "type": "prose",
          "text": "当 React 之外的代码需要为已知主题和模式获取令牌值时，请使用 `resolveThemeTokens()` 或 `resolveThemeToken()`。当值应来自最近的 Theme 和活动模式时，请在客户端组件内使用 `useTheme()`。"
        },
        {
          "type": "code",
          "label": "不使用 React 上下文解析令牌"
        },
        {
          "type": "code",
          "label": "从最近的 Theme 解析令牌"
        }
      ]
    },
    {
      "section": "Non-CSS Processing Best Practices",
      "title": "非 CSS 处理最佳实践",
      "content": [
        {
          "type": "list",
          "items": [
            "将返回的 `tokens` 对象用作 memo 依赖项；在活动主题或模式改变之前，它是稳定的。",
            "为图表系列使用 `--color-data-categorical-blue` 等数据可视化令牌，而不要复用任意的 UI 颜色。",
            "在可能的情况下，优先为 SVG 元素使用 CSS 变量（`fill=\"var(--color-accent)\"`）；当 API 需要在 JavaScript 中提供字符串值时，使用令牌解析 API。"
          ]
        },
        {
          "type": "list",
          "items": [
            "不要将令牌解析 API 用于普通的 DOM 样式。请改用 CSS 变量、StyleX 令牌、xstyle 或库别名。",
            "不要假设返回的值反映了所有 CSS 层叠覆盖。它们解析的是当前主题和模式下的令牌；局部 media-surface 覆盖和任意 CSS 覆盖可能不会出现在返回的映射中。"
          ]
        }
      ]
    }
  ]
};
