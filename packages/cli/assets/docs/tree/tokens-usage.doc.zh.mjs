// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for tokens-usage.doc.mjs.
export const docsZh = {
  "title": "在 StyleX 中的用法",
  "description": "如何在 StyleX 样式中导入和使用令牌变量。",
  "sections": [
    {
      "section": "Usage in StyleX",
      "title": "在 StyleX 中的用法",
      "content": [
        {
          "type": "code",
          "label": "使用令牌导入"
        },
        {
          "type": "prose",
          "text": "StyleX、DOM 样式和 SVG 呈现属性使用 `dataVars`。Canvas 及其他需要具体模式解析值的 API 则使用 `resolveThemeToken()` 或 `useTheme().token()`。仅当能保证编译后的 dataVars 输出，或声明带有显式回退值时，原生 CSS 才可使用稳定的自定义属性名称。xstyle、className 和复合组件模式见 {@link namespace:styling}；使用 defineTheme 覆盖令牌见 {@link generic:author-a-theme}。"
        }
      ]
    }
  ]
};
