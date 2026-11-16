// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for css-and-stylex.doc.mjs.
export const docsZh = {
  "title": "CSS 与 StyleX",
  "description": "Core 集成原则、纯 CSS / CSS Modules，以及 StyleX 类型化令牌导入。",
  "sections": [
    {
      "section": "Core Principle",
      "title": "核心原则",
      "content": [
        {
          "type": "prose",
          "text": "让系统成为主题值的唯一事实来源。组件从 CSS 自定义属性读取设计令牌，例如 `--color-text-primary`、`--color-background-surface`、`--spacing-4` 和 `--radius-container`。其他样式库应尽可能将其自身的语义令牌、工具类名称或主题对象映射到这些系统 CSS 变量。"
        },
        {
          "type": "prose",
          "text": "常规 DOM 样式应使用 CSS 变量，因为它们会沿树继承、遵循 `data-theme` 颜色模式、尊重嵌套的 `data-astryx-theme` 作用域，并会在主题切换时更新。只有非 CSS 使用方（如 SVG 属性值、canvas、图表配置、颜色计算或静态配置生成）才应使用令牌解析器 API。"
        },
        {
          "type": "prose",
          "text": "可用的令牌名称和值请运行 {@link namespace:tokens}。专项参考还可见 {@link generic:color}、{@link generic:spacing}、{@link generic:shape}、{@link namespace:typography}、{@link generic:elevation} 和 {@link generic:motion}。"
        }
      ]
    },
    {
      "section": "Choose an Integration Path",
      "title": "选择集成路径",
      "content": [
        {
          "type": "prose",
          "text": "选择最适合该样式库的最窄集成路径。大多数 DOM 样式应停留在 CSS 变量路径上；JavaScript 令牌解析适用于无法使用 CSS 自定义属性的 API。"
        },
        {
          "type": "table",
          "headers": [
            "路径",
            "适用场景",
            "值形态"
          ],
          "rows": [
            [
              "CSS 变量别名",
              "该库最终会写入 CSS 并接受字符串值",
              "`var(--color-text-primary)`"
            ],
            [
              "StyleX 令牌导入",
              "你在应用代码中编写 StyleX 样式",
              "`colorVars['--color-text-primary']`"
            ],
            [
              "Tailwind 桥接",
              "你希望工具类由当前生效的系统令牌支持",
              "`@astryxdesign/core/tailwind-theme.css`"
            ],
            [
              "设计令牌解析器 API",
              "JavaScript 需要为图表、canvas、SVG 或配置对象获取令牌值",
              "`resolveThemeToken(theme, '--color-data-categorical-blue', {mode})`"
            ]
          ]
        }
      ]
    },
    {
      "section": "Best Practices",
      "title": "最佳实践",
      "content": [
        {
          "type": "list",
          "items": [
            "按语义意图映射：文本、表面、边框、强调色、状态、圆角、间距、排版。",
            "让系统掌控颜色模式。根级 Theme 会将 `data-theme=\"light|dark\"` 和 `data-astryx-theme` 同步到 `<html>`，以供 Portal 和第一层主题作用域使用。",
            "对运行时主题切换和嵌套主题优先使用 CSS 变量。"
          ]
        },
        {
          "type": "list",
          "items": [
            "当 `var(...)` 引用可行时，却将原始十六进制/像素值复制到第二个主题对象中。",
            "运行与 Theme 不一致的第二个未同步深色模式提供程序。",
            "让另一个库的 CSS 变量成为系统的唯一事实来源。某些使用方需要在 DOM 之外获取令牌值。"
          ]
        }
      ]
    },
    {
      "section": "Plain CSS and CSS Modules",
      "title": "纯 CSS 与 CSS Modules",
      "content": [
        {
          "type": "prose",
          "text": "最简单的集成方式是直接使用 CSS 变量。CSS Modules 会限定类名作用域，但系统令牌变量是由包 CSS 和当前主题提供的全局/继承值。"
        },
        {
          "type": "code",
          "label": "Card.module.css"
        },
        {
          "type": "prose",
          "text": "Sass 变量仅存在于编译期。它们适合生成静态 CSS，但不会在系统切换主题或颜色模式时更新。可主题化的值请使用原生 CSS 自定义属性。"
        }
      ]
    },
    {
      "section": "StyleX",
      "title": "StyleX",
      "content": [
        {
          "type": "prose",
          "text": "对于 StyleX 样式，优先使用 `@astryxdesign/core/theme/tokens.stylex` 的类型化令牌导出。它们提供自动补全并能捕获令牌名称拼写错误，同时在运行时仍通过相同的系统 CSS 变量解析。"
        },
        {
          "type": "code",
          "label": "类型化令牌导入"
        },
        {
          "type": "prose",
          "text": "组件覆盖使用 `xstyle`，自己的 DOM 节点使用 `stylex.props()`。集成非 StyleX 样式库时使用 `className`。"
        }
      ]
    }
  ]
};
