// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for use-a-theme-in-an-app.doc.mjs.
export const docsZh = {
  "title": "使用并扩展主题",
  "description": "应用安装集成，并像使用任何主题一样应用或扩展你的主题。",
  "sections": [
    {
      "section": "Apply the theme",
      "title": "应用主题",
      "content": [
        {
          "type": "prose",
          "text": "安装集成，然后用其 slug 和包名运行 `theme add`。该命令会记录包的所有者，并重新生成一个应用主题模块，该模块导入构建后的主题、生产 CSS 和可选字体 CSS。仅在需要把源码复制到独立的本地分叉时才使用 `theme eject`。"
        },
        null,
        null,
        {
          "type": "prose",
          "text": "`theme list` 显示可用、已添加和默认的主题。使用 `theme use <slug>` 更改默认主题，使用 `theme remove <slug>` 停止导入某个主题，仅在应用需要独立的源码分叉时才使用 `theme eject <slug>`。应用主题——`mode`、SSR 和生产构建——对每个主题都相同；参见 {@link generic:use-a-theme}。"
        }
      ]
    },
    {
      "section": "Extend to customize",
      "title": "通过扩展进行自定义",
      "content": [
        {
          "type": "prose",
          "text": "对于常规自定义，不要复制包的源码。导入构建后的主题，并用 `defineTheme({extends: importedTheme, ...})` 派生一个新主题，只覆盖应用需要更改的令牌。仅在应用必须拥有独立的源码分叉时才使用 `theme eject`。参见 {@link generic:define-the-theme}。"
        },
        null
      ]
    },
    {
      "section": "In global mode",
      "title": "全局模式",
      "content": [
        {
          "type": "prose",
          "text": "全局模式：在每个使用该主题的应用中安装主题包；在项目内部，CLI 会忽略为电脑安装的包。参见 {@link namespace:global} 和 {@link generic:global-integrations}。"
        }
      ]
    }
  ]
};
